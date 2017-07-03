(function(angular, moment) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {factories:{}});

    App.factories.institutionsListSubscriptions = function () {
        var hasSubscriptionsChanges;
        return {
            setHasSubscriptionsChanges: function (has) {
                hasSubscriptionsChanges = has;
            },
            hasSubscriptionsChanges: function() {
                return hasSubscriptionsChanges;
            }
        };
    };

    angular
        .module('qsHub')
        .factory('InstitutionsListSubscriptionsFactory', App.factories.institutionsListSubscriptions);

}(window.angular, window.moment));
