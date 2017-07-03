(function(angular) {
    'use strict';

    var App = App || {};
    App = angular.extend({}, App, {directives:{}});

    App.directives.displayFiltering = function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                columns:'=',
                active:'=',
                callback: '&'
            },
            templateUrl: '/scripts/shared/displayFiltering/displayFilteringView.html',
            link: function (scope, element, attrs) {
                element.find(".dropdown-filter").click(function(event){
                    event.stopPropagation();
                });
                scope.displayFilteringSelectAll = function () {
                    angular.forEach(scope.columns, function (column) {
                        column.show = true;
                    });
                };
                scope.closeDisplayFiltering = function (event) {
                    $timeout(function() {
                        element.click().trigger(event);
                    },0);
                };
            }
        };
    };

    angular
        .module('qsHub')
        .directive('displayFiltering', ["$timeout", App.directives.displayFiltering]);

}(window.angular));


