(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.TuProfileResubscribeService = function (
        $resource,
        $log,
        constants
    ) {
        var service = {
            deferred : {}
        };

        /**
         * Get resubscribe API endpoint.
         *
         * @returns {$resource}
         */
        service.getResubscribeModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tu-profile/:id/resubscribe-request');
        };

        /**
         * Send resubscribe email.
         *
         * @param {String} profileId
         * @param {String} comments
         * @param {String} fromName
         * @param {String} fromEmail
         * @returns {Promise}
         */
        service.create = function(profileId, comments, fromName, fromEmail) {
            comments = (typeof comments === 'undefined') ? '' : comments;
            fromName = (typeof fromName === 'undefined') ? '' : fromName;
            fromEmail = (typeof fromEmail === 'undefined') ? '' : fromEmail;
            return service.getResubscribeModel().save(
                {id: profileId},
                {
                    comments: comments,
                    name: fromName,
                    email: fromEmail
                }
            ).$promise.then(function (data) {
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
        .service('TuProfileResubscribeService', [
            '$resource',
            '$log',
            'constants',
            App.services.TuProfileResubscribeService
        ]);

}(window.angular));
