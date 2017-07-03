(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.TmMediaCommonSidebar = function(
        $scope,
        $resource,
        $location,
        constants,
        TmProfileFactory,
        InstitutionFactory,
        TmMediaService,
        TmMediaVideosService,
        TmMediaBrochuresService,
        TmMediaSocialMediasService,
        TmMediaImagesService
    ) {
        if (angular.isUndefined($scope.tabId)) {
            TmProfileFactory.setSelectedMediaSubTabId(1);
        }

        $scope.setSelected = function(tabId) {
            if ($scope.tabId !== tabId) {
                $scope.tabId = tabId;
                TmProfileFactory.setSelectedMediaSubTabId(tabId);
                return true;
            } else {
                return false;
            }
        };

        $scope.getSelected = function() {
            return TmProfileFactory.getSelectedMediaSubTabId();
        };

        $scope.getGeneralCounter = function() {
            var totalCount = 0;
            var videoItems = TmMediaVideosService.getVideoItems();
            if (angular.isArray(videoItems)) {
                totalCount += videoItems.length;
            }
            var brochureItems = TmMediaBrochuresService.getBrochureItems();
            if (angular.isArray(brochureItems)) {
                totalCount += brochureItems.length;
            }
            var socialMediaItems = TmMediaSocialMediasService.getSocialMediaItems();
            if (angular.isArray(socialMediaItems)) {
                totalCount += socialMediaItems.length;
            }

            var imageItems = TmMediaImagesService.getImageItems();
            if (angular.isArray(imageItems)) {
                totalCount += imageItems.length;
            }

            return totalCount;
        };
    };

    angular
        .module('qsHub')
        .controller('TmMediaCommonSidebarController', [
            '$scope',
            '$resource',
            '$location',
            'constants',
            'TmProfileFactory',
            'InstitutionFactory',
            'TmMediaService',
            'TmMediaVideosService',
            'TmMediaBrochuresService',
            'TmMediaSocialMediasService',
            'TmMediaImagesService',
            App.controllers.TmMediaCommonSidebar
        ]);

}(window.angular));
