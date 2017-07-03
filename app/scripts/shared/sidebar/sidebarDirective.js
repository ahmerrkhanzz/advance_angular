(function(angular) {
    'use strict';

    var App = App || {};
    App = angular.extend({}, App, {directives:{}});

    /**
     * Directive for run metsiMenu on sidebar navigation
     *
     * @param $timeout
     * @param InstitutionFactory
     * @param UserFactory
     * @param WatchService
     * @returns {{restrict: string, link: link}}
     */
    App.directives.sideNavigation = function ($timeout, InstitutionFactory, UserFactory, WatchService) {
        return {
            restrict: 'A',
            link: function($scope, element) {
                // Call the metisMenu plugin and plug it to sidebar navigation
                $timeout(function(){
                    element.metisMenu();
                });

                var tuEnabledForInstitution = false,
                    tuEnabledForUser = false,
                    tmEnabledForInstitution = false,
                    tmEnabledForUser = false,
                    watches = [];

                $scope.isTuEnabled = false;
                $scope.isTmEnabled = false;

                var toggleTuAccess = function () {
                    $scope.isTuEnabled = UserFactory.isClient() ?
                        tuEnabledForUser && tuEnabledForInstitution : tuEnabledForInstitution;
                };
                var toggleTmAccess = function () {
                    $scope.isTmEnabled = UserFactory.isClient() ?
                        tmEnabledForUser && tmEnabledForInstitution : tmEnabledForInstitution;
                };

                WatchService.create($scope, InstitutionFactory.isAdvancedProgram, function (is) {
                    if (is) {
                        $scope.isTuEnabled = false;
                    }
                });

                var initWatches = function () {
                    angular.forEach(watches, function (watch) {
                        watch();
                    });
                    watches.push(WatchService.create($scope, InstitutionFactory.isTuSubscribed, function (isTuSubscribed) {
                        tuEnabledForInstitution = !!(InstitutionFactory.getCoreId() && isTuSubscribed);
                        toggleTuAccess();
                    }));

                    watches.push(WatchService.create($scope, UserFactory.isTuEnabled, function (isTuEnabled) {
                        tuEnabledForUser = !!(InstitutionFactory.getCoreId() && isTuEnabled);
                        toggleTuAccess();
                    }));

                    watches.push(WatchService.create($scope, InstitutionFactory.isTmSubscribed, function (isTmSubscribed) {
                        tmEnabledForInstitution = !!(InstitutionFactory.getCoreId() && isTmSubscribed);
                        toggleTmAccess();
                    }));

                    watches.push(WatchService.create($scope, UserFactory.isTmEnabled, function (isTmEnabled) {
                        tmEnabledForUser = !!(InstitutionFactory.getCoreId() && isTmEnabled);
                        toggleTmAccess();
                    }));
                };

                WatchService.create($scope, InstitutionFactory.getCoreId, function (coreId) {
                    // trigger watches only when institution data is loaded
                    if (coreId) {
                        initWatches();
                        toggleTuAccess();
                        toggleTmAccess();
                    }
                });
            }
        };
    };

    /**
     * Directive for minimalize sidebar
     *
     * @returns {{restrict: string, template: string, controller: controller}}
     */
    App.directives.minimalizeSidebar = function () {
        return {
            restrict: 'A',
            template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
            controller: function ($scope) {
                $scope.minimalize = function () {
                    $("body").toggleClass("mini-navbar");
                    if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                        // Hide menu in order to smoothly turn on when maximize menu
                        $('#side-menu').hide();
                        // For smoothly turn on menu
                        setTimeout(
                            function () {
                                $('#side-menu').fadeIn(500);
                            }, 100);
                    } else if ($('body').hasClass('fixed-sidebar')){
                        $('#side-menu').hide();
                        setTimeout(
                            function () {
                                $('#side-menu').fadeIn(500);
                            }, 300);
                    } else {
                        // Remove all inline style from jquery fadeIn function to reset menu state
                        $('#side-menu').removeAttr('style');
                    }
                };
            }
        };
    };

    angular
        .module('qsHub')
        .directive('sideNavigation', ['$timeout', 'InstitutionFactory', 'UserFactory', 'WatchService', App.directives.sideNavigation])
        .directive('minimalizaSidebar', App.directives.minimalizeSidebar);

}(window.angular));
