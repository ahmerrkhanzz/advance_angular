(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.TmMediaBrochuresSidebar = function (
        $scope,
        $resource,
        $location,
        $timeout,
        constants,
        NotifierFactory,
        TmProfileFactory,
        TmMediaBrochuresService,
        TmMediaService,
        WatchService,
        UrlService,
        ObjectService
    ) {
        var controller = this,
            alreadyInitialised = false;
        $scope.hasErrors = true;
        TmMediaBrochuresService.displayTypesValid = false;
        TmMediaBrochuresService.setHasErrors(false);

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
         * Save brochure form.
         *
         * @param item
         * @returns {boolean}
         */
        $scope.saveBrochureForm = function (item) {
            var brochureItem = angular.copy(item);
            TmMediaBrochuresService.displayTypesValid = false;
            TmMediaBrochuresService.setHasErrors(false);
            $scope.isInvalidTitle = false;
            $scope.isInvalidUrl = false;
            var actionName = 'Added';
            if (brochureItem.id.length > 0) {
                actionName = 'Updated';
            }
            if (!TmMediaService.isValidType(item)) {
                TmMediaBrochuresService.displayTypesValid = true;
            }
            if (!angular.isDefined(item.name) || !(angular.isDefined(item.name) && item.name.length > 0)) {
                $scope.isInvalidTitle = true;
            }
            if (!angular.isDefined(item.url) || !(angular.isDefined(item.url) && item.url.length > 0)) {
                $scope.isInvalidUrl = true;
            }
            if ($scope.isInvalidTitle || $scope.isInvalidUrl || TmMediaBrochuresService.displayTypesValid) {
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
            TmMediaBrochuresService.saveBrochure(TmMediaBrochuresService.coreId, brochureItem)
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
                            TmMediaBrochuresService.getBrochureItems().unshift(item);
                            TmMediaBrochuresService.setSelectedBrochure(item);
                            $scope.selectedBrochure = angular.copy(TmMediaBrochuresService.getSelectedBrochure());
                        }

                        TmMediaBrochuresService.setSelectedBrochure(item);
                        TmMediaBrochuresService.setHasErrors(false);
                        $scope.selectedBrochureBeforeChanges = item;
                    }
                    /**
                     * Tell other controllers to apply filter on changes
                     */
                    TmMediaBrochuresService.setTriggerChange(Math.random());
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
                $scope.itemBrochure = TmMediaBrochuresService.getItemBrochure();
            }

            $scope.itemBrochure = TmMediaBrochuresService.resetItem($scope.itemBrochure);
            TmMediaBrochuresService.setSelectedBrochure($scope.itemBrochure);
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
            return TmMediaBrochuresService.getSelectedBrochure();
        };

        /**
         * Get brochure items.
         *
         * @returns {*}
         */
        $scope.getBrochureItems = function () {
            return TmMediaBrochuresService.getBrochureItems();
        };

        /**
         * Get has errors flag.
         *
         * @returns {boolean|*}
         */
        $scope.getHasErrors = function () {
            return TmMediaBrochuresService.getHasErrors();
        };

        $scope.setHasErrors = function (value) {
            TmMediaBrochuresService.setHasErrors(value);
        };

        $scope.setIsInvalidTitle = function (value) {
            $scope.isInvalidTitle = value;
        };

        $scope.setIsInvalidUrl = function (value) {
            $scope.isInvalidUrl = value;
        };

        $scope.type = function () {
            return TmMediaBrochuresService.getType();
        };

        $scope.setDisplayTypesValidation = function (value) {
            TmMediaBrochuresService.displayTypesValid = value;
        };

        $scope.getDisplayTypesValidation = function () {
            return TmMediaBrochuresService.displayTypesValid;
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
            WatchService.create($scope, TmMediaBrochuresService.getSelectedBrochure, function (selectedBrochure) {
                $scope.isInvalidUrl = false;
                $scope.isInvalidTitle = false;
                $scope.selectedBrochureBeforeChanges = angular.copy(selectedBrochure);
                $scope.selectedBrochure = selectedBrochure;
            });

            WatchService.create($scope, TmMediaBrochuresService.getHasErrors, function (newValue, oldValue) {
                if (!angular.equals(oldValue, newValue)) {
                    $scope.hasErrors = newValue;
                }
            });

            WatchService.create($scope, TmMediaBrochuresService.getTriggerReset, function (newValue, oldValue) {
                if (!angular.equals(oldValue, newValue)) {
                    $scope.selectedBrochure = angular.copy($scope.selectedBrochureBeforeChanges);
                }
            });

            WatchService.create($scope, TmMediaBrochuresService.getHighlighted, function (newValue) {
                if (newValue) {
                    $scope.isHighlighted = newValue;
                    $timeout(function () {
                        TmMediaBrochuresService.setHighlighted(false);
                        $scope.isHighlighted = false;
                    }, 200);
                }
            });

            WatchService.create($scope, TmProfileFactory.getSelectedMediaSubTabId, function (tabId) {
                if (tabId === 4) {
                    $timeout(function () {
                        TmMediaBrochuresService.setHighlighted(true);
                    }, 200);
                } else {
                    delete $scope.isInvalidTitle;
                    delete $scope.isInvalidUrl;
                    delete TmMediaBrochuresService.displayTypesValid;
                }
            });

        };

        controller.init = function () {
            controller.initWatches();
        };

        // listen to departments tab visibility changes
        WatchService.create($scope, TmProfileFactory.isMediaTabSelected, function (isActive, wasActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TmMediaBrochuresSidebarController', [
            '$scope',
            '$resource',
            '$location',
            '$timeout',
            'constants',
            'NotifierFactory',
            'TmProfileFactory',
            'TmMediaBrochuresService',
            'TmMediaService',
            'WatchService',
            'UrlService',
            'ObjectService',
            App.controllers.TmMediaBrochuresSidebar
        ]);

} (window.angular));