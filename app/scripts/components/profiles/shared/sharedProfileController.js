(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.sharedProfile = function (
        $scope,
        $location, 
        $log,
        $state,
        constants, 
        SharedProfileService,
        SharedProfileFactory,
        InstitutionFactory,
        UserFactory,
        WatchService
    ) {
        var controller = this;
        controller.devMode = constants.dev;

        $scope.loadInProgress = true;
        $scope.generalHistoryDisabled = false;
        $scope.fetchingHistory = false;
        $scope.showGeneralHistoryBlock = false;
        SharedProfileFactory.setCampusFormVisibility(false);
        $scope.showCampusForm = SharedProfileFactory.isCampusFormVisible();
        $scope.activeTab = SharedProfileFactory.getActiveTabs().general;
        controller.historyLog = {
            totalReturned: 0,
            total: 0
        };

        /**
         * Request history log from service.
         */
        controller.loadHistoryLog = function () {
            $scope.fetchingHistory = false;
            $scope.generalHistoryDisabled = true;
            if (!SharedProfileFactory.isLoadMoreInProgress()) {
                $scope.fetchingHistory = true;
            }
            SharedProfileService.getGeneralHistory(SharedProfileFactory.getId(), true, SharedProfileFactory.getLogLimit()).then(function (data) {
                $scope.generalHistoryDisabled = false;
                $scope.fetchingHistory = false;
                $scope.showGeneralHistoryBlock = true;
                $scope.generalHistoryLog = data.results;
                controller.historyLog.total = data.totalMatching;
                controller.historyLog.totalReturned = data.totalFiltered;
                SharedProfileFactory.setLoadMoreInProgress(false);
            });
        };

        /**
         * Handle history log load more click.
         */
        controller.handleLoadMoreHistoryLog = function() {
            SharedProfileFactory.setLogLimit(SharedProfileFactory.getLogLimit()+5);
            SharedProfileFactory.setLoadMoreInProgress(true);
            controller.loadHistoryLog();
        };

        /**
         * Get status of loading more history log .
         *
         * @returns {bool}
         */
        controller.fetchingMoreHistoryLog = function () {
            return SharedProfileFactory.isLoadMoreInProgress();
        };

        /**
         * Actions to do when general history log is activated.
         */
        $scope.handleHistoryLogClick = function () {
            $scope.handleGeneralHistoryCloseClick();
            if ($scope.showGeneralHistoryBlock) {
                controller.loadHistoryLog();
            }
        };

        $scope.isGeneralTabActive = function () {
            return SharedProfileFactory.isGeneralTabSelected();
        };

        $scope.isCampusesTabActive = function () {
            return SharedProfileFactory.isCampusesTabSelected();
        };

        $scope.isRightSidePanelActive = function () {
            // general tab is active
            if (SharedProfileFactory.isGeneralTabSelected() && $scope.showGeneralHistoryBlock) {
                return true;
            }
            // campus tab is active
            if (SharedProfileFactory.isCampusesTabSelected() && $scope.showCampusForm) {
                return true;
            }
        };

        /**
         * Actions to do when general history log is closed.
         */
        $scope.handleGeneralHistoryCloseClick = function () {
            SharedProfileFactory.setLogLimit(1);
            $scope.generalHistoryLog = {};
            $scope.showGeneralHistoryBlock = !$scope.showGeneralHistoryBlock;
        };

        controller.handleHistoryLogVisibility = function() {
            return SharedProfileFactory.getLogLimit() < controller.historyLog.total;
        };

        controller.initWatches = function () {
            // listen to active profile tab changes
            WatchService.create($scope, 'activeTab', function (newValue, oldValue) {
                if (!SharedProfileFactory.hasSelectedTab() || !angular.equals(newValue, oldValue)) {
                    SharedProfileFactory.setSelectedTabId(newValue);
                }
            });

            // watch for core ID changes
            WatchService.create($scope, InstitutionFactory.getCoreId, function (coreId) {
                if (!coreId) {
                    return false;
                }
                $scope.loadInProgress = true;
                if (!UserFactory.noAccess($state.current.name)) {
                    // load institution's shared profile by Core ID
                    SharedProfileService.getSharedProfile(coreId).then(function (data) {
                        $scope.loadInProgress = false;
                        // set shared profile for system wide use
                        SharedProfileFactory.setData(data);

                        $scope.sharedProfile = data;
                        $scope.showGeneralHistoryBlock = false;
                        $scope.$broadcast(constants.events.institutionSharedProfileChanges);
                    });
                } else {
                    // if user doesn't have access, empty previously loaded data
                    $scope.loadInProgress = false;
                    SharedProfileFactory.setData(null);
                }
            });

            // watch for campus form visibility changes
            WatchService.create($scope, SharedProfileFactory.isCampusFormVisible, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.showCampusForm = newValue;
                }
            });
        };

        controller.init = function () {
            controller.initWatches();
        };

        controller.init();
    };

    angular
        .module('qsHub')
        .controller('SharedProfileController', [
            '$scope',
            '$location',
            '$log',
            '$state',
            'constants',
            'SharedProfileService',
            'SharedProfileFactory',
            'InstitutionFactory',
            'UserFactory',
            'WatchService',
            App.controllers.sharedProfile
        ]);

}(window.angular));
