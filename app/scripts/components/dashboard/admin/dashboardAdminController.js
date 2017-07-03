(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.adminDashboard = function (
        $scope, constants, UserFactory, QsUsersListService, AdminDashboardService
    ) {
        var controller = this;
        controller.devMode = constants.dev;

        controller.loadData = function () {
            QsUsersListService.getRoles().then(function (rolesList) {
                var userData = UserFactory.getData();
                $scope.userRoles = AdminDashboardService.getUserRoleNames(
                    userData && userData.roles  ? userData.roles : [],
                    rolesList
                );
            });
        };

        controller.init = function () {
            controller.loadData();
        };

        controller.init();
    };

    angular
        .module('qsHub')
        .controller('AdminDashboardController', [
            '$scope',
            'constants',
            'UserFactory',
            'QsUsersListService',
            'AdminDashboardService',
            App.controllers.adminDashboard
        ]);

} (window.angular));
