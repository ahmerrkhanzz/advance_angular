(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.AdminDashboard = function (
        constants
    ) {
        var service = {};

        service.getUserRoleNames = function (userRoles, rolesList) {
            var result = [],
                totalUserRoles = userRoles ? userRoles.length : 0,
                totalRoles = rolesList ? rolesList.length : 0,
                i,
                y;

            if (totalUserRoles) {
                for (i = 0; i < totalUserRoles; i++) {
                    for (y = 0; y < totalRoles; y++) {
                        if (rolesList[y].roleHandle === userRoles[i]) {
                            if (rolesList[y].roleHandle === constants.globalAdminRole) {
                                return [rolesList[y].roleName];
                            }
                            result.push(rolesList[y].roleName);
                        }

                    }
                }
            }

            return result.sort();
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('AdminDashboardService', [
            'constants',
            App.services.AdminDashboard
        ]);

}(window.angular));
