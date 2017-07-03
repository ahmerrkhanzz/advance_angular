(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.TuProfileService = function (
        $resource,
        $q,
        $log,
        constants
    ) {
        var service = {
            overviewData : [],
            institutionData: null,
            tuOverviewHistory : null,
            deferred : {
                getOverviewData: null,
                getInstitutionData: null,
                getTuOverviewHistory: null
            },
            belongsTo: {
                all : 'all',
                ug: 'ug',
                pg: 'pg'
            },
        };

        /**
         * Get institutions list API endpoint.
         *
         * @returns {$resource}
         */
        service.getInstitutionListModel = function () {
            return $resource(constants.api.institutions.url + '/v1/list/all/:id');
        };

        /**
         * Get institution API endpoint.
         *
         * @returns {$resource}
         */
        service.getTuProfileModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tu-profile/:id', null, {
                 update: { method:'PATCH' }
            });
        };

        /**
         * Get institutions  API endpoint.
         *
         * @returns {$resource}
         */
        service.getInstitutionModel = function () {
            return $resource(constants.api.institutions.url + '/v1/institution/:id', null, {
                update: { method:'PATCH' }
            });
        };

        /**
         * Get tu profile upgrade requests end point.
         *
         * @returns {$resource}
         */
        service.getUpgradeRequestModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tu-profile/:id/upgrade-request');
        };

        /**
         * Update tuProfile data.
         *
         * @param {string} id
         * @param {Object} data
         * @returns {Promise}
         */
        service.updateTuProfile = function (id, data) {
            // @todo do validation
            var TuProfileModel = service.getTuProfileModel();
            return TuProfileModel.update(
                {id: id},
                data
            ).$promise.then(function (data) {
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


        /**
         * Update institution data.
         *
         * @param {string} id
         * @param {Object} data
         * @returns {Promise}
         */
        service.updateInstitution = function (id, data) {
            // @todo do validation
            var InstitutionModel = service.getInstitutionModel();
            return InstitutionModel.update(
                {id: id},
                data
            ).$promise.then(function (data) {
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

        /**
         * Get institution profile API endpoint by Core ID.
         *
         * @param {int} coreId
         * @returns {$resource}
         */
        service.getTuByCoreIdModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tu-profile/core-id/:id', null, {
                get: {
                    cancellable: true
                }
            });
        };
        
        /**
         * Get institution TU profile data by Core ID.
         *
         * @param {int} coreId
         * @returns {Promise}
         */
        service.getTuProfileData = function (coreId) {
            if (!coreId) {
                throw 'Missing Required';
            }

            var Api = service.getTuByCoreIdModel(coreId);
            return Api.get({id: coreId}).$promise.then(function (data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }

                return data.toJSON();
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return [];
            });
        };

        /**
         * Send TU profile upgrade request.
         *
         * @param {String} tuProfileId
         * @param {String|null} comments
         * @returns {Promise}
         */
        service.sendUpgradeRequest = function (tuProfileId, comments) {
            if (!tuProfileId) {
                throw 'Missing Required';
            }

            var Api = service.getUpgradeRequestModel();
            return Api.save({id: tuProfileId}, {
                comments: comments
            }).$promise.then(function (data) {
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

        /**
         * Get belongs to list.
         *
         * @returns {array}
         */
        service.getBelongsToList = function (grid) {
            grid = grid || false;

            return grid ? [
                {value: service.belongsTo.all, label: 'All'},
                {value: service.belongsTo.ug, label: 'Undergraduate'},
                {value: service.belongsTo.pg, label: 'Postgraduate'}
            ] : [
                {id: service.belongsTo.all, title: 'All'},
                {id: service.belongsTo.ug, title: 'Undergraduate'},
                {id: service.belongsTo.pg, title: 'Postgraduate'}
            ];
        };

        /**
         * Get belongs to name by ID.
         *
         * @param {int} belongsTo
         * @returns {string}
         */
        service.getBelongsToName = function (belongsTo) {
            switch (belongsTo) {
                case service.belongsTo.ug:
                    return 'Undergraduate';
                case service.belongsTo.pg:
                    return 'Postgraduate';
                default:
                    return 'All';
            }
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('TuProfileService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            App.services.TuProfileService
        ]);

}(window.angular));
