(function () {
    'use strict';
    describe('InstitutionsListService getSubscriptionNameByHandle service', function () {

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
            expect(service.getSubscriptionNameByHandle).toBeDefined();
        });

        describe('When empty array provided as a parameter', function () {
            it('should return false', function () {
                var subscriptionsList = [],
                handle = "all";
                var result = service.getSubscriptionNameByHandle(handle, subscriptionsList);
                expect(result).toEqual('');
            });
        });


        describe('when recieve a successful response', function () {
            it('should not throw an expectation', function () {
                var callback = function () {
                    var subscriptionsList =[ {
                        handle: "all",
                        id: "58a28eeb21dd358b31b5d69a",
                        name: "All",
                        type: "statistics"
                    },
                    {
                        handle: "aw",
                        id: "58a28eef21dd358b31b5d6b5",
                        name: "Arab World",
                        parentName: "ESCP Europe - Paris",
                        type: "statistics"
                    }],
                    handle = "all";
                    service.getSubscriptionNameByHandle(handle, subscriptionsList);
                }
                expect(callback).not.toThrow();
            });
        });

        describe('when recieve a error message', function () {
            it('should not throw an expectation', function () {
                var callback = function () {
                    var subscriptionsList = {
                        code: '400',
                        message: 'Could not recieve data from the API'
                    },
                    handle = "all";
                    service.getSubscriptionNameByHandle(handle, subscriptionsList);
                }
                expect(callback).not.toThrow();
            });
        });

        describe('when receiving a null response', function () {
            it('should not throw an exception', function () {
                var callback = function () {
                    service.getSubscriptionNameByHandle();
                }
                expect(callback).not.toThrow();
            });
        });

        describe('when recieve a successful response', function () {
            it('should return true', function () {
                var callback = function () {
                    var subscriptionsList =[ {
                        handle: "all",
                        id: "58a28eeb21dd358b31b5d69a",
                        name: "All",
                        type: "statistics"
                    },
                    {
                        handle: "aw",
                        id: "58a28eef21dd358b31b5d6b5",
                        name: "Arab World",
                        parentName: "ESCP Europe - Paris",
                        type: "statistics"
                    }],
                    handle = "all";
                    service.getSubscriptionNameByHandle(handle, subscriptionsList);
                }
                expect(callback).toBeTruthy();
            });
        })

    });
} ());
