(function() {
    'use strict';
    describe('isDepartmentEditFormVisible TuProfileFactory', function() {
        beforeEach(module('qsHub'));

        var TuProfileFactory, profileTabs;
        beforeEach(inject(function (_TuProfileFactory_) {
            TuProfileFactory = _TuProfileFactory_;
            profileTabs = TuProfileFactory.getProfileTabs();
        }));

        describe('When no parameters provided', function() {
            it('should return false', function () {
                var result = TuProfileFactory.isDepartmentEditFormVisible();
                expect(result).toBeFalsy();
            });
        });

        describe('When no data object parameter provided', function() {
            it('should return false', function () {
                var result = TuProfileFactory.isDepartmentEditFormVisible();
                expect(result).toBeFalsy();
            });
        });

        describe('When data object do not match', function() {
            it('should return false', function () {
                var activeTab = profileTabs.overview,
                    result = TuProfileFactory.isDepartmentEditFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object match and not has departmentEditFormVisible', function() {
            it('should return false', function () {
                var activeTab = profileTabs.departments,
                    result = TuProfileFactory.isDepartmentEditFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object values are null', function() {
            it('should return false', function () {
                var activeTab = null,
                    result = TuProfileFactory.isDepartmentEditFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object match and has departmentEditFormVisible', function() {
            beforeEach(function() {
                TuProfileFactory.setDepartmentEditFormVisibility(true);
            });
            it('should return true', function () {
                var activeTab = profileTabs.departments,
                    result = TuProfileFactory.isDepartmentEditFormVisible(activeTab);
                expect(result).toBeTruthy();
            });
        });

    });
}());
