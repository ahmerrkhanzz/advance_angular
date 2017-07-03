/* global google */
(function(angular) {
    "use strict";
    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.sharedProfileCampusForm = function (
        $scope,
        CampusesService,
        SharedProfileService,
        NotifierFactory,
        InstitutionFactory,
        SharedProfileFactory,
        WatchService
    ) {
        var controller = this,
            notificationTitle = 'Campus';

        controller.submitted = false;
        $scope.forms = {};
        $scope.refreshMapInProgress = false;

        // watch for core ID changes
        var coreId = InstitutionFactory.getCoreId();

        // watch for active campus changes
        $scope.campus = SharedProfileFactory.getCampus();

        controller.isValidName = function () {
            return !!(
                $scope.forms.campusForm &&
                (
                    $scope.forms.campusForm.$pristine ||
                    ($scope.forms.campusForm.name && $scope.forms.campusForm.name.$pristine)
                ) ||
                ($scope.campus && $scope.campus.name && $scope.campus.name.trim().length));
        };

        controller.isValidCountry = function () {
            return !!(
                $scope.forms.campusForm &&
                ($scope.forms.campusForm.$pristine ||
                ($scope.forms.campusForm.country && $scope.forms.campusForm.country.$pristine)) ||
                ($scope.campus && $scope.campus.country && $scope.campus.country.trim().length)
            );
        };

        controller.isValidAddress = function () {
            return !!(
                $scope.forms.campusForm &&
                ($scope.forms.campusForm.$pristine ||
                ($scope.forms.campusForm.addressLine1 && $scope.forms.campusForm.addressLine1.$pristine)) ||
                ($scope.campus && $scope.campus.addressLine1 && $scope.campus.addressLine1.trim().length)
            );
        };

        controller.isValidCity = function () {
            return !!(
                $scope.forms.campusForm &&
                ($scope.forms.campusForm.$pristine ||
                ($scope.forms.campusForm.city && $scope.forms.campusForm.city.$pristine)) ||
                ($scope.campus && $scope.campus.city && $scope.campus.city.trim().length)
            );
        };

        controller.setValid = function (fieldName) {
            controller.submitted = null;
            if (fieldName) {
                if ($scope.forms.campusForm && $scope.forms.campusForm[fieldName]) {
                    $scope.forms.campusForm[fieldName].$setPristine();
                }
            } else {
                $scope.forms.campusForm.$setPristine();
            }
        };

        controller.isValid = function () {
            return controller.isValidName() &&
                controller.isValidCountry() &&
                controller.isValidAddress() &&
                controller.isValidCity();
        };

        /**
         * Toggle edit mode.
         *
         * @param edit
         */
        controller.editToggle = function (edit) {
            $scope.displayDelete = edit;
            $scope.editMode = edit;
        };

        controller.editToggle(SharedProfileFactory.isCampusEditForm());

        // get countries list
        CampusesService.getCountries().then(function (list) {
            $scope.countriesList = list;
        });

        // get TU regions list
        CampusesService.getTuRegions().then(function (list) {
            $scope.tuRegionsList = list;
        });

        /**
         * Actions to do when cancel button is clicked.
         */
        $scope.handleCancelClick = function () {
            SharedProfileFactory.setCampusFormVisibility();
        };

        /**
         * Actions to do when delete button is clicked.
         */
        $scope.handleDeleteClick = function () {
            CampusesService.deleteCampus($scope.institutionId, $scope.campus.id).then(controller.deleteCallback, controller.isValidName());
        };

        controller.deleteCallback = function (success) {
            $scope.campusSubmitInProgress = false;
            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'Deleted successfully!' : 'Deletion failed!',
                notificationTitle
            );
            if (success) {
                SharedProfileFactory.setCampus({});
                SharedProfileFactory.setCampusFormVisibility(false);
                SharedProfileFactory.announceCampusesChanges(true);
            }
        };

        /**
         * Actiosn to do when save button is clicked.
         *
         * @returns {boolean}
         */
        $scope.handleCreateClick = function () {
            controller.submitted = true;
            $scope.forms.campusForm.$setDirty();
            $scope.forms.campusForm.name.$setDirty();
            $scope.forms.campusForm.country.$setDirty();
            $scope.forms.campusForm.addressLine1.$setDirty();
            $scope.forms.campusForm.city.$setDirty();

            if (
                $scope.campusSubmitInProgress ||
                !$scope.forms.campusForm ||
                !controller.isValid()
            ) {
                return false;
            }
            $scope.campusSubmitInProgress = true;
            CampusesService.create($scope.institutionId, $scope.campus).then(controller.createCallback);
        };

        controller.createCallback = function (response) {
            $scope.campusSubmitInProgress = false;
            NotifierFactory.show(
                response ? 'success' : 'error',
                response ? 'Saved successfully!' : 'Saving failed!',
                notificationTitle
            );

            if (response) {
                $scope.campus.id = response.insertedId;
                if (angular.isDefined(response.coordinates)) {
                    $scope.campus.latitude = response.coordinates.latitude;
                    $scope.campus.longitude = response.coordinates.longitude;
                    SharedProfileFactory.setMapUpdateRequest(Math.random());
                }
                SharedProfileFactory.setCampus($scope.campus);
                SharedProfileFactory.setCampusAddFormVisibility(false);
                SharedProfileFactory.setCampusEditFormVisibility(true);
                SharedProfileFactory.announceCampusesChanges($scope.campus.id);

                // Add new campus to factory
                var currentCampuses = InstitutionFactory.getCampuses();
                currentCampuses.push($scope.campus);
                InstitutionFactory.setCampuses(currentCampuses);
            }
        };

        /**
         * Reset campus form
         */
        controller.resetCampusForm = function () {
            if ($scope.forms.campusForm) {
                $scope.forms.campusForm.$setPristine();
            }
        };

        /**
         * Actions to do when update button is clicked.
         *
         * @returns {boolean}
         */
        $scope.handleUpdateClick = function () {
            controller.submitted = true;
            $scope.forms.campusForm.$setDirty();
            $scope.forms.campusForm.name.$setDirty();
            $scope.forms.campusForm.country.$setDirty();
            $scope.forms.campusForm.addressLine1.$setDirty();
            $scope.forms.campusForm.city.$setDirty();

            if (
                $scope.campusSubmitInProgress ||
                !$scope.forms.campusForm ||
                !$scope.forms.campusForm.$valid
            ) {
                return false;
            }
            $scope.campusSubmitInProgress = true;
            CampusesService.update($scope.institutionId, $scope.campus).then(controller.updateCallback);
            controller.resetCampusForm();
        };

        controller.updateCallback = function (response) {
            $scope.campusSubmitInProgress = false;
            NotifierFactory.show(
                response ? 'success' : 'error',
                response ? 'Updated successfully!' : 'Updated failed!',
                notificationTitle
            );
            if (response) {
                if (angular.isDefined(response.coordinates)) {
                    $scope.campus.latitude = response.coordinates.latitude;
                    $scope.campus.longitude = response.coordinates.longitude;
                    SharedProfileFactory.setMapUpdateRequest(Math.random());
                }
                SharedProfileFactory.announceCampusesChanges($scope.campus.id);
                var currentCampuses = InstitutionFactory.getCampuses(),
                    i = 0,
                    total = currentCampuses.length;
                for (i; i < total; i++) {
                    if (currentCampuses[i].id === $scope.campus.id) {
                        currentCampuses[i] = angular.copy($scope.campus);
                        InstitutionFactory.setCampuses(currentCampuses);
                        break;
                    }
                }
            }
        };

        /**
         * Displays a message based on success
         *
         * @param {boolean} success
         * @param {string} message
         */
        controller.coordinatesUpdated = function (success, message) {
            NotifierFactory.show(
                success,
                message,
                'Address Search'
            );
        };

        /**
         * Get coordinates callback
         *
         * @param response
         */
        controller.getCoordinatesByCampusCallback = function (response) {
            var success = false;
            if (response) {
                if (angular.isArray(response) && !angular.isObject(response[0]) && !angular.isObject(response[1])) {
                    success = true;
                    $scope.campus.latitude = response[0];
                    $scope.campus.longitude = response[1];
                    SharedProfileFactory.setMapUpdateRequest(Math.random());
                    SharedProfileFactory.announceCampusesChanges($scope.campus.id);
                    controller.coordinatesUpdated('success', 'Coordinates updated successfully!');
                } else {
                    controller.coordinatesUpdated('warning', 'Address not found!');
                }
            } else {
                controller.coordinatesUpdated('error', 'Error requesting coordinates!');
            }
            $scope.refreshMapInProgress = false;
        };

        /**
         * Refresh map function
         */
        controller.refreshMap = function () {
            $scope.refreshMapInProgress = true;
            if ($scope.campus.autoGenerate) { // generate map by address fields
                CampusesService.getCoordinatesByCampus($scope.campus).then(controller.getCoordinatesByCampusCallback);
            } else {  // generate map by coordinates
                // announce map reload request
                SharedProfileFactory.setMapUpdateRequest(Math.random());
                //SharedProfileFactory.announceCampusesChanges($scope.campus.id);
                $scope.refreshMapInProgress = false;
            }
        };

        /**
         * Display on front end switch clicked.
         */
        controller.displayOnFrontEndClick = function () {
            if ($scope.campus.displayInFrontEnd &&
                (($scope.campus.longitude === null || !$scope.campus.longitude) ||
                ($scope.campus.latitude === null || !$scope.campus.latitude))
            ) {
                $scope.campus.autoGenerate = true;
            }
        };

        controller.initWatches = function () {
            // watch for edit mode changes
            WatchService.create($scope, SharedProfileFactory.isCampusEditForm, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    controller.editToggle(newValue);
                }
            });

            WatchService.create($scope, SharedProfileFactory.getCampus, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.campus = newValue;
                    controller.resetCampusForm();
                }
            });

            WatchService.create($scope, InstitutionFactory.getCoreId, function (newValue) {
                $scope.institutionId = InstitutionFactory.getId();
            });
        };

        /**
         * Class constructor.
         */
        controller.init = function () {
            controller.initWatches();
        };

        controller.init();
    };

    angular
        .module('qsHub')
        .controller('SharedProfileCampusFormController', [
            '$scope',
            'CampusesService',
            'SharedProfileService',
            'NotifierFactory',
            'InstitutionFactory',
            'SharedProfileFactory',
            'WatchService',
            App.controllers.sharedProfileCampusForm
        ]);
}(window.angular));
