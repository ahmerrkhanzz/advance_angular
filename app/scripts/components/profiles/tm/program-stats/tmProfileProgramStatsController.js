(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.tmProfileProgramStats = function (
        $scope,
        constants,
        NotifierFactory,
        TmProfileFactory,
        InstitutionFactory,
        UserFactory,
        TmProfileService,
        TmProfileProgramStatsService,
        TmProfileProgramValidationService,
        WatchService,
        UiSelectService
    ) {
        var controller = this,
            alreadyInitialised = false;

        controller.devMode = constants.dev;
        controller.feesRangesList = TmProfileService.getFeesRangesList();
        controller.monthsList = TmProfileService.getMonthsList();
        controller.accreditationsList = TmProfileService.getAccreditationsList();
        controller.lengthList = TmProfileService.getLengthList();
        controller.isSchoolUser = UserFactory.isClient();
        controller.forms = {};
        controller.editInProgress = false;
        controller.percentList = TmProfileService.getPercentList();
        controller.yearList1850 = TmProfileService.getYearList(18, 50);
        controller.yearList020 = TmProfileService.getYearList(0, 20);
        controller.offerScholarshipsList = UiSelectService.getYesNoOptions();

        $scope.stats = {};
        $scope.specialisations = [];
        $scope.program = {};

        controller.getEditButtonTitle = function () {
            return UserFactory.isClient() ? 'Request Edit Advanced Program' : 'Update';
        };

        controller.handleUpdateClick = function () {
            controller.forms.addProgramStatsForm.$setDirty();
            controller.forms.addProgramStatsForm.avgGmat.$setDirty();
            controller.forms.addProgramStatsForm.classSize.$setDirty();
            controller.forms.addProgramStatsForm.avgSalaryAfterGraduation.$setDirty();

            // validate program data
            if (controller.editInProgress ||
                !controller.forms.addProgramStatsForm ||
                !controller.isValid()
            ) {
                return false;
            }

            controller.editInProgress = true;
            controller.programStatisticObject = {
                'stats': $scope.stats,
                'specialisations': $scope.specialisations
            };
            TmProfileProgramStatsService.update($scope.programId, controller.programStatisticObject).then(controller.updateCallback);
        };

        controller.isValid = function () {
            return controller.isValidAverageGmat() &&
                controller.isValidClassSize() &&
                controller.isValidAverageSalaryAfterGraduation();
        };

        controller.setValid = function (fieldName, stats) {
            if (controller.forms.addProgramStatsForm) {
                if (fieldName) {
                    if (stats) {
                        controller.forms.addProgramStatsForm[fieldName].$setPristine();
                    }
                } else {
                    controller.forms.addProgramStatsForm.$setPristine();
                }
            }
        };

        controller.updateCallback = function (response) {
            NotifierFactory.show(
                response ? 'success' : 'error',
                response ? 'Updated successfully!' : 'Update failed!',
                'Edit Program'
            );
            controller.editInProgress = false;
        };

        controller.isValidAverageGmat = function () {
            return TmProfileProgramValidationService.isValidAverageGmat(
                controller.forms.addProgramStatsForm,
                $scope.program
            );
        };

        controller.isValidClassSize = function () {
            return TmProfileProgramValidationService.isValidClassSize(
                controller.forms.addProgramStatsForm,
                $scope.program
            );
        };

        controller.isValidAverageSalaryAfterGraduation = function () {
            return TmProfileProgramValidationService.isValidAverageSalaryAfterGraduation(
                controller.forms.addProgramStatsForm,
                $scope.program
            );
        };

        controller.getCoreIdWatch = function (coreId) {
            if (!coreId) {
                return false;
            }
            TmProfileProgramStatsService.getStats(coreId).then(function (data) {
                $scope.program = data;
                $scope.stats = data.stats;
                if (data.hasOwnProperty('specialisations') &&
                    angular.isArray(data.specialisations) &&
                    data.specialisations.length > 0
                ) {
                    $scope.specialisations = data.specialisations;
                }
                $scope.programId = data.id;
                angular.forEach(TmProfileService.getProgramStatusList(), function (item) {
                    if (item.value === data.status) {
                        data.status = item.label;
                    }
                });
            });
        };

        controller.initWatches = function () {
            WatchService.create($scope, InstitutionFactory.getCoreId, controller.getCoreIdWatch);
        };

        controller.init = function () {
            controller.initWatches();

            // load specialisations list
            TmProfileService.getSpecialisationsList().then(function (list) {
                controller.specialisationsList = list;
            });
        };

        // listen to programs statistics tab visibility changes
        WatchService.create($scope, TmProfileFactory.isStatsTabSelected, function (isActive, wasActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TmProfileProgramStatsController', [
            '$scope',
            'constants',
            'NotifierFactory',
            'TmProfileFactory',
            'InstitutionFactory',
            'UserFactory',
            'TmProfileService',
            'TmProfileProgramStatsService',
            'TmProfileProgramValidationService',
            'WatchService',
            'UiSelectService',
            App.controllers.tmProfileProgramStats
        ]);

} (window.angular));
