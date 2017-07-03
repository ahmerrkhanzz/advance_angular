(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.Text = function () {
        var service = {};

        service.countWords = function (text) {
            if (text && text.length > 0) {
                text = text.replace(/<(?:.|\n)*?>/gm, '').replace(/&amp;nbsp;/g, '').replace(/&nbsp;/g, '').trim();
                return text.length ? text.split(/\s+/).length : 0;
            }

            return 0;
        };

        service.cleanHtmlTags = function (text) {
            if (text && text.length > 0 && service.countWords(text) !== 0) {
                return text.replace(/<[^>]+>/gm, "").trim();
            }

            return [];
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('TextService', [
            App.services.Text
        ]);
}(window.angular));
