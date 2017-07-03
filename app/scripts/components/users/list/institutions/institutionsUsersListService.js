(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.InstitutionsUsers = function (
        $resource,
        $q,
        $log,
        $localStorage,
        constants,
        UsersListService,
        RequestsQueueService
    ) {
        var service = {
            contactTypes : null,
            roles : null,
            sections : null,
            deferred : {
                getContactTypes: null,
                getRoles: null,
                getSections: null
            }
        };

        service.getInstitutionsUsersListModel = function () {
            return $resource(constants.api.usersPermissions.url + '/v1/list/client-users', {}, {
                get: {
                    isArray:false,
                    cancellable : true
                }
            });
        };

        service.getUserModel = function () {
            return $resource(constants.api.usersPermissions.url + '/v1/user/:id', null, {
                update: { method:'PATCH' },
                replace: { method:'PUT' }
            });
        };

        service.getUserInstitutionModel = function () {
            return $resource(constants.api.usersPermissions.url + '/v1/user/institution', null, {
                create: { method: 'POST' }
            });
        };

        /**
         * Get all QS users.
         *
         * @param {Object} params
         * @returns {Promise:Array}
         */
        service.getAllUsers = function (filters) {
            if (constants.dev) {
                var startTime = new Date().getTime(), endTime;
            }

            // cancel currently running requests
            RequestsQueueService.cancelAll('getAllInstitutionsUsers');
            var hasSorting = false,
                 allowedFilters = [
                     'limit',
                     'page'
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
            var Api = service.getInstitutionsUsersListModel().get(filters);

            // add new request to the queue
            RequestsQueueService.add(Api, 'getAllInstitutionsUsers');

            return Api.$promise.then(function (data) {
                if (constants.dev) {
                    endTime = new Date().getTime();
                    $log.log('success, got data: ', data, 'in ' + (endTime - startTime) + ' ms');
                }

                // cancel currently running requests
                RequestsQueueService.cancelAll('getAllInstitutionsUsers');
                data.results = service.formatList(data.results);
                return data;
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return [];
            }).then(function (data) {
                data.results = service.appendContactsData(data.results);
                return data;
            });
        };

        service.appendContactsData = function (userData) {
            if (userData) {
                var contactTypeName = null;

                service.getContactTypes().then(function(contactTypesList) {
                    if (contactTypesList) {
                        angular.forEach(userData, function(userObject) {
                            if (!userObject.contactTypesAsArray) {
                                userObject.contactTypesAsArray = [];
                            }
                            if (!userObject.contactTypes) {
                                return false;
                            }
                            var contactTypes = angular.copy(userObject.contactTypes);
                            userObject.contactTypes = {};
                            angular.forEach(contactTypes, function(contactType) {
                                contactTypeName = UsersListService.getContactTypeNameByHandle(
                                    contactType.handle, contactTypesList
                                );
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
            var deferred = $q.defer();
            service.getContactTypes().then(function(contactTypesList) {
                var contactTypeFilters = [];
                if (contactTypesList) {
                    angular.forEach(contactTypesList, function(contactType) {
                        contactTypeFilters.push({
                            id: contactType.handle,
                            title: contactType.name
                        });
                    });
                }

                deferred.resolve(contactTypeFilters);
            });

            return deferred.promise;
        };

        /**
         * Format QS users list.
         *
         * @param {Object} userData
         * @returns {Object}
         */
        service.formatList = function (userData) {
            if (userData) {
                var accessTo, roles;
                angular.forEach(userData, function(userObject) {
                    accessTo = userObject.accessTo ? angular.copy(userObject.accessTo) : [];
                    userObject.accessTo = {};
                    angular.forEach(accessTo, function(value) {
                        userObject.accessTo[value] = true;
                    });

                    roles = userObject.roles ? angular.copy(userObject.roles) : [];
                    userObject.roles = {};
                    angular.forEach(roles, function(value) {
                        userObject.roles[value] = true;
                        if (value === constants.globalAdminRole) {
                            userObject.globalAdmin = true;
                        }
                    });
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
            // process already running
            if (!service.deferred.getContactTypes) {
                service.deferred.getContactTypes = $q.defer();
            } else {
                return service.deferred.getContactTypes.promise;
            }
            var deferred = service.deferred.getContactTypes;

            // check if data exists in cache
            if (service.contactTypes) {
                deferred.resolve(service.contactTypes);
            } else {
                var Api = $resource(constants.api.usersPermissions.url + '/v1/list/contact-types');
                Api.get(function (data) {
                    if (constants.dev) {
                        $log.log('success, got data: ', data);
                    }
                    service.contactTypes = data.results;
                    deferred.resolve(service.contactTypes);
                    deferred = null;
                }, function (error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                    }
                    service.contactTypes = [];
                    deferred.resolve(service.contactTypes);
                    deferred = null;
                });
            }

            return deferred.promise;
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
         * Get Institutions users roles list.
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
                var Api = $resource(constants.api.usersPermissions.url + '/v1/list/client-roles');
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
         * Get sections list.
         *
         * @returns {Promise:Array}
         */
        service.getSections = function () {
            // process already running
            if (!service.deferred.getSections) {
                service.deferred.getSections = $q.defer();
            } else {
                return service.deferred.getSections.promise;
            }
            var deferred = service.deferred.getSections;

            // check if data exists in cache
            if (service.sections) {
                deferred.resolve(service.sections);
            } else {
                var Api = $resource(constants.api.usersPermissions.url + '/v1/list/client-sections');
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

        service.initInstitutionsUser = function (user) {
            if (!user.hasOwnProperty('contactTypes')) {
                user.contactTypes = [];
            }
            user.roles = [];
            user.accessTo = [];
            user.deleted = false;
            user.active = true;
            user.qs = false;

            return user;
        };

        service.savePersonalDetails = function (userData) {
            var UserModel = service.getUserModel(),
                dataToUpdate = angular.extend({}, userData);
            if (dataToUpdate.contactTypes) {
                var formattedContactTypes = [];

                for (var contactType in dataToUpdate.contactTypes) {
                    if (dataToUpdate.contactTypes[contactType].assigned) {
                        formattedContactTypes.push({
                            handle: contactType,
                            primary: dataToUpdate.contactTypes[contactType].primary ? true : false
                        });
                    }
                }

                dataToUpdate.contactTypes = formattedContactTypes;
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
                UserModel = service.getUserInstitutionModel();
                dataToUpdate = service.initInstitutionsUser(dataToUpdate);
                delete dataToUpdate.id;
                return UserModel.create(dataToUpdate).$promise.then(function (data) {
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
                    roles : []
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
         * Set institutions users datagrid columns visibility.
         *
         * @param {Object} columnsVisibility
         */
        service.storeColumnsVisibility = function (columnsVisibility) {
            $localStorage.institutionUsersGridColumnsVisibility = columnsVisibility;
        };

        /**
         * Get institutions users datagrid columns visibility.
         * @returns {Object|*}
         */
        service.getColumnsVisibility = function () {
            return $localStorage.institutionUsersGridColumnsVisibility;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('InstitutionsUsersListService', [
            '$resource',
            '$q',
            '$log',
            '$localStorage',
            'constants',
            'UsersListService',
            'RequestsQueueService',
            App.services.InstitutionsUsers
        ]);

}(window.angular));
