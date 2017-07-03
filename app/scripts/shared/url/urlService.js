(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.Url = function () {
        var service = {},
            youtubeIdPattern = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/,
            youtubePattern = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([A-Za-z0-9\-_]){11}$|(\&t=\d+s)$/,
            pattern = /^((?:http|ftp)s?:\/\/)(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?(?:\/?|[\/?]\S+)$/i;

        /**
         * Prepend http into the url.
         *
         * @params {String} url
         * @returns {String}
         */
        service.prependHttp = function (url) {
            if (url && url.length && !/^(f|ht)tps?:\/\//i.test(url)) {
                url = 'http://' + url;
            }
            return url;
        };

        /**
         * Get the youtube id from url
         *
         * @param {string} url
         * @returns {string}
         */
        service.extractYoutubeIdFromUrl = function (url) {
            var match = url.match(youtubeIdPattern);
            if (match && match[1].length === 11) {
                return match[1];
            }
        };

        service.getPattern = function() {
            return pattern;
        };

        service.getYoutubePattern = function() {
            return youtubePattern;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('UrlService', [
            App.services.Url
        ]);
}(window.angular));
