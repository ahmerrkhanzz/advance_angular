(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.TmMediaImages = function (
        $scope,
        constants,
        Lightbox,
        TmProfileFactory,
        NotifierFactory,
        TmMediaImagesService,
        TmMediaService,
        ModalService,
        $filter,
        orderBy,
        AuthenticationService,
        WatchService
    ) {
        var controller = this;
        controller.devMode = constants.dev;
        TmMediaImagesService.coreId = 0;
        $scope.imageItems = [];
        $scope.itemImage = {};
        $scope.displayLocationDeletePopup = true;
        $scope.type = TmMediaService.typeOverview();
        // assign defaults for uploadedImagesCount per type
        $scope.uploadedImagesCount = {};
        $scope.uploadedImagesCount[TmMediaService.typeOverview()] = 0;
        // maximum images allowed per type, displayed in view
        controller.maxImages = TmMediaImagesService.getMaxImages();
        controller.dropZoneImageInstance = null;
        TmMediaImagesService.setType(TmMediaService.typeOverview());

        /**
         * Sortable options.
         */
        $scope.sortableOptions = {
            disabled: false,
            'ui-floating': false,
            start: function () {
                controller.initialList = [];
                angular.copy($scope.imageItems, controller.initialList);
            },
            update: function (e, ui) {
                var validateItems = true;
                if (true !== validateItems) {
                    ui.item.sortable.cancel();
                }
            },
            stop: function() {
                var validateItems = true;
                if (true === validateItems) {
                    var assignedOrder = 1;
                    // change images order
                    for (var index = 0; index < $scope.imageItems.length; index++) {
                            $scope.imageItems[index].orderType[$scope.type] = assignedOrder;
                            assignedOrder++;
                    }

                    $scope.sortableOptions.disabled = false;
                    TmMediaImagesService.saveOrder(TmMediaImagesService.coreId, $scope.imageItems)
                        .then(function(success) {
                            NotifierFactory.show(
                                success ? 'success' : 'error',
                                success ? 'Success!' : 'Failure!',
                                'Image Order Save'
                            );
                            TmMediaImagesService.setSelectedImage(TmMediaImagesService.getItemImage());
                        })
                        .finally(function() {
                            $scope.sortableOptions.disabled = false;
                            TmMediaImagesService.setImageItems($scope.imageItems);
                        });
                } else {
                    NotifierFactory.show(
                        'error',
                        'Failure!',
                        'Invalid items in image list'
                    );
                    TmMediaImagesService.setSelectedImage(validateItems);
                    TmMediaImagesService.displayIsValidType = false;

                    return false;
                }
            }
        };

        /**
         * Assigns selected image.
         *
         * @param {Object} item
         */
        $scope.selectImage = function (item) {
            if (angular.isDefined(item) && item.id !== 'temporary') {
                TmMediaImagesService.setHasErrors(false);
                TmMediaImagesService.displayIsValidType = false;
                $scope.itemImage = TmMediaImagesService.getItemImage();
                if (angular.isDefined(item)) {
                    TmMediaImagesService.setSelectedImage(item);
                } else {
                    TmMediaImagesService.setHasErrors(true);
                    TmMediaImagesService.setSelectedImage($scope.itemImage);
                }
            }
        };

        /**
         * Returns selected image.
         *
         * @returns {Object}
         */
        $scope.selectedItem = function () {
            return TmMediaImagesService.getSelectedImage();
        };

        /**
         * Delete image action handler.
         *
         * @param item
         */
        $scope.deleteImage = function (item) {
            if (TmMediaImagesService.getSubmitInProgress()) {
                return false;
            }
            if (angular.isDefined($scope.item)) {
                $scope.item.thumbnailUrl = null;
            }
            if (angular.isDefined(item) && item.id !== 'temporary') {
                var itemName = angular.isDefined(item.name) && item.name !== null ? ': ' + item.name : '';
                var modalOptions = {
                    closeButtonText: 'No',
                    actionButtonText: 'Yes',
                    headerText: 'Delete Image' + itemName,
                    bodyText: 'Are you sure you wish to delete this image?',
                };
                ModalService.show({}, modalOptions).then(function () {
                    TmMediaImagesService.deleteImage(TmMediaImagesService.coreId, item)
                        .then(function (success) {
                            TmMediaImagesService.getSubmitInProgress(false);
                            NotifierFactory.show(
                                success ? 'success' : 'error',
                                success ? 'Successfully!' : 'Failure!',
                                'Image Deleted'
                            );
                            if (success) {
                                TmMediaImagesService.setSelectedImage(TmMediaImagesService.getItemImage());
                                $scope.imageItems.splice(TmMediaService.objectSearch($scope.imageItems, item.id), 1);
                                TmMediaImagesService.setImageItems($scope.imageItems);
                                var assignedOrder = 1;
                                for (var index = 0; index < $scope.imageItems.length; index++) {
                                    if ($scope.imageItems[index][$scope.type]) {
                                        assignedOrder++;
                                    }
                                }
                                controller.recalculateImages();
                            }
                        });
                });
            } else {
                TmMediaImagesService.setSelectedImage(TmMediaImagesService.getItemImage(0));
            }
        };

        /**
         * Returns selected image id.
         *
         * @returns {string}
         */
        $scope.selectedItemId = function () {
            if (TmMediaImagesService.getSelectedImage()) {
                return TmMediaImagesService.getSelectedImage().id;
            }
        };

        /**
         * Recalculates number of images for each type.
         */
        controller.recalculateImages = function () {
            $scope.imageItems = orderBy($scope.imageItems, 'orderType.' + $scope.type, false);
            $scope.uploadedImagesCount.master = 0;
            angular.forEach(TmMediaImagesService.getImageItems(), function () {
                $scope.uploadedImagesCount.master++;
            });
            TmMediaImagesService.uploadedImagesCount = $scope.uploadedImagesCount;
            controller.setOptionsMaxFiles();
        };

        /**
         * DropZone init function.
         */
        controller.dropZoneImageInit = function () {
            controller.dropZoneImageInstance = this;
            controller.setOptionsMaxFiles();
        };

        /**
         * DropZone options url function.
         *
         * @returns {string}
         */

        controller.getUploadUrl = function () {
            controller.setOptionsMaxFiles();
            return constants.api.institutions.url + '/v1/tm-profile/' + TmProfileFactory.getId() + '/images';
        };

        controller.setOptionsMaxFiles = function () {
            if (controller.dropZoneImageInstance !== null) {
                controller.dropZoneImageInstance.options.maxFiles = TmMediaImagesService.getMaxImages() - $scope.uploadedImagesCount[$scope.type];
            }
        };

        /**
         * Uploading Image
         *
         * @params {Object} item
         */
        controller.uploadImage = function (item) {
            var imageItem = angular.copy(item);
            TmMediaImagesService.displayIsValidType = false;
            TmMediaImagesService.setHasErrors(false);
            var actionName = 'Added';
            if (imageItem.id !== 'temporary') {
                actionName = 'Updated';
            }
            if (!angular.isDefined(item.url) || !(angular.isDefined(item.url) && item.url.length > 0)) {
                TmMediaImagesService.setHasErrors(true);

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
            TmMediaImagesService.setImageUploadingInProgress(true);
            TmMediaImagesService.saveImage(TmProfileFactory.getId(), imageItem)
                .then(function (success) {
                    TmMediaImagesService.setImageUploadingInProgress(false);
                    if (success) {
                        if (imageItem.id === 'temporary') {
                            item.id = success;
                            var imageItems = TmMediaImagesService.getImageItems();
                            imageItems.unshift(item);
                            TmMediaImagesService.setImageItems(angular.copy(imageItems));
                        }
                        TmMediaImagesService.setSelectedImage(item);
                        TmMediaImagesService.setHasErrors(false);
                        $scope.selectedImageBeforeChanges = item;
                        TmMediaImagesService.setHighlighted(true);
                        TmMediaImagesService.displayIsValidType = false;
                    }
                    NotifierFactory.show(
                        success ? 'success' : 'error',
                        success ? 'Add a title, description and click Update' : 'Failure!',
                        success ? ' Image '+ actionName + ' Successfully!' : ' Image '+ actionName + 'Failure!'
                    );
                    /**
                     * Tell other controllers to apply filter on changes
                     */
                    TmMediaImagesService.setTriggerChange(Math.random());
                });
        };

        /**
         * DropZone success handler.
         *
         * @param file
         * @param response
         */
        controller.handleImageSuccess = function (file, response) {
            // remove previously uploaded image from dropzone instance
            controller.dropZoneImageInstance.removeAllFiles();
            var item = TmMediaImagesService.getItemImage(0);
            if (angular.isDefined(response.status) && response.status &&
                angular.isDefined(response.path) && response.path
            ) {
                item.id = 'temporary';
                item.thumbnailUrl = response.path;
                item.url = response.path;
                $scope.item = item;
                controller.uploadImage(item);
                controller.setOptionsMaxFiles();
            } else {
                var message = 'Bad response, please try again later';
                if (response !== null && response.hasOwnProperty('code')) {
                    message = response.message;
                }
                NotifierFactory.show(
                    'error',
                    message,
                    'Error!'
                );
            }
            $scope.$apply();
        };

        /**
         * DropZone error handler.
         *
         * @param file
         * @param response
         */
        controller.handleImageError = function (file, response) {
            // remove previously uploaded image from dropzone instance
            controller.dropZoneImageInstance.removeAllFiles();
            var message = response;
            if (file.accepted && file.status === 'error') {
                message = 'Upload error, please try again later';
            }
            if (response.status === 'error') {
                message = response.message;
            }
            controller.setOptionsMaxFiles();
            if (file.size > $scope.imageConfig.dropzone.maxFilesize * 1000 * 1000) {
                message = $scope.imageConfig.dropzone.dictFileTooBig;
            }
            NotifierFactory.show(
                'error',
                message
            );
            $scope.$apply();
        };

        /**
         * DropZone configuration.
         */
        $scope.imageConfig = {
            // http://www.dropzonejs.com/#configuration-options
            dropzone: {
                url: controller.getUploadUrl(),
                maxFilesize: 0.4,
                parallelUploads: 1,
                autoProcessQueue: true,
                addRemoveLinks: false,
                previewsContainer: null,
                clickable: '.upload-image',
                init: controller.dropZoneImageInit,
                acceptedFiles: 'image/jpeg,image/pjpeg,image/jpeg,image/pjpeg',
                dictFileTooBig: "Uploaded Image is greater than the limit. Please upload less than 400KB.",
                dictMaxFilesExceeded: "Profiles have reached the limit. Please delete an image and try again",
                dictInvalidFileType: "Uploaded image has incorrect format. Please upload images in jpg, jpeg format.",
                headers: AuthenticationService.getAuthorizationHeader()
            },
            // http://www.dropzonejs.com/#event-list
            eventHandlers: {
                success: controller.handleImageSuccess,
                error: controller.handleImageError
            }
        };

        $scope.isSelected = function () {
            return $scope.selectedItem() && $scope.selectedItem().id === '' ||
                $scope.isTemporary();
        };

        $scope.isTemporary = function () {
            return $scope.selectedItem() && $scope.selectedItem().id === 'temporary';
        };

        /**
         * get image uploading in progress
         *
         * @returns {boolean}
         */
        $scope.getImageUploadingInProgress = function () {
            return TmMediaImagesService.getImageUploadingInProgress();
        };

        $scope.openLightboxModal = function (index) {
            Lightbox.openModal($scope.imageItems, index);
        };

        controller.initWatches = function () {
            /**
             * Assign profile data
             */
            WatchService.create($scope, TmProfileFactory.getData, function (profileData) {
                if (!profileData || !profileData.id) {
                    return;
                }
                angular.copy(profileData.images, $scope.imageItems);
                TmMediaImagesService.coreId = profileData.id;
                TmMediaImagesService.setImageItems($scope.imageItems);
                controller.recalculateImages();
                $scope.imageItems = orderBy($scope.imageItems, 'orderType.' + $scope.type, false);
                TmMediaImagesService.setSelectedImage($scope.imageItems[0]);
            });

            /**
             * Assign image items on change
             */
            WatchService.create($scope, TmMediaImagesService.getImageItems, function (newValue, oldValue) {
                if (!angular.equals(oldValue, newValue)) {
                    $scope.imageItems = newValue;
                    controller.recalculateImages();
                }
            });

            /**
             * Re-filter array on trigger call.
             */
            WatchService.create($scope, TmMediaImagesService.getTriggerChange, function () {
                if (angular.isDefined($scope.selectedItemId()) && $scope.selectedItemId().length > 0) {
                    TmMediaImagesService.replaceByKey($scope.selectedItemId());
                }
                var assignedOrder = 1;
                // change images order
                for (var index = 0; index < $scope.imageItems.length; index++) {
                    if ($scope.imageItems[index][$scope.type]) {
                        $scope.imageItems[index].orderType[$scope.type] = assignedOrder;
                        assignedOrder++;
                    }
                }
                controller.recalculateImages();
                $scope.item = TmMediaImagesService.getItemImage(0);
            });
        };

        controller.init = function () {
            controller.initWatches();
        };

        controller.init();
    };

    angular
        .module('qsHub')
        .controller('TmMediaImagesController', [
            '$scope',
            'constants',
            'Lightbox',
            'TmProfileFactory',
            'NotifierFactory',
            'TmMediaImagesService',
            'TmMediaService',
            'ModalService',
            '$filter',
            'orderByFilter',
            'AuthenticationService',
            'WatchService',
            App.controllers.TmMediaImages
        ]);

} (window.angular));
