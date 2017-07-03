(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.tmDirectory = function (
        $resource,
        $q,
        $log,
        constants
    ) {
        var service = {
            tmProgramHistory: null,
            deferred : {
                getTmProgramHistory: null
            }
        };

        /**
         * Get programs list API endpoint.
         *
         * @returns {$resource}
         */
        service.getProgramsListModel = function () {
            return $resource(constants.api.institutions.url + '/v1/list/tm-programs', null, {
                get: {
                    cancellable : true
                }
            });
        };

        service.getProgramStatusRevertModel = function () {
            return $resource(constants.api.institutions.url + '/v1/admin/tm-program/:id/revert-status');
        };

        service.getUpdateModel = function() {
            return $resource(constants.api.institutions.url + '/v1/admin/tm-program/:id', null, {
                update: { method: 'PATCH' }
            });
        };

        service.getProgramHistoryModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tm-program-history/:id');
        };

        service.revertStatus = function (id, sendEmailToClient) {
            if (constants.dev) {
                var startTime = new Date().getTime(),
                    endTime;
            }
            return service.getProgramStatusRevertModel().get({
                id: id,
                sendEmailToClient: sendEmailToClient
            }).$promise.then(function (data) {
                if (constants.dev) {
                    endTime = new Date().getTime();
                    $log.log('success, got data: ', data, 'in ' + (endTime - startTime) + ' ms');
                }
                return data;
            }, function (error) {
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return false;
            });
        };

        service.delete = function(id, publish, sendEmailToClient) {
            publish = publish || false;
            sendEmailToClient = sendEmailToClient || false;
            // @todo validate data
            return service.getUpdateModel().delete({
                id: id,
                publish: publish,
                sendEmailToClient: sendEmailToClient
            }).$promise.then(function(data) {
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

        service.approve = function(program, publish, sendEmailToClient) {
            publish = publish || false;
            sendEmailToClient = sendEmailToClient || false;
            // @todo validate data
            return service.getUpdateModel().update({
                id: program.id,
                publish: publish,
                sendEmailToClient: sendEmailToClient
            }, program).$promise.then(function(data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                if (publish && angular.isDefined(data.published)) {
                    return {
                        published : data.published
                    };
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

        service.getAllPrograms = function (params) {
            if (constants.dev) {
                var startTime = new Date().getTime(),
                    endTime;
            }
            var hasSorting = false;
            if (params) {
                for (var key in params) {
                    if (key.indexOf('sorting') !== -1) {
                        hasSorting = true;
                        break;
                    }
                }
            }
            if (!hasSorting) {
                params['sorting[createdAt]'] = 'desc';
            }

            return service.getProgramsListModel().get(params).$promise.then(function (data) {
                if (constants.dev) {
                    endTime = new Date().getTime();
                    $log.log('success, got data: ', data, 'in ' + (endTime - startTime) + ' ms');
                }

                return data;
            }, function (error) {
                if (constants.dev) {
                    $log.log('request failed' + error);
                }

                return false;
            });
        };

        service.getCsvData = function (columns, rows) {
            var data = [],
                cellValue,
                extractedRow;

            rows.forEach(function (row) {
                extractedRow = [];
                columns.forEach(function (gridCol) {
                    if (gridCol.visible &&
                        gridCol.colDef.exporterSuppressExport !== true
                    ) {
                        cellValue = '';
                        if (gridCol.colDef.field && row[gridCol.colDef.field]) {
                            cellValue = row[gridCol.colDef.field];
                        }
                        var extractedField = {
                            value: cellValue
                        };
                        extractedRow.push(extractedField);
                    }
                });

                data.push(extractedRow);
            });

            return data;
        };

        service.getProgramHistory = function (id) {
            // process already running
            if (!service.deferred.getTmProgramHistory) {
                service.deferred.getTmProgramHistory = $q.defer();
            } else {
                return service.deferred.getTmProgramHistory.promise;
            }
            var deferred = service.deferred.getTmProgramHistory;

            if (service.tmProgramHistory) {
                deferred.resolve(service.tmProgramHistory);
            } else {
                service.getProgramHistoryModel().get(
                    {id: id}, function (data) {
                    if (constants.dev) {
                        $log.log('success, got data: ', data);
                    }
                    service.tmProgramHistory = data;
                    deferred.resolve(service.tmProgramHistory);
                    // reset data
                    deferred = null;
                    service.tmProgramHistory = null;
                    service.deferred.getTmProgramHistory = null;
                }, function (error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                    }
                    service.tmProgramHistory = [];
                    deferred.resolve(service.tmProgramHistory);
                    // reset data
                    deferred = null;
                    service.tmProgramHistory = null;
                    service.deferred.getTmProgramHistory = null;
                });
            }

            return deferred.promise;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('TmDirectoryService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            App.services.tmDirectory
        ]);

}(window.angular));
