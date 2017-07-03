(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.Campuses = function (
        $resource,
        $q,
        $log,
        constants,
        InstitutionsListService,
        InstitutionsService,
        InstitutionFactory,
        DataHandlerFactory,
        orderBy
    ) {
        var service = {
            deferred: {
                getCampusList : null
            }
        };

        /**
         * Get countries list.
         *
         * @returns {Promise.<Array>}
         */
        service.getCountries = function () {
            return InstitutionsListService.getCountries();
        };

        /**
         * Get TU regions list.
         */
        service.getTuRegions = function () {
            return InstitutionsListService.getTuRegions();
        };

        service.getCampusList = function (params, noCache) {
            var coreId = params.parameters().coreId;
            // process already running
            if (!service.deferred.getCampusList) {
                service.deferred.getCampusList = $q.defer();
            } else {
                return service.deferred.getCampusList.promise;
            }
            var deferred = service.deferred.getCampusList,
                campuses = null,
                total = 0;
            if (!noCache) {
                // check if campuses are already loaded
                campuses = InstitutionFactory.getCampuses();
                if (campuses) {
                    campuses = DataHandlerFactory.objectToArray(campuses);
                    total = campuses.length;
                    params.total(total);
                    params.totalEntries = total;
                    deferred.resolve(service.formatCampusList(campuses));
                    service.deferred.getCampusList = null;
                } else {
                    service.deferred.getCampusList = null;
                    deferred.resolve([]);
                }
            }

            if (!campuses) {
                InstitutionsService.getInstitutionData(coreId, true).then(function (data) {
                    if (data.results && data.results[0] && data.results[0].campus) {
                        data.results[0].campus = DataHandlerFactory.objectToArray(data.results[0].campus);
                        total = data.results[0].campus.length;
                        params.total(total);
                        params.totalEntries = total;
                        deferred.resolve(service.formatCampusList(data.results[0].campus));
                        service.deferred.getCampusList = null;
                    } else {
                        service.deferred.getCampusList = null;
                        deferred.resolve([]);
                    }
                });
            }

            return deferred.promise;
        };

        service.formatCampusList = function (campusList) {
            var formatedCampusList = [];
            angular.forEach(campusList, function(campus) {
                InstitutionsListService.getCountryNameByCode(campus.country).then(function (countryName) {
                    campus.countryName = countryName;
                });
                campus.addressLine = InstitutionsListService.getCampusAddress(campus);
                campus.primaryName = InstitutionsListService.getCampusIsPrimary(campus);
                formatedCampusList.push(campus);
            });

            return orderBy(formatedCampusList, 'order', false);
        };

        service.getCreateModel = function () {
            return $resource(constants.api.institutions.url + '/v1/institution/:institutionId/campus');
        };

        service.create = function (institutionId, campusData) {
            var CreateModel = service.getCreateModel(),
                dataToInsert = {
                    name: null,
                    addressLine1: null,
                    addressLine2: null,
                    addressLine3: null,
                    postcode: null,
                    city: null,
                    state:null,
                    country: null,
                    primary: null,
                    displayInFrontEnd: null,
                    region: null,
                    latitude: null,
                    longitude: null,
                    autoGenerate: null,
                };
            return CreateModel.save(
                {institutionId: institutionId},
                service.filterObject(dataToInsert, campusData)
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

        service.deleteCampus = function (institutionId, campusId) {
            var CampusModel = InstitutionsListService.getCampusModel();

            return CampusModel.delete({
                    id: institutionId,
                    campusId: campusId
                }).$promise.then(function (data) {
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

        service.deleteCampuses = function (institutionId, campusIds) {
            var CampusModel = InstitutionsListService.getDeleteCampusesModel();

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

        service.update = function (institutionId, campusData) {
            var CreateModel = InstitutionsListService.getCampusModel(),
                dataToUpdate = {
                    name: null,
                    addressLine1: null,
                    addressLine2: null,
                    postcode: null,
                    city: null,
                    state:null,
                    country: null,
                    primary: null,
                    displayInFrontEnd: null,
                    region: null,
                    latitude: null,
                    longitude: null,
                    autoGenerate: null,
                };
            return CreateModel.update(
                {
                    id: institutionId,
                    campusId: campusData.id
                },
                service.filterObject(dataToUpdate, campusData)
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

        /**
         * Fill one object keys with other object values.
         *
         * @param {Object} filters
         * @param {Object} object
         * @returns {Object}
         */
        service.filterObject = function (filters, object) {
            var filteredObject = angular.copy(filters);
            angular.forEach(filters, function (value, key) {
                if (value && typeof value === 'object') {
                    angular.forEach(value, function (subValue, subKey) {
                        if (subValue === null && object[key][subKey] !== 'undefined') {
                            filteredObject[key][subKey] = object[key][subKey];
                        }
                    });
                } else if (value === null && object[key] !== 'undefined') {
                    filteredObject[key] = object[key];
                }
            });

            return filteredObject;
        };

        service.getCoordinatesModel = function () {
            return $resource(constants.api.institutions.url + '/v1/get-coordinates/:searchString', {}, {
                get: {
                    isArray: true,
                    cancellable : false
                }
            });
        };

        /**
         * Combine campus address info to google api search string.
         *
         * @param {Array} campus
         * @returns {string}
         */
        service.getSearchString = function (campus) {
            var searchValues = [],
                searchFields = ['addressLine1', 'addressLine2', 'city', 'postcode', 'country'];
            if (campus) {
                angular.forEach(searchFields, function (value) {
                    if (campus.hasOwnProperty(value) && campus[value] && campus[value].length > 0) {
                        searchValues.push(campus[value].trim());
                    }
                });
            }

            return searchValues.join(' ');
        };

        /**
         * Get coordinates by campus
         *
         * @param {Object} campus
         * @returns {false|array}
         */
        service.getCoordinatesByCampus = function (campus) {
            var searchFields = service.getSearchString(campus);
            if (!searchFields.length) {
                var deferred = $q.defer();
                deferred.resolve(false);
                return deferred.promise;
            }
            return service.getCoordinatesModel().get({searchString : searchFields}).$promise.then(function (data) {
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

        return service;
    };

    angular
        .module('qsHub')
        .service('CampusesService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            'InstitutionsListService',
            'InstitutionsService',
            'InstitutionFactory',
            'DataHandlerFactory',
            'orderByFilter',
            App.services.Campuses
        ]);

}(window.angular));
