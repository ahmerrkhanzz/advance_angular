(function() {
    'use strict';
    describe('isProgramAddFormVisible TmProfileFactory', function() {
        beforeEach(module('qsHub'));

        var TmProfileFactory, profileTabs;
        beforeEach(inject(function (_TmProfileFactory_) {
            TmProfileFactory = _TmProfileFactory_;
            profileTabs = TmProfileFactory.getProfileTabs();
        }));

        describe('When no parameters provided', function() {
            it('should return false', function () {
                var result = TmProfileFactory.isProgramAddFormVisible();
                expect(result).toBeFalsy();
            });
        });

        describe('When no data object parameter provided', function() {
            it('should return false', function () {
                var result = TmProfileFactory.isProgramAddFormVisible();
                expect(result).toBeFalsy();
            });
        });

        describe('When data object do not match', function() {
            it('should return false', function () {
                var activeTab = profileTabs.departments,
                    result = TmProfileFactory.isProgramAddFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object match and not has programAddFormVisible', function() {
            it('should return false', function () {
                var activeTab = profileTabs.programs,
                    result = TmProfileFactory.isProgramAddFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object values are null', function() {
            it('should return false', function () {
                var activeTab = null,
                    result = TmProfileFactory.isProgramAddFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object match and has programAddFormVisible', function() {
            beforeEach(function() {
                TmProfileFactory.setProgramAddFormVisibility(true);
            });
            it('should return true', function () {
                var activeTab =  profileTabs.programs,
                    result = TmProfileFactory.isProgramAddFormVisible(activeTab);
                expect(result).toBeTruthy();
            });
        });

    });
}());
