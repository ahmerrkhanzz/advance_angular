(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.usersInstitutions = function (
        constants,
        InstitutionsUsersFactory
    ) {
        var controller = this;
        controller.devMode = constants.dev;

        /**
         * Class constructor.
         */
        controller.init = function () {
            InstitutionsUsersFactory.setRequestFilters({});
        };

        controller.init();
    };

    angular
        .module('qsHub')
        .controller('InstitutionsUsersController', [
            'constants',
            'InstitutionsUsersFactory',
            App.controllers.usersInstitutions
        ]);

}(window.angular));
