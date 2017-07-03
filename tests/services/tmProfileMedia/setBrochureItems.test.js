(function () {
    'use strict';

    describe('Brochure Service', function () {

        var TmMediaBrochuresService;

        beforeEach(module('qsHub'));

        beforeEach(inject(function (_TmMediaBrochuresService_) {
            TmMediaBrochuresService = _TmMediaBrochuresService_;
        }));

        
        // A simple test to verify the TmMediaBrochuresService service exists
        it('should exist', function () {
            expect(TmMediaBrochuresService).toBeDefined();
        });


        describe('$scope.setBrochureItems', function () {
            it('should exist', function () {
                expect(TmMediaBrochuresService.setBrochureItems).toBeDefined();
            });
        });


        describe('When no parameters provided', function () {
            it('should be undefined', function () {
                var result = TmMediaBrochuresService.setBrochureItems();
                expect(result).toBeUndefined();
            });
        });

        describe('When empty array provided as a parameter', function () {
            it('should return false', function () {
                var itemsArray = [];
                var result = TmMediaBrochuresService.setBrochureItems(itemsArray);
                expect(result).toBeFalsy();
            });
        });

        describe('When second parameter provided as false', function () {
            it('should return false', function () {
                var itemsArray = [
                    {
                       id: '5875c90f591257001c74fea7', 
                       master: true,
                       name: 'Hult International Business School (Undergraduate)',
                       orderType: {
                           master : 0
                       },
                       url: 'https://www.youtube.com/watch?v=fXp04rpKitQ'
                    },
                    {
                       id: '5875c90f591257001c74fea6', 
                       master: true,
                       name: 'Demo',
                       orderType: {
                           master : 0
                       },
                       url: 'https://www.youtube.com/watch?v=fXp04rpKitQ'
                    }
                ];
                var transform = false;
                var result = TmMediaBrochuresService.setBrochureItems(itemsArray, transform);
                expect(result).toBeFalsy();
            });
        });

    });
})();