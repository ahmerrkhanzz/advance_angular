(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.InstitutionsTuProgramsForm = function (
        $scope,
        $controller,
        InstitutionFactory,
        TuProfileDepartmentsService,
        InstitutionsService,
        WatchService
    ) {
        $controller('TuProfileProgramForm', {$scope: $scope});
        var controller = this,
        programFormControllerAs = $scope.getTuProfileProgramFormController();
        controller.initWatches = function () {
            WatchService.create($scope, InstitutionFactory.getInstitutionIdTuProgramsOverview, function (newValue) {
                if (newValue) {
                    TuProfileDepartmentsService.getAllDepartments(
                        newValue,
                        {
                            page: 1, // show first page
                            count: 1000, // count per page
                        }
                    );
                    $scope.newProgram.institutionCoreId = newValue;
                    $scope.newProgramBeforeChanges.institutionCoreId = newValue;

                    //get institution data
                    InstitutionsService.getInstitutionData(newValue).then(function (data) {
                        var institutionData = data && data.results ? data.results[0] : null;
                        $scope.InstitutionNameTuPrograms = institutionData.name;
                    });

                    // check if institution is client department
                    $scope.isClientDepartment = InstitutionFactory.isClientDepartment();
                    if ($scope.isClientDepartment) {
                        $scope.newProgram.departmentCoreId = newValue;
                        $scope.departmentsList = [{
                            coreId: newValue,
                            name: $scope.InstitutionNameTuPrograms
                        }];
                        $scope.newProgramBeforeChanges = {
                            institutionCoreId: newValue,
                            departmentCoreId: newValue
                        };
                    }
                }
            });
        };
        controller.init = function () {
            programFormControllerAs.init();
            programFormControllerAs.initForm();
            if ($scope.forms && $scope.forms.addProgramForm) {
                $scope.forms.addProgramForm.$setUntouched();
            }
            controller.initWatches();
            angular.extend(controller, programFormControllerAs);
        };

        controller.init();

    };

    angular
        .module('qsHub')
        .controller('InstitutionsTuProgramsFormController', [
            '$scope',
            '$controller',
            'InstitutionFactory',
            'TuProfileDepartmentsService',
            'InstitutionsService',
            'WatchService',
            App.controllers.InstitutionsTuProgramsForm
        ]);

}(window.angular));