(function() {
    'use strict';
    describe('isDepartmentAddFormVisible TuProfileFactory', function() {
        beforeEach(module('qsHub'));

        var TuProfileFactory, profileTabs;
        beforeEach(inject(function (_TuProfileFactory_) {
            TuProfileFactory = _TuProfileFactory_;
            profileTabs = TuProfileFactory.getProfileTabs();
        }));

        describe('When no parameters provided', function() {
            it('should return false', function () {
                var result = TuProfileFactory.isDepartmentAddFormVisible();
                expect(result).toBeFalsy();
            });
        });

        describe('When no data object parameter provided', function() {
            it('should return false', function () {
                var result = TuProfileFactory.isDepartmentAddFormVisible();
                expect(result).toBeFalsy();
            });
        });

        describe('When data object do not match', function() {
            it('should return false', function () {
                var activeTab = profileTabs.programs,
                    result = TuProfileFactory.isDepartmentAddFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object match and not has departmentAddFormVisible', function() {
            it('should return false', function () {
                var activeTab = profileTabs.departments,
                    result = TuProfileFactory.isDepartmentAddFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object values are null', function() {
            it('should return false', function () {
                var activeTab = null,
                    result = TuProfileFactory.isDepartmentAddFormVisible(activeTab);
                expect(result).toBeFalsy();
            });
        });

        describe('When data object match and has departmentAddFormVisible', function() {
            beforeEach(function() {
                TuProfileFactory.setDepartmentAddFormVisibility(true);
            });
            it('should return true', function () {
                var activeTab = profileTabs.departments,
                    result = TuProfileFactory.isDepartmentAddFormVisible(activeTab);
                expect(result).toBeTruthy();
            });
        });

    });
}());
