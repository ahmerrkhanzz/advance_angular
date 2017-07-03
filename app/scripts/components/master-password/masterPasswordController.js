(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.masterPassword = function (
        $interval,
        MasterPasswordService
    ) {
        var controller = this,
            timer;

        controller.masterPassword = {
            loaded: false, // master password was retrieved
            ttl: 0, // master password time to live
            enabled: false,
            success: false,
            expired: false,
            password: null,
            from: null,
            to: null,
            currentDate: new Date().getTime()
        };

        controller.timeLeftPercentage = function () {
            return controller.isExpired() ? 0 : Math.round(
                controller.secondsLeft() * 100 / controller.masterPassword.ttl
            );
        };

        controller.getTime = function () {
            return MasterPasswordService.getTime();
        };

        controller.secondsLeft = function () {
            return !controller.masterPassword.to ? null : controller.masterPassword.to - controller.getTime();
        };

        controller.isExpired = function () {
            return controller.secondsLeft() <= 0;
        };

        controller.getMasterPasswordCallback = function (response) {
            controller.masterPassword.loaded = true;
            if (
                response &&
                response.hasOwnProperty('password') &&
                response.hasOwnProperty('createdAt') &&
                response.hasOwnProperty('enabled') &&
                response.hasOwnProperty('ttl')
            ) {
                controller.masterPassword.password = atob(response.password);
                controller.masterPassword.enabled = response.enabled;
                controller.masterPassword.ttl = response.ttl * 1000;
                controller.masterPassword.from = new Date(response.createdAt);
                controller.masterPassword.to = new Date(response.createdAt + controller.masterPassword.ttl);
                controller.masterPassword.success = true;
                controller.initTimers();
            }
        };

        controller.updateTime = function () {
            if (controller.isExpired()) {
                $interval.cancel(timer);
            }
        };

        controller.initTimers = function () {
            if (!controller.isExpired()) {
                // force view digest for timers to get updated
                timer = $interval(controller.updateTime, 1000);
            }
        };

        controller.getMasterPassword = function () {
            // get master password data from API
            MasterPasswordService.get().then(controller.getMasterPasswordCallback);
        };

        controller.init = function () {
            controller.getMasterPassword();
        };

        controller.init();
    };

    angular
        .module('qsHub')
        .controller('MasterPasswordController', [
            '$interval',
            'MasterPasswordService',
            App.controllers.masterPassword
        ]);

}(window.angular));
