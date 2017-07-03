(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { factories: {} });

    App.factories.tmProfileOverviewHistoryLog = function() {
        var faqVisible = false,
            overviewVisible = false,
            loadMoreInProgress = false,
            loadMore = false,
            logs = [],
            limit;

        return {
            isFaqVisible: function () {
                return faqVisible;
            },
            isOverviewVisible: function () {
                return overviewVisible;
            },
            setFaqVisible: function (isVisible) {
                faqVisible = isVisible;
                if (faqVisible) {
                    overviewVisible = false;
                }
            },
            setOverviewVisible: function (isVisible) {
                overviewVisible = isVisible;
                if (overviewVisible) {
                    faqVisible = false;
                }
            },
            closeAll: function () {
                overviewVisible = false;
                faqVisible = false;
            },
            setLogs: function (data) {
                logs = data;
            },
            getLogs: function () {
                return logs;
            },
            setLimit: function (newLimit) {
                limit = newLimit;
            },
            getLimit: function () {
                return limit || 1;
            },
            isLoadMoreInProgress: function () {
                return loadMoreInProgress;
            },
            setLoadMoreInProgress: function (inProgress) {
                loadMoreInProgress = inProgress;
            },
            loadMore: function (more) {
                loadMore = typeof more === 'undefined' ? true : more;
            },
            isLoadMoreRequest: function () {
                return loadMore;
            }
        };
    };

    angular
        .module('qsHub')
        .factory('TmProfileOverviewHistoryLogFactory', [
            App.factories.tmProfileOverviewHistoryLog
        ]);

}(window.angular));
