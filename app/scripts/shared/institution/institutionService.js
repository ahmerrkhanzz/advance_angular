(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.Object = function () {
        var service = {};

        /**
         *
         * @param {Object} institution
         * @returns {boolean}
         */
        service.isTmViewingEnabled = function (institution) {
            return !!(
                angular.isDefined(institution) &&
                institution &&
                institution.enabled &&
                institution.enabled.tm &&
                institution.hasOwnProperty('nids') &&
                institution.nids !== null &&
                institution.nids.hasOwnProperty('tm') &&
                institution.nids.tm
            );
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('InstitutionService', [
            App.services.Object
        ]);
}(window.angular));
