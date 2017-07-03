(function() {
    'use strict';
    describe('isProgramEditFormVisible TuProfileFactory', function() {
        beforeEach(module('qsHub'));

        var TuProfileFactory, profileTabs;
        beforeEach(inject(function (_TuProfileFactory_) {
            TuProfileFactory = _TuProfileFactory_;
            profileTabs = TuProfileFactory.getProfileTabs();
        }));

        describe('When no parameters provided', function() {
            it('should return false', function () {
                var result = TuProfileFactory.isProgramEditFormVisible();
                expect(result).toBeFalsy();
            });
        });

        describe('When no data object parameter provided', function() {
            it('should return false', function () {
                var result = TuProfileFactory.isProgramEditFormVisible();
                expect(result).toBeFalsy();
            });
        });

        describe('When data object do not match', function() {
            it('should return false', function () {
                var activeTab = profileTabs.overview,
                    result = TuProfileFactory.isProgramEditFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object match and not has programEditFormVisible', function() {
            it('should return false', function () {
                var activeTab = profileTabs.programs,
                    result = TuProfileFactory.isProgramEditFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object values are null', function() {
            it('should return null', function () {
                var activeTab = null,
                    result = TuProfileFactory.isProgramEditFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object match and has programEditFormVisible', function() {
            beforeEach(function() {
                TuProfileFactory.setProgramEditFormVisibility(true);
            });
            it('should return true', function () {
                var activeTab = profileTabs.programs,
                    result = TuProfileFactory.isProgramEditFormVisible(activeTab);
                expect(result).toBeTruthy();
            });
        });

    });
}());
