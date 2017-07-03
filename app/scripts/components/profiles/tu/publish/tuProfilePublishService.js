(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.TuProfilePublishService = function (
        $resource,
        $q,
        $log,
        constants
    ) {
        var service = {
            deferred : {},
            isStatus: null,
            publishStatus: {
                failure : 'failure',
                success: 'success',
                progress: 'progress',
                pending: 'pending'
            }
        };

        /**
         * Get departments upgrade API endpoint.
         *
         * @returns {$resource}
         */
        service.getPublishModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tu-feed/publish/:id/:type');
        };

        service.getPublishStatusModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tu-feed/publish-status/:id');
        };

        service.getLogsModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tu-feed/publish-logs/:id?sorting[createdAt]=desc&fieldName=type,status,createdAt,createdByFullName');
        };

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
            var tuUrl = constants.drupal.tu.url,
                masterNid = service.getNodeId(institutionData, 'master'),
                ugNid = service.getNodeId(institutionData, 'ug'),
                pgNid = service.getNodeId(institutionData, 'pg'),
                status = service.getNodeId(institutionData, 'status'),
                institutionCoreId = institutionData.coreId,
                sections = [
                {
                    type: 'master',
                    name: 'Overview',
                    url: tuUrl + '/node/' + masterNid,
                    feedPreviewUrl: constants.api.institutions.url + '/v1/tu-feed/core-id/' + institutionCoreId + '/master',
                    viewDisabled: !masterNid
                },
                {
                    type: 'ug',
                    name: 'Undergraduate',
                    url: tuUrl + '/node/' + ugNid,
                    feedPreviewUrl: constants.api.institutions.url + '/v1/tu-feed/core-id/' + institutionCoreId + '/ug',
                    viewDisabled: !ugNid
                },
                {
                    type: 'pg',
                    name: 'Postgraduate',
                    url: tuUrl + '/node/' + pgNid,
                    feedPreviewUrl: constants.api.institutions.url + '/v1/tu-feed/core-id/' + institutionCoreId + '/pg',
                    viewDisabled: !pgNid
                }
            ];
            if (qsUser) {
                sections.push({
                    type: 'stars',
                    name: 'QS Stars',
                    publishDisabled: false,
                    viewDisabled: !masterNid,
                    url: tuUrl + '/node/' + masterNid
                });
            }

            return sections;
        };

        /**
         *
         * @param {String} institutionId
         * @param {String} profileType
         * @returns {Promise.*}
         */
        service.publish = function (institutionId, profileType) {
            if (!institutionId || !profileType) {
                var deferred = $q.defer();
                deferred.resolve(false);
                return deferred.promise;
            }

            return service.getPublishModel().get(
                {
                    id: institutionId,
                    type: profileType
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

        service.convertErrorMessage = function (errorMessage, isClient) {
            if (!isClient) {
                return errorMessage;
            }
            if (
                errorMessage.indexOf('Could not resolve host') !== -1 ||
                errorMessage.indexOf('Gateway Time-out') !== -1 ||
                errorMessage.indexOf('Connection timed out') !== -1
            ) {
                return 'Unable to publish to Topuniversities.com due to technical reasons. Please try again later.';
            }
            switch (errorMessage) {
                case '':
                case null:
                    return null;
                case 'Missing basic overview':
                case 'Missing advanced overview':
                    return 'Missing overview';
                default:
                    return 'Please contact tuonlinesupport@qs.com';
            }
        };
        /**
         * Get publish status mapping
         *
         * @param {string} status
         * @returns {string}
         */
        service.getPublishStatusMapped = function (status) {
            switch (status) {
                case service.publishStatus.failure:
                    return 'Failed';
                case service.publishStatus.progress:
                    return 'Progress';
                case service.publishStatus.pending:
                    return 'Pending';
                default:
                    return 'Published';
            }
        };

        service.setStatus = function (status) {
            service.isStatus = status;
        };
        service.getStatus = function() {
            return service.isStatus;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('TuProfilePublishService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            App.services.TuProfilePublishService
        ]);

}(window.angular));
