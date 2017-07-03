(function(angular) {
    'use strict';

    var App = App || {};
    App = angular.extend({}, App, {filters:{}});

    App.filters.uiGridSelectedLabel = function () {
        return function($select) {
            if (!$select || typeof $select.selected === 'undefined' || $select.selected === null) {
                return null;
            }
            if ($select.selected.label) {
                return $select.selected.label;
            }
            var i = 0, total = $select.items.length;
            for (i;i < total ;i++) {
                if ($select.items[i].value === $select.selected) {
                    return $select.items[i].label;
                }
            }
            return null;
        };
    };

    angular
        .module('qsHub')
        .filter('uiGridSelectedLabel', App.filters.uiGridSelectedLabel);
}(window.angular));

