(function () {
    'use strict';

    describe('Profile Media Images Service', function () {

        var TmMediaImagesService;

        beforeEach(module('qsHub'));

        beforeEach(inject(function (_TmMediaImagesService_) {
            TmMediaImagesService = _TmMediaImagesService_;
        }));

        // A simple test to verify the TmMediaImagesService service exists
        it('should exist', function () {
            expect(TmMediaImagesService).toBeDefined();
        });


        describe('$scope.replaceByKey', function () {
            it('should exist', function () {
                expect(TmMediaImagesService.replaceByKey).toBeDefined();
            });
        });


        describe('When no parameters provided', function () {
            it('should return false', function () {
                var result = TmMediaImagesService.replaceByKey();
                expect(result).toBeFalsy();
            });
        });

        describe('When id parameter provided', function () {
            it('should not be null', function () {
                var imagesArray = [
                    {
                        description: 'asdd',
                        id: '584fc93b87e4c391c65d5fb3',
                        master: false,
                        name: 'jose',
                        size: 80804,
                        thumbnailUrl: 'http://files.core.qs.com/a6ee14c8d9c0d040fc00b166aaf793ea/thumb.jpg',
                        url: 'http://files.core.qs.com/a6ee14c8d9c0d040fc00b166aaf793ea/thumb.jpg'
                    },
                    {
                        description: 'asdd',
                        id: '584fc93b87e4c391c65d5fb4',
                        master: false,
                        name: 'jose',
                        size: 80804,
                        thumbnailUrl: 'http://files.core.qs.com/a6ee14c8d9c0d040fc00b166aaf793ea/thumb.jpg',
                        url: 'http://files.core.qs.com/a6ee14c8d9c0d040fc00b166aaf793ea/thumb.jpg'
                    },
                ];
                var selected = imagesArray[0];
                TmMediaImagesService.setImageItems(imagesArray);
                TmMediaImagesService.setSelectedImage(selected);
                var key = TmMediaImagesService.getImageItems();
                var result = TmMediaImagesService.replaceByKey('584fc93b87e4c391c65d5fb3');
                expect(key).not.toBeNull();
            });
        });

        describe('When null id parameter provided', function () {
            it('should return false', function () {
                var imagesArray = [
                    {
                        description: 'asdd',
                        id: null,
                        master: false,
                        name: 'jose',
                        size: 80804,
                        thumbnailUrl: 'http://files.core.qs.com/a6ee14c8d9c0d040fc00b166aaf793ea/thumb.jpg',
                        url: 'http://files.core.qs.com/a6ee14c8d9c0d040fc00b166aaf793ea/thumb.jpg'
                    },
                    {
                        description: 'asdd',
                        id: '584fc93b87e4c391c65d5fb4',
                        master: false,
                        name: 'jose',
                        size: 80804,
                        thumbnailUrl: 'http://files.core.qs.com/a6ee14c8d9c0d040fc00b166aaf793ea/thumb.jpg',
                        url: 'http://files.core.qs.com/a6ee14c8d9c0d040fc00b166aaf793ea/thumb.jpg'
                    },
                ];
                var selected = imagesArray[0];
                TmMediaImagesService.setImageItems(imagesArray);
                TmMediaImagesService.setSelectedImage(selected);
                var key = TmMediaImagesService.getImageItems();
                var result = TmMediaImagesService.replaceByKey('584fc93b87e4c391c65d5fb3');
                expect(result).toBeFalsy();
            });
        });


    });
})();