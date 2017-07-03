(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { factories: {} });

    App.factories.TmProfileOverview = function() {
        var selectedTabId = 0;
        return {
            setSelectedTabId : function (tabId) {
                selectedTabId = tabId;
            },
            isFaqSelected: function () {
                return selectedTabId === 1;
            },
            isOverviewSelected: function () {
                return selectedTabId === 0;
            }
        };
    };

    angular
        .module('qsHub')
        .factory('TmProfileOverviewFactory', [
            App.factories.TmProfileOverview
        ]);

}(window.angular));
