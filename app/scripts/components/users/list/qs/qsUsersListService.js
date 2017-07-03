(function(angular, moment) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.QsUsers = function (
        $resource,
        $q,
        $log,
        $localStorage,
        constants,
        UsersListService,
        RequestsQueueService,
        InstitutionsUsersListService
    ) {
        var service = {
            contactTypes : null,
            roles : null,
            sections : null,
            deferred : {
                getContactTypes: null,
                getRoles: null,
                getSections: []
            }
        };

        service.getUsersListModel = function () {
            return $resource(constants.api.usersPermissions.url + '/v1/list/qs-users', {}, {
                get: {
                    isArray:false,
                    cancellable : true
                }
            });
        };

        service.getAllUsers = function (filters) {
            if (constants.dev) {
                var startTime = new Date().getTime(), endTime;
            }
            // cancel currently running requests
            RequestsQueueService.cancelAll('getAllQsUsers');
            var hasSorting = false,
                allowedFilters = [
                    'limit',
                    'page',
                ];
            if (filters) {
                for (var key in filters) {
                    if (key.indexOf('sorting') !== -1) {
                        hasSorting = true;
                        break;
                    } else {
                        if (key.indexOf('filter') !== 0 && allowedFilters.indexOf(key) === -1) {
                            delete filters[key];
                        }
                    }
                }
            }
            if (!hasSorting) {
                filters['sorting[createdAt]'] = 'desc';
            }
            var Api = service.getUsersListModel().get(filters);

            // add new request to the queue
            RequestsQueueService.add(Api, 'getAllQsUsers');

            return Api.$promise.then(function (data) {
                if (constants.dev) {
                    endTime = new Date().getTime();
                    $log.log('success, got data: ', data, 'in ' + (endTime - startTime) + ' ms');
                }

                // cancel currently running requests
                RequestsQueueService.cancelAll('getAllQsUsers');
                data.results = service.formatList(data.results);
                return data;
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return [];
            }).then(function (data) {
                data.results = service.appendAccessData(data.results);
                return data;
            }).then(function (data) {
                data.results = service.appendContactsData(data.results);
                return data;
            });
        };

        service.formateDate = function (date, format)
        {
            var formatedDate = '';
            if (date && moment(date, 'x').isValid()) {
                formatedDate = moment(date,  'x');
                if (format) {
                    formatedDate = formatedDate.format(format);
                }
            }

            return formatedDate;
        };
        service.appendAccessData = function (userData) {
            if (userData) {
                service.getRoles().then(function (systemRoles) {
                    if (systemRoles) {
                        var hasCustomRole,
                            originalRoles = null;
                        angular.forEach(userData, function(userObject) {
                            if (!userObject.roles) {
                                return false;
                            }
                            originalRoles = angular.copy(userObject.roles);
                            userObject.roles = {};
                            //check if user has custom role
                            hasCustomRole = false;
                            angular.forEach(originalRoles, function(value) {
                                if (value === constants.customRole) {
                                    hasCustomRole = true;
                                }
                            });

                            angular.forEach(originalRoles, function(value) {
                                userObject.roles[value] = true;
                                if (!hasCustomRole && value === constants.globalAdminRole) {
                                    userObject.globalAdmin = true;
                                    angular.forEach(systemRoles, function(role) {
                                        angular.forEach(role.sections, function(section) {
                                            userObject.accessTo[section] = true;
                                        });
                                    });
                                }
                            });
                        });
                    }
                });
            }

            return userData;
        };

        service.appendContactsData = function (userData) {
            if (userData) {
                var contactTypeName = null,
                    originalContactTypes = null;
                service.getContactTypes().then(function(contactTypesList) {
                    if (contactTypesList && contactTypesList.length) {
                        angular.forEach(userData, function(userObject) {
                            if (!userObject.contactTypesAsArray) {
                                userObject.contactTypesAsArray = [];
                            }
                            if (!userObject.contactTypes) {
                                return false;
                            }
                            originalContactTypes = angular.copy(userObject.contactTypes);
                            userObject.contactTypes = {};
                            angular.forEach(originalContactTypes, function(contactType, key) {
                                contactTypeName = UsersListService.getContactTypeNameByHandle(
                                    contactType.handle, contactTypesList
                                );
                                if (!contactTypeName) {
                                    return false;
                                }
                                userObject.contactTypesAsArray.push(contactTypeName);
                                userObject.contactTypesAsString = userObject.contactTypesAsArray.length ?
                                    userObject.contactTypesAsArray.join(', ') : null;

                                userObject.contactTypes[contactType.handle] = {
                                    primary : contactType.primary,
                                    assigned : true
                                };
                            });
                        });
                    }
                });
            }

            return userData;
        };

        service.getContactTypesFilter = function () {
            return service.getContactTypes().then(function(contactTypesList) {
                var contactTypeFilters = [];
                if (contactTypesList) {
                    angular.forEach(contactTypesList, function(contactType) {
                        contactTypeFilters.push({
                            id: contactType.handle,
                            title: contactType.name
                        });
                    });
                }

                return contactTypeFilters;
            });
        };

        /**
         * Format QS users list.
         *
         * @param {Object} userData
         * @returns {Object}
         */
        service.formatList = function (userData) {
            if (userData) {
                var accessTo;
                angular.forEach(userData, function(userObject) {
                    if (userObject.accessTo) {
                        accessTo = {};
                        angular.forEach(userObject.accessTo, function(value) {
                            accessTo[value] = true;
                        });
                        userObject.accessTo = angular.copy(accessTo);
                    }
                });
            }
            return userData;
        };

        /**
         * Get contact types list.
         *
         * @returns {Promise:Object}
         */
        service.getContactTypes = function () {
            return InstitutionsUsersListService.getContactTypes();
        };

        /**
         * Format roles list.
         *
         * @param {Object} rolesList
         * @returns {Array}
         */
        service.formatRoles = function (rolesList) {
            var flatArray = [];

            angular.forEach(rolesList, function (rolesGroup) {
                angular.forEach(rolesGroup.roles, function (role) {
                    flatArray.push({
                        'groupHandle' : rolesGroup.handle,
                        'groupName' : rolesGroup.name,
                        'roleName' : role.name,
                        'roleHandle' : rolesGroup.handle + '.' + role.handle,
                        'all' : role.all ? role.all : false,
                        'sections': role.sections
                    });
                });
            });

            flatArray.push({
                'groupName' : 'Custom',
                'roleName' : 'Switching off will revert changes to default',
                'roleHandle' : 'custom',
                'all' : false
            });
            return flatArray;
        };

        /**
         * Get QS users roles list.
         *
         * @returns {Promise}
         */
        service.getRoles = function () {
            // process already running
            if (!service.deferred.getRoles) {
                service.deferred.getRoles = $q.defer();
            } else {
                return service.deferred.getRoles.promise;
            }
            var deferred = service.deferred.getRoles;

            // check if data exists in cache
            if (service.roles) {
                deferred.resolve(service.roles);
            } else {
                var Api = $resource(constants.api.usersPermissions.url + '/v1/list/qs-roles');
                Api.get(function (data) {
                    if (constants.dev) {
                        $log.log('success, got data: ', data);
                    }
                    service.roles = service.formatRoles(data.results);
                    deferred.resolve(service.roles);
                    deferred = null;
                }, function (error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                    }
                    service.roles = [];
                    deferred.resolve(service.roles);
                    deferred = null;
                });
            }

            return deferred.promise;
        };

        /**
         * Get sections list
         *
         * @param {boolean} client
         * @returns {Promise:Array}
         */
        service.getSections = function (client) {
            var type = client ? 'client' : 'qs',
                Api = $resource(constants.api.usersPermissions.url + '/v1/list/' + type + '-sections');

            // process already running
            if (!service.deferred.getSections[type]) {
                service.deferred.getSections[type] = $q.defer();
            } else {
                return service.deferred.getSections[type].promise;
            }
            var deferred = service.deferred.getSections[type];

            // check if data exists in cache
            if (service.sections) {
                deferred.resolve(service.sections);
            } else {
                Api.get(function (data) {
                    if (constants.dev) {
                        $log.log('success, got data: ', data);
                    }
                    service.sections = UsersListService.formatSections(data.results);
                    deferred.resolve(service.sections);
                    deferred = null;
                }, function (error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                    }
                    service.sections = [];
                    deferred.resolve(service.sections);
                    deferred = null;
                });
            }

            return deferred.promise;
        };

        /**
         * Mark user as active.
         *
         * @param {String} id
         * @returns {Promise:boolean}
         */
        service.activate = function (id) {
            var Api = $resource(constants.api.usersPermissions.url + '/v1/user/:id/activate', {id:id});
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
         * @param {String} id
         * @returns {Promise:boolean}
         */
        service.deactivate = function (id) {
            var Api = $resource(constants.api.usersPermissions.url + '/v1/user/:id/deactivate', {id:id});
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

        service.getFullName = function(userObject) {
            return [
                userObject.title,
                userObject.firstname,
                userObject.lastname
            ].filter(Boolean).join(' ');
        };

        service.getUserModel = function () {
            return $resource(constants.api.usersPermissions.url + '/v1/user/:id', null, {
                create:  { method: 'POST' },
                update: { method:'PATCH' }
            });
        };

        service.initQsUser = function (user) {
            if (!user.hasOwnProperty('contactTypes')) {
                user.contactTypes = [];
            }
            user.roles = [];
            user.accessTo = [];
            user.deleted = false;
            user.active = true;
            user.qs = true;

            return user;
        };

        service.savePersonalDetails = function (userData) {
            var UserModel = service.getUserModel(),
                dataToUpdate = angular.copy(userData);
            if (dataToUpdate.contactTypes) {
                var formattedContactTypes = [];
                angular.forEach(dataToUpdate.contactTypes, function(contactTypeData, handle) {
                    if (contactTypeData.assigned) {
                        formattedContactTypes.push({
                            handle: handle,
                            primary: contactTypeData.primary ? true : false
                        });
                    }
                });
                dataToUpdate.contactTypes = formattedContactTypes;

                delete dataToUpdate.contactTypesAsString;
            }

            delete dataToUpdate.accessTo;
            delete dataToUpdate.roles;
            delete dataToUpdate.fullname;

            if (userData.id) { // update
                return UserModel.update({id: userData.id}, dataToUpdate).$promise.then(function (data) {
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
            } else { // create
                dataToUpdate = service.initQsUser(dataToUpdate);
                return UserModel.create({}, dataToUpdate).$promise.then(function (data) {
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
            }
        };

        service.savePermissions = function (userData) {
            var UserModel = service.getUserModel(),
                dataToUpdate = {
                    accessTo : [],
                    roles : [],
                    qs: true
                };

            if (userData.accessTo) {
                for (var section in userData.accessTo) {
                    if (userData.accessTo[section]) {
                        dataToUpdate.accessTo.push(section);
                    }
                }
            }

            if (userData.roles) {
                for (var role in userData.roles) {
                    if (userData.roles[role]) {
                        dataToUpdate.roles.push(role);
                    }
                }
            }

            return UserModel.update({id: userData.id}, dataToUpdate).$promise.then(function (data) {
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
         * Set qs users datagrid columns visibility.
         *
         * @param {Object} columnsVisibility
         */
        service.storeColumnsVisibility = function (columnsVisibility) {
            $localStorage.qsUsersGridColumnsVisibility = columnsVisibility;
        };

        /**
         * Get qs users datagrid columns visibility.
         * @returns {Object|*}
         */
        service.getColumnsVisibility = function () {
            return $localStorage.qsUsersGridColumnsVisibility;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('QsUsersListService', [
            '$resource',
            '$q',
            '$log',
            '$localStorage',
            'constants',
            'UsersListService',
            'RequestsQueueService',
            'InstitutionsUsersListService',
            App.services.QsUsers
        ]);

}(window.angular, window.moment));
