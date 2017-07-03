/* global logoType */

(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.ProfilePersonalDetails = function (
        $scope,
        constants,
        ProfilePersonalDetailsService,
        AuthenticationService,
        UserFactory,
        NotifierFactory,
        PasswordService
    ) {
        var controller = this;
        controller.devMode = constants.dev;
        controller.submitted = false;
        controller.updateInProgress = false;
        controller.forms = {};

        $scope.user = angular.extend({}, UserFactory.getData());

        controller.getForm = function() {
            return controller.forms.personalDetails;
        };

        controller.isValidFirstName = function () {
            return PasswordService.isValidFirstName(controller.getForm(), controller.user, 'firstName');
        };

        controller.isValidLastName = function () {
            return PasswordService.isValidLastName(controller.getForm(), controller.user, 'lastName');
        };

        controller.isValid = function () {
            return controller.isValidFirstName() &&
                controller.isValidLastName();
        };

        controller.setValid = function (fieldName) {
            controller.submitted = false;
            return PasswordService.setValid(controller.getForm(), fieldName);
        };
        controller.isDisabled = function () {
            return controller.updateInProgress;
        };

        /**
         * Actions to do when personal details update button is clicked.
         *
         * @returns {boolean}
         */
        controller.update = function () {
            controller.submitted = true;
            controller.getForm().$setDirty();
            controller.getForm().firstName.$setDirty();
            controller.getForm().lastName.$setDirty();

            // validate program data
            if (controller.updateInProgress ||
                !controller.isValid()
            ) {
                return false;
            }

            controller.updateInProgress = true;
            ProfilePersonalDetailsService.update(controller.user, true).then(controller.updateDetailsCallback);
        };

        /**
         * Actions to do when update request is finished.
         *
         * @param {boolean} success
         */
        controller.updateDetailsCallback = function (userObject) {
            controller.updateInProgress = false;
            NotifierFactory.show(
                userObject ? 'success' : 'error',
                userObject ? 'Updated successfully!' : 'Update failed!',
                'Personal Details'
            );
            if (userObject) {
                UserFactory.setFirstName(controller.user.firstName);
                $scope.user.firstName = controller.user.firstName;
                UserFactory.setLastName(controller.user.lastName);
                $scope.user.lastName = controller.user.lastName;
                UserFactory.setFullName(userObject.fullName);
                $scope.user.fullName = controller.user.fullName = userObject.fullName;
                UserFactory.setPosition(controller.user.position);
                $scope.user.position = controller.user.position;
                UserFactory.setTitle(controller.user.title);
                $scope.user.title = controller.user.title;
                if (controller.user.isClient) {
                    UserFactory.setPhone(controller.user.phone);
                    $scope.user.phone = controller.user.phone;
                }
                AuthenticationService.setUserData(UserFactory.getData());
            }
        };

        controller.copyScopeUserToControllerUser = function () {
            controller.user = angular.copy($scope.user);
        };
        controller.copyScopeUserToControllerUser();

        // Personal details cancel button
        controller.cancel = function () {
            controller.copyScopeUserToControllerUser();
        };
    };

    angular
        .module('qsHub')
        .controller('ProfilePersonalDetailsController', [
            '$scope',
            'constants',
            'ProfilePersonalDetailsService',
            'AuthenticationService',
            'UserFactory',
            'NotifierFactory',
            'PasswordService',
            App.controllers.ProfilePersonalDetails
        ]);

}(window.angular));
