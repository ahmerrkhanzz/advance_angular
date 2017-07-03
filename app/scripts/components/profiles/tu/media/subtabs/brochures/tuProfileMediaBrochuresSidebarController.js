(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.TuMediaBrochuresSidebar = function (
        $scope,
        $resource,
        $location,
        $timeout,
        constants,
        NotifierFactory,
        TuProfileFactory,
        TuMediaBrochuresService,
        TuMediaService,
        WatchService,
        UrlService,
        ObjectService
    ) {
        var controller = this,
            alreadyInitialised = false;
        $scope.hasErrors = true;
        TuMediaBrochuresService.displayTypesValid = false;
        TuMediaBrochuresService.setHasErrors(false);

        controller.onKeyUp = function ($event) {
            if ($event.keyCode === 13) {
                return;
            }
            var url = $event.target.value,
                variableName = $event.target.getAttribute('ng-model');

            if (url && url.length > 5 && (url.indexOf('http') !== 0 || url.indexOf('http') === -1)) {
                url = UrlService.prependHttp(url);
                if (variableName) {
                    ObjectService.set($scope, variableName, url);
                }
            }
        };

        controller.urlPattern = UrlService.getPattern();

        /**
         * Save form.
         *
         * @param item
         * @returns {boolean}
         */
        $scope.saveBrochureForm = function (item) {
            var brochureItem = angular.copy(item);
            TuMediaBrochuresService.displayTypesValid = false;
            TuMediaBrochuresService.setHasErrors(false);
            $scope.isInvalidTitle = false;
            $scope.isInvalidUrl = false;
            var actionName = 'Added';
            if (brochureItem.id.length > 0) {
                actionName = 'Updated';
            }
            if (!TuMediaService.isValidType(item)) {
                TuMediaBrochuresService.displayTypesValid = true;
            }
            if (!angular.isDefined(item.name) || !(angular.isDefined(item.name) && item.name.length > 0)) {
                $scope.isInvalidTitle = true;
            }
            if (!angular.isDefined(item.url) || !(angular.isDefined(item.url) && item.url.length > 0)) {
                $scope.isInvalidUrl = true;
            }
            if ($scope.isInvalidTitle || $scope.isInvalidUrl || TuMediaBrochuresService.displayTypesValid) {
                $scope.setHasErrors(true);
                return false;
            }
            if (!(item.url.match(controller.urlPattern))) {
                $scope.isInvalidUrl = true;
                $scope.setHasErrors(true);
                return false;
            }
            if ($scope.submitInProgress || !$scope.forms.formBrochure || !$scope.forms.formBrochure.$valid
            ) {
                NotifierFactory.show(
                    'error',
                    'Error: Please fill in all required fields',
                    actionName + ' Brochure'
                );

                return false;
            }
            $scope.submitInProgress = true;
            TuMediaBrochuresService.saveBrochure(TuMediaBrochuresService.coreId, brochureItem)
                .then(function (success) {
                    $scope.submitInProgress = false;
                    NotifierFactory.show(
                        success ? 'success' : 'error',
                        success ? 'Successfully!' : 'Failure!',
                        'Brochure ' + actionName
                    );
                    if (success) {
                        if (brochureItem.id.length === 0) {
                            item.id = success;
                            TuMediaBrochuresService.getBrochureItems().unshift(item);
                            TuMediaBrochuresService.setSelectedBrochure(item);
                            $scope.selectedBrochure = angular.copy(TuMediaBrochuresService.getSelectedBrochure());
                        }

                        TuMediaBrochuresService.setSelectedBrochure(item);
                        TuMediaBrochuresService.setHasErrors(false);
                        $scope.selectedBrochureBeforeChanges = item;
                    }
                    /**
                     * Tell other controllers to apply filter on changes
                     */
                    TuMediaBrochuresService.setTriggerChange(Math.random());
                });
        };

        /**
         * Clear item.
         *
         * @param item
         */
        $scope.clearBrochureForm = function (item) {
            if (angular.isDefined(item)) {
                $scope.itemBrochure = item;
            } else {
                $scope.itemBrochure = TuMediaBrochuresService.getItemBrochure();
            }

            $scope.itemBrochure = TuMediaBrochuresService.resetItem($scope.itemBrochure);
            $scope.setDisplayTypesValidation(false);
            delete $scope.isInvalidTitle;
            delete $scope.isInvalidUrl;
        };

        /**
         * Get selected item.
         *
         * @returns {*}
         */
        $scope.getSelectedBrochure = function () {
            return TuMediaBrochuresService.getSelectedBrochure();
        };

        /**
         * Get brochure items.
         *
         * @returns {*}
         */
        $scope.getBrochureItems = function () {
            return TuMediaBrochuresService.getBrochureItems();
        };

        /**
         * Get has errors flag.
         *
         * @returns {boolean|*}
         */
        $scope.getHasErrors = function () {
            return TuMediaBrochuresService.getHasErrors();
        };

        $scope.setHasErrors = function (value) {
            TuMediaBrochuresService.setHasErrors(value);
        };

        $scope.setIsInvalidTitle = function (value) {
            $scope.isInvalidTitle = value;
        };

        $scope.setIsInvalidUrl = function (value) {
            $scope.isInvalidUrl = value;
        };

        $scope.type = function () {
            return TuMediaBrochuresService.getType();
        };

        $scope.setDisplayTypesValidation = function (value) {
            TuMediaBrochuresService.displayTypesValid = value;
        };

        $scope.getDisplayTypesValidation = function () {
            return TuMediaBrochuresService.displayTypesValid;
        };

        /**
         * Is edit mode?
         *
         * @returns {boolean}
         */
        $scope.isEditMode = function () {
            return $scope.selectedBrochure && $scope.selectedBrochure.id ? true : false;
        };

        controller.initWatches = function () {
            WatchService.create($scope, TuMediaBrochuresService.getSelectedBrochure, function (selectedBrochure) {
                $scope.isInvalidUrl = false;
                $scope.isInvalidTitle = false;
                $scope.selectedBrochureBeforeChanges = angular.copy(selectedBrochure);
                $scope.selectedBrochure = selectedBrochure;
            });

            WatchService.create($scope, TuMediaBrochuresService.getHasErrors, function (newValue, oldValue) {
                if (!angular.equals(oldValue, newValue)) {
                    $scope.hasErrors = newValue;
                }
            });

            WatchService.create($scope, TuMediaBrochuresService.getTriggerReset, function (newValue, oldValue) {
                if (!angular.equals(oldValue, newValue)) {
                    $scope.selectedBrochure = angular.copy($scope.selectedBrochureBeforeChanges);
                }
            });

            WatchService.create($scope, TuMediaBrochuresService.getHighlighted, function (newValue) {
                if (newValue) {
                    $scope.isHighlighted = newValue;
                    $timeout(function () {
                        TuMediaBrochuresService.setHighlighted(false);
                        $scope.isHighlighted = false;
                    }, 200);
                }
            });

            WatchService.create($scope, TuProfileFactory.getSelectedMediaTabId, function (tabId) {
                if (tabId === 4) {
                    // restore data on tab type switch
                    if (typeof $scope.selectedBrochureBeforeChanges !== 'undefined') {
                        $scope.selectedBrochure = angular.copy($scope.selectedBrochureBeforeChanges);
                    }
                    $timeout(function () {
                        TuMediaBrochuresService.setHighlighted(true);
                    }, 200);
                } else {
                    delete $scope.isInvalidTitle;
                    delete $scope.isInvalidUrl;
                    delete TuMediaBrochuresService.displayTypesValid;
                }
            });
        };

        controller.init = function () {
            controller.initWatches();
        };

        // listen to departments tab visibility changes
        WatchService.create($scope, TuProfileFactory.isMediaTabSelected, function (isActive, wasActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TuMediaBrochuresSidebarController', [
            '$scope',
            '$resource',
            '$location',
            '$timeout',
            'constants',
            'NotifierFactory',
            'TuProfileFactory',
            'TuMediaBrochuresService',
            'TuMediaService',
            'WatchService',
            'UrlService',
            'ObjectService',
            App.controllers.TuMediaBrochuresSidebar
        ]);

} (window.angular));