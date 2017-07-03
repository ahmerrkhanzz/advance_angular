(function(angular) {
    'use strict';

    var App = App || {};
    App = angular.extend({}, App, {directives:{}});


    /**
     * Horizontal Scroll with mouse wheel and with click and drag mouse.
     */
    App.directives.mouseScrollHorizontal = function($swipe, $window) {
      return {
        restrict: 'EA',
        link: function(scope, element, attrs, ctrl) {
            var pointX, pointY, startX, startY;
            var isMouseDraged = false;
            var isMouseDown = false;
            //drag with mouse move
            $swipe.bind(element, {
                'start': function(coords,event) {
                    isMouseDraged = false;
                    isMouseDown = true;
                    startX = coords.x;
                    startY = coords.y;
                },
                'move': function(coords,event) {
                    isMouseDraged = true;
                    if (isMouseDown) {
                        pointX = coords.x;
                        pointY = coords.y;
                        
                        var delta =  startX - pointX;
                        element[0].scrollLeft = delta;
                    }
                },
                'end': function (coords, event) {
                    isMouseDown = false;
                    if (isMouseDraged) {
                        angular.element(event.target).unbind('click');
                    }
                }
            });

            //scroll with mouse wheel
            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {
                var delta = 0;
                event = $window.event || event;
                if (event.originalEvent) {
                    delta = Math.max(-1, Math.min(1, (event.originalEvent.wheelDelta || -event.originalEvent.detail)));
                } else {
                    delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
                }
        
                scope.$apply(function(){
                    element[0].scrollLeft -= delta * 40;
                });
                
                // for IE
                event.returnValue = false;
                // for Chrome and Firefox
                if(event.preventDefault) {
                    event.preventDefault();                        
                }
            });
        }
      };
    };
    
    angular
        .module('qsHub')
        .directive('mouseScrollHorizontal', ["$swipe", "$window", App.directives.mouseScrollHorizontal]);

}(window.angular));


