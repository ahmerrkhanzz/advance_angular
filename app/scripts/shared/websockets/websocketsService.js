(function(angular, socketIo) {
    'use strict';

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.WebSockets = function ($rootScope, constants) {
        var service = this,
            subscribeEvent = 'subscribe',
            hostname = constants.webSockets.host,
            socket;
        if (constants.webSockets.port && !isNaN(constants.webSockets.port)) {
            hostname += ':' + constants.webSockets.port ;
        }
        socket = socketIo.connect(hostname);

        /**
         * Listen to event messages.
         *
         * @param {String} eventName
         * @param {Function|null} callback
         */
        service.listen = function (eventName, callback) {
            socket.on(eventName, function () {
                if (callback) {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                }
            });
        };

        /**
         * Send event message.
         *
         * @param {String} eventName
         * @param {mixed} data
         * @param {Function|null} callback
         */
        service.send =  function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                if (callback) {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                }
            });
        };

        /**
         * Subscribe to a room.
         *
         * @param {String} room
         * @param {String|null} eventName
         * @param {Function|null} callback
         */
        service.subscribe = function (room, eventName, callback) {
            service.send(subscribeEvent, room);
            if (eventName) {
                service.listen(eventName, callback);
            }
        };

        return service;
    };

    angular
        .module('qsHub')
        .factory('WebSocketsService', ['$rootScope', 'constants', App.services.WebSockets]);

}(window.angular, io));