(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.TmMediaImagesSidebar = function(
        $scope,
        $resource,
        $location,
        $timeout,
        constants,
        NotifierFactory,
        TmProfileFactory,
        TmMediaImagesService,
        WatchService
    ) {
        var controller = this,
            alreadyInitialised = false;
        controller.uploadedImagesCount = {};
        $scope.hasErrors = true;
        TmMediaImagesService.displayIsValidType = false;
        TmMediaImagesService.setHasErrors(false);

        /**
         * Save form.
         *
         * @param item
         * @returns {boolean}
         */
        $scope.saveImageForm = function(item) {
            if (!$scope.forms.formImage ||
                !$scope.forms.formImage.$valid ||
                TmMediaImagesService.getSubmitInProgress()
            ) {
                return false;
            }
            var imageItem = angular.copy(item);
            TmMediaImagesService.setHasErrors(false);
            var actionName = 'Added';
            if (imageItem.id !== 'temporary') {
                actionName = 'Updated';
            }
            if (!angular.isDefined(item.url) || !(angular.isDefined(item.url) && item.url.length > 0)) {
                $scope.setHasErrors(true);

                return false;
            }
            if (!$scope.forms.formImage || !$scope.forms.formImage.$valid) {
                NotifierFactory.show(
                    'error',
                    'Error: Please fill in all required fields',
                    actionName + ' Image'
                );

                return false;
            }
            // upload is slow so we will display a notification, can be removed if we implement rabbitmq
            if (imageItem.id === 'temporary') {
                NotifierFactory.show(
                    'success',
                    'Image upload is processing, please wait...',
                    ''
                );
            }

            TmMediaImagesService.setSubmitInProgress(true);
            TmMediaImagesService.saveImage(TmMediaImagesService.coreId, imageItem)
                .then(function(success) {
                    TmMediaImagesService.setSubmitInProgress(false);
                    NotifierFactory.show(
                        success ? 'success' : 'error',
                        success ? 'Successfully!' : 'Failure!',
                        ' Image ' + actionName
                    );
                    if (success) {
                        TmMediaImagesService.setSelectedImage(item);
                        TmMediaImagesService.setHasErrors(false);
                        $scope.selectedImageBeforeChanges = item;
                    }
                    /**
                     * Tell other controllers to apply filter on changes
                     */
                    TmMediaImagesService.setTriggerChange(Math.random());
                });
        };

        /**
         * Check if newly assigned tick boxes are not hitting the limits.
         *
         * @param {Object} imageItem
         * @param {Object} item
         * @returns {Object}
         */
        controller.checkAssigned = function(imageItem, item) {
            // is action allowed
            var actionAllowed = true;
            // Emulate result
            var result = null;
            if (imageItem.id === 'temporary') {
                result = angular.copy(TmMediaImagesService.getImageItems());
                result.unshift(item);
            } else {
                result = angular.copy(TmMediaImagesService.getImageItems());
                angular.forEach(result, function(itemValue, itemKey) {
                    if (itemValue.id === item.id) {
                        result[itemKey] = item;
                    }
                });
            }
            // Recalculate new usages
            controller.uploadedImagesCount.master = 0;
            angular.forEach(result, function(value) {
                if (value.master) {
                    controller.uploadedImagesCount.master++;
                }
            });
            // Check if new usages are allowed value
            if (item.master && controller.uploadedImagesCount.master > TmMediaImagesService.getMaxImages()) {
                item.master = false;
                imageItem.master = false;
                controller.assignError('overview');
            }
            return { actionAllowed: actionAllowed, imageItem: imageItem, item: item };
        };

        controller.assignError = function(type) {
            NotifierFactory.show(
                'error',
                'Please delete an image and try again',
                type + ' profile has reached the limit '
            );
        };

        /**
         * Clear item.
         *
         * @param item
         */
        $scope.clearImageForm = function(item) {
            if (TmMediaImagesService.getSubmitInProgress()) {
                return false;
            }
            if (angular.isDefined(item)) {
                $scope.itemImage = item;
            } else {
                $scope.itemImage = TmMediaImagesService.getItemImage();
            }

            if ($scope.itemImage.id === 'temporary') {
                TmMediaImagesService.setSelectedImage(TmMediaImagesService.getItemImage(0));
            } else {
                $scope.itemImage = TmMediaImagesService.resetItem($scope.itemImage);
                TmMediaImagesService.setSelectedImage($scope.itemImage);
            }
            $scope.setDisplayIsValidType(false);
        };

        /**
         * Get selected item.
         *
         * @returns {*}
         */
        $scope.getSelectedImage = function() {
            return TmMediaImagesService.getSelectedImage();
        };

        /**
         * Get image items.
         *
         * @returns {*}
         */
        $scope.getImageItems = function() {
            return TmMediaImagesService.getImageItems();
        };

        /**
         * Get has errors flag.
         *
         * @returns {boolean|*}
         */
        $scope.getHasErrors = function() {
            return TmMediaImagesService.getHasErrors();
        };

        $scope.setHasErrors = function(value) {
            TmMediaImagesService.setHasErrors(value);
        };

        $scope.type = function() {
            return TmMediaImagesService.getType();
        };

        $scope.setDisplayIsValidType = function(value) {
            TmMediaImagesService.displayIsValidType = value;
        };

        $scope.getDisplayIsValidType = function() {
            return TmMediaImagesService.displayIsValidType;
        };

        $scope.submitInProgress = function ()
        {
            return TmMediaImagesService.getSubmitInProgress();
        };

        /**
         * Is edit mode?
         *
         * @returns {boolean}
         */
        $scope.isEditMode = function() {
            return $scope.selectedImage && $scope.selectedImage.id !== 'temporary' ? true : false;
        };

        /**
         * get image uploading in progress
         *
         * @returns {boolean}
         */
        $scope.getImageUploadingInProgress = function() {
            return TmMediaImagesService.getImageUploadingInProgress();
        };

        controller.initWatches = function() {
            WatchService.create($scope, TmMediaImagesService.getSelectedImage, function(selectedImage) {
                $scope.selectedImageBeforeChanges = angular.copy(selectedImage);
                $scope.selectedImage = angular.copy(selectedImage);
            });

            WatchService.create($scope, TmMediaImagesService.getHasErrors, function(newValue, oldValue) {
                if (!angular.equals(oldValue, newValue)) {
                    $scope.hasErrors = newValue;
                }
            });

            WatchService.create($scope, TmMediaImagesService.getTriggerReset, function(newValue, oldValue) {
                if (!angular.equals(oldValue, newValue)) {
                    $scope.selectedImage = angular.copy($scope.selectedImageBeforeChanges);
                }
            });

            WatchService.create($scope, TmMediaImagesService.getHighlighted, function(newValue) {
                if (newValue) {
                    $scope.isHighlighted = newValue;
                    $timeout(function() {
                        TmMediaImagesService.setHighlighted(false);
                        $scope.isHighlighted = false;
                    }, 200);
                }
            });

            WatchService.create($scope, TmProfileFactory.getSelectedMediaSubTabId, function(tabId) {
                if (tabId === 1) {
                    $timeout(function() {
                        TmMediaImagesService.setHighlighted(true);
                    }, 200);
                }
            });
        };

        controller.init = function() {
            controller.initWatches();
        };

        // listen to images tab visibility changes
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
        .controller('TmMediaImagesSidebarController', [
            '$scope',
            '$resource',
            '$location',
            '$timeout',
            'constants',
            'NotifierFactory',
            'TmProfileFactory',
            'TmMediaImagesService',
            'WatchService',
            App.controllers.TmMediaImagesSidebar
        ]);

}(window.angular));
