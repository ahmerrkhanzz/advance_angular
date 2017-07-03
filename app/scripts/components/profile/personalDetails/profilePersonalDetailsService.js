(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.profilePersonalDetailsService = function (
        $resource,
        $q,
        $log,
        constants
    ) {
        var service = {};

        /**
         * Get user update API endpoint.
         *
         * @returns {$resource}
         */
        service.getUpdateModel = function () {
             return $resource(constants.api.usersPermissions.url + '/v1/user-profile', null, {
                update: { method:'PATCH' }
            });
        };

        /**
         * Update user Details | Password.
         *
         * @param {Object} user
         * @returns {Promise}
         */
        service.update = function(user) {
            var UpdateModel = service.getUpdateModel(),
                dataToUpdate = {
                    title: user.title,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    position: user.position
                };
                if (user.isClient) {
                    dataToUpdate.phone = user.phone;
                }

            return UpdateModel.update(dataToUpdate).$promise.then(function (data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return data.user;
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return false;
            });
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('ProfilePersonalDetailsService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            App.services.profilePersonalDetailsService
        ]);

}(window.angular));
