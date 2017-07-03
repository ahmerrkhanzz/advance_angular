(function() {
    'use strict';
    describe('handleResetClick action', function () {
        var $controller, $rootScope, $scope;

        beforeEach(module('qsHub'));

        if (typeof uiMode === 'undefined' || !uiMode) {
            beforeEach(module('templates'));
        }

        beforeEach(inject(function (_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
        }));

        describe('When user object is not modified', function () {
            var user = {};
            beforeEach(function(){
                $controller('InstitutionsUsersListController', {$scope: $scope});
                $scope.handleResetClick();
            });

            it('$scope.user should be same as $scope.userBeforeChanges', function() {
                expect($scope.user).toEqual($scope.userBeforeChanges);
            });
        });

        describe('When user object is modified', function() {
            var user = {};
            beforeEach(function(){
                $controller('InstitutionsUsersListController', {$scope: $scope});
                $scope.user = 1;
                $scope.handleResetClick();
            });

            it('$scope.user should be same as $scope.userBeforeChanges', function() {
                expect($scope.user).toEqual($scope.userBeforeChanges);
            });

        });

    });
}());