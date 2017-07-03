(function(angular) {
    'use strict';

    var App = App || {};
    App = angular.extend({}, App, {directives:{}});

    App.directives.progressCircle = function () {
        return {
            scope: {
                progressCircle: '='
            },
            link: function (scope) {
                scope.getParams = function (progressCircle) {
                    switch (progressCircle) {
                        case 'pending':
                            scope.percent = 0;
                            scope.colour = 'grey';
                            scope.text = 'Pending';
                            break;
                        case 'progress':
                            scope.percent = 50;
                            scope.colour = 'blue';
                            scope.text = 'Progress';
                            break;
                        case 'success':
                            scope.percent = 100;
                            scope.colour = 'green';
                            scope.text = 'Success';
                            break;
                        case 'failure':
                            scope.percent = 100;
                            scope.colour = 'red';
                            scope.text = 'Failed';
                            break;
                        default:
                            scope.percent = 0;
                            scope.colour = '';
                            scope.text = 'No Status';
                            break;
                    }
                };
                scope.$watch('progressCircle', function(value, oldValue) {
                    if (!angular.equals(value, oldValue)) {
                        scope.getParams(value);
                    }
                });
                scope.getParams(scope.progressCircle);
            },
            restrict: 'A',
            templateUrl: '/scripts/shared/progressCircle/progressCircleView.html'
        };
    };

    angular
        .module('qsHub')
        .directive('progressCircle', App.directives.progressCircle);

}(window.angular));
