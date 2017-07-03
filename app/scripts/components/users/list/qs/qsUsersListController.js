(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.qsUsersList = function (
        $scope,
        $resource,
        $timeout,
        constants,
        uiGridConstants,
        QsUsersService,
        UsersListService,
        NotifierFactory,
        GridService,
        PasswordService,
        WatchService
    ) {
        var controller = this;
        controller.devMode = constants.dev;
        controller.grid = {};
        controller.defaultPaginationOptions = {
            page: 1,
            limit: constants.datagrid.contacts.defaultRowsNumber
        };

        controller.paginationOptions = GridService.getColumnsFilters(
            constants.gridNameSpaces.qsUserGridFilters,
            ['lastLoginAtRange']
        );

        controller.columnsVisibility = GridService.getColumnsVisibility(
            constants.gridNameSpaces.qsUserGridVisibility
        );
        controller.defaultFilters = {
            lastLoginAtRange: {
                startDate: null,
                endDate: null
            }
        };

        $scope.user = {};
        $scope.userBeforeChanges = {};
        $scope.forms = {};
        $scope.filterActive = true;
        $scope.isDatagridReloading = false;
        $scope.showQsSections = false;
        $scope.showClientSections = false;
        $scope.activeQsUserListSubTabs = 0;
        $scope.disabledQsUserListSubTabs = {
            'personalDetails': false,
            'permissions': true
        };
        $scope.newUser = {};
        $scope.newUserPanelNotClosed = false;
        $scope.filters = controller.defaultFilters;
        $scope.columnsBeforeHide = [];
        $scope.visible = {};

        /**
         * Update active user data in datagrid.
         */
        controller.updateInDatagrid = function (item) {
            var totalItems = controller.grid.options.data.length,
                key = 0;
            for (key; key < totalItems; ++key) {
                if (controller.grid.options.data[key].id === item.id) {
                    controller.grid.options.data[key] = angular.copy($scope.userBeforeChanges);
                    return true;
                }
                $scope.columnsBeforeEdit = null;
                $scope.filterActive = true;
                $scope.newUserPanelNotClosed = false;
            }
            return false;
        };

        $scope.handleLastLoginAtDateRange = function (event) {
            if (event.model.startDate && event.model.endDate) {
                controller.grid.options.columnDefs[3].filters[0].term = event.model.startDate.format('x');
                controller.grid.options.columnDefs[3].filters[1].term = event.model.endDate.format('x');
            }
        };

        $scope.handleDatagridRowClick = function (user, addUser) {
            PasswordService.setHasErrors(true);
            $scope.disabledQsUserListSubTabs.permissions = false;
            $scope.disabledQsUserListSubTabs.institutions = false;
            if (angular.isDefined(addUser) && addUser) {
                $scope.disabledQsUserListSubTabs.permissions = true;
            }
            if ($scope.selectedUserId === user.id) {
                $scope.selectedUserId = 0;
                $scope.showInfoBlock = false;
                $scope.filterActive = true;
                controller.toggleColumns(false);
            } else { //edit mode
                $scope.selectedUserId = user.id;
                $scope.showInfoBlock = true;
                $scope.filterActive = false;

                $scope.user = angular.copy(user);
                $scope.userBeforeChanges = user;
                $scope.user = UsersListService.updateRolesWithAll($scope.user, controller.rolesList);
                $scope.user = UsersListService.updateSectionsAndPages($scope.user, controller.rolesList);

                controller.rolesBeforeChanges = [];
                for (var role in user.roles) {
                    if (user.roles[role]) {
                        controller.rolesBeforeChanges[role] = true;
                    }
                }
                controller.toggleColumns(true);
            }
        };

        /**
         * Toggle datagrid columns visibility.
         *
         * @param {boolean} hide
         */
        controller.toggleColumns = function (hide) {
            if (!controller.grid.options) {
                return;
            }
            if (hide) {
                angular.forEach(controller.grid.options.columnDefs, function (column) {
                    if (angular.isDefined(column.visible) && column.visible === true) {
                        $scope.columnsBeforeHide.push(column);
                    }
                    $scope.visible[column.field] = column.visible;
                });
                // hide all columns except name
                angular.forEach(controller.grid.options.columnDefs, function (column) {
                    column.visible = column.field === 'email';
                });
            } else {
                // show columns visible before hide
                angular.forEach($scope.columnsBeforeHide, function (column) {
                    column.visible = true;
                });
                $scope.columnsBeforeHide = [];

                $scope.$broadcast(constants.events.closingInstitutionsUsers);
            }

            controller.grid.options.enableGridMenu = !hide;
            controller.grid.options.enableColumnMenus = !hide;
            controller.grid.options.enableColumnResizing = !hide;
            controller.grid.options.enablePaginationControls = !hide;
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
            QsUsersService.deactivate(user.id).then(controller.deactivationCallback);
        };

        $scope.handleActivateClick = function (user) {
            if (!user.id || $scope.activateInProgress) {
                return false;
            }
            $scope.activateInProgress = true;
            QsUsersService.activate(user.id).then(controller.activationCallback);
        };

        controller.deactivationCallback = function (success) {
            $scope.user.active = success ? false : true;
            if (success) {
                $scope.userBeforeChanges.active = $scope.user.active;
                // update user data in datagrid
                controller.updateInDatagrid($scope.user);
            }
            $scope.deactivateInProgress = false;

            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'Deactivated successfully!' : 'Deactivation failed!',
                'Deactivation'
            );
        };

        controller.activationCallback = function (success) {
            $scope.user.active = success ? true : false;
            if (success) {
                $scope.userBeforeChanges.active = $scope.user.active;
                // update user data in datagrid
                controller.updateInDatagrid($scope.user);
            }
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
                controller.reloadDatagrid();
                $scope.selectedUserId = $scope.user.id;
                $scope.newUserPanelNotClosed = true;
            }
        };

        /**
         * Store user data.
         */
        $scope.handlePersonalDetailsSubmit = function () {
            $scope.forms.personalDetailsForm.firstname.$setDirty();
            $scope.forms.personalDetailsForm.lastname.$setDirty();
            $scope.forms.personalDetailsForm.email.$setDirty();
            PasswordService.setHasErrors(
                $scope.user.id ||
                !!$scope.forms.personalDetailsForm.password.$viewValue ? true : false
            );
            if (
                $scope.personalDetailsSubmitInProgress ||
                !$scope.forms.personalDetailsForm ||
                !$scope.forms.personalDetailsForm.$valid ||
                !PasswordService.isValid($scope.forms.personalDetailsForm, $scope.user) ||
                !PasswordService.getHasErrors()

            ) {
                return false;
            }
            var newUser = typeof $scope.user.id === 'undefined';
            // if is new user and the password is not set or setting password for existing user
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
                var message = 'Personal Details';
                var success = false;
                if (response) {
                    success = !response.error;
                    if (!success) {
                        if (response.hasOwnProperty('message') && response.message.length > 0) {
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
                                // update original user object with changes
                                $scope.userBeforeChanges = angular.copy($scope.user);
                                controller.updateInDatagrid($scope.user);
                            });
                        } else {
                            $scope.handleNewUserResponse(response);
                        }
                        //reset personalDetailsForm
                        controller.resetPersonalDetailsForm();
                    }
                }
                if (success) {
                    delete $scope.user.password;
                    // update original user object with changes
                    $scope.userBeforeChanges = angular.copy($scope.user);
                    // update user data in datagrid
                    controller.updateInDatagrid($scope.user);
                }
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
                controller.updateInDatagrid($scope.user);
                controller.reloadDatagrid();
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

            $scope.user.accessTo = {
                'admin_dashboard.dashboard': true
            };
            var clickedRoleAssigned = $scope.user.roles[clickedRole.roleHandle],
                parentRoleClicked = clickedRole.all,
                globalAdminRoleClicked = clickedRole.roleHandle === 'global_admin.global_admin',
                childrenRolesHandles = UsersListService.getChildrenRoles(clickedRole.groupHandle, controller.rolesList),
                parentRoleHandle = null;

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

        $scope.toggleQsSections = function () {
            $scope.showQsSections = !$scope.showQsSections;
        };

        $scope.toggleClientSections = function () {
            $scope.showClientSections = !$scope.showClientSections;
        };

        $scope.activateCustomRole = function () {
            if (!angular.isDefined($scope.user.roles)) {
                $scope.user.roles = {
                    custom: true
                };
            }
            $scope.user.roles = {
                custom: true
            };
        };

        controller.loadData = function () {
            QsUsersService.getContactTypes().then(function (contactTypes) {
                controller.contactTypes = contactTypes;
            });
            QsUsersService.getRoles().then(function (rolesList) {
                controller.rolesList = rolesList;
            });
            QsUsersService.getSections().then(function (sectionsList) {
                controller.qsSectionsList = sectionsList;
            });
            QsUsersService.getSections(true).then(function (sectionsList) {
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

        controller.handleGridFiltersChanges = function () {
            controller.paginationOptions = angular.copy(controller.defaultPaginationOptions);
            var filterColumn, sortColumn;
            angular.forEach($scope.gridApi.grid.columns, function (column) {
                filterColumn = column.filters[0].column ? column.filters[0].column : column.field;
                if (column.field === 'lastLoginAt') {
                    if (
                        typeof column.filters !== 'undefined' &&
                        typeof column.filters[0].term !== 'undefined' &&
                        typeof column.filters[1].term !== 'undefined'
                    ) {
                        controller.paginationOptions['filter[' + filterColumn + ']'] = {
                            startDate: column.filters[0].term && isNaN(column.filters[0].term) ?
                                column.filters[0].term.format('x') : column.filters[0].term,
                            endDate: column.filters[1].term && isNaN(column.filters[1].term) ?
                                column.filters[1].term.format('x') : column.filters[1].term
                        };
                    } else {
                        controller.paginationOptions['filter[' + filterColumn + ']'] = null;
                    }
                } else if ((column.field === 'contactTypesAsString' ||
                    column.field === 'contactTypes.handle') &&
                    typeof column.filters !== 'undefined' &&
                    column.filters[0].term !== 'undefined' &&
                    column.filters[0].term &&
                    column.filters[0].term.value
                ) {
                    controller.paginationOptions['filter[contactTypes.handle]'] = column.filters[0].term.value;
                } else {
                    if (typeof column.filters !== 'undefined' && column.filters[0].term !== 'undefined') {
                        controller.paginationOptions['filter[' + filterColumn + ']'] = column.filters[0].term;
                    }
                }

                if (typeof column.sort.direction !== 'undefined') {
                    sortColumn = column.sort.column ? column.sort.column : column.field;
                    controller.paginationOptions['sorting[' + sortColumn + ']'] = column.sort.direction;
                }
            });
            if (controller.paginationOptions["filter[lastLoginAt]"] === null) {
                controller.paginationOptions["filter[lastLoginAt]"] = controller.defaultFilters.lastLoginAtRange;
            }
            if (controller.paginationOptions["filter[lastLoginAt]"].startDate === null) {
                controller.paginationOptions["filter[lastLoginAt]"].endDate = null;
                controller.defaultFilters.lastLoginAtRange = {
                    startDate: null,
                    endDate: null
                };
            }
            GridService.storeColumnsFilters(
                constants.gridNameSpaces.qsUserGridFilters,
                controller.paginationOptions
            );

            if (angular.isDefined($scope.filterTimeout)) {
                $timeout.cancel($scope.filterTimeout);
            }
            $scope.filterTimeout = $timeout(function () {
                controller.getPage();
            }, 500);
        };

        controller.getPage = function () {
            $scope.isDatagridReloading = true;
            return QsUsersService.getAllUsers(
                angular.merge({}, controller.paginationOptions, controller.defaultPaginationOptions)
            ).then(function (response) {
                controller.grid.options.totalItems = response.totalMatching;
                controller.grid.options.data = response.results;
                controller.grid.options.minRowsToShow = response.totalFiltered;
                $scope.isDatagridReloading = false;
            });
        };

        controller.reloadDatagrid = function () {
            controller.getPage();
        };

        controller.initDataGrid = function () {
            var selectTemplate = '/scripts/shared/ui-grid/templates/selectFilterHeaderTemplate.html',
                selectCellTemplate = '/scripts/shared/ui-grid/templates/selectCellTemplate.html',
                dateCellTemplate = '/scripts/shared/ui-grid/templates/dateCellTemplate.html';

            controller.grid.options = {
                enableSorting: true,
                exporterMenuCsv: false,
                enableGridMenu: true,
                showGridFooter: false,
                selectedItems: $scope.selectedUserId,
                enableFiltering: true,
                enableColumnResize: true,
                enableFullRowSelection: true,
                enableRowSelection: true,
                multiSelect: false,
                enableRowHeaderSelection: false,
                paginationPageSizes: [constants.datagrid.contacts.defaultRowsNumber, 50, 100],
                paginationPageSize: constants.datagrid.contacts.defaultRowsNumber,
                useExternalPagination: true,
                useExternalSorting: true,
                useExternalFiltering: true,
                rowTemplate: '/scripts/components/users/list/institutions/datagrid/rowTemplate.html',
                columnDefs: [
                    {
                        displayName: 'Email',
                        field: 'email',
                        cellFilter: 'lowercase',
                        visible: true,
                        filter: {
                            term: GridService.getFilterByField(controller.paginationOptions, 'email', '')
                        }
                    },
                    {
                        displayName: 'Full Name',
                        field: 'fullname',
                        visible: GridService.getVisibilityByField(controller.columnsVisibility, 'fullname', true),
                        filter: {
                            term: GridService.getFilterByField(controller.paginationOptions, 'fullname', '')
                        }
                    },
                    {
                        displayName: 'Contact Types',
                        filter: {
                            type: uiGridConstants.filter.SELECT,
                            selectOptions: [],
                            term: GridService.getFilterByField(controller.paginationOptions, 'contactTypes.handle')
                        },
                        field: 'contactTypesAsString',
                        maxWidth: 130,
                        visible: GridService.getVisibilityByField(controller.columnsVisibility, 'contactTypes.handle', true),
                        filterHeaderTemplate: selectTemplate
                    },
                    {
                        displayName: 'Last Login',
                        field: 'lastLoginAt',
                        filterCellFiltered: true,
                        filters: [
                            {
                                visible: true,
                                condition: uiGridConstants.filter.GREATER_THAN
                            },
                            {
                                condition: uiGridConstants.filter.LESS_THAN
                            }
                        ],
                        filter: {
                            term: GridService.getFilterByField(controller.paginationOptions, 'lastLoginAt', ''),
                            applyTextFilter: controller.applyDateFilter('lastLoginAt', '')
                        },
                        cellTemplate: dateCellTemplate,
                        filterHeaderTemplate: '/scripts/components/users/list/institutions/datagrid/dateFilterHeaderTemplate.html',
                        visible: GridService.getVisibilityByField(controller.columnsVisibility, 'lastLoginAt', true)
                    }
                ],
                onRegisterApi: function (gridApi) {
                    var columnsVisibilityBeforeChanges = angular.copy(controller.grid.options.columnDefs);
                    $scope.gridApi = gridApi;
                    gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                        $scope.handleDatagridRowClick(row.entity);
                    });
                    gridApi.core.on.rowsRendered($scope, function () {
                        $scope.isDatagridRendered = true;
                    });
                    gridApi.core.on.filterChanged($scope, controller.handleGridFiltersChanges);
                    gridApi.core.on.rowsVisibleChanged($scope, controller.handleGridVisibleChanges);

                    gridApi.pagination.on.paginationChanged($scope, function (newPage, limit) {
                        controller.defaultPaginationOptions.page = newPage;
                        controller.defaultPaginationOptions.limit = limit;
                        controller.getPage();
                    });
                    $scope.gridApi.core.on.sortChanged($scope, controller.handleGridFiltersChanges);
                    // reset columns visibility
                    GridService.resetExtend(columnsVisibilityBeforeChanges, controller.grid.options.columnDefs, controller.defaultFilters);
                }
            };

            // This is needed to add 'x' icon in date field when prepopulating dates
            var lastLogin = GridService.getFilterByField(controller.paginationOptions, 'lastLoginAt', '');
            if (lastLogin !== null && controller.paginationOptions["filter[lastLoginAt]"] !== null) {
                if (angular.isDefined(lastLogin) &&
                    angular.isDefined(controller.paginationOptions["filter[lastLoginAt]"]) &&
                    angular.isDefined(controller.paginationOptions["filter[lastLoginAt]"].startDate) &&
                    angular.isDefined(controller.paginationOptions["filter[lastLoginAt]"].endDate)
                ) {
                    controller.grid.options.columnDefs[3].filters[0].term = controller.paginationOptions["filter[lastLoginAt]"].startDate;
                    controller.grid.options.columnDefs[3].filters[1].term = controller.paginationOptions["filter[lastLoginAt]"].endDate;
                }
            }

            controller.getPage().then(function () {
                QsUsersService.getContactTypesFilter().then(function (options) {
                    var list = [];

                    angular.forEach(options, function (option) {
                        list.push({
                            value: option.id,
                            label: option.title
                        });
                    });
                    controller.grid.options.columnDefs[2].filter.selectOptions = list;
                });
            });
        };

        controller.handleGridVisibleChanges = function () {
            var columnsVisibility = GridService.getColumnsVisibility(constants.gridNameSpaces.qsUserGridVisibility),
                reload = false;

            if (columnsVisibility && $scope.filterActive) {
                angular.forEach(controller.grid.options.columnDefs, function (column, key) {
                    if (columnsVisibility[column.field] === true &&
                        column.visible === false
                    ) {
                        controller.grid.options.columnDefs[key].filter.term = null;
                        controller.paginationOptions['filter[' + column.field + ']'] = null;
                        reload = true;
                        if (column.field === 'lastLoginAt') {
                            delete controller.grid.options.columnDefs[key].filters[0].term;
                            controller.defaultFilters.lastLoginAtRange = {
                                startDate: null,
                                endDate: null
                            };
                        }
                    }
                });
            }
            if ($scope.filterActive) {
                controller.saveStateVisibility();
            }
            if (reload) {
                controller.getPage();
            }
        };

        /**
         * Populates input text field for date field
         *
         * @param {string} filterName
         * @param {mixed} defaultValue
         */
        controller.applyDateFilter = function (filterName, defaultValue) {
            var filter = GridService.getFilterByField(controller.paginationOptions, filterName, defaultValue);
            if (angular.isDefined(filter) &&
                filter !== null
            ) {
                if (angular.isDefined(filter.startDate) &&
                    angular.isDefined(filter.endDate)
                ) {
                    if (filter.startDate !== null &&
                        filter.startDate !== null
                    ) {
                        controller.defaultFilters.lastLoginAtRange = {
                            startDate: parseInt(filter.startDate, 10),
                            endDate: parseInt(filter.endDate, 10)
                        };
                    } else {
                        controller.defaultFilters.lastLoginAtRange = {
                            startDate: null,
                            endDate: null
                        };
                    }
                }
            }
        };

        controller.handleAddQsUserClick = function () {
            var user = {
                accessTo: {
                    'admin_dashboard.dashboard': true
                }
            };
            user.id = null;
            $scope.activeQsUserListSubTabs = 0;
            $scope.handleDatagridRowClick(user, true);
            controller.resetPersonalDetailsForm();
        };

        //reset personalDetailsForm
        controller.resetPersonalDetailsForm = function () {
            if ($scope.forms.personalDetailsForm) {
                $scope.forms.personalDetailsForm.$setPristine();
            }
        };
        controller.handleEditCloseClick = function () {
            var user = {};
            user.id = $scope.selectedUserId;
            $scope.handleDatagridRowClick(user, true);
        };

        controller.convertVisibleColumnsField = function (value) {
            switch (value) {
                case 'contactTypesAsString':
                    return 'contactTypes.handle';
            }
        };

        controller.isValidFirstName = function () {
            return PasswordService.isValidFirstName($scope.forms.personalDetailsForm, $scope.user);
        };

        controller.isValidLastName = function () {
            return PasswordService.isValidLastName($scope.forms.personalDetailsForm, $scope.user);
        };

        controller.isValidEmail = function () {
            return PasswordService.isValidEmail($scope.forms.personalDetailsForm, $scope.user);
        };

        controller.setValid = function (fieldName) {
            return PasswordService.setValid($scope.forms.personalDetailsForm, fieldName);
        };

        controller.saveStateVisibility = function () {
            var visibility = angular.copy(controller.grid.options.columnDefs);
            angular.forEach(visibility, function (column) {
                if (['contactTypesAsString'].indexOf(column.field) !== -1) {
                    column.field = controller.convertVisibleColumnsField(column.field);
                }
            });
            GridService.storeColumnsVisibility(
                constants.gridNameSpaces.qsUserGridVisibility,
                GridService.getGridColumnsVisibility(visibility)
            );
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
            '$timeout',
            'constants',
            'uiGridConstants',
            'QsUsersListService',
            'UsersListService',
            'NotifierFactory',
            'UiGridService',
            'PasswordService',
            'WatchService',
            App.controllers.qsUsersList
        ]);

} (window.angular));
