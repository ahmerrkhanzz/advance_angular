(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {
        components:{}
    });

    App.components.uiGridInfo = {
        templateUrl: '/scripts/shared/ui-grid/uiGridInfo/uiGridInfoView.html'
    };

    angular.module('qsHub').component('uiGridInfo', App.components.uiGridInfo);

}(window.angular));



