(function() {
    'use strict';
    describe('Youtube URL pattern', function() {
        beforeEach(module('qsHub'));

        var Service, prefix = 'http://';
        beforeEach(inject(function (_UrlService_) {
            Service = _UrlService_;
        }));

        describe('URL should be valid', function() {
            it('when it contains time parameter', function () {
                var youtubeUrl = 'https://www.youtube.com/watch?v=gxlgM3kBeTM&t=5s',
                    isValid = Service.getYoutubePattern().test(youtubeUrl);
                expect(isValid).toBe(true);
            });

            it('when it contains underscore characters', function () {
                var youtubeUrl = 'https://www.youtube.com/watch?v=WIUGzh_SkEI&t=78s',
                    isValid = Service.getYoutubePattern().test(youtubeUrl);
                expect(isValid).toBe(true);
            });

            it('when it contains dash characters', function () {
                var youtubeUrl = 'https://www.youtube.com/watch?v=auKlp-3554Y',
                    isValid = Service.getYoutubePattern().test(youtubeUrl);
                expect(isValid).toBe(true);
            });

            it('when it contains just video id', function () {
                var youtubeUrl = 'https://www.youtube.com/watch?v=DpvlivmzEzs',
                    isValid = Service.getYoutubePattern().test(youtubeUrl);
                expect(isValid).toBe(true);
            });
        });

        describe('URL should be invalid', function() {
            it('when it contains query parameters except time', function () {
                var youtubeUrl = 'https://www.youtube.com/watch?v=DpvlivmzEzs&feature=youtu.be',
                    isValid = Service.getYoutubePattern().test(youtubeUrl);
                expect(isValid).toBe(false);

                youtubeUrl = 'http://www.youtube.com/watch?feature=player_embedded&v=SEEF_HVMEDQ',
                    isValid = Service.getYoutubePattern().test(youtubeUrl);
                expect(isValid).toBe(false);

                youtubeUrl = 'https://www.youtube.com/watch?v=bXWkaInsow&index=8&list=PLF1E9D263B9DDFEB7',
                    isValid = Service.getYoutubePattern().test(youtubeUrl);
                expect(isValid).toBe(false);
            });

            it('when its user page', function () {
                var youtubeUrl = 'http://www.youtube.com/user/VideoUNIPI',
                    isValid = Service.getYoutubePattern().test(youtubeUrl);
                expect(isValid).toBe(false);
            });

            it('when its shorten URL', function () {
                var youtubeUrl = 'http://youtu.be/-wtIMTCHWuI',
                    isValid = Service.getYoutubePattern().test(youtubeUrl);
                expect(isValid).toBe(false);
            });


        });

        //

    });
}());
