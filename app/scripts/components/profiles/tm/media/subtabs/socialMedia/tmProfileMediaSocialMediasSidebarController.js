(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.TmMediaSocialMediasSidebar = function(
        $scope,
        $resource,
        $location,
        $timeout,
        constants,
        NotifierFactory,
        TmProfileFactory,
        TmMediaSocialMediasService,
        WatchService,
        UrlService
    ) {
        var controller = this,
            alreadyInitialised = false;
        $scope.hasErrors = false;
        // $scope.invalidCheckboxes = [];
        $scope.invalidFields = [];
        TmMediaSocialMediasService.displayTypesValid = false;

        controller.onKeyUp = function ($event, type, index) {
            if ($event.keyCode === 13) {
                return;
            }
            var url = $event.target.value;
            if (url && url.length > 5 && (url.indexOf('http') !== 0 || url.indexOf('http') === -1)) {
                url = UrlService.prependHttp(url);
                $scope.selectedSocialMedia[type][index].url = url;
            }
        };

        /**
         * Reset Invalid Url
         *
         * @params {Integer} index
         */
        $scope.resetInvalidField = function(index) {
            $scope.invalidFields[index] = false;
        };

        /**
         * Reset Invalid Checkboxes
         *
         * @params {Integer} index
         */
        $scope.resetInvalidCheckbox = function(index) {
            if ($scope.invalidCheckboxes[index]) {
                $scope.invalidCheckboxes[index] = false;
            }
        };


        controller.urlPattern = UrlService.getPattern();

        /**
         * Save form.
         *
         * @returns {boolean}
         */
        $scope.saveSocialMediaForm = function() {
            $scope.invalidFields = [];
            var invalidItems = [];
            var socialMediaItem = TmMediaSocialMediasService.formatSocialMedia(
                angular.copy($scope.selectedSocialMedia[$scope.type()])
            );
            if (angular.isArray(socialMediaItem) && socialMediaItem.length > 0) {
                invalidItems = TmMediaSocialMediasService.socialMediaValidation(angular.copy($scope.selectedSocialMedia[$scope.type()]));
                if (typeof invalidItems === 'undefined') {
                    invalidItems = TmMediaSocialMediasService.socialMediaFormValidation($scope.forms.formSocialMedia);
                }
            }
            TmMediaSocialMediasService.displayTypesValid = false;
            TmMediaSocialMediasService.setHasErrors(false);

            if ($scope.submitInProgress || !$scope.forms.formSocialMedia || !$scope.forms.formSocialMedia.$valid || (invalidItems && invalidItems.length > 0)) {
                // $scope.invalidCheckboxes = [];
                $scope.hasErrors = true;
                angular.forEach(invalidItems, function(item) {
                    if (item.invalid) {
                        $scope.invalidCheckboxes[item.index] = item.invalid || false;
                    } else if (item.invalidUrl) {
                        $scope.invalidFields[item.index] = item.invalidUrl || false;
                    }
                });
                return false;
            }

            $scope.hasErrors = false;
            $scope.invalidFields = [];
            // $scope.invalidCheckboxes = [];
            $scope.submitInProgress = true;
            var actionName = $scope.isEditMode($scope.type()) ? 'Updated' : 'Added';
            TmMediaSocialMediasService.saveSocialMedia(TmMediaSocialMediasService.coreId, socialMediaItem)
                .then(function(success) {
                    $scope.submitInProgress = false;
                    NotifierFactory.show(
                        success ? 'success' : 'error',
                        success ? 'Successfully!' : 'Failure!',
                        'Social Media ' + actionName + ' (' + $scope.type() + ')'
                    );
                    if (success) {
                        $scope.selectedSocialMediaBeforeChanges = angular.copy($scope.selectedSocialMedia);
                        TmMediaSocialMediasService.setChanges(socialMediaItem);
                    }
                });
        };

        /**
         * Clear social media item.
         */
        $scope.clearSocialMediaForm = function() {
            $scope.selectedSocialMedia[$scope.type()][0].master = true;
            $scope.selectedSocialMedia[$scope.type()][0].url = '';
            $scope.invalidFields = [];
        };

        /**
         * Get selected item.
         *
         * @returns {*}
         */
        $scope.getSelectedSocialMedia = function() {
            return TmMediaSocialMediasService.getSelectedSocialMedia();
        };

        /**
         * Get socialMedia items.
         *
         * @returns {*}
         */
        $scope.getSocialMediaItems = function() {
            return TmMediaSocialMediasService.getSocialMediaItems();
        };

        /**
         * Get has errors flag.
         *
         * @returns {boolean}
         */
        $scope.getHasErrors = function() {
            return TmMediaSocialMediasService.getHasErrors();
        };

        $scope.setHasErrors = function(value) {
            TmMediaSocialMediasService.setHasErrors(value);
        };

        $scope.type = function() {
            return TmMediaSocialMediasService.getType();
        };

        $scope.setDisplayTypesValidation = function(value) {
            TmMediaSocialMediasService.displayTypesValid = value;
        };

        $scope.getDisplayTypesValidation = function() {
            return TmMediaSocialMediasService.displayTypesValid;
        };

        /**
         * Is edit mode?
         *
         * @returns {boolean}
         */
        $scope.isEditMode = function(type) {
            return $scope.selectedSocialMedia && $scope.selectedSocialMedia[type] ? true : false;
        };

        controller.initWatches = function() {
            WatchService.create($scope, TmMediaSocialMediasService.getSelectedSocialMedia, function(selectedSocialMedia) {
                if (selectedSocialMedia) {
                    $scope.selectedSocialMediaBeforeChanges = selectedSocialMedia;
                    $scope.selectedSocialMedia = angular.copy(selectedSocialMedia);
                    // $scope.checkCheckboxes();
                }
            });

            WatchService.create($scope, TmMediaSocialMediasService.getTriggerChange, function() {
                if (angular.isDefined($scope.selectedSocialMediaBeforeChanges)) {
                    $scope.selectedSocialMedia = angular.copy($scope.selectedSocialMediaBeforeChanges);
                    // $scope.checkCheckboxes();
                }
                $scope.invalidFields = [];
                // $scope.invalidCheckboxes = [];
            });

            //watch for social media type changes
            WatchService.create($scope, TmMediaSocialMediasService.getType, function(socialMediaType) {
                if (socialMediaType) {
                    controller.selectedSocialMediaUrl = TmMediaSocialMediasService.getSelectedSocialMediaUrl(socialMediaType);
                }
            });

            WatchService.create($scope, TmMediaSocialMediasService.getHighlighted, function(newValue) {
                if (newValue) {
                    $scope.isHighlighted = newValue;
                    $timeout(function() {
                        TmMediaSocialMediasService.setHighlighted(false);
                        $scope.isHighlighted = false;
                    }, 200);
                }
            });

            WatchService.create($scope, TmProfileFactory.getSelectedMediaSubTabId, function(tabId) {
                if (tabId === 3) {
                    $timeout(function() {
                        TmMediaSocialMediasService.setHighlighted(true);
                    }, 200);
                } else {
                    $scope.invalidFields = [];
                    // $scope.invalidCheckboxes = [];
                }
            });
        };

        controller.init = function() {
            controller.initWatches();
        };

        // listen to social media tab visibility changes
        WatchService.create($scope, TmProfileFactory.isMediaTabSelected, function(isActive, wasActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TmMediaSocialMediasSidebar', [
            '$scope',
            '$resource',
            '$location',
            '$timeout',
            'constants',
            'NotifierFactory',
            'TmProfileFactory',
            'TmMediaSocialMediasService',
            'WatchService',
            'UrlService',
            App.controllers.TmMediaSocialMediasSidebar
        ]);

}(window.angular));
