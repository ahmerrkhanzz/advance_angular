(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.TmMediaSocialMedias = function(
        $scope,
        constants,
        TmProfileFactory,
        NotifierFactory,
        TmMediaSocialMediasService,
        TmMediaService,
        WatchService
    ) {
        var controller = this;
        controller.devMode = constants.dev;
        TmMediaSocialMediasService.coreId = 0;
        $scope.socialMediaItems = TmMediaSocialMediasService.socialMediaItems();
        $scope.itemSocialMedia = {};
        $scope.displayLocationDeletePopup = true;
        $scope.type = $scope.socialMediaItems[0];

        TmMediaSocialMediasService.setType($scope.type);
        WatchService.create($scope, TmProfileFactory.getData, function(newValue) {
            if (newValue !== null) {
                TmMediaSocialMediasService.coreId = newValue.id;
                $scope.socialMediaItems = TmMediaSocialMediasService.processInput(newValue.socialMedia);
                TmMediaSocialMediasService.setSelectedSocialMedia(TmMediaSocialMediasService.flattenArray(newValue.socialMedia));
            }
        });

        WatchService.create($scope, TmMediaSocialMediasService.getSocialMediaItems, function(newValue, oldValue) {
            if (!angular.equals(oldValue, newValue)) {
                $scope.socialMediaItems = newValue;
            }
        });

        WatchService.create($scope, TmMediaSocialMediasService.getChanges, function(newValue) {
            if (angular.isDefined(newValue)) {
                $scope.socialMediaItems[$scope.type] = TmMediaSocialMediasService.flattenArray(newValue, true);
            }
        });

        /**
         * Filter change.
         *
         * @param type
         */
        $scope.filter = function(type) {
            return type;
        };

        /**
         * Select social media.
         *
         * @param {string} type
         */
        $scope.selectSocialMedia = function(type) {
            $scope.type = type;
            TmMediaSocialMediasService.setType(type);
            TmMediaSocialMediasService.setTriggerChange(Math.random()); // reset right column changes
            if (!($scope.socialMediaItems[$scope.type].master || $scope.socialMediaItems[$scope.type].ug || $scope.socialMediaItems[$scope.type].pg)) {
                TmMediaSocialMediasService.setHighlighted(true);
            }
        };

        $scope.selectedItem = function() {
            return TmMediaSocialMediasService.getSelectedSocialMedia();
        };

        $scope.typeOverview = function() {
            return TmMediaService.typeOverview();
        };

        $scope.typeUndergraduate = function() {
            return TmMediaService.typeUndergraduate();
        };

        $scope.typePostgraduate = function() {
            return TmMediaService.typePostgraduate();
        };
    };

    angular
        .module('qsHub')
        .controller('TmMediaSocialMediasController', [
            '$scope',
            'constants',
            'TmProfileFactory',
            'NotifierFactory',
            'TmMediaSocialMediasService',
            'TmMediaService',
            'WatchService',
            App.controllers.TmMediaSocialMedias
        ]);

}(window.angular));
