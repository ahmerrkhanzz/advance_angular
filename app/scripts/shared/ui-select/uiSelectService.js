(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.UiSelect = function () {
        var service = {};

        service.getYesNoOptions = function (excludeNa) {
            excludeNa = excludeNa || false;
            var options = [
                { value: '', label: 'N/A' },
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
            ];
            if (excludeNa) {
                delete options[0];
            }
            return options;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('UiSelectService', [
            App.services.UiSelect
        ]);
}(window.angular));
