(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { services: {} });

    App.services.TmProfileProgramsStatsService = function(
        $resource,
        $log,
        constants
    ) {
        var service = {};

        service.getFetchModel = function() {
            return $resource(
                constants.api.institutions.url + '/v1/list/tm-programs?filter[institutionCoreId]==:coreId&page=1&limit=1',
                {},
                {
                    get: {
                        cancellable: true
                    }
                }
            );
        };

        /**
         * Get programs create API endpoint.
         *
         * @returns {$resource}
         */
        service.getStatsModel = function() {
            return $resource(constants.api.institutions.url + '/v1/tm-program/:id/stats', null, {
                update: { method: 'PATCH' }
            });
        };

        /**
         * Get program statistics by its institution Core Id.
         *
         * @param {Number} coreId
         * @returns {Promise.<TResult>}
         */
        service.getStats = function (coreId) {
            if (!coreId) {
                throw 'Missing Required';
            }
            return service.getFetchModel().get({coreId: coreId}).$promise.then(function (data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return data.results ? {
                        id: data.results[0].id,
                        stats: data.results[0].stats,
                        specialisations: data.results[0].specialisations,
                        coreId: data.results[0].coreId,
                        institutionCoreId: data.results[0].institutionCoreId,
                        nodeId: data.results[0].nodeId,
                        status: data.results[0].status
                } : {};
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return {};
            });
        };

        /**
         * Update program statistics.
         *
         * @param {String} id
         * @param {Object} stats
         * @returns {Promise.<TResult>}
         */
        service.update = function (id, stats) {
            if (!id) {
                throw 'Missing Required';
            }
            return service.getStatsModel().update({id: id}, stats).$promise.then(function (data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return true;
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return false;
            });
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('TmProfileProgramStatsService', [
            '$resource',
            '$log',
            'constants',
            App.services.TmProfileProgramsStatsService
        ]);

}(window.angular));
