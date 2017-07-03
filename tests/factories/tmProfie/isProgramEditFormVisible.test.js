(function() {
    'use strict';
    describe('isProgramEditFormVisible TmProfileFactory', function() {
        beforeEach(module('qsHub'));

        var TmProfileFactory, profileTabs;
        beforeEach(inject(function (_TmProfileFactory_) {
            TmProfileFactory = _TmProfileFactory_;
            profileTabs = TmProfileFactory.getProfileTabs();
        }));

        describe('When no parameters provided', function() {
            it('should return false', function () {
                var result = TmProfileFactory.isProgramEditFormVisible();
                expect(result).toBeFalsy();
            });
        });

        describe('When no data object parameter provided', function() {
            it('should return false', function () {
                var result = TmProfileFactory.isProgramEditFormVisible();
                expect(result).toBeFalsy();
            });
        });

        describe('When data object do not match', function() {
            it('should return false', function () {
                var activeTab = profileTabs.overview,
                    result = TmProfileFactory.isProgramEditFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object match and not has programEditFormVisible', function() {
            it('should return false', function () {
                var activeTab = profileTabs.programs,
                    result = TmProfileFactory.isProgramEditFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object values are null', function() {
            it('should return null', function () {
                var activeTab = null,
                    result = TmProfileFactory.isProgramEditFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object match and has programEditFormVisible', function() {
            beforeEach(function() {
                TmProfileFactory.setProgramEditFormVisibility(true);
            });
            it('should return true', function () {
                var activeTab = profileTabs.programs,
                    result = TmProfileFactory.isProgramEditFormVisible(activeTab);
                expect(result).toBeTruthy();
            });
        });

    });
}());
