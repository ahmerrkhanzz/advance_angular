(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services: {}});

    App.services.TuMediaBrochuresService = function (
        $resource,
        $q,
        $log,
        constants,
        TuMediaService,
        TuMediaVideosService
    ) {
        var service = {
            triggerChange: 0
        };

        service.getBrochureModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tu-profile/:id/brochure/:brochureId', null, {
                update: {method: 'PATCH'}
            });
        };

        service.getBrochuresOrderingModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tu-profile/:id/brochuresOrder', null, {
                update: {method: 'PATCH'}
            });
        };

        /**
         * Save Brochure
         *
         * @param institutionId
         * @param brochure
         * @returns {*}
         */
        service.saveBrochure = function (institutionId, brochure) {
            var brochureModel = service.getBrochureModel(),
                brochureSubmit = service.formatBrochure(brochure);
            if (angular.isDefined(brochureSubmit.id) && brochureSubmit.id.length > 0) {
                // update brochure
                return brochureModel.update(
                    {id: institutionId, brochureId: brochure.id},
                    {
                        name: brochureSubmit.name,
                        url: brochureSubmit.url,
                        orderType: brochureSubmit.orderType,
                        assignedTo: brochureSubmit.assignedTo
                    }
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
            } else {
                // create new brochure
                return brochureModel.save(
                    {id: institutionId, brochureId: brochureSubmit.id},
                    {
                        name: brochureSubmit.name,
                        url: brochureSubmit.url,
                        orderType: brochureSubmit.orderType,
                        assignedTo: brochureSubmit.assignedTo
                    }
                ).$promise.then(function (data) {
                    if (constants.dev) {
                        $log.log('success, got data: ', data);
                    }
                    return data.insertedId;
                }, function (error) {
                    //@todo log error
                    if (constants.dev) {
                        $log.log('request failed' + error);
                    }
                    return false;
                });
            }
        };

        /**
         * Save brochure order.
         *
         * @param {string} id - Institution TU profile mongo ID
         * @param {Object} brochures
         * @returns {Promise}
         */
        service.saveOrder = function (id, brochures) {
            var institutionModel = service.getBrochuresOrderingModel();

            return institutionModel.update(
                {id: id},
                {'brochures': TuMediaVideosService.formatForOrdering(brochures)}
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
         * Delete brochure.
         *
         * @param institutionId
         * @param brochure
         * @returns {*}
         */
        service.deleteBrochure = function (institutionId, brochure) {
            service.setHasErrors(false);
            var brochureModel = service.getBrochureModel();
            return brochureModel.delete(
                {id: institutionId, brochureId: brochure.id}
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
         * Set selected brochure.
         *
         * @param item
         */
        service.setSelectedBrochure = function (item) {
            service.selectedBrochure = item;
        };

        service.replaceByKey = function (key) {
            angular.forEach(service.getBrochureItems(), function(itemValue, itemKey) {
                if(itemValue.id === key) {
                    service.getBrochureItems()[itemKey] = service.getSelectedBrochure();
                }
            });
        };

        /**
         * Get selected brochure
         *
         * @returns {*}
         */
        service.getSelectedBrochure = function () {
            return service.selectedBrochure;
        };

        /**
         * Trigger filter.
         *
         * @param triggerChange
         */
        service.setTriggerChange = function (triggerChange) {
            service.triggerChange = triggerChange;
        };

        /**
         * Get trigger filter value
         *
         * @returns {*}
         */
        service.getTriggerChange = function () {
            return service.triggerChange;
        };

        /**
         * Trigger filter.
         *
         * @param triggerChange
         */
        service.setTriggerReset = function (triggerChange) {
            service.triggerChange = triggerChange;
        };

        /**
         * Get trigger filter value
         *
         * @returns {*}
         */
        service.getTriggerReset = function () {
            return service.triggerChange;
        };

        /**
         * Set brochure items.
         *
         * @param items
         * @param transform
         */
        service.setBrochureItems = function (items, transform) {
            if (!angular.isDefined(transform)) {
                transform = true;
            }
            if (transform) {
                var typeMaster = TuMediaService.typeOverview(),
                    typeUg = TuMediaService.typeUndergraduate(),
                    typePg = TuMediaService.typePostgraduate();

                angular.forEach(items, function (value, key) {
                    items[key][typeMaster] = false;
                    items[key][typeUg] = false;
                    items[key][typePg] = false;
                    angular.forEach(items[key].assignedTo, function (aValue) {
                        if (aValue === typeMaster) {
                            items[key][typeMaster] = true;
                        } else if (aValue === typeUg) {
                            items[key][typeUg] = true;
                        } else if (aValue === typePg) {
                            items[key][typePg] = true;
                        }
                    });
                    /**
                     * Set initial order
                     * @type {{master: number, ug: number, pg: number}}
                     */
                    if (items[key].orderType === null) {
                        items[key].orderType = {
                            'master': 0,
                            'ug': 0,
                            'pg': 0
                        };
                    }
                    var orderOverview = 0;
                    var orderUndergraduate = 0;
                    var orderPostgraduate = 0;
                    if (angular.isDefined(items[key].orderType)) {
                        if (angular.isDefined(items[key].orderType[typeMaster])) {
                            orderOverview = items[key].orderType[typeMaster];
                        }
                        if (angular.isDefined(items[key].orderType[typeUg])) {
                            orderUndergraduate = items[key].orderType[typeUg];
                        }
                        if (angular.isDefined(items[key].orderType[typePg])) {
                            orderPostgraduate = items[key].orderType[typePg];
                        }
                    }
                    items[key].orderType = {
                        'master': orderOverview,
                        'ug': orderUndergraduate,
                        'pg': orderPostgraduate
                    };
                    if (angular.isDefined(items[key]._id)) {
                        items[key].id = items[key]._id;
                    }
                    delete items[key].assignedTo;
                    delete items[key]._id;
                });
            }

            service.brochureItems = items;
        };

        /**
         * Get brochure items.
         *
         * @returns {*}
         */
        service.getBrochureItems = function () {
            return service.brochureItems;
        };

        /**
         * Get brochure item.
         */
        service.getItemBrochure = function () {
            var orderTypes = {};
            orderTypes[TuMediaService.typeOverview()] = 0;
            orderTypes[TuMediaService.typeUndergraduate()] = 0;
            orderTypes[TuMediaService.typePostgraduate()] = 0;
            return {
                'id': '',
                'name': '',
                'description': '',
                'master': true,
                'ug': true,
                'pg': true,
                'orderType': orderTypes,
                'url': '',
                'imageUrl': null
            };
        };

        /**
         * Reset brochure item.
         *
         * @param item
         * @returns {*}
         */
        service.resetItem = function (item) {
            item.master = true;
            item.ug = true;
            item.pg = true;
            item.url = '';
            item.name = '';
            item.imageUrl = null;

            return item;
        };

        /**
         * Format brochures.
         *
         * @param brochures
         * @returns {*}
         */
        service.formatBrochures = function (brochures) {
            angular.forEach(brochures, function (value, key) {
                brochures[key] = service.formatBrochure(value);
            });

            return brochures;
        };

        /**
         * Format to match db data.
         *
         * @param {Object} brochure
         * @returns {Object}
         */
        service.formatBrochure = function (brochure) {
            brochure.assignedTo = [];
            if (brochure.master) {
                brochure.assignedTo.push('master');
            }
            if (brochure.ug) {
                brochure.assignedTo.push('ug');
            }
            if (brochure.pg) {
                brochure.assignedTo.push('pg');
            }
            /**
             * Remove data we don't want to send.
             */
            if (angular.isDefined(brochure.id) && parseInt(brochure.id, 10) === 0) {
                delete brochure.id;
            }
            delete brochure.master;
            delete brochure.ug;
            delete brochure.pg;
            delete brochure.order;

            return brochure;
        };

        /**
         * Sets has errors flag.
         *
         * @param {boolean} hasErrors
         */
        service.setHasErrors = function (hasErrors) {
            service.hasErrors = hasErrors;
        };

        /**
         * Gets has errors flag.
         *
         * @returns {boolean|*}
         */
        service.getHasErrors = function () {
            return service.hasErrors;
        };

        /**
         * Sets is highlighted.
         *
         * @param {boolean} isHighlighted
         */
        service.setHighlighted = function (isHighlighted) {
            service.isHighlighted = isHighlighted;
        };

        /**
         * Gets is Highlighted.
         *
         * @returns {boolean|*}
         */
        service.getHighlighted = function () {
            return service.isHighlighted;
        };

        service.coreId = function (coreId) {
            service.coreId = coreId;
        };

        /**
         * Set type.
         *
         * @returns {*}
         */
        service.setType = function (type) {
            service.type = type;
        };

        /**
         * Get type.
         *
         * @returns {*}
         */
        service.getType = function () {
            return service.type;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('TuMediaBrochuresService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            'TuMediaService',
            'TuMediaVideosService',
            App.services.TuMediaBrochuresService
        ]);

}(window.angular));
