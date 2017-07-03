(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    /**
     * Service for comun functionality between InstitutionsUsersListService and QsUsersListService
     */
    App.services.usersList = function () {
        var service = {};

        /**
         * Get contact type name by its handle.
         *
         * @param handle
         * @param contactTypesList
         * @returns {string}
         */
        service.getContactTypeNameByHandle = function (handle, contactTypesList) {
            var contactTypeName = '';
            if (contactTypesList) {
                angular.forEach(contactTypesList, function(contactType) {
                    if (contactType.handle && contactType.name && contactType.handle === handle) {
                        contactTypeName = contactType.name;
                        return;
                    }
                });
            }

            return contactTypeName;
        };

        /**
         * Format sections list.
         *
         * @param {Object} sectionsList
         * @returns {Array}
         */
        service.formatSections = function (sectionsList) {
            var flatArray = [],
                firstElement;

            angular.forEach(sectionsList, function (section) {
                firstElement = true;
                angular.forEach(section.pages, function (page) {
                    flatArray.push({
                        'sectionName' : firstElement ? section.name : null,
                        'pageName' : page.name,
                        'pageHandle' : section.handle + '.' + page.handle,
                        'disabled' : page.handle === 'dashboard',
                        'assigned' : page.handle === 'dashboard'
                    });
                    firstElement = false;
                });
            });
            return flatArray;
        };

        /**
         * Assing sections and pages based on user's roles
         *
         * @param {object} userData
         * @param {object} roleList
         * @returns {object}
         */
        service.updateSectionsAndPages = function (userData, roleList) {
            if (roleList !== 'undefined') {
                if (userData.roles &&
                    userData.roles.custom !== 'undefined' &&
                    !userData.roles.custom
                ) {
                    for (var userRole in userData.roles) {
                        if (userData.roles[userRole]) {
                            for (var role in roleList) {
                                if (roleList[role]) {
                                    if (roleList[role].roleHandle !== userRole) {
                                        continue;
                                    }
                                    for (var section in roleList[role].sections) {
                                        if (roleList[role].sections[section]) {
                                            userData.accessTo[roleList[role].sections[section]] = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return userData;
        };

        /**
         * Select all the role children for those users that have All selected and not all the children selected on load
         *
         * @param {object} userData
         * @param {object} roleList
         * @returns {object}
         */
        service.updateRolesWithAll = function (userData, roleList) {
            var childrenRolesHandles = null,
                groupHandle = null;

            for (var userRole in userData.roles) {
                if (userRole.indexOf("all") !== -1 &&
                    userData.roles[userRole]
                ) {
                    groupHandle = userRole.replace('.all', '');
                    childrenRolesHandles = service.getChildrenRoles(groupHandle, roleList);
                    if (childrenRolesHandles) {
                        for (var childrenRoleHandle in childrenRolesHandles) {
                            if (childrenRoleHandle) {
                                userData.roles[childrenRolesHandles[childrenRoleHandle]] = true;
                            }
                        }
                    }
                }
            }
            return userData;
        };

        /**
         * Gets children roles for a given parent (all) role
         *
         * @param {string} groupHandle
         * @param {object} rolesList
         */
        service.getChildrenRoles = function (groupHandle, rolesList) {
            var childrenRoles = [];
            angular.forEach(rolesList, function (role) {

                if (role.all || role.groupHandle !== groupHandle) {
                    return false;
                }

                childrenRoles.push(role.roleHandle);
            });

            return childrenRoles;
        };

        /**
         * Gets parent role for a given child role
         *
         * @param {string} groupHandle
         * @param {object} rolesList
         */
        service.getParentRoleHandle = function (groupHandle, rolesList) {
            var parentRoleHandle = null;

            if (rolesList) {
                angular.forEach(rolesList, function (role) {
                    if (!role.all || role.groupHandle !== groupHandle) {
                        return false;
                    }
                    parentRoleHandle = role.roleHandle;
                });
            }

            return parentRoleHandle;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('UsersListService', [
            App.services.usersList
        ]);

}(window.angular));
