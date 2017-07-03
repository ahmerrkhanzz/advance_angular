(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.tmDirectory = function (
        $scope,
        $timeout,
        constants,
        uiGridConstants,
        uiGridExporterConstants,
        uiGridExporterService,
        TmProfileService,
        TmDirectoryService,
        TmProfileProgramsService,
        InstitutionsListService,
        TmDirectoryFactory,
        TmProfileFactory,
        NotifierFactory,
        InstitutionFactory,
        GridService,
        WatchService,
        TimeService
    ) {
        var controller = this;
        controller.isDatagridRendered = false;
        controller.showInfoBlock = false;
        controller.showProgramEditForm = false;
        controller.editInProgress = false;
        controller.defaultPaginationOptions = {
            page: 1,
            limit: 25
        };
        controller.paginationOptions = GridService.getColumnsFilters(
            constants.gridNameSpaces.tmDirectoryGridFilters,
            []
        );
        controller.columnsVisibility = GridService.getColumnsVisibility(
            constants.gridNameSpaces.tmDirectoryGridVisibility
        );
        controller.sendEmailToClient = true;
        controller.programStatus = null;
        controller.TmProfileProgramFormController = null;
        $scope.selectedProgramId = null;

        controller.closeEditForm = function () {
            TmDirectoryFactory.setEditMode(false);
            controller.showInfoBlock = false;
            controller.toggleDatagridSettings();
            $scope.selectedProgramId = null;
            TmProfileFactory.setDirectory(false);
        };

        controller.handleDeleteAndPublishClick = function () {
            TmDirectoryService.delete(
                $scope.selectedProgramId,
                true,
                controller.sendEmailToClient
            ).then(function (success) {
                // close right side panel
                controller.closeEditForm();
                // show notification
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Deleted successfully! Publishing is in the queue.' : 'Deletion failed!',
                    'Program Deletion & Publishing'
                );
                // reload datagrid
                controller.reloadDatagrid();
            });
        };

        controller.getFormTitle = function () {
            if (TmProfileService.isProgramPendingApprove(controller.programStatus)) {
                return 'Requested (New)';
            }
            if (TmProfileService.isProgramPendingEdit(controller.programStatus)) {
                return 'Requested (Edit)';
            }
            if (TmProfileService.isProgramPendingDeletion(controller.programStatus)) {
                return 'Pending (Deletion)';
            }
            return 'Edit Program';
        };

        controller.handleCancelDeletionClick = function () {
            TmDirectoryService.revertStatus(
                $scope.selectedProgramId,
                controller.sendEmailToClient
            ).then(function (success) {
                // close right side panel
                controller.closeEditForm();
                // show notification
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Status reverted successfully!' : 'Status revert failed!',
                    'Program Status Revert'
                );
                // reload datagrid
                controller.reloadDatagrid();
            });
        };

        controller.handleProgramApproveClick = function (TmProfileProgramFormController, publish) {
            controller.publish = publish || false;

            controller.TmProfileProgramFormController = TmProfileProgramFormController;
            controller.TmProfileProgramFormController.submitted = true;
            controller.TmProfileProgramFormController.forms.editProgramDetailsForm.$setDirty();
            controller.TmProfileProgramFormController.forms.editProgramDetailsForm.name.$setDirty();
            controller.TmProfileProgramFormController.forms.editProgramDetailsForm.type.$setDirty();
            controller.TmProfileProgramFormController.forms.editProgramDetailsForm.description.$setDirty();
            controller.TmProfileProgramFormController.forms.editProgramStatsForm.$setDirty();
            controller.TmProfileProgramFormController.forms.editProgramStatsForm.avgGmat.$setDirty();
            controller.TmProfileProgramFormController.forms.editProgramStatsForm.classSize.$setDirty();
            controller.TmProfileProgramFormController.forms.editProgramStatsForm.avgSalaryAfterGraduation.$setDirty();

            // validate program data
            if (controller.editInProgress ||
                !controller.TmProfileProgramFormController.forms.editProgramDetailsForm ||
                !controller.TmProfileProgramFormController.forms.editProgramStatsForm ||
                !controller.TmProfileProgramFormController.isValid(controller.isProgramAdvanced)
            ) {
                return false;
            }
            controller.editInProgress = true;
            controller.totalProcessedCampuses = 0;

            if (controller.isAdvancedProgram) {
                // update program
                TmDirectoryService.approve(
                    controller.TmProfileProgramFormController.program,
                    controller.publish,
                    controller.sendEmailToClient
                ).then(controller.approveCallback);
            } else {
                var institutionCoreId = controller.TmProfileProgramFormController.programInstitutionCoreId,
                    hasTmp = false;
                angular.forEach(controller.TmProfileProgramFormController.programCampuses, function (campus) {
                    var campusData = angular.copy(campus),
                        isTmp = TmProfileProgramsService.isTmpCampusId(campus.id);
                    if (isTmp) {
                        hasTmp = true;
                        delete campusData.id;
                    }
                    if (isTmp || controller.TmProfileProgramFormController.campusesWithChanges.indexOf(campus.id) !== -1) {
                        InstitutionsListService.saveCampus(institutionCoreId, campusData).then(function (response) {
                            controller.totalProcessedCampuses++;
                            if (TmProfileProgramsService.isTmpCampusId(campus.id)) {
                                // delete temporary ID
                                delete controller.TmProfileProgramFormController.program.campus[controller.TmProfileProgramFormController.program.campus.indexOf(campus.id)];
                                // assign real new campus ID
                                controller.TmProfileProgramFormController.program.campus.push(response.insertedId);
                                if (controller.TmProfileProgramFormController.program.primaryCampusId === campus.id) {
                                    controller.TmProfileProgramFormController.program.primaryCampusId = response.insertedId;
                                }
                                if (institutionCoreId === InstitutionFactory.getCoreId()) {
                                    campus.id = response.insertedId;
                                    InstitutionFactory.addCampus(campus);
                                }
                            }
                            // if all program campuses were updated/created
                            if (controller.TmProfileProgramFormController.programCampuses.length === controller.totalProcessedCampuses) {
                                // filter out empty campuses
                                controller.TmProfileProgramFormController.program.campus = controller.TmProfileProgramFormController.program.campus.filter(function (item) {
                                    return item !== null;
                                });
                                // update program
                                TmDirectoryService.approve(
                                    controller.TmProfileProgramFormController.program,
                                    publish,
                                    controller.sendEmailToClient
                                ).then(controller.approveCallback);
                            }
                        });
                    } else {
                        controller.totalProcessedCampuses++;
                    }
                });
                if (!hasTmp && !controller.TmProfileProgramFormController.campusesWithChanges.length) {
                    // update program
                    TmDirectoryService.approve(
                        controller.TmProfileProgramFormController.program,
                        controller.publish,
                        controller.sendEmailToClient
                    ).then(controller.approveCallback);
                }
            }
        };

        /**
         * Actions to do when update request is finished.
         *
         * @param {Object} response
         */
        controller.approveCallback = function (response) {
            // close right side panel
            controller.closeEditForm();
            var succeed = 'success',
                publishMessage = 'Approved successfully! Publishing is in the queue.';
            if (controller.publish && angular.isObject(response)) {
                var publishSuccess = response.published;
                succeed = publishSuccess ? succeed : 'warning';
                publishMessage = publishSuccess ? publishMessage : 'Edit approved successfully, but unable to publish. Parent institution needs to be published first';
            }
            // show notification about program submit status
            NotifierFactory.show(
                response ? succeed : 'error',
                response ? (
                    controller.publish ? publishMessage : 'Approved successfully!'
                ) : 'Approving failed!',
                controller.publish ? 'Program Approve & Publishing' : 'Program Approve',
                succeed === 'warning'
            );
            controller.editInProgress = false;
            // reload datagrid
            controller.reloadDatagrid();
            if (response) {
                TmProfileService.clearCache();
            }
        };

        controller.reloadDatagrid = function () {
            controller.getPage();
        };

        controller.handleDatagridRowClick = function (program) {
            if (TmProfileService.isProgramPendingApprove(program.status) || TmProfileService.isProgramPendingEdit(program.status)) {
                controller.approveButtonTitle = 'Approve';
            }
            else {
                controller.approveButtonTitle = 'Update';
            }
            TmProfileFactory.setDirectory(true);
            if (controller.TmProfileProgramFormController) {
                controller.TmProfileProgramFormController.submitted = false;
            }
            // another program selected
            if ($scope.selectedProgramId && program.id !== $scope.selectedProgramId) {
                TmDirectoryFactory.setEditMode(true);
            } else if (!$scope.selectedProgramId && program.id) {
                TmDirectoryFactory.setEditMode(true);
                $scope.showProgramAddForm = false;
                $scope.showProgramEditForm = true;
            } else {
                TmDirectoryFactory.setEditMode(false);
                $scope.showProgramAddForm = false;
                $scope.showProgramEditForm = false;
            }
            controller.showInfoBlock = TmDirectoryFactory.isEditMode();

            controller.toggleDatagridSettings();
            $scope.selectedProgramId = controller.showInfoBlock ? program.id : null;
            controller.programStatus = program.status;
            controller.isProgramAdvanced = program.advanced;
            controller.showProgramEditForm = controller.showInfoBlock;
            controller.pendingDeletion = TmProfileService.isProgramPendingDeletion(program.status);
            controller.approved = TmProfileService.isProgramApproved(program.status) ||
                TmProfileService.isProgramEditApproved(program.status);
            controller.readOnly = controller.pendingDeletion;
            controller.sendEmailToClient = !controller.approved;
            TmProfileFactory.setProgram(angular.copy(program));
            TmProfileFactory.setReadOnly(controller.readOnly);
        };

        controller.toggleDatagridSettings = function () {
            // toggle grid menu
            $scope.gridOptions.enableGridMenu = !controller.showInfoBlock;
            // toggle columns resize
            $scope.gridOptions.enableColumnResizing = !controller.showInfoBlock;
            // toggle grid pagination
            $scope.gridOptions.enablePaginationControls = !controller.showInfoBlock;
        };

        controller.getSortColumn = function (column) {
            return (column.name || column.field).replace('AsString', '');
        };

        controller.handleGridFiltersChanges = function () {
            var sortKeys = [],
                latestSortKey,
                filterColumn;
            angular.forEach($scope.gridApi.grid.columns, function (column) {
                if (typeof column.filters !== 'undefined' && typeof column.filters[0].term !== 'undefined') {
                    if (
                        column.filters[0].type === uiGridConstants.filter.SELECT &&
                        typeof column.filters[0].term === 'object' &&
                        column.filters[0].term !== null &&
                        typeof column.filters[0].term.value !== 'undefined'
                    ) {
                        column.filters[0].term = column.filters[0].term.value;
                    }
                }
                if (typeof column.sort.priority !== 'undefined') {
                    sortKeys[column.sort.priority] = controller.getSortColumn(column);
                }
            });

            if (sortKeys.length > 1) {
                latestSortKey = sortKeys.pop();
                angular.forEach($scope.gridApi.grid.columns, function (column) {
                    if (typeof column.sort.priority !== 'undefined' &&
                        controller.getSortColumn(column) !== latestSortKey
                    ) {
                        column.sort = {};
                    }
                });
            }

            controller.paginationOptions = angular.copy(controller.defaultPaginationOptions);
            angular.forEach($scope.gridApi.grid.columns, function (column) {
                if (
                    typeof column.filters !== 'undefined' &&
                    column.filters[0].term !== 'undefined' &&
                    column.filters[0].term !== ''
                ) {
                    filterColumn = column.filters[0].column ? column.filters[0].column : column.field;
                    controller.paginationOptions['filter[' + filterColumn + ']'] = column.filters[0].term;
                }
                if (typeof column.sort.direction !== 'undefined') {
                    controller.paginationOptions['sorting[' + controller.getSortColumn(column) + ']'] = column.sort.direction;
                }
            });

            GridService.storeColumnsFilters(
                constants.gridNameSpaces.tmDirectoryGridFilters,
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
            return TmDirectoryService.getAllPrograms(
                angular.merge({}, controller.paginationOptions, controller.defaultPaginationOptions)
            ).then(function (response) {
                if (!$scope.gridOptions) {
                    $scope.gridOptions = {};
                }
                $scope.gridOptions.totalItems = response.totalMatching;
                $scope.gridOptions.data = response.results;
                $scope.gridOptions.minRowsToShow = response.totalFiltered.length < 25 ? response.totalFiltered : 25;
            });
        };

        var selectTemplate = '/scripts/shared/ui-grid/templates/selectFilterHeaderTemplate.html',
            selectCellTemplate = '/scripts/shared/ui-grid/templates/selectCellTemplate.html';
        controller.initDataGrid = function () {
            controller.getPage().then(function () {
                $scope.gridOptions = angular.extend({}, $scope.gridOptions, {
                    enableSorting: true,
                    exporterMenuCsv: true,
                    exporterMenuAllData: false,
                    exporterMenuPdf: false,
                    enableGridMenu: true,
                    showGridFooter: false,
                    selectedItems: $scope.selectedProgramId,
                    enableFiltering: true,
                    useExternalFiltering: true,
                    enableColumnResize: true,
                    enableFullRowSelection: true,
                    enableRowSelection: true,
                    multiSelect: false,
                    enableRowHeaderSelection: false,
                    paginationPageSizes: [25, 50, 100],
                    paginationPageSize: 25,
                    useExternalPagination: true,
                    useExternalSorting: true,
                    exporterCsvFilename: 'tm-directory-export.' + TimeService.now() + '.csv',
                    gridMenuCustomItems: [
                        {
                            title: ' Export all data as csv',
                            action: function () {
                                return TmDirectoryService.getAllPrograms(
                                    angular.merge({}, controller.paginationOptions, {
                                        page: 1,
                                        limit: 250000
                                    })
                                ).then(function (response) {
                                    var exportColumnHeaders = uiGridExporterService.getColumnHeaders(
                                        $scope.gridApi.grid,
                                        uiGridExporterConstants.VISIBLE
                                    ),
                                        exportData = TmDirectoryService.getCsvData(
                                            $scope.gridApi.grid.columns,
                                            response.results
                                        ),
                                        csvContent = uiGridExporterService.formatAsCsv(
                                            exportColumnHeaders,
                                            exportData,
                                            $scope.gridOptions.exporterCsvColumnSeparator
                                        );
                                    uiGridExporterService.downloadFile(
                                        $scope.gridOptions.exporterCsvFilename,
                                        csvContent,
                                        $scope.gridOptions.exporterOlderExcelCompatibility
                                    );
                                });
                            },
                            order: 210
                        }
                    ],
                    rowTemplate: '/scripts/components/profiles/tm/programs/datagrid/rowTemplate.html',
                    columnDefs: [
                        {
                            displayName: 'ID',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'coreIdAsString', true),
                            field: 'coreIdAsString',
                            maxWidth: 80,
                            filter: {
                                term: GridService.getFilterByField(controller.paginationOptions, 'coreIdAsString', '')
                            }
                        },
                        {
                            displayName: 'Name',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'name', true),
                            field: 'name',
                            name: 'nameLowerCase',
                            filter: {
                                term: GridService.getFilterByField(controller.paginationOptions, 'name', '')
                            }
                        },
                        {
                            displayName: 'Type',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'type', true),
                            field: 'type',
                            filter: {
                                type: uiGridConstants.filter.SELECT,
                                selectOptions: TmProfileService.getProgramTypesList(),
                                term: GridService.getFilterByField(controller.paginationOptions, 'type')
                            },
                            filterHeaderTemplate: selectTemplate,
                            cellTemplate: selectCellTemplate
                        },
                        {
                            displayName: 'Advanced',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'advanced', true),
                            field: 'advanced',
                            filter: {
                                type: uiGridConstants.filter.SELECT,
                                selectOptions: [
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' }
                                ],
                                term: GridService.getFilterByField(controller.paginationOptions, 'advanced')
                            },
                            maxWidth: 100,
                            filterHeaderTemplate: selectTemplate,
                            cellTemplate: selectCellTemplate
                        },
                        {
                            displayName: 'Institution ID',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'institutionCoreIdAsString', true),
                            field: 'institutionCoreIdAsString',
                            filter: {
                                term: GridService.getFilterByField(controller.paginationOptions, 'institutionCoreIdAsString')
                            }
                        },
                        {
                            displayName: 'Institution Name',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'institutionName', true),
                            field: 'institutionName',
                            name: 'institutionNameLowerCase',
                            filter: {
                                term: GridService.getFilterByField(controller.paginationOptions, 'institutionName')
                            }
                        },
                        {
                            displayName: 'Parent Institution ID',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'parentInstitutionCoreIdAsString', true),
                            field: 'parentInstitutionCoreIdAsString',
                            filter: {
                                term: GridService.getFilterByField(controller.paginationOptions, 'parentInstitutionCoreIdAsString')
                            }
                        },
                        {
                            displayName: 'Parent Institution Name',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'parentInstitutionName', true),
                            field: 'parentInstitutionName',
                            name: 'parentInstitutionNameLowerCase',
                            filter: {
                                term: GridService.getFilterByField(controller.paginationOptions, 'parentInstitutionName')
                            }
                        },
                        {
                            displayName: 'Status',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'status', true),
                            filter: {
                                type: uiGridConstants.filter.SELECT,
                                selectOptions: TmProfileService.getProgramStatusList(),
                                term: GridService.getFilterByField(controller.paginationOptions, 'status')
                            },
                            field: 'status',
                            maxWidth: 130,
                            filterHeaderTemplate: selectTemplate,
                            cellTemplate: selectCellTemplate
                        }
                    ],
                    onRegisterApi: function (gridApi) {
                        var columnsVisibilityBeforeChanges = angular.copy($scope.gridOptions.columnDefs);
                        $scope.gridApi = gridApi;
                        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                            controller.handleDatagridRowClick(row.entity);
                        });
                        gridApi.core.on.rowsRendered($scope, function () {
                            controller.isDatagridRendered = true;
                        });
                        // actions to do on active page changes
                        gridApi.pagination.on.paginationChanged($scope, function (newPage, limit) {
                            controller.defaultPaginationOptions.page = newPage;
                            controller.defaultPaginationOptions.limit = limit;
                            controller.getPage();
                        });
                        // actions to do on filters changes
                        $scope.gridApi.core.on.filterChanged($scope, controller.handleGridFiltersChanges);
                        // actions to do on visible columns changes
                        $scope.gridApi.core.on.rowsVisibleChanged($scope, controller.handleGridVisibleChanges);
                        // actions to do on sort order changes
                        $scope.gridApi.core.on.sortChanged($scope, controller.handleGridFiltersChanges);
                        // reset columns visibility
                        GridService.resetExtend(columnsVisibilityBeforeChanges, $scope.gridOptions.columnDefs);
                        
                    }
                });
            });
        };

        controller.handleGridVisibleChanges = function () {
            var columnsVisibility = GridService.getColumnsVisibility(constants.gridNameSpaces.tmDirectoryGridVisibility),
                reload = false;

            if (columnsVisibility) {
                angular.forEach($scope.gridOptions.columnDefs, function (column, key) {
                    if (columnsVisibility[column.field] === true &&
                        column.visible === false
                    ) {
                        $scope.gridOptions.columnDefs[key].filter.term = null;
                        controller.paginationOptions['filter[' + column.field + ']'] = null;
                        reload = true;
                    }
                });
            }

            controller.columnsVisibility = GridService.getGridColumnsVisibility($scope.gridOptions.columnDefs);
            GridService.storeColumnsVisibility(
                constants.gridNameSpaces.tmDirectoryGridVisibility,
                controller.columnsVisibility
            );
            if (reload) {
                controller.getPage();
            }
        };

        controller.init = function () {
            controller.initDataGrid();
            TmProfileFactory.setBackend(true);
        };

        controller.init();
    };

    angular
        .module('qsHub')
        .controller('TmDirectoryController', [
            '$scope',
            '$timeout',
            'constants',
            'uiGridConstants',
            'uiGridExporterConstants',
            'uiGridExporterService',
            'TmProfileService',
            'TmDirectoryService',
            'TmProfileProgramsService',
            'InstitutionsListService',
            'TmDirectoryFactory',
            'TmProfileFactory',
            'NotifierFactory',
            'InstitutionFactory',
            'UiGridService',
            'WatchService',
            'TimeService',
            App.controllers.tmDirectory
        ]);

} (window.angular));
