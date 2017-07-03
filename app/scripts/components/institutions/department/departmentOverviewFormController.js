(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.departmentOverviewForm = function (
        $scope,
        $controller,
        TuProfileFactory,
        InstitutionFactory,
        TuProfileDepartmentsService,
        WatchService,
        $stateParams
    ) {
        var TuProfileDepartmentFormController = $controller('TuProfileDepartmentForm', {$scope: $scope});
        var controller = this,
            departmentFormControllerAs = $scope.getTuProfileDepartmentForm();
        
        controller.handleUpgradeClick = departmentFormControllerAs.handleUpgradeClick;
        controller.isUpgradeDisabled = departmentFormControllerAs.isUpgradeDisabled;
        controller.tuSupportEmail = departmentFormControllerAs.tuSupportEmail;
        controller.isLoginRestricted = departmentFormControllerAs.isLoginRestricted;

        $scope.toggleDepartmentEditForm = function () {
            TuProfileFactory.setDepartmentEditFormVisibility();
        };

        /**
         * Actiosn to do on cancel button click in add form
         */
        $scope.toggleDepartmentAddForm = function () {
            TuProfileDepartmentFormController.resetAddForm();
            TuProfileFactory.setDepartmentAddFormVisibility();
        };

        controller.initWatches = function () {
            WatchService.create($scope, InstitutionFactory.getCampusData, function (newValue) {
                if (newValue) {
                    $scope.campusList = TuProfileDepartmentsService.formatCampusList(newValue);
                }
            }, true);

            WatchService.create($scope, InstitutionFactory.getInstitutionIdDepartmentOverview, function (newValue, oldValue) {
                if (newValue !== oldValue && newValue) {
                    $scope.newDepartmentBeforeChanges.parentCoreId = newValue;
                    $scope.newDepartment.parentCoreId = newValue;
                }
            });
            
            WatchService.create($scope, TuProfileFactory.getDepartment, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.department = newValue;
                    $scope.isInvalidDepartmentNameUpdate = false;
                    $scope.isInvalidBelongsToUpdate = false;
                    $scope.isInvalidNewDepartmentName = false;
                    $scope.isInvalidNewBelongsTo = false;
                }
            }, true);

            WatchService.create($scope, function () {
                return TuProfileFactory.isDepartmentAddFormVisible(TuProfileFactory.getProfileTabs().departments);
            }, function () {
                if ($stateParams.coreId && typeof($stateParams.coreId) !== "undefined") {
                    $scope.newDepartmentBeforeChanges.parentCoreId = $stateParams.coreId;
                    $scope.newDepartment.parentCoreId = $stateParams.coreId;
                    $stateParams.coreId = null;
                }
                TuProfileDepartmentFormController.resetAddForm();
            });
        };

        controller.init = function () {
            controller.initWatches();
            $scope.newDepartment.parentCoreId = $stateParams.coreId;
            departmentFormControllerAs.initialiseForm();
            if ($scope.forms && $scope.forms.addDepartmentForm) {
                $scope.forms.addDepartmentForm.$setUntouched();
            }
        };

        controller.init();

    };

    angular
        .module('qsHub')
        .controller('DepartmentOverviewFormController', [
            '$scope',
            '$controller',
            'TuProfileFactory',
            'InstitutionFactory',
            'TuProfileDepartmentsService',
            'WatchService',
            '$stateParams',
            App.controllers.departmentOverviewForm
        ]);

}(window.angular));
