(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.Contacts = function (
        $log,
        constants,
        RequestsQueueService,
        InstitutionsListService
    ) {
        var service = {};

        /**
         * Get institution departments core IDs.
         *
         * @param {int} parentInstitutionCoreId
         * @returns {Promise.<Array>}
         */
        service.getDepartmentsCoreIds = function (parentInstitutionCoreId) {
            if (constants.dev) {
                var startTime = new Date().getTime(), endTime;
            }

            // cancel currently running requests
            RequestsQueueService.cancelAll('getDepartmentsCoreIds');

            var Api = InstitutionsListService.getInstitutionListModel().get({
                'filter[parentCoreId]': '=' + parentInstitutionCoreId,
                'filter[typeId][]': [constants.typeId.clientDepartmentId, constants.typeId.advancedProgramId],
                'columns[]': 'coreId'
            });

            // add new request to the queue
            RequestsQueueService.add(Api, 'getDepartmentsCoreIds');

            return Api.$promise.then(function (data) {
                if (constants.dev) {
                    endTime = new Date().getTime();
                    $log.log('success, got data: ', data, 'in ' + (endTime - startTime) + ' ms');
                }

                // cancel currently running requests
                RequestsQueueService.cancelAll('getDepartmentsCoreIds');
                return service.formatList(data.results);
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                } else {
                    return [];
                }
            });
        };

        service.formatList = function (list) {
            var formattedList = [];
            angular.forEach(list, function (value) {
                if (value && value.coreId) {
                    formattedList.push(value.coreId);
                }
            });
            return formattedList;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('ContactsService', [
            '$log',
            'constants',
            'RequestsQueueService',
            'InstitutionsListService',
            App.services.Contacts
        ]);

}(window.angular));
