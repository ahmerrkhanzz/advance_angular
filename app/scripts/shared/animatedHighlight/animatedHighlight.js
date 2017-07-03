(function(angular) {
    'use strict';

    var App = App || {};
    App = angular.extend({}, App, {directives:{}});

    /**
     * Animated Highlighter
     *
     * @returns {{restrict: string, template: string, transclude: boolean, link: method}}
     */
    App.directives.animatedHighlight = function ($animateCss) {
        return {
            restrict: 'A',
            template:'<animated-highlight></animated-highlight><div ng-transclude></div>',
            transclude:true,
            link: function (scope, element, attrs) {
                var colorBefore = "#23a4f6";
                var colorAfter = "none";
                var opacityBefore = 0.3;
                var opacityAfter = 1;
                var delay = 1; //one second
                element.addClass("custom-highlight");
                element.css({
                    position: "relative"
                });
                opacityBefore = attrs.highlightOpacityBefore || opacityBefore;
                opacityAfter = attrs.highlightOpacityAfter || opacityAfter;
                colorBefore = attrs.highlightColorBefore || colorBefore;
                colorAfter = attrs.highlightColorAfter || colorAfter;
                delay = attrs.highlightDelay || delay;
                scope.$watch(attrs.animatedHighlight, function(value){
                    if (value) {
                        var animator = $animateCss(element.find("animated-highlight"), {
                            from: {
                                background: colorBefore,
                                opacity: opacityBefore,
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                "z-index": 1},
                            to: {
                                background: colorAfter,
                                opacity: opacityAfter,
                                "z-index": -1
                            },
                            duration: delay
                        });
                        animator.start();
                    }
                });
            }
        };
    };

    angular
        .module('qsHub')
        .directive('animatedHighlight', ["$animateCss", App.directives.animatedHighlight]);

}(window.angular));


