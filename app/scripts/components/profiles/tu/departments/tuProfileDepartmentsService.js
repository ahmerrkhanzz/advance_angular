(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.TuProfileDepartmentsService = function (
        $resource,
        $q,
        $log,
        constants,
        TuProfileService,
        TuProfileFactory
    ) {
        var service = {
            deferred : {}
        };

        /**
         * Is department upgrade allowed?
         *
         * @param {Object} department
         * @returns {boolean}
         */
        service.allowUpgrade = function (department) {
            return department && department.typeId === constants.typeId.simpleDepartmentId;
        };

        /**
         * Allowed to login as department?
         *
         * @param {Object} department
         * @returns {boolean}
         */
        service.allowLoginAs = function (department) {
            return department && department.typeId === constants.typeId.clientDepartmentId;
        };

        /**
         * Is department downgrade allowed?
         *
         * @param {Object} department
         * @returns {boolean}
         */
        service.allowDowngrade = function (department) {
            return department && department.typeId === constants.typeId.clientDepartmentId;
        };

        /**
         * Get departments list API endpoint.
         *
         * @returns {$resource}
         */
        service.getDepartmentsListModel = function () {
            return $resource(constants.api.institutions.url + '/v1/list/departments/core-id/:coreId');
        };

        /**
         * Get departments upgarde API endpoint.
         *
         * @returns {$resource}
         */
        service.getUpgradeModel = function () {
            return $resource(constants.api.institutions.url + '/v1/department/:id/upgrade');
        };

        /**
         * Get departments downgrade API endpoint.
         *
         * @returns {$resource}
         */
        service.getDowngradeModel = function () {
            return $resource(constants.api.institutions.url + '/v1/department/:id/downgrade');
        };

        /**
         * Get departments update API endpoint.
         *
         * @returns {$resource}
         */
        service.getUpdateModel = function () {
            return $resource(constants.api.institutions.url + '/v1/department/:id', null, {
                update: {method:'PATCH'}
            });
        };

        /**
         * Get departments create API endpoint.
         *
         * @returns {$resource}
         */
        service.getCreateModel = function () {
            return $resource(constants.api.institutions.url + '/v1/department');
        };

        /**
         * Get departments delete API endpoint.
         *
         * @returns {$resource}
         */
        service.getDeleteModel = function () {
            return $resource(constants.api.institutions.url + '/v1/delete-department', null, {
                delete: {method:'POST'}
            });
        };

        /**
         * Get departments ordering API endpoint.
         *
         * @returns {$resource}
         */
        service.getOrderingModel = function () {
            return $resource(constants.api.institutions.url + '/v1/institution/:id/departmentsOrder', null, {
                update: {method:'PATCH'}
            });
        };

        /**
         * Get tu profile department upgrade requests end point.
         *
         * @returns {$resource}
         */
        service.getUpgradeRequestModel = function () {
            return $resource(constants.api.institutions.url + '/v1/department/:id/upgrade-request');
        };

        /**
         * Send TU profile department upgrade request.
         *
         * @param {String} departmentId
         * @param {String|null} comments
         * @returns {Promise}
         */
        service.sendUpgradeRequest = function (departmentId, comments) {
            if (!departmentId) {
                throw 'Missing Required';
            }

            var Api = service.getUpgradeRequestModel();
            return Api.save({id: departmentId}, {
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


        /**
         * Get belongs to list.
         *
         * @returns {array}
         */
        service.getBelongsToList = function () {
            return TuProfileService.getBelongsToList();
        };

        /**
         * Format campus list to ID & name pairs.
         *
         * @param {array} campuses
         * @returns {array}
         */
        service.formatCampusList = function (campuses) {
            var campusList = [];
            angular.forEach(campuses, function (campus) {
                campusList.push({id: campus.id, title: campus.name});
            });

            return campusList;
        };

        /**
         * Upgrade department.
         *
         * @param {string} id
         * @returns {Promise}
         */
        service.upgrade = function (id) {
            var Api = service.getUpgradeModel();
            return Api.get({id:id}).$promise.then(function (data) {
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
         * Downgrade department.
         *
         * @param {string} id
         * @returns {Promise}
         */
        service.downgrade = function (id) {
            var Api = service.getDowngradeModel();
            return Api.get({id:id}).$promise.then(function (data) {
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
         * Update department.
         *
         * @param {Object} department
         * @returns {Promise}
         */
        service.update = function(department) {
            var UpdateModel = service.getUpdateModel(),
                dataToUpdate = {
                    name: department.name,
                    belongsTo: department.belongsTo,
                    primaryCampusId: department.primaryCampusId
                };
            return UpdateModel.update(
                {id: department.id},
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
         * Create department.
         *
         * @param {Object} department
         * @returns {Promise}
         */
        service.create = function(department) {
            var CreateModel = service.getCreateModel(),
                dataToUpdate = {
                    name: department.name,
                    belongsTo: department.belongsTo,
                    primaryCampusId: department.primaryCampusId,
                    parentCoreId: department.parentCoreId
                };
            return CreateModel.save(
                null,
                dataToUpdate
            ).$promise.then(function (data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                data.typeName = service.getTypeName(constants.typeId.simpleDepartmentId);
                data.typeId = constants.typeId.simpleDepartmentId;
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
         * Delete department(s).
         *
         * @param {array} ids
         * @returns {Promise}
         */
        service.delete = function(ids) {
            var TuDepartmentModel = service.getDeleteModel();
            return TuDepartmentModel.delete(
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

        service.getAllDepartmentsByCoreId = function (coreId) {
            if (constants.dev) {
                var startTime = new Date().getTime(), endTime;
            }
            var Api = service.getDepartmentsListModel();
            return Api.get({
                coreId: coreId
            }).$promise.then(function (data) {
                if (constants.dev) {
                    endTime = new Date().getTime();
                    $log.log('success, got data: ', data, 'in ' + (endTime - startTime) + ' ms');
                }

                TuProfileFactory.setDepartments(data.results);

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
         * Delete department(s).
         *
         * @param {array} ids
         * @returns {Promise}
         */
        service.updateOrder = function(institutionId, orderedIds) {
            var TuDepartmentModel = service.getOrderingModel();
            return TuDepartmentModel.update(
                {id: institutionId},
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

        /**
         * Get departments list.
         *
         * @param {Object} params
         * @returns {Promise}
         */
        service.getAllDepartments = function (institutionCoreId, queryParams, params) {
            if (constants.dev) {
                var startTime = new Date().getTime(), endTime;
            }
            queryParams.coreId = institutionCoreId;
            var Api = service.getDepartmentsListModel();
            return Api.get(queryParams).$promise.then(function (data) {
                if (constants.dev) {
                    endTime = new Date().getTime();
                    $log.log('success, got data: ', data, 'in ' + (endTime - startTime) + ' ms');
                }
                if (params) {
                    params.total(data.totalFiltered);
                    params.totalEntries = data.totalMatching;
                }

                TuProfileFactory.setDepartments(data.results);

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
         * Get department name by id.
         *
         * @param {int} departmentCoreId
         * @returns {string}
         */
        service.getDepartmentNameById = function (departmentCoreId) {
            var departmentsList = TuProfileFactory.getDepartments(),
                departmentName = '';
            angular.forEach(departmentsList, function (department) {
                if (department.coreId === departmentCoreId) {
                    departmentName = department.name;
                }
            });

            return departmentName;
        };
        
        /**
         * Format departments list.
         *
         * @param {Object} departmentsData
         * @returns {Object}
         */
        service.formatList = function (departmentsData) {
            if (departmentsData) {
                angular.forEach(departmentsData, function(departmentObject) {
                    departmentObject.fullname = departmentObject.parentName + ' > ' + departmentObject.name;
                     //@todo remove departmentObject.typeName
                    departmentObject.typeName = service.getTypeName(departmentObject.typeId);
                    if (departmentObject.typeId === service.simpleDepartmentId) {
                        departmentObject.clientDepartment = false;
                    }
                    else if(departmentObject.typeId === service.clientDepartmentId) {
                        departmentObject.clientDepartment = true;
                    }
                    //@todo remove departmentObject.belongsToName
                    departmentObject.belongsToName = TuProfileService.getBelongsToName(departmentObject.belongsTo);
                });
            }

            return departmentsData;
        };

        /**
         * Get Department Types list.
         *
         * @returns {array}
         */
        service.getDepartmentTypes = function (grid) {
            grid = grid || false;

            return grid ? [
                {value: constants.typeId.simpleDepartmentId, label: 'Simple Department'},
                {value: constants.typeId.clientDepartmentId, label: 'Client Department'}
            ] : [
                {id: constants.typeId.simpleDepartmentId, title: 'Simple Department'},
                {id: constants.typeId.clientDepartmentId, title: 'Client Department'}
            ];
        };

        /**
         * Get department type name by ID.
         *
         * @param {int} typeId
         * @returns {string}
         */
        service.getTypeName = function (typeId) {
            typeId = parseInt(typeId, 10);
            switch (typeId) {
                case constants.typeId.clientDepartmentId:
                    return 'Client Department';
                case constants.typeId.simpleDepartmentId:
                    return 'Simple Department';
                default:
                    return '';
            }
        };

        service.hasActiveSubscription = function (department) {
            if (department && department.subscriptions && department.subscriptions.hasOwnProperty('tu') &&
                department.subscriptions.tu.hasOwnProperty('advanced') &&
                department.subscriptions.tu.advanced &&
                department.subscriptions.tu.hasOwnProperty('startDate') &&
                department.subscriptions.tu.hasOwnProperty('endDate') &&
                department.subscriptions.tu.startDate > 0 &&
                department.subscriptions.tu.endDate > 0
            ) {
                return true;
            }

            return false;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('TuProfileDepartmentsService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            'TuProfileService',
            'TuProfileFactory',
            App.services.TuProfileDepartmentsService
        ]);

}(window.angular));
