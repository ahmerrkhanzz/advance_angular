(function() {
    'use strict';
    describe('toggleClassOnClick directive', function() {
        var $compile,
            $rootScope,
            className = 'clicked';

        beforeEach(module('qsHub'));

        if (typeof uiMode === 'undefined' || !uiMode) {
            beforeEach(module('templates'));
        }

        beforeEach(inject(function(_$compile_, _$rootScope_){
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        }));

        it('Should not assign class on initialize', function() {
            var element = $compile('<a toggle-class-on-click="' + className + '">link</a>')($rootScope);
            $rootScope.$digest();

            expect(element.hasClass(className)).toEqual(false);
        });

        it('Should assign class on click', function() {
            var element = $compile('<a toggle-class-on-click="' + className + '">link</a>')($rootScope);
            $rootScope.$digest();
            element.triggerHandler('click');

            expect(element.hasClass(className)).toEqual(true);
        });

        it('Should remove assign class on secondary click', function() {
            var element = $compile('<div toggle-class-on-click="' + className + '">link</div>')($rootScope);
            $rootScope.$digest();
            element.triggerHandler('click');
            element.triggerHandler('click');

            expect(element.hasClass(className)).toEqual(false);
        });
    });
}());