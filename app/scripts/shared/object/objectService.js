(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.Object = function () {
        var service = {};

        /**
         * Set object value.
         *
         * @param {Object} obj
         * @param {string} prop
         * @param {mixed} value
         * @returns {boolean}
         */
        service.set = function (obj, prop, value) {
            if (typeof obj === 'undefined' || typeof prop === 'undefined' || typeof value === 'undefined') {
                return false;
            }

            var index = prop.indexOf('.');
            if (index > -1) {
                return service.set(obj[prop.substring(0, index)], prop.substr(index + 1), value);
            }

            obj[prop] = value;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('ObjectService', [
            App.services.Object
        ]);
}(window.angular));
