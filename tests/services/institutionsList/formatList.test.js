(function () {
    'use strict';

    describe('InstitutionsListService formatList Service', function () {

        var InstitutionsListService;

        beforeEach(module('qsHub'));

        beforeEach(inject(function (_InstitutionsListService_) {
            InstitutionsListService = _InstitutionsListService_;
        }));

        // A simple test to verify the ContactsService service exists
        it('should exist', function () {
            expect(InstitutionsListService).toBeDefined();
        });


        describe('$scope.formatList', function () {
            it('should exist', function () {
                expect(InstitutionsListService.formatList).toBeDefined();
            });
        });


        describe('When empty array provided as a parameter', function () {
            it('should return false', function () {
                var itemsArray = [];
                var result = InstitutionsListService.formatList(itemsArray);
                expect(result).toEqual(itemsArray);
            });
        });

        describe('When data array provided as a parameter', function () {
            it('should return true', function () {
                var itemsArray = [
                    {coreId: 30244}, {coreId: 25992}, {coreId: 20952}
                ];
                var result = InstitutionsListService.formatList(itemsArray);
                expect(result).not.toBeNull();
            });
        });
       
    });
})();