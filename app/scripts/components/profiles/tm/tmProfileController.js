(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.tmProfile = function(
        $scope,
        $rootScope,
        $location,
        $state,
        constants,
        TmProfileService,
        NotifierFactory,
        TmProfileFactory,
        InstitutionFactory,
        UserFactory,
        TuProfileFactory,
        TuProfileService,
        TmProfileProgramsService,
        TmProfileOverviewService,
        TmProfileOverviewHistoryLogFactory,
        WatchService
    ) {
        var controller = this;
        controller.devMode = constants.dev;
        controller.showFaqHistory = false;
        controller.showOverviewHistory = false;
        controller.isLoadMoreHistoryLogsInProgress = false;
        controller.upgradeInProgress = false;
        controller.maxFaqItems = TmProfileOverviewService.maxFaqItems;

        $scope.tmIsAdvanced = false;
        $scope.upgradeEmailsTo = constants.emails.upgradeTm;
        $scope.activeTab = TmProfileFactory.getOverviewTabId();
        $scope.institutionDataLoaded = false;
        $scope.profileDataLoaded = false;
        $scope.tmProfile = {};
        $scope.upgradeRequest = {};
        $scope.upgradeProgramRequest = {};
        $scope.deleteRequest = {};
        $scope.tmProfileBeforeChanges = {};
        $scope.forms = {};
        $scope.showUpgradeForm = false;
        $scope.showHistory = false;
        $scope.showDeleteForm = false;
        $scope.showProgramSubscribeForm = false;

        /**
         * Is all data loaded?
         *
         * @returns {boolean}
         */
        controller.loadInProgress = function() {
            return $scope.institutionDataLoaded && $scope.profileDataLoaded ? false : true;
        };

        // load TU profile data
        controller.loadTmProfileData = function(coreId) {
            TmProfileService.getTmProfileData(coreId).then(function(data) {
                $scope.profileDataLoaded = true;
                $scope.tmProfile = data;
                TmProfileFactory.setData(data);
                $scope.tmProfileBeforeChanges = angular.copy(data);

                $scope.$broadcast(constants.events.institutionTmProfileChanges);
            });
        };

        controller.isRightSidePanelActive = function() {
            // publish tab is active
            if (TmProfileFactory.isPublishTabSelected()) {
                TmProfileFactory.setUpgradeFormVisibility(false);
                return true;
            }
            // upgrade form is visible
            if (
                ($scope.showUpgradeForm || $scope.showUpgradeProgramRequest) &&
                (
                    TmProfileFactory.isOverviewTabSelected() ||
                    TmProfileFactory.isProgramsTabSelected() ||
                    TmProfileFactory.isMediaTabSelected()
                )
            ) {
                return true;
            }
            // overview tab and history block is active
            if (TmProfileFactory.isOverviewTabSelected() && controller.showOverviewHistory) {
                TmProfileFactory.setUpgradeFormVisibility(false);
                return true;
            }

            // FAQ history logs are open under overview tab
            if (TmProfileFactory.isOverviewTabSelected() && controller.showFaqHistory) {
                TmProfileFactory.setUpgradeFormVisibility(false);
                return true;
            }

            // programs tab is active and edit or add form is active
            if (TmProfileFactory.isProgramsTabSelected() && ($scope.showProgramEditForm || $scope.showProgramAddForm)) {
                return true;
            }

            // media tab is active
            if (TmProfileFactory.isMediaTabSelected()) {
                TmProfileFactory.setUpgradeFormVisibility(false);
                return true;
            }
            if (TmProfileFactory.isProgramsTabSelected() && $scope.showDeleteForm) {
                return true;
            }
            return false;
        };

        $scope.isMediaTabActive = function() {
            return TmProfileFactory.isMediaTabSelected();
        };

        $scope.isPublishTabActive = function () {
            return TmProfileFactory.isPublishTabSelected();
        };

        /**
         * Toggle upgrade form.
         */
        controller.toggleUpgradeForm = function() {
            TmProfileFactory.setUpgradeFormVisibility();
            if (TmProfileFactory.isUpgradeFormVisible($scope.activeTab)) {
                TmProfileOverviewHistoryLogFactory.setOverviewVisible(false);
            }
        };

        /**
         * Toggle upgrade form.
         */
        controller.toggleUpgradeProgramForm = function() {
            TmProfileFactory.setProgramUpgradeFormVisibility();
        };

        controller.handleCloseDeleteForm = function () {
            TmProfileFactory.setProgramEditFormVisibility(true);
        };

        controller.handleSendDeleteRequestClick = function () {
            controller.deleteRequestInProgress = true;
            TmProfileProgramsService.deleteRequest(
                $scope.deleteRequest.program.id,
                $scope.deleteRequest.comments
            ).then(controller.deleteCallback);
        };

        controller.deleteCallback = function (response) {
            controller.deleteRequestInProgress = false;

            // show notification about program submit status
            NotifierFactory.show(
                response ? 'success' : 'error',
                response ? 'Deleted successfully!' : 'Delete failed!',
                'Delete Program'
            );

            if (response) {
                // close edit mode
                TmProfileFactory.setProgramEditFormVisibility(false);
                // reload datagrid or remove program in it
                TmProfileFactory.announceProgramDeletion($scope.deleteRequest.program.id);
            }
        };

        /**
         * Actions to do on upgrade form submit.
         *
         * @returns {boolean}
         */
        controller.handleUpgradeClick = function() {
            if (!$scope.forms.upgradeProfile ||
                !$scope.forms.upgradeProfile.$valid ||
                !$scope.tmProfile.id ||
                !$scope.upgradeRequest
            ) {
                return false;
            }
            controller.upgradeInProgress = true;
            var comments = $scope.upgradeRequest.comments || null;
            TmProfileService.sendUpgradeRequest($scope.tmProfile.id, comments).then(function(success) {
                controller.upgradeInProgress = false;
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Inquiry sent successfully!' : 'Processing inquiry failed!',
                    'Upgrade To Advanced'
                );
                if (success) {
                    $scope.upgradeRequest.comments = null;
                    controller.toggleUpgradeForm();
                }
            });
        };

        controller.handleProgramUpgradeRequestClick = function() {
            TmProfileProgramsService.upgrade(
                TmProfileFactory.getProgram().id,
                $scope.upgradeRequest.comments
            ).then(controller.upgradeCallback);
        };

        controller.upgradeCallback = function (success) {
            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'Upgrade request successfully sent!' : 'Upgrade request failed!',
                'Basic Program'
            );
            TmProfileFactory.setProgramUpgradeFormVisibility(false);
        };

        controller.handleLoadMoreHistoryLogs = function() {
            TmProfileOverviewHistoryLogFactory.loadMore();
        };

        controller.closeHistoryLogs = function () {
            TmProfileOverviewHistoryLogFactory.closeAll();
            controller.overviewLog = {};
        };

        controller.isMoreLogsAvailable = function() {
            if (controller.overviewLog && controller.overviewLog.totalMatching) {
                return TmProfileOverviewHistoryLogFactory.getLimit() < controller.overviewLog.totalMatching;
            }
            return false;
        };

        controller.isFaqHistoryLogsVisibleWatch = function (isVisible, wasVisible) {
            isVisible = isVisible || false;
            controller.showFaqHistory = isVisible;
            if (!isVisible && wasVisible) {
                controller.overviewLog = {};
                TmProfileOverviewHistoryLogFactory.setLimit(null);
            }
        };

        controller.isOverviewHistoryLogsVisibleWatch = function (isVisible, wasVisible) {
            isVisible = isVisible || false;
            controller.showOverviewHistory = isVisible;
            if (!isVisible && wasVisible) {
                controller.overviewLog = {};
                TmProfileOverviewHistoryLogFactory.setLimit(null);
            }
        };

        controller.getHistoryLogsDataWatch = function (data) {
            controller.overviewLog = data;
        };

        controller.isHistoryLogsLoadMoreInProgressWatch = function (isInProgress) {
            controller.isLoadMoreHistoryLogsInProgress = isInProgress;
        };

        controller.activeTabWatch = function (tabId) {
            // store active tab id
            TmProfileFactory.setSelectedTabId(tabId);
            // close all left side panels
            TmProfileFactory.closeRightSidePanels();
           // controller.overviewLog = null;
            //TmProfileOverviewHistoryLogFactory.setLimit(1);
        };

        controller.getCoreIdWatch = function (coreId) {
            if (coreId) {
                // close all left side panels
                TmProfileFactory.closeRightSidePanels();

                if (InstitutionFactory.isEmpty()) {
                    return false;
                }
                $scope.institutionDataLoaded = true;
                $scope.institutionId = InstitutionFactory.getId();
                $scope.institutionData = InstitutionFactory.getData();
                $scope.tmIsAdvanced = InstitutionFactory.isTmAdvanced();
                // check if TM is not enabled, redirect qs user to default client page.
                if (!InstitutionFactory.isTmSubscribed() && !UserFactory.isClient()) {
                    $location.path(constants.defaultClientPage);

                    return false;
                }

                controller.showProgramStasTab = InstitutionFactory.isAdvancedProgram();
                if (InstitutionFactory.isTmSubscribed() && !UserFactory.noAccess($state.current.name)) {
                    controller.loadTmProfileData(InstitutionFactory.getCoreId());
                } else {
                    // if user doesn't have access, empty previously loaded data
                    $scope.profileDataLoaded = true;
                    TmProfileFactory.setData(null);
                }
            }
        };

        controller.initWatches = function () {
            // watch for delete form visibility changes
            WatchService.create($scope, function () {
                return TmProfileFactory.isProgramUpgradeFormVisible($scope.activeTab);
            }, function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.upgradeRequest = {
                        comments: null,
                        program: TmProfileFactory.getProgram(),
                        name: UserFactory.getFullName(),
                        email: UserFactory.getUserName()
                    };
                    $scope.showUpgradeProgramRequest = newValue;
                }
            });

            // watch for upgrade form visibility changes
            WatchService.create($scope, function () {
                return TmProfileFactory.isUpgradeFormVisible($scope.activeTab);
            }, function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.upgradeRequest = {
                        name: UserFactory.getFullName(),
                        email: UserFactory.getUserName(),
                        comments: null
                    };
                    $scope.showUpgradeForm = newValue;
                }
            });

            // watch for delete form visibility changes
            WatchService.create($scope, function () {
                return TmProfileFactory.isDeleteFormVisible($scope.activeTab);
            }, function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.deleteRequest = {
                        comments: null,
                        program: TmProfileFactory.getProgram(),
                        name: UserFactory.getFullName(),
                        email: UserFactory.getUserName()
                    };
                    $scope.showDeleteForm = newValue;
                }
            });

            // watch for program edit form visibility changes
            WatchService.create($scope, function () {
                return TmProfileFactory.isProgramEditFormVisible($scope.activeTab);
            }, function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.showProgramEditForm = newValue;
                }
            });

            // watch for program add form visibility changes
            WatchService.create($scope, function () {
                return TmProfileFactory.isProgramAddFormVisible($scope.activeTab);
            }, function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    TmProfileFactory.setReadOnly(false);
                    $scope.showProgramAddForm = newValue;
                }
            });

            // listen to active profile tab changes
            WatchService.create($scope, 'activeTab', controller.activeTabWatch);
            // watch for overview history logs visibility changes
            WatchService.create($scope, TmProfileOverviewHistoryLogFactory.isFaqVisible, controller.isFaqHistoryLogsVisibleWatch);
            // watch for FAQ history logs visibility changes
            WatchService.create($scope, TmProfileOverviewHistoryLogFactory.isOverviewVisible, controller.isOverviewHistoryLogsVisibleWatch);
            // watch for history logs data changes
            WatchService.create($scope, TmProfileOverviewHistoryLogFactory.getLogs, controller.getHistoryLogsDataWatch);
            // watch for history logs loading progress
            WatchService.create($scope, TmProfileOverviewHistoryLogFactory.isLoadMoreInProgress, controller.isHistoryLogsLoadMoreInProgressWatch);
            // watch for institution changes
            WatchService.create($scope, InstitutionFactory.getCoreId, controller.getCoreIdWatch);
            WatchService.create($scope, InstitutionFactory.isTmAdvanced, function (newValue) {
                $scope.tmIsAdvanced = newValue;
            });

            $rootScope.$on(constants.events.logout, controller.destruct);
        };

        controller.destruct = function() {
            TmProfileFactory.reset();
            $scope.showDepartmentEditForm = false;
            $scope.showDepartmentAddForm = false;
            $scope.showProgramEditForm = false;
            $scope.showDProgramAddForm = false;
        };


        controller.init = function() {
            controller.initWatches();
            TmProfileFactory.setProgramUpgradeFormVisibility(false);
        };

        controller.init();
    };

    angular
        .module('qsHub')
        .controller('TmProfileController', [
            '$scope',
            '$rootScope',
            '$location',
            '$state',
            'constants',
            'TmProfileService',
            'NotifierFactory',
            'TmProfileFactory',
            'InstitutionFactory',
            'UserFactory',
            'TuProfileFactory',
            'TuProfileService',
            'TmProfileProgramsService',
            'TmProfileOverviewService',
            'TmProfileOverviewHistoryLogFactory',
            'WatchService',
            App.controllers.tmProfile
        ]);

}(window.angular));
