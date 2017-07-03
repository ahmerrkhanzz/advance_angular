/* global logoType */

(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.profilePassword = function (
        $scope,
        constants,
        ProfilePasswordService,
        AuthenticationService,
        PasswordService,
        NotifierFactory,
        UserFactory
    ) {
        var controller = this;
        controller.devMode = constants.dev;
        controller.forms = {};
        controller.passwordFieldsVisible = false;
        controller.updateInProgress = false;
        controller.password = null;
        controller.confirmPassword = null;
        controller.submitted = false;

        $scope.user = angular.extend({}, UserFactory.getData());

        controller.getForm = function() {
            return controller.forms.password;
        };

        controller.togglePasswordFields = function () {
            $scope.user.password = null;
            controller.password = null;
            controller.confirmPassword = null;
            controller.passwordFieldsVisible = !controller.passwordFieldsVisible;
        };

        controller.isPasswordFieldsVisible = function () {
            return controller.passwordFieldsVisible;
        };

        controller.isDisabled = function () {
            return controller.updateInProgress;
        };

        controller.update = function () {
            controller.submitted = true;

            // validate program data
            if (controller.updateInProgress ||
                !PasswordService.isPasswordValid($scope.user.password)
            ) {
                return false;
            }
            controller.updateInProgress = true;
            ProfilePasswordService.update($scope.user.password).then(controller.updatePasswordCallback);
        };

        controller.updatePasswordCallback = function (success) {
            controller.updateInProgress = false;
            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'Updated successfully!' : 'Update failed!',
                'Password'
            );
            if (success) {
                UserFactory.clearPasswordReset();
                AuthenticationService.setUserData(UserFactory.getData());
                controller.passwordFieldsVisible = false;
            }
        };
    };

    angular
        .module('qsHub')
        .controller('ProfilePasswordController', [
            '$scope',
            'constants',
            'ProfilePasswordService',
            'AuthenticationService',
            'PasswordService',
            'NotifierFactory',
            'UserFactory',
            App.controllers.profilePassword
        ]);

}(window.angular));
