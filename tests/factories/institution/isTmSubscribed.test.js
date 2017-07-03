(function() {
    'use strict';
    describe('method isTmSubscribed under InstitutionFactory', function() {
        beforeEach(module('qsHub'));

        var Factory;
        beforeEach(inject(function (_InstitutionFactory_) {
            Factory = _InstitutionFactory_;
        }));

        describe('When no data set', function() {
            it('should return false', function () {
                var result = Factory.isTmSubscribed();
                expect(result).toBeFalsy();
            });
        });

        describe('When TM subscription exists & subscribed', function() {
            it('should return false', function () {
                Factory.setData({
                    subscriptions: {
                        tm: {
                            subscribed: true
                        }
                    }
                });
                var result = Factory.isTmSubscribed();
                expect(result).toBeTruthy();
            });
        });

        describe('When TM subscription exists & not subscribed', function() {
            it('should return false', function () {
                Factory.setData({
                    subscriptions: {
                        tm: {
                            subscribed: false
                        }
                    }
                });
                var result = Factory.isTmSubscribed();
                expect(result).toBeFalsy();
            });
        });
    });
}());
