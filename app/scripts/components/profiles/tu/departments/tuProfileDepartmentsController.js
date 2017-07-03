(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.tuProfileDepartments = function (
        $scope,
        $rootScope,
        $resource,
        $location,
        constants,
        NotifierFactory,
        TuProfileFactory,
        InstitutionFactory,
        TuProfileDepartmentsService,
        TuProfileService,
        uiGridConstants,
        UserFactory,
        WatchService,
        GridService
    ) {
        var controller = this,
            alreadyInitialised = false;

        controller.devMode = constants.dev;
        controller.deleteField = 'delete';
        controller.modifiedAtField = 'modifiedAt';

        $scope.departmentsToDelete = {};
        $scope.alphabeticalOrderingInProgress = false;
        $scope.deleteInProgress = false;
        $scope.isDatagridReloading = false;
        $scope.isDatagridRendered = false;

        $scope.filters = {
            createdAt: {
                startDate: null,
                endDate: null
            }
        };

        controller.gridFilterNameSpace = TuProfileFactory.getIsDepartmentOverview() ?
            constants.gridNameSpaces.departmentsOvGridFilters :
            constants.gridNameSpaces.departmentsGridFilters;

        controller.gridVisibilityNameSpace = TuProfileFactory.getIsDepartmentOverview() ?
            constants.gridNameSpaces.departmentsOvGridVisibility :
            constants.gridNameSpaces.departmentsGridVisibility;

        controller.lastCreatedAt = null;
        controller.paginationOptions = GridService.getColumnsFilters(
            controller.gridFilterNameSpace,
            []
        );

        controller.columnsVisibility = GridService.getColumnsVisibility(
            controller.gridVisibilityNameSpace
        );

        $scope.getTuProfileDepartmentController = function () {
            return controller;
        };

        $scope.handleCreatedAtDateRange = function (event) {
            if (event === null || typeof event === 'undefined') {
                $scope.gridOptions.columnDefs[5].filters[0].term = null;
                $scope.gridOptions.columnDefs[5].filters[1].term = null;
            } else if (event.model.startDate && event.model.endDate) {
                $scope.gridOptions.columnDefs[5].filters[0].term = event.model.startDate.format('x');
                $scope.gridOptions.columnDefs[5].filters[1].term = event.model.endDate.format('x');
            }
        };

        /**
         * Actions to do when departments table row is clicked.
         *
         * @param {object} department
         */
        $scope.handleDatagridRowClick = function (department) {
            $scope.selectedDepartmentId = ($scope.selectedDepartmentId === department.id) ? null : department.id;
            // store link to department instance
            TuProfileFactory.setDepartmentBeforeChanges(department);
            // create new copy of department for making changes in
            department = angular.copy(department);
            TuProfileFactory.setDepartmentEditFormVisibility(
                $scope.selectedDepartmentId === department.id && department.id !== 'undefined'
            );
            TuProfileFactory.setDepartment(department);

            controller.toggleColumns($scope.selectedDepartmentId === department.id && department.id !== 'undefined');
            TuProfileFactory.setIsDepartmentRowSelected(true);
        };

        /**
         * Toggle datagrid columns visibility.
         *
         * @param {boolean} hide
         */
        controller.toggleColumns = function (hide) {
            if (!$scope.gridOptions) {
                return;
            }
            if (hide) {
                // hide delete column
                angular.forEach($scope.gridOptions.columnDefs, function (column) {
                    if (column.field !== controller.deleteField) {
                        column.visible = angular.isDefined(controller.columnsVisibility) ?
                            controller.columnsVisibility[column.field] : true;
                    } else {
                        column.visible = false;
                    }
                });
            } else {
                // show all columns
                angular.forEach($scope.gridOptions.columnDefs, function (column) {
                    if (column.field === controller.deleteField) {
                        column.visible = true;
                    } else {
                        column.visible = angular.isDefined(controller.columnsVisibility) ?
                            controller.columnsVisibility[column.field] : true;
                    }
                });
            }
            $scope.gridOptions.enableGridMenu = !hide;
        };

        /**
         * Actions to do when alphabetical ordering checked.
         *
         * @param {boolean} alphabetical
         */
        $scope.handleAlphabeticalOrderClick = function (alphabetical) {
            // indicate progress
            $scope.alphabeticalOrderingInProgress = true;
            // store changes
            TuProfileService.updateInstitution($scope.institutionId, {
                departmentsAlphabeticalOrder: alphabetical
            }).then(function (success) {
                if (success) {
                    // reload departments datagrid
                    controller.reloadDatagrid();
                }
                // indicate progress end
                $scope.alphabeticalOrderingInProgress = false;
            });
        };
        /**
         * Actions to do when add department button is clicked.
         */
        $scope.handleAddDepartmentClick = function () {
            // toggle add form
            TuProfileFactory.setDepartmentAddFormVisibility();
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
                        $scope.filters.createdAt = {
                            startDate: parseInt(filter.startDate, 10),
                            endDate: parseInt(filter.endDate, 10)
                        };
                    } else {
                        $scope.filters.createdAt = {
                            startDate: null,
                            endDate: null
                        };
                    }
                }
            }
        };

        controller.getDepartmentsToDelete = function () {
            var departmentsIds = [];
            if ($scope.departmentsToDelete) {
                angular.forEach($scope.departmentsToDelete, function (remove, id) {
                    if (remove) {
                        departmentsIds.push(id);
                    }
                });
            }

            return departmentsIds;
        };

        controller.clearDepartmentsToDelete = function () {
            $scope.departmentsToDelete = {};
        };

        controller.hasDepartmentsToDelete = function () {
            var departmentsIds = controller.getDepartmentsToDelete();
            return departmentsIds.length !== 0;
        };

        $scope.isDeleteButtonDisabled = function () {

            return $scope.deleteInProgress ||
                !$scope.institutionId ||
                !controller.hasDepartmentsToDelete();
        };

        /**
         * Actions to do when department delete button is clicked.
         *
         * @returns {boolean}
         */
        $scope.handleDeleteClick = function () {
            if ($scope.deleteInProgress || !controller.hasDepartmentsToDelete()) {
                return false;
            }
            var departmentsIds = controller.getDepartmentsToDelete();
            $scope.deleteInProgress = true;
            TuProfileDepartmentsService.delete(departmentsIds).then(function (success) {
                $scope.deleteInProgress = false;
                if (success) {
                    $scope.departmentsToDelete = {};
                    // reload departments datagrid
                    //controller.reloadDatagrid();
                    var i = 0,
                        rows = $scope.gridOptions.data,
                        total = rows.length;

                    for (i; i < total; i++) {
                        if (rows[i] && rows[i].id && departmentsIds.indexOf(rows[i].id) !== -1) {
                            delete $scope.gridOptions.data[i];
                        }
                    }
                    TuProfileFactory.setIsDepartmentUpdated(true);
                }
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Successfully!' : 'Failed!',
                    'Departments Deleted'
                );
            });
        };

        $scope.handleDatagridFiltersChanges = function (grid) {
            angular.forEach($scope.gridApi.grid.columns, function (column) {
                if (typeof column.filters !== 'undefined' && column.filters[0].term !== 'undefined') {
                    if (
                        column.filters[0].type === uiGridConstants.filter.SELECT &&
                        typeof column.filters[0].term === 'object' &&
                        column.filters[0].term !== null &&
                        typeof column.filters[0].term.value !== 'undefined'
                    ) {
                        column.filters[0].term = column.filters[0].term.value;
                    } else if (column.filters[0].term !== null &&
                        typeof column.filters[0].term !== 'undefined') {
                        GridService.applyFilters(column);
                    }
                }

                var filterColumn = column.filters[0].column ? column.filters[0].column : column.field;
                if (column.field === 'modifiedAt') {
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
                } else if (typeof column.filters !== 'undefined' && column.filters[0].term !== 'undefined') {
                    controller.paginationOptions['filter[' + filterColumn + ']'] = column.filters[0].term;
                }
            });

            GridService.storeColumnsFilters(
                controller.gridFilterNameSpace,
                controller.paginationOptions
            );

            var currentCreatedAt = null;
            for (var i = 0; i < grid.columns.length; i++) {
                for (var x = 0; x < grid.columns[i].filters.length; x++) {
                    // check if has active filters
                    if (grid.columns[i].filters[x].term !== undefined) {
                        controller.lastCreatedAt = angular.copy(currentCreatedAt);
                        return;
                    }
                }

                if (grid.columns[i].field === controller.modifiedAtField) {
                    currentCreatedAt = grid.columns[i].filters[0].term && grid.columns[i].filters[1].term ?
                        [grid.columns[i].filters[0].term, grid.columns[i].filters[1].term].join('|') : null;
                }
            }

            if (!currentCreatedAt && !controller.lastCreatedAt) {
                return;
            }

            if (!currentCreatedAt && controller.lastCreatedAt) {
                $scope.filters.createdAt = {
                    startDate: null,
                    endDate: null
                };
            }
            controller.lastCreatedAt = angular.copy(currentCreatedAt);
        };

        $scope.handleDatagridDragAndDrop = function () {
            $scope.institutionData.departmentsAlphabeticalOrder = false;
            var i = 0,
                rows = $scope.gridApi.core.getVisibleRows(),
                total = rows.length,
                orderedIds = [];
            for (i; i < total; i++) {
                orderedIds.push(rows[i].entity.coreId);
            }
            TuProfileDepartmentsService.updateOrder($scope.institutionId, orderedIds).then(function (success) {
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Successfully updated!' : 'Update failed!',
                    'Departments Order'
                );
            });
        };

        controller.reloadDatagrid = function () {
            var coreId = InstitutionFactory.getCoreId();
            if (!coreId) {
                return false;
            }
            $scope.isDatagridReloading = true;
            return TuProfileDepartmentsService.getAllDepartmentsByCoreId(coreId).then(function (response) {
                $scope.isDatagridReloading = false;
                $scope.gridOptions.data = response;

                return response;
            });
        };

        controller.handleGridVisibleChanges = function () {
            var columnsVisibility = GridService.getColumnsVisibility(controller.gridVisibilityNameSpace);
            if (columnsVisibility) {
                angular.forEach($scope.gridOptions.columnDefs, function (column, key) {
                    if (column.field !== 'delete' &&
                        columnsVisibility[column.field] === true &&
                        column.visible === false
                    ) {
                        $scope.gridOptions.columnDefs[key].filter.term = null;
                        if (column.field === 'modifiedAt') {
                            delete $scope.gridOptions.columnDefs[key].filters[0].term;
                            $scope.filters.lastLoginAtRange = {
                                startDate: null,
                                endDate: null
                            };
                        }
                    }
                });
            }
            controller.columnsVisibility = GridService.getGridColumnsVisibility($scope.gridOptions.columnDefs);
            GridService.storeColumnsVisibility(
                controller.gridVisibilityNameSpace,
                controller.columnsVisibility
            );
        };

        controller.initWatches = function () {
            // watch for new departments
            WatchService.create($scope, TuProfileFactory.hasNewDepartment, function (newDepartmentId) {
                if (newDepartmentId) {
                    // reload datagrid
                    //controller.reloadDatagrid(InstitutionFactory.getCoreId());

                    controller.reloadDatagrid(InstitutionFactory.getCoreId()).then(function (departmentsList) {
                        if (departmentsList) {
                            var i = 0,
                                department = null,
                                total = departmentsList.length;
                            for (i; i < total; i++) {
                                department = departmentsList[i];
                                if (department.id === newDepartmentId) {
                                    TuProfileFactory.setDepartmentBeforeChanges(department);
                                    break;
                                }
                            }
                        }
                        // mark new department as selected in the datagrid
                        $scope.selectedDepartmentId = newDepartmentId;

                    }).finally(function () {
                        // open new department in edit mode
                        TuProfileFactory.setDepartmentEditFormVisibility(true);
                    });
                }
            });

            // watch for department add form visibility changes
            WatchService.create($scope, function () {
                return TuProfileFactory.isDepartmentAddFormVisible($scope.activeTab);
            }, function (visible) {
                visible = visible || TuProfileFactory.isDepartmentEditFormVisible($scope.activeTab);
                controller.toggleColumns(visible);
            });

            // watch for department edit form visibility changes
            WatchService.create($scope, function () {
                return TuProfileFactory.isDepartmentEditFormVisible($scope.activeTab);
            }, function (visible) {
                if (!visible) {
                    $scope.selectedDepartmentId = null;
                } else {
                    $scope.selectedDepartmentId = TuProfileFactory.getDepartmentId();
                }
                visible = visible || TuProfileFactory.isDepartmentAddFormVisible($scope.activeTab);
                controller.toggleColumns(visible);
            });
            // watch for client department upgrade form visibility changes
            WatchService.create($scope, function () {
                return TuProfileFactory.isClientDepartmentUpgradeFormVisible($scope.activeTab);
            }, function (visible) {
                visible = visible || TuProfileFactory.isDepartmentEditFormVisible($scope.activeTab);
                if (!visible) {
                    $scope.selectedDepartmentId = null;
                } else {
                    $scope.selectedDepartmentId = TuProfileFactory.getDepartmentId();
                }
                controller.toggleColumns(visible);
            });

            // listen to active institution changes
            WatchService.create($scope, InstitutionFactory.getCoreId, function (coreId) {
                if (coreId) {
                    controller.initDataGrid(coreId);
                }
            });

            //Reload grid on department update
            WatchService.create($scope, TuProfileFactory.getUpdateDepartmentsGrid, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    controller.reloadDatagrid();
                    TuProfileFactory.setUpdateDepartmentsGrid(false);
                }
            });

            $rootScope.$on(constants.events.logout, controller.destruct);
        };

        var selectTemplate = '/scripts/shared/ui-grid/templates/selectFilterHeaderTemplate.html',
            selectCellTemplate = '/scripts/shared/ui-grid/templates/selectCellTemplate.html';
        $scope.gridOptions = {
            enableSorting: false,
            exporterMenuCsv: false,
            enableGridMenu: true,
            showGridFooter: true,
            selectedItems: $scope.selectedDepartmentId,
            enableFiltering: true,
            enableColumnResize: true,
            enableFullRowSelection: true,
            enableRowSelection: true,
            multiSelect: false,
            enableRowHeaderSelection: false,
            rowTemplate: '/scripts/components/profiles/tu/departments/datagrid/rowTemplate.html',
            columnDefs: [
                {
                    displayName: 'Delete',
                    field: controller.deleteField,
                    enableSorting: false,
                    enableColumnResizing: false,
                    headerCellClass: 'text-center v-align',
                    headerCellTemplate: '/scripts/components/profiles/tu/departments/datagrid/deleteHeaderCellTemplate.html',
                    cellTemplate: '/scripts/components/profiles/tu/departments/datagrid/deleteCellTemplate.html',
                    maxWidth: 80
                },
                {
                    displayName: 'Core ID',
                    field: 'coreId',
                    maxWidth: 80,
                    visible: GridService.getVisibilityByField(controller.columnsVisibility, 'coreId', true),
                    filter: {
                        term: GridService.getFilterByField(controller.paginationOptions, 'coreId', '')
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
                    displayName: 'Department Type',
                    filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: TuProfileDepartmentsService.getDepartmentTypes(true),
                        term: GridService.getFilterByField(controller.paginationOptions, 'typeId')
                    },
                    visible: GridService.getVisibilityByField(controller.columnsVisibility, 'typeId', true),
                    field: 'typeId',
                    maxWidth: 160,
                    filterHeaderTemplate: selectTemplate,
                    cellTemplate: selectCellTemplate
                },
                {
                    displayName: 'Belongs To',
                    filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: TuProfileService.getBelongsToList(true),
                        term: GridService.getFilterByField(controller.paginationOptions, 'belongsTo')
                    },
                    field: 'belongsTo',
                    maxWidth: 130,
                    visible: GridService.getVisibilityByField(controller.columnsVisibility, 'belongsTo', true),
                    filterHeaderTemplate: selectTemplate,
                    cellTemplate: selectCellTemplate
                },
                {
                    displayName: 'Last update',
                    type: 'date',
                    field: controller.modifiedAtField,
                    cellFilter: 'date:\'medium\'',
                    filterCellFiltered: false,
                    visible: GridService.getVisibilityByField(controller.columnsVisibility, 'controller.modifiedAtField', true),
                    filters: [
                        {
                            visible: true,
                            condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL
                        },
                        {
                            condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL
                        }
                    ],
                    /*filter : {
                        term: GridService.getFilterByField(controller.paginationOptions, controller.modifiedAtField, ''),
                        applyTextFilter: controller.applyDateFilter(controller.modifiedAtField, '')
                    },*/
                    filterHeaderTemplate: '/scripts/components/profiles/tu/departments/datagrid/createdAtFilterHeaderTemplate.html'
                }
            ],
            onRegisterApi: function (gridApi) {
                var columnsVisibilityBeforeChanges = angular.copy($scope.gridOptions.columnDefs);
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    $scope.handleDatagridRowClick(row.entity);
                });
                gridApi.draggableRows.on.rowDropped($scope, function () {
                    $scope.handleDatagridDragAndDrop();
                });
                gridApi.core.on.rowsRendered($scope, function () {
                    $scope.isDatagridRendered = true;
                });
                gridApi.core.on.filterChanged($scope, function () {
                    $scope.handleDatagridFiltersChanges(this.grid);
                });
                gridApi.core.on.rowsVisibleChanged($scope, controller.handleGridVisibleChanges);
                // reset columns visibility
                GridService.resetExtend(columnsVisibilityBeforeChanges, $scope.gridOptions.columnDefs, $scope.filters);
            }
        };

        controller.initDataGrid = function (coreId) {
            if (!coreId) {
                return false;
            }
            TuProfileDepartmentsService.getAllDepartmentsByCoreId(coreId).then(function (response) {
                $scope.isDatagridReloading = false;
                $scope.gridOptions.data = response;
                $scope.gridOptions.minRowsToShow = response.length < 50 ? response.length : 50;
                $scope.departmentsToDelete = {};
            });
        };

        $scope.cutomCheckboxMessage = function () {
            if (UserFactory.isClient()) {
                return 'Deleting client departments is not permitted. Contact tusupport@qs.com to delete';
            }
            return 'To delete client departments go to Institution List backend';
        };

        controller.destruct = function () {
            alreadyInitialised = false;
        };

        controller.init = function () {
            controller.initWatches();
        };

        // listen to departments tab visibility changes
        WatchService.create($scope, TuProfileFactory.isDepartmentsTabSelected, function (isActive, wasActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TuProfileDepartmentsController', [
            '$scope',
            '$rootScope',
            '$resource',
            '$location',
            'constants',
            'NotifierFactory',
            'TuProfileFactory',
            'InstitutionFactory',
            'TuProfileDepartmentsService',
            'TuProfileService',
            'uiGridConstants',
            'UserFactory',
            'WatchService',
            'UiGridService',
            App.controllers.tuProfileDepartments
        ]);

} (window.angular));
