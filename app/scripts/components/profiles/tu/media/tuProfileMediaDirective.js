(function(angular) {
    'use strict';

    var App = App || {};
    App = angular.extend({}, App, { directives: {} });

    App.directives.useTuSubtypes = function(constants, ngIfDirective) {
        var ngIf = ngIfDirective[0];
        return {
            restrict: 'A',
            transclude: ngIf.transclude,
            priority: ngIf.priority - 1,
            terminal: ngIf.terminal,
            link: function($scope, $element, $attr) {
                $attr.ngIf = function() {
                    return !constants.noTuSubtypes;
                };
                ngIf.link.apply(ngIf, arguments);
            }
        };
    };

    angular
        .module('qsHub')
        .directive('useTuSubtypes', ['constants', 'ngIfDirective', App.directives.useTuSubtypes]);

}(window.angular));
