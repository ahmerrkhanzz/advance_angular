(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {factories:{}});

    App.factories.InstitutionsUsersListFactory = function () {
        var selectedTabId = null,
            activeUserId = null,
            tabs = {
                personal : 0,
                permissions : 1,
                institutions : 2
            };

        return {
            setSelectedTabId: function (newSelectedTabId) {
                selectedTabId = newSelectedTabId;
            },
            isInstitutionsTabSelected: function () {
                return (typeof selectedTabId !== 'undefined') && selectedTabId === tabs.institutions;
            },
            setActiveUserId: function (newActiveUserId) {
                activeUserId = newActiveUserId;
            },
            resetActiveUserId: function () {
                activeUserId = null;
            },
            getActiveUserId: function () {
                return activeUserId;
            }
        };
    };

    angular
        .module('qsHub')
        .factory('InstitutionsUsersListFactory', [App.factories.InstitutionsUsersListFactory]);

}(window.angular));
