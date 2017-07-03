(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.InstitutionsTuPrograms = function (
        $scope,
        $rootScope,
        $controller,
        constants,
        TuProfileFactory,
        TuProfileService,
        InstitutionSwitchService,
        InstitutionFactory,
        WatchService,
        GridService
    ) {
        $controller('TuProfileProgramsController', {$scope: $scope});
        var controller = this,
            programsControllerAs = $scope.getTuProfileProgramsController();
        $scope.showProgramEditForm = false;
        $scope.showProgramAddForm = false;
        controller.searchInProgress = false;
        controller.institutionsDropdownList = [];

        controller.searchInstitution = function (searchPhrase) {
            controller.searchInProgress = true;
            InstitutionSwitchService.searchInstitutions(searchPhrase).then(function (results) {
                controller.institutionsDropdownList = results;
                controller.searchInProgress = false;
            });
        };

        // load TU profile data
        controller.loadTuProfileData = function (coreId) {
            TuProfileService.getTuProfileData(coreId).then(function (data) {
                $scope.profileDataLoaded = true;
                $scope.tuProfile = data;
                TuProfileFactory.setData(data);
                TuProfileFactory.setProgramAddFormVisibility(false);
                TuProfileFactory.setProgramEditFormVisibility(false);
                $scope.tuProfileBeforeChanges = angular.copy(data);
                $scope.$broadcast(constants.events.institutionTuProfileChanges);
            });
        };

        $scope.handleSearchInstitutionClick = function (institution) {
            if (institution && institution.coreId) {
                InstitutionFactory.setInstitutionIdTuProgramsOverview(institution.coreId);
                programsControllerAs.clearProgramsToDelete();
            }
        };

        $scope.isInstitutionSelected = function () {
            if ((InstitutionFactory.getInstitutionIdTuProgramsOverview() === null) ||
                !angular.isDefined(InstitutionFactory.getInstitutionIdTuProgramsOverview())) {
                return false;
            }
            return true;
        };

        // check if Right side pannel is active for add/edit programme
        $scope.isRightSidePanelActive = function () {
            if ($scope.showProgramEditForm || $scope.showProgramAddForm) {
                return true;
            }
            return false;
        };

        controller.getInstitutionIdTuProgramsOverviewWatch = function (newValue, oldValue) {
            if (newValue !== oldValue && newValue) {
                controller.coreId = newValue;
                controller.initWatches(newValue);
                controller.loadTuProfileData(newValue);
                programsControllerAs.initDataGrid(newValue);
            }
            else{
                InstitutionFactory.setInstitutionIdTuProgramsOverview(null);
            }
        };

        controller.hasNewProgramWatch = function (newProgramId) {
            if (newProgramId) {
                // reload datagrid
                programsControllerAs.reloadDatagrid(controller.coreId).then(function (programsList) {
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

                }).finally(function () {
                    // open new program in edit mode
                    TuProfileFactory.setProgramEditFormVisibility(true);
                });
            }
        };

        controller.isProgramAddFormVisibleWatch = function (visible) {
            $scope.showProgramAddForm = visible;
            visible = visible || TuProfileFactory.isProgramEditFormVisible(TuProfileFactory.getProfileTabs().programs);
            programsControllerAs.toggleColumns(visible);
        };

        controller.isProgramEditFormVisibleWatch = function (visible) {
            $scope.showProgramEditForm = visible;
            if (!visible) {
                $scope.selectedProgramId = null;
            } else {
                $scope.selectedProgramId = TuProfileFactory.getProgramId();
            }
            visible = visible || TuProfileFactory.isProgramAddFormVisible(TuProfileFactory.getProfileTabs().programs);
            programsControllerAs.toggleColumns(visible);
        };

        controller.initWatches = function (coreId) {
            if (!coreId) {
                return false;
            }
            // watch for new programs
            WatchService.create($scope, TuProfileFactory.hasNewProgram, controller.hasNewProgramWatch);

            // watch for program add form visibility changes
            WatchService.create($scope, function () {
                return TuProfileFactory.isProgramAddFormVisible(TuProfileFactory.getProfileTabs().programs);
            }, controller.isProgramAddFormVisibleWatch);

            // watch for program edit form visibility changes
            WatchService.create($scope, function () {
                return TuProfileFactory.isProgramEditFormVisible(TuProfileFactory.getProfileTabs().programs);
            }, controller.isProgramEditFormVisibleWatch);

            // Listen for changes in the visibility of the columns
            /*WatchService.create($scope, 'gridOptions.columnDefs',function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    programsControllerAs.columnsVisibility = GridService.getGridColumnsVisibility(newValue);
                    GridService.storeColumnsVisibility(
                        programsControllerAs.gridVisibilityNameSpace,
                        programsControllerAs.columnsVisibility
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

            $rootScope.$on(constants.events.logout, controller.destruct);
        };

        controller.destruct = function () {
            TuProfileFactory.reset();
            $scope.showProgramEditForm = false;
            $scope.showProgramAddForm = false;
        };

       WatchService.create(
            $scope,
            InstitutionFactory.getInstitutionIdTuProgramsOverview,
            controller.getInstitutionIdTuProgramsOverviewWatch
        );
    };

    angular
        .module('qsHub')
        .controller('InstitutionsTuProgramsController', [
            '$scope',
            '$rootScope',
            '$controller',
            'constants',
            'TuProfileFactory',
            'TuProfileService',
            'InstitutionSwitchService',
            'InstitutionFactory',
            'WatchService',
            'UiGridService',
            App.controllers.InstitutionsTuPrograms
        ]);

}(window.angular));
