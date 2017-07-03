(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {
        components:{}
    });

    App.components.userPassword = {
        templateUrl: '/scripts/components/users/shared/password/passwordView.html',
        bindings: {
            user: '=',
            config: '<',
            resetValidators: '<'
        },
        controller: 'PasswordController'
    };

    angular.module('qsHub').component('userPassword', App.components.userPassword);

}(window.angular));
