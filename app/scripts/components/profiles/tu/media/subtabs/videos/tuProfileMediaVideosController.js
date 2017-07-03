(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers: {}});

    App.controllers.TuMediaVideos = function (
        $scope,
        constants,
        TuProfileFactory,
        NotifierFactory,
        TuMediaVideosService,
        TuMediaService,
        ModalService,
        $filter,
        orderBy,
        WatchService
    ) {
        var controller = this;
        controller.devMode = constants.dev;
        TuMediaVideosService.coreId = 0;
        $scope.videoItems = [];
        $scope.itemVideo = {};
        $scope.displayLocationDeletePopup = true;
        $scope.type = TuMediaService.typeOverview();

        TuMediaVideosService.setType(TuMediaService.typeOverview());
        TuMediaVideosService.setSelectedVideo(TuMediaVideosService.getItemVideo());
        WatchService.create($scope, function () {
            return TuProfileFactory.getData();
        }, function (newValue) {
            if (newValue !== null) {
                angular.copy(newValue.videos, $scope.videoItems);
                TuMediaVideosService.coreId = newValue.id;
                TuMediaVideosService.setVideoItems($scope.videoItems);
                $scope.filteredVideoItems = $filter('filter')($scope.videoItems, {master: true});
                $scope.filteredVideoItems = orderBy($scope.filteredVideoItems, 'orderType.' + $scope.type, false);
                TuMediaVideosService.setSelectedVideo(TuMediaVideosService.getItemVideo());
            }
        });

        WatchService.create($scope, TuMediaVideosService.getVideoItems, function (newValue, oldValue) {
            if (!angular.equals(oldValue, newValue)) {
                $scope.videoItems = newValue;
            }
        });

        WatchService.create($scope, TuMediaVideosService.getTriggerChange, function () {
            var selectedVideo = TuMediaVideosService.getSelectedVideo();
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
            angular.forEach($scope.videoItems, function (value, key) {                
                if (selectedVideo.id === value.id) {
                    $scope.videoItems[key] = selectedVideo;
                }
            });
            $scope.filter($scope.type, true);
        });

        $scope.sortableOptions = {
            disabled: false,
            'ui-floating': false,
            start: function () {
                controller.initialList = [];
                angular.copy($scope.filteredVideoItems, controller.initialList);
            },
            update: function (e, ui) {
                var validateItems = TuMediaService.validateTypes($scope.videoItems);
                if (true !== validateItems) {
                    ui.item.sortable.cancel();
                }
            },
            stop: function () {
                var validateItems = TuMediaService.validateTypes($scope.videoItems);
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
                    TuMediaVideosService.saveOrder(TuMediaVideosService.coreId, $scope.videoItems)
                        .then(function (success) {
                            NotifierFactory.show(
                                success ? 'success' : 'error',
                                success ? 'Success!' : 'Failure!',
                                'Video Order Save'
                            );
                            TuMediaVideosService.setSelectedVideo(TuMediaVideosService.getItemVideo());
                        })
                        .finally(function () {
                            $scope.sortableOptions.disabled = false;
                        });
                } else {
                    NotifierFactory.show(
                        'error',
                        'Failure!',
                        'Invalid items in video list'
                    );
                    TuMediaVideosService.setSelectedVideo(validateItems);
                    TuMediaVideosService.displayTypesValid = true;

                    return false;
                }
            }
        };

        /**
         * Filter change.
         *
         * @param type
         */
        $scope.filter = function (type) {
            var validateItems = TuMediaService.validateTypes($scope.videoItems);
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
                TuMediaVideosService.setSelectedVideo(validateItems);
                TuMediaVideosService.displayTypesValid = true;

                return false;
            }
        };

        /**
         * Select video.
         *
         * @param {Object} item
         */
        $scope.selectVideo = function (item) {
            item = angular.copy(item);
            var validateItems = TuMediaService.validateTypes($scope.videoItems);
            if (true === validateItems) {
                TuMediaVideosService.setHasErrors(false);
                TuMediaVideosService.displayTypesValid = false;
                $scope.itemVideo = TuMediaVideosService.getItemVideo();
                if (angular.isDefined(item)) {
                    TuMediaVideosService.setSelectedVideo(item);
                } else {
                    TuMediaVideosService.setHasErrors(false);
                    TuMediaVideosService.setHighlighted(true);
                    TuMediaVideosService.setSelectedVideo($scope.itemVideo);
                }
            } else {
                NotifierFactory.show(
                    'error',
                    'Failure!',
                    'Invalid items in video list'
                );
                TuMediaVideosService.setSelectedVideo(validateItems);
                TuMediaVideosService.displayTypesValid = true;

                return false;
            }
        };

        $scope.selectedItem = function () {
            return TuMediaVideosService.getSelectedVideo();
        };

        /**
         * Delete video.
         *
         * @param item
         */
        $scope.deleteVideo = function (item) {
            var itemName = angular.isDefined(item.name) && item.name !== null ? ': ' + item.name : '';
            var modalOptions = {
                closeButtonText: 'No',
                actionButtonText: 'Yes',
                headerText: 'Delete Video' + itemName + ' ?',
                bodyText: 'Are you sure you wish to delete this video?',
            };
            ModalService.show({}, modalOptions).then(function (result) {
                TuMediaVideosService.deleteVideo(TuMediaVideosService.coreId, item)
                    .then(function (success) {
                        $scope.submitInProgress = false;
                        NotifierFactory.show(
                            success ? 'success' : 'error',
                            success ? 'Success!' : 'Failure!',
                            'Delete Video'
                        );
                        if (success) {
                            TuMediaVideosService.setSelectedVideo(TuMediaVideosService.getItemVideo());
                            $scope.videoItems.splice(TuMediaService.objectSearch($scope.videoItems, item.id), 1);
                            $scope.filteredVideoItems.splice(TuMediaService.objectSearch($scope.filteredVideoItems, item.id), 1);


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

        $scope.typeOverview = function () {
            return TuMediaService.typeOverview();
        };

        $scope.typeUndergraduate = function () {
            return TuMediaService.typeUndergraduate();
        };

        $scope.typePostgraduate = function () {
            return TuMediaService.typePostgraduate();
        };
    };

    angular
        .module('qsHub')
        .controller('TuMediaVideosController', [
            '$scope',
            'constants',
            'TuProfileFactory',
            'NotifierFactory',
            'TuMediaVideosService',
            'TuMediaService',
            'ModalService',
            '$filter',
            'orderByFilter',
            'WatchService',
            App.controllers.TuMediaVideos
        ]);

}(window.angular));
