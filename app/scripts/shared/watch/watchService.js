(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.Watch = function () {
        var service = {};

        service.create = function ($scope, watchExpression, listener, objectEquality, prettyPrintExpression) {
            if (typeof $scope !== 'object' || typeof listener !== 'function') {
                return false;
            }
            var stopWatch = $scope.$watch(watchExpression, function (newValue, oldValue) {
                try {
                    listener(newValue, oldValue);
                } catch (e) {
                    stopWatch();
                    throw e;
                }
            }, objectEquality, prettyPrintExpression);

            return stopWatch;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('WatchService', [
            App.services.Watch
        ]);
}(window.angular));
