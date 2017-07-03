(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {factories:{}});

    App.factories.InstitutionsUsers = function () {
        var defaultRequestFilters = null,
            requestFilters;
        return {
            getRequestFilters: function () {
                return requestFilters || angular.copy(defaultRequestFilters);
            },
            setRequestFilters: function (newRequestFilters) {
                requestFilters = newRequestFilters;
            },
            resetRequestFilters : function () {
                requestFilters = angular.copy(defaultRequestFilters);
            }
        };
    };

    angular
        .module('qsHub')
        .factory('InstitutionsUsersFactory', [App.factories.InstitutionsUsers]);

}(window.angular));
