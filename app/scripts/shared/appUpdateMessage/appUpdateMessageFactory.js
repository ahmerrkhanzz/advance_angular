(function(angular, airbrakeJs) {
    'use strict';

    var App = App || {};
    App = angular.extend({}, App, {factories:{}});

    App.factories.AppUpdateMessage = function () {
        var visible;
        return {
            setVisible: function (isVisible) {
                visible = isVisible || true;
            },
            isVisible: function () {
                return !!visible;
            }
        };
    };

    angular
        .module('qsHub')
        .factory('AppUpdateMessageFactory', [
            App.factories.AppUpdateMessage
        ]);

}(window.angular, window.airbrakeJs));
