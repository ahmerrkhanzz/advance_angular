(function() {
    'use strict';
    describe('method isTuSubscribed under InstitutionFactory', function() {
        beforeEach(module('qsHub'));

        var Factory;
        beforeEach(inject(function (_InstitutionFactory_) {
            Factory = _InstitutionFactory_;
        }));

        describe('When no data set', function() {
            it('should return false', function () {
                var result = Factory.isTuSubscribed();
                expect(result).toBeFalsy();
            });
        });

        describe('When TU subscription exists & subscribed', function() {
            it('should return false', function () {
                Factory.setData({
                    subscriptions: {
                        tu: {
                            subscribed: true
                        }
                    }
                });
                var result = Factory.isTuSubscribed();
                expect(result).toBeTruthy();
            });
        });

        describe('When TU subscription exists & not subscribed', function() {
            it('should return false', function () {
                Factory.setData({
                    subscriptions: {
                        tu: {
                            subscribed: false
                        }
                    }
                });
                var result = Factory.isTuSubscribed();
                expect(result).toBeFalsy();
            });
        });
    });
}());
