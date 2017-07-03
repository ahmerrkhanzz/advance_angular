(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.institutionsUsersListClone = function (
        $scope,
        $resource,
        $timeout,
        constants,
        uiGridConstants,
        InstitutionsUsersListService,
        UsersListService,
        NotifierFactory,
        InstitutionsUsersListFactory,
        InstitutionsUsersFactory,
        WatchService,
        UserTypesService,
        PasswordService,
        GridService,
        UserFactory
    ) {
        var controller = this;
        controller.devMode = constants.dev;
        controller.defaultFilters = {
            lastLoginAtRange: {
                startDate: null,
                endDate: null
            }
        };
        controller.showDatagrid = false;
        controller.grid = {};
        controller.defaultPaginationOptions = {
            page: 1,
            limit: constants.datagrid.contacts.defaultRowsNumber
        };
        controller.paginationOptions = GridService.getColumnsFilters(
            constants.gridNameSpaces.contactsGridFilters,
            []
        );
        controller.columnsVisibility = GridService.getColumnsVisibility(
            constants.gridNameSpaces.contactsGridVisibility
        );
        controller.isDatagridReloading = false;
        controller.isDatagridRendered = false;
        controller.rolesBeforeChanges = [];

        $scope.user = {};
        $scope.newUser = {};
        $scope.newUserPanelNotClosed = false;
        $scope.userBeforeChanges = {};
        $scope.forms = {};
        $scope.filterActive = true;
        $scope.disabledInstitutionsUserListSubTabs = {
            'personalDetails' : false,
            'permissions' : true,
            'institutions' : true
        };
        $scope.filters = null;
        $scope.columnsBeforeHide = [];
        $scope.visible = {};

        controller.hasWriteAccess = UserFactory.hasInstitutionsUsersAccess();
        controller.userTypes = UserTypesService.getUserTypes();
        controller.initSelectedItem = function () {
            $scope.selectedItem = {};
            $scope.selectedItem.selectedOptionType = controller.userTypes[1];
        };
        controller.initSelectedItem();
        controller.contactTypesList = [];

        InstitutionsUsersListService.getContactTypes().then(function(contactTypes) {
            controller.contactTypes = contactTypes;
            angular.forEach(contactTypes, function (item) {
                controller.contactTypesList.push({
                    value: item.handle,
                    label: item.name
                });
            });
        });
        InstitutionsUsersListService.getRoles().then(function(rolesList) {
            controller.rolesList = rolesList;
        });
        InstitutionsUsersListService.getSections().then(function(sectionsList) {
            controller.sectionsList = sectionsList;
        });

        $scope.handleLastLoginAtDateRange = function (event) {
            if (event.model.startDate && event.model.endDate) {
                controller.grid.options.columnDefs[7].filters[0].term = event.model.startDate.format('x');
                controller.grid.options.columnDefs[7].filters[1].term = event.model.endDate.format('x');
            }
        };

        controller.handleGridVisibleChanges = function () {
            var columnsVisibility = GridService.getColumnsVisibility(constants.gridNameSpaces.contactsGridVisibility),
                reload = false;

            if (columnsVisibility && $scope.filterActive) {
                angular.forEach(controller.grid.options.columnDefs, function(column, key) {
                    if (columnsVisibility[column.field] === true &&
                        column.visible === false
                    ) {
                        controller.grid.options.columnDefs[key].filter.term = null;
                        controller.paginationOptions['filter[' + controller.convertVisibleColumnsField(column.field) + ']'] = null;
                        reload = true;
                        if (column.field === 'lastLoginAt') {
                            delete controller.grid.options.columnDefs[key].filters[0].term;
                            $scope.filters.lastLoginAtRange = {
                                startDate: null,
                                endDate: null
                            };
                            controller.paginationOptions['filter[' + column.field + ']'] = $scope.filters.lastLoginAtRange;
                        }
                    }
                });
            }
            if ($scope.filterActive) {
                controller.columnsVisibility = GridService.getGridColumnsVisibility(controller.grid.options.columnDefs);
                GridService.storeColumnsVisibility(
                    constants.gridNameSpaces.contactsGridVisibility,
                    controller.columnsVisibility
                );
            }
            if (reload) {
                controller.getPage();
            }
        };

        controller.handleGridFiltersChanges = function () {
            controller.paginationOptions = angular.copy(controller.defaultPaginationOptions);
            var filterColumn, sortColumn;
            angular.forEach ($scope.gridApi.grid.columns, function(column) {
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
                controller.paginationOptions["filter[lastLoginAt]"] = $scope.filters.lastLoginAtRange;
            }
            if (controller.paginationOptions["filter[lastLoginAt]"].startDate === null) {
                controller.paginationOptions["filter[lastLoginAt]"].endDate = null;
                $scope.filters.lastLoginAtRange = {
                    startDate: null,
                    endDate: null
                };
            }
            angular.forEach(controller.paginationOptions, function (value, key) {
                if (key === 'filter[contactTypesAsString]') {
                    controller.paginationOptions['filter[contactTypes.handle]'] = value;
                    delete controller.paginationOptions['filter[contactTypesAsString]'];
                }
            });
            GridService.storeColumnsFilters(
                constants.gridNameSpaces.contactsGridFilters,
                controller.paginationOptions
            );

            if (angular.isDefined($scope.filterTimeout)) {
                $timeout.cancel($scope.filterTimeout);
            }
            $scope.filterTimeout = $timeout(function () {
                controller.getPage();
            }, 500);
        };

        /**
         * Actions to do when datagrid row is clicked.
         *
         * @param {object} user
         */
        $scope.handleDatagridRowClick = function (user) {
            PasswordService.setHasErrors(true);
            $scope.disabledInstitutionsUserListSubTabs.permissions = false;
            $scope.disabledInstitutionsUserListSubTabs.institutions = false;
            if ($scope.selectedUserId === user.id) {
                $scope.selectedUserId = null;
                $scope.showInfoBlock = false;
                $scope.filterActive = true;
                InstitutionsUsersListFactory.resetActiveUserId();
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

                InstitutionsUsersListFactory.setActiveUserId($scope.selectedUserId);
                controller.toggleColumns(true);
            }
        };

        controller.updateInDatagrid = function ()
        {
            controller.reloadDatagrid();
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
                $scope.filterActive = false;
            } else {
                // show columns visible before hide
                angular.forEach($scope.columnsBeforeHide, function (column) {
                    column.visible = true;
                });
                $scope.columnsBeforeHide = [];

                $scope.$broadcast(constants.events.closingInstitutionsUsers);
                $scope.filterActive = true;
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
            if (!user || !user.id || $scope.deactivateInProgress) {
                return false;
            }
            $scope.deactivateInProgress = true;
            InstitutionsUsersListService.deactivate(user.id).then(controller.deactivationCallback);
        };

        /**
         * Handle activate click
         *
         * @param {object} user
         * @returns {Boolean}
         */
        $scope.handleActivateClick = function (user) {
            if (!user.id || $scope.activateInProgress) {
                return false;
            }
            $scope.activateInProgress = true;
            InstitutionsUsersListService.activate(user.id).then(controller.activationCallback);
        };

        controller.deactivationCallback = function (success)
        {
            $scope.user.active = success ? false : true;
            if (success) {
                $scope.userBeforeChanges.active = $scope.user.active;
                // update user data in datagrid
                controller.updateInDatagrid($scope.userBeforeChanges);
            }
            $scope.deactivateInProgress = false;

            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'Deactivated successfully!' : 'Deactivation failed!',
                'Deactivation'
            );
        };

        controller.activationCallback = function (success)
        {
            $scope.user.active = success ? true : false;
            if (success) {
                $scope.userBeforeChanges.active = $scope.user.active;
                // update user data in datagrid
                controller.updateInDatagrid($scope.userBeforeChanges);
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
                // switch tab after user add
                $scope.activeTab = 1;
                $scope.disabledInstitutionsUserListSubTabs.permissions = false;
                $scope.disabledInstitutionsUserListSubTabs.institutions = false;
                angular.copy($scope.user, $scope.newUser);
                $scope.selectedUserId = $scope.user.id;
                $scope.newUserPanelNotClosed = true;
                // reload datagrid
                controller.reloadDatagrid();
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
            var newUser = typeof $scope.user.id === 'undefined';
            if (
                $scope.personalDetailsSubmitInProgress ||
                !$scope.forms.personalDetailsForm ||
                !$scope.forms.personalDetailsForm.$valid||
                !PasswordService.isValid($scope.forms.personalDetailsForm, $scope.user) ||
                !PasswordService.getHasErrors()
            ) {
                return false;
            }

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
            InstitutionsUsersListService.savePersonalDetails($scope.user).then(function (response) {
                var message = 'Personal Details',
                    success = false;
                if (response) {
                    success = !response.error;
                    if (!success) {
                        if (response.hasOwnProperty('message') && response.message.length) {
                            message = response.message;
                        }
                    } else {
                        $scope.user.primaryInstitutionCoreId = null;
                        $scope.user.fullname = InstitutionsUsersListService.getFullName($scope.user);
                        if (response.hasOwnProperty('insertedId') && response.insertedId.length) {
                            $scope.user.id = response.insertedId;
                            $scope.user.active = true;
                            angular.copy($scope.user, $scope.userBeforeChanges);
                            // switch tab after user add
                            $scope.activeTab = 1;
                            $scope.disabledInstitutionsUserListSubTabs.permissions = false;
                            $scope.disabledInstitutionsUserListSubTabs.institutions = false;
                            angular.copy($scope.user, $scope.newUser);
                            $scope.selectedUserId = $scope.user.id;
                        }
                        //reset personalDetailsForm
                        controller.resetPersonalDetailsForm();
                    }

                    if (success && $scope.user.contactTypes) {
                        InstitutionsUsersListService.getContactTypes().then(function(contactTypesList) {
                            if (!contactTypesList) {
                                return false;
                            }
                            var contactTypeNames = [],
                                contactTypeName = null;

                            for (var contactType in $scope.user.contactTypes) {
                                if ($scope.user.contactTypes[contactType].assigned) {
                                    contactTypeName = UsersListService.getContactTypeNameByHandle(
                                        contactType, contactTypesList
                                    );
                                    contactTypeNames.push(contactTypeName);
                                }
                            }
                            $scope.user.contactTypesAsString = contactTypeNames.join(', ');
                        });
                    }
                    if (success) {
                        delete $scope.user.password;
                        // update original user object with changes
                        $scope.userBeforeChanges = angular.copy($scope.user);
                        // reload  datagrid
                        controller.reloadDatagrid();
                    }
                    $scope.personalDetailsSubmitInProgress = false;
                    NotifierFactory.show(
                        success ? 'success' : 'error',
                        success ? 'Saved successfully!' : 'Saving failed!',
                        message
                    );


                }
            });
        };

        $scope.handlePermissionsSubmit = function () {
            $scope.permissionsSubmitInProgress = true;
            InstitutionsUsersListService.savePermissions($scope.user).then(function (success) {
                $scope.permissionsSubmitInProgress = false;
                $scope.userBeforeChanges = angular.copy($scope.user);
                controller.rolesBeforeChanges = [];
                for (var role in $scope.user.roles) {
                    if ($scope.user.roles[role]) {
                        controller.rolesBeforeChanges[role] = true;
                    }
                }
                if (success) {
                    controller.updateInDatagrid($scope.user);
                }
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

        $scope.handleContactTypeClick = function (handle) {
            if ($scope.user.contactTypes[handle] &&
                $scope.user.contactTypes[handle].primary &&
                !$scope.user.contactTypes[handle].assigned
            ) {
                $scope.user.contactTypes[handle].primary = false;
            }
        };

        $scope.handleAssignedContactTypeClick = function (handle) {
            if ($scope.user.contactTypes[handle].assigned === false) {
                $scope.user.contactTypes[handle].primary = false;
            }
        };

        $scope.handleRoleClick = function (clickedRole) {
            if ($scope.user.roles.custom || typeof clickedRole === 'undefined') {
                return;
            }

            $scope.user.accessTo = {};
            var clickedRoleAssigned = $scope.user.roles[clickedRole.roleHandle],
                parentRoleClicked = clickedRole.all,
                childrenRolesHandles = UsersListService.getChildrenRoles(clickedRole.groupHandle, controller.rolesList),
                parentRoleHandle = null;

            // if role is assigned
            if (clickedRoleAssigned) {
                // if its parent role
                if (parentRoleClicked) {
                    // assign children roles to a user
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
            // Update sections and pages based on the new roles
            $scope.user = UsersListService.updateSectionsAndPages($scope.user, controller.rolesList);
        };

        $scope.activateCustomRole = function () {
            if (!angular.isDefined($scope.user.roles)) {
                $scope.user.roles = {};
            }
            $scope.user.roles.custom = true;
        };

        /**
         * Actions to do when column is clicked under visible columns dropdown.
         */
        $scope.handleColumnClick = function () {
            var columnsVisibility = {};
            angular.forEach($scope.columns, function (column) {
                columnsVisibility[column.field] = column.show;
            });
            InstitutionsUsersListService.storeColumnsVisibility(columnsVisibility);
        };

        controller.handleAddInstitutionsUserClick = function () {
            controller.resetPersonalDetailsForm();
            $scope.selectedUserId = null;
            $scope.user = {};
            InstitutionsUsersListFactory.resetActiveUserId();
            // set personal details tab as active
            $scope.activeTab = 0;
            $scope.disabledInstitutionsUserListSubTabs.permissions = true;
            $scope.disabledInstitutionsUserListSubTabs.institutions = true;
            // trigger edit mode
            controller.toggleColumns(true);
            $scope.showInfoBlock = true;
        };
        controller.resetPersonalDetailsForm = function () {
            //reset personalDetailsForm
            if ($scope.forms.personalDetailsForm) {
                $scope.forms.personalDetailsForm.$setPristine();
            }
        };

        controller.handleEditCloseClick = function () {
            controller.toggleColumns(false);
            $scope.showInfoBlock = false;
            $scope.selectedUserId = null;
            $scope.activeTab = 0;
            $scope.filterActive = true;
        };

        /**
         * Apply datagrid columns visibility from browser cache.
         */
        controller.loadDatagridColumnsVisibility = function () {
            var columnsVisibility = InstitutionsUsersListService.getColumnsVisibility();
            if (columnsVisibility) {
                angular.forEach($scope.columns, function (column) {
                    if (columnsVisibility[column.field] !== 'undefined') {
                        column.show = columnsVisibility[column.field] ? true : false;
                    }
                });
            }
        };

        controller.reloadDatagrid = function () {
            controller.getPage();
        };

        controller.getPage = function() {
            controller.isDatagridReloading = true;
            return InstitutionsUsersListService.getAllUsers(
                angular.merge({}, controller.paginationOptions, controller.defaultPaginationOptions, $scope.filters)
            ).then(function(response) {
                controller.grid.options.totalItems = response.totalMatching;
                controller.grid.options.data = response.results;
                controller.grid.options.minRowsToShow = response.totalFiltered;
                controller.isDatagridReloading = false;
                controller.showDatagrid = true;
            });
        };

        controller.reloadDatagrid = function () {
            controller.getPage();
        };

        controller.initDataGridOptions = function () {
            var selectTemplate = '/scripts/shared/ui-grid/templates/selectFilterHeaderTemplate.html',
                selectCellTemplate = '/scripts/shared/ui-grid/templates/selectCellTemplate.html',
                dateCellTemplate = '/scripts/shared/ui-grid/templates/dateCellTemplate.html';
            controller.grid.options = {
                data: [],
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
                        visible: true, //GridService.getVisibilityByField(controller.columnsVisibility, 'email', true),
                        cellFilter: 'lowercase',
                        filter: {
                            term: GridService.getFilterByField(controller.paginationOptions, 'email', '')
                        }
                    },
                    {
                        displayName: 'Fullname',
                        field: 'fullname',
                        visible: GridService.getVisibilityByField(controller.columnsVisibility, 'fullname', true),
                        filter: {
                            term: GridService.getFilterByField(controller.paginationOptions, 'fullname', '')
                        }
                    },
                    {
                        displayName: 'Position',
                        field: 'position',
                        visible: GridService.getVisibilityByField(controller.columnsVisibility, 'position', true),
                        filter: {
                            term: GridService.getFilterByField(controller.paginationOptions, 'position', '')
                        }
                    },
                    {
                        displayName: 'Phone',
                        field: 'phone',
                        visible: GridService.getVisibilityByField(controller.columnsVisibility, 'phone', true),
                        filter: {
                            term: GridService.getFilterByField(controller.paginationOptions, 'phone', '')
                        }
                    },
                    {
                        displayName: 'Primary Institution Core Id',
                        field: 'primaryInstitutionCoreIdAsString',
                        visible: GridService.getVisibilityByField(controller.columnsVisibility, 'primaryInstitutionCoreIdAsString', true),
                        filter: {
                            term: GridService.getFilterByField(controller.paginationOptions, 'primaryInstitutionCoreIdAsString', '')
                        }
                    },
                    {
                        displayName: 'Primary Institution',
                        field: 'primaryInstitutionName',
                        visible: GridService.getVisibilityByField(controller.columnsVisibility, 'primaryInstitutionName', true),
                        filter: {
                            term: GridService.getFilterByField(controller.paginationOptions, 'primaryInstitutionName', '')
                        }
                    },
                    {
                        displayName: 'Contact Types',
                        filter: {
                            type: uiGridConstants.filter.SELECT,
                            selectOptions: controller.contactTypesList,
                            term: GridService.getFilterByField(controller.paginationOptions, 'contactTypes.handle', null)
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
                        filters:[
                            {
                                visible: true,
                                condition: uiGridConstants.filter.GREATER_THAN
                            },
                            {
                                condition: uiGridConstants.filter.LESS_THAN
                            }
                        ],
                        filter : {
                            term: GridService.getFilterByField(controller.paginationOptions, 'lastLoginAt', ''),
                            applyTextFilter: controller.applyDateFilter('lastLoginAt', '')
                        },
                        cellTemplate: dateCellTemplate,
                        filterHeaderTemplate: '/scripts/components/users/list/institutions/datagrid/dateFilterHeaderTemplate.html',
                        visible: GridService.getVisibilityByField(controller.columnsVisibility, 'lastLoginAt', true)
                    }
                ],
                onRegisterApi : function (gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                        $scope.handleDatagridRowClick(row.entity);
                    });
                    gridApi.core.on.rowsRendered($scope, function () {
                        controller.isDatagridRendered = true;
                    });
                    gridApi.core.on.filterChanged($scope, controller.handleGridFiltersChanges);
                    gridApi.core.on.rowsVisibleChanged($scope, controller.handleGridVisibleChanges);

                    gridApi.pagination.on.paginationChanged($scope, function (newPage, limit) {
                        controller.defaultPaginationOptions.page = newPage;
                        controller.defaultPaginationOptions.limit = limit;
                        controller.getPage();
                    });
                    $scope.gridApi.core.on.sortChanged($scope, controller.handleGridFiltersChanges);
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
                    controller.grid.options.columnDefs[7].filters[0].term = controller.paginationOptions["filter[lastLoginAt]"].startDate;
                    controller.grid.options.columnDefs[7].filters[1].term = controller.paginationOptions["filter[lastLoginAt]"].endDate;
                }
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

        controller.initDataGrid = function () {
            controller.getPage().then(function() {
                InstitutionsUsersListService.getContactTypesFilter().then(function (options) {
                    var list = [];
                    angular.forEach(options, function (option) {
                        list.push({
                            value: option.id,
                            label: option.title
                        });
                    });
                    controller.grid.options.columnDefs[6].filter.selectOptions = list;
                });
            });
        };

        controller.convertVisibleColumnsField = function (value) {
            switch (value) {
                case 'contactTypesAsString':
                    return 'contactTypes.handle';
                default:
                    return value;
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

        controller.initWatches = function () {
            // listen to active institution changes
            WatchService.create($scope,
                InstitutionsUsersFactory.getRequestFilters,
                function (filters) {
                    if (filters) {
                        $scope.filters = angular.extend({}, controller.defaultFilters, filters);
                        // reset request filters
                        InstitutionsUsersFactory.resetRequestFilters();
                        // initialise datagrid
                        controller.getPage();
                    }
                }
            );

            // listen to active profile tab changes
            WatchService.create($scope, 'activeTab', function (newValue) {
                InstitutionsUsersListFactory.setSelectedTabId(newValue);
            });

            $scope.$on(constants.events.institutionsUserPrimaryInstitutionChanges, function () {
                $scope.userBeforeChanges = angular.copy($scope.user);
                controller.updateInDatagrid($scope.user);
            });
        };

        /**
         * Class constructor.
         */
        controller.$onInit = function () {
            controller.initDataGridOptions();
            controller.initWatches();
            controller.loadDatagridColumnsVisibility();
        };
    };

    angular
        .module('qsHub')
        .controller('InstitutionsUsersListCloneController', [
            '$scope',
            '$resource',
            '$timeout',
            'constants',
            'uiGridConstants',
            'InstitutionsUsersListService',
            'UsersListService',
            'NotifierFactory',
            'InstitutionsUsersListFactory',
            'InstitutionsUsersFactory',
            'WatchService',
            'UserTypesService',
            'PasswordService',
            'UiGridService',
            'UserFactory',
            App.controllers.institutionsUsersListClone
        ]);

}(window.angular));
