(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.TuProfileMedia = function (
        $scope,
        constants,
        InstitutionFactory,
        TuProfileFactory,
        WatchService
    ) {
        var controller = this,
            alreadyInitialised = false;
        controller.devMode = constants.dev;
        controller.upgradeEmailsTo = constants.emails.upgradeTu;
        $scope.isMediaReloading = true;

        controller.isImagesTabActive = function () {
            var selectedMediaTabId = TuProfileFactory.getSelectedMediaTabId();
            return selectedMediaTabId === 1 || selectedMediaTabId === null;
        };

        controller.isVideosTabActive = function () {
            return TuProfileFactory.getSelectedMediaTabId() === 2;
        };

        controller.isBrochuresTabActive = function () {
            return TuProfileFactory.getSelectedMediaTabId() === 4;
        };

        controller.isSocialMediaTabActive = function () {
            return TuProfileFactory.getSelectedMediaTabId() === 3;
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

        controller.init = function () {
            controller.initWatches();
        };

        // listen to departments tab visibility changes
        WatchService.create($scope, TuProfileFactory.isMediaTabSelected, function (isActive, wasActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TuProfileMediaController', [
            '$scope',
            'constants',
            'InstitutionFactory',
            'TuProfileFactory',
            'WatchService',
            App.controllers.TuProfileMedia
        ]);

}(window.angular));
