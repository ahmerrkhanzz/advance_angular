(function () {
    'use strict';
    describe('InstitutionsListService appendSubscriptionsData service', function () {

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
            expect(service.appendSubscriptionsData).toBeDefined();
        });

        describe('when recieve a successful response', function () {
            it('should not throw an expectation', function () {
                var callback = function () {
                    var json = [
                        {
                            active: true,
                            belongsTo: "pg",
                            campus: null,
                            coreId: 31281,
                            coreIdAsString: "31281"
                        }
                    ]
                    service.appendSubscriptionsData(json);
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
                    }
                    service.appendSubscriptionsData(json);
                }
                expect(callback).not.toThrow();
            });
        });

        describe('when receiving a null response', function () {
            it('should not throw an exception', function () {
                var callback = function () {
                    service.appendSubscriptionsData(null);
                }
                expect(callback).not.toThrow();
            });
        });

        describe('when recieve a successful response', function () {
            it('should return true', function () {
                var callback = function () {
                    var json = [
                        {
                            active: true,
                            belongsTo: "pg",
                            campus: null,
                            coreId: 31281,
                            coreIdAsString: "31281"
                        }
                    ];
                    service.appendSubscriptionsData(json);
                }
                expect(callback).toBeTruthy();
            });
        })

    });
} ());
