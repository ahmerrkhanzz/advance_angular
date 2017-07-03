(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.ProfileLogo = function (
        $resource,
        $q,
        $log,
        constants
    ) {
        var service = {};

        service.getUrl = function () {
            return constants.api.usersPermissions.url + '/v1/user-profile-logo';
        };

        /**
         * Get user update API endpoint.
         *
         * @returns {$resource}
         */
        service.getUpdateModel = function () {
             return $resource(service.getUrl(), null, {
                update: { method:'PATCH' }
            });
        };

        /**
         * Update user.
         *
         * @param {String} logoUrl
         * @returns {Promise}
         */
        service.updateProfilePicture = function (logoUrl) {
            var UpdateModel = service.getUpdateModel();
            return UpdateModel.update({
                userImage: logoUrl
            }).$promise.then(function (data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return {
                    status: data.$resolved,
                    url: data.url
                };
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
        .service('ProfileLogoService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            App.services.ProfileLogo
        ]);

}(window.angular));
