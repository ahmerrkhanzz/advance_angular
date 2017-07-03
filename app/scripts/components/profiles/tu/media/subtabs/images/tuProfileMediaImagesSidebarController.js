(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers: {}});

    App.controllers.TuMediaImagesSidebar = function (
        $scope,
        $resource,
        $location,
        $timeout,
        constants,
        NotifierFactory,
        TuProfileFactory,
        TuMediaImagesService,
        TuMediaService,
        WatchService
    ) {
        var controller = this,
        alreadyInitialised = false;
        controller.uploadedImagesCount = {};
        $scope.hasErrors = true;
        TuMediaImagesService.displayIsValidType = false;
        TuMediaImagesService.setHasErrors(false);

        /**
         * Save form.
         *
         * @param item
         * @returns {boolean}
         */
        $scope.saveImageForm = function (item) {
            if (
                !$scope.forms.formImage ||
                !$scope.forms.formImage.$valid ||
                $scope.submitInProgress
            ) {
                return false;
            }
            var imageItem = angular.copy(item);
            TuMediaImagesService.displayIsValidType = false;
            TuMediaImagesService.setHasErrors(false);
            var actionName = 'Added';
            if (imageItem.id !== 'temporary') {
                actionName = 'Updated';
            }
            if (!TuMediaService.isValidType(item)) {
                TuMediaImagesService.displayIsValidType = true;

                return false;
            }
            if (!angular.isDefined(item.url) || !(angular.isDefined(item.url) && item.url.length > 0)) {
                $scope.setHasErrors(true);

                return false;
            }
            if (!$scope.forms.formImage || !$scope.forms.formImage.$valid
            ) {
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

            // Check if newly assigned checkboxes doesn't hit the limits
            var checkAssigned = controller.checkAssigned(imageItem, item);
            // To make sure everything goes smooth, re-assign the values from the function output
            imageItem = checkAssigned.imageItem;
            item = checkAssigned.item;
            if (!checkAssigned.actionAllowed) {
                return false;
            }
            $scope.submitInProgress = true;
            TuMediaImagesService.saveImage(TuMediaImagesService.coreId, imageItem)
                .then(function (success) {
                    $scope.submitInProgress = false;
                    NotifierFactory.show(
                        success ? 'success' : 'error',
                        success ? 'Successfully!' : 'Failure!',
                        ' Image '+ actionName
                    );
                    if (success) {
                        if (imageItem.id === 'temporary') {
                            item.id = success;
                            TuMediaImagesService.getImageItems().unshift(item);
                        }
                        TuMediaImagesService.setSelectedImage(item);
                        TuMediaImagesService.setHasErrors(false);
                        $scope.selectedImageBeforeChanges = item;
                    }
                    /**
                     * Tell other controllers to apply filter on changes
                     */
                    TuMediaImagesService.setTriggerChange(Math.random());
                });
        };

        /**
         * Check if newly assigned tick boxes are not hitting the limits.
         *
         * @param {Object} imageItem
         * @param {Object} item
         * @returns {Object}
         */
        controller.checkAssigned = function (imageItem, item) {
            // is action allowed
            var actionAllowed = true;
            // Emulate result
            var result = null;
            if (imageItem.id === 'temporary') {
                result = angular.copy(TuMediaImagesService.getImageItems());
                result.unshift(item);
            } else {
                result = angular.copy(TuMediaImagesService.getImageItems());
                angular.forEach(result, function(itemValue, itemKey) {
                    if(itemValue.id === item.id) {
                        result[itemKey] = item;
                    }
                });
            }
            // Recalculate new usages
            controller.uploadedImagesCount.master = 0;
            controller.uploadedImagesCount.ug = 0;
            controller.uploadedImagesCount.pg = 0;
            angular.forEach(result, function (value) {
                if (value.master) {
                    controller.uploadedImagesCount.master++;
                }
                if (value.ug) {
                    controller.uploadedImagesCount.ug++;
                }
                if (value.pg) {
                    controller.uploadedImagesCount.pg++;
                }
            });
            // Check if new usages are allowed value
            if (item.master && controller.uploadedImagesCount.master > TuMediaImagesService.getMaxImages()) {
                item.master = false;
                imageItem.master = false;
                controller.assignError('overview');
            }
            if (item.ug && controller.uploadedImagesCount.ug > TuMediaImagesService.getMaxImages()) {
                item.ug = false;
                imageItem.ug = false;
                controller.assignError('undergraduate');
            }
            if (item.pg && controller.uploadedImagesCount.pg > TuMediaImagesService.getMaxImages()) {
                item.pg = false;
                imageItem.pg = false;
                controller.assignError('postgraduate');
            }
            if (!item.master && !item.ug && !item.pg) {
                actionAllowed = false;
            }

            return {actionAllowed: actionAllowed, imageItem: imageItem, item: item};
        };

        controller.assignError = function (type) {
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
        $scope.clearImageForm = function (item) {
            if (angular.isDefined(item)) {
                $scope.itemImage = item;
            } else {
                $scope.itemImage = TuMediaImagesService.getItemImage();
            }

            if ($scope.itemImage.id === 'temporary') {
                TuMediaImagesService.setSelectedImage(TuMediaImagesService.getItemImage(0));
            } else {
                $scope.itemImage = TuMediaImagesService.resetItem($scope.itemImage);
            }
            $scope.setDisplayIsValidType(false);
        };

        /**
         * Get selected item.
         *
         * @returns {*}
         */
        $scope.getSelectedImage = function () {
            return TuMediaImagesService.getSelectedImage();
        };

        /**
         * Get image items.
         *
         * @returns {*}
         */
        $scope.getImageItems = function () {
            return TuMediaImagesService.getImageItems();
        };

        /**
         * Get has errors flag.
         *
         * @returns {boolean|*}
         */
        $scope.getHasErrors = function () {
            return TuMediaImagesService.getHasErrors();
        };

        $scope.setHasErrors = function (value) {
            TuMediaImagesService.setHasErrors(value);
        };

        $scope.type = function () {
            return TuMediaImagesService.getType();
        };

        $scope.setDisplayIsValidType = function (value) {
            TuMediaImagesService.displayIsValidType = value;
        };

        $scope.getDisplayIsValidType = function () {
            return TuMediaImagesService.displayIsValidType;
        };

        /**
         * Is edit mode?
         *
         * @returns {boolean}
         */
        $scope.isEditMode = function () {
            return $scope.selectedImage && $scope.selectedImage.id !== 'temporary' ? true : false;
        };
        
        /**
         * get image uploading in progress
         *
         * @returns {boolean}
         */
        $scope.getImageUploadingInProgress = function () {
            return TuMediaImagesService.getImageUploadingInProgress();
        };

        controller.getSelectedImageWatch = function (selectedImage) {
            $scope.selectedImageBeforeChanges = angular.copy(selectedImage);
            $scope.selectedImage = angular.copy(selectedImage);
        };

        controller.getHasErrorsWatch = function (newValue, oldValue) {
            if (!angular.equals(oldValue, newValue)) {
                $scope.hasErrors = newValue;
            }
        };

        controller.getTriggerResetWatch = function (newValue, oldValue) {
            if (!angular.equals(oldValue, newValue)) {
                $scope.selectedImage = angular.copy($scope.selectedImageBeforeChanges);
            }
        };

        controller.getHighlightedWatch = function (newValue) {
            if (newValue) {
                $scope.isHighlighted = newValue;
                $timeout(function () {
                    TuMediaImagesService.setHighlighted(false);
                    $scope.isHighlighted = false;
                },200);
            }
        };

        controller.getSelectedMediaTabIdWatch = function (tabId) {
            if (tabId === 1) {
                if (typeof $scope.selectedImageBeforeChanges !== 'undefined') {
                    $scope.selectedImage = angular.copy($scope.selectedImageBeforeChanges);
                }
                $timeout(function () {
                    TuMediaImagesService.setHighlighted(true);
                },200);
            }
        };

        controller.initWatches = function () {
            WatchService.create($scope, TuMediaImagesService.getSelectedImage, controller.getSelectedImageWatch, true);
            WatchService.create($scope, TuMediaImagesService.getHasErrors, controller.getHasErrorsWatch);
            WatchService.create($scope, TuMediaImagesService.getTriggerReset, controller.getTriggerResetWatch);
            WatchService.create($scope, TuMediaImagesService.getHighlighted, controller.getHighlightedWatch);
            WatchService.create($scope, TuProfileFactory.getSelectedMediaTabId, controller.getSelectedMediaTabIdWatch);
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
        .controller('TuMediaImagesSidebarController', [
            '$scope',
            '$resource',
            '$location',
            '$timeout',
            'constants',
            'NotifierFactory',
            'TuProfileFactory',
            'TuMediaImagesService',
            'TuMediaService',
            'WatchService',
            App.controllers.TuMediaImagesSidebar
        ]);

}(window.angular));