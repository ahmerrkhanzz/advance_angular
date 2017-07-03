(function() {
    'use strict';
    describe('filterObjectForSubscriptions service', function() {
        beforeEach(module('qsHub'));

        var institutionsListService;
        beforeEach(inject(function (_InstitutionsListService_) {
            institutionsListService = _InstitutionsListService_;
        }));

        var filters,
            objectWithAllFields = readJSON('tests/services/institutionsList/objectWithAllFields.json'),
            objectMissingSomeFields = readJSON('tests/services/institutionsList/objectMissingSomeFields.json');

        filters = {
            subscriptions: {
                ug: {
                    subscribed : null,
                    advanced   : null,
                    startDate  : null,
                    endDate    : null
                },
                pg: {
                    subscribed : null,
                    advanced   : null,
                    startDate  : null,
                    endDate    : null
                },
                tm: {
                    subscribed : null,
                    advanced   : null,
                    startDate  : null,
                    endDate    : null
                },
                all: {
                    subscribed: null
                },
                stars: {
                    subscribed: null
                },
                aw: {
                    subscribed: null
                },
                brics: {
                    subscribed: null
                },
                aur: {
                    subscribed: null
                },
                eeca: {
                    subscribed: null
                },
                wur: {
                    subscribed: null
                },
                ger: {
                    subscribed: null
                },
                lau: {
                    subscribed: null
                }
            },
            enabled : {
                ug : null,
                pg : null,
                tm : null
            }
        };

        describe('When no parameters provided', function() {
            it('should return undefined', function () {
                var result = institutionsListService.filterObjectForSubscriptions();
                expect(result).toBeUndefined();
            });
        });

        describe('When no data object parameter provided', function() {
            it('should return filters object', function () {
                var filtersObject = {},
                    result = institutionsListService.filterObjectForSubscriptions(filtersObject);
                expect(result).toEqual(filtersObject);
            });
        });

        describe('When data object does not match filters', function() {
            it('should return filters object', function () {
                var filtersObject = {
                        a : null
                    },
                    dataObject = {},
                    result = institutionsListService.filterObjectForSubscriptions(filtersObject,  dataObject);
                expect(result).toEqual(filtersObject);
            });
        });

        describe('When data object match filters', function() {
            it('should return filtered data object', function () {
                var filtersObject = {
                        a : null
                    },
                    dataObject = {
                        a: 1,
                        b: 2
                    },
                    expected = {
                        a: 1
                    },
                    result = institutionsListService.filterObjectForSubscriptions(filtersObject,  dataObject);
                expect(result).toEqual(expected);
            });
        });

        describe('When multidimensional data object match all filters', function() {
            it('should return filtered data object', function() {
                var filteredObject = institutionsListService.filterObjectForSubscriptions(filters, objectWithAllFields);
                expect(filteredObject).toEqual({
                    "subscriptions": {
                        "ug": {
                            "subscribed": true,
                            "advanced": true,
                            "startDate": '1464303600000',
                            "endDate": '1495925999999'
                        },
                        "pg": {
                            "subscribed": true,
                            "advanced": true,
                            "startDate": "1464303600000",
                            "endDate": "1495925999999"
                        },
                        "tm": {
                            "subscribed": true,
                            "advanced": true,
                            "startDate": "1464303600000",
                            "endDate": "1495925999999"
                        },
                        "all": {
                            "subscribed": true
                        },
                        "stars": {
                            "subscribed": null
                        },
                        "aw": {
                            "subscribed": null
                        },
                        "brics": {
                            "subscribed": null
                        },
                        "aur": {
                            "subscribed": null
                        },
                        "eeca": {
                            "subscribed": null
                        },
                        "wur": {
                            "subscribed": null
                        },
                        "ger": {
                            "subscribed": true
                        },
                        "lau": {
                            "subscribed": true
                        }
                    },
                    "enabled": {
                        "ug": null,
                        "pg": true,
                        "tm": true
                    }
                });
            });
        });

        describe('When multidimensional data object match partial filters', function() {
            it('should return filtered data object', function() {
                var filteredObject = institutionsListService.filterObjectForSubscriptions(filters, objectMissingSomeFields);
                expect(filteredObject).toEqual({
                    "subscriptions": {
                        "ug": {
                            "subscribed": null,
                            "advanced": null,
                            "startDate": null,
                            "endDate": null
                        },
                        "pg": {
                            "subscribed": true,
                            "advanced": null,
                            "startDate": null,
                            "endDate": null
                        },
                        "tm": {
                            "subscribed": true,
                            "advanced": true,
                            "startDate": "1464303600000",
                            "endDate": "1495925999999"
                        },
                        "all": {
                            "subscribed": true
                        },
                        "stars": {
                            "subscribed": null
                        },
                        "aw": {
                            "subscribed": null
                        },
                        "brics": {
                            "subscribed": null
                        },
                        "aur": {
                            "subscribed": null
                        },
                        "eeca": {
                            "subscribed": null
                        },
                        "wur": {
                            "subscribed": null
                        },
                        "ger": {
                            "subscribed": null
                        },
                        "lau": {
                            "subscribed": null
                        }
                    },
                    "enabled": {
                        "ug": null,
                        "pg": true,
                        "tm": true
                    }
                });
            });
        });
    });
}());
