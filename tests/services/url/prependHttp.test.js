(function() {
    'use strict';
    describe('prependHttp method', function() {
        beforeEach(module('qsHub'));

        var Service, prefix = 'http://';
        beforeEach(inject(function (_UrlService_) {
            Service = _UrlService_;
        }));

        describe('When no parameters provided', function() {
            it('should return undefined', function () {
                var result = Service.prependHttp();
                expect(result).toBeUndefined();
            });
        });

        describe('When empty object provided', function() {
            it('should return input', function () {
                var parameter = {},
                    result = Service.prependHttp(parameter);
                expect(result).toBe(parameter);
            });
        });

        describe('When URL without http is provided', function() {
            it('should prepend http://', function () {
                var parameter = 'google.com',
                    result = Service.prependHttp(parameter);
                expect(result).toBe(prefix + parameter);
            });
        });

        describe('When URL with http is provided', function() {
            it('should not prepend http://', function () {
                var parameter = 'http://google.com',
                    result = Service.prependHttp(parameter);
                expect(result).toBe(parameter);
            });
        });

        describe('When URL with https is provided', function() {
            it('should not prepend http://', function () {
                var parameter = 'https://google.com',
                    result = Service.prependHttp(parameter);
                expect(result).toBe(parameter);
            });
        });

    });
}());
