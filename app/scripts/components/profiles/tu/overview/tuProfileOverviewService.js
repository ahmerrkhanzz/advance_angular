(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { services: {} });

    App.services.TuProfileOverviewService = function ($resource, $q, $log, constants) {
        var service = {
            overviewData: null,
            institutionData: null,
            historyLog: null,
            historyLogFieldNames: null,
            profileId: null,
            activeTabs: {
                master: 0,
                pg: 1,
                ug: 2
            },
            deferred: {
                getHistoryLog: null
            }
        };

        /**
         * Get institution profile API endpoint.
         *
         * @returns {$resource}
         */
        service.getTuModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tu-profile/:id', null, {
                update: { method: 'PATCH' }
            });
        };

        /**
         * Save TU profile data.
         *
         * @param {string} profileId
         * @param {Object} overviewData
         * @returns {Promise}
         */
        service.saveOverviewData = function (profileId, overviewData) {
            var TuModel = service.getTuModel();
            return TuModel.update(
                { id: profileId },
                overviewData
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

        /**
         * Get institution profile history logs API endpoint.
         *
         * @returns {$resource}
         */
        service.getHistoryModel = function () {
            return $resource(constants.api.institutions.url + '/v1/list/tu-overview-history?sorting[modifiedAt]=desc&count=10&');
        };

        service.getActiveTabs = function () {
            return service.activeTabs;
        };

        service.getProfileId = function () {
            return service.profileId;
        };

         /**
         * Get TU overview tab history logs.
         *
         * @param {string} recordId
         * @param {string} fieldNames  - fields names to get the history for
         * @returns {Promise}
         */
        service.getHistoryLog = function (recordId, profileType, advanced, limit) {
            if (!recordId || !profileType || typeof advanced === 'undefined') {
                return false;
            }

            var fields;

            switch (profileType) {
                case 'master':
                    fields = [
                        'masterWebsiteUrl',
                        'masterRequestInfoEmail',
                        'masterRequestInfoUrlTitle',
                        'masterRequestInfoUrl',
                        'masterWebsiteUrl',
                        'masterRequestInfoEmail',
                        'masterRequestInfoUrlTitle',
                        'masterRequestInfoUrl',
                        'advancedMasterOverview',
                        'basicMasterOverview'
                    ];
                    break;
                case 'ug':
                    fields = [
                        'ugWebsiteUrl',
                        'ugRequestInfoEmail',
                        'ugRequestInfoUrlTitle',
                        'ugRequestInfoUrl',
                        'basicUgOverview',
                        'ugWebsiteUrl',
                        'ugRequestInfoEmail',
                        'ugRequestInfoUrlTitle',
                        'ugRequestInfoUrl',
                        'advancedUgOverview',
                        'basicUgOverview'
                    ];
                    break;
                case 'pg':
                    fields = [
                        'pgWebsiteUrl',
                        'pgRequestInfoEmail',
                        'pgRequestInfoUrlTitle',
                        'pgRequestInfoUrl',
                        'pgWebsiteUrl',
                        'pgRequestInfoEmail',
                        'pgRequestInfoUrlTitle',
                        'pgRequestInfoUrl',
                        'advancedPgOverview',
                        'basicPgOverview'
                    ];
                    break;
            }
            fields.push('advanced');

            // process already running
            if (!service.deferred.getHistoryLog) {
                service.deferred.getHistoryLog = $q.defer();
            } else {
                return service.deferred.getHistoryLog.promise;
            }
            var deferred = service.deferred.getHistoryLog;

            if (service.historyLog) {
                deferred.resolve(service.historyLog);
            } else {
                var HistoryModel = service.getHistoryModel();
                HistoryModel.get(
                    {
                        'filter[recordId]': recordId,
                        'field[]': fields,
                        'filter[type]': profileType,
                        'limit': limit
                    },
                    function (data) {
                        if (constants.dev) {
                            $log.log('success, got data: ', data);
                        }
                        service.historyLog = data;
                        service.profileId = recordId;

                        deferred.resolve(service.historyLog);
                        deferred = null;
                        service.deferred.getHistoryLog = null;
                        service.historyLog = null;
                    }, function (error) {
                        //@todo log error
                        if (constants.dev) {
                            $log.log('request failed' + error);
                        }
                        service.historyLog = null;
                        deferred.resolve(service.historyLog);
                        deferred = null;
                        service.deferred.getHistoryLog = null;
                    }
                );
            }

            return deferred.promise;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('TuProfileOverviewService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            App.services.TuProfileOverviewService
        ]);

} (window.angular));
