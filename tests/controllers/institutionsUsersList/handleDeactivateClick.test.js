(function() {
    'use strict';
    describe('handleDeactivateClick action', function () {
        var $controller, $rootScope, $scope;

        beforeEach(module('qsHub'));

        if (typeof uiMode === 'undefined' || !uiMode) {
            beforeEach(module('templates'));
        }

        beforeEach(inject(function (_$controller_, _$rootScope_){
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
        }));

        describe('When invalid arguments are passed', function () {
            beforeEach(function(){
                $controller('InstitutionsUsersListController', {$scope: $scope});
            });

            it('should return false when nothing is provided as argument', function () {
                expect($scope.handleDeactivateClick()).toBeFalsy();
            });
        });

        describe('When deactivation is already in progress', function() {
            var user = {
                id: 1
            };
            beforeEach(function(){
                $controller('InstitutionsUsersListController', {$scope: $scope});
                $scope.deactivateInProgress = true
            });

            it('should return false', function () {
                expect($scope.handleDeactivateClick(user)).toBeFalsy();
            });
        });

        // @todo write tests for promises

    });
}());