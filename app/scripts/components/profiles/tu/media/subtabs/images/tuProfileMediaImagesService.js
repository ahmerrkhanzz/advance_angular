(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services: {}});

    App.services.TuMediaImagesService = function ($resource, $q, $log, constants, TuMediaService) {
        var service = {
                triggerChange: 0
            },
            maxImages = 48;
        service.getImageModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tu-profile/:id/image/:imageId', null, {
                update: {method: 'PATCH'}
            });
        };

        service.getImagesOrderingModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tu-profile/:id/imagesOrder', null, {
                update: {method: 'PATCH'}
            });
        };

        /**
         * Save Image
         *
         * @param institutionId
         * @param image
         * @returns {*}
         */
        service.saveImage = function (institutionId, image) {
            var imageModel = service.getImageModel(),
                imageSubmit = service.formatImage(image);
            if (angular.isDefined(imageSubmit.id) && imageSubmit.id !== 'temporary') {
                // update image
                return imageModel.update(
                    {id: institutionId, imageId: image.id},
                    {
                        name: imageSubmit.name,
                        description: imageSubmit.description,
                        thumbnailUrl: imageSubmit.thumbnailUrl,
                        url: imageSubmit.url,
                        orderType: imageSubmit.orderType,
                        assignedTo: imageSubmit.assignedTo
                    }
                ).$promise.then(function (data) {
                    if (constants.dev) {
                        $log.log('success, got data: ', data);
                    }
                    return true;
                }, function (error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                    }
                    return false;
                });
            } else {
                // create new image
                return imageModel.save(
                    {id: institutionId},
                    {
                        name: imageSubmit.name,
                        description: imageSubmit.description,
                        url: imageSubmit.url,
                        orderType: imageSubmit.orderType,
                        assignedTo: imageSubmit.assignedTo
                    }
                ).$promise.then(function (data) {
                    if (constants.dev) {
                        $log.log('success, got data: ', data);
                    }
                    return data.insertedId;
                }, function (error) {
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
        service.saveOrder = function (id, images) {
            var institutionModel = service.getImagesOrderingModel();
            return institutionModel.update(
                {id: id},
                {
                    'images': service.formatForOrdering(images)
                }
            ).$promise.then(function (data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return true;
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return false;
            });
        };

        service.formatForOrdering = function (items) {
            var formattedItems = [];
            angular.forEach(items, function (item) {
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
        service.deleteImage = function (institutionId, image) {
            service.setHasErrors(false);
            var imageModel = service.getImageModel();
            return imageModel.delete(
                {id: institutionId, imageId: image.id}
            ).$promise.then(function (data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return true;
            }, function (error) {
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
        service.setImageUploadingInProgress = function (value) {
            service.imageUploadingInProgress = value;
        };


        /**
         * Get Image Uploading in progress.
         *
         * @return {Boolean}
         */
        service.getImageUploadingInProgress = function () {
            return service.imageUploadingInProgress;
        };

        /**
         * Set selected image.
         *
         * @param item
         */
        service.setSelectedImage = function (item) {
            service.selectedImage = item;
        };

        /**
         * Get selected image
         *
         * @returns {*}
         */
        service.getSelectedImage = function () {
            return service.selectedImage;
        };

        /**
         * Trigger filter.
         *
         * @param triggerChange
         */
        service.setTriggerChange = function (triggerChange) {
            service.triggerChange = triggerChange;
        };

        /**
         * Get trigger filter value
         *
         * @returns {*}
         */
        service.getTriggerChange = function () {
            return service.triggerChange;
        };

        /**
         * Set image items.
         *
         * @param items
         * @param transform
         */
        service.setImageItems = function (items, transform) {
            if (!angular.isDefined(transform)) {
                transform = true;
            }
            if (transform) {
                angular.forEach(items, function (value, key) {
                    items[key][TuMediaService.typeOverview()] = false;
                    items[key][TuMediaService.typeUndergraduate()] = false;
                    items[key][TuMediaService.typePostgraduate()] = false;
                    angular.forEach(items[key].assignedTo, function (aValue) {
                        if (aValue === TuMediaService.typeOverview()) {
                            items[key][TuMediaService.typeOverview()] = true;
                        } else if (aValue === TuMediaService.typeUndergraduate()) {
                            items[key][TuMediaService.typeUndergraduate()] = true;
                        } else if (aValue === TuMediaService.typePostgraduate()) {
                            items[key][TuMediaService.typePostgraduate()] = true;
                        }
                    });
                    /**
                     * Set initial order
                     * @type {{master: number, ug: number, pg: number}}
                     */
                    if (items[key].orderType === null) {
                        items[key].orderType = {
                            'master': 0,
                            'ug': 0,
                            'pg': 0
                        };
                    }
                    var orderOverview = 0;
                    var orderUndergraduate = 0;
                    var orderPostgraduate = 0;
                    if (angular.isDefined(items[key].orderType)) {
                        if (angular.isDefined(items[key].orderType[TuMediaService.typeOverview()])) {
                            orderOverview = items[key].orderType[TuMediaService.typeOverview()];
                        }
                        if (angular.isDefined(items[key].orderType[TuMediaService.typeUndergraduate()])) {
                            orderUndergraduate = items[key].orderType[TuMediaService.typeUndergraduate()];
                        }
                        if (angular.isDefined(items[key].orderType[TuMediaService.typePostgraduate()])) {
                            orderPostgraduate = items[key].orderType[TuMediaService.typePostgraduate()];
                        }
                    }
                    items[key].orderType = {
                        'master': orderOverview,
                        'ug': orderUndergraduate,
                        'pg': orderPostgraduate
                    };
                    if (angular.isDefined(items[key]._id)) {
                        items[key].id = items[key]._id;
                    }
                    delete items[key].assignedTo;
                    delete items[key]._id;
                });
            }

            service.imageItems = items;
        };

        /**
         * Get image items.
         *
         * @returns {*}
         */
        service.getImageItems = function () {
            return service.imageItems;
        };

        /**
         * Get image item.
         * @param {int} defaultValue
         */
        service.getItemImage = function (defaultValue) {
            if (angular.isUndefined(defaultValue)) {
                defaultValue = 0;
            }
            var orderTypes = {};
            orderTypes[TuMediaService.typeOverview()] = defaultValue;
            orderTypes[TuMediaService.typeUndergraduate()] = defaultValue;
            orderTypes[TuMediaService.typePostgraduate()] = defaultValue;

            return {
                'id': '',
                'name': '',
                'description': '',
                'master': true,
                'ug': true,
                'pg': true,
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
        service.resetItem = function (item) {
            item.master = true;
            item.ug = true;
            item.pg = true;
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
        service.formatImages = function (images) {
            angular.forEach(images, function (value, key) {
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
        service.formatImage = function (image) {
            image.assignedTo = [];
            if (image.master) {
                image.assignedTo.push('master');
            }
            if (image.ug) {
                image.assignedTo.push('ug');
            }
            if (image.pg) {
                image.assignedTo.push('pg');
            }
            // remove data we don't want to send.
            if (angular.isDefined(image.id) && parseInt(image.id, 10) === 0) {
                delete image.id;
            }
            delete image.master;
            delete image.ug;
            delete image.pg;
            delete image.order;

            return image;
        };

        /**
         * Sets has errors flag.
         *
         * @param {boolean} hasErrors
         */
        service.setHasErrors = function (hasErrors) {
            service.hasErrors = hasErrors;
        };

        /**
         * Gets has errors flag.
         *
         * @returns {boolean|*}
         */
        service.getHasErrors = function () {
            return service.hasErrors;
        };

        /**
         * Sets is highlighted.
         *
         * @param {boolean} isHighlighted
         */
        service.setHighlighted = function (isHighlighted) {
            service.isHighlighted = isHighlighted;
        };

        /**
         * Gets is Highlighted.
         *
         * @returns {boolean|*}
         */
        service.getHighlighted = function () {
            return service.isHighlighted;
        };

        service.coreId = function (coreId) {
            service.coreId = coreId;
        };

        /**
         * Set type.
         *
         * @returns {*}
         */
        service.setType = function (type) {
            service.type = type;
        };

        /**
         * Get type.
         *
         * @returns {*}
         */
        service.getType = function () {
            return service.type;
        };

        /**
         * Replace item by item id
         *
         * @param key
         */
        service.replaceByKey = function (key) {
            angular.forEach(service.getImageItems(), function(itemValue, itemKey) {
                if(itemValue.id === key) {
                    service.getImageItems()[itemKey] = service.getSelectedImage();
                }
            });
        };

        /**
         * Trigger filter.
         *
         * @param triggerChange
         */
        service.setTriggerReset = function (triggerChange) {
            service.triggerChange = triggerChange;
        };

        service.getTriggerReset = function () {
            return service.triggerChange;
        };

        /**
         * UploadedImagesCount object, contains {master:count, ug: count, pg: count}
         *
         * @param {Object} uploadedImagesCount
         */
        service.setUploadedImagesCount = function (uploadedImagesCount) {
            service.uploadedImagesCount = uploadedImagesCount;
        };

        service.getUploadedImagesCount = function () {
            return service.uploadedImagesCount;
        };

        service.getMaxImages = function () {
            return maxImages;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('TuMediaImagesService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            'TuMediaService',
            App.services.TuMediaImagesService
        ]);

}(window.angular));
