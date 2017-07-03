describe('displayFiltering directive', function() {
    var $compile,
        $rootScope,
        element;

        beforeEach(module('qsHub'));

    if (typeof uiMode === 'undefined' || !uiMode) {
        // load via karma
        beforeEach(module('templates'));
    } else {
        // load manually
        beforeEach(inject(function(_$templateCache_) {
            _$templateCache_.put('/scripts/shared/displayFiltering/displayFilteringView.html', '');
        }));
    }

    beforeEach(inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    describe('When "columns" attribute is not provided', function() {
        beforeEach(inject(function(){
            $rootScope.active = true;
            var directive = angular.element('<display-filtering active="active"></display-filtering>');
            element = $compile(directive)($rootScope);
            $rootScope.$digest();
        }));

        it('$scope.columns should have data passed from "columns" attribute', function() {
            expect(element.scope().columns).toBe($rootScope.columns);
        });

        it('$scope.active should have data passed from "active" attribute', function() {
            expect(element.scope().active).toBe($rootScope.active);
        });

        it('should display "dropdown-toggle" element', function() {
            expect(element.find('.dropdown-toggle').length).toEqual(1);
            expect(element.find('.dropdown-toggle').hasClass('ng-hide')).toBe(false);
        });

        it('should have "dropdown-menu" element', function() {
            expect(element.find('.dropdown-menu').length).toEqual(1);
        });

        it('should not have dropdown elements', function() {
            expect(element.find('li').length).toEqual(0);
        });
    });

    describe('When correct attributes are provided', function() {
        beforeEach(inject(function(){
            $rootScope.active = true;
            $rootScope.columns = [
                {
                    title: 'Email'
                },
                {
                    title: 'Fullname'
                },
                {
                    title: 'Contact Types'
                },
                {
                    title: 'Last Login'
                }
            ];
            var directive = angular.element('<display-filtering columns="columns" active="active"></display-filtering>');
            element = $compile(directive)($rootScope);
            $rootScope.$digest();
        }));

        it('$scope.columns should have data passed from "columns" attribute', function() {
            expect(element.scope().columns).toBe($rootScope.columns);
        });

        it('$scope.active should have data passed from "active" attribute', function() {
            expect(element.scope().active).toBe($rootScope.active);
        });

        it('should display "dropdown-toggle" element', function() {
            expect(element.find('.dropdown-toggle').length).toEqual(1);
            expect(element.find('.dropdown-toggle').hasClass('ng-hide')).toBe(false);
        });

        it('should have "dropdown-menu" element', function() {
            expect(element.find('.dropdown-menu').length).toEqual(1);
        });

        it('should have 4 dropdown elements populated with $scope.columns data', function() {
            expect(element.find('li').length).toEqual(5);

            expect(element.find('li:nth(0) label').text()).toEqual($rootScope.columns[0].title);
            expect(element.find('li:nth(1) label').text()).toEqual($rootScope.columns[1].title);
            expect(element.find('li:nth(2) label').text()).toEqual($rootScope.columns[2].title);
            expect(element.find('li:nth(3) label').text()).toEqual($rootScope.columns[3].title);
        });

        describe('When element is disabled in parent scope', function() {
            it('should not display "dropdown-toggle" element', function() {
                $rootScope.active = false;
                $rootScope.$digest();

                expect(element.find('.dropdown-toggle').hasClass('ng-hide')).toBe(true);
            });
        });
    });
});