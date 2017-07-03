(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { services: {} });

    App.services.TmMediaImages = function($resource, $q, $log, constants, TmMediaService) {
        var serviceMediaImages = this;
        var service = {},
            maxImages = 48;
        serviceMediaImages.triggerChange = 0;
        serviceMediaImages.submitInProgress = false;

        service.getImageModel = function() {
            return $resource(constants.api.institutions.url + '/v1/tm-profile/:id/image/:imageId', null, {
                update: { method: 'PATCH' }
            });
        };

        service.getImagesOrderingModel = function() {
            return $resource(constants.api.institutions.url + '/v1/tm-profile/:id/imagesOrder', null, {
                update: { method: 'PATCH' }
            });
        };

        /**
         * Save Image
         *
         * @param institutionId
         * @param image
         * @returns {*}
         */
        service.saveImage = function(institutionId, image) {
            var imageModel = service.getImageModel(),
                imageSubmit = service.formatImage(image);
            if (angular.isDefined(imageSubmit.id) && imageSubmit.id !== 'temporary') {
                // update image
                return imageModel.update({ id: institutionId, imageId: image.id }, {
                    name: imageSubmit.name,
                    description: imageSubmit.description,
                    thumbnailUrl: imageSubmit.thumbnailUrl,
                    url: imageSubmit.url,
                    orderType: imageSubmit.orderType,
                    assignedTo: imageSubmit.assignedTo
                }).$promise.then(function(data) {
                    if (constants.dev) {
                        $log.log('success, got data: ', data);
                    }
                    return true;
                }, function(error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                    }
                    return false;
                });
            } else {
                // create new image
                return imageModel.save({ id: institutionId }, {
                    name: imageSubmit.name,
                    description: imageSubmit.description,
                    url: imageSubmit.url,
                    assignedTo: imageSubmit.assignedTo
                }).$promise.then(function(data) {
                    if (constants.dev) {
                        $log.log('success, got data: ', data);
                    }
                    return data.insertedId;
                }, function(error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                    }
                    return false;
                });
            }
        };

        /**
         * Save image order.
         *
         * @param {string} id - Institution TU profile mongo ID
         * @param {Object} images
         * @returns {Promise}
         */
        service.saveOrder = function(id, images) {
            var institutionModel = service.getImagesOrderingModel();
            return institutionModel.update({ id: id }, {
                'images': service.formatForOrdering(images)
            }).$promise.then(function(data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return true;
            }, function(error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return false;
            });
        };

        service.formatForOrdering = function(items) {
            var formattedItems = [];
            angular.forEach(items, function(item) {
                formattedItems.push({
                    'id': item.id,
                    'orderType': item.orderType
                });
            });

            return formattedItems;
        };

        /**
         * Delete image.
         *
         * @param institutionId
         * @param image
         * @returns {*}
         */
        service.deleteImage = function(institutionId, image) {
            service.setHasErrors(false);
            var imageModel = service.getImageModel();
            return imageModel.delete({ id: institutionId, imageId: image.id }).$promise.then(function(data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return true;
            }, function(error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return false;
            });
        };

        /**
         * Set Image Uploading in progress.
         *
         * @param {Boolean} value
         */
        service.setImageUploadingInProgress = function(value) {
            serviceMediaImages.imageUploadingInProgress = value;
        };


        /**
         * Get Image Uploading in progress.
         *
         * @return {Boolean}
         */
        service.getImageUploadingInProgress = function() {
            return serviceMediaImages.imageUploadingInProgress;
        };

        /**
         * Set selected image.
         *
         * @param item
         */
        service.setSelectedImage = function(item) {
            serviceMediaImages.selectedImage = item;
        };

        /**
         * Get selected image
         *
         * @returns {*}
         */
        service.getSelectedImage = function() {
            return serviceMediaImages.selectedImage;
        };

        /**
         * Trigger filter.
         *
         * @param triggerChange
         */
        service.setTriggerChange = function(triggerChange) {
            serviceMediaImages.triggerChange = triggerChange;
        };

        /**
         * Get trigger filter value
         *
         * @returns {*}
         */
        service.getTriggerChange = function() {
            return serviceMediaImages.triggerChange;
        };

        /**
         * Set image items.
         *
         * @param items
         * @param transform
         */
        service.setImageItems = function(items, transform) {
            if (!angular.isDefined(transform)) {
                transform = true;
            }
            if (transform) {
                angular.forEach(items, function(value, key) {
                    items[key][TmMediaService.typeOverview()] = false;
                    angular.forEach(items[key].assignedTo, function(aValue) {
                        if (aValue === TmMediaService.typeOverview()) {
                            items[key][TmMediaService.typeOverview()] = true;
                        }
                    });
                    /**
                     * Set initial order
                     * @type {{master: number, ug: number, pg: number}}
                     */
                    if (items[key].orderType === null) {
                        items[key].orderType = {
                            'master': 0
                        };
                    }
                    var orderOverview = 0;
                    if (angular.isDefined(items[key].orderType)) {
                        if (angular.isDefined(items[key].orderType[TmMediaService.typeOverview()])) {
                            orderOverview = items[key].orderType[TmMediaService.typeOverview()];
                        }
                    }
                    items[key].orderType = {
                        'master': orderOverview
                    };
                    if (angular.isDefined(items[key]._id)) {
                        items[key].id = items[key]._id;
                    }
                    delete items[key].assignedTo;
                    delete items[key]._id;
                });
            }

            serviceMediaImages.imageItems = items;
        };

        /**
         * Get image items.
         *
         * @returns {*}
         */
        service.getImageItems = function() {
            return serviceMediaImages.imageItems;
        };

        /**
         * Get image item.
         * @param {int} defaultValue
         */
        service.getItemImage = function(defaultValue) {
            if (angular.isUndefined(defaultValue)) {
                defaultValue = 0;
            }
            var orderTypes = {};
            orderTypes[TmMediaService.typeOverview()] = defaultValue;

            return {
                'id': '',
                'name': '',
                'description': '',
                'master': true,
                'orderType': orderTypes,
                'url': ''
            };
        };

        /**
         * Reset image item.
         *
         * @param item
         * @returns {*}
         */
        service.resetItem = function(item) {
            item.master = true;
            item.name = '';
            item.description = '';

            return item;
        };

        /**
         * Format images.
         *
         * @param images
         * @returns {*}
         */
        service.formatImages = function(images) {
            angular.forEach(images, function(value, key) {
                images[key] = service.formatImage(value);
            });

            return images;
        };

        /**
         * Format to match db data.
         *
         * @param {Object} image
         * @returns {Object}
         */
        service.formatImage = function(image) {
            image.assignedTo = [];
            if (image.master) {
                image.assignedTo.push('master');
            }
            // remove data we don't want to send.
            if (angular.isDefined(image.id) && parseInt(image.id, 10) === 0) {
                delete image.id;
            }
            delete image.master;
            delete image.order;

            return image;
        };

        /**
         * Sets has errors flag.
         *
         * @param {boolean} hasErrors
         */
        service.setHasErrors = function(hasErrors) {
            serviceMediaImages.hasErrors = hasErrors;
        };

        /**
         * Gets has errors flag.
         *
         * @returns {boolean|*}
         */
        service.getHasErrors = function() {
            return serviceMediaImages.hasErrors;
        };

        /**
         * Sets is highlighted.
         *
         * @param {boolean} isHighlighted
         */
        service.setHighlighted = function(isHighlighted) {
            serviceMediaImages.isHighlighted = isHighlighted;
        };

        /**
         * Gets is Highlighted.
         *
         * @returns {boolean|*}
         */
        service.getHighlighted = function() {
            return serviceMediaImages.isHighlighted;
        };

        service.coreId = function(coreId) {
            serviceMediaImages.coreId = coreId;
        };

        /**
         * Set type.
         *
         * @returns {*}
         */
        service.setType = function(type) {
            serviceMediaImages.type = type;
        };

        /**
         * Get type.
         *
         * @returns {*}
         */
        service.getType = function() {
            return serviceMediaImages.type;
        };

        /**
         * Replace item by item id
         *
         * @param key
         */
        service.replaceByKey = function(key) {
            var imageItems = [];
            angular.copy(service.getImageItems(), imageItems);
            angular.forEach(imageItems, function(itemValue, itemKey) {
                if (itemValue.id === key) {
                    imageItems[itemKey] = service.getSelectedImage();
                }
            });
            service.setImageItems(imageItems);
        };

        /**
         * Trigger filter.
         *
         * @param triggerChange
         */
        service.setTriggerReset = function(triggerChange) {
            serviceMediaImages.triggerChange = triggerChange;
        };

        service.getTriggerReset = function() {
            return serviceMediaImages.triggerChange;
        };

        /**
         * Submit is in progress.
         *
         * @param submitInProgress
         */
        service.setSubmitInProgress = function(submitInProgress) {
            serviceMediaImages.submitInProgress = submitInProgress;
        };

        service.getSubmitInProgress = function() {
            return serviceMediaImages.submitInProgress;
        };

        /**
         * UploadedImagesCount object, contains {master:count, ug: count, pg: count}
         *
         * @param {Object} uploadedImagesCount
         */
        service.setUploadedImagesCount = function(uploadedImagesCount) {
            serviceMediaImages.uploadedImagesCount = uploadedImagesCount;
        };

        service.getUploadedImagesCount = function() {
            return serviceMediaImages.uploadedImagesCount;
        };

        service.getMaxImages = function() {
            return maxImages;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('TmMediaImagesService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            'TmMediaService',
            App.services.TmMediaImages
        ]);

}(window.angular));
