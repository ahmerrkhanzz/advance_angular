(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers: {}});

    App.controllers.TuMediaImages = function (
        $scope,
        constants,
        Lightbox,
        TuProfileFactory,
        NotifierFactory,
        TuMediaImagesService,
        TuMediaService,
        ModalService,
        $filter,
        orderBy,
        AuthenticationService,
        WatchService
    ) {
        var controller = this;
        controller.devMode = constants.dev;
        TuMediaImagesService.coreId = 0;
        $scope.imageItems = [];
        $scope.itemImage = {};
        $scope.displayLocationDeletePopup = true;
        $scope.type = TuMediaService.typeOverview();
        // assign defaults for uploadedImagesCount per type
        $scope.uploadedImagesCount = {};
        $scope.uploadedImagesCount[TuMediaService.typeOverview()] = 0;
        $scope.uploadedImagesCount[TuMediaService.typeUndergraduate()] = 0;
        $scope.uploadedImagesCount[TuMediaService.typePostgraduate()] = 0;
        // maximum images allowed per type, displayed in view
        controller.maxImages = TuMediaImagesService.getMaxImages();
        controller.dropZoneImageInstance = null;
        TuMediaImagesService.setType(TuMediaService.typeOverview());

        /**
         * Assign profile data
         */
        WatchService.create($scope, function () {
            return TuProfileFactory.getData();
        }, function (newValue) {
            if (newValue !== null) {
                angular.copy(newValue.images, $scope.imageItems);
                TuMediaImagesService.coreId = newValue.id;
                TuMediaImagesService.setImageItems($scope.imageItems);
                controller.recalculateImages();
                $scope.filteredImageItems = $filter('filter')($scope.imageItems, {master: true});
                $scope.filteredImageItems = orderBy($scope.filteredImageItems, 'orderType.' + $scope.type, false);
                // set default
                $scope.filter($scope.type, true);
            }
        });

        /**
         * Assign image items on change
         */
        WatchService.create($scope, TuMediaImagesService.getImageItems, function (newValue, oldValue) {
            if (!angular.equals(oldValue, newValue)) {
                $scope.imageItems = newValue;
                controller.recalculateImages();
            }
        });

        /**
         * Re-filter array on trigger call.
         */
        WatchService.create($scope, TuMediaImagesService.getTriggerChange, function () {
            if (angular.isDefined($scope.selectedItemId()) && $scope.selectedItemId().length > 0) {
                TuMediaImagesService.replaceByKey($scope.selectedItemId());
            }
            var selectedImage = TuMediaImagesService.getSelectedImage();
            if (
                ($scope.type === 'ug' && selectedImage.ug) || 
                (!selectedImage.master && selectedImage.ug && !selectedImage.pg) || 
                (!selectedImage.master && selectedImage.ug && selectedImage.pg && ($scope.type === 'ug' || $scope.type === 'master'))
            ) {
                $scope.filter('ug');
            } else if (($scope.type === 'pg' && selectedImage.pg) || (!selectedImage.master && !selectedImage.ug && selectedImage.pg)) {
                $scope.filter('pg');
            } else {
                $scope.filter('master');
            }
            var assignedOrder = 1;
            // change images order
            for (var index = 0; index < $scope.filteredImageItems.length; index++) {
                if ($scope.filteredImageItems[index][$scope.type]) {
                    $scope.filteredImageItems[index].orderType[$scope.type] = assignedOrder;
                    assignedOrder++;
                }
            }
            $scope.item = TuMediaImagesService.getItemImage(0);
        });

        /**
         * Sortable options.
         */
        $scope.sortableOptions = {
            disabled: false,
            'ui-floating': false,
            start: function () {
                controller.initialList = [];
                angular.copy($scope.filteredImageItems, controller.initialList);
            },
            update: function (e, ui) {
                var validateItems = TuMediaService.validateTypes($scope.imageItems);
                if (true !== validateItems) {
                    ui.item.sortable.cancel();
                }
            },
            stop: function () {
                var validateItems = TuMediaService.validateTypes($scope.imageItems);
                if (true === validateItems) {
                    var assignedOrder = 1;
                    // change images order
                    for (var index = 0; index < $scope.filteredImageItems.length; index++) {
                        if ($scope.filteredImageItems[index][$scope.type]) {
                            $scope.filteredImageItems[index].orderType[$scope.type] = assignedOrder;
                            assignedOrder++;
                        }
                    }

                    $scope.sortableOptions.disabled = false;
                    TuMediaImagesService.saveOrder(TuMediaImagesService.coreId, $scope.imageItems)
                        .then(function (success) {
                            NotifierFactory.show(
                                success ? 'success' : 'error',
                                success ? 'Success!' : 'Failure!',
                                'Image Order Save'
                            );
                            TuMediaImagesService.setSelectedImage(TuMediaImagesService.getItemImage());
                        })
                        .finally(function () {
                            $scope.sortableOptions.disabled = false;
                        });
                } else {
                    NotifierFactory.show(
                        'error',
                        'Failure!',
                        'Invalid items in image list'
                    );
                    TuMediaImagesService.setSelectedImage(validateItems);
                    TuMediaImagesService.displayIsValidType = false;

                    return false;
                }
            }
        };

        /**
         * Filter change.
         *
         * @param {string} type
         * @param {boolean} setDefault
         */
        $scope.filter = function (type, setDefault) {
            if (angular.isUndefined(setDefault)) {
                setDefault = false;
            }
            var validateItems = TuMediaService.validateTypes($scope.imageItems);
            if (true === validateItems) {
                $scope.type = type;
                var params = {};
                params[type] = true;
                controller.recalculateImages();
                $scope.filteredImageItems = $filter('filter')($scope.imageItems, params);
                $scope.filteredImageItems = orderBy($scope.filteredImageItems, 'orderType.' + type, false);
                if (setDefault) {
                    var selectedImage = TuMediaImagesService.getItemImage();
                    if ($scope.uploadedImagesCount[$scope.type] > 0) {
                        selectedImage = $scope.filteredImageItems[0];
                    }
                    TuMediaImagesService.setSelectedImage(selectedImage);
                }
            } else {
                NotifierFactory.show(
                    'error',
                    'Failure!',
                    'Invalid items in image list'
                );
                TuMediaImagesService.setSelectedImage(validateItems);
                TuMediaImagesService.displayIsValidType = false;
                controller.recalculateImages();

                return false;
            }
        };

        /**
         * Assigns selected image.
         *
         * @param {Object} item
         */
        $scope.selectImage = function (item) {
            if (angular.isDefined(item) && item.id !== 'temporary') {
                var validateItems = TuMediaService.validateTypes($scope.imageItems);
                if (true === validateItems) {
                    TuMediaImagesService.setHasErrors(false);
                    TuMediaImagesService.displayIsValidType = false;
                    $scope.itemImage = TuMediaImagesService.getItemImage();
                    if (angular.isDefined(item)) {
                        TuMediaImagesService.setSelectedImage(item);
                    } else {
                        TuMediaImagesService.setHasErrors(true);
                        TuMediaImagesService.setSelectedImage($scope.itemImage);
                    }
                    TuMediaImagesService.setTriggerReset(Math.random());
                } else {
                    NotifierFactory.show(
                        'error',
                        'Failure!',
                        'Invalid items in image list'
                    );
                    TuMediaImagesService.setSelectedImage(validateItems);
                    TuMediaImagesService.displayIsValidType = false;

                    return false;
                }
            }
        };

        /**
         * Returns selected image.
         *
         * @returns {Object}
         */
        $scope.selectedItem = function () {
            return TuMediaImagesService.getSelectedImage();
        };

        /**
         * Delete image action handler.
         *
         * @param item
         */
        $scope.deleteImage = function (item) {
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
                ModalService.show({}, modalOptions).then(function (result) {
                    TuMediaImagesService.deleteImage(TuMediaImagesService.coreId, item)
                        .then(function (success) {
                            $scope.submitInProgress = false;
                            NotifierFactory.show(
                                success ? 'success' : 'error',
                                success ? 'Successfully!' : 'Failure!',
                                'Image Deleted'
                            );
                            if (success) {
                                TuMediaImagesService.setSelectedImage(TuMediaImagesService.getItemImage());
                                $scope.imageItems.splice(TuMediaService.objectSearch($scope.imageItems, item.id), 1);
                                $scope.filteredImageItems.splice(TuMediaService.objectSearch($scope.filteredImageItems, item.id), 1);
                                var assignedOrder = 1;
                                for (var index = 0; index < $scope.filteredImageItems.length; index++) {
                                    if ($scope.filteredImageItems[index][$scope.type]) {
                                        $scope.filteredImageItems[index].orderType[$scope.type] = assignedOrder;
                                        assignedOrder++;
                                    }
                                }
                                $scope.filteredImageItems = orderBy($scope.filteredImageItems, 'orderType.' + $scope.type, false);
                                controller.recalculateImages();
                            }
                        });
                });
            } else {
                TuMediaImagesService.setSelectedImage(TuMediaImagesService.getItemImage(0));
            }
        };

        /**
         * Returns overview type system name.
         *
         * @returns {string}
         */
        $scope.typeOverview = function () {
            return TuMediaService.typeOverview();
        };

        /**
         * Returns undergraduate type system name.
         *
         * @returns {string}
         */
        $scope.typeUndergraduate = function () {
            return TuMediaService.typeUndergraduate();
        };

        /**
         * Returns postgraduate type system name.
         *
         * @returns {string}
         */
        $scope.typePostgraduate = function () {
            return TuMediaService.typePostgraduate();
        };

        /**
         * Returns selected image id.
         *
         * @returns {string}
         */
        $scope.selectedItemId = function () {
            return TuMediaImagesService.getSelectedImage().id;
        };

        /**
         * Recalculates number of images for each type.
         */
        controller.recalculateImages = function () {
            $scope.uploadedImagesCount.master = 0;
            $scope.uploadedImagesCount.ug = 0;
            $scope.uploadedImagesCount.pg = 0;
            angular.forEach(TuMediaImagesService.getImageItems(), function (value) {
                if (value.master) {
                    $scope.uploadedImagesCount.master++;
                }
                if (value.ug) {
                    $scope.uploadedImagesCount.ug++;
                }
                if (value.pg) {
                    $scope.uploadedImagesCount.pg++;
                }
            });
            TuMediaImagesService.uploadedImagesCount = $scope.uploadedImagesCount;
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
            return constants.api.institutions.url + '/v1/tu-profile/' + TuProfileFactory.getId() + '/images';
        };

        controller.setOptionsMaxFiles = function () {
            if (controller.dropZoneImageInstance !== null) {
                controller.dropZoneImageInstance.options.maxFiles = TuMediaImagesService.getMaxImages() - $scope.uploadedImagesCount[$scope.type];
            }
        };

        /**
         * Uploading Image
         *
         * @params {Object} item
         */
        controller.uploadImage = function (item) {
            var imageItem = angular.copy(item);
            TuMediaImagesService.displayIsValidType = false;
            TuMediaImagesService.setHasErrors(false);
            var actionName = 'Added';
            if (imageItem.id !== 'temporary') {
                actionName = 'Updated';
            }
            if (!angular.isDefined(item.url) || !(angular.isDefined(item.url) && item.url.length > 0)) {
                TuMediaImagesService.setHasErrors(true);

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
            TuMediaImagesService.setImageUploadingInProgress(true);
            TuMediaImagesService.saveImage(TuMediaImagesService.coreId, imageItem)
                .then(function (success) {
                    TuMediaImagesService.setImageUploadingInProgress(false);
                    if (success) {
                        if (imageItem.id === 'temporary') {
                            item.id = success;
                            TuMediaImagesService.getImageItems().unshift(item);
                        }
                        TuMediaImagesService.setSelectedImage(item);
                        TuMediaImagesService.setHasErrors(false);
                        $scope.selectedImageBeforeChanges = item;
                        TuMediaImagesService.setHighlighted(true);
                        TuMediaImagesService.displayIsValidType = false;
                    }
                    NotifierFactory.show(
                        success ? 'success' : 'error',
                        success ? 'Add a title, description and click Update' : 'Failure!',
                        success ? ' Image '+ actionName + ' Successfully!' : ' Image '+ actionName + 'Failure!'
                    );
                    /**
                     * Tell other controllers to apply filter on changes
                     */
                    TuMediaImagesService.setTriggerChange(Math.random());
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
            var item = TuMediaImagesService.getItemImage(0);
            if (angular.isDefined(response.status) && response.status &&
                angular.isDefined(response.path) && response.path
            ) {
                TuMediaImagesService.setSelectedImage(item);
                if ($scope.uploadedImagesCount.master >= controller.maxImages) {
                    delete item.master;
                }
                if ($scope.uploadedImagesCount.ug >= controller.maxImages) {
                    delete item.ug;
                }
                if ($scope.uploadedImagesCount.pg >= controller.maxImages) {
                    delete item.pg;
                }
                if (item.master || item.ug || item.pg) {
                    item.id = 'temporary';
                    item.thumbnailUrl = response.path;
                    item.url = response.path;
                    $scope.item = item;
                    controller.setOptionsMaxFiles();
                    controller.uploadImage(item);
                }
                item.id = 'temporary';
                item.thumbnailUrl = response.path;
                item.url = response.path;
                $scope.item = item;
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
                init : controller.dropZoneImageInit,
                acceptedFiles: 'image/jpeg,image/pjpeg,image/jpeg,image/pjpeg',
                dictFileTooBig: "Uploaded Image is greater than the limit. Please upload less than 400KB.",
                dictMaxFilesExceeded: "Profiles have reached the limit. Please delete an image and try again",
                dictInvalidFileType: "Uploaded image has incorrect format. Please upload images in jpg, jpeg format.",
                headers: AuthenticationService.getAuthorizationHeader()
            },
            // http://www.dropzonejs.com/#event-list
            eventHandlers: {
                success : controller.handleImageSuccess,
                error : controller.handleImageError
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
            return TuMediaImagesService.getImageUploadingInProgress();
        };

        $scope.openLightboxModal = function (index) {
            Lightbox.openModal($scope.filteredImageItems, index);
        };
    };

    angular
        .module('qsHub')
        .controller('TuMediaImagesController', [
            '$scope',
            'constants',
            'Lightbox',
            'TuProfileFactory',
            'NotifierFactory',
            'TuMediaImagesService',
            'TuMediaService',
            'ModalService',
            '$filter',
            'orderByFilter',
            'AuthenticationService',
            'WatchService',
            App.controllers.TuMediaImages
        ]);

}(window.angular));
