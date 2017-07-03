(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.contactsList = function (
        $scope,
        constants,
        ContactsService,
        InstitutionsUsersFactory,
        InstitutionFactory,
        WatchService
    ) {
        var controller = this;
        controller.devMode = constants.dev;

        controller.getCoreIdWatch = function (coreId) {
            if (coreId) {
                ContactsService.getDepartmentsCoreIds(coreId).then(function (departmentsCoreIds) {
                    departmentsCoreIds.push(coreId);
                    InstitutionsUsersFactory.setRequestFilters({
                        'filter[primaryInstitutionCoreId][]': departmentsCoreIds
                    });
                });
            }
        };

        controller.initWatches = function () {
            // listen to active institution changes
            WatchService.create($scope, InstitutionFactory.getCoreId, controller.getCoreIdWatch);
        };

        /**
         * Class constructor.
         */
        controller.$onInit = function () {
            controller.initWatches();
        };
    };

    angular
        .module('qsHub')
        .controller('ContactsListController', [
            '$scope',
            'constants',
            'ContactsService',
            'InstitutionsUsersFactory',
            'InstitutionFactory',
            'WatchService',
            App.controllers.contactsList
        ]);

}(window.angular));
