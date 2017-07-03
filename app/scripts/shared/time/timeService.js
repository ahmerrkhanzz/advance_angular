(function(angular, moment) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.Time = function () {
        var service = {};

        service.now = function (unix) {
            unix = typeof unix === 'undefined' ? false : unix;
            return unix ? parseInt(moment().format('x')) : moment();
        };

        service.nowUnix = function () {
            return service.now(true);
        };

        service.add = function (number, unit) {
            return moment().add(number, unit);
        };

        service.formatInUnix = function (date) {
            return moment(date, 'x');
        };

        service.getInUnix = function (date) {
            return parseInt(date.format('x'));
        };

        service.isValid = function (date) {
            return moment(date, 'x').isValid();
        };

        service.getMiliSeconds = function (momentObject) {
            return momentObject.format('x');
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('TimeService', [
            App.services.Time
        ]);
}(window.angular, window.moment));
