(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers: {}});

    App.controllers.TuMediaSocialMedias = function (
        $scope,
        constants,
        TuProfileFactory,
        NotifierFactory,
        TuMediaSocialMediasService,
        TuMediaService,
        WatchService
    ) {
        var controller = this;
        controller.devMode = constants.dev;
        TuMediaSocialMediasService.coreId = 0;
        $scope.socialMediaItems = TuMediaSocialMediasService.socialMediaItems();
        $scope.itemSocialMedia = {};
        $scope.displayLocationDeletePopup = true;
        $scope.type = $scope.socialMediaItems[0];

        TuMediaSocialMediasService.setType($scope.type);
        WatchService.create($scope, function () {
            return TuProfileFactory.getData();
        }, function (newValue) {
            if (newValue !== null) {
                TuMediaSocialMediasService.coreId = newValue.id;
                $scope.socialMediaItems = TuMediaSocialMediasService.processInput(newValue.socialMedia);
                TuMediaSocialMediasService.setSelectedSocialMedia(TuMediaSocialMediasService.flattenArray(newValue.socialMedia));
            }
        });

        WatchService.create($scope, TuMediaSocialMediasService.getSocialMediaItems, function (newValue, oldValue) {
            if (!angular.equals(oldValue, newValue)) {
                $scope.socialMediaItems = newValue;
            }
        });

        WatchService.create($scope, TuMediaSocialMediasService.getChanges, function (newValue) {
            if (angular.isDefined(newValue)) {
                $scope.socialMediaItems[$scope.type] = TuMediaSocialMediasService.flattenArray(newValue, true);
            }
        });

        /**
         * Filter change.
         *
         * @param type
         */
        $scope.filter = function (type) {
            return type;
        };

        /**
         * Select social media.
         *
         * @param {string} type
         */
        $scope.selectSocialMedia = function (type) {
            $scope.type = type;
            TuMediaSocialMediasService.setType(type);
            TuMediaSocialMediasService.setTriggerChange(Math.random()); // reset right column changes
            if (!($scope.socialMediaItems[$scope.type].master || $scope.socialMediaItems[$scope.type].ug || $scope.socialMediaItems[$scope.type].pg)) {
                TuMediaSocialMediasService.setHighlighted(true);
            }
        };

        $scope.selectedItem = function () {
            return TuMediaSocialMediasService.getSelectedSocialMedia();
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
        .controller('TuMediaSocialMediasController', [
            '$scope',
            'constants',
            'TuProfileFactory',
            'NotifierFactory',
            'TuMediaSocialMediasService',
            'TuMediaService',
            'WatchService',
            App.controllers.TuMediaSocialMedias
        ]);

}(window.angular));
