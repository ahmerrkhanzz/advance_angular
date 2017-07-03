(function (angular, moment) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.tmProfilePrograms = function (
        $scope,
        $rootScope,
        $state,
        constants,
        uiGridConstants,
        NotifierFactory,
        TmProfileFactory,
        InstitutionFactory,
        UserFactory,
        TmProfileProgramsService,
        TmProfileService,
        InstitutionsService,
        InstitutionsListService,
        WatchService,
        GridService
    ) {
        var controller = this,
            alreadyInitialised = false;

        controller.isDatagridReloading = true;
        controller.isDatagridRendered = false;
        controller.devMode = constants.dev;
        controller.programsPackage = [
            { value: 'false', label: 'Basic' },
            { value: 'true', label: 'Advanced' }
        ];
        $scope.isAdvanced = false;
        controller.institution = {};

        controller.paginationOptions = GridService.getColumnsFilters(
            constants.gridNameSpaces.programsTmGridFilters,
            []
        );

        controller.columnsVisibility = GridService.getColumnsVisibility(
            constants.gridNameSpaces.programsTmGridVisibility
        );

        controller.handleDatagridRowClick = function (program) {
            TmProfileFactory.setProgramUpgradeFormVisibility(false);
            if ($scope.selectedProgramId === program.id) {
                $scope.selectedProgramId = null;
                TmProfileFactory.setProgramEditFormVisibility(false);
                TmProfileFactory.setProgram({});
            } else {
                $scope.selectedProgramId = program.id;
                TmProfileFactory.setProgramEditFormVisibility(true);
                TmProfileFactory.setProgram(program);
                TmProfileFactory.setReadOnly(
                    TmProfileService.isProgramPendingDeletion(program.status) || program.advanced
                );
            }
        };

        controller.handleDatagridFiltersChanges = function (grid) {
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
                constants.gridNameSpaces.programsTmGridFilters,
                controller.paginationOptions
            );
        };

        controller.isClient = function () {
            return UserFactory.isClient();
        };

        controller.reloadDatagrid = function () {
            var coreId = InstitutionFactory.getCoreId();
            if (!coreId) {
                return false;
            }
            controller.isDatagridReloading = true;
            return TmProfileProgramsService.getAllProgramsByCoreId(coreId).then(controller.handleProgramsListResponse);
        };

        /**
         * Actions to do when add program button is clicked.
         */
        controller.handleAddProgramClick = function () {
            $scope.selectedProgramId = null;
            TmProfileFactory.setProgramAddFormVisibility();
            TmProfileFactory.setProgram({});
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

        controller.handleProgramsListResponse = function (response) {
            controller.isDatagridReloading = false;
            if (angular.isDefined($scope.gridOptions)) {
                $scope.gridOptions.data = response;
                $scope.gridOptions.minRowsToShow = response && response.length < 50 ? response.length : 50;
            }
            // if the program is selected, set program from response
            if ($scope.selectedProgramId) {
                angular.forEach($scope.gridOptions.data, function (item) {
                    if (angular.equals(item.id, $scope.selectedProgramId)) {
                        TmProfileFactory.setProgram(item);
                        TmProfileFactory.setReadOnly(!!item.advanced);
                    }
                });
            }
        };

        controller.linkSubscriptions = function (coreId) {
            InstitutionsService.getInstitutionData(coreId).then(function (data) {
                var institutionData = data && data.results ? data.results[0] : null;
                if (institutionData.linkedWithAdvancedPrograms) {
                    InstitutionsListService.getAllSubscriptions(coreId).then(function (res) {
                        res.forEach(function (item) {
                            controller.institution = angular.copy(institutionData);
                            if (item >= institutionData.subscriptions.tm.endDate) {
                                controller.institution.subscriptions.tm.endDate = item;
                            }
                            InstitutionsListService.saveSubscription(controller.institution).then(function (success) {
                                if (success) {
                                    // check if subscription data is in the past or in the future
                                    if (controller.institution.subscriptions) {
                                        angular.forEach(controller.institution.subscriptions, function (subscription) {
                                            if (subscription.subscribed &&
                                                subscription.advanced &&
                                                subscription.endDate < moment().format('x')
                                            ) {
                                                subscription.advanced = false;
                                            }
                                            if (subscription.subscribed &&
                                                subscription.advanced &&
                                                subscription.startDate > moment().format('x')
                                            ) {
                                                subscription.advanced = false;
                                            }
                                        });
                                    }
                                    // reset institution edit instance
                                    $scope.institutionBeforeChanges = angular.copy(controller.institution);
                                    InstitutionsListService.appendSubscriptionsData([controller.institution]);
                                    // check if current active institution is same as edited one
                                    var currentCoreId = controller.institution.coreId;
                                    if (currentCoreId) {
                                        var activeCoreId = InstitutionFactory.getCoreId();
                                        if (activeCoreId && currentCoreId === activeCoreId) {
                                            InstitutionFactory.setSubscriptions(angular.copy(controller.institution.subscriptions));
                                        }
                                    }

                                }
                            });
                        });
                    });
                }
            });
        };


        /**
         * Actions to do when program is deleted.
         * @param {Boolean} deleted
         */
        controller.hasDeletedProgramsWatch = function (deleted) {
            if (deleted) {
                // reload datagrid
                controller.initDataGrid(false);
                // reset deletion trigger
                TmProfileFactory.clearDeletedProgram();
                // unselect selected program
                $scope.selectedProgramId = null;
            }
        };

        /**
         * Actions to do when program is updated.
         * @param {Boolean} updated
         */
        controller.hasUpdatedProgramWatch = function (updated) {
            if (updated) {
                // reload datagrid
                controller.initDataGrid(false);
                // reset update trigger
                TmProfileFactory.clearProgramUpdate();
            }
        };

        /**
         * Actions to do when right hand panel visibility changes.
         * @param {Boolean} active
         */
        controller.isRightSidePanelActiveWatch = function (active) {
            if (!active) {
                $scope.selectedProgramId = null;
            }
        };

        /**
         * Actions to do on Core ID changes.
         * @param {Number|null} coreId
         */
        controller.getCoreIdWatch = function (coreId) {
            if (coreId) {
                $scope.selectedProgramId = null;
                // use cache as institution data should be loaded already
                controller.initDataGrid(true);
                controller.linkSubscriptions(coreId);
            }
        };

        /**
         * Actions to do when new program is added.
         * @param {Boolean} added
         */
        controller.hasNewProgramWatch = function (added) {
            if (added) {
                $scope.selectedProgramId = added;
                controller.initDataGrid(false);
            }
        };

        /**
         * Actions to do when new program is upgraded.
         * @param {Boolean} added
         */
        controller.hasNewProgramUpgradeWatch = function (upgraded) {
            if (upgraded) {
                var core_id = InstitutionFactory.getCoreId();
                controller.linkSubscriptions(core_id);
            }
        };

        /**
         * Actions to do when datagrid reload is requested.
         * @param {Boolean} reload
         */
        controller.isProgramsDatagridReloadWatch = function (reload) {
            if (reload) {
                controller.initDataGrid(false);
                TmProfileFactory.resetProgramsDatagridReload();
            }
        };

        controller.handleGridVisibleChanges = function () {
            var columnsVisibility = GridService.getColumnsVisibility(constants.gridNameSpaces.programsTmGridVisibility);
            if (columnsVisibility) {
                angular.forEach($scope.gridOptions.columnDefs, function (column, key) {
                    if (columnsVisibility[column.field] === true &&
                        column.visible === false
                    ) {
                        $scope.gridOptions.columnDefs[key].filter.term = null;
                    }
                });
            }

            controller.columnsVisibility = GridService.getGridColumnsVisibility($scope.gridOptions.columnDefs);
            GridService.storeColumnsVisibility(
                constants.gridNameSpaces.programsTmGridVisibility,
                controller.columnsVisibility
            );
        };

        controller.initWatches = function () {
            // listen to core ID changes
            WatchService.create($scope, InstitutionFactory.getCoreId, controller.getCoreIdWatch);
            // listen to deleted programs announcements
            WatchService.create($scope, TmProfileFactory.hasDeletedProgram, controller.hasDeletedProgramsWatch);
            // listen to programs updates announcements
            WatchService.create($scope, TmProfileFactory.hasUpdatedProgram, controller.hasUpdatedProgramWatch);
            // listen to datagrid reload requests
            WatchService.create($scope, TmProfileFactory.isProgramsDatagridReload, controller.isProgramsDatagridReloadWatch);
            // listen to right side panel visibility changes
            WatchService.create($scope, TmProfileFactory.isRightSidePanelActive, controller.isRightSidePanelActiveWatch);
            // listen to new programs
            WatchService.create($scope, TmProfileFactory.hasNewProgram, controller.hasNewProgramWatch);
            // listen to new program upgrade
            WatchService.create($scope, TmProfileFactory.isUpgradedSubscriptions, controller.hasNewProgramUpgradeWatch);

            $rootScope.$on(constants.events.logout, controller.destruct);
        };

        controller.initDataGrid = function (useCache) {
            var selectTemplate = '/scripts/shared/ui-grid/templates/selectFilterHeaderTemplate.html',
                selectCellTemplate = '/scripts/shared/ui-grid/templates/selectCellTemplate.html',
                coreId = InstitutionFactory.getCoreId();
            if (!coreId) {
                return false;
            }
            controller.isDatagridReloading = true;
            TmProfileService.getCampusesKeyValuePairs(useCache).then(function (campusesList) {
                controller.campusesList = campusesList;
                $scope.gridOptions = {
                    enableSorting: true,
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
                    rowTemplate: '/scripts/components/profiles/tm/programs/datagrid/rowTemplate.html',
                    columnDefs: [{
                        displayName: 'Advanced',
                        field: 'advanced',
                        enableSorting: true,
                        enableFiltering: true,
                        enableColumnResizing: false,
                        cellTemplate: '/scripts/components/profiles/tm/programs/datagrid/advancedCellTemplate.html',
                        maxWidth: 108,
                        filter: {
                            type: uiGridConstants.filter.SELECT,
                            selectOptions: controller.programsPackage,
                            term: GridService.getFilterByField(controller.paginationOptions, 'advanced')
                        },
                        visible: GridService.getVisibilityByField(controller.columnsVisibility, 'advanced', true),
                        filterHeaderTemplate: selectTemplate
                    }, {
                        displayName: 'Program Name',
                        field: 'name',
                        visible: GridService.getVisibilityByField(controller.columnsVisibility, 'name', true),
                        filter: {
                            term: GridService.getFilterByField(controller.paginationOptions, 'name', '')
                        }
                    }, {
                        displayName: 'Program Type',
                        field: 'type',
                        filter: {
                            type: uiGridConstants.filter.SELECT,
                            selectOptions: TmProfileService.getProgramTypesList(),
                            term: GridService.getFilterByField(controller.paginationOptions, 'type')
                        },
                        visible: GridService.getVisibilityByField(controller.columnsVisibility, 'type', true),
                        filterHeaderTemplate: selectTemplate,
                        cellTemplate: selectCellTemplate
                    }, {
                        enableFiltering: true, // @todo allow filtering by campus
                        displayName: 'Campus',
                        field: 'campus',
                        filter: {
                            type: uiGridConstants.filter.SELECT,
                            selectOptions: controller.campusesList,
                            term: GridService.getFilterByField(controller.paginationOptions, 'campus')
                        },
                        visible: GridService.getVisibilityByField(controller.columnsVisibility, 'campus', true),
                        filterHeaderTemplate: selectTemplate,
                        cellTemplate: '/scripts/components/tmDirectory/datagrid/campusCellTemplate.html'
                    }, {
                        displayName: 'Status',
                        filter: {
                            type: uiGridConstants.filter.SELECT,
                            selectOptions: TmProfileService.getProgramStatusList(),
                            term: GridService.getFilterByField(controller.paginationOptions, 'status')
                        },
                        visible: GridService.getVisibilityByField(controller.columnsVisibility, 'status', true),
                        field: 'status',
                        maxWidth: 130,
                        filterHeaderTemplate: selectTemplate,
                        cellTemplate: selectCellTemplate
                    }],
                    onRegisterApi: function (gridApi) {
                        var columnsVisibilityBeforeChanges = angular.copy($scope.gridOptions.columnDefs);
                        $scope.gridApi = gridApi;
                        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                            controller.handleDatagridRowClick(row.entity);
                        });
                        gridApi.core.on.rowsRendered($scope, function () {
                            controller.isDatagridRendered = true;
                        });
                        gridApi.core.on.filterChanged($scope, function () {
                            controller.handleDatagridFiltersChanges(this.grid);
                        });
                        gridApi.core.on.rowsVisibleChanged($scope, controller.handleGridVisibleChanges);
                        // reset columns visibility
                        GridService.resetExtend(columnsVisibilityBeforeChanges, $scope.gridOptions.columnDefs);
                    }
                };
                if (InstitutionFactory.isTmSubscribed() && !UserFactory.noAccess($state.current.name)) {
                    TmProfileProgramsService.getAllProgramsByCoreId(coreId).then(controller.handleProgramsListResponse);
                }
            });
        };

        controller.destruct = function () {
            alreadyInitialised = false;
        };
        controller.init = function () {
            controller.initWatches();
        };

        // listen to departments tab visibility changes
        WatchService.create($scope, TmProfileFactory.isProgramsTabSelected, function (isActive, wasActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            } else if (alreadyInitialised && isActive && !wasActive) {
                $scope.selectedProgramId = null;
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TmProfileProgramsController', [
            '$scope',
            '$rootScope',
            '$state',
            'constants',
            'uiGridConstants',
            'NotifierFactory',
            'TmProfileFactory',
            'InstitutionFactory',
            'UserFactory',
            'TmProfileProgramsService',
            'TmProfileService',
            'InstitutionsService',
            'InstitutionsListService',
            'WatchService',
            'UiGridService',
            App.controllers.tmProfilePrograms
        ]);

} (window.angular, window.moment));
