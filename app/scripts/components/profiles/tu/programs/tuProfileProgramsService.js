(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.TuProfileProgramsService = function (
        $resource,
        $q,
        $log,
        constants,
        RequestsQueueService,
        TuProfileService
    ) {
        var service = {
            deferred : {},
            departmentsList: {},
            belongsTo: {
                all : 'all',
                ug: 'ug',
                pg: 'pg'
            },
            hasErrors: false
        };

        /**
         * Get programs list API endpoint.
         *
         * @returns {$resource}
         */
        service.getProgramsListModel = function () {
            return $resource(constants.api.institutions.url + '/v1/list/tu-programs/core-id/:coreId', {}, {
                get: {
                    cancellable : true
                }
            });
        };

        /**
         * Get programs update API endpoint.
         *
         * @returns {$resource}
         */
        service.getUpdateModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tu-program/:id', null, {
                update: {method:'PATCH'}
            });
        };

        /**
         * Get programs create API endpoint.
         *
         * @returns {$resource}
         */
        service.getCreateModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tu-program');
        };

        /**
         * Get programs delete API endpoint.
         *
         * @returns {$resource}
         */
        service.getDeleteModel = function () {
            return $resource(constants.api.institutions.url + '/v1/delete-tu-programs', null, {
                delete: {method:'POST'}
            });
        };

        /**
         * Get belongs to list.
         *
         * @returns {array}
         */
        service.getBelongsToList = function () {
            return TuProfileService.getBelongsToList();
        };

        /**
         * Get programs ordering API endpoint.
         *
         * @returns {$resource}
         */
        service.getOrderingModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tu-profile/:id/programsOrder', null, {
                update: {method:'PATCH'}
            });
        };
        
        /**
         * Sets has errors flag.
         *
         * @param {boolean} hasErrors
         */
        service.setHasErrors = function (hasErrors) {
            service.hasErrors = hasErrors;
        };

        /**
         * Gets has errors flag.
         *
         * @returns {boolean|*}
         */
        service.getHasErrors = function () {
            return service.hasErrors;
        };

        /**
         * Update program.
         *
         * @param {Object} program
         * @returns {Promise}
         */
        service.update = function(program) {
            var UpdateModel = service.getUpdateModel(),
                dataToUpdate = {
                    departmentCoreId: program.departmentCoreId,
                    belongsTo: program.belongsTo,
                    name: program.name,
                    url: program.url
                };
            return UpdateModel.update(
                {id: program.id},
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
         * Create program.
         *
         * @param {Object} program
         * @returns {Promise}
         */
        service.create = function(program) {
            if (!program || !program.institutionCoreId) {
                throw 'Missing Required';
            }
            var UpdateModel = service.getCreateModel(),
                dataToUpdate = {
                    institutionCoreId: program.institutionCoreId,
                    institutionCoreIdAsString: program.institutionCoreId.toString(),
                    departmentCoreId: program.departmentCoreId,
                    belongsTo: program.belongsTo,
                    name: program.name,
                    url: program.url
                };
            return UpdateModel.save(
                null,
                dataToUpdate
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
         * Delete program(s).
         *
         * @param {array} ids
         * @returns {Promise}
         */
        service.delete = function(ids) {
            var TuProgramModel = service.getDeleteModel();
            return TuProgramModel.delete(
                {},
                ids
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
         * Update programs order.
         *
         * @param {String} tuProfileId
         * @param {Array} orderedIds
         * @returns {Promise.<TResult>}
         */
        service.updateOrder = function(tuProfileId, orderedIds) {
            var TuProgramsModel = service.getOrderingModel();
            return TuProgramsModel.update(
                {id: tuProfileId},
                orderedIds
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

        service.getAllProgramsByCoreId = function (coreId) {
            if (constants.dev) {
                var startTime = new Date().getTime(), endTime;
            }
            var Api = service.getProgramsListModel();
            return Api.get({
                coreId: coreId
            }).$promise.then(function (data) {
                if (constants.dev) {
                    endTime = new Date().getTime();
                    $log.log('success, got data: ', data, 'in ' + (endTime - startTime) + ' ms');
                }
                return service.formatList(data.results);
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return [];
            });
        };

        /**
         * Get programs list.
         *
         * @param {Object} params
         * @returns {Promise}
         */
        service.getAllPrograms = function (params) {  
            var coreId = params.parameters().coreId;
            if (constants.dev) {
                var startTime = new Date().getTime(), endTime;
            }

            // cancel currently running requests
            RequestsQueueService.cancelAll('getAllPrograms');

            var Api = service.getProgramsListModel().get(params.url(), { coreId: coreId });

            // add new request to the queue
            RequestsQueueService.add(Api, 'getAllPrograms');

            return Api.$promise.then(function (data) {
                if (constants.dev) {
                    endTime = new Date().getTime();
                    $log.log('success, got data: ', data, 'in ' + (endTime - startTime) + ' ms');
                }
                // cancel currently running requests
                RequestsQueueService.cancelAll('getAllPrograms');

                params.total(data.totalFiltered);
                params.totalEntries = data.totalMatching;

               return service.formatList(data.results);
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return [];
            });
        };
        
        /**
         * Format programs list.
         *
         * @param {Object} programsData
         * @returns {Object}
         */
        service.formatList = function (programsData) {
            if (programsData) {
                angular.forEach(programsData, function(programObject) {
                    programObject.belongsToName = service.getBelongsToName(programObject.belongsTo);
                });
            }

            return programsData;
        };

        /**
         * Get belongs to name by ID.
         *
         * @param {int} belongsTo
         * @returns {string}
         */
        service.getBelongsToName = function (belongsTo) {
            return TuProfileService.getBelongsToName(belongsTo);
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('TuProfileProgramsService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            'RequestsQueueService',
            'TuProfileService',
            App.services.TuProfileProgramsService
        ]);

}(window.angular));
