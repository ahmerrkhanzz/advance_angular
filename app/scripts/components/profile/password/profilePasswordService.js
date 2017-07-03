(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.ProfilePasswordService = function (
        $resource,
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
         * @param {String} password
         * @returns {Promise}
         */
        service.update = function(password) {
            var UpdateModel = service.getUpdateModel(),
                dataToUpdate = {
                    password : password
                };

            return UpdateModel.update(dataToUpdate).$promise.then(function (data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return true;
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
        .service('ProfilePasswordService', [
            '$resource',
            '$log',
            'constants',
            App.services.ProfilePasswordService
        ]);

}(window.angular));
