(function (angular) {
    'use strict';

    var App = App || {};
    App = angular.extend({}, App, { filters: {} });

    /**
     * Filter for removing tags from a string.
     *
     * @returns {Function}
     */
    App.filters.htmlToPlaintext = function () {
        return function (text) {
            if (text && text.length) {
                text = String(text).replace(/(\r)?\n/g, '').replace(/<[^>]+>/gm, '');
            } else {
                text = '';
            }
            return text;
        };
    };

    App.filters.boolToText = function () {
        return function (text, options) {
            for (var option in options) {
                if (options[option].value === text) {
                    return options[option].label;
                }
            }
        };
    };

    App.filters.campusArrayToText = function () {
        return function (campusArray, options) {
            var campuses = [];
            if (campusArray.length) {
                for (var key in options) {
                    if (campusArray.indexOf(options[key].value) !== -1) {
                        campuses.push(options[key].label);
                        continue;
                    }
                }
            }
            return campuses.join(', ');
        };
    };

    App.filters.dotToDash = function () {
        return function (input) {
            var result = input.toString().split('.').join('-');
            return result;
        };
    };

    angular
        .module('qsHub')
        .filter('htmlToPlaintext', App.filters.htmlToPlaintext)
        .filter('boolToText', App.filters.boolToText)
        .filter('campusArrayToText', App.filters.campusArrayToText)
        .filter('dotToDash', App.filters.dotToDash);
} (window.angular));
