(function (angular, moment) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.institutionsSubscriptions = function (
        $scope,
        constants,
        InstitutionsSubscriptionsService,
        InstitutionsListFactory,
        InstitutionFactory,
        WatchService,
        InstitutionsListSubscriptionsFactory
    ) {
        var controller = this;
        controller.isLogVisible = {};
        controller.subscriptionsLog = {};
        controller.subscriptionsLogLoading = {};
        controller.downgradeCheckInProgress = false;
        controller.maxDate = null;
        controller.types = {
            tu: 'tu',
            tm: 'tm'
        };

        controller.getCurrentDate = function () {
            return moment().format('x');
        };

        controller.initDowngradeAllowed = function () {
            controller.downgradeAllowed = {
                'tu': true,
                'tm': true
            };
        };
        controller.initDowngradeAllowed();

        controller.handleHistoryLogClick = function (type) {
            if (!controller.isHistoryLogVisible(type)) {
                // load subscriptions log
                controller.loadSubscriptions(type);
            }
            controller.toggleSubscriptionsLog(type);
        };

        controller.loadSubscriptions = function (type) {
            controller.subscriptionsLogLoading[type] = true;
            InstitutionsSubscriptionsService.getLog($scope.institution.id, type).then(function (results) {
                controller.subscriptionsLogLoading[type] = false;
                controller.subscriptionsLog[type] = results;
            });
        };

        controller.toggleSubscriptionsLog = function (type) {
            controller.isLogVisible[type] = !controller.isLogVisible[type];
        };

        controller.isHistoryLogVisible = function (type) {
            return controller.isLogVisible[type] || false;
        };

        controller.isSubscriptionsLogLoading = function (type) {
            return controller.subscriptionsLogLoading[type] || false;
        };

        controller.getSubscriptionsLog = function (type) {
            return controller.subscriptionsLog[type] || [];
        };

        /**
         * Check if should display loading screen for subscriptions tab - profiles side
         *
         * @returns {boolean}
         */
        controller.isProfilesLoading = function () {
            return controller.downgradeCheckInProgress;
        };

        /**
         * Gets whether TU/TM sliders has to be disabled in subscription tab
         * Triggers only for top level institutions and client departments
         */
        controller.isDowngradeAllowed = function () {
            var coreIdKey = 'coreId',
                typeIdKey = 'typeId';
            // reset check child data
            controller.initDowngradeAllowed();
            if ($scope.institution &&
                $scope.institution.hasOwnProperty(coreIdKey) &&
                $scope.institution[coreIdKey] !== null &&
                angular.isNumber($scope.institution[coreIdKey]) &&
                $scope.institution[coreIdKey] > 0 &&
                $scope.institution.hasOwnProperty(typeIdKey) &&
                $scope.institution[typeIdKey] !== null &&
                (
                    $scope.institution[typeIdKey] === constants.typeId.topLevelInstitutionId ||
                    $scope.institution[typeIdKey] === constants.typeId.clientDepartmentId
                )
            ) {
                controller.downgradeCheckInProgress = true;
                InstitutionsSubscriptionsService.isDowngradeAllowed($scope.institution[coreIdKey]).then(function (results) {
                    controller.downgradeAllowed = results;
                    controller.downgradeCheckInProgress = false;
                });
            }
        };

        /**
         * Is TU downgrade allowed on UI
         *
         * @returns {boolean}
         */
        controller.isDowngradeAllowedTu = function (isSubscribed) {
            // if the institution is not subscribed, allow downgrade.
            if (typeof isSubscribed !== 'undefined' && isSubscribed !== null && isSubscribed) {
                return controller.downgradeAllowed.tu && isSubscribed;
            }

            return true;
        };

        /**
         * Is TM downgrade allowed on UI
         *
         * @returns {boolean}
         */
        controller.isDowngradeAllowedTm = function (isSubscribed) {
            // if the institution is not subscribed, allow downgrade.
            if (typeof isSubscribed !== 'undefined' && isSubscribed !== null && isSubscribed) {
                return controller.downgradeAllowed.tm && isSubscribed;
            }

            return true;
        };

        controller.handleInstitutionChange = function () {
            controller.isDowngradeAllowed();
            controller.isLogVisible = {};
        };

        controller.maxDateWatch = function (value) {
            if (value) {
                controller.maxDate = value;
                if ($scope.institution.subscriptions &&
                    $scope.institution.subscriptions.tm &&
                    $scope.institution.subscriptions.tm.endDate
                ) {
                    $scope.institution.subscriptions.tm.endDate = value;
                }
            }
        };

        controller.subscriptionsWatch = function (value) {
            if (value &&
                $scope.institution.subscriptions &&
                $scope.institution.subscriptions.tm &&
                $scope.institution.subscriptions.tm.endDate
            ) {
                var currentDate = parseInt($scope.institution.subscriptions.tm.endDate);
                if (currentDate < controller.maxDate) {
                    $scope.institution.subscriptions.tm.endDate = controller.maxDate;
                }
            }
        };

        /**
         * Allow to assign TU subscriptions.
         *
         * @returns {boolean}
         */
        controller.allowTu = function () {
            return !!($scope.institution && $scope.institution.typeId !== constants.typeId.advancedProgramId);
        };

        controller.hasSubscriptionsChangesWatch = function (has) {
            if (has) {
                InstitutionsListSubscriptionsFactory.setHasSubscriptionsChanges(false);
                controller.handleInstitutionChange();
            }
        };

        controller.initWatches = function () {
            WatchService.create($scope, 'institution.id', controller.handleInstitutionChange);
            WatchService.create($scope, InstitutionsListFactory.isInvalidDates, controller.maxDateWatch);
            WatchService.create($scope, InstitutionFactory.getSubscriptions, controller.subscriptionsWatch);
            WatchService.create($scope, InstitutionsListSubscriptionsFactory.hasSubscriptionsChanges, controller.hasSubscriptionsChangesWatch);
        };

        controller.init = function () {
            controller.initWatches();
        };

        // listen to subscriptions tab visibility changes
        var cancelSubscriptionTabWatch = WatchService.create(
            $scope,
            InstitutionsListFactory.isSubscriptionsTabSelected,
            function (selected) {
                if (selected) {
                    cancelSubscriptionTabWatch();
                    controller.init();
                }
            });
    };

    angular
        .module('qsHub')
        .controller('InstitutionsSubscriptionsController', [
            '$scope',
            'constants',
            'InstitutionsSubscriptionsService',
            'InstitutionsListFactory',
            'InstitutionFactory',
            'WatchService',
            'InstitutionsListSubscriptionsFactory',
            App.controllers.institutionsSubscriptions
        ]);

} (window.angular, window.moment));
