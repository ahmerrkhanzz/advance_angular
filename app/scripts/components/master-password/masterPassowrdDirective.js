(function(angular) {
    'use strict';

    var App = App || {};
    App = angular.extend({}, App, {directives:{}});

    App.directives.selectOnClick = function ($window) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.on('click', function () {
                    if (!$window.getSelection().toString() && element[0].type === 'text') {
                        this.setSelectionRange(0, this.value.length);
                    }
                });
            }
        };
    };

    angular
        .module('qsHub')
        .directive('selectOnClick', ['$window', App.directives.selectOnClick]);

}(window.angular));
