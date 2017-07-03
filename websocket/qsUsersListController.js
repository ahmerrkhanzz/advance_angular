(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    /**
     *
     * @param $scope
     * @param $resource
     * @param NgTableParams
     * @param constants
     * @param QsUsersService
     * @param UsersListService
     * @param NotifierFactory factory for notifications
     * @param PasswordService
     */
    App.controllers.qsUsersList = function (
        $scope, $resource, NgTableParams, constants, QsUsersService, UsersListService, NotifierFactory, PasswordService
    ) {
        var controller = this;
        controller.devMode = constants.dev;
        $scope.user = {};
        $scope.userBeforeChanges = {};
        $scope.forms = {};
        $scope.filterActive = true;
        $scope.isDatagridReloading = false;
        $scope.showQsSections = false;
        $scope.showClientSections = false;
        $scope.activeQsUserListSubTabs = 0;
        $scope.disabledQsUserListSubTabs = {
            'personalDetails' : false,
            'permissions' : true
        };
        controller.filters = {
            lastLoginAtRange: {
                startDate: null,
                endDate: null
            }
        };
        $scope.newUser = {};
        $scope.newUserPanelNotClosed = false;

        $scope.columns = [
            {
                title: 'Email',
                sortable: 'email',
                filter: {email: 'text'},
                show: true,
                field: 'email'
            },
            {
                title: 'Fullname',
                sortable: 'fullname',
                filter: {fullname: 'text'},
                show: true,
                field: 'fullname'
            },
            {
                title: 'Contact Types',
                filter: {'contactTypes.handle': 'chosenSelect'},
                filterData: function ($scope, $column) {
                    return QsUsersService.getContactTypesFilter().then(function (options) {
                        $column.$column.data = options;
                    });
                },
                show: true,
                field: 'contactTypesAsString'
            },
            {
                title: 'Last Login',
                sortable: 'lastLoginAt',
                filter: {lastLoginAtRange: 'date-range-picker'},
                show: true,
                field: 'lastLoginAt'
            }
        ];

        /**
         * Update active user data in datagrid.
         */
        controller.updateInDatagrid = function () {
            if ($scope.selectedUserId && $scope.userBeforeChanges) {
                angular.forEach($scope.tableParams.data, function (value, key) {
                    if (value.id === $scope.selectedUserId) {
                        $scope.tableParams.data[key] = angular.copy($scope.userBeforeChanges);
                    }
                });
            }
        };


        $scope.handleDatagridRowClick = function (user, forceClose) {
            if (angular.isUndefined(forceClose)) {
                forceClose = false;
            }
            $scope.userBeforeChanges = angular.copy(user);

            $scope.selectedUserId = ($scope.selectedUserId === user.id) ? null : user.id;
            if ($scope.selectedUserId) {
                $scope.disabledQsUserListSubTabs.permissions = false;
            } else {
                $scope.activeQsUserListSubTabs = 0;
                $scope.disabledQsUserListSubTabs.permissions = true;
            }
            $scope.user = angular.copy(user);
            // Get primary insitution info for new user when edit mode is still on
            var newUserPanelNotClosed = $scope.newUserPanelNotClosed && angular.isDefined($scope.user),
                accessTo = null,
                roles = null;
            if (newUserPanelNotClosed) {
                accessTo = $scope.user.accessTo;
                roles = $scope.user.roles;
            }
            if (newUserPanelNotClosed) {
                $scope.user.accessTo = accessTo;
                $scope.user.roles = roles;
            }
            $scope.userBeforeChanges = angular.copy(user);
            $scope.showInfoBlock = forceClose ? false : $scope.selectedUserId === user.id;

            if ($scope.selectedUserId === user.id && !forceClose) {
                if (!$scope.columnsBeforeEdit) {
                    // make copy of columns visibility
                    $scope.columnsBeforeEdit = angular.copy($scope.columns);
                    // hide all columns except "name"
                    angular.forEach($scope.columns, function (column) {
                        column.show = column.field === 'email';
                    });
                }
                $scope.filterActive = false;
                $scope.user = UsersListService.updateRolesWithAll($scope.user, controller.rolesList);
                $scope.user = UsersListService.updateSectionsAndPages($scope.user, controller.rolesList);
            } else {
                if (angular.isDefined($scope.columnsBeforeEdit)) {
                    $scope.columns = angular.copy($scope.columnsBeforeEdit);
                }
                $scope.columnsBeforeEdit = null;
                $scope.filterActive = true;
                $scope.newUserPanelNotClosed = false;
            }
        };

        /**
         * Reset user form.
         */
        $scope.handleResetClick = function () {
            $scope.user = angular.copy($scope.userBeforeChanges);
        };

        /**
         * Actions to do when deactivation is triggered.
         *
         * @param {Object} user
         * @returns {boolean}
         */
        $scope.handleDeactivateClick = function (user) {
            if (!user.id || $scope.deactivateInProgress) {
                return false;
            }
            $scope.deactivateInProgress = true;
            QsUsersService.deactivate(user.id).then($scope.deactivationCallback);
        };

        $scope.handleActivateClick = function (user) {
            if (!user.id || $scope.activateInProgress) {
                return false;
            }
            $scope.activateInProgress = true;
            QsUsersService.activate(user.id).then($scope.activationCallback);
        };

        $scope.deactivationCallback = function (success)
        {
            $scope.user.active = success ? false : true;
            $scope.userBeforeChanges = $scope.user.active;
            $scope.deactivateInProgress = false;

            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'Deactivated successfully!' : 'Deactivation failed!',
                'Deactivation'
            );
        };

        $scope.activationCallback = function (success)
        {
            $scope.user.active = success ? true : false;
            $scope.userBeforeChanges = $scope.user.active;
            $scope.activateInProgress = false;

            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'Activated successfully!' : 'Activation failed!',
                'Activation'
            );
        };

        $scope.handleNewUserResponse = function (response) {
            if (response.hasOwnProperty('insertedId') && response.insertedId.length > 0) {
                $scope.user.id = response.insertedId;
                $scope.user.active = true;
                angular.copy($scope.user, $scope.userBeforeChanges);
                $scope.disabledQsUserListSubTabs.permissions = false;
                // switch tab after user add
                $scope.activeQsUserListSubTabs = 1;
                angular.copy($scope.user, $scope.newUser);
                $scope.tableParams.reload();
                $scope.selectedUserId = $scope.user.id;
                $scope.newUserPanelNotClosed = true;
            }
        };

        /**
         * Store user data.
         */
        $scope.handlePersonalDetailsSubmit = function () {
            var newUser = typeof $scope.user.id === 'undefined';
            if (
                $scope.personalDetailsSubmitInProgress ||
                !$scope.forms.personalDetailsForm ||
                !$scope.forms.personalDetailsForm.$valid
            ) {
                return false;
            }

            if (
                (newUser && !PasswordService.isPasswordValid($scope.user.password)) ||
                (!newUser && typeof $scope.user.password !== 'undefined' && !PasswordService.isPasswordValid($scope.user.password))
            ) {
                NotifierFactory.show(
                    'error',
                    'Please set a valid password'
                );

                return false;
            }

            $scope.personalDetailsSubmitInProgress = true;
            QsUsersService.savePersonalDetails($scope.user).then(function (response) {
                var message = 'Personal Details',
                    success = false;
                if (response) {
                    success = !response.error;
                    if (!success) {
                        if (response.hasOwnProperty('message') && response.message.length) {
                            message = response.message;
                        }
                    } else {
                        $scope.user.fullname = QsUsersService.getFullName($scope.user);
                        if ($scope.user.contactTypes) {
                            QsUsersService.getContactTypes().then(function (contactTypesList) {
                                if (!contactTypesList) {
                                    return false;
                                }
                                var contactTypeNames = [],
                                    contactTypeName = null;
                                angular.forEach($scope.user.contactTypes, function (contactTypeData, handle) {
                                    if (!contactTypeData.assigned) {
                                        return false;
                                    }
                                    contactTypeName = UsersListService.getContactTypeNameByHandle(
                                        handle, contactTypesList
                                    );
                                    contactTypeNames.push(contactTypeName);
                                });
                                $scope.user.contactTypesAsString = contactTypeNames.join(', ');
                                $scope.handleNewUserResponse(response);

                            });
                        } else {
                            $scope.handleNewUserResponse(response);
                        }
                    }
                }
                delete $scope.user.password;
                // update original user object with changes
                $scope.userBeforeChanges = angular.copy($scope.user);
                // update user data in datagrid
                controller.updateInDatagrid();
                $scope.personalDetailsSubmitInProgress = false;

                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Saved successfully!' : 'Saving failed!',
                    message
                );
            });
        };

        $scope.handlePermissionsSubmit = function () {
            $scope.permissionsSubmitInProgress = true;
            QsUsersService.savePermissions($scope.user).then(function (success) {
                $scope.permissionsSubmitInProgress = false;
                $scope.userBeforeChanges = angular.copy($scope.user);
                // update user data in datagrid
                controller.updateInDatagrid();
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Saved successfully!' : 'Saving failed!',
                    'Permissions'
                );
            });
        };

        $scope.handlePrimaryContactTypeClick = function (handle) {
            $scope.user.contactTypes[handle].assigned = true;
        };

        $scope.handleAssignedContactTypeClick = function (handle) {
            if ($scope.user.contactTypes[handle].assigned === false) {
                $scope.user.contactTypes[handle].primary = false;
            }
        };

        $scope.handleRoleClick = function (clickedRole) {
            // do nothing if user has custom role
            if ($scope.user.roles.custom || typeof clickedRole === 'undefined') {
                return;
            }

            $scope.user.accessTo = {};
            var clickedRoleAssigned = $scope.user.roles[clickedRole.roleHandle],
                parentRoleClicked = clickedRole.all,
                globalAdminRoleClicked = clickedRole.roleHandle === 'global_admin.global_admin',
                childrenRolesHandles = UsersListService.getChildrenRoles(clickedRole.groupHandle, controller.rolesList),
                parentRoleHandle= null;

            // check if it's global admin
            if (globalAdminRoleClicked && clickedRoleAssigned) {
                // walk threw all system roles
                angular.forEach(controller.rolesList, function (role) {
                    if (role.roleHandle === 'custom') {
                        return false;
                    }
                    // assign all role sections to a user
                    angular.forEach(role.sections, function (section) {
                        $scope.user.accessTo[section] = true;
                    });
                });
            } else {
                if (!globalAdminRoleClicked) {
                    // if role is assigned
                    if (clickedRoleAssigned) {
                        // if its parent role
                        if (parentRoleClicked) {
                            // assign children roles to a user
                            childrenRolesHandles = UsersListService.getChildrenRoles(clickedRole.groupHandle, controller.rolesList);
                            if (childrenRolesHandles) {
                                angular.forEach(childrenRolesHandles, function (childrenRoleHandle) {
                                    $scope.user.roles[childrenRoleHandle] = true;
                                });
                            }
                        } else {
                            if (childrenRolesHandles) {
                                // Select parent if all children were selected
                                var allDepartments = true;
                                angular.forEach(childrenRolesHandles, function (childrenRoleHandle) {
                                    if ($scope.user.roles[childrenRoleHandle] === false ||
                                        $scope.user.roles[childrenRoleHandle] === undefined
                                    ) {
                                        allDepartments = false;
                                        return;
                                    }
                                });
                                if (allDepartments) {
                                    parentRoleHandle = UsersListService.getParentRoleHandle(clickedRole.groupHandle, controller.rolesList);
                                    if (parentRoleHandle) {
                                        $scope.user.roles[parentRoleHandle] = true;
                                    }
                                }
                            }
                        }
                    } else {
                        if (!parentRoleClicked) {
                            // Uncheck parent if it was selected when unselecting one children
                            parentRoleHandle = UsersListService.getParentRoleHandle(clickedRole.groupHandle, controller.rolesList);
                            if (parentRoleHandle) {
                                $scope.user.roles[parentRoleHandle] = false;
                            }
                        } else {
                            // check if all children where selected to select the parent
                            if (childrenRolesHandles) {
                                angular.forEach(childrenRolesHandles, function (childrenRoleHandle) {
                                    $scope.user.roles[childrenRoleHandle] = false;
                                });
                            }
                        }
                    }
                }
                // Update sections and pages based on the new roles
                $scope.user = UsersListService.updateSectionsAndPages($scope.user, controller.rolesList);
            }
        };

        $scope.toggleQsSections = function() {
            $scope.showQsSections = !$scope.showQsSections;
        };

        $scope.toggleClientSections = function() {
            $scope.showClientSections = !$scope.showClientSections;
        };

        $scope.activateCustomRole = function () {
            if (!angular.isDefined($scope.user.roles)) {
                $scope.user.roles = {};
            }
            $scope.user.roles.custom = true;
        };

        $scope.clearFilters = function () {
            $scope.tableParams.filter(angular.copy(controller.filters));
            $scope.tableParams.sorting({});
        };

        $scope.hasFilters = function () {
            if (
                $scope.tableParams.hasFilter() &&
                !angular.equals($scope.tableParams.filter(), controller.filters)
            ) {
                return true;
            }
            if (Object.keys($scope.tableParams.sorting()).length !== 0) {
                return true;
            }

            return false;
        };

        controller.loadData = function () {
            QsUsersService.getContactTypes().then(function(contactTypes) {
                controller.contactTypes = contactTypes;
            });
            QsUsersService.getRoles().then(function(rolesList) {
                controller.rolesList = rolesList;
            });
            QsUsersService.getSections().then(function(sectionsList) {
                controller.qsSectionsList = sectionsList;
            });
            QsUsersService.getSections(true).then(function(sectionsList) {
                controller.clientSectionsList = sectionsList;
            });
        };

        /**
         * Actions to do when column is clicked under visible columns dropdown.
         */
        $scope.handleColumnClick = function () {
            var columnsVisibility = {};
            angular.forEach($scope.columns, function (column) {
                columnsVisibility[column.field] = column.show;
            });
            QsUsersService.storeColumnsVisibility(columnsVisibility);
        };

        /**
         * Apply datagrid columns visibility from browser cache.
         */
        controller.loadDatagridColumnsVisibility = function () {
            var columnsVisibility = QsUsersService.getColumnsVisibility();
            if (columnsVisibility) {
                angular.forEach($scope.columns, function (column) {
                    if (columnsVisibility[column.field] !== 'undefined') {
                        column.show = columnsVisibility[column.field] ? true : false;
                    }
                });
            }
        };

        controller.initDataGrid = function () {
            $scope.tableParams = new NgTableParams({
                page: 1, // show first page
                count: 10, // count per page
                filter: angular.copy(controller.filters)
            }, {
                debugMode: constants.dev,
                getData: function(params) {
                    $scope.isDatagridReloading = true;
                    return QsUsersService.getAllUsers(params).then(function(response) {
                        $scope.isDatagridReloading = false;
                        if ($scope.newUser.hasOwnProperty('id')) {
                            response.unshift($scope.newUser);
                            while (response.length > $scope.tableParams.count()) {
                                response.pop();
                            }
                            $scope.newUser = {};
                        }

                        return response;
                    });
                }
            });
        };

        controller.handleAddQsUserClick = function () {
            var user = {};
            user.id = null;
            $scope.activeQsUserListSubTabs = 0;
            $scope.handleDatagridRowClick(user);
        };

        controller.handleEditCloseClick = function () {
            var user = {};
            user.id = $scope.selectedUserId;
            $scope.handleDatagridRowClick(user, true);
        };

        controller.init = function () {
            controller.loadData();
            controller.initDataGrid();
            controller.loadDatagridColumnsVisibility();
        };

        controller.init();
    };

    angular
        .module('qsHub')
        .controller('QsUsersListController', [
            '$scope',
            '$resource',
            'NgTableParams',
            'constants',
            'QsUsersListService',
            'UsersListService',
            'NotifierFactory',
            'PasswordService',
            App.controllers.qsUsersList
        ]);

}(window.angular));
