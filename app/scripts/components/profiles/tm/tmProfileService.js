(function (angular, moment) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { services: {} });

    App.services.TmProfile = function (
        $resource,
        $q,
        $log,
        constants,
        InstitutionsService,
        InstitutionFactory
    ) {
        var service = {
            deferred: {},
            status: {
                approved: 'approved',
                pendingDeletion: 'pending-deletion',
                editApproved: 'edit-approved',
                pendingApprove: 'requested',
                pendingEdit: 'pending-edit'
            },
            cache: {}
        };

        service.getProfileModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tm-profile/core-id/:id', null, {
                update: {
                    method: 'PATCH'
                },
                get: {
                    cancellable: true
                }
            });
        };

        /**
         * Get TM profile upgrade requests end point.
         *
         * @returns {$resource}
         */
        service.getUpgradeRequestModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tm-profile/:id/upgrade-request');
        };

        service.getProgramTypesList = function () {
            return [
                { value: 'omba', label: 'Online MBA/Distance learning' },
                { value: 'pt', label: 'Part time MBA' },
                { value: 'ft', label: 'Full time MBA' },
                { value: 'emba', label: 'Executive MBA' }
            ];
        };

        service.getFeesRangesList = function () {
            return [
                { value: '', label: 'N/A' },
                { value: '<20000 USD', label: '<20000 USD' },
                { value: '20000 - 30000 USD', label: '20000 - 30000 USD' },
                { value: '30000 - 40000 USD', label: '30000 - 40000 USD' },
                { value: '40000 - 50000 USD', label: '40000 - 50000 USD' },
                { value: '50000 - 60000 USD', label: '50000 - 60000 USD' },
                { value: '60000 - 70000 USD', label: '60000 - 70000 USD' },
                { value: '70000 - 80000 USD', label: '70000 - 80000 USD' },
                { value: '80000 - 90000 USD', label: '80000 - 90000 USD' },
                { value: '90000 - 100000 USD', label: '90000 - 100000 USD' },
                { value: '100000 - 110000 USD', label: '100000 - 110000 USD' },
                { value: '110000 - 120000 USD', label: '110000 - 120000 USD' },
                { value: '>120000 USD', label: '>120000 USD' }
            ];
        };

        service.getLengthList = function () {
            var list = [{ value: '', label: 'N/A' }];
            for (var i = 1; i <= 40; i++) {
                list.push({
                    value: i + ' months', label: i + ' months'
                });
            }
            return list;
        };

        service.getPercentList = function () {
            var list = [{ value: '', label: 'N/A' }];
            for (var i = 0; i <= 100; i++) {
                list.push({
                    value: i, label: i + ' %'
                });
            }

            return list;
        };

        service.getYearList = function (startYear, endYear) {
            var list = [{ value: '', label: 'N/A' }];
            for (var i = startYear; i <= endYear; i++) {
                list.push({
                    value: i, label: i + ' years'
                });
            }

            return list;
        };

        service.getMonthsList = function () {
            var count = 0,
                months = [],
                name;
            while (count < 12) {
                name = moment().month(count++).format("MMMM");
                months.push({ value: name, label: name });
            }
            return months;
        };

        service.getAccreditationsList = function () {
            return [
                { value: '', label: 'N/A' },
                { value: 'AACSB', label: 'AACSB' },
                { value: 'ACBSP', label: 'ACBSP' },
                { value: 'ACQUIN', label: 'ACQUIN' },
                { value: 'AMBA', label: 'AMBA' },
                { value: 'BPS', label: 'BPS' },
                { value: 'CIM', label: 'CIM' },
                { value: 'CIPD', label: 'CIPD' },
                { value: 'EPAS', label: 'EPAS' },
                { value: 'EQUIS', label: 'EQUIS' },
                { value: 'FIBAA', label: 'FIBAA' },
                { value: 'IACBE', label: 'IACBE' },
                { value: 'ISO', label: 'ISO' },
                { value: 'MSA', label: 'MSA' },
                { value: 'NASPAA', label: 'NASPAA' },
                { value: 'NEASC', label: 'NEASC' },
                { value: 'NVAO', label: 'NVAO' },
                { value: 'SIMT', label: 'SIMT' },
                { value: 'ZEVA', label: 'ZEVA' }
            ];
        };

        service.getProgramStatusList = function () {
            return [
                { value: 'requested', label: 'Requested (New)' },
                { value: 'pending-edit', label: 'Pending (Edit)' },
                { value: 'pending-deletion', label: 'Pending (Deletion)' },
                { value: service.status.approved, label: 'Approved' },
                { value: 'edit-approved', label: 'Edited-Approved' },
            ];
        };


        service.isProgramApproved = function (status) {
            return status === service.status.approved;
        };

        service.isProgramPendingDeletion = function (status) {
            return status === service.status.pendingDeletion;
        };

        service.isProgramPendingApprove = function (status) {
            return status === service.status.pendingApprove;
        };

        service.isProgramPendingEdit = function (status) {
            return status === service.status.pendingEdit;
        };

        service.isProgramEditApproved = function (status) {
            return status === service.status.editApproved;
        };

        service.getCampusesKeyValuePairs = function (useCache, coreId) {
            useCache = useCache || false;
            coreId = coreId || InstitutionFactory.getCoreId();
            var campusList = [],
                cacheKey = 'getCampusesList:' + coreId,
                deferred = null;

            if (useCache && service.cache[cacheKey]) {
                deferred = $q.defer();
                deferred.resolve(service.cache[cacheKey]);
                return deferred.promise;
            }

            return service.getCampuses(useCache, coreId).then(function (campuses) {
                angular.forEach(campuses, function (campus) {
                    campusList.push({
                        value: campus.id,
                        label: campus.name
                    });
                });
                return campusList;
            });
        };

        service.clearCache = function () {
            service.cache = [];
        };

        service.getCampuses = function (useCache, coreId) {
            useCache = useCache || false;
            var campuses = [],
                cacheKey = 'getCampuses:' + coreId,
                deferred = null;
            if (useCache) {
                deferred = $q.defer();
                if (service.cache[cacheKey]) {
                    deferred.resolve(service.cache[cacheKey]);
                    return deferred.promise;
                } else if (InstitutionFactory.getCoreId() === coreId) {
                    service.cache[cacheKey] = InstitutionFactory.getCampusData();
                    deferred.resolve(service.cache[cacheKey]);
                    return deferred.promise;
                }
            }
            return InstitutionsService.getInstitutionData(coreId, ['campus']).then(function (data) {
                if (data.results && data.results[0] && data.results[0].campus) {
                    campuses = data.results[0].campus;
                    service.cache[cacheKey] = campuses;
                    if (InstitutionFactory.getCoreId() === coreId) {
                        InstitutionFactory.setCampuses(campuses);
                    }
                }

                return campuses;
            });
        };

        service.getTmProfileData = function (coreId) {
            if (!coreId) {
                var deferred = $q.defer();
                deferred.resolve(false);
                return deferred.promise;
            }
            if (constants.dev) {
                var startTime = new Date().getTime(),
                    endTime;
            }

            return service.getProfileModel().get({
                id: coreId
            }).$promise.then(function (data) {
                if (constants.dev) {
                    endTime = new Date().getTime();
                    $log.log('success, got data: ', data, 'in ' + (endTime - startTime) + ' ms');
                }
                return data.toJSON();
            }, function (error) {
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return false;
            });
        };

        service.getSpecialisationsList = function () {
            // process already running
            if (!service.deferred.getSpecialisationsList) {
                service.deferred.getSpecialisationsList = $q.defer();
            } else {
                return service.deferred.getSpecialisationsList.promise;
            }
            var deferred = service.deferred.getSpecialisationsList;

            // check if data exists in cache
            if (service.specialisationsList) {
                deferred.resolve(service.specialisationsList);
            } else {
                var Api = $resource(constants.api.institutions.url + '/v1/list/specialisations');
                Api.get(function (data) {
                    if (constants.dev) {
                        $log.log('success, got data: ', data);
                    }
                    service.specialisationsList = data.results;
                    deferred.resolve(service.specialisationsList);
                    deferred = null;
                }, function (error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                    }
                    service.specialisationsList = [];
                    deferred.resolve(service.specialisationsList);
                    deferred = null;
                });
            }

            return deferred.promise;
        };

        /**
         * Send TM profile upgrade request.
         *
         * @param {String} tuProfileId
         * @param {String|null} comments
         * @returns {Promise}
         */
        service.sendUpgradeRequest = function (tmProfileId, comments) {
            if (!tmProfileId) {
                throw 'Missing Required';
            }

            var Api = service.getUpgradeRequestModel();
            return Api.save({ id: tmProfileId }, {
                comments: comments
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

        return service;
    };

    angular
        .module('qsHub')
        .service('TmProfileService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            'InstitutionsService',
            'InstitutionFactory',
            App.services.TmProfile
        ]);

} (window.angular, window.moment));
