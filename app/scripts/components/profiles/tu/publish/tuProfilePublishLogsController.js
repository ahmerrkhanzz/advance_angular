(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.tuProfilePublishLogs = function (
        $scope,
        PublishService,
        InstitutionFactory,
        TuProfileFactory,
        TuProfileHistoryLogFactory,
        WatchService
    ) {
        var controller = this,
            alreadyInitialised = false;

        controller.updatePublishLogs = function () {
            PublishService.getPublishLogs(InstitutionFactory.getId()).then(function (response) {
                $scope.publishLogs = response;
            });
        };

        $scope.fetchingPublishLog = function () {
            return false;
        };
        controller.getPublishStatusMapped = function (status) {
            return PublishService.getPublishStatusMapped(status);
        };

        controller.initWatches = function () {
            // watch for active institution changes
            WatchService.create($scope, InstitutionFactory.getData, function (newValue) {
                if (newValue) {
                    controller.updatePublishLogs();
                }
            });

            WatchService.create($scope, TuProfileHistoryLogFactory.isReloadRequired, function (newValue) {
                if (newValue) {
                    TuProfileHistoryLogFactory.setReload(false);
                    controller.updatePublishLogs();
                }
            });

            WatchService.create($scope, PublishService.getStatus, function (value) {
                if(value){
                    controller.updatePublishLogs();
                }
            });
        };

        /**
         * @constructor
         */
        controller.init = function () {
            controller.initWatches();
        };

        // listen to public tab visibility changes
        WatchService.create($scope, TuProfileFactory.isPublishTabSelected, function (isActive, wasActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TuProfilePublishLogsController', [
            '$scope',
            'TuProfilePublishService',
            'InstitutionFactory',
            'TuProfileFactory',
            'TuProfileHistoryLogFactory',
            'WatchService',
            App.controllers.tuProfilePublishLogs
        ]);

} (window.angular));
