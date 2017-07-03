(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.TuMediaCommonSidebar = function (
        $scope,
        $resource,
        $location,
        constants,
        TuProfileFactory,
        InstitutionFactory,
        TuMediaService,
        TuMediaVideosService,
        TuMediaBrochuresService,
        TuMediaSocialMediasService,
        TuMediaImagesService
    ) {
        if(angular.isUndefined($scope.tabId)) {
            TuProfileFactory.setSelectedMediaTabId(1);
        }

        $scope.setSelected = function (tabId) {
            if ($scope.tabId !== tabId) {
                $scope.tabId = tabId;
                TuProfileFactory.setSelectedMediaTabId(tabId);
                return true;
            } else {
                return false;
            }
        };

        $scope.getSelected = function () {
            return TuProfileFactory.getSelectedMediaTabId();
        };

        $scope.getGeneralCounter = function ()
        {
            var totalCount = 0;
            var videoItems = TuMediaVideosService.getVideoItems();
            if (angular.isArray(videoItems)) {
                totalCount += videoItems.length;
            }
            var brochureItems = TuMediaBrochuresService.getBrochureItems();
            if (angular.isArray(brochureItems)) {
                totalCount += brochureItems.length;
            }
            var socialMediaItems = TuMediaSocialMediasService.getSocialMediaItems();
            if (angular.isArray(socialMediaItems)) {
                totalCount += socialMediaItems.length;
            }

            var imageItems = TuMediaImagesService.getImageItems();
            if (angular.isArray(imageItems)) {
                totalCount += imageItems.length;
            }

            return totalCount;
        };
    };

    angular
        .module('qsHub')
        .controller('TuMediaCommonSidebarController', [
            '$scope',
            '$resource',
            '$location',
            'constants',
            'TuProfileFactory',
            'InstitutionFactory',
            'TuMediaService',
            'TuMediaVideosService',
            'TuMediaBrochuresService',
            'TuMediaSocialMediasService',
            'TuMediaImagesService',
            App.controllers.TuMediaCommonSidebar
        ]);

}(window.angular));
