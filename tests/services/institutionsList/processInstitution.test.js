(function () {
    'use strict';
    describe('InstitutionsListService service', function () {

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
            expect(service.processInstitution).toBeDefined();
        });

        describe('when recieve a successful response', function () {
            it('should not throw an expectation', function () {
                var callback = function () {
                    var json = {
                        active: true,
                        id: "58a28eeb21dd358b31b5d69a",
                        name: "Arts, Culture, Media and Publishing Industry",
                        parentName: "ESCP Europe - Paris",
                        typeName: "Simple Department",
                        typeId: 5,
                        belongsTo: "pg"
                    };
                    service.processInstitution(json);
                }
                expect(callback).not.toThrow();
            });
        });

        describe('when recieve a error message', function () {
            it('should not throw an expectation', function () {
                var callback = function () {
                    var json = {
                        code: '400',
                        message: 'Could not recieve data from the API'
                    };
                    service.processInstitution(json);
                }
                expect(callback).not.toThrow();
            });
        });

        describe('when recieve a successful response', function () {
            it('should return true', function () {
                var callback = function () {
                    var json = {
                        active: true,
                        id: "58a28eeb21dd358b31b5d69a",
                        name: "Arts, Culture, Media and Publishing Industry",
                        parentName: "ESCP Europe - Paris",
                        typeName: "Simple Department",
                        typeId: 5,
                        belongsTo: "pg"
                    };
                    service.processInstitution(json);
                }
                expect(callback).toBeTruthy();
            });
        })

    });
} ());
