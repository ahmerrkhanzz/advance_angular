(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.TmMediaVideos = function(
        $scope,
        constants,
        TmProfileFactory,
        NotifierFactory,
        TmMediaVideosService,
        TmMediaService,
        ModalService,
        $filter,
        orderBy,
        WatchService
    ) {
        var controller = this;
        controller.devMode = constants.dev;
        TmMediaVideosService.coreId = 0;
        $scope.videoItems = [];
        $scope.itemVideo = {};
        $scope.displayLocationDeletePopup = true;
        $scope.type = TmMediaService.typeOverview();

        TmMediaVideosService.setType(TmMediaService.typeOverview());
        TmMediaVideosService.setSelectedVideo(TmMediaVideosService.getItemVideo());
        WatchService.create($scope, TmProfileFactory.getData, function(newValue) {
            if (newValue !== null) {
                angular.copy(newValue.videos, $scope.videoItems);
                TmMediaVideosService.coreId = newValue.id;
                TmMediaVideosService.setVideoItems($scope.videoItems);
                $scope.filteredVideoItems = $filter('filter')($scope.videoItems, { master: true });
                $scope.filteredVideoItems = orderBy($scope.filteredVideoItems, 'orderType.' + $scope.type, false);
            }
        });


        WatchService.create($scope, TmMediaVideosService.getVideoItems, function(newValue, oldValue) {
            if (!angular.equals(oldValue, newValue)) {
                $scope.videoItems = newValue;
            }
        });

        WatchService.create($scope, TmMediaVideosService.getTriggerChange, function() {
            var selectedVideo = TmMediaVideosService.getSelectedVideo();
            if (
                ($scope.type === 'ug' && selectedVideo.ug) ||
                (!selectedVideo.master && selectedVideo.ug && !selectedVideo.pg) ||
                (!selectedVideo.master && selectedVideo.ug && selectedVideo.pg && ($scope.type === 'ug' || $scope.type === 'master'))
            ) {
                $scope.filter('ug');
            } else if (($scope.type === 'pg' && selectedVideo.pg) || (!selectedVideo.master && !selectedVideo.ug && selectedVideo.pg)) {
                $scope.filter('pg');
            } else {
                $scope.filter('master');
            }
            angular.forEach($scope.videoItems, function(value, key) {
                if (selectedVideo.id === value.id) {
                    $scope.videoItems[key] = selectedVideo;
                }
            });
            $scope.filter($scope.type, true);
        });

        $scope.sortableOptions = {
            disabled: false,
            'ui-floating': false,
            start: function() {
                controller.initialList = [];
                angular.copy($scope.filteredVideoItems, controller.initialList);
            },
            update: function(e, ui) {
                var validateItems = TmMediaService.validateTypes($scope.videoItems);
                if (true !== validateItems) {
                    ui.item.sortable.cancel();
                }
            },
            stop: function() {
                var validateItems = TmMediaService.validateTypes($scope.videoItems);
                if (true === validateItems) {
                    var assignedOrder = 1;
                    // change videos order
                    for (var index = 0; index < $scope.filteredVideoItems.length; index++) {
                        if ($scope.filteredVideoItems[index][$scope.type]) {
                            $scope.filteredVideoItems[index].orderType[$scope.type] = assignedOrder;
                            assignedOrder++;
                        }
                    }

                    $scope.sortableOptions.disabled = false;
                    TmMediaVideosService.saveOrder(TmMediaVideosService.coreId, $scope.videoItems)
                        .then(function(success) {
                            NotifierFactory.show(
                                success ? 'success' : 'error',
                                success ? 'Success!' : 'Failure!',
                                'Video Order Save'
                            );
                            TmMediaVideosService.setSelectedVideo(TmMediaVideosService.getItemVideo());
                        })
                        .finally(function() {
                            $scope.sortableOptions.disabled = false;
                        });
                } else {
                    NotifierFactory.show(
                        'error',
                        'Failure!',
                        'Invalid items in video list'
                    );
                    TmMediaVideosService.setSelectedVideo(validateItems);
                    TmMediaVideosService.displayTypesValid = true;

                    return false;
                }
            }
        };

        /**
         * Filter change.
         *
         * @param type
         */
        $scope.filter = function(type) {
            var validateItems = TmMediaService.validateTypes($scope.videoItems);
            if (true === validateItems) {
                $scope.type = type;
                var params = {};
                params[type] = true;
                $scope.filteredVideoItems = $filter('filter')($scope.videoItems, params);
                $scope.filteredVideoItems = orderBy($scope.filteredVideoItems, 'orderType.' + type, false);
            } else {
                NotifierFactory.show(
                    'error',
                    'Failure!',
                    'Invalid items in video list'
                );
                TmMediaVideosService.setSelectedVideo(validateItems);
                TmMediaVideosService.displayTypesValid = true;

                return false;
            }
        };

        /**
         * Select video.
         *
         * @param {Object} item
         */
        $scope.selectVideo = function(item) {
            item = angular.copy(item);
            // var validateItems = TmMediaService.validateTypes($scope.videoItems);
            TmMediaVideosService.setHasErrors(false);
            $scope.itemVideo = TmMediaVideosService.getItemVideo();
            if (angular.isDefined(item)) {
                TmMediaVideosService.setSelectedVideo(item);
            } else {
                TmMediaVideosService.setHasErrors(false);
                TmMediaVideosService.setHighlighted(true);
                TmMediaVideosService.setSelectedVideo($scope.itemVideo);
            }
            // if (true === validateItems) {
            //     TmMediaVideosService.setHasErrors(false);
            //     TmMediaVideosService.displayTypesValid = false;
            //     $scope.itemVideo = TmMediaVideosService.getItemVideo();
            //     if (angular.isDefined(item)) {
            //         TmMediaVideosService.setSelectedVideo(item);
            //     } else {
            //         TmMediaVideosService.setHasErrors(false);
            //         TmMediaVideosService.setHighlighted(true);
            //         TmMediaVideosService.setSelectedVideo($scope.itemVideo);
            //     }
            // } else {
            //     NotifierFactory.show(
            //         'error',
            //         'Failure!',
            //         'Invalid items in video list'
            //     );
            //     TmMediaVideosService.setSelectedVideo(validateItems);
            //     TmMediaVideosService.displayTypesValid = true;

            //     return false;
            // }
        };

        $scope.selectedItem = function() {
            return TmMediaVideosService.getSelectedVideo();
        };

        /**
         * Delete video.
         *
         * @param item
         */
        $scope.deleteVideo = function(item) {
            var itemName = angular.isDefined(item.name) && item.name !== null ? ': ' + item.name : '';
            var modalOptions = {
                closeButtonText: 'No',
                actionButtonText: 'Yes',
                headerText: 'Delete Video' + itemName + ' ?',
                bodyText: 'Are you sure you wish to delete this video?',
            };
            ModalService.show({}, modalOptions).then(function(result) {
                TmMediaVideosService.deleteVideo(TmMediaVideosService.coreId, item)
                    .then(function(success) {
                        $scope.submitInProgress = false;
                        NotifierFactory.show(
                            success ? 'success' : 'error',
                            success ? 'Success!' : 'Failure!',
                            'Delete Video'
                        );
                        if (success) {
                            TmMediaVideosService.setSelectedVideo(TmMediaVideosService.getItemVideo());
                            $scope.videoItems.splice(TmMediaService.objectSearch($scope.videoItems, item.id), 1);
                            $scope.filteredVideoItems.splice(TmMediaService.objectSearch($scope.filteredVideoItems, item.id), 1);


                            var assignedOrder = 1;
                            for (var index = 0; index < $scope.filteredVideoItems.length; index++) {
                                if ($scope.filteredVideoItems[index][$scope.type]) {
                                    $scope.filteredVideoItems[index].orderType[$scope.type] = assignedOrder;
                                    assignedOrder++;
                                }
                            }
                            $scope.filteredVideoItems = orderBy($scope.filteredVideoItems, 'orderType.' + $scope.type, false);
                        }
                    });
            });
        };

        $scope.typeOverview = function() {
            return TmMediaService.typeOverview();
        };

        $scope.typeUndergraduate = function() {
            return TmMediaService.typeUndergraduate();
        };

        $scope.typePostgraduate = function() {
            return TmMediaService.typePostgraduate();
        };
    };

    angular
        .module('qsHub')
        .controller('TmMediaVideosController', [
            '$scope',
            'constants',
            'TmProfileFactory',
            'NotifierFactory',
            'TmMediaVideosService',
            'TmMediaService',
            'ModalService',
            '$filter',
            'orderByFilter',
            'WatchService',
            App.controllers.TmMediaVideos
        ]);

}(window.angular));
