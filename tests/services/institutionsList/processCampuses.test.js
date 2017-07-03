(function () {
    'use strict';

    describe('InstitutionsListService processCampuses service', function () {

        beforeEach(module('qsHub'));

        var service, $rootScope, $scope;

        if (typeof uiMode === 'undefined' || !uiMode) {
            beforeEach(module('templates'));
        }

        beforeEach(inject(function (_InstitutionsListService_, _$rootScope_) {
            service = _InstitutionsListService_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
        }));

        afterEach(function () {
            service = null;
        });


        it('should exist', function () {
            expect(service).toBeDefined();
        });

        it('should exist', function () {
            expect(service.processCampuses).toBeDefined();
        });

       
    });
})();