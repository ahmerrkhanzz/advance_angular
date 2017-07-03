(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {factories:{}});

    App.factories.TmProfileHistoryLog = function () {
        var data = {},
            limit = 1,
            profileType = null,
            inProgress = false,
            loadMoreInProgress = false,
            visible = false,
            reload = false,
            isAdvanced = false,
            triggeredBy = null;

        return {
            getData: function () {
                return data;
            },
            setData: function (newData) {
                data = newData;
            },
            setLogLimit: function (logLimit) {
                if (!logLimit || logLimit < 1 || typeof logLimit === 'undefined') {
                    logLimit = 1;
                }
                limit = logLimit;
            },
            getLogLimit: function () {
                return limit;
            },
            setProfileType: function (newProfileType) {
                profileType = newProfileType;
            },
            getProfileType: function () {
                return profileType;
            },
            isInProgress: function () {
                return inProgress;
            },
            setInProgress: function (status) {
                inProgress = status;
            },
            isLoadMoreInProgress: function () {
                return loadMoreInProgress;
            },
            setLoadMoreInProgress: function (status) {
                loadMoreInProgress = status;
            },
            isVisible: function () {
                return visible;
            },
            setTriggeredBy: function (trigger) {
                triggeredBy = trigger;
            },
            shouldBeVisible: function (trigger) {
                if (triggeredBy === trigger) {
                    triggeredBy = null;
                    return false;
                }
                return true;
            },
            resetTriggeredBy: function () {
                triggeredBy = '';
            },
            setAdvanced: function (advanced) {
                isAdvanced = advanced;
            },
            isAdvanced: function () {
                return isAdvanced;
            },
            setReload: function(triggerReload) {
                reload = triggerReload;
            },
            isReloadRequired: function() {
                return reload;
            }
        };
    };

    angular
        .module('qsHub')
        .factory('TmProfileHistoryLogFactory', [
            '$resource',
            '$q',
            '$log',
            'constants',
            App.factories.TmProfileHistoryLog
        ]);

}(window.angular));
