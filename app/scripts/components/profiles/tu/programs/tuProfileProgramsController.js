(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.tuProfilePrograms = function (
        $scope,
        $rootScope,
        $templateRequest,
        constants,
        NotifierFactory,
        TuProfileFactory,
        InstitutionFactory,
        TuProfileProgramsService,
        TuProfileService,
        uiGridConstants,
        WatchService,
        GridService
    ) {
        var controller = this,
            alreadyInitialised = false;

        controller.devMode = constants.dev;
        controller.upgradeEmailsTo = constants.emails.upgradeTu;
        controller.deleteField = 'delete';
        $scope.institutionId = InstitutionFactory.getId();
        $scope.tuProfileId = TuProfileFactory.getId();
        $scope.programsToDelete = {};
        $scope.alphabeticalOrderingInProgress = false;
        $scope.deleteInProgress = false;
        $scope.isDatagridReloading = false;
        $scope.isDatagridRendered = false;

        controller.gridFilterNameSpace = TuProfileFactory.getIsProgramOverview() ?
            constants.gridNameSpaces.programsOvGridFilters :
            constants.gridNameSpaces.programsGridFilters;

        controller.gridVisibilityNameSpace = TuProfileFactory.getIsProgramOverview() ?
            constants.gridNameSpaces.programsOvGridVisibility :
            constants.gridNameSpaces.programsGridVisibility;

        controller.paginationOptions = GridService.getColumnsFilters(
            controller.gridFilterNameSpace,
            []
        );

        controller.columnsVisibility = GridService.getColumnsVisibility(
            controller.gridVisibilityNameSpace
        );

        $scope.getTuProfileProgramsController = function () {
            return controller;
        };
        // watch for institution changes
        WatchService.create($scope, InstitutionFactory.getId, function (id) {
            $scope.institutionId = id;
        });

        // watch for TU profile changes
        WatchService.create($scope, TuProfileFactory.getId, function (id) {
            $scope.tuProfileId = id;
            $scope.tuProfileData = TuProfileFactory.getData();
        });

        /**
         * Actions to do when programs table row is clicked.
         *
         * @param {object} program
         */
        $scope.handleDatagridRowClick = function (program) {
            TuProfileFactory.resetProgramForm();
            $scope.selectedProgramId = ($scope.selectedProgramId === program.id) ? null : program.id;
            // store link to program instance
            TuProfileFactory.setProgramBeforeChanges(program);
            // create new copy of program for making changes in
            program = angular.copy(program);
            TuProfileFactory.setProgramEditFormVisibility(
                $scope.selectedProgramId === program.id && program.id !== 'undefined'
            );
            TuProfileFactory.setProgram(program);
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
            TuProfileService.updateTuProfile($scope.tuProfileId, {
                programsAlphabeticalOrder: alphabetical
            }).then(function (success) {
                if (success) {
                    // reload programs datagrid
                    controller.reloadDatagrid();
                }
                // indicate progress end
                $scope.alphabeticalOrderingInProgress = false;
            });
        };

        /**
         * Actions to do when add program button is clicked.
         */
        $scope.handleAddProgramClick = function () {
            TuProfileFactory.setProgramAddFormVisibility();
            TuProfileFactory.setProgram({});
        };

        controller.getProgramsToDelete = function () {
            var programsIds = [];
            if ($scope.programsToDelete) {
                angular.forEach($scope.programsToDelete, function (remove, id) {
                    if (remove) {
                        programsIds.push(id);
                    }
                });
            }

            return programsIds;
        };

        controller.hasProgramsToDelete = function () {
            var departmentsIds = controller.getProgramsToDelete();
            return departmentsIds.length !== 0;
        };

        $scope.isDeleteButtonDisabled = function () {
            return $scope.deleteInProgress ||
                !$scope.institutionId ||
                !controller.hasProgramsToDelete();
        };

        controller.clearProgramsToDelete = function () {
            $scope.programsToDelete = {};
        };

        /**
         * Actions to do when program delete button is clicked.
         *
         * @returns {boolean}
         */
        $scope.handleDeleteClick = function () {
            if ($scope.deleteInProgress || !controller.hasProgramsToDelete()) {
                return false;
            }
            var programsIds = controller.getProgramsToDelete();
            $scope.deleteInProgress = true;
            TuProfileProgramsService.delete(programsIds).then(function (success) {
                $scope.deleteInProgress = false;
                if (success) {
                    $scope.programsToDelete = {};

                    var i = 0,
                        rows = $scope.gridOptions.data,
                        total = rows.length;

                    for (i; i < total; i++) {
                        if (rows[i] && rows[i].id && programsIds.indexOf(rows[i].id) !== -1) {
                            delete $scope.gridOptions.data[i];
                        }
                    }
                }
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Deleted successfully!' : 'Deletion failed!',
                    'Programs Deletion'
                );
            });
        };

        $scope.handleDatagridDragAndDrop = function () {
            $scope.tuProfileData.programsAlphabeticalOrder = false;
            var i = 0,
                rows = $scope.gridApi.core.getVisibleRows(),
                total = rows.length,
                orderedIds = [];
            for (i; i < total; i++) {
                orderedIds.push(rows[i].entity.coreId);
            }
            TuProfileProgramsService.updateOrder($scope.tuProfileId, orderedIds).then(function (success) {
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Successfully updated!' : 'Update failed!',
                    'Programs Order'
                );
            });
        };

        $scope.handleDatagridFiltersChanges = function (grid) {
            GridService.resetConditions($scope.gridApi.grid.columns);
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
                if (typeof column.filters !== 'undefined' && column.filters[0].term !== 'undefined') {
                    controller.paginationOptions['filter[' + filterColumn + ']'] = column.filters[0].term;
                }
            });

            GridService.storeColumnsFilters(
                controller.gridFilterNameSpace,
                controller.paginationOptions
            );
        };

        controller.reloadDatagrid = function (coreId) {
            if (!coreId) {
                coreId = InstitutionFactory.getCoreId();
            }
            if (!coreId) {
                return false;
            }
            $scope.isDatagridReloading = true;
            return TuProfileProgramsService.getAllProgramsByCoreId(coreId).then(function (response) {
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
            // watch for new programs
            WatchService.create($scope, TuProfileFactory.hasNewProgram, function (newProgramId) {
                if (newProgramId) {
                    // reload datagrid
                    controller.reloadDatagrid().then(function (programsList) {
                        if (programsList) {
                            var i = 0,
                                program = null,
                                total = programsList.length;
                            for (i; i < total; i++) {
                                program = programsList[i];
                                if (program.id === newProgramId) {
                                    TuProfileFactory.setProgramBeforeChanges(program);
                                    break;
                                }
                            }
                        }
                        // mark new program as selected in the datagrid
                        $scope.selectedProgramId = newProgramId;
                        // open new program in edit mode
                        TuProfileFactory.setProgramEditFormVisibility(true);
                    });
                }
            });

            // watch for program add form visibility changes
            WatchService.create($scope, function () {
                return TuProfileFactory.isProgramAddFormVisible($scope.activeTab);
            }, function (visible) {
                visible = visible || TuProfileFactory.isProgramEditFormVisible($scope.activeTab);
                controller.toggleColumns(visible);
            });

            // watch for department update changes
            WatchService.create($scope, TuProfileFactory.getIsDepartmentUpdated, function (isUpdated) {
                if (isUpdated) {
                    if ($scope.gridOptions.data !== undefined &&
                        $scope.gridOptions.data.length
                    ) {
                        controller.reloadDatagrid();
                    }
                    TuProfileFactory.setIsDepartmentUpdated(false);
                }
            });

            // watch for program edit form visibility changes
            WatchService.create($scope, function () {
                return TuProfileFactory.isProgramEditFormVisible($scope.activeTab);
            }, function (visible) {
                if (!visible) {
                    $scope.selectedProgramId = null;
                } else {
                    $scope.selectedProgramId = TuProfileFactory.getProgramId();
                }
                visible = visible || TuProfileFactory.isProgramAddFormVisible($scope.activeTab);
                controller.toggleColumns(visible);
            });

            // listen to active institution changes
            WatchService.create($scope, InstitutionFactory.getCoreId, function (coreId) {
                if (coreId) {
                    controller.initDataGrid(coreId);
                }
            });

            //Reload programme grid on programme update
            WatchService.create($scope, TuProfileFactory.getUpdateProgramGrid, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    controller.reloadDatagrid();
                    TuProfileFactory.setUpdateProgramGrid(false);
                }
            });

            $rootScope.$on(constants.events.logout, controller.destruct);
        };

        controller.initEvents = function () {
            $scope.$on(constants.events.institutionTuProfileChanges, function () {
                alreadyInitialised = false;
                if (TuProfileFactory.isProgramsTabSelected()) {
                    controller.initDataGrid();
                    alreadyInitialised = true;
                }
            });
        };
        var selectTemplate = '/scripts/shared/ui-grid/templates/selectFilterHeaderTemplate.html',
            selectCellTemplate = '/scripts/shared/ui-grid/templates/selectCellTemplate.html';
        $scope.gridOptions = {
            enableSorting: false,
            exporterMenuCsv: false,
            enableGridMenu: true,
            showGridFooter: true,
            selectedItems: $scope.selectedProgramId,
            enableFiltering: true,
            enableColumnResize: true,
            enableFullRowSelection: true,
            enableRowSelection: true,
            multiSelect: false,
            enableRowHeaderSelection: false,
            rowTemplate: '/scripts/components/profiles/tu/programs/datagrid/rowTemplate.html',
            columnDefs: [
                {
                    displayName: 'Delete',
                    field: controller.deleteField,
                    enableSorting: false,
                    enableColumnResizing: false,
                    headerCellClass: 'text-center vertical-align-middle',
                    headerCellTemplate: '/scripts/components/profiles/tu/programs/datagrid/deleteHeaderCellTemplate.html',
                    cellTemplate: '/scripts/components/profiles/tu/programs/datagrid/deleteCellTemplate.html',
                    maxWidth: 80
                },
                {
                    displayName: 'Program Name',
                    field: 'name',
                    visible: GridService.getVisibilityByField(controller.columnsVisibility, 'name', true),
                    filter: {
                        term: GridService.getFilterByField(controller.paginationOptions, 'name', '')
                    }
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
                    displayName: 'URL Landing Page',
                    field: 'url',
                    visible: GridService.getVisibilityByField(controller.columnsVisibility, 'url', true),
                    filter: {
                        term: GridService.getFilterByField(controller.paginationOptions, 'url', '')
                    }
                },
                {
                    displayName: 'Department',
                    field: 'departmentName',
                    visible: GridService.getVisibilityByField(controller.columnsVisibility, 'departmentName', true),
                    filter: {
                        term: GridService.getFilterByField(controller.paginationOptions, 'departmentName', '')
                    }
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
                GridService.resetExtend(columnsVisibilityBeforeChanges, $scope.gridOptions.columnDefs);
            }
        };

        controller.initDataGrid = function (coreId) {
            if (!coreId) {
                coreId = InstitutionFactory.getCoreId();
            }
            if (!coreId) {
                return false;
            }

            TuProfileProgramsService.getAllProgramsByCoreId(coreId).then(function (response) {
                $scope.isDatagridReloading = false;
                $scope.gridOptions.data = response;
                $scope.gridOptions.minRowsToShow = response.length < 50 ? response.length : 50;
                $scope.programsToDelete = {};
            });
        };

        controller.destruct = function () {
            alreadyInitialised = false;
        };

        controller.init = function () {
            controller.initWatches();
            controller.initEvents();
        };

        // listen to departments tab visibility changes
        WatchService.create($scope, TuProfileFactory.isProgramsTabSelected, function (isActive, wasActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TuProfileProgramsController', [
            '$scope',
            '$rootScope',
            '$templateRequest',
            'constants',
            'NotifierFactory',
            'TuProfileFactory',
            'InstitutionFactory',
            'TuProfileProgramsService',
            'TuProfileService',
            'uiGridConstants',
            'WatchService',
            'UiGridService',
            App.controllers.tuProfilePrograms
        ]);

} (window.angular));
