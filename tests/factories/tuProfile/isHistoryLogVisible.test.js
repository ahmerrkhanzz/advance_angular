(function() {
    'use strict';
    describe('isHistoryLogVisible TuProfileFactory', function() {
        beforeEach(module('qsHub'));

        var TuProfileFactory, profileTabs;
        beforeEach(inject(function (_TuProfileFactory_) {
            TuProfileFactory = _TuProfileFactory_;
            profileTabs = TuProfileFactory.getProfileTabs();
        }));

        describe('When no parameters provided', function() {
            it('should return false', function () {
                var result = TuProfileFactory.isHistoryLogVisible();
                expect(result).toBeFalsy();
            });
        });

        describe('When no data object parameter provided', function() {
            it('should return false', function () {
                var result = TuProfileFactory.isHistoryLogVisible();
                expect(result).toBeFalsy();
            });
        });

        describe('When data object do not match', function() {
            it('should return false', function () {
                var activeTab = profileTabs.media,
                    result = TuProfileFactory.isHistoryLogVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object match and not has historyLogVisible', function() {
            it('should return false', function () {
                var activeTab = profileTabs.overview,
                    result = TuProfileFactory.isHistoryLogVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object values are null', function() {
            it('should return false', function () {
                var activeTab = null,
                    result = TuProfileFactory.isHistoryLogVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object match and has historyLogVisible', function() {
            beforeEach(function() {
                TuProfileFactory.setHistoryLogVisibility(true);
            });
            it('should return true', function () {
                var activeTab = profileTabs.overview,
                    result = TuProfileFactory.isHistoryLogVisible(activeTab);
                expect(result).toBeTruthy();
            });
        });

    });
}());
