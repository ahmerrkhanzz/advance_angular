(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.Profile = function (
        $scope,
        WatchService,
        UserFactory,
        AuthenticationService
    ) {
        var controller = this;
        if (!UserFactory.hasData()) {
            UserFactory.setData(AuthenticationService.getUserData());
        }

        WatchService.create($scope, UserFactory.isPasswordReset, function (isPasswordReset) {
            $scope.isPasswordReset = isPasswordReset;
        });
    };

    angular
        .module('qsHub')
        .controller('ProfileController', [
            '$scope',
            'WatchService',
            'UserFactory',
            'AuthenticationService',
            App.controllers.Profile
        ]);

}(window.angular));
