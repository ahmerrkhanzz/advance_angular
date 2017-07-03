(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services: {}});

    App.services.TuMediaVideosService = function (
        $resource,
        $q,
        $log,
        constants,
        TuMediaService,
        TuProfileFactory
    ) {
        var service = {
            triggerChange: null,
            selectedVideo: null
        };

        service.getVideoModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tu-profile/:id/video/:videoId', null, {
                update: {method: 'PATCH'}
            });
        };

        service.getVideosOrderingModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tu-profile/:id/videosOrder', null, {
                update: {method: 'PATCH'}
            });
        };

        /**
         * Save Video
         *
         * @param institutionId
         * @param video
         * @returns {*}
         */
        service.saveVideo = function (institutionId, video) {
            var videoModel = service.getVideoModel(),
                videoSubmit = service.formatVideo(video);
            if (angular.isDefined(videoSubmit.id) && videoSubmit.id.length > 0) {
                // update video
                return videoModel.update(
                    {id: institutionId, videoId: video.id},
                    {
                        url: videoSubmit.url,
                        orderType: videoSubmit.orderType,
                        assignedTo: videoSubmit.assignedTo
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
                // create new video
                return videoModel.save(
                    {id: institutionId, videoId: videoSubmit.id},
                    {
                        url: videoSubmit.url,
                        orderType: videoSubmit.orderType,
                        assignedTo: videoSubmit.assignedTo
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
         * Save video order.
         *
         * @param {string} id - Institution TU profile mongo ID
         * @param {Object} videos
         * @returns {Promise}
         */
        service.saveOrder = function (id, videos) {
            var institutionModel = service.getVideosOrderingModel();
            return institutionModel.update(
                {id: id},
                {
                    'videos': service.formatForOrdering(videos)
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
         * Delete video.
         *
         * @param institutionId
         * @param video
         * @returns {*}
         */
        service.deleteVideo = function (institutionId, video) {
            service.setHasErrors(false);
            var videoModel = service.getVideoModel();
            return videoModel.delete(
                {id: institutionId, videoId: video.id}
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
         * Set selected video.
         *
         * @param {Object} item
         */
        service.setSelectedVideo = function (item) {
            service.selectedVideo = item;

        };

        /**
         * Get selected video
         *
         * @returns {Obejct|null}
         */
        service.getSelectedVideo = function () {
            return service.selectedVideo;
        };

        /**
         * Trigger filter.
         *
         * @param {float} triggerChange
         */
        service.setTriggerChange = function (triggerChange) {
            service.triggerChange = parseFloat(triggerChange);
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
         * Set video items.
         *
         * @param items
         * @param transform
         */
        service.setVideoItems = function (items, transform) {
            if (!angular.isDefined(transform)) {
                transform = true;
            }
            var typeUg = TuMediaService.typeUndergraduate(),
                typePg = TuMediaService.typePostgraduate(),
                typeMaster = TuMediaService.typeOverview();
            if (transform) {
                angular.forEach(items, function (value, key) {
                    items[key][typeMaster] = false;
                    items[key][typeUg] = false;
                    items[key][typePg] = false;
                    angular.forEach(items[key].assignedTo, function (aValue) {
                        if (aValue === typeMaster) {
                            items[key][typeMaster] = true;
                        } else if (aValue === typeUg) {
                            items[key][typeUg] = true;
                        } else if (aValue === typePg) {
                            items[key][typePg] = true;
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
                        if (angular.isDefined(items[key].orderType[typeMaster])) {
                            orderOverview = items[key].orderType[typeMaster];
                        }
                        if (angular.isDefined(items[key].orderType[typeUg])) {
                            orderUndergraduate = items[key].orderType[typeUg];
                        }
                        if (angular.isDefined(items[key].orderType[typePg])) {
                            orderPostgraduate = items[key].orderType[typePg];
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

            TuProfileFactory.setMediaVideos(items);
            service.videoItems = items;
        };

        /**
         * Get video items.
         *
         * @returns {*}
         */
        service.getVideoItems = function () {
            return service.videoItems;
        };

        /**
         * Get video item.
         */
        service.getItemVideo = function () {
            var orderTypes = {};
            orderTypes[TuMediaService.typeOverview()] = 0;
            orderTypes[TuMediaService.typeUndergraduate()] = 0;
            orderTypes[TuMediaService.typePostgraduate()] = 0;
            return {
                'id': '',
                'name': '',
                'description': '',
                'master': true,
                'ug': true,
                'pg': true,
                'orderType': orderTypes,
                'url': '',
                'imageUrl': null
            };
        };

        /**
         * Reset video item.
         *
         * @param item
         * @returns {*}
         */
        service.resetItem = function (item) {
            item.master = true;
            item.ug = true;
            item.pg = true;
            item.url = '';
            item.name = '';
            item.imageUrl = null;

            return item;
        };

        /**
         * Format videos.
         *
         * @param videos
         * @returns {*}
         */
        service.formatVideos = function (videos) {
            angular.forEach(videos, function (value, key) {
                videos[key] = service.formatVideo(value);
            });

            return videos;
        };

        /**
         * Format to match db data.
         *
         * @param {Object} video
         * @returns {Object}
         */
        service.formatVideo = function (video) {
            video.assignedTo = [];
            if (video.master) {
                video.assignedTo.push('master');
            }
            if (video.ug) {
                video.assignedTo.push('ug');
            }
            if (video.pg) {
                video.assignedTo.push('pg');
            }
            // remove data we don't want to send.
            if (angular.isDefined(video.id) && parseInt(video.id, 10) === 0) {
                delete video.id;
            }
            delete video.master;
            delete video.ug;
            delete video.pg;
            delete video.order;

            return video;
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

        return service;
    };

    angular
        .module('qsHub')
        .service('TuMediaVideosService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            'TuMediaService',
            'TuProfileFactory',
            App.services.TuMediaVideosService
        ]);

}(window.angular));
