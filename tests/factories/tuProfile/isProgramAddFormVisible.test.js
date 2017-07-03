(function() {
    'use strict';
    describe('isProgramAddFormVisible TuProfileFactory', function() {
        beforeEach(module('qsHub'));

        var TuProfileFactory, profileTabs;
        beforeEach(inject(function (_TuProfileFactory_) {
            TuProfileFactory = _TuProfileFactory_;
            profileTabs = TuProfileFactory.getProfileTabs();
        }));

        describe('When no parameters provided', function() {
            it('should return false', function () {
                var result = TuProfileFactory.isProgramAddFormVisible();
                expect(result).toBeFalsy();
            });
        });

        describe('When no data object parameter provided', function() {
            it('should return false', function () {
                var result = TuProfileFactory.isProgramAddFormVisible();
                expect(result).toBeFalsy();
            });
        });

        describe('When data object do not match', function() {
            it('should return false', function () {
                var activeTab = profileTabs.departments,
                    result = TuProfileFactory.isProgramAddFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object match and not has programAddFormVisible', function() {
            it('should return false', function () {
                var activeTab = profileTabs.programs,
                    result = TuProfileFactory.isProgramAddFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object values are null', function() {
            it('should return false', function () {
                var activeTab = null,
                    result = TuProfileFactory.isProgramAddFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object match and has programAddFormVisible', function() {
            beforeEach(function() {
                TuProfileFactory.setProgramAddFormVisibility(true);
            });
            it('should return true', function () {
                var activeTab =  profileTabs.programs,
                    result = TuProfileFactory.isProgramAddFormVisible(activeTab);
                expect(result).toBeTruthy();
            });
        });

    });
}());
