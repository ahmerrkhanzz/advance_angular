(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services: {}});

    App.services.MasterPassword = function (
        $resource,
        $log,
        constants
    ) {
        var service = {};

        service.getMasterPasswordModel = function () {
            return $resource(constants.api.usersPermissions.url + '/v1/master-password');
        };

        service.getTime = function () {
            return new Date().getTime();
        };

        service.get = function () {
            return service.getMasterPasswordModel().get({
                'limit': 1
            }).$promise.then(function (data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return data;
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return [];
            });
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('MasterPasswordService', [
            '$resource',
            '$log',
            'constants',
            App.services.MasterPassword
        ]);

}(window.angular));
