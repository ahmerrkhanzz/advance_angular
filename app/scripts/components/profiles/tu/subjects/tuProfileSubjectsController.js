(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.tuProfileSubjects = function (
        $scope,
        $rootScope,
        $state,
        constants,
        TuProfileSubjectsService,
        TuProfileFactory,
        NotifierFactory,
        WatchService,
        InstitutionFactory,
        UserFactory
    ) {
        var controller = this,
            alreadyInitialised = false;

        controller.devMode = constants.dev;
        $scope.forms = {};
        $scope.subjectsTabSubmitInProgress = false;
        $scope.isDatagridReloading = true;

        /**
         * Store profile subjects data.
         *
         * @returns {boolean}
         */
        $scope.handleSubjectTabSubmit = function () {
            if (
                $scope.subjectsTabSubmitInProgress ||
                !$scope.forms.subjectsForm ||
                !$scope.forms.subjectsForm.$valid
            ) {
                return false;
            }
            $scope.subjectsTabSubmitInProgress = true;
            TuProfileSubjectsService.saveSubjectsTab($scope.tuProfile).then(function (success) {
                $scope.subjectsTabSubmitInProgress = false;
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Saved successfully!' : 'Saving failed!',
                    'Selected Subjects'
                );
                $scope.tuProfileBeforeChanges = angular.copy(TuProfileFactory.getData());
            });
        };


        controller.reformatTuProfileSubjects = function () {
            if (angular.isDefined($state) && InstitutionFactory.isTuSubscribed() && !UserFactory.noAccess($state.current.name)) {
                $scope.isDatagridReloading = true;
                var data = TuProfileFactory.getData();
                if (data.ugSubjects) {
                    data.ugSubjects = TuProfileSubjectsService.formatSubjects(data.ugSubjects);
                }
                if (data.pgSubjects) {
                    data.pgSubjects = TuProfileSubjectsService.formatSubjects(data.pgSubjects);
                }
                $scope.isDatagridReloading = false;
                controller.resetTuProfileSubjects();
            } else {
                // if user doesn't have access, empty previously loaded data
                $scope.tuProfile = {};
                controller.subjects = {};
            }
        };

        controller.resetTuProfileSubjects = function () {
            var data = angular.copy($scope.tuProfileBeforeChanges);
            if (data.hasPhdSubjects) {
                $scope.tuProfile.hasPhdSubjects = data.hasPhdSubjects;
            }
            if (data.ugSubjects) {
                $scope.tuProfile.ugSubjects = angular.copy(TuProfileSubjectsService.formatSubjects(data.ugSubjects));
            }
            if (data.pgSubjects) {
                $scope.tuProfile.pgSubjects = angular.copy(TuProfileSubjectsService.formatSubjects(data.pgSubjects));
            }
        };

        controller.initData = function () {
            // get subjects list
            TuProfileSubjectsService.getSubjects().then(function(subjects) {
                // split subjects into chunks of 3
                controller.subjects = TuProfileSubjectsService.splitObject(subjects, 1);
                // share available subjects
                TuProfileFactory.setAvailableSubjects(subjects);
                // reformat TU profile subjects
                controller.reformatTuProfileSubjects();
            });
        };

        controller.initEvents = function () {
            $scope.$on(constants.events.institutionTuProfileChanges, function() {
                alreadyInitialised = false;
                if (TuProfileFactory.isSubjectsTabSelected()) {
                    controller.reformatTuProfileSubjects();
                    alreadyInitialised = true;
                }
            });
        };

        controller.destruct = function () {
            alreadyInitialised = false;
        };

        controller.init = function () {
            controller.initData();
            controller.initEvents();
            $rootScope.$on(constants.events.logout, controller.destruct);
        };

        // listen to subjects tab visibility changes
        WatchService.create($scope, TuProfileFactory.isSubjectsTabSelected, function (isActive, wasActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
            if (isActive && alreadyInitialised) {
                controller.resetTuProfileSubjects();
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TuProfileSubjectsController', [
            '$scope',
            '$rootScope',
            '$state',
            'constants',
            'TuProfileSubjectsService',
            'TuProfileFactory',
            'NotifierFactory',
            'WatchService',
            'InstitutionFactory',
            'UserFactory',
            App.controllers.tuProfileSubjects
        ]);

}(window.angular));
