(function () {
    'use strict';
    describe('InstitutionsListService getTypeFilterData service', function () {

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
            expect(service.getTypeFilterData).toBeDefined();
        });

        describe('when recieve a successful response', function () {
            it('should not throw an expectation', function () {
                var callback = function () {
                    var grid = true;
                    service.getTypeFilterData(grid);
                }
                expect(callback).not.toThrow();
            });
        });


        describe('when receiving a null response', function () {
            it('should not throw an exception', function () {
                var callback = function () {
                    service.getTypeFilterData(null);
                }
                expect(callback).not.toThrow();
            });
        });

        describe('when recieve a successful response', function () {
            it('should return true', function () {
                var callback = function () {
                   var grid = false;
                    service.getTypeFilterData(grid);
                }
                expect(callback).toBeTruthy();
            });
        })

    });
} ());
