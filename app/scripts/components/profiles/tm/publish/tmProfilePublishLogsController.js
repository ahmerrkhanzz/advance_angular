(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.tmProfilePublishLogs = function (
        $scope,
        $state,
        PublishService,
        InstitutionFactory,
        TmProfileFactory,
        TmProfileHistoryLogFactory,
        UserFactory,
        WatchService
    ) {
        var controller = this,
            alreadyInitialised = false;

        /**
         * Get TM logs
         */
        controller.updatePublishLogs = function () {
            PublishService.getPublishLogs(InstitutionFactory.getId()).then(function (response) {
                $scope.publishLogs = response;
            });
        };

        /**
         * Get status of fetching TM logs
         */
        $scope.fetchingPublishLog = function () {
            return false;
        };

        /**
         * Init watches
         */
        controller.initWatches = function () {
            // watch for active institution changes
            WatchService.create($scope, InstitutionFactory.getData, function (newValue) {
                if (newValue) {
                    if (InstitutionFactory.isTmSubscribed() && !UserFactory.noAccess($state.current.name)) {
                        controller.updatePublishLogs();
                    } else {
                        $scope.publishLogs = null;
                    }
                }
            });

            WatchService.create($scope, TmProfileHistoryLogFactory.isReloadRequired, function (newValue) {
                if (newValue) {
                    if (InstitutionFactory.isTmSubscribed() && !UserFactory.noAccess($state.current.name)) {
                        TmProfileHistoryLogFactory.setReload(false);
                        controller.updatePublishLogs();
                    } else {
                        $scope.publishLogs = null;
                    }
                }
            });

            WatchService.create($scope, PublishService.getStatus, function(value) {
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
        WatchService.create($scope, TmProfileFactory.isPublishTabSelected, function (isActive, wasActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TmProfilePublishLogsController', [
            '$scope',
            '$state',
            'TmProfilePublishService',
            'InstitutionFactory',
            'TmProfileFactory',
            'TmProfileHistoryLogFactory',
            'UserFactory',
            'WatchService',
            App.controllers.tmProfilePublishLogs
        ]);

}(window.angular));
