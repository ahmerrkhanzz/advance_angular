(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.userTypes = function (
    ) {
        var service = {
            userTypes: [
                {
                    uniqueId: 1,
                    name: 'Contact',
                    disabled: true
                },
                {
                    uniqueId: 2,
                    name: 'User',
                    disabled: false
                }
            ]
        };

        service.getUserTypes = function () {
            return service.userTypes;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('UserTypesService', [
            App.services.userTypes
        ]);
}(window.angular));
