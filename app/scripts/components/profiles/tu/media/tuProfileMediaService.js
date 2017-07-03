(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services: {}});

    App.services.TuProfileMediaService = function () {
        var service = {
            types: {
                master : 'master',
                ug : 'ug',
                pg : 'pg'
            }
        };

        service.typeOverview = function () {
            return service.types.master;
        };

        service.typeUndergraduate = function () {
            return service.types.ug;
        };

        service.typePostgraduate = function () {
            return service.types.pg;
        };

        /**
         * Get TU profile subtypes.
         *
         * @returns {array}
         */
        service.getTypes = function () {
            return [
                service.typeOverview(),
                service.typeUndergraduate(),
                service.typePostgraduate()
            ];
        };

        service.isValidType = function (item) {
            var scopeTypes = service.getTypes(),
                valid = false;
            for (var typesIndex = 0; typesIndex < scopeTypes.length; typesIndex++) {
                if (item[scopeTypes[typesIndex]]) {
                    valid = true;
                }
            }

            return valid;
        };

        /**
         * Validate profile subtype.
         *
         * @param {Object} list
         * @returns {true|Object}
         */
        service.validateTypes = function (list) {
            for (var i = 0; i < list.length; i++) {
                // if invalid type
                if (!service.isValidType(list[i])) {
                    // return invalid item
                    return list[i];
                }
            }

            return true;
        };

        /**
         * Searches the object for a given value and returns the first corresponding key if successful.
         *
         * @param {Object} haystack
         * @param {String} needle
         * @param {null|String}column
         * @returns {boolean|int} - returns the key for needle if it is found in the array, FALSE otherwise.
         */
        service.objectSearch = function (haystack , needle, column) {
            column = column || 'id';
            for (var i = 0; i < haystack .length; i++) {
                if (haystack[i] && haystack[i][column] && haystack[i][column] === needle) {
                    return i;
                }
            }
            return false;
        };


        return service;
    };

    angular
        .module('qsHub')
        .service('TuMediaService', [
            App.services.TuProfileMediaService
        ]);

}(window.angular));
