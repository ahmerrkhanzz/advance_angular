(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.TuMediaVideosSidebar = function (
        $scope,
        $resource,
        $location,
        $timeout,
        constants,
        NotifierFactory,
        TuProfileFactory,
        TuMediaVideosService,
        TuMediaService,
        WebSocketsService,
        UrlService,
        WatchService,
        ObjectService
    ) {
        var controller = this,
            alreadyInitialised = false;
        $scope.hasErrors = true;
        TuMediaVideosService.displayTypesValid = false;
        TuMediaVideosService.setHasErrors(false);
        $scope.youtubeUrlPattern = UrlService.getYoutubePattern();

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

        /**
         * Save form.
         *
         * @param item
         * @returns {boolean}
         */
        $scope.saveVideoForm = function (item) {
            if (!angular.isDefined(item.url) || !(angular.isDefined(item.url) && item.url.length > 0)) {
                $scope.setHasErrors(true);
            }
            if (!TuMediaService.isValidType(item)) {
                TuMediaVideosService.displayTypesValid = true;
            }
            if (TuMediaVideosService.displayTypesValid || $scope.getHasErrors()) {
                return false;
            }
            if (
                !$scope.forms.formVideo ||
                !$scope.forms.formVideo.$valid
            ) {
                TuMediaVideosService.setHasErrors(true);
                return false;
            }
            var videoItem = angular.copy(item);
            TuMediaVideosService.displayTypesValid = false;
            TuMediaVideosService.setHasErrors(false);
            var actionName = 'Added';
            if (videoItem.id.length > 0) {
                actionName = 'Updated';
            }
            if ($scope.submitInProgress || !$scope.forms.formVideo || !$scope.forms.formVideo.$valid
            ) {
                NotifierFactory.show(
                    'error',
                    'Error: Please fill in all required fields',
                    actionName + ' Video'
                );

                return false;
            }
            $scope.submitInProgress = true;

            // Update video and title to default while retrieving data from youtube
            var currentVideos = TuProfileFactory.getMediaVideos();
            for (var i = 0; i < currentVideos.length; i++) {
                if (item.id === currentVideos[i].id) {
                    currentVideos[i].name = null;
                    currentVideos[i].imageUrl = null;
                }
            }

            // start listening (open a room) to youtube video details changes
            var youtubeId = UrlService.extractYoutubeIdFromUrl(item.url);
            WebSocketsService.subscribe(youtubeId, 'VideoDetails' + youtubeId, function (response) {
                item.name = response && response.name || null;
                item.imageUrl = response && response.imageUrl || null;
                // mark as selected on the left side
                $scope.selectedVideo = angular.copy(TuMediaVideosService.getSelectedVideo());
            });
            TuMediaVideosService.saveVideo(TuMediaVideosService.coreId, videoItem)
                .then(function (success) {
                    $scope.submitInProgress = false;
                    NotifierFactory.show(
                        success ? 'success' : 'error',
                        success ? 'Successfully!' : 'Failure!',
                        'Video ' + actionName
                    );
                    if (success) {
                        if (videoItem.id.length === 0) {
                            item.id = success;
                            // add to the list
                            TuMediaVideosService.getVideoItems().unshift(item);
                            // mark as selected list
                            TuMediaVideosService.setSelectedVideo(item);
                            // mark as selected on the left side
                            $scope.selectedVideo = angular.copy(TuMediaVideosService.getSelectedVideo());
                        }
                        // mark as selected list
                        TuMediaVideosService.setSelectedVideo(item);
                        TuMediaVideosService.setHasErrors(false);
                    }
                    /**
                     * Tell other controllers to apply filter on changes
                     */
                    TuMediaVideosService.setTriggerChange(Math.random());
                });
        };

        /**
         * Clear item.
         *
         * @param item
         */
        $scope.clearVideoForm = function (item) {
            if (angular.isDefined(item)) {
                $scope.itemVideo = item;
            } else {
                $scope.itemVideo = TuMediaVideosService.getItemVideo();
            }

            $scope.itemVideo = TuMediaVideosService.resetItem($scope.itemVideo);
            TuMediaVideosService.setSelectedVideo($scope.itemVideo);
            $scope.setDisplayTypesValidation(false);
            $scope.setHasErrors(false);
        };

        /**
         * Get selected item.
         *
         * @returns {*}
         */
        $scope.getSelectedVideo = function () {
            return TuMediaVideosService.getSelectedVideo();
        };

        /**
         * Is edit mode?
         *
         * @returns {boolean}
         */
        $scope.isEditMode = function () {
            return $scope.selectedVideo && $scope.selectedVideo.id ? true : false;
        };

        /**
         * Get video items.
         *
         * @returns {*}
         */
        $scope.getVideoItems = function () {
            return TuMediaVideosService.getVideoItems();
        };

        /**
         * Get has errors flag.
         *
         * @returns {boolean|*}
         */
        $scope.getHasErrors = function () {
            return TuMediaVideosService.getHasErrors();
        };

        $scope.setHasErrors = function (value) {
            TuMediaVideosService.setHasErrors(value);
        };

        $scope.type = function () {
            return TuMediaVideosService.getType();
        };

        $scope.setDisplayTypesValidation = function (value) {
            TuMediaVideosService.displayTypesValid = value;
        };

        $scope.getDisplayTypesValidation = function () {
            return TuMediaVideosService.displayTypesValid;
        };

        controller.initWatches = function () {
            WatchService.create($scope, TuMediaVideosService.getSelectedVideo, function (selectedVideo) {
                $scope.selectedVideo = selectedVideo;
                $scope.selectedVideoBeforeChanges = angular.copy($scope.selectedVideo);
            });
            WatchService.create($scope, TuMediaVideosService.getHasErrors, function (newValue, oldValue) {
                if (!angular.equals(oldValue, newValue)) {
                    $scope.hasErrors = newValue;
                }
            });

            WatchService.create($scope, TuMediaVideosService.getHighlighted, function (newValue) {
                if (newValue) {
                    $scope.isHighlighted = newValue;
                    $timeout(function () {
                        TuMediaVideosService.setHighlighted(false);
                        $scope.isHighlighted = false;
                    }, 200);
                }
            });

            WatchService.create($scope, TuProfileFactory.getSelectedMediaTabId, function (tabId) {
                if (tabId === 2) {
                    // restore data on tab type switch
                    if (typeof $scope.selectedVideoBeforeChanges !== 'undefined') {
                        $scope.selectedVideo = angular.copy($scope.selectedVideoBeforeChanges);
                    }
                    $timeout(function () {
                        TuMediaVideosService.setHighlighted(true);
                    }, 200);
                } else {
                    delete TuMediaVideosService.displayTypesValid;
                    $scope.setHasErrors(false);
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
        .controller('TuMediaVideosSidebarController', [
            '$scope',
            '$resource',
            '$location',
            '$timeout',
            'constants',
            'NotifierFactory',
            'TuProfileFactory',
            'TuMediaVideosService',
            'TuMediaService',
            'WebSocketsService',
            'UrlService',
            'WatchService',
            'ObjectService',
            App.controllers.TuMediaVideosSidebar
        ]);

} (window.angular));