(function (angular) {
    'use strict';

    var App = App || {};
    App = angular.extend({}, App, { filters: {} });

    App.filters.mDate = function (constants, $filter) {
        return function (input) {
            return input ? $filter('date')(input, 'mediumDate') : '';
        };
    };

    angular
        .module('qsHub')
        .filter('mDate', ['constants', '$filter', App.filters.mDate]);
} (window.angular));
