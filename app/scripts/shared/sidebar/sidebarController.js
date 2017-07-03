(function(angular) {
    'use strict';

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    /**
     * Directive for run metsiMenu on sidebar navigation
     *
     * @param $timeout
     * @returns {{restrict: string, link: link}}
     */
    App.controllers.Sidebar = function ($window, constants , UserFactory) {
        var controller = this;
        controller.coreUrl = constants.urls.core;
        controller.hasTuProgramsOverviewAccess = function () {
            return UserFactory.hasTuProgramsOverviewAccess();
        };
        controller.hasDepartmentsOverviewAccess = function () {
            return UserFactory.hasDepartmentsOverviewAccess();
        };

        controller.getCoreFlag = function () {
            if ($window.localStorage[constants.xStorage.keys.sendToSession]) {
                return $window.localStorage[constants.xStorage.keys.sendToSession] === 'true' ? constants.coreFlag.value : '';
            }

            return constants.coreFlag.value;
        };
    };

    angular
        .module('qsHub')
        .controller('SidebarController', [
            '$window',
            'constants',
            'UserFactory',
            App.controllers.Sidebar
        ]);

}(window.angular));
