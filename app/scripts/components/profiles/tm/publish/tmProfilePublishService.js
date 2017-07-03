(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { services: {} });

    App.services.TmProfilePublishService = function (
        $resource,
        $q,
        $log,
        constants,
        InstitutionService
    ) {
        var service = {
            deferred: {},
            isStatus: null
        };

        /**
         * Get publish TM publish API endpoint.
         *
         * @returns {$resource}
         */
        service.getPublishModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tm-feed/publish/:id/include-basic/:basic/include-advanced/:advanced');
        };

        /**
         * Get publish status TM API endpoint.
         *
         * @returns {$resource}
         */
        service.getPublishStatusModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tm-feed/publish-status/:id');
        };

        /**
         * Get publish logs TM API endpoint.
         *
         * @returns {$resource}
         */
        service.getLogsModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tm-feed/publish-logs/:id?sorting[createdAt]=desc&fieldName=type,status,createdAt,createdByFullName');
        };

        /**
         * Gets the node id for the current institution
         *
         * @param {object} institutionData
         * @param {string} nodeType
         * @returns {unresolved}
         */
        service.getNodeId = function (institutionData, nodeType) {
            return institutionData &&
                institutionData.nids &&
                institutionData.nids[nodeType] ? institutionData.nids[nodeType] : null;
        };

        /**
         *
         * @param {bool} qsUser
         * @param {Object} institutionData
         * @returns {Array}
         */
        service.getSections = function (qsUser, institutionData) {
            qsUser = qsUser || false;
            var tmUrl = constants.drupal.tm.url,
                nodeId = service.getNodeId(institutionData, 'tm'),
                institutionCoreId = institutionData.coreId,
                sections = [
                    {
                        type: institutionData.typeId !== constants.typeId.advancedProgramId ? 'tm' : 'advanced-program-profile',
                        name: 'MBA',
                        url: tmUrl + '/node/' + nodeId,
                        feedPreviewUrl: constants.api.institutions.url + '/v1/tm-feed/core-id/' + institutionCoreId,
                        viewDisabled: !InstitutionService.isTmViewingEnabled(institutionData),
                        publishProgramsBasic: true,
                        publishProgramsAdvanced: false
                    }
                ];
            return sections;
        };

        /**
         *
         * @param {String} institutionId
         * @param publishBasicPrograms
         * @param publishAdvancedPrograms
         * @returns {Promise.*}
         */
        service.publish = function (institutionId, publishBasicPrograms, publishAdvancedPrograms) {
            if (!institutionId || !publishBasicPrograms || !publishAdvancedPrograms) {
                var deferred = $q.defer();
                deferred.resolve(false);
                return deferred.promise;
            }

            return service.getPublishModel().get(
                {
                    id: institutionId,
                    basic: publishBasicPrograms,
                    advanced: publishAdvancedPrograms
                }
            ).$promise.then(function (data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return data.toJSON();
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return false;
            });
        };

        /**
         * Get publish logs.
         *
         * @param {String} institutionId
         * @returns {Promise.*}
         */
        service.getPublishLogs = function (institutionId) {
            if (!institutionId) {
                var deferred = $q.defer();
                deferred.resolve(false);
                return deferred.promise;
            }

            return service.getLogsModel().get({
                id: institutionId
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
                return false;
            });
        };

        service.getPublishStatus = function (institutionId) {
            return service.getPublishStatusModel().get(
                {
                    id: institutionId
                }
            ).$promise.then(function (data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return data;
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return false;
            });
        };

        service.setStatus = function (statusValue) {
            service.isStatus = statusValue;
        };
        
        service.getStatus = function() {
            return service.isStatus;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('TmProfilePublishService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            'InstitutionService',
            App.services.TmProfilePublishService
        ]);

} (window.angular));
