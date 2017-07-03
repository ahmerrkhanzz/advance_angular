(function() {
    'use strict';
    describe('isUpgradeFormVisible TuProfileFactory', function() {
        beforeEach(module('qsHub'));

        var TuProfileFactory, profileTabs;
        beforeEach(inject(function (_TuProfileFactory_) {
            TuProfileFactory = _TuProfileFactory_;
            profileTabs = TuProfileFactory.getProfileTabs();
        }));

        describe('When no parameters provided', function() {
            it('should return false', function () {
                var result = TuProfileFactory.isUpgradeFormVisible();
                expect(result).toBeFalsy();
            });
        });

        describe('When no data object parameter provided', function() {
            it('should return false', function () {
                var result = TuProfileFactory.isUpgradeFormVisible();
                expect(result).toBeFalsy();
            });
        });

        describe('When data object do not match', function() {
            it('should return false', function () {
                var activeTab = profileTabs.notExistingTab,
                    result = TuProfileFactory.isUpgradeFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object match and not has upgradeFormVisible', function() {
            it('should return false', function () {
                var activeTab = profileTabs.programs,
                    result = TuProfileFactory.isUpgradeFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object values not match', function() {
            it('should return false', function () {
                var activeTab = null,
                    result = TuProfileFactory.isUpgradeFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object match and has upgradeFormVisible', function() {
            beforeEach(function() {
                TuProfileFactory.setUpgradeFormVisibility(true);
            });
            it('should return true', function () {
                var activeTab = profileTabs.overview,
                    result = TuProfileFactory.isUpgradeFormVisible(activeTab);
                expect(result).toBeTruthy();
            });
        });

    });
}());
