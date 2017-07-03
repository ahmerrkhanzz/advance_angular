(function() {
    'use strict';
    describe('handleDatagridRowClick action', function () {
        var $controller, $rootScope, $scope;

        beforeEach(module('qsHub'));

        if (typeof uiMode === 'undefined' || !uiMode) {
            beforeEach(module('templates'));
        }

        beforeEach(inject(function (_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            //$scope.selectedUserId = 10;
        }));

        describe('When empty object is provided as argument', function () {
            var user = {};
            beforeEach(function () {
                $controller('InstitutionsUsersListController', {$scope: $scope});
                $scope.handleDatagridRowClick(user);
            });

            it('$scope.selectedUserId should be same as passed user ID', function () {
                expect($scope.selectedUserId).toBeNull();
            });

            it('$scope.user should be same as passed object', function() {
                expect($scope.user).toEqual(user);
            });

            it('$scope.showInfoBlock should be true', function () {
                expect($scope.showInfoBlock).toBeFalsy();
            });

            describe('$scope.userBeforeChanges', function () {
                it('should be defined in scope', function () {
                    expect($scope.userBeforeChanges).toBeDefined();
                });

                it('should be empty object', function () {
                    expect($scope.userBeforeChanges).toEqual({});
                });

                it('should be independent from passed object', function () {
                    user.test = 1;
                    expect($scope.userBeforeChanges).not.toEqual(user);
                });
            });

            describe('$scope.user', function () {
                it('should be defined in scope', function () {
                    expect($scope.user).toBeDefined();
                });

                it('should be empty object', function () {
                    expect($scope.user).toEqual({});
                });

                it('should be independent from passed object', function () {
                    user.test = 1;
                    expect($scope.user).not.toEqual(user);
                });
            });
        });

        describe('When non empty object is provided as argument', function () {
            var userId = 1,
                user;
            beforeEach(function () {
                user = {
                    id: userId
                };
                $controller('InstitutionsUsersListController', {$scope: $scope});
                $scope.handleDatagridRowClick(user);
            });

            it('$scope.selectedUserId should be same as passed user ID', function () {
                expect($scope.selectedUserId).toBe(1);
            });

            it('$scope.user should be same as passed object', function() {
                expect($scope.user).toEqual(user);
            });

            it('$scope.showInfoBlock should be true', function () {
                expect($scope.showInfoBlock).toBeTruthy();
            });

            describe('$scope.userBeforeChanges', function () {
                it('should be defined in scope', function () {
                    expect($scope.userBeforeChanges).toBeDefined();
                });

                it('should be same as passed object', function () {
                    expect($scope.userBeforeChanges).toEqual(user);
                });

                it('should be dependent from passed object', function () {
                    user.test = 1;
                    expect($scope.userBeforeChanges).toEqual(user);
                });
            });

            describe('$scope.user', function () {
                it('should be defined in scope', function () {
                    expect($scope.user).toBeDefined();
                });

                it('should be same as passed object', function () {
                    expect($scope.user).toEqual(user);
                });

                it('should be independent from passed object', function () {
                    user.test = 1;
                    expect($scope.user).not.toEqual(user);
                });
            });
        });

        describe('When non empty object is provided as argument second time', function () {
            var userId = 1,
                user;
            beforeEach(function () {
                user = {
                    id: userId
                };
                $controller('InstitutionsUsersListController', {$scope: $scope});
                $scope.handleDatagridRowClick(user);
                $scope.handleDatagridRowClick(user);
            });

            it('$scope.selectedUserId should be null', function () {
                expect($scope.selectedUserId).toBeNull();
            });

            it('$scope.showInfoBlock should be false', function () {
                expect($scope.showInfoBlock).toBeFalsy();
            });
        });

    });
}());