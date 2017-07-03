(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.tuProfile = function (
        $scope,
        $rootScope,
        $resource,
        $location,
        $state,
        constants,
        TuProfileService,
        NotifierFactory,
        TuProfileFactory,
        TuProfileHistoryLogFactory,
        InstitutionFactory,
        UserFactory,
        WatchService,
        TuProfileDepartmentsService
    ) {
        var controller = this;
        controller.devMode = constants.dev;
        $scope.upgradeEmailsTo = constants.emails.upgradeTu;
        controller.subjects = {};

        $scope.institutionDataLoaded = false;
        $scope.profileDataLoaded = false;
        $scope.tuProfile = {};
        $scope.upgradeRequest = {
            name: UserFactory.getFullName(),
            email: UserFactory.getUserName()
        };
        $scope.tuProfileBeforeChanges = {};
        $scope.forms = {};
        $scope.showUpgradeForm = false;
        $scope.showHistory = false;
        $scope.tuIsAdvanced = false;
        $scope.activeTab = TuProfileFactory.getProfileTabs().overview;
        $scope.upgradeInProgress = false;
        $scope.historyLog = {
            log: {},
            totalReturned: 0,
            total: 0
        };
        $scope.showClientUpgradeForm = false;

        $scope.handleHistoryLogVisibility = function() {
            return TuProfileHistoryLogFactory.getLogLimit() < $scope.historyLog.total;
        };

        $scope.handleLoadMoreHistoryLog = function() {
            TuProfileHistoryLogFactory.setLogLimit(TuProfileHistoryLogFactory.getLogLimit() + 5);
            //broadcast load more history log event
            $scope.$broadcast(
                constants.events.loadMoreHistoryLogs,
                TuProfileHistoryLogFactory.getProfileType(),
                InstitutionFactory.isTuAdvanced(),
                TuProfileHistoryLogFactory.getLogLimit()
            );
        };
        
        /**
         * Is all data loaded?
         *
         * @returns {boolean}
         */
        $scope.loadInProgress = function () {
            return $scope.institutionDataLoaded && $scope.profileDataLoaded ? false : true;
        };

        // load TU profile data
        controller.loadTuProfileData = function (coreId) {
            TuProfileService.getTuProfileData(coreId).then(function (data) {
                $scope.profileDataLoaded = true;
                $scope.tuProfile = data;
                TuProfileFactory.setData(data);
                $scope.tuProfileBeforeChanges = angular.copy(data);
                $scope.ugOrPgDisabled = !(InstitutionFactory.isUgEnabled() && InstitutionFactory.isPgEnabled());
                $scope.profileDisableName = !InstitutionFactory.isUgEnabled() && !InstitutionFactory.isPgEnabled() ?
                    'Undergraduate and Postgraduate' : (!InstitutionFactory.isUgEnabled() ? 'Undergraduate' : 'Postgraduate');
                $scope.$broadcast(constants.events.institutionTuProfileChanges);
            });
        };

        /**
         * Returns whether to disable the profile or not based on type
         *
         * @param {string} type
         * @returns {Boolean}
         */
        $scope.isProfileEnabled = function (type) {
            if (type === constants.profileTypes.ug) {
                return !InstitutionFactory.isUgEnabled();
            } else if (type === constants.profileTypes.pg) {
                return !InstitutionFactory.isPgEnabled();
            } else if (type === constants.profileTypes.master) {
                return !InstitutionFactory.isUgEnabled() &&
                       !InstitutionFactory.isPgEnabled();
            }
            return false;
        };

        /**
         * Toggle upgrade form.
         */
        $scope.toggleUpgradeForm = function () {
            TuProfileFactory.setUpgradeFormVisibility();
        };

        $scope.toggleDepartmentEditForm = function () {
            TuProfileFactory.setDepartmentEditFormVisibility();
        };

        $scope.toggleDepartmentAddForm = function () {
            TuProfileFactory.setDepartmentAddFormVisibility();
        };

        /**
         * Toggle history details block.
         */
        $scope.toggleHistory = function (visibility) {
            if (!visibility) {
                TuProfileHistoryLogFactory.setTriggeredBy('');
                TuProfileHistoryLogFactory.setLogLimit(1);
            }
            TuProfileFactory.setHistoryLogVisibility(visibility);
        };

        /**
         * Get status of history log.
         *
         * @returns {bool}
         */
        $scope.fetchingHistoryLog = function () {
            return TuProfileHistoryLogFactory.isInProgress();
        };

        /**
         * Get status of loading more history log .
         *
         * @returns {bool}
         */
        $scope.fetchingMoreHistoryLog = function () {
            return TuProfileHistoryLogFactory.isLoadMoreInProgress();
        };

        /**
         * Actions to do on upgrade form submit.
         *
         * @returns {boolean}
         */
        $scope.handleUpgradeClick = function () {
            if (
                !$scope.forms.upgradeProfile ||
                !$scope.forms.upgradeProfile.$valid ||
                !$scope.tuProfile.id ||
                !$scope.upgradeRequest
            ) {
                return false;
            }
            $scope.upgradeInProgress = true;
            var comments = $scope.upgradeRequest.comments || null;

            TuProfileService.sendUpgradeRequest($scope.tuProfile.id, comments).then(function (success) {
                $scope.upgradeInProgress = false;
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Inquiry sent successfully!' : 'Processing inquiry failed!',
                    'Upgrade To Advanced'
                );
                if (success) {
                    $scope.upgradeRequest.comments = null;
                    $scope.toggleUpgradeForm();
                }
            });
        };



        $scope.showDepartmentsTab =  function () {
            var showDepartmentsTab = !InstitutionFactory.isClientDepartment() && !InstitutionFactory.hasNoDepartments();
            if (!showDepartmentsTab && TuProfileFactory.isDepartmentsTabSelected()) {
                $scope.activeTab = TuProfileFactory.getProfileTabs().overview;
            }
            return showDepartmentsTab;
        };

        $scope.isRightSidePanelActive = function () {
            // subjects tab is active
            if (TuProfileFactory.isSubjectsTabSelected()) {
                return true;
            }
            // publish tab is active
            if (TuProfileFactory.isPublishTabSelected()) {
                return true;
            }
            // upgrade form is visible
            if (
                $scope.showUpgradeForm &&
                (
                    TuProfileFactory.isOverviewTabSelected() ||
                    TuProfileFactory.isProgramsTabSelected() ||
                    TuProfileFactory.isMediaTabSelected() ||
                    TuProfileFactory.isDepartmentsTabSelected()
                )
            ) {
                return true;
            }
            // overview tab and history block is active
            if (TuProfileFactory.isOverviewTabSelected() && $scope.showHistory) {
                return true;
            }
            // departments tab is active and edit or add form is active
            if (
                TuProfileFactory.isDepartmentsTabSelected() &&
                (
                    $scope.showDepartmentEditForm ||
                    $scope.showDepartmentAddForm ||
                    $scope.showClientUpgradeForm
                )
            ) {
                return true;
            }
            // programs tab is active and edit or add form is active
            if (TuProfileFactory.isProgramsTabSelected() && ($scope.showProgramEditForm || $scope.showProgramAddForm)) {
                return true;
            }
            // media tab is active
            if (TuProfileFactory.isMediaTabSelected()) {
                return true;
            }
            return false;
        };

        /**
         *
         * @param {Object} log
         */
        controller.isRequestInfoTypeUrl = function (log) {
            var activeOverviewSubTabs = TuProfileFactory.getActiveOverviewSubTabs();
            var searchField = 'requestInfoTypeMaster';
            if (activeOverviewSubTabs.ug) {
                searchField = 'requestInfoTypeUg';
            } else if (activeOverviewSubTabs.pg) {
                searchField = 'requestInfoTypePg';
            }

            return log[searchField] === 'url';
        };

        $scope.isSubjectsTabActive = function () {
            return TuProfileFactory.isSubjectsTabSelected();
        };

        $scope.isMediaTabActive = function () {
            return TuProfileFactory.isMediaTabSelected();
        };

        $scope.isPublishTabActive = function () {
            return TuProfileFactory.isPublishTabSelected();
        };

        controller.handleSendUpgradeRequestClick = function () {
            controller.upgradeInProgress = true;
            TuProfileDepartmentsService.sendUpgradeRequest(
                $scope.upgradeRequest.department.id,
                $scope.upgradeRequest.comments
            ).then(controller.upgradeCallback);
        };

        controller.upgradeCallback = function (success) {
            controller.upgradeInProgress = false;

            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'Upgraded Request sent successfully!' : 'Upgrade failed!',
                'Upgrade to Client'
            );

            if (success) {
                // close edit mode
                TuProfileFactory.setClientDepartmentUpgradeFormVisibility(false);
                TuProfileFactory.setDepartmentEditFormVisibility(false);
            }
        };

        controller.initWatches = function () {
            WatchService.create($scope, InstitutionFactory.isTuAdvanced, function (newValue) {
                $scope.tuIsAdvanced = newValue;
            });
            // listen to active profile tab changes
            WatchService.create($scope, 'activeTab', function (newValue) {
                TuProfileFactory.setSelectedTabId(newValue);
                TuProfileFactory.closeSidebars();
                TuProfileHistoryLogFactory.resetTriggeredBy();
            });

            // watch active institution changes
            WatchService.create($scope, InstitutionFactory.getData, function (institutionData) {
                /**
                 * Fixes QCR-1404 #additionalScenario1
                 */
                TuProfileFactory.setHistoryLogVisibility(false);
                TuProfileHistoryLogFactory.setTriggeredBy('');
                if (InstitutionFactory.isEmpty()) {
                    return false;
                }
                $scope.institutionDataLoaded = true;
                $scope.institutionId = InstitutionFactory.getId();
                $scope.institutionData = institutionData;
                $scope.tuIsAdvanced = InstitutionFactory.isTuAdvanced();
                // check if TU is not enabled, redirect user to default client page.
                if (!InstitutionFactory.isTuSubscribed() && !UserFactory.isClient()) {
                    $location.path(constants.defaultClientPage);

                    return false;
                }

                if (angular.isDefined($state) && InstitutionFactory.isTuSubscribed() && !UserFactory.noAccess($state.current.name)) {
                    controller.loadTuProfileData(InstitutionFactory.getCoreId());
                } else {
                    $scope.tuProfile = {};
                    // if user doesn't have access, empty previously loaded data
                    $scope.profileDataLoaded = true;
                    TuProfileFactory.setData(null);
                    $scope.$broadcast(constants.events.institutionTuProfileChanges);
                }
            });

            // watch for upgrade form visibility changes
            WatchService.create($scope, function () {
                return TuProfileFactory.isUpgradeFormVisible($scope.activeTab);
            }, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.upgradeRequest.comments = null;
                    $scope.showUpgradeForm = newValue;
                }
            });

            // watch for history log visibility changes
            WatchService.create($scope, function () {
                return TuProfileFactory.isHistoryLogVisible($scope.activeTab);
            }, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.showHistory = newValue;
                }
            });

            // watch for program add form visibility changes
            WatchService.create($scope, function () {
                return TuProfileFactory.isProgramAddFormVisible($scope.activeTab);
            }, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.showProgramAddForm = newValue;
                }
            });

            // watch for program edit form visibility changes
            WatchService.create($scope, function () {
                return TuProfileFactory.isProgramEditFormVisible($scope.activeTab);
            }, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.showProgramEditForm = newValue;
                }
            });

            // watch for department add form visibility changes
            WatchService.create($scope, function () {
                return TuProfileFactory.isDepartmentAddFormVisible($scope.activeTab);
            }, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.showDepartmentAddForm = newValue;
                }
            });

            // watch for department edit form visibility changes
            WatchService.create($scope, function () {
                return TuProfileFactory.isDepartmentEditFormVisible($scope.activeTab);
            }, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.showDepartmentEditForm = newValue;
                }
            });

            WatchService.create($scope, TuProfileFactory.getAvailableSubjects, function (newValue, oldValue) {
                if (newValue !== oldValue || !angular.equals(controller.subjects, newValue)) {
                    controller.subjects = newValue;
                }
            });

            // watch for history log data changes
            WatchService.create($scope, TuProfileHistoryLogFactory.getData, function (newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    if (newValue) {
                        $scope.isAdvanced = TuProfileHistoryLogFactory.isAdvanced();
                        $scope.historyLog.total = newValue.totalMatching;
                        $scope.historyLog.totalReturned = newValue.totalFiltered;
                        $scope.historyLog.log = newValue.results;
                    }
                }
            });
            // watch for client upgrade form visibility changes
            WatchService.create($scope, function () {
                return TuProfileFactory.isClientDepartmentUpgradeFormVisible($scope.activeTab);
            }, function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.upgradeRequest = {
                        department : TuProfileFactory.getDepartment(),
                        comments: null,
                        name: UserFactory.getFullName(),
                        email: UserFactory.getUserName()
                    };
                    $scope.showClientUpgradeForm = newValue;
                }
            });

            $rootScope.$on(constants.events.logout, controller.destruct);
        };

        controller.destruct = function () {
            TuProfileFactory.reset();
            $scope.showDepartmentEditForm = false;
            $scope.showDepartmentAddForm = false;
            $scope.showProgramEditForm = false;
            $scope.showDProgramAddForm = false;
        };

        controller.init = function () {
            controller.initWatches();
        };

        controller.init();
    };

    angular
        .module('qsHub')
        .controller('TuProfileController', [
            '$scope',
            '$rootScope',
            '$resource',
            '$location',
            '$state',
            'constants',
            'TuProfileService',
            'NotifierFactory',
            'TuProfileFactory',
            'TuProfileHistoryLogFactory',
            'InstitutionFactory',
            'UserFactory',
            'WatchService',
            'TuProfileDepartmentsService',
            App.controllers.tuProfile
        ]);

}(window.angular));
