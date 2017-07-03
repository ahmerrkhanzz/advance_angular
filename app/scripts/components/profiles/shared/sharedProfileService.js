(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.SharedProfileService = function ($resource, $q, $log, constants) {
        var service = {
            generalHistory: null,
            deferred : {
                getGeneralHistory: null
            }
        };

        /**
         * Get shared profile model instance when Core ID is used.
         *
         * @returns {$resource}
         */
        service.getSharedProfilesCoreModel = function () {
            return $resource(constants.api.institutions.url + '/v1/shared-profile/core-id/:id');
        };

        /**
         * Get shared profile history model instance.
         * 
         * @returns {$resource}
         */
        service.getSharedProfilesHistoryModel = function () {
            return $resource(constants.api.institutions.url + '/v1/list/shared-profile-history?sorting[modifiedAt]=desc&count=10&filter[recordId]=:recordId');
        };

        /**
         * Get shared profile model instance.
         *
         * @returns {$resource}
         */
        service.getSharedProfilesModel = function () {
            return $resource(constants.api.institutions.url + '/v1/shared-profile/:id', null, {
                update: { method:'PATCH' }
            });
        };

        /**
         * Get shared profile data.
         *
         * @param {int} coreId
         * @returns {Promise}
         */
        service.getSharedProfile = function (coreId) {
            if (!coreId) {
                throw 'Missing Required';
            }

            var SharedProfilesModel = service.getSharedProfilesCoreModel();
            return SharedProfilesModel.get({id: coreId}).$promise.then(function (data) {
                    if (constants.dev) {
                        $log.log('success, got data: ', data);
                    }
                    return data.toJSON();
                }, function (error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                    }
                    return [];
                }
            );
        };

        /**
         * Get shared profile history log.
         * 
         * @param {string} recordId
         * @param {boolean} noCache
         * @param {int} limit
         * @returns {Promise}
         */
        service.getGeneralHistory = function (recordId, noCache, limit) {
            if (!recordId) {
                return false;
            }
            noCache = noCache || false;
            // process already running
            if (!service.deferred.getGeneralHistory) {
                service.deferred.getGeneralHistory = $q.defer();
            } else {
                return service.deferred.getGeneralHistory.promise;
            }
            var deferred = service.deferred.getGeneralHistory;

            if (!noCache && service.generalHistory) {
                deferred.resolve(service.generalHistory);
            } else {
                var SharedProfilesHistoryModel = service.getSharedProfilesHistoryModel();
                SharedProfilesHistoryModel.get(
                    {
                        recordId: recordId,
                        limit: limit
                    },
                    function (data) {
                        if (constants.dev) {
                            $log.log('success, got data: ', data);
                        }
                        service.generalHistory = data;
                        deferred.resolve(service.generalHistory);
                        service.deferred.getGeneralHistory = null;
                    }, function (error) {
                        //@todo log error
                        if (constants.dev) {
                            $log.log('request failed' + error);
                        }
                        service.generalHistory = [];
                        deferred.resolve(service.generalHistory);
                        service.deferred.getGeneralHistory = null;
                    }
                );
            }

            return deferred.promise;
        };

        /**
         * Submit shared profile general data.
         *
         * @param {Object} profileData
         * @returns {Promise}
         */
        service.saveGeneral = function (profileData) {
            var SharedProfilesModel = service.getSharedProfilesModel(),
                dataToUpdate = {
                    foundationYear:null,
                    fullName: null,
                    smallLogo: {
                        "path": null,
                        "title": null,
                        "description": null
                    },
                    mediumLogo: {
                        "path": null,
                        "title": null,
                        "description": null
                    },
                    largeLogo: {
                        "path": null,
                        "title": null,
                        "description": null
                    }
                };

            return SharedProfilesModel.update(
                {id: profileData.id},
                service.filterObject(dataToUpdate, profileData)
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

        service.update = function (sharedProfileId, dataToUpdate) {
            var UpdateModel = service.getSharedProfilesModel();
            return UpdateModel.update(
                {id: sharedProfileId},
                dataToUpdate
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
         * Fill one object keys with other object values.
         *
         * @param {Object} filters
         * @param {Object} object
         * @returns {Object}
         */
        service.filterObject = function (filters, object) {
            var filteredObject = {};
            if (filters && object && typeof filters === 'object' && typeof object === 'object') {
                filteredObject = angular.copy(filters);
                angular.forEach(filters, function (value, key) {
                    if (value && typeof value === 'object' && object[key]) {
                        angular.forEach(value, function (subValue, subKey) {
                            if (subValue === null && object[key][subKey]) {
                                filteredObject[key][subKey] = object[key][subKey];
                            }
                        });
                    } else if (value === null && object[key]) {
                        filteredObject[key] = object[key];
                    }
                });
            }

            return filteredObject;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('SharedProfileService', ['$resource', '$q', '$log', 'constants', App.services.SharedProfileService]);

}(window.angular));
