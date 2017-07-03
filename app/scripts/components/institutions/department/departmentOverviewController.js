(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.departmentOverview = function (
        $scope,
        $rootScope,
        $controller,
        constants,
        InstitutionFactory,
        TuProfileFactory,
        TuProfileService,
        TuProfileDepartmentsService,
        InstitutionsService,
        InstitutionSwitchService,
        WatchService,
        GridService,
        $stateParams
    ) {
        $controller('TuProfileDepartmentsController', {$scope: $scope});
        var controller = this,
            departmentControllerAs = $scope.getTuProfileDepartmentController();
        $scope.showDepartmentEditForm = false;
        $scope.showDepartmentAddForm = false;
        controller.searchInProgress = false;
        controller.isDatagridReloading = false;
        controller.institution = {};
        controller.institutionsList = [];
        controller.showInstitutionDeps = false;

        controller.searchInstitution = function (searchPhrase) {
            controller.searchInProgress = true;
            InstitutionSwitchService.searchInstitutions(searchPhrase).then(function (results) {
                controller.institutionsList = results;
                controller.searchInProgress = false;
            });
        };

        controller.isAddButtonDisabled = function () {
            return !controller.isInstitutionSelected() || controller.isRightSidePanelActive();
        };

        $scope.isDeleteButtonDisabled = function () {
            return $scope.deleteInProgress ||
                !InstitutionFactory.getInstitutionIdDepartmentOverview() ||
                !departmentControllerAs.hasDepartmentsToDelete();
        };

        controller.handleSearchInstitutionClick = function (institution) {
            if (institution && institution.coreId) {
                InstitutionFactory.setInstitutionIdDepartmentOverview(institution.coreId);
                controller.coreId = institution.coreId;
                departmentControllerAs.clearDepartmentsToDelete();
            }
        };

        controller.isInstitutionSelected = function () {
            if(controller.showInstitutionDeps) {
                return true;
            }
            if ((InstitutionFactory.getInstitutionIdDepartmentOverview() === null) ||
                (typeof InstitutionFactory.getInstitutionIdDepartmentOverview() === 'undefined')
            ) {
                return false;
            }
            return true;
        };

        controller.isRightSidePanelActive = function () {
            // departments tab is active and edit or add form is active
            if ($scope.showDepartmentEditForm || $scope.showDepartmentAddForm) {
                return true;
            }
            return false;
        };

        controller.reloadDatagrid = function (coreId) {
            if (!coreId) {
                return false;
            }
            controller.isDatagridReloading = true;
            return TuProfileDepartmentsService.getAllDepartmentsByCoreId(coreId).then(function(response) {
                controller.isDatagridReloading = false;

                $scope.gridOptions.data = response;

                return response;
            });
        };

        controller.hasNewDepartmentWatch = function (newDepartmentId) {
            if (newDepartmentId) {
                // reload datagrid
                controller.reloadDatagrid(controller.coreId).then(function (departmentsList) {
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
        };

        controller.isDepartmentAddFormVisibleWatch = function (visible) {
            $scope.showDepartmentAddForm = visible;
            visible = visible || TuProfileFactory.isDepartmentEditFormVisible(TuProfileFactory.getProfileTabs().departments);
            departmentControllerAs.toggleColumns(visible);
        };

        controller.isDepartmentEditFormVisible = function (visible) {
            $scope.showDepartmentEditForm = visible;
            if (!visible) {
                $scope.selectedDepartmentId = null;
            } else {
                $scope.selectedDepartmentId = TuProfileFactory.getDepartmentId();
            }
            visible = visible || TuProfileFactory.isDepartmentAddFormVisible(TuProfileFactory.getProfileTabs().departments);
            departmentControllerAs.toggleColumns(visible);
        };

        controller.getInstitutionIdDepartmentOverviewWatch = function (newValue, oldValue) {
            if ($stateParams.coreId) {
                newValue = $stateParams.coreId;
            }
            if (newValue !== oldValue && newValue) {
                controller.destruct();
                InstitutionsService.getInstitutionData(newValue).then(function (data) {
                    var institutionData = data && data.results ? data.results[0] : null;
                    InstitutionFactory.setDataDepartmentOverview(institutionData);
                    InstitutionFactory.setInstitutionIdDepartmentOverview(newValue);
                });
                controller.initWatches(newValue);
                departmentControllerAs.initDataGrid(newValue);
            }
        };

        controller.initWatches = function (coreId) {
            if (!coreId) {
                return false;
            }

            // watch for new departments
            WatchService.create($scope, TuProfileFactory.hasNewDepartment, controller.hasNewDepartmentWatch);
            // watch for department add form visibility changes
            WatchService.create($scope, function () {
                return TuProfileFactory.isDepartmentAddFormVisible(TuProfileFactory.getProfileTabs().departments);
            }, controller.isDepartmentAddFormVisibleWatch);
            // watch for department edit form visibility changes
            WatchService.create($scope, function () {
                return TuProfileFactory.isDepartmentEditFormVisible(TuProfileFactory.getProfileTabs().departments);
            }, controller.isDepartmentEditFormVisible);

            $rootScope.$on(constants.events.logout, controller.destruct);

            // Listen for changes in the visibility of the columns
            /*WatchService.create($scope, 'gridOptions.columnDefs',function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    departmentControllerAs.columnsVisibility = GridService.getGridColumnsVisibility(newValue);
                    GridService.storeColumnsVisibility(
                        departmentControllerAs.gridVisibilityNameSpace,
                        departmentControllerAs.columnsVisibility
                    );
                    // Clear filter when column is hidden
                    if (angular.isDefined(newValue) &&
                        angular.isDefined(oldValue)
                    ) {
                        for (var i = 0; i < newValue.length; i++) {
                            if (newValue[i].visible === false &&
                                oldValue[i].visible === true &&
                                angular.isDefined($scope.gridOptions.columnDefs[i].filter)
                            ) {
                                $scope.gridOptions.columnDefs[i].filter.term = null;
                            }
                        }
                    }
                }
            },true);*/
        };

        controller.destruct = function () {
            TuProfileFactory.reset();
            TuProfileFactory.setDepartmentAddFormVisibility(false);
            TuProfileFactory.setDepartmentEditFormVisibility(false);
        };

        /*
        show departments for institution
         */
        controller.showInstitutionDepartments = function (){
            if ($stateParams.coreId &&
                $stateParams.name &&
                typeof($stateParams.coreId) !== "undefined"
            ) {
                controller.initWatches($stateParams.coreId);
                controller.institution.selected = {
                    name: $stateParams.name +  ' [' + $stateParams.coreId + ']',
                    coreId: $stateParams.coreId
                };
                departmentControllerAs.initDataGrid($stateParams.coreId);
                controller.showInstitutionDeps = true;
                controller.coreId = $stateParams.coreId;
            }
        };
        controller.init = function () {
            controller.showInstitutionDepartments();
            InstitutionFactory.resetDepartmentOverview();
            controller.destruct();
            controller.activeInstitutionCoreId = $stateParams.coreId;

        };

        controller.init();

        WatchService.create(
            $scope,
            InstitutionFactory.getInstitutionIdDepartmentOverview,
            controller.getInstitutionIdDepartmentOverviewWatch
        );

    };

    angular
        .module('qsHub')
        .controller('DepartmentOverviewController', [
            '$scope',
            '$rootScope',
            '$controller',
            'constants',
            'InstitutionFactory',
            'TuProfileFactory',
            'TuProfileService',
            'TuProfileDepartmentsService',
            'InstitutionsService',
            'InstitutionSwitchService',
            'WatchService',
            'UiGridService',
            '$stateParams',
            App.controllers.departmentOverview
        ]);

}(window.angular));
