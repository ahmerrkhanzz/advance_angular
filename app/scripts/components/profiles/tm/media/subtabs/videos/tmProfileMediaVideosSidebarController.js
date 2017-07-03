(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.TmMediaVideosSidebar = function(
        $scope,
        $resource,
        $location,
        $timeout,
        constants,
        NotifierFactory,
        TmProfileFactory,
        TmMediaVideosService,
        TmMediaService,
        WebSocketsService,
        UrlService,
        WatchService,
        ObjectService
    ) {
        var controller = this,
            alreadyInitialised = false;
        $scope.hasErrors = true;
        TmMediaVideosService.displayTypesValid = false;
        TmMediaVideosService.setHasErrors(false);
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
        $scope.saveVideoForm = function(item) {
            if (!angular.isDefined(item.url) || !(angular.isDefined(item.url) && item.url.length > 0)) {
                $scope.setHasErrors(true);
            }
            if (!TmMediaService.isValidType(item)) {
                TmMediaVideosService.displayTypesValid = true;
            }
            if (TmMediaVideosService.displayTypesValid || $scope.getHasErrors()) {
                return false;
            }

            if (!$scope.forms.formVideo ||
                !$scope.forms.formVideo.$valid
            ) {
                TmMediaVideosService.setHasErrors(true);
                return false;
            }
            var videoItem = angular.copy(item);
            TmMediaVideosService.displayTypesValid = false;
            TmMediaVideosService.setHasErrors(false);
            var actionName = 'Added';
            if (videoItem.id.length > 0) {
                actionName = 'Updated';
            }
            if ($scope.submitInProgress || !$scope.forms.formVideo || !$scope.forms.formVideo.$valid) {
                NotifierFactory.show(
                    'error',
                    'Error: Please fill in all required fields',
                    actionName + ' Video'
                );

                return false;
            }
            $scope.submitInProgress = true;

            // start listening (open a room) to youtube video details changes
            var youtubeId = UrlService.extractYoutubeIdFromUrl(item.url);
            WebSocketsService.subscribe(youtubeId, 'VideoDetails' + youtubeId, function (response) {
                item.name = response && response.name || null;
                item.imageUrl = response && response.imageUrl || null;
                // mark as selected on the left side
                $scope.selectedVideo = angular.copy(TmMediaVideosService.getSelectedVideo());
            });

            TmMediaVideosService.saveVideo(TmMediaVideosService.getCoreId(), videoItem)
                .then(function(success) {
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
                            TmMediaVideosService.getVideoItems().unshift(item);
                            // mark as selected list
                            TmMediaVideosService.setSelectedVideo(item);
                            // mark as selected on the left side
                            $scope.selectedVideo = angular.copy(TmMediaVideosService.getSelectedVideo());
                        }
                        // mark as selected list
                        TmMediaVideosService.setSelectedVideo(item);
                        TmMediaVideosService.setHasErrors(false);
                    }
                    /**
                     * Tell other controllers to apply filter on changes
                     */
                    TmMediaVideosService.setTriggerChange(Math.random());
                });
        };

        /**
         * Clear item.
         *
         * @param item
         */
        $scope.clearVideoForm = function(item) {
            if (angular.isDefined(item)) {
                $scope.itemVideo = item;
            } else {
                $scope.itemVideo = TmMediaVideosService.getItemVideo();
            }

            $scope.itemVideo = TmMediaVideosService.resetItem($scope.itemVideo);
            TmMediaVideosService.setSelectedVideo($scope.itemVideo);
            $scope.setDisplayTypesValidation(false);
            $scope.setHasErrors(false);
        };

        /**
         * Get selected item.
         *
         * @returns {*}
         */
        $scope.getSelectedVideo = function() {
            return TmMediaVideosService.getSelectedVideo();
        };

        /**
         * Is edit mode?
         *
         * @returns {boolean}
         */
        $scope.isEditMode = function() {
            return $scope.selectedVideo && $scope.selectedVideo.id ? true : false;
        };

        /**
         * Get video items.
         *
         * @returns {*}
         */
        $scope.getVideoItems = function() {
            return TmMediaVideosService.getVideoItems();
        };

        /**
         * Get has errors flag.
         *
         * @returns {boolean|*}
         */
        $scope.getHasErrors = function() {
            return TmMediaVideosService.getHasErrors();
        };

        $scope.setHasErrors = function(value) {
            TmMediaVideosService.setHasErrors(value);
        };

        $scope.type = function() {
            return TmMediaVideosService.getType();
        };

        $scope.setDisplayTypesValidation = function(value) {
            TmMediaVideosService.displayTypesValid = value;
        };

        $scope.getDisplayTypesValidation = function() {
            return TmMediaVideosService.displayTypesValid;
        };

        controller.initWatches = function() {
            WatchService.create($scope, TmMediaVideosService.getSelectedVideo, function(selectedVideo) {
                $scope.selectedVideo = selectedVideo;
            });

            WatchService.create($scope, TmMediaVideosService.getHasErrors, function(newValue, oldValue) {
                if (!angular.equals(oldValue, newValue)) {
                    $scope.hasErrors = newValue;
                }
            });

            WatchService.create($scope, TmMediaVideosService.getHighlighted, function(newValue) {
                if (newValue) {
                    $scope.isHighlighted = newValue;
                    $timeout(function() {
                        TmMediaVideosService.setHighlighted(false);
                        $scope.isHighlighted = false;
                    }, 200);
                }
            });

            WatchService.create($scope, TmProfileFactory.getSelectedMediaSubTabId, function(tabId) {
                if (tabId === 2) {
                    $timeout(function() {
                        TmMediaVideosService.setHighlighted(true);
                    }, 200);
                } else {
                    delete TmMediaVideosService.displayTypesValid;
                    $scope.setHasErrors(false);
                }
            });
        };

        controller.init = function() {
            controller.initWatches();
        };

        // listen to videos tab visibility changes
        WatchService.create($scope, TmProfileFactory.isMediaTabSelected,function(isActive, wasActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TmMediaVideosSidebarController', [
            '$scope',
            '$resource',
            '$location',
            '$timeout',
            'constants',
            'NotifierFactory',
            'TmProfileFactory',
            'TmMediaVideosService',
            'TmMediaService',
            'WebSocketsService',
            'UrlService',
            'WatchService',
            'ObjectService',
            App.controllers.TmMediaVideosSidebar
        ]);

}(window.angular));
