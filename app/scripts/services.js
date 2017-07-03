(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.InstitutionsService = function ($resource, $log, constants, RequestsQueueService) {
        var service = {};

        /**
         * Get institutions list API endpoint.
         *
         * @returns {$resource}
         */
        service.getInstitutionListModel = function () {
            return $resource(constants.api.institutions.url + '/v1/list/all/:id', null, {
                get: {
                    isArray:false,
                    cancellable : true
                }
            });
        };

        service.getInstitutionData = function (coreId, columnsToFetch) {
            if (!coreId) {
                return false;
            }
            coreId = parseInt(coreId, 10);

            var queueName = 'getInstitutionData',
                filters = {
                    'filter[coreId]': coreId,
                    limit: 1
                };
            if (columnsToFetch && columnsToFetch.length) {
                filters['columns[]'] = columnsToFetch;
            }
            queueName += angular.toJson(filters);
            // cancel currently running requests
            RequestsQueueService.cancelAll(queueName);

            var Api = service.getInstitutionListModel().get(filters);

            // add new request to the queue
            RequestsQueueService.add(Api, queueName);

            return Api.$promise.then(function(data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return data;
            }, function(error) {
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return [];
            });
        };

        return service;
    };

    /**
     * Requests queues.
     *
     * @constructor
     */
    App.services.RequestsQueue = function () {
        var queue = [],
            defaultQueue = 'default';

        /**
         * Add request to the queue.
         *
         * @param {Object} request
         * @param {null|String} queueName
         */
        this.add = function(request, queueName) {
            queueName = queueName || defaultQueue;
            if (!queue[queueName]) {
                queue[queueName] = [];
            }
            queue[queueName].push(request);
        };

        /**
         * Cancel queue requests.
         *
         * @param {null|String} queueName
         * @returns {boolean}
         */
        this.cancelAll = function (queueName) {
            queueName = queueName || defaultQueue;
            if (!queue[queueName]) {
                return false;
            }
            queue[queueName].forEach(function (request) {
                request.$cancelRequest();
            });
            delete queue[queueName];
        };
    };

    angular
        .module('qsHub')
        .service('InstitutionsService', [
            '$resource',
            '$log',
            'constants',
            'RequestsQueueService',
            App.services.InstitutionsService
        ])
        .service('RequestsQueueService', [
            App.services.RequestsQueue
        ]);
}(window.angular));
