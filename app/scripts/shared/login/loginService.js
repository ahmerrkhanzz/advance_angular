(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.LoginService = function (constants, $location) {
        var service = {};

        /**
         * Allowed to login as institution?
         *
         * @param {Object} institution
         * @returns {boolean}
         */
        service.allowLoginAs = function (institution) {
            return institution && institution.active && institution.typeId && (
                institution.typeId === constants.typeId.topLevelInstitutionId ||
                institution.typeId === constants.typeId.clientDepartmentId ||
                institution.typeId === constants.typeId.advancedProgramId ||
                institution.typeId === constants.typeId.internalId
            ) ? true : false;
        };

        /**
         * Actions to do when login as button clicked
         * @param  {[Object]} parameters
         * @returns {boolean}
         */
        service.getTuProfilesRedirect = function (parameters) {
            $location.path(constants.defaultClientPage).search(parameters);
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('LoginService', [
            'constants',
            '$location',
            App.services.LoginService
        ]);
}(window.angular));
