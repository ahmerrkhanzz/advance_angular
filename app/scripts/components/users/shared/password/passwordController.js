(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});
    App.controllers.Password = function (
        $scope,
        PasswordService,
        WatchService
    ) {
        var controller = this;

        controller.defaultConfig = {
            resetOnLogin: true,
            label: null,
            labelClass: null,
            blockClass: 'row'
        };
        PasswordService.setHasErrors(true);
        controller.isValid = function () {
            return PasswordService.isPasswordValid(controller.user.password);
        };

        controller.isRequired = function () {
            return controller.user && controller.user.id || controller.user.coreId ? false : true;
        };

        controller.handleChanges = function () {
            controller.isValid();
            controller.user.password = controller.user.password.split(' ').join('');
            controller.validators = PasswordService.validatePassword(controller.user.password);
            PasswordService.setHasErrors(!!controller.user.password.length);
        };

        controller.initValidators = function () {
            // get validation rules without password match
            var validators = PasswordService.getPasswordValidator();
            controller.validators = validators.splice(0, validators.length - 1);
        };

        controller.userWatch = function () {
            controller.initValidators();
        };

        controller.initWatches = function () {
            WatchService.create($scope, function () {
                return controller.user;
            }, controller.userWatch);

            WatchService.create($scope, function () {
                return controller.resetValidators;
            }, controller.userWatch);

            //watch for password entered
            WatchService.create($scope, PasswordService.getHasErrors, function (newValue) {
                newValue = controller.isRequired() ?  newValue : true;
                controller.isPassLen = newValue;
            });
        };

        controller.$onInit = function () {
            controller.initValidators();
            controller.initWatches();
            controller.cnf = angular.extend({}, controller.defaultConfig, controller.config);
        };
    };

    angular
        .module('qsHub')
        .controller('PasswordController', [
            '$scope',
            'PasswordService',
            'WatchService',
            App.controllers.Password
        ]);

}(window.angular));
