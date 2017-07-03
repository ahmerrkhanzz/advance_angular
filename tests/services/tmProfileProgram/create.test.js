(function () {
    'use strict';
    describe('TmProfileProgramsService service', function () {

        beforeEach(module('qsHub'));

        var service, $rootScope, $scope;

        if (typeof uiMode === 'undefined' || !uiMode) {
            beforeEach(module('templates'));
        }

        beforeEach(inject(function (_TmProfileProgramsService_, _$rootScope_) {
            service = _TmProfileProgramsService_;
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
            expect(service.create).toBeDefined();
        });

        describe('when recieve a successful response', function () {
            it('should not throw an expectation', function () {
                var callback = function () {
                    
                    var json = {
                        campus: [ "58775655e5d4f975c53b934a", "58775655e5d4f975c53b934c"],
                        description: "Description",
                        name: "Demo",
                        parentInstitutionCoreId: 2095,
                        type: "pt"
                    }
                    service.create(null, json);
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
                    service.create(null, json);
                }
                expect(callback).not.toThrow();
            });
        });

        describe('when receiving a null response', function () {
            it('should not throw an exception', function () {
                var callback = function () {
                    service.create(null);
                }
                expect(callback).not.toThrow();
            });
        });

        describe('when recieve a successful response', function () {
            it('should return true', function () {
                var callback = function () {
                    var json = {
                        campus: [ "58775655e5d4f975c53b934a", "58775655e5d4f975c53b934c"],
                        description: "Description",
                        name: "Demo",
                        parentInstitutionCoreId: 2095,
                        type: "pt"
                    };
                    service.create(null, json);
                }
                expect(callback).toBeTruthy();
            });
        })

    });
} ());
