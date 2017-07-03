(function(angular, moment) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { services: {} });

    App.services.TmProfileProgramsService = function(
        $resource,
        $q,
        $log,
        constants,
        RequestsQueueService,
        TmProfileService
    ) {
        var service = {
            deferred: {},
            hasErrors: false
        };

        /**
         * Get programs list API endpoint.
         *
         * @returns {$resource}
         */
        service.getProgramsListModel = function() {
            return $resource(
                constants.api.institutions.url + '/v1/list/tm-programs?filter[parentInstitutionCoreId]==:coreId&page=1&limit=500&sorting[createdAt]=desc',
                {},
                {
                    get: {
                        cancellable: true
                    }
                }
            );
        };

        /**
         * Get programs update API endpoint.
         *
         * @returns {$resource}
         */
        service.getUpdateModel = function() {
            return $resource(constants.api.institutions.url + '/v1/tm-program/:id', null, {
                update: { method: 'PATCH' }
            });
        };

        /**
         * Get programs create API endpoint.
         *
         * @returns {$resource}
         */
        service.getCreateModel = function() {
            return $resource(constants.api.institutions.url + '/v1/tm-program');
        };

        /**
         * Get programs downgrade API endpoint.
         *
         * @returns {$resource}
         */
        service.getDowngradeModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tm-program/:id/downgrade');
        };

        /**
         * Get programs upngrade API endpoint.
         *
         * @returns {$resource}
         */
        service.getUpgradeModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tm-program/:id/upgrade', null, {
                update: { method: 'PATCH' }
            });
        };

        /**
         * Sets has errors flag.
         *
         * @param {boolean} hasErrors
         */
        service.setHasErrors = function(hasErrors) {
            service.hasErrors = hasErrors;
        };

        /**
         * Gets has errors flag.
         *
         * @returns {boolean|*}
         */
        service.getHasErrors = function() {
            return service.hasErrors;
        };

        /**
         * Update program.
         *
         * @param {Object} program
         * @returns {Promise}
         */
        service.update = function(program) {
            // @todo validate data
            return service.getUpdateModel().update({id: program.id}, program).$promise.then(function(data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return true;
            }, function(error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return false;
            });
        };

        /**
         * Delete program.
         *
         * @param {Number} id
         * @returns {Promise}
         */
        service.delete = function(id) {
            // @todo validate data
            return service.getUpdateModel().delete({id: id}).$promise.then(function(data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return true;
            }, function(error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return false;
            });
        };

        service.deleteRequest = function(id, comments) {
            // @todo validate data
            return service.getUpdateModel().delete({id: id, comments: comments}).$promise.then(function(data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return true;
            }, function(error) {
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
            // @todo validate data
            return service.getCreateModel().save(null, program).$promise.then(function(data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return data;
            }, function(error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return false;
            });
        };

        /**
         * Downgrade advanced program.
         *
         * @param {Number} id  - program ID
         * @returns {Promise}
         */
        service.downgrade = function(id) {
            // @todo validate data
            return service.getDowngradeModel().get({id: id}).$promise.then(function(data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return true;
            }, function(error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return false;
            });
        };

        /**
         * Upgrade to advanced program.
         *
         * @param {String} id
         * @param {String|null} comments
         * @param {String|null} startDate
         * @param {String|null} endDate
         * @returns {Promise.<TResult>}
         */
        service.upgrade = function(id, comments, startDate, endDate) {
            var dataRequest = {};
            if (startDate) {
                dataRequest.startDate = startDate;
            }
            if (endDate) {
                dataRequest.endDate = endDate;
            }
            if (comments) {
                dataRequest.comments = comments;
            }
            // @todo validate data
            return service.getUpgradeModel().update({id: id}, dataRequest).$promise.then(function(data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return data.insertedCoreId ? data.insertedCoreId : true;
            }, function(error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return false;
            });
        };


        /**
         * Get all programs by parent institution Core Id
         *
         * @param {Number} coreId
         * @returns {Promise.<TResult>}
         */
        service.getAllProgramsByCoreId = function(coreId) {
            if (constants.dev) {
                var startTime = new Date().getTime(),
                    endTime;
            }
            return service.getProgramsListModel().get({
                coreId: coreId
            }).$promise.then(function(data) {
                if (constants.dev) {
                    endTime = new Date().getTime();
                    $log.log('success, got data: ', data, 'in ' + (endTime - startTime) + ' ms');
                }
                return (data.results);
            }, function(error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return [];
            });
        };

        /**
         * Get programs list.
         * @todo check if used
         * @param {Object} params
         * @returns {Promise}
         */
        service.getAllPrograms = function(params) {
            var coreId = params.parameters().coreId;
            if (constants.dev) {
                var startTime = new Date().getTime(),
                    endTime;
            }

            // cancel currently running requests
            RequestsQueueService.cancelAll('getAllPrograms');

            var Api = service.getProgramsListModel().get(params.url(), { coreId: coreId });

            // add new request to the queue
            RequestsQueueService.add(Api, 'getAllPrograms');

            return Api.$promise.then(function(data) {
                if (constants.dev) {
                    endTime = new Date().getTime();
                    $log.log('success, got data: ', data, 'in ' + (endTime - startTime) + ' ms');
                }
                // cancel currently running requests
                RequestsQueueService.cancelAll('getAllPrograms');

                params.total(data.totalFiltered);
                params.totalEntries = data.totalMatching;

                return (data.results);
            }, function(error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return [];
            });
        };

        service.getTmpCampusId = function () {
            return 'tmp_' + moment();
        };

        service.isTmpCampusId = function (id) {
            return id.indexOf('tmp_') === 0;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('TmProfileProgramsService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            'RequestsQueueService',
            'TmProfileService',
            App.services.TmProfileProgramsService
        ]);

}(window.angular, window.moment));
