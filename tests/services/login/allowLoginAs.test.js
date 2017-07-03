(function() {
    'use strict';
    describe('allowLoginAs service', function() {
        beforeEach(module('qsHub'));

        var LoginService, constants;
        beforeEach(inject(function (_LoginService_, _constants_) {
            LoginService = _LoginService_;
            constants = _constants_;
        }));

        describe('When no parameters provided', function() {
            it('should return false', function () {
                var result = LoginService.allowLoginAs();
                expect(result).toBe(false);
            });
        });

        describe('When empty data object provided', function() {
            it('should return false', function () {
                var result = LoginService.allowLoginAs({});
                expect(result).toBe(false);
            });
        });

        describe('When data object property "active" is not boolean true ', function() {
            it('should return false', function () {
                var result = LoginService.allowLoginAs({active:false});
                expect(result).toBe(false);
            });
        });

        describe('When data object property "active" is boolean true but missing "typeId"', function() {
            it('should return false', function () {
                var result = LoginService.allowLoginAs({active:true});
                expect(result).toBe(false);
            });
        });

        describe('When data object property "active" is boolean true and "typeId" is basic department', function() {
            it('should return false', function () {
                var result = LoginService.allowLoginAs({
                    active: true,
                    typeId: constants.typeId.simpleDepartmentId
                });
                expect(result).toBe(false);
            });
        });

        describe('When data object property "active" is boolean true and "typeId" is client department', function() {
            it('should return true', function () {
                var result = LoginService.allowLoginAs({
                    active: true,
                    typeId: constants.typeId.clientDepartmentId
                });
                expect(result).toBe(true);
            });
        });

    });
}());
