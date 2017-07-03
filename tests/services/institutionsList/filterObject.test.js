(function () {
    'use strict';
    describe('InstitutionsListService filterObject service', function () {

        beforeEach(module('qsHub'));

        var service, $rootScope, $scope;

        if (typeof uiMode === 'undefined' || !uiMode) {
            beforeEach(module('templates'));
        }

        beforeEach(inject(function (_InstitutionsListService_, _$rootScope_) {
            service = _InstitutionsListService_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
        }));

        afterEach(function () {
            service = null;
        });


        it('should exist', function () {
            expect(service).toBeDefined();
        });

        it('should exist', function () {
            expect(service.filterObject).toBeDefined();
        });

        describe('When empty array provided as a parameter', function () {
            it('should return false', function () {
                var filters = {},
                    institutionData = {};
                var result = service.filterObject(filters, institutionData);
                expect(result).toEqual(filters);
            });
        });


        describe('when recieve a successful response', function () {
            it('should not throw an expectation', function () {
                var callback = function () {
                    var filters = {
                        active: null,
                        businessSchool: null,
                        countryCode: null,
                        countryName: null,
                        filemakerId: null,
                        hasNoDepartments: null,
                        localName: null,
                        name: null,
                        parentCoreId: null,
                        parentName: null,
                        typeId: null
                    },
                    institutionData= {
                        active: true,
                        id: "58a28eeb21dd358b31b5d69a",
                        name: "Arts, Culture, Media and Publishing Industry",
                        parentName: "ESCP Europe - Paris",
                        typeName: "Simple Department",
                        typeId: 5,
                        belongsTo: "pg"
                    }
                service.filterObject(filters, institutionData);
            }
                expect(callback).not.toThrow();
        });
    });

    describe('when recieve a error message', function () {
        it('should not throw an expectation', function () {
            var callback = function () {
                var filters = {
                    code: '400',
                    message: 'Could not recieve data from the API'
                },
                institutionData = {};
                service.filterObject(filters, institutionData);
            }
            expect(callback).not.toThrow();
        });
    });

    describe('when receiving a null response', function () {
        it('should not throw an exception', function () {
            var callback = function () {
                service.filterObject();
            }
            expect(callback).not.toThrow();
        });
    });

    describe('when recieve a successful response', function () {
        it('should return true', function () {
            var callback = function () {
                var filters = {
                        active: null,
                        businessSchool: null,
                        countryCode: null,
                        countryName: null,
                        filemakerId: null,
                        hasNoDepartments: null,
                        localName: null,
                        name: null,
                        parentCoreId: null,
                        parentName: null,
                        typeId: null
                    },
                    institutionData= {
                        active: true,
                        id: "58a28eeb21dd358b31b5d69a",
                        name: "Arts, Culture, Media and Publishing Industry",
                        parentName: "ESCP Europe - Paris",
                        typeName: "Simple Department",
                        typeId: 5,
                        belongsTo: "pg"
                    }
                service.filterObject(filters, institutionData);
            }
            expect(callback).toBeTruthy();
        });
    })

});
} ());
