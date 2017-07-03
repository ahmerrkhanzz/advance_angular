(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.InstitutionSwitchService = function ($resource, $q, $log, constants) {
        var service = {};

        /**
         * Get institution search API endpoint.
         *
         * @returns $resource
         */
        service.getInstitutionSearchModel = function () {
            return $resource(
                constants.api.institutions.url + '/v1/list/search/:searchPhrase?sorting[coreId]=asc',
                null,
                {
                    get: {
                        cancellable: true
                    }
                }
            );
        };

        service.getClientInstitutionsModel = function () {
            return $resource(constants.api.institutions.url + '/v1/list/allowed', null, {
                get: {
                    cancellable: true
                }
            });
        };

        /**
         * Search for institution.
         *
         * @param {String} searchPhrase
         * @returns {Promise.array}
         */
        service.searchInstitutions = function (searchPhrase) {
            var deferred = $q.defer();

            if (!searchPhrase || searchPhrase.length < 1) {
                deferred.resolve([]);
            } else {
                var InstitutionsSearchModel = service.getInstitutionSearchModel();
                InstitutionsSearchModel.get(
                    {searchPhrase: searchPhrase},
                    function (data) {
                        if (constants.dev) {
                            $log.log('success, got data: ', data);
                        }
                        deferred.resolve(data.results);
                        deferred = null;
                    },
                    function (error) {
                        //@todo log error
                        if (constants.dev) {
                            $log.log('request failed' + error);
                        }
                        deferred.resolve([]);
                        deferred = null;
                    }
                );
            }

            return deferred.promise;
        };

        /**
         * Get client user institutions.
         *
         * @returns {Promise}
         */
        service.getClientInstitutions = function () {
            var ClientInstitutionsModel = service.getClientInstitutionsModel();
            return ClientInstitutionsModel.get().$promise.then(
                function (data) {
                    if (constants.dev) {
                        $log.log('success, got data: ', data);
                    }
                    return data.results;
                },
                function (error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                    }
                    return [];
                }
            );
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('InstitutionSwitchService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            App.services.InstitutionSwitchService
        ]);
}(window.angular));
