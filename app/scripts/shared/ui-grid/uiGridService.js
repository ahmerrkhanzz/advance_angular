(function (angular) {
    'use strict';

    var App = App || {};
    App = angular.extend({}, App, { services: {} });

    App.services.UiGrid = function (
        $localStorage,
        Grid,
        UserFactory
    ) {
        var service = {},
            exploded,
            clear = Grid.prototype.clearAllFilters;

        service.getKey = function (nameSpace) {
            return nameSpace + UserFactory.getData().coreId;
        };

        /**
        * Set qs users datagrid columns filters.
        *
        * @param {string} nameSpace
        * @param {Object} columnsFilters
        */
        service.storeColumnsFilters = function (nameSpace, columnsFilters) {
            $localStorage[service.getKey(nameSpace)] = columnsFilters;
        };

        /**
         * Get qs users datagrid columns filters.
         *
         * @param {string} nameSpace
         * @param {array} dateFilters
         */
        service.getColumnsFilters = function (nameSpace, dateFilters) {
            if (typeof $localStorage[service.getKey(nameSpace)] !== 'undefined') {
                return $localStorage[service.getKey(nameSpace)];
            }

            var filters = {};
            if (angular.isDefined(dateFilters) &&
                angular.isArray(dateFilters) &&
                dateFilters.length > 0
            ) {
                angular.forEach(dateFilters, function (filterName) {
                    filters[filterName] = {
                        startDate: null,
                        endDate: null
                    };
                });
            }

            return filters;
        };

        /**
         * Set qs users datagrid columns visibility.
         *
         * @param {string} nameSpace
         * @param {Object} columnsVisibility
         */
        service.storeColumnsVisibility = function (nameSpace, columnsVisibility) {
            $localStorage[service.getKey(nameSpace)] = columnsVisibility;

            // Clear filters for the hidden columns
            var filterNameSpace = nameSpace.replace('Visibility', 'Filters'),
                columnsFilters = service.getColumnsFilters(filterNameSpace);

            if (columnsFilters) {
                angular.forEach(columnsVisibility, function (value, key) {
                    if (value === false) {
                        columnsFilters['filter[' + key + ']'] = null;
                    }
                });
                service.storeColumnsFilters(columnsFilters);
            }

            return columnsFilters;
        };

        /**
         * Get qs users datagrid columns visibility.
         *
         * @param {string} nameSpace
         * @returns {Object|*}
         */
        service.getColumnsVisibility = function (nameSpace) {
            return $localStorage[service.getKey(nameSpace)];
        };

        /**
         * Returns the names of the columns with its visibility (true visible, false not visible)
         *
         * @param {object|$scope.gridOptions.columnDefs} columns
         * @returns {object}
         */
        service.getGridColumnsVisibility = function (columns) {
            var visibility = {};
            angular.forEach(columns, function (column) {
                if (angular.isDefined(column.visible) && angular.isDefined(column.field)) {
                    visibility[column.field] = column.visible;
                }
            });

            return visibility;
        };

        /**
         * Gets visibility based on field name
         *
         * @param {object} columns
         * @param {string} fieldName
         * @param {boolean} defaultValue
         * @returns boolean
         */
        service.getVisibilityByField = function (columns, fieldName, defaultValue) {
            return angular.isDefined(columns) && angular.isDefined(columns[fieldName]) ?
                columns[fieldName] : defaultValue;
        };

        /**
         * Gets filter based on field name
         *
         * @param {Object} filters
         * @param {String} fieldName
         * @param {mixed|null} defaultValue
         * @returns {Object}
         */
        service.getFilterByField = function (filters, fieldName, defaultValue) {
            var filter = 'filter[' + fieldName + ']',
                defaultVal = typeof defaultValue === 'undefined' ? null : defaultValue;

            return typeof filters[filter] === 'undefined' ? defaultVal : filters[filter];
        };

        /**
         * Removes localstorage by key
         *
         * @param {string} nameSpace
         */
        service.removeByNameSpace = function (nameSpace) {
            $localStorage.removeItem(service.getKey(nameSpace));
        };

        /**
         *
         * @param {type} column
         * @returns {undefined}
         */
        service.applyFilters = function (column) {
            if (column.filters[0].type !== 'select') {
                if (column.filters[0].term.indexOf('=') > -1) {
                    column.filters[0].condition = new RegExp('^' + column.filters[0].term.replace(' ', '\\s').replace('=', '') + '$', 'i');
                } else if (column.filters[0].term.indexOf('%') > -1) {
                    column.filters[0].condition = new RegExp(column.filters[0].term.replace('%', '(.*).+'), 'i');
                } else if (column.filters[0].term.indexOf(',') > -1) {
                    exploded = column.filters[0].term.split(',');
                    angular.forEach(exploded, function (values, key) {
                        exploded[key].replace(' ', '\\s');
                        exploded[key] = '(\\b' + values + '\\b)';
                    });
                    column.filters[0].condition = new RegExp(exploded.join('|'), 'i');
                } else if (column.filters[0].term.indexOf('&') > -1) {
                    exploded = column.filters[0].term.split('&');
                    angular.forEach(exploded, function (values, key) {
                        exploded[key].replace(' ', '\\s');
                        exploded[key] = '(?=.*' + values + ')';
                    });
                    column.filters[0].condition = new RegExp(exploded.join(''), 'i');
                }
            }
        };

        /**
         *
         * @param {type} columns
         * @returns {undefined}
         */
        service.resetConditions = function (columns) {
            angular.forEach(columns, function (column) {
                delete (column.filters[0].condition);
            });
        };

        /**
         * Extend clear all filters u-grid function
         *
         * @param {object} columnBefore
         * @param {object} columnDefs
         * @param {function} clear
         */
        service.resetExtend = function (columnBefore, columnDefs, defaultFilters) {
            Grid.prototype.clearAllFilters = function extendedClearAllFilters() {
                clear.apply(this, Grid.prototype.clearAllFilters);
                columnBefore.forEach(function (element, index) {
                    if (element.visible) {
                        columnDefs[index].visible = true;
                        if (defaultFilters && columnDefs[index].filters) {
                            defaultFilters.lastLoginAtRange = {
                                startDate: null,
                                endDate: null
                            };
                            if (defaultFilters.createdAt){
                                defaultFilters.createdAt = {
                                    startDate: null,
                                    endDate: null
                                };
                            }
                        }
                    } else {
                        var x = columnBefore.indexOf(element);
                        columnDefs[x].visible = false;
                    }
                });
            };
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('UiGridService', [
            '$localStorage',
            'Grid',
            'UserFactory',
            App.services.UiGrid
        ]);
} (window.angular));
