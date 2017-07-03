(function(angular, moment) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.institutionsSubscriptions = function (
        $resource,
        $log,
        constants
    ) {
        var service = {};

        service.getModel = function () {
            return $resource(constants.api.institutions.url + '/v1/subscription-history/:id?field[]=startDate&field[]=endDate&field[]=createdByFullName&sorting[createdAt]=desc', null, {
                update: {method: 'PATCH'}
            });
        };

        service.getDowngradeAllowedModel = function () {
            return $resource(constants.api.institutions.url + '/v1/institution/core-id/:id/allow-downgrade');
        };

        service.filterByDate = function (subscritpions) {
            var filtered = [];

            angular.forEach(subscritpions, function(subscritpion) {
                if (subscritpion.startDate && subscritpion.endDate) {
                    filtered.push(subscritpion);
                }
            });

            return filtered;
        };

        service.getLog = function (institutionId, type) {
            if (!institutionId || !type) {
                throw 'Missing Required';
            }
            if (constants.dev) {
                var startTime = new Date().getTime(), endTime;
            }

            return service.getModel().get({
                id: institutionId,
                'filter[type]' : '=' + type
            }).$promise.then(function (data) {
                if (constants.dev) {
                    endTime = new Date().getTime();
                    $log.log('success, got data: ', data, 'in ' + (endTime - startTime) + ' ms');
                }
                return data.results;
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                } else {
                    return [];
                }
            }).then(service.filterByDate);
        };

        /**
         * Checks if TU/TM downgrade is allowed for institution core id
         *
         * @param institutionId
         * @returns {*}
         */
        service.isDowngradeAllowed = function (institutionId) {
            if (!institutionId) {
                throw 'Missing Required';
            }
            if (constants.dev) {
                var startTime = new Date().getTime(), endTime;
            }

            return service.getDowngradeAllowedModel().get({
                id: institutionId
            }).$promise.then(function (data) {
                if (constants.dev) {
                    endTime = new Date().getTime();
                    $log.log('success, got data: ', data, 'in ' + (endTime - startTime) + ' ms');
                }

                return data;
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                } else {
                    return [];
                }
            });
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('InstitutionsSubscriptionsService', [
            '$resource',
            '$log',
            'constants',
            App.services.institutionsSubscriptions
        ]);

}(window.angular, window.moment));
