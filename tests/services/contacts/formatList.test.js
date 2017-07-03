(function () {
    'use strict';

    describe('Contacts Service', function () {

        var ContactsService;

        beforeEach(module('qsHub'));

        beforeEach(inject(function (_ContactsService_) {
            ContactsService = _ContactsService_;
        }));

        // A simple test to verify the ContactsService service exists
        it('should exist', function () {
            expect(ContactsService).toBeDefined();
        });


        describe('$scope.formatList', function () {
            it('should exist', function () {
                expect(ContactsService.formatList).toBeDefined();
            });
        });


        describe('When empty array provided as a parameter', function () {
            it('should return false', function () {
                var itemsArray = [];
                var result = ContactsService.formatList(itemsArray);
                expect(result).toEqual(itemsArray);
            });
        });

        describe('When data array provided as a parameter', function () {
            it('should return true', function () {
                var itemsArray = [
                    {coreId: 30244}, {coreId: 25992}, {coreId: 20952}
                ];
                var result = ContactsService.formatList(itemsArray);
                expect(result).not.toBeNull();
            });
        });
       
    });
})();