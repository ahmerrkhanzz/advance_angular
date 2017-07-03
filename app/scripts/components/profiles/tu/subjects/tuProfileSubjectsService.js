(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.TuProfileSubjectsService = function ($resource, $q, $log, constants) {
        var service = {
            overviewData : null,
            institutionData: null,
            subjects : null,
            deferred : {
                getOverviewData: null,
                getInstitutionData: null,
                getSubjects: null
            }
        };

        /**
         * Get subjects update API endpoint.
         *
         * @returns {$resource}
         */
        service.getTuSubjectsModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tu-profile/:id', null, {
                update: { method:'PATCH' }
            });
        };

        /**
         * Call subjects API
         */
        service.getSubjectsModel = function () {
            return $resource(constants.api.institutions.url + '/v1/list/subjects?sorting[groupName]=asc');
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
                        if (subValue === null && object[key][subKey]) {
                            filteredObject[key][subKey] = object[key][subKey];
                        }
                    });
                } else if (value === null && object[key]) {
                    filteredObject[key] = object[key];
                }
            });

            return filteredObject;
        };

        /**
         * Get subjects list.
         *
         * @returns {Promise}
         */
        service.getSubjects = function () {
            // process already running
            if (!service.deferred.getSubjects) {
                service.deferred.getSubjects = $q.defer();
            } else {
                return service.deferred.getSubjects.promise;
            }
            var deferred = service.deferred.getSubjects;

            // check if data exists in cache
            if (service.roles) {
                deferred.resolve(service.roles);
            } else {
                var SubjectsModel = service.getSubjectsModel();
                SubjectsModel.get(function (data) {
                    var groupedSubjects = {};
                    if (data && data.results) {
                        // convert to groups
                        angular.forEach(data.results, function (subject) {
                            if (!groupedSubjects[subject.groupName]) {
                                groupedSubjects[subject.groupName] = [];
                            }
                            groupedSubjects[subject.groupName].push(subject);
                        });
                    }
                    service.subjects = groupedSubjects;
                    deferred.resolve(service.subjects);
                    deferred = null;
                }, function (error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                    }
                    service.subjects = [];
                    deferred.resolve(service.subjects);
                    deferred = null;
                });
            }

            return deferred.promise;
        };

        /**
         * Format subjects to <handleName>:<bool> key value pairs.
         *
         * @param {Object} subjects
         * @returns {Object}
         */
        service.formatSubjects = function (subjects, justHandles) {
            var formattedSubjects = {};
            justHandles = justHandles || false;

            if (justHandles) {
                angular.forEach(subjects, function (assigned, subjectHandle) {
                    if (assigned) {
                        formattedSubjects[subjectHandle] = subjectHandle;
                    }
                });

            } else {
                var subjectKey;
                for (subjectKey in subjects) {
                    if (isNaN(subjectKey)) {
                        return subjects;
                    } else {
                        formattedSubjects[subjects[subjectKey]] = true;
                    }
                }
            }

            return formattedSubjects;
        };

        /**
         * Submit subjects tab data.
         *
         * @param {Object} profileData
         * @returns {Promise}
         */
        service.saveSubjectsTab = function (profileData) {
            var TuSubjectsModel = service.getTuSubjectsModel(),
                dataToUpdate = {
                    ugSubjects : profileData.ugSubjects,
                    pgSubjects : profileData.pgSubjects,
                    hasPhdSubjects : profileData.hasPhdSubjects
                };

            if (dataToUpdate.ugSubjects) {
                dataToUpdate.ugSubjects = service.formatSubjects(dataToUpdate.ugSubjects, true);
            }
            if (dataToUpdate.pgSubjects) {
                dataToUpdate.pgSubjects = service.formatSubjects(dataToUpdate.pgSubjects, true);
            }

            return TuSubjectsModel.update(
                {id: profileData.id},
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

        service.splitObject = function (inputObject, size) {
            var index = 0,
                chunks = {},
                inChunks = [];

            angular.forEach(inputObject, function (value, key) {
                if (index === size) {
                    index = 0;
                    chunks = {};
                }
                if (index === size - 1) {
                    inChunks.push(chunks);
                }
                chunks[key] = value;
                index++;
            });

            return inChunks;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('TuProfileSubjectsService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            App.services.TuProfileSubjectsService
        ]);

}(window.angular));
