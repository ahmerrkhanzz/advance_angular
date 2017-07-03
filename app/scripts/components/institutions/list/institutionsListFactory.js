(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {factories:{}});

    App.factories.institutionsList = function () {
        var selectedTabId = null,
            tabIds = {
                subscriptions: 1,
                campuses : 2,
                status: 5
            },
            isReload = false,
            invalidDates,
            campuses;
        return {
            setSelectedTabId: function (newSelectedTabId) {
                selectedTabId = newSelectedTabId;
            },
            hasSelectedTab: function () {
                return selectedTabId !== null;
            },
            isCampusesTabSelected: function () {
                return (typeof selectedTabId !== 'undefined') && (selectedTabId === tabIds.campuses);
            },
            isSubscriptionsTabSelected: function () {
                return (typeof selectedTabId !== 'undefined') && (selectedTabId === tabIds.subscriptions);
            },
            isStatusTabSelected: function () {
                return (typeof selectedTabId !== 'undefined') && (selectedTabId === tabIds.status);
            },
            setCampuses: function (newCampuses) {
                campuses = newCampuses;
            },
            getCampuses: function () {
                return campuses;
            },
            setInvalidDates: function(val) {
                invalidDates = val;
            },
            isInvalidDates: function() {
                return invalidDates;
            },
            setReloadInstitutionList: function(val) {
                isReload = val;
            },
            isInstitutionListReload: function() {
                return isReload;
            }
        };
    };

    angular
        .module('qsHub')
        .factory('InstitutionsListFactory', App.factories.institutionsList);

}(window.angular));
