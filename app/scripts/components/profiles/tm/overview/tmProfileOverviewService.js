(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.TmProfileOverviewService = function ($resource, $q, $log, constants) {
        var service = {
            overviewData : null,
            institutionData: null,
            historyLog : null,
            historyLogFieldNames: null,
            profileId: null,
            deferred : {
                getHistoryLog: null
            },
            maxFaqItems: 5
        };

        /**
         * Get institution profile API endpoint.
         *
         * @returns {$resource}
         */
        service.getTmModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tm-profile/:id', null, {
                update: { method:'PATCH' }
            });
        };

        /**
         * Save TU profile data.
         *
         * @param {string} profileId
         * @param {Object} overviewData
         * @returns {Promise}
         */
        service.saveOverviewData = function(profileId, overviewData) {
            var TmModel = service.getTmModel();
            return TmModel.update(
                {id: profileId},
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
            return $resource(constants.api.institutions.url + '/v1/list/tm-overview-history?sorting[modifiedAt]=desc&count=10&');
         };

        service.getActiveTabs = function () {
            return service.activeTabs;
        };

        service.getProfileId = function () {
            return service.profileId;
        };

        service.getLogs = function (profileId, fields, limit) {
            if (!profileId) {
                return false;
            }
            limit = limit || 1;
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
                        'filter[recordId]': profileId,
                        'field[]': fields,
                        'limit': limit
                    },
                    function (data) {
                        if (constants.dev) {
                            $log.log('success, got data: ', data);
                        }
                        service.historyLog = data;
                        service.profileId = profileId;

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

        service.getOverviewHistoryLogs = function (profileId, isAdvanced, limit) {
            if (!profileId || typeof isAdvanced === 'undefined') {
                return false;
            }
            var fields = [
                'websiteUrl',
                'requestInfoEmail',
                'websiteUrl',
                'advanced'
            ];
            if (isAdvanced) {
                fields.push('advancedOverview');
            } else {
                fields.push('basicOverview');
            }

            return service.getLogs(profileId, fields, limit);
        };

        service.getFaqHistoryLogs = function (profileId, limit) {
            if (!profileId) {
                return false;
            }

            return service.getLogs(profileId, ['faq'], limit);
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('TmProfileOverviewService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            App.services.TmProfileOverviewService
        ]);

}(window.angular));
