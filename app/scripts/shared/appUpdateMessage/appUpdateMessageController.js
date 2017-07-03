(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});
    App.controllers.AppUpdate = function (
        AppUpdateMessageFactory
    ) {
        var controller = this;

        controller.isVisible = function () {
            return AppUpdateMessageFactory.isVisible();
        };
    };

    angular
        .module('qsHub')
        .controller('AppUpdateMessageController', [
            'AppUpdateMessageFactory',
            App.controllers.AppUpdate
        ]);

}(window.angular));
