(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.InstitutionsUsersListInstitutionsService = function (
        $resource,
        $q,
        $log,
        constants,
        RequestsQueueService
    ) {
        var service = {
            institutionsNames : []
        };

        /**
         * Institutions full names by core id(s) endpoint.
         *
         * @returns {$resource.*}
         */
        service.getInstitutionNamesByCoreIdsModel = function () {
            return $resource(
                constants.api.institutions.url + '/v1/list/all/parent-name?sorting[coreId]=asc',
                null,
                {
                    get: {
                        cancellable: true
                    }
                }
            );
        };

        service.getInstitutionsGroupsModel = function () {
            return $resource(
                constants.api.institutions.url + '/v1/list/all?filter[coreId]=:id',
                {
                    'limit': 1,
                    'columns[]' : 'groupMembers'
                },
                {
                    get: {
                        cancellable: true
                    }
                }
            );
        };



        /**
         * Institutions search by full name endpoint.
         *
         * @returns {$resource.*}
         */
        service.getInstitutionsSearchModel = function () {
            return $resource(
                constants.api.institutions.url + '/v1/list/all/parent-name',
                {
                    'sorting[coreId]' : 'asc',
                    'field[]': [
                        'name',
                        'coreId'
                    ]
                },
                {
                    get: {
                        cancellable: true
                    }
                }
            );
        };

        /**
         * User update endpoint.
         *
         * @returns {$resource.*}
         */
        service.getUserModel = function () {
            return $resource(constants.api.usersPermissions.url + '/v1/user/:id', null, {
                update: {method:'PATCH', cancellable: true}
            });
        };

        /**
         * Search for institution by full name field.
         *
         * @param {String} searchPhrase
         * @param {Number} primaryInstitutionCoreId
         * @param {Array} assignedInstitutionsCoreIds
         * @returns {Promise.Array}
         */
        service.searchInstitutions = function (searchPhrase, primaryInstitutionCoreId, assignedInstitutionsCoreIds)
        {
            var deferred = $q.defer(),
                institutions = [];

            if (!primaryInstitutionCoreId) {
                primaryInstitutionCoreId = 0;
            }

            if (!searchPhrase || searchPhrase.length < 1) {
                deferred.resolve(institutions);
            } else {
                if (constants.dev) {
                    var startTime = new Date().getTime(), endTime;
                }
                var queryString = {
                    'filter[name]' : searchPhrase,
                    'exclude[coreIdAsString][]' : [
                        primaryInstitutionCoreId
                    ]
                };
                if (assignedInstitutionsCoreIds.length) {
                    angular.forEach(assignedInstitutionsCoreIds, function (value) {
                        if (value.coreId) {
                            queryString['exclude[coreIdAsString][]'].push(value.coreId);
                        }
                    });
                }

                // cancel currently running requests
                RequestsQueueService.cancelAll('searchInstitutions');

                var Api = service.getInstitutionsSearchModel().get(queryString);

                // add new request to the queue
                RequestsQueueService.add(Api, 'searchInstitutions');

                Api.$promise.then(function (response) {
                    if (constants.dev) {
                        endTime = new Date().getTime();
                        $log.log('success, got data: ', response, 'in ' + (endTime - startTime) + ' ms');
                    }

                    // cancel currently running requests
                    RequestsQueueService.cancelAll('searchInstitutions');

                    deferred.resolve(response.results);
                }, function (error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                    }

                    deferred.resolve([]);
                });
            }

            return deferred.promise;
        };

        service.getObjectColumn = function (dataObject, column) {
            var filteredData = [];
            angular.forEach(dataObject, function (data) {
                if (data[column]) {
                    filteredData.push(data[column]);
                }

            });
            return filteredData;
        };

        service.hasChanges = function (sourceOne, sourceTwo, assigned) {
            var assignedIds = service.getObjectColumn(
                assigned,
                'coreId'
            );
            sourceOne = sourceOne.sort();
            sourceTwo = sourceTwo.sort();
            assignedIds = assignedIds.sort();

            if (!angular.equals(sourceOne, sourceTwo)) {
                return true;
            }
            if (!angular.equals(sourceTwo, assignedIds)) {
                return true;
            }
            return false;
        };

        /**
         * Save user institutions.
         *
         * @param {Integer} userId
         * @param {Array} institutionsData
         * @param {object} primaryInstitutionData
         * @returns {Promise.boolean}
         */
        service.saveInstitutions = function (userId, institutionsData, primaryInstitutionData, institutionsGroups)
        {
            var deferred = $q.defer(),
                institutions = [];

            if (!userId || !institutionsData || !primaryInstitutionData) {
                deferred.resolve(false);
            } else {
                if (constants.dev) {
                    var startTime = new Date().getTime(), endTime;
                }

                if (institutionsData.length) {
                    institutions = service.getObjectColumn(institutionsData, 'coreId');
                }

                // cancel currently running requests
                RequestsQueueService.cancelAll('saveInstitutions');

                var Api = service.getUserModel().update({
                    id : userId
                }, {
                    institutions : institutions,
                    primaryInstitutionCoreId : primaryInstitutionData.primaryInstitutionCoreId,
                    primaryInstitutionCoreIdAsString : primaryInstitutionData.primaryInstitutionCoreIdAsString,
                    primaryInstitutionName : primaryInstitutionData.primaryInstitutionName,
                    institutionsGroups: institutionsGroups
                });

                // add new request to the queue
                RequestsQueueService.add(Api, 'saveInstitutions');

                Api.$promise.then(function (response) {
                    if (constants.dev) {
                        endTime = new Date().getTime();
                        $log.log('success, got data: ', response, 'in ' + (endTime - startTime) + ' ms');
                    }

                    // cancel currently running requests
                    RequestsQueueService.cancelAll('saveInstitutions');

                    deferred.resolve(response.modifiedCount === 1);
                }, function (error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                    }

                    deferred.resolve(false);
                });
            }

            return deferred.promise;
        };

        service.getInstitutionsGroups = function (institutionCoreId) {
            if (!institutionCoreId) {
                throw 'Missing Required';
            }

            var Api = service.getInstitutionsGroupsModel();
            return Api.get({ id: institutionCoreId }).$promise.then(function (data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return (data && data.results && data.results[0] && data.results[0].groupMembers) ?
                    data.results[0].groupMembers : [];
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return false;
            });
        };

        /**
         * Get institutions names by their core ids.
         *
         * @param {Array} coreIds
         * @returns {Promise.Array}
         */
        service.getInstitutionNames = function (coreIds) {
            var deferred = $q.defer(),
                names = [];

            // check if core ids are provided
            if (!coreIds || !coreIds.length) {
                deferred.resolve(names);
            } else {
                var cacheKey = coreIds.join(':');
                // check if in cache
                if (typeof service.institutionsNames[cacheKey] !== 'undefined') {
                    if (constants.dev) {
                        $log.log('serving from cache');
                    }
                    deferred.resolve(service.institutionsNames[cacheKey]);
                } else {
                    if (constants.dev) {
                        var startTime = new Date().getTime(), endTime;
                    }
                    // cancel currently running requests
                    RequestsQueueService.cancelAll('getInstitutionNames');

                    var Api = service.getInstitutionNamesByCoreIdsModel().get(
                        {
                            'filter[coreId][]': coreIds,
                            'field[]': ['coreId', 'name']
                        }
                    );

                    // add new request to the queue
                    RequestsQueueService.add(Api, 'getInstitutionNames');

                    Api.$promise.then(function (response) {
                        if (constants.dev) {
                            endTime = new Date().getTime();
                            $log.log('success, got data: ', response, 'in ' + (endTime - startTime) + ' ms');
                        }

                        // cancel currently running requests
                        RequestsQueueService.cancelAll('getInstitutionNames');

                        service.institutionsNames[cacheKey] = response.results;
                        deferred.resolve(response.results);
                    }, function (error) {
                        //@todo log error
                        if (constants.dev) {
                            $log.log('request failed' + error);
                        }

                        deferred.resolve(names);
                    });
                }
            }

            return deferred.promise;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('InstitutionsUsersListInstitutionsService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            'RequestsQueueService',
            App.services.InstitutionsUsersListInstitutionsService
        ]);

}(window.angular));
