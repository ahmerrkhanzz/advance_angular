(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.TmProfileMedia = function(
        $scope,
        constants,
        InstitutionFactory,
        TmProfileFactory,
        WatchService
    ) {
        var controller = this,
            alreadyInitialised = false;
        controller.devMode = constants.dev;
        controller.upgradeEmailsTo = constants.emails.upgradeTu;
        $scope.isMediaReloading = true;

        controller.isImagesTabActive = function () {
            var selectedMediaTabId = TmProfileFactory.getSelectedMediaSubTabId();
            return selectedMediaTabId === 1 || selectedMediaTabId === null;
        };

        controller.isVideosTabActive = function () {
            return TmProfileFactory.isMediaVideosSubTabSelected();
        };

        controller.isBrochuresTabActive = function () {
            return TmProfileFactory.isMediaBrochuresSubTabSelected();
        };

        controller.isSocialMediaTabActive = function () {
            return TmProfileFactory.isMediaSocialSubTabSelected();
        };

        controller.initWatches = function () {
            WatchService.create($scope, InstitutionFactory.isAdvanced, function (newValue, oldValue) {
                if (oldValue !== newValue) {
                    $scope.isAdvanced = newValue;
                }
            });
            
            // watch for active institution changes changes
            WatchService.create($scope, InstitutionFactory.getId, function (visible) {
                $scope.isMediaReloading = !visible;
            });
        };

        controller.isRightSidePanelActive = function () {
            // media tab is active
            if (TmProfileFactory.isMediaTabSelected()) {
                return true;
            }

            return false;
        };

        controller.init = function () {
            controller.initWatches();
        };

        // listen to departments tab visibility changes
        WatchService.create($scope, TmProfileFactory.isMediaTabSelected, function (isActive, wasActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TmProfileMediaController', [
            '$scope',
            'constants',
            'InstitutionFactory',
            'TmProfileFactory',
            'WatchService',
            App.controllers.TmProfileMedia
        ]);

} (window.angular));
