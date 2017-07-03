(function() {
    'use strict';
    describe('set method', function() {
        beforeEach(module('qsHub'));

        var Service;
        beforeEach(inject(function (_ObjectService_) {
            Service = _ObjectService_;
        }));

        describe('When no parameters provided', function() {
            it('should return false', function () {
                var result = Service.set();
                expect(result).toBeFalsy();
            });
        });

        describe('When all parameters provided', function() {
            it('should set value', function () {
                var targetObject = {};
                Service.set(targetObject, 'test', 23);
                expect(targetObject).toEqual({
                    test: 23
                });
            });
        });

        describe('When setting value for defined multidimensional parameter', function() {
            it('should set value', function () {
                var targetObject = {
                    test: {}
                };
                Service.set(targetObject, 'test.test2', 23);
                expect(targetObject).toEqual({
                    test: {
                        test2: 23
                    }
                });
            });
        });

        describe('When setting value for undefined multidimensional parameter', function() {
            it('should not set value', function () {
                var targetObject = {};
                Service.set(targetObject, 'test.test2', 23);
                expect(targetObject).toEqual({});
            });
        });

    });
}());
