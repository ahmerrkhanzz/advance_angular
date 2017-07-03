(function() {
    'use strict';
    describe('currentDate directive', function() {
        var $compile,
            $rootScope;

        beforeEach(module('qsHub'));

        if (typeof uiMode === 'undefined' || !uiMode) {
            beforeEach(module('templates'));
        }

        beforeEach(inject(function(_$compile_, _$rootScope_){
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        }));

        it('Should insert correct current year', function() {
            var element = $compile('<span current-date="yyyy" />')($rootScope);
            $rootScope.$digest();

            expect(element.text()).toEqual(new Date().getFullYear().toString());
        });

        it('Should insert correct current year, month & day', function() {
            var element = $compile('<span current-date="yyyy/M/d" />')($rootScope);
            $rootScope.$digest();

            expect(element.text()).toEqual([
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                new Date().getDate()
            ].join('/'));
        });
    });
}());