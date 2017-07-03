(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {
        components:{}
    });

    App.components.appUpdate = {
        templateUrl: '/scripts/shared/appUpdateMessage/appUpdateMessageView.html',
        controller: 'AppUpdateMessageController'
    };

    angular.module('qsHub').component('appUpdate', App.components.appUpdate);

}(window.angular));



