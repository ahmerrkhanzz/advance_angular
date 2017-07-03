(function (angular) {
    'use strict';
    angular.module('qsHub')
        .config(['$provide', function ($provide) {
            $provide.decorator('Grid', function ($delegate,$timeout) {
                $delegate.prototype.renderingComplete = function () {
                    if (angular.isFunction(this.options.onRegisterApi)) {
                        this.options.onRegisterApi(this.api);
                    }
                    this.api.core.raise.renderingComplete(this.api);
                    $timeout(function () {
                        var $viewport =  angular.element(document.querySelectorAll('.ui-grid-render-container'));
                        [
                            'touchstart',
                            'touchmove',
                            'touchend',
                            'keydown',
                            'wheel',
                            'mousewheel',
                            'DomMouseScroll',
                            'MozMousePixelScroll'
                        ].forEach(function (eventName) {
                            $viewport.unbind(eventName);
                        });
                    }.bind(this));
                };
                return $delegate;
            });
        }]);
})(window.angular);
