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


        describe('$scope.formatBrochures', function () {
            it('should exist', function () {
                expect(TmMediaBrochuresService.formatBrochures).toBeDefined();
            });
        });


        describe('When no parameters provided', function () {
            it('should be undefined', function () {
                var result = TmMediaBrochuresService.formatBrochures();
                expect(result).toBeUndefined();
            });
        });

        describe('When empty array provided as a parameter', function () {
            it('should return false', function () {
                var itemsArray = [];
                var result = TmMediaBrochuresService.formatBrochures(itemsArray);
                expect(result).toEqual(itemsArray);
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
                var result = TmMediaBrochuresService.formatBrochures(itemsArray);
                expect(result).not.toBeNull();
            });
        });
       
    });
})();