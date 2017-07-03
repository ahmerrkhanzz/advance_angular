(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { services: {} });

    App.services.InstitutionsList = function (
        $resource,
        $q,
        $log,
        $localStorage,
        constants,
        RequestsQueueService,
        InstitutionFactory,
        InstitutionsListFactory,
        TuProfileService,
        TimeService
    ) {
        var service = {
            types: null,
            tuRegions: null,
            subscriptions: null,
            countries: null,
            tmRegions: null,
            deferred: {
                getSubscriptions: null,
                searchInstitutionsWithoutGroup: null,
                getCountries: null,
                getTypes: null,
                getInstitution: null,
                getTmRegions: null
            },
            institutionGroupsRequest: null
        };

        // @todo moveout models to standalone component/module

        service.getCampusesOrderingModel = function () {
            return $resource(constants.api.institutions.url + '/v1/institution/:id/campusesOrder', null, {
                update: { method: 'PATCH' }
            });
        };

        service.getInstitutionListModel = function () {
            return $resource(constants.api.institutions.url + '/v1/list/all', null, {
                get: {
                    isArray: false,
                    cancellable: true
                }
            });
        };

        service.getInstitutionModel = function () {
            return $resource(constants.api.institutions.url + '/v1/institution/:id', null, {
                create: { method: 'POST' },
                update: { method: 'PATCH' },
                replace: { method: 'PUT' }
            });
        };

        service.getInstitutionGroupsSaveModel = function () {
            return $resource(constants.api.institutions.url + '/v1/institution-groups/:id', null, {
                update: { method: 'PATCH' }
            });
        };

        service.getInstitutionGroupsModel = function () {
            return $resource(
                constants.api.institutions.url + '/v1/list/institution-groups/:searchPhrase?sorting[coreId]=asc',
                null,
                {
                    get: {
                        cancellable: true
                    }
                }
            );
        };

        /**
         * Returns campus model resource
         *
         * @returns {string}
         */
        service.getCampusModel = function () {
            return $resource(constants.api.institutions.url + '/v1/institution/:id/campus/:campusId', null, {
                update: { method: 'PATCH' },
                replace: { method: 'PUT' },
                create: { method: 'POST' },
                delete: { method: 'DELETE' },
            });
        };

        /**
         * Returns campuses model resource
         *
         * @returns {string}
         */
        service.getDeleteCampusesModel = function () {
            return $resource(constants.api.institutions.url + '/v1/institution/:id/delete-campus', null, {
                create: { method: 'POST' }
            });
        };

        /**
         * Get institution search API endpoint.
         *
         * @returns $resource
         */
        service.getTopLevelInstitutionSearchModel = function () {
            return $resource(
                constants.api.institutions.url + '/v1/list/search/:searchPhrase?sorting[coreId]=asc&filter[typeId]=' + constants.typeId.topLevelInstitutionId,
                null,
                {
                    get: {
                        cancellable: true
                    }
                }
            );
        };

        /**
         * Get institution departments search API endpoint.
         *
         * @returns $resource
         */
        service.getDepartmentsListModel = function () {
            return $resource(
                constants.api.institutions.url + '/v1/list/departments/core-id/:parentCoreId?filter[fieldName]=active&filter[typeId]=' + constants.typeId.clientDepartmentId,
                null,
                {
                    get: {
                        cancellable: true
                    }
                }
            );
        };

        /**
         * Search institutions model
         *
         * @returns {*}
         */
        service.getInstitutionSearchModel = function () {
            return $resource(
                constants.api.institutions.url + '/v1/list/search/:searchPhrase?sorting[coreId]=asc&filter[fieldName]=active',
                null,
                {
                    get: {
                        cancellable: true
                    }
                }
            );
        };

        service.getDepartmentModel = function () {
            return $resource(constants.api.institutions.url + '/v1/institution/:id', null, {
                create: { method: 'POST' }
            });
        };

        /**
         * Get all institutions.
         *
         * @param {object} params
         * @returns {Promise.<Array>}
         */
        service.getAll = function (filters) {
            if (constants.dev) {
                var startTime = new Date().getTime(), endTime;
            }
            var hasSorting = false;
            if (filters) {
                for (var key in filters) {
                    if (key.indexOf('sorting') !== -1) {
                        hasSorting = true;
                        break;
                    }
                }
            }
            if (!hasSorting) {
                filters['sorting[createdAt]'] = 'desc';
            }

            // cancel currently running requests
            RequestsQueueService.cancelAll('getAll');

            var Api = service.getInstitutionListModel().get(filters);

            // add new request to the queue
            RequestsQueueService.add(Api, 'getAll');

            return Api.$promise.then(function (data) {
                if (constants.dev) {
                    endTime = new Date().getTime();
                    $log.log('success, got data: ', data, 'in ' + (endTime - startTime) + ' ms');
                }

                // cancel currently running requests
                RequestsQueueService.cancelAll('getAll');

                data.results = service.formatList(data.results);
                return data;
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                } else {
                    return [];
                }
            }).then(service.appendSubscriptionsData);
        };

        /**
         * Get all institutions subscriptions.
         *
         * @param {Number} institutionCoreId
         * @returns {Promise.<Array>}
         */
        service.getAllSubscriptions = function (institutionCoreId) {
            var Api = service.getInstitutionListModel().get({
                'filter[parentCoreId]': '=' + institutionCoreId,
                'limit' :  1,
                'columns[]' : 'subscriptions'
            });
            var subscriptions;
            // add new request to the queue
            return Api.$promise.then(function (data) {
                if (data.results) {
                    subscriptions = data.results.reduce(function (all, item, index) {
                        if (item.subscriptions.hasOwnProperty('tm') && item.subscriptions.tm.endDate !== null) {
                            all[item.coreIdAsString] = item.subscriptions.tm.endDate;
                        }
                        return all;
                    }, []);
                }
                return subscriptions;
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                } else {
                    return [];
                }
            });
        };

        service.getTmSubscriptions = function (institutionCoreId) {
            var Api = service.getInstitutionListModel().get({
                'filter[coreId]': '=' + institutionCoreId,
                'limit' :  1,
                'columns[]' : 'subscriptions'
            });
            var subscriptions = [];
            // add new request to the queue
            return Api.$promise.then(function (data) {
                return data.results &&
                data.results[0] &&
                data.results[0].subscriptions &&
                data.results[0].subscriptions.tm ? data.results[0].subscriptions.tm : [];
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                } else {
                    return [];
                }
            });
        };

        service.isStatisticsSubscription = function (handle, subscriptionsList) {
            var statsType = 'statistics';
            if (subscriptionsList) {
                var total = subscriptionsList.length,
                    i = 0;
                for (i; i < total; i++) {
                    if (subscriptionsList[i].handle === handle) {
                        return subscriptionsList[i].type === statsType;
                    }
                }
            } else {
                return handle === statsType;
            }

            return false;
        };

        service.appendSubscriptionsData = function (institutionsData) {
            if (!institutionsData) {
                return institutionsData;
            }
            var subscriptionName = null;
            return service.getSubscriptions().then(function (subscriptionsList) {
                if (subscriptionsList) {
                    angular.forEach(institutionsData.results, function (institutionData) {
                        if (!institutionData.subscriptionsAsArray) {
                            institutionData.subscriptionsAsArray = [];
                        }
                        if (!institutionData.subscriptions) {
                            return false;
                        }
                        angular.forEach(institutionData.subscriptions, function (subscription, key) {
                            if (
                                !subscription.subscribed ||
                                !service.isStatisticsSubscription(key, subscriptionsList)
                            ) {
                                return false;
                            }
                            subscriptionName = service.getSubscriptionNameByHandle(key, subscriptionsList);
                            if (!subscriptionName) {
                                return false;
                            }
                            institutionData.subscriptionsAsArray.push(subscriptionName);
                            institutionData.subscriptionsAsString = institutionData.subscriptionsAsArray ?
                                institutionData.subscriptionsAsArray.join(', ') : null;
                        });
                    });
                }
                return institutionsData;
            });
        };
        service.formatSubscriptionDate = function (date) {
            var formattedDate = '';
            if (date && TimeService.isValid(date)) {
                formattedDate = TimeService.formatInUnix(date);
            }

            return formattedDate;
        };

        service.getTypeFilterData = function (grid) {
            grid = grid || false;
            var deferred = $q.defer();
            service.getTypes().then(function (types) {
                var typesFilterData = [];
                if (types) {
                    angular.forEach(types, function (data) {
                        if (grid) {
                            typesFilterData.push({
                                value: data.uniqueId,
                                label: data.name
                            });
                        } else {
                            typesFilterData.push({
                                id: data.uniqueId,
                                title: data.name
                            });
                        }
                    });
                }
                deferred.resolve(typesFilterData);
            });

            return deferred.promise;
        };

        service.getTypes = function () {
            // process already running
            if (!service.deferred.getTypes) {
                service.deferred.getTypes = $q.defer();
            } else {
                return service.deferred.getTypes.promise;
            }
            var deferred = service.deferred.getTypes;

            // check if data exists in cache
            if (service.types) {
                deferred.resolve(service.types);
            } else {
                var Api = $resource(constants.api.institutions.url + '/v1/list/types');
                Api.get(function (data) {
                    if (constants.dev) {
                        $log.log('success, got data: ', data);
                    }
                    service.types = data.results;
                    deferred.resolve(service.types);
                    deferred = null;
                }, function (error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                    }
                    service.types = [];
                    deferred.resolve(service.types);
                    deferred = null;
                });
            }

            return deferred.promise;
        };

        service.getTuRegions = function () {
            var deferred = $q.defer();
            if (service.tuRegions) {
                deferred.resolve(service.tuRegions);
            } else {
                var Api = $resource(constants.api.institutions.url + '/v1/list/tu-regions');
                Api.get(function (data) {
                    if (constants.dev) {
                        $log.log('success, got data: ', data);
                    }
                    service.tuRegions = data.results;
                    deferred.resolve(service.tuRegions);
                }, function (error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                        service.tuRegions = [];
                    }
                    deferred.resolve(service.tuRegions);
                });
            }

            return deferred.promise;
        };

        service.getTmRegions = function () {
            // process already running
            if (!service.deferred.getTmRegions) {
                service.deferred.getTmRegions = $q.defer();
            } else {
                return service.deferred.getTmRegions.promise;
            }
            var deferred = service.deferred.getTmRegions;

            if (service.tmRegions) {
                deferred.resolve(service.tmRegions);
            } else {
                var Api = $resource(constants.api.institutions.url + '/v1/list/tm-regions');
                Api.get(function (data) {
                    if (constants.dev) {
                        $log.log('success, got data: ', data);
                    }
                    service.tmRegions = data.results;
                    deferred.resolve(service.tmRegions);
                    deferred = null;
                }, function (error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                    }
                    service.tmRegions = [];
                    deferred.resolve(service.tmRegions);
                    deferred = null;
                });
            }

            return deferred.promise;
        };

        service.getTypeNameById = function (typeId) {
            var deferred = $q.defer(),
                typeName;

            service.getTypes().then(function (types) {
                angular.forEach(types, function (type) {
                    if (type.uniqueId === typeId) {
                        typeName = type.name;

                    }
                });
                deferred.resolve(typeName);
            });

            return deferred.promise;
        };

        /**
         * Format institutions list.
         *
         * @param {object} institutionsData
         * @returns {object}
         */
        service.formatList = function (institutionsData) {
            if (angular.isArray(institutionsData)) {
                angular.forEach(institutionsData, function (institutionData) {
                    service.processInstitution(institutionData);
                });
            } else {
                service.processInstitution(institutionsData);
            }

            return institutionsData;
        };

        /**
         * Format institution
         *
         * @param {object} institutionData
         * @returns {object}
         */
        service.processInstitution = function (institutionData) {
            service.getTypeNameById(institutionData.typeId).then(function (typeName) {
                institutionData.typeName = typeName;
            });
            service.getCountryNameByCode(institutionData.countryCode).then(function (countryName) {
                institutionData.countryName = countryName;
            });
            institutionData = service.processCampuses(institutionData);
            institutionData.isActive = institutionData.active ? 'Yes' : 'No';
            institutionData.enabledUg = institutionData.enabled && typeof institutionData.enabled.ug !== 'undefined' ? institutionData.enabled.ug : null;
            institutionData.enabledPg = institutionData.enabled && typeof institutionData.enabled.pg !== 'undefined' ? institutionData.enabled.pg : null;
            institutionData.enabledTm = institutionData.enabled && typeof institutionData.enabled.tm !== 'undefined' ? institutionData.enabled.tm : null;
            institutionData.tuAdvanced = !!institutionData.tuAdvanced;
            institutionData.tmAdvanced = !!institutionData.tmAdvanced;
            institutionData.hasNoDepartments = !!institutionData.hasNoDepartments;
            if (typeof institutionData.nids === 'undefined' || institutionData.nids === null) {
                institutionData.nids = {
                    ug: null,
                    pg: null,
                    master: null,
                    tm: null
                };
            }

            service.getTuRegions().then(function (list) {
                if (!institutionData.drupalTuRegionId) {
                    return false;
                }
                var validTid = false;
                angular.forEach(list, function (item) {
                    if (item.tid === institutionData.drupalTuRegionId && item.tu) {
                        validTid = true;
                    }
                });
                if (!validTid) {
                    institutionData.drupalTuRegionId = null;
                }
            });

            service.getTmRegions().then(function (list) {
                var validTid = false;
                if (!institutionData.drupalTmRegionId) {
                    return false;
                }
                angular.forEach(list, function (item) {
                    if (item.tid === institutionData.drupalTmRegionId && item.tm) {
                        validTid = true;
                    }
                });
                if (!validTid) {
                    institutionData.drupalTmRegionId = null;
                }
            });
        };

        /**
         * Format campuses
         *
         * @returns {object}
         * @param {object} institutionData
         * @param {any} campusId
         * @param {boolean} unCheckAll
         */
        service.processCampuses = function (institutionData, campusId, unCheckAll) {
            if (!angular.isDefined(campusId)) {
                campusId = null;
            }
            if (!angular.isDefined(unCheckAll)) {
                unCheckAll = false;
            }
            var primaryCount = 0;
            angular.forEach(institutionData.campus, function (campus, index) {
                service.getCountryNameByCode(campus.country).then(function (countryName) {
                    campus.countryName = countryName;
                });
                if (campusId === null) {
                    if (angular.isDefined(institutionData.campus[index].primary) && institutionData.campus[index].primary) {
                        primaryCount++;
                    } else {
                        institutionData.campus[index].primary = false;
                    }
                    if (primaryCount > 1) {
                        institutionData.campus[index].primary = false;
                        primaryCount--;
                    }
                    if (unCheckAll) {
                        institutionData.campus[index].primary = false;
                    }
                } else {
                    if (institutionData.campus[index].id === campusId) {
                        institutionData.campus[index].primary = true;
                    } else {
                        institutionData.campus[index].primary = false;
                    }
                }
                campus.primaryName = service.getCampusIsPrimary(campus);
                campus.addressLine = service.getCampusAddress(campus);
            });

            return institutionData;
        };

        /**
         *  Get subscription name by its handle.
         *
         * @param {string} handle
         * @param {object} subscriptionsList
         * @returns {string}
         */
        service.getSubscriptionNameByHandle = function (handle, subscriptionsList) {
            var subscriptionName = '';
            if (handle === 'ug') {
                return 'Undergraduate Profile';
            } else if (handle === 'pg') {
                return 'Postgraduate Profile';
            } else if (handle === 'tm') {
                return 'TopMBA Profile';
            }
            if (subscriptionsList) {
                angular.forEach(subscriptionsList, function (subscription) {
                    if (subscription.handle && subscription.name && subscription.handle === handle) {
                        subscriptionName = subscription.name;
                        return;
                    }
                });
            }
            return subscriptionName;
        };

        /**
         * Get subscriptions list.
         *
         * @returns {Promise:Object}
         */
        service.getSubscriptions = function () {
            // process already running
            if (!service.deferred.getSubscriptions) {
                service.deferred.getSubscriptions = $q.defer();
            } else {
                return service.deferred.getSubscriptions.promise;
            }
            var deferred = service.deferred.getSubscriptions;

            // check if data exists in cache
            if (service.subscriptions) {
                deferred.resolve(service.subscriptions);
            } else {
                var Api = $resource(constants.api.institutions.url + '/v1/list/subscriptions?filter[type]=statistics&sorting[name]=asc');
                Api.get(function (data) {
                    if (constants.dev) {
                        $log.log('success, got data: ', data);
                    }
                    service.subscriptions = data.results;
                    deferred.resolve(service.subscriptions);
                    deferred = null;
                }, function (error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                    }
                    service.subscriptions = [];
                    deferred.resolve(service.subscriptions);
                    deferred = null;
                });
            }

            return deferred.promise;
        };

        /**
         * Mark user as active.
         *
         * @param {string} id
         * @returns {Promise.<boolean>}
         */
        service.activate = function (id) {
            var Api = $resource(constants.api.institutions.url + '/v1/institution/:id/activate', { id: id });
            return Api.get().$promise.then(function (data) {
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
         * Mark user as inactive.
         *
         * @param {string} id
         * @returns {Promise.<boolean>}
         */
        service.deactivate = function (id) {
            var Api = $resource(constants.api.institutions.url + '/v1/institution/:id/deactivate', { id: id });
            return Api.get().$promise.then(function (data) {
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

        service.getInstitutionGroupsSaveModel = function () {
            return $resource(constants.api.institutions.url + '/v1/institution-groups/:id', null, {
                update: { method: 'PATCH' }
            });
        };

        service.getInstitutionGroupsModel = function () {
            return $resource(
                constants.api.institutions.url + '/v1/list/institution-groups/:searchPhrase?sorting[coreId]=asc',
                null,
                {
                    get: {
                        cancellable: true
                    }
                }
            );
        };

        service.filterObject = function (filters, object) {
            var filteredObject = angular.copy(filters);
            angular.forEach(filters, function (value, key) {
                if (value && typeof value === 'object') {
                    angular.forEach(value, function (subValue, subKey) {
                        if (subValue === null && object !== null && object.hasOwnProperty(key) && object[key] !== null && object[key].hasOwnProperty(subKey) && object[key][subKey] !== 'undefined') {
                            filteredObject[key][subKey] = object[key][subKey];
                        }
                    });
                } else if (value === null && object[key] !== 'undefined') {
                    filteredObject[key] = object[key];
                }
            });

            return filteredObject;
        };

        /**
         * Filter out non subscriptions related data.
         *
         * @param {Object} filters
         * @param {Object} object
         * @returns {Object}
         */
        service.filterObjectForSubscriptions = function (filters, object) {
            var filteredObject = angular.copy(filters);
            angular.forEach(filters, function (value, key) {
                if (value && typeof value === 'object') {
                    angular.forEach(value, function (subValue, subKey) {
                        if (subValue && typeof subValue === 'object') {
                            angular.forEach(subValue, function (subValue2, subKey2) {
                                if (subValue2 === null) {
                                    if (
                                        typeof object[key] !== 'undefined' &&
                                        object[key] !== null &&
                                        typeof object[key][subKey] !== 'undefined' &&
                                        object[key][subKey][subKey2] !== null
                                    ) {
                                        filteredObject[key][subKey][subKey2] = object[key][subKey][subKey2] ?
                                            object[key][subKey][subKey2] : false;
                                    } else {
                                        filteredObject[key][subKey][subKey2] = null;
                                    }
                                }
                            });
                        } else if (subValue === null && object[key] && object[key][subKey]) {
                            filteredObject[key][subKey] = object[key][subKey];
                        }
                    });
                } else if (value === null && object[key]) {
                    filteredObject[key] = object[key];
                }
            });

            return filteredObject;
        };

        service.isSimpleDepartment = function (institutionTypeId) {
            return institutionTypeId === constants.typeId.simpleDepartmentId;
        };

        service.isClientDepartment = function (institutionTypeId) {
            return institutionTypeId === constants.typeId.clientDepartmentId;
        };

        service.isTopLevelInstitution = function (institutionTypeId) {
            return institutionTypeId === constants.typeId.topLevelInstitutionId;
        };

        service.isAdvancedProgram = function (institutionTypeId) {
            return institutionTypeId === constants.typeId.advancedProgramId;
        };

        service.insertBasicDetails = function (institutionData) {
            var EndpointModel,
                dataToInsert = {};

            if (service.isClientDepartment(institutionData.typeId)) {
                EndpointModel = service.getDepartmentModel();
                dataToInsert = {
                    active: null,
                    belongsTo: null,
                    businessSchool: null,
                    countryCode: null,
                    countryName: null,
                    filemakerId: null,
                    localName: null,
                    name: null,
                    parentCoreId: null,
                    parentName: null,
                    typeId: null
                };
            } else {
                EndpointModel = service.getInstitutionModel();
                dataToInsert = {
                    active: null,
                    businessSchool: null,
                    countryCode: null,
                    countryName: null,
                    filemakerId: null,
                    hasNoDepartments: null,
                    localName: null,
                    name: null,
                    parentCoreId: null,
                    parentName: null,
                    typeId: null
                };
            }

            return EndpointModel.create(
                {},
                service.filterObject(dataToInsert, institutionData)
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

        service.saveBasicDetails = function (institutionData) {
            var InstitutionModel = service.getInstitutionModel(),
                dataToUpdate = {
                    name: null,
                    localName: null,
                    typeId: null,
                    filemakerId: null,
                    businessSchool: null,
                    hasNoDepartments: null,
                    countryCode: null
                };
            if (service.isClientDepartment(institutionData.typeId)) {
                dataToUpdate = {
                    name: null,
                    localName: null,
                    typeId: null,
                    filemakerId: null,
                    businessSchool: null,
                    hasNoDepartments: null,
                    countryCode: null,
                    belongsTo: null
                };
            }

            return InstitutionModel.update(
                { id: institutionData.id },
                service.filterObject(dataToUpdate, institutionData)
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

        service.saveDrupal = function (institutionData) {
            var InstitutionModel = service.getInstitutionModel(),
                dataToUpdate = {
                    nids: {
                        overview: null,
                        ug: null,
                        pg: null,
                        tm: null
                    },
                    drupalTmRegionId: null,
                    drupalTuRegionId: null
                };

            return InstitutionModel.update(
                { id: institutionData.id },
                service.filterObject(dataToUpdate, institutionData)
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

        service.saveSubscription = function (institutionData) {
            var InstitutionModel = service.getInstitutionModel(),
                dataToUpdate = {
                    linkedWithAdvancedPrograms: null,
                    subscriptions: {
                        tu: {
                            subscribed: null,
                            advanced: null,
                            startDate: null,
                            endDate: null
                        },
                        tm: {
                            subscribed: null,
                            advanced: null,
                            startDate: null,
                            endDate: null
                        },
                        all: {
                            subscribed: true
                        },
                        aw: {
                            subscribed: null
                        },
                        brics: {
                            subscribed: null
                        },
                        aur: {
                            subscribed: null
                        },
                        eeca: {
                            subscribed: null
                        },
                        wur: {
                            subscribed: null
                        },
                        ger: {
                            subscribed: null
                        },
                        lau: {
                            subscribed: null
                        }
                    },
                    enabled: {
                        ug: null,
                        pg: null,
                        tm: null
                    }
                };

            return InstitutionModel.update(
                { id: institutionData.id },
                service.filterObjectForSubscriptions(dataToUpdate, institutionData)
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

        service.saveInstitutionGroup = function (institutionData) {
            var deferred = $q.defer(),
                institutionGroupsSaveModel = service.getInstitutionGroupsSaveModel();
            institutionGroupsSaveModel.update(
                { id: institutionData.id },
                institutionData.groupMembers
            ).$promise.then(function (data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                deferred.resolve(true);
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                deferred.resolve(false);
            });

            return deferred.promise;
        };

        service.searchInstitutionsWithoutGroup = function (institutionId, searchPhrase) {

            if (service.deferred.searchInstitutionsWithoutGroup) {
                // cancel previous call
                service.deferred.searchInstitutionsWithoutGroup.resolve();
                if (service.institutionGroupsRequest) {
                    service.institutionGroupsRequest.$cancelRequest();
                }
            }
            service.deferred.searchInstitutionsWithoutGroup = $q.defer();

            var deferred = service.deferred.searchInstitutionsWithoutGroup,
                institutionsWithoutGroup = [];

            if (!searchPhrase || searchPhrase.length < 1) {
                deferred.resolve(institutionsWithoutGroup);
            } else {
                var InstitutionGroupsModel = service.getInstitutionGroupsModel();
                service.institutionGroupsRequest = InstitutionGroupsModel.get(
                    { searchPhrase: searchPhrase },
                    function (data) {
                        if (constants.dev) {
                            $log.log('success, got data: ', data);
                        }
                        if (data && data.results) {
                            angular.forEach(data.results, function (item) {
                                if (item.coreId !== institutionId) {
                                    institutionsWithoutGroup.push({
                                        coreId: item.coreId,
                                        name: item.name
                                    });
                                }
                            });
                        }
                        deferred.resolve(institutionsWithoutGroup);
                        deferred = null;
                        service.institutionGroupsRequest = null;
                    },
                    function (error) {
                        //@todo log error
                        if (constants.dev) {
                            $log.log('request failed' + error);
                        }
                        deferred.resolve(institutionsWithoutGroup);
                        deferred = null;
                        service.institutionGroupsRequest = null;
                    }
                );
            }

            return deferred.promise;
        };

        service.getCountryFilterData = function () {
            var deferred = $q.defer();
            service.getCountries().then(function (countries) {
                var countriesFilterData = [
                ];
                if (countries) {
                    angular.forEach(countries, function (data) {
                        countriesFilterData.push({
                            id: data.countryCode,
                            title: data.name
                        });
                    });
                }
                deferred.resolve(countriesFilterData);
            });

            return deferred.promise;
        };

        /**
         * List of countries, ordered by name, ascending
         *
         * @returns {Promise.<Array>}
         */
        service.getCountries = function () {
            // process already running
            if (!service.deferred.getCountries) {
                service.deferred.getCountries = $q.defer();
            } else {
                return service.deferred.getCountries.promise;
            }
            var deferred = service.deferred.getCountries;

            if (service.countries) {
                deferred.resolve(service.countries);
            } else {
                var Api = $resource(constants.api.institutions.url + '/v1/list/countries?sorting[name]=asc');
                Api.get(function (data) {
                    if (constants.dev) {
                        $log.log('success, got data: ', data);
                    }
                    service.countries = data.results;
                    deferred.resolve(service.countries);
                    deferred = null;
                }, function (error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                    }
                    service.countries = [];
                    deferred.resolve(service.countries);
                    deferred = null;
                });
            }

            return deferred.promise;
        };

        /**
         * Saving a campus for organisation in institutions collection
         *
         * @param {string} organisationId
         * @param {object} campus
         * @returns {boolean}
         */
        service.saveCampus = function (organisationId, campus) {
            var CampusModel = service.getCampusModel(),
                dataToUpdate = {
                    name: null,
                    addressLine1: null,
                    addressLine2: null,
                    postcode: null,
                    city: null,
                    state: null,
                    displayInFrontEnd: null,
                    country: null,
                    primary: null,
                    region: null,
                    latitude: null,
                    longitude: null,
                    autoGenerate: null,
                    primaryInPrograms: null
                };

            if (angular.isDefined(campus.id)) {
                return CampusModel.update(
                    { id: organisationId, campusId: campus.id },
                    service.filterObject(dataToUpdate, campus)
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
            } else {
                return CampusModel.create(
                    { id: organisationId },
                    service.filterObject(dataToUpdate, campus)
                ).$promise.then(function (data) {
                    if (constants.dev) {
                        $log.log('success, got data: ', data);
                    }
                    if (angular.isDefined(data.createdCount) && data.createdCount && angular.isDefined(data.insertedId)) {
                        return data;
                    }

                    return false;
                }, function (error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                    }
                    return false;
                });
            }
        };

        service.deleteCampuses = function (institutionId, campusIds) {
            var CampusModel = service.getDeleteCampusesModel();

            return CampusModel.save({
                id: institutionId
            }, campusIds).$promise.then(function (data) {
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
         * Returns country name by country code (UK=United Kingdom)
         *
         * @param {string} countryCode
         * @returns {Promise.<String>}
         */
        service.getCountryNameByCode = function (countryCode) {
            var deferred = $q.defer(),
                countryName;

            service.getCountries().then(function (countries) {
                angular.forEach(countries, function (country) {
                    if (country.countryCode === countryCode) {
                        countryName = country.name;
                    }
                });
                deferred.resolve(countryName);
            });

            return deferred.promise;
        };

        /**
         * Returns joined campus address
         *
         * @param {Object} campus
         * @returns {string}
         */
        service.getCampusAddress = function (campus) {
            campus.addressLine = [];
            if (angular.isDefined(campus.addressLine1) && campus.addressLine1 !== null) {
                campus.addressLine.push(campus.addressLine1);
            }
            if (angular.isDefined(campus.addressLine2) && campus.addressLine2 !== null) {
                campus.addressLine.push(campus.addressLine2);
            }

            return campus.addressLine.join(', ');
        };

        /**
         * Returns user friendly yes/no instead of true/false for campus.primary field
         *
         * @param {Object} campus
         * @returns {string}
         */
        service.getCampusIsPrimary = function (campus) {
            return campus.primary ? 'Yes' : 'No';
        };

        /**
         * Returns institution
         *
         * @param {string} id
         * @returns {Promise}
         */
        service.getInstitution = function (id) {
            // process already running
            if (!service.deferred.getInstitution) {
                service.deferred.getInstitution = $q.defer();
            } else {
                return service.deferred.getInstitution.promise;
            }
            var deferred = service.deferred.getInstitution;

            // check if data exists in cache
            if (service.institution) {
                deferred.resolve(service.institution);
            } else {
                var Api = $resource(constants.api.institutions.url + '/v1/list/all?filter[coreId]=:id&limit=1', { id: id });
                Api.get(function (data) {
                    if (constants.dev) {
                        $log.log('success, got data: ', data);
                    }
                    service.institution = service.formatList(data.results)[0];
                    deferred.resolve(service.institution);
                    deferred = null;
                }, function (error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                    }
                    service.institution = [];
                    deferred.resolve(service.institution);
                    deferred = null;
                });
            }

            return deferred.promise;
        };

        /**
         * Delete campus
         *
         * @param {string} organisationId
         * @param {object} campus
         * @returns {Promise}
         */
        service.deleteCampus = function (organisationId, campus) {
            var CampusModel = service.getCampusModel();
            if (angular.isDefined(campus.id)) {
                return CampusModel.delete(
                    { id: organisationId, campusId: campus.id }
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
            }
        };

        /**
         * Save campuses order
         *
         * @param organisationId
         * @param campuses
         * @returns {*}
         */
        service.saveOrder = function (organisationId, campuses) {
            var institutionModel = service.getCampusesOrderingModel();
            return institutionModel.update(
                { id: organisationId },
                {
                    'campus': service.formatForOrdering(campuses)
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

        /**
         * Format campuses before sending API request to save order
         *
         * @param {Object} items
         * @returns {Array}
         */
        service.formatForOrdering = function (items) {
            var formattedItems = [];
            angular.forEach(items, function (item) {
                formattedItems.push({
                    'id': item.id,
                    'order': item.order
                });
            });

            return formattedItems;
        };

        service.excludeGroupMember = function (institutionCoreId, groupMembers) {
            var groupMembersClone = angular.copy(groupMembers);
            for (var i = 0; i < groupMembersClone.length; i++) {
                if (parseInt(groupMembersClone[i].coreId, 10) === parseInt(institutionCoreId, 10)) {
                    groupMembersClone.splice(i, 1);
                    break;
                }
            }

            return groupMembersClone;
        };

        /**
         * Get institutions datagrid columns visibility.
         *
         * @returns {Object|*}
         */
        service.getColumnsVisibility = function () {
            return $localStorage.institutionGridColumnsVisibility;
        };

        /**
         * Copy campuses from institution to currently logged institution.
         *
         * @param {Object} institution
         */
        service.syncCampuses = function (institution) {
            var currentCoreId = institution.coreId;
            if (currentCoreId) {
                var activeCoreId = InstitutionFactory.getCoreId();
                if (activeCoreId && currentCoreId === activeCoreId) {
                    InstitutionFactory.setCampuses(angular.copy(institution.campus));
                }
                InstitutionsListFactory.setCampuses(angular.copy(institution.campus));
            }
        };

        /**
         * Search for institution.
         *
         * @param {String} searchPhrase
         * @returns {Promise.array}
         */
        service.searchInstitutions = function (searchPhrase) {
            var deferred = $q.defer(),
                institutions = [];

            if (!searchPhrase || !searchPhrase.length) {
                deferred.resolve(institutions);
            } else {
                var InstitutionsSearchModel = service.getInstitutionSearchModel();
                InstitutionsSearchModel.get(
                    { searchPhrase: searchPhrase },
                    function (data) {
                        if (constants.dev) {
                            $log.log('success, got data: ', data);
                        }

                        if (data && data.results) {
                            angular.forEach(data.results, function (item) {
                                institutions.push({
                                    coreId: item.coreId,
                                    name: item.name,
                                    active: item.active,
                                });
                            });
                        }

                        deferred.resolve(institutions);
                        deferred = null;
                    },
                    function (error) {
                        //@todo log error
                        if (constants.dev) {
                            $log.log('request failed' + error);
                        }
                        deferred.resolve(institutions);
                        deferred = null;
                    }
                );
            }

            return deferred.promise;
        };

        /**
         * Gets the belongs to list
         *
         * @returns {array}
         */
        service.getBelongsToList = function () {
            return TuProfileService.getBelongsToList();
        };

        /**
         * Search for institution.
         *
         * @param {String} searchPhrase
         * @returns {Promise.array}
         */
        service.searchTopLevelInstitutions = function (searchPhrase) {
            var deferred = $q.defer();

            if (!searchPhrase || searchPhrase.length < 1) {
                deferred.resolve([]);
            } else {
                var InstitutionsSearchModel = service.getTopLevelInstitutionSearchModel();
                InstitutionsSearchModel.get(
                    { searchPhrase: searchPhrase },
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
         * Search for institution departments.
         *
         * @param {int} parentCoreId
         * @returns {Promise.array}
         */
        service.getDepartments = function (parentCoreId) {
            var deferred = $q.defer();

            if (!parentCoreId) {
                deferred.resolve([]);
            } else {
                var InstitutionsSearchModel = service.getDepartmentsListModel();
                InstitutionsSearchModel.get(
                    { parentCoreId: parentCoreId },
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

        service.isAllStatistic = function (handle) {
            return handle === 'all';
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('InstitutionsListService', [
            '$resource',
            '$q',
            '$log',
            '$localStorage',
            'constants',
            'RequestsQueueService',
            'InstitutionFactory',
            'InstitutionsListFactory',
            'TuProfileService',
            'TimeService',
            App.services.InstitutionsList
        ]);

} (window.angular));
