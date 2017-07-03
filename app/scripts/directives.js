(function(angular) {
    'use strict';

    var App = App || {};
    App = angular.extend({}, App, { directives: {} });


    /**
     * Directive for set Page title - mata title
     */
    App.directives.pageTitle = function($rootScope, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                var listener = function(event, toState, toParams, fromState, fromParams) {
                    // Default title - load on Dashboard 1
                    var title = 'QS Hub';
                    // Create your own title pattern
                    if (toState.data && toState.data.pageTitle) {
                        title += ' | ' + toState.data.pageTitle;
                    }
                    $timeout(function() {
                        element.text(title);
                    });
                };
                $rootScope.$on('$stateChangeStart', listener);
            }
        };
    };

    /**
     * Directive to add fancy styles to checkbox or radiobutton
     * - The directive should has true or false attribute E.g: (my-fancy-check-box="true")
     * - This would check (true) or uncheck (false) the element
     *
     * @param $parse
     * @returns {{restrict: string, require: string, link: link}}
     */
    App.directives.iCheckbox = function($parse) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function($scope, element, $attrs, ngModel) {
                var value = $attrs.value;

                // Update the value on load
                $scope.$watch($attrs.ngModel, function() {
                    $(element).iCheck('update');
                });

                return $(element).iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'

                }).on('ifChanged', function(event) {
                    if ($(element).attr('type') === 'checkbox' && $attrs.ngModel) {
                        $scope.$apply(function() {
                            return ngModel.$setViewValue(event.target.checked);
                        });
                    }
                    if ($(element).attr('type') === 'radio' && $attrs.ngModel) {
                        return $scope.$apply(function() {
                            return ngModel.$setViewValue(value);
                        });
                    }
                });
            }
        };
    };

    /**
     * touchSpin - Directive for Bootstrap TouchSpin
     */
    App.directives.touchSpin = function() {
        return {
            restrict: 'A',
            scope: {
                spinOptions: '='
            },
            link: function(scope, element, attrs) {
                scope.$watch(scope.spinOptions, function() {
                    render();
                });
                var render = function() {
                    $(element).TouchSpin(scope.spinOptions);
                };
            }
        };
    };

    /**
     * iboxTools - Directive for iBox tools elements in right corner of ibox
     */
    App.directives.iboxTools = function($timeout) {
        return {
            restrict: 'C',
            scope: true,
            link: function($scope, $element, $attrs) {
                var show = [],
                    id = $attrs.id || null,
                    animationDuration = 200;
                $scope.$watch($attrs.expand, function(expand) {
                    if (id) {
                        show[id] = expand;
                        if (expand) {
                            $scope.showHide();
                        }
                    }
                });
                $scope.showHide = function() {
                    var ibox = $element.closest('div.ibox'),
                        icon = $element.find('i:first'),
                        content = ibox.find('div.ibox-content');

                    if ($attrs.expand && show[id]) {
                        content.slideDown(animationDuration);
                        icon.addClass('fa-chevron-up').removeClass('fa-chevron-down');
                        ibox.toggleClass('').addClass('border-bottom');
                    } else {
                        content.slideToggle(animationDuration);
                        // Toggle icon from up to down
                        icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                        ibox.toggleClass('').toggleClass('border-bottom');
                    }
                    $timeout(function() {
                        ibox.resize();
                        ibox.find('[id^=map-]').resize();
                    }, 50);
                };
                // Function for close ibox
                $scope.closebox = function() {
                    var ibox = $element.closest('div.ibox');
                    ibox.remove();
                };
            }
        };
    };

    /**
     * Toggle element class on click.
     * eg: toggle-class-on-click
     *
     * @returns {{restrict: string, link: link}}
     */
    App.directives.toggleClassOnClick = function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                    element.toggleClass(attrs.toggleClassOnClick);
                });
            }
        };
    };

    /**
     * Directive for Sparkline chart
     */
    App.directives.sparkline = function() {
        return {
            restrict: 'A',
            scope: {
                sparkData: '=',
                sparkOptions: '=',
            },
            link: function(scope, element, attrs) {
                scope.$watch(scope.sparkData, function() {
                    render();
                });
                scope.$watch(scope.sparkOptions, function() {
                    render();
                });
                var render = function() {
                    $(element).sparkline(scope.sparkData, scope.sparkOptions);
                };
            }
        };
    };

    App.directives.currentDate = function($filter) {
        return {
            restrict: 'A',
            link: function($scope, $element, $attrs) {
                $element.text($filter('date')(new Date(), $attrs.currentDate));
            }
        };
    };

    /**
     * Makes an element floatable while scrolling based on the table close to it
     */
    App.directives.fixedElementWhileScrolling = function() {
        return {
            restrict: 'A',
            link: function($scope, $element, $attrs) {
                /**
                 * Actions to do when floatable element visibility changes.
                 *
                 * @param {int} elementHeight
                 * @returns {boolean}
                 */
                function handleVisibiliyChanges(elementHeight) {
                    // attach scroll listener
                    $(window).scroll(handleWindowScroll);
                    centerElement();
                }

                /**
                 * Actions to do when window scroll occurs.
                 */
                function handleWindowScroll() {
                    centerElement();
                }

                /**
                 * Center floatable element in the middle of the screen.
                 */
                function centerElement() {
                    var targetHeight = angular.element(document.querySelector($attrs.fixedElementWhileScrolling)).height();
                    var elementHeight = $element.height(),
                        windowScroll = $(window).scrollTop(),
                        windowHeight = $(window).height(),
                        targetElementTopOffset = $($attrs.fixedElementWhileScrolling).offset() ?
                        $($attrs.fixedElementWhileScrolling).offset().top : 0,
                        marginTop = windowScroll > windowHeight ?
                        (windowHeight - elementHeight) / 2 + windowScroll - targetElementTopOffset : (windowHeight - targetElementTopOffset - elementHeight) / 2 + windowScroll;

                    if ($(window).width() < 768) {
                        if (marginTop < 0 || targetHeight === elementHeight || targetHeight < (elementHeight + marginTop)) {
                            marginTop = 0;
                        }
                    } else {
                        if (targetHeight < (elementHeight + marginTop)) {
                            marginTop = targetHeight - elementHeight;
                        }
                        if (marginTop < 0 || targetHeight === elementHeight) {
                            marginTop = 0;
                        }
                    }

                    $($element).stop().animate({
                        'top': marginTop + 'px'
                    }, 'slow');
                }

                // listen to element visibility changes
                $scope.$watchCollection(function() {
                    // if not visible will return 0
                    return $element.height();
                }, handleVisibiliyChanges);
            }
        };
    };

    App.directives.convertToNumber = function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function(val) {
                    return parseInt(val, 10);
                });
                ngModel.$formatters.push(function(val) {
                    return '' + val;
                });
            }
        };
    };

    App.directives.waveSpinner = function() {
        return {
            restrict: 'A',
            template: ' <div class="sk-spinner sk-spinner-wave">' +
                '<div class="sk-rect1"></div>&nbsp;' +
                '<div class="sk-rect2"></div>&nbsp;' +
                '<div class="sk-rect3"></div>&nbsp;' +
                '<div class="sk-rect4"></div>&nbsp;' +
                '<div class="sk-rect5"></div>' +
                '</div>'
        };
    };

    /**
     * Directive to attach bootstrap tooltip on an element
     */
    App.directives.customPopover = function($animateCss) {
        return {
            restrict: 'A',
            link: function(scope, el, attrs) {
                $(el).popover({
                    trigger: attrs.popoverTrigger || 'hover focus',
                    html: true,
                    content: attrs.popoverHtml,
                    container: attrs.popoverContainer || '',
                    placement: attrs.popoverPlacement
                });
                scope.$watch(function() {
                    return attrs.popoverVisibility;
                }, function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if (newValue === 'true') {
                            $(el).popover('show');
                            el.next("div").addClass("animated fadeInDown");
                            el.next("div").css("top", "0px");
                        } else {
                            $(el).popover('hide');
                        }
                    }
                });
            }
        };
    };

    /**
     * Directive for Angular Ui Switch
     */
    App.directives.switch = function() {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            template: function(element, attrs) {
                var html = '';
                html += '<span';
                html += ' class="switch' + (attrs.class ? ' ' + attrs.class : '') + '"';
                html += attrs.ngModel ? ' ng-click="' + attrs.ngDisabled + ' ? ' + attrs.ngModel + ' : ' + attrs.ngModel + '=!' + attrs.ngModel + (attrs.ngChange ? '; ' + attrs.ngChange + '()"' : '"') : '';
                html += ' ng-class="{checked:' + attrs.ngModel + ', disabled:' + attrs.ngDisabled + ' }"';
                html += '>';
                html += '<small></small>';
                html += '<input type="checkbox"';
                html += attrs.id ? ' id="' + attrs.id + '"' : '';
                html += attrs.name ? ' name="' + attrs.name + '"' : '';
                html += attrs.ngModel ? ' ng-model="' + attrs.ngModel + '"' : '';
                html += attrs.ngModel ? ' ng-change="' + attrs.ngChange + '"' : '';
                html += attrs.ngDisabled ? ' ng-disabled="' + attrs.ngDisabled + '"' : '';
                html += ' style="display:none" />';
                html += '<span class="switch-text">';
                /*adding new container for switch text*/
                html += attrs.on ? '<span class="on">' + attrs.on + '</span>' : '';
                /*switch text on value set by user in directive html markup*/
                html += attrs.off ? '<span class="off">' + attrs.off + '</span>' : ' ';
                /*switch text off value set by user in directive html markup*/
                html += '</span>';
                return html;
            }
        };
    };

    App.directives.includeReplace = function() {
        return {
            require: 'ngInclude',
            restrict: 'A',
            link: function(scope, el, attrs) {
                el.replaceWith(el.children());
            }
        };
    };

    /**
     * Directive for Upgrade banner
     */
    App.directives.upgradeBanner = function() {
        return {
            restrict: 'A',
            scope: {
                upgradeEmail: '@',
                basicProfile: '&',
                upgradeClick: '&',
                infoBlockClass: '=',
                buttonsBlockClass: '='
            },
            template:
            '<div class="alert alert-success" ng-if="basicProfile()">'+
            '<div class="row">'+
            '<div ng-class="getInfoBlockClass()" >'+
            '<span class="block m-t-xs">'+
            '<i class="fa fa-star"></i>'+
            '<span>To edit the information below, please upgrade to an Advanced </span>'+
            '<span>profile by contacting: <strong>{{upgradeEmail}}</strong></span>'+
            '</span>'+
            '</div>'+
            '<div ng-class="getButtonsBlockClass()">'+
            '<a class="btn btn-primary btn-sm btn-block" ng-click="upgradeClick()">'+
            '<i class="fa fa-star"></i>'+
            '<span>Upgrade now</span>'+
            '</a>'+
            '</div>'+
            '</div>'+
            '</div>',
            link: function(scope) {
                scope.getInfoBlockClass = function() {
                    if (scope.infoBlockClass) {
                        return scope.infoBlockClass;
                    }
                };
                scope.getButtonsBlockClass = function() {
                    if (scope.buttonsBlockClass) {
                        return scope.buttonsBlockClass;
                    }
                };
            }
        };
    };

    /**
     * Datagrid totals.
     *
     * @returns {{restrict: string, scope: {tableParams: string}, template: string}}
     */
    App.directives.datagridTotals = function() {
        return {
            restrict: 'A',
            scope: { tableParams: '=datagridTotals' },
            template: '{{ tableParams.count() > tableParams.total() ? tableParams.total() : tableParams.count() }} of {{ tableParams.total() }} entries'
        };
    };

    /**
     * Directive to Confirm Password.
     */
    App.directives.verifyPassword = function (){
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var password = '#' + attrs.verifyPassword;
                elem.add(password).on('keyup', function () {
                    scope.$apply(function () {
                        var isEmpty = $(password).val() === '';
                        var invalidLen = !isEmpty && ($(password).val().length < 8 || $(password).val().length > 20);
                        ctrl.$setValidity('isEmpty', !isEmpty);
                        ctrl.$setValidity('invalidLen', !invalidLen);
                        ctrl.$setValidity('pwmatch', elem.val() === $(password).val());
                    });
                });
            }
        };
    };

    angular
        .module('qsHub')
        .directive('pageTitle', App.directives.pageTitle)
        .directive('toggleClassOnClick', App.directives.toggleClassOnClick)
        .directive('iCheckbox', App.directives.iCheckbox)
        .directive('sparkline', App.directives.sparkline)
        .directive('fixedElementWhileScrolling', App.directives.fixedElementWhileScrolling)
        .directive('currentDate', App.directives.currentDate)
        .directive('iboxTools', App.directives.iboxTools)
        .directive('convertToNumber', App.directives.convertToNumber)
        .directive('touchSpin', App.directives.touchSpin)
        .directive('waveSpinner', App.directives.waveSpinner)
        .directive('switch', App.directives.switch)
        .directive('includeReplace', App.directives.includeReplace)
        .directive('customPopover', App.directives.customPopover)
        .directive('datagridTotals', App.directives.datagridTotals)
        .directive('verifyPassword', App.directives.verifyPassword)
        .directive('upgradeBanner', App.directives.upgradeBanner);

}(window.angular));
