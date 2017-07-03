(function(angular, Pace) {
    'use strict';

    var App = App || {
        cancelMessage : 'cancel',
        errors: {
            401: 'Unauthorized',
            403: 'Forbidden',
        },
        organisationId: 0,
        services: {}
    };

    /**
     *
     * @param $q
     * @param $location
     * @param $localStorage
     * @returns {App.services}
     */
    App.services.authInterceptor = function ($q, $location, $localStorage) {
        var service = this,
            url = '';
        service.lastError = null;

        service.request = function (config) {
            if (!config.timeout) {
                config.cancel  = $q.defer();
                config.timeout = config.cancel.promise;
            }

            return config;
        };

        service.resetUrl = function () {
            url = '';
            service.lastError = null;
        };

        service.hasErrors = function () {
            return !!service.lastError;
        };

        service.getOrganisationId = function () {
            return App.organisationId;
        };

        service.setOrganisationId = function (organisationId) {
            organisationId = parseInt(organisationId, 10);
            if (organisationId && !angular.equals(App.organisationId, organisationId)) {
                App.organisationId = organisationId;
            }
        };

        service.responseError = function(rejection) {
            // if its 401 error and not a cancel request
            if (
                rejection.config.timeout.$$state.value !== App.cancelMessage &&
                rejection.status === 401 &&
                (!service.lastError || service.lastError.status !== 401)
            ) {
                // remove user from local storage
                delete $localStorage.currentUser;
                var redirectUrl = decodeURIComponent($location.url()).replace('/?url=', '');

                App.services.authInterceptor().setOrganisationId($location.search().coreId);
                // if url is not yet set
                if (!url.length) {
                    url = redirectUrl;
                }
                $location.path('/').search({url: url});
                $location.replace();
            }
            if (typeof rejection.status === 'undefined' || rejection.status !== -1) {
                service.lastError = rejection;
            }

            return $q.reject(rejection);
        };

        return service;
    };

    App.config = function(
        $stateProvider,
        $urlRouterProvider,
        $httpProvider,
        ngTableFilterConfigProvider,
        gravatarServiceProvider,
        LightboxProvider
    ) {
        if (Pace) {
            Pace.options.ajax.trackWebSockets = false;
        }
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.interceptors.push('authInterceptor');

        // For any unmatched url, redirect to state /index/main
        $urlRouterProvider.otherwise('/dashboard');
        $stateProvider
            .state('logout', {
                url: '/',
                templateUrl: '/scripts/layouts/login.html',
                data: {
                    login: true,
                    page: 'login'
                }
            })
            .state('forgot-password', {
                url: '/forgot-password',
                templateUrl: '/scripts/layouts/login.html',
                data: {
                    login: true,
                    page: 'forgot-password'
                }
            })
            .state('reset-password', {
                url: '/reset-password?id',
                templateUrl: '/scripts/layouts/login.html',
                data: {
                    login: true,
                    page: 'reset-password'
                },
                controller: function($scope, $stateParams) {
                    $scope.requestId = $stateParams.id;
                }
            })
            .state('user', {
                url: '/profiles',
                abstract: true,
                templateUrl: 'scripts/layouts/main.html'
            })
            .state('user.my-profile', {
                url: '/profile',
                templateUrl: 'scripts/components/profile/profileView.html',
                data: {
                    pageTitle: 'My Profile',
                    label: 'My Profile'
                }
            })
            .state('clients', {
                abstract: true,
                templateUrl: '/scripts/layouts/main.html',
                data: {
                    label: 'Institutions'
                }
            }).state('clients.profiles', {
                url: '/profiles',
                abstract: true,
                template: '<div ui-view></div>',
                data: {
                    label: 'Profiles'
                }
            }).state('clients.profiles.shared', {
                url: '/institution-details',
                templateUrl: '/scripts/components/profiles/shared/sharedProfileView.html',
                data: {
                    pageTitle: 'Institution Details',
                    label: 'Institution Details',
                    name: 'Profiles'
                }
            }).state('clients.profiles.tu', {
                url: '/topuniversities',
                templateUrl: '/scripts/components/profiles/tu/tuProfileView.html',
                data: {
                    pageTitle: 'Undergraduate / Postgraduate',
                    label: 'Undergraduate / Postgraduate',
                    name: 'TopUniversities'
                },
                resolve: {
                    security: [
                        'TuProfileFactory',
                        function (TuProfileFactory) {
                            TuProfileFactory.setIsDepartmentOverview(false);
                            TuProfileFactory.setIsProgramOverview(false);
                        }
                    ]
                }
            }).state('clients.profiles.tm', {
                url: '/topmba',
                templateUrl: '/scripts/components/profiles/tm/tmProfileView.html',
                data: {
                    pageTitle: 'MBA',
                    label: 'MBA',
                    name: 'TopMba'
                }
            }).state('clients.contacts', {
                url: '/contacts',
                templateUrl: '/scripts/components/contacts/contactsView.html',
                data: {
                    pageTitle: 'Contacts',
                    label: 'Contacts',
                    name: 'Contacts'
                },
                resolve: {
                    security: [
                        '$q' , 'UserFactory', 'AuthenticationService',
                        function ($q, UserFactory, AuthenticationService) {
                            UserFactory.setData(AuthenticationService.getUserData());
                            if (!UserFactory.hasData()) {
                                return $q.reject(App.errors[401]);
                            } else if (!UserFactory.hasContactsAccess()) {
                                return $q.reject(App.errors[403]);
                            }
                        }
                    ]
                }
            }).state('staff', {
                abstract: true,
                templateUrl: '/scripts/layouts/main.html',
                data: {
                    label: 'QS Staff'
                }
            }).state('staff.dashboard', {
                url: '/dashboard',
                templateUrl: '/scripts/components/dashboard/admin/dashboardAdminView.html',
                data: {
                    pageTitle: 'QS Staff Dashboard',
                    label: 'QS Staff Dashboard'
                }
            }).state('staff.users', {
                url: '/users',
                abstract: true,
                template: '<div ui-view></div>',
                data: {
                    label: 'Users & Permissions'
                }
            }).state('staff.users.qs', {
                url: '/qs',
                templateUrl: '/scripts/components/users/list/qs/qsUsersListView.html',
                data: {
                    pageTitle: 'QS Users List',
                    label: 'QS Users List',
                    name: 'QS Users'
                },
                resolve: {
                    security: [
                        '$q' , 'UserFactory', 'AuthenticationService',
                        function ($q, UserFactory, AuthenticationService) {
                            UserFactory.setData(AuthenticationService.getUserData());
                            if (!UserFactory.hasData()) {
                                return $q.reject(App.errors[401]);
                            } else if (!UserFactory.hasQsUsersAccess()) {
                                return $q.reject(App.errors[403]);
                            }
                        }
                    ]
                }
            }).state('staff.users.institutions', {
                url: '/institutions',
                templateUrl: '/scripts/components/users/list/institutions/institutionsUsersView.html',
                data: {
                    pageTitle: 'Institutions Users List',
                    label: 'Institutions Users List',
                    name: 'Institutions Users'
                },
                resolve: {
                    security: [
                        '$q' , 'UserFactory', 'AuthenticationService',
                        function ($q, UserFactory, AuthenticationService) {
                            UserFactory.setData(AuthenticationService.getUserData());
                            if (!UserFactory.hasData()) {
                                return $q.reject(App.errors[401]);
                            } else if (!UserFactory.hasInstitutionsUsersAccess()) {
                                return $q.reject(App.errors[403]);
                            }
                        }
                    ]
                }
            }).state('staff.institutions', {
                url: '/institutions',
                template: '<div ui-view></div>',
                data: {
                    label: 'Institutions'
                }
            }).state('staff.institutions.list', {
                url: '/institutions/list',
                templateUrl: '/scripts/components/institutions/list/institutionsListView.html',
                data: {
                    pageTitle: 'Institutions List',
                    label: 'Institutions List'
                },
                params: {
                    coreId: null
                },
                resolve: {
                    security: [
                        '$q' , 'UserFactory', 'AuthenticationService',
                        function ($q, UserFactory, AuthenticationService) {
                            UserFactory.setData(AuthenticationService.getUserData());
                            if (!UserFactory.hasData()) {
                                return $q.reject(App.errors[401]);
                            } else if (!UserFactory.hasInstitutionsListAccess()) {
                                return $q.reject(App.errors[403]);
                            }
                        }
                    ]
                }
            }).state('staff.institutions.department', {
                url: '/department/overview',
                templateUrl: '/scripts/components/institutions/department/departmentOverview.html',
                data: {
                    pageTitle: 'Department Overview',
                    label: 'Department Overview'
                },
                params: {
                    coreId: null,
                    name: null
                },
                resolve: {
                    security: [
                        '$q' , 'UserFactory', 'AuthenticationService', 'TuProfileFactory',
                        function ($q, UserFactory, AuthenticationService, TuProfileFactory) {
                            UserFactory.setData(AuthenticationService.getUserData());
                            TuProfileFactory.setIsDepartmentOverview(true);
                            if (!UserFactory.hasDepartmentsOverviewAccess()) {
                                return $q.reject(App.errors[401]);
                            } else if (!UserFactory.hasDepartmentsOverviewAccess()) {
                                return $q.reject(App.errors[403]);
                            }
                        }
                    ]
                }
            }).state('staff.institutions.tu-programs', {
                url: '/institutions/tu-programs/overview',
                templateUrl: 'scripts/components/institutions/tu-programs/institutionsTuProgramsView.html',
                data: {
                    pageTitle: 'TU Programs Overview',
                    label: 'TU Programs Overview'
                },
                resolve: {
                    security: [
                        '$q' , 'UserFactory', 'AuthenticationService', 'TuProfileFactory',
                        function ($q, UserFactory, AuthenticationService, TuProfileFactory) {
                            UserFactory.setData(AuthenticationService.getUserData());
                            TuProfileFactory.setIsProgramOverview(true);
                            if (!UserFactory.hasTuProgramsOverviewAccess()) {
                                return $q.reject(App.errors[401]);
                            } else if (!UserFactory.hasTuProgramsOverviewAccess()) {
                                return $q.reject(App.errors[403]);
                            }
                        }
                    ]
                }
            }).state('staff.tm-directory', {
                url: '/tm-directory',
                templateUrl: '/scripts/components/tmDirectory/tmDirectoryView.html',
                data: {
                    pageTitle: 'TM Directory',
                    label: 'TM Directory'
                },
                resolve: {
                    security: [
                        '$q' , 'UserFactory', 'AuthenticationService',
                        function ($q, UserFactory, AuthenticationService) {
                            UserFactory.setData(AuthenticationService.getUserData());
                            if (!UserFactory.hasData()) {
                                return $q.reject(App.errors[401]);
                            } else if (!UserFactory.hasTmDirectoryAccess()) {
                                return $q.reject(App.errors[403]);
                            }
                        }
                    ]
                }
            }).state('staff.master-password', {
                url: '/master-password',
                templateUrl: '/scripts/components/master-password/masterPasswordView.html',
                data: {
                    pageTitle: 'Master Password',
                    label: 'Master Password',
                    name: 'Master Password'
                },
                resolve: {
                    security: [
                        '$q' , 'UserFactory', 'AuthenticationService',
                        function ($q, UserFactory, AuthenticationService) {
                            UserFactory.setData(AuthenticationService.getUserData());
                            if (!UserFactory.hasData()) {
                                return $q.reject(App.errors[401]);
                            } else if (!UserFactory.hasMasterPasswordAccess()) {
                                return $q.reject(App.errors[403]);
                            }
                        }
                    ]
                }
            });

        var filterPath = '/scripts/shared/ng-table/filters/';
        var filterAliasUrls = {
            'date-range-picker': filterPath + 'dateRangeFilter.html'
        };
        ngTableFilterConfigProvider.setConfig({
            aliasUrls: filterAliasUrls
        });
        gravatarServiceProvider.protocol = 'https';
        gravatarServiceProvider.defaults = {
          "default": 'mm'
        };

        LightboxProvider.templateUrl = '/scripts/shared/modal/modalTemplate.html';
    };

    App.run = function run(
        $rootScope,
        $state,
        $http,
        $location,
        $localStorage,
        $window,
        constants,
        AuthenticationService,
        $timeout
    ) {
        var dataLayer = $window.dataLayer = $window.dataLayer || [];
        $rootScope.$state = $state;

        // keep user logged in after page refresh
        if ($localStorage.currentUser) {
            AuthenticationService.setAuthorizationHeader($localStorage.currentUser.token);
        }

        $rootScope.$on('$stateChangeStart', function (event) {
            if ($window.localStorage[constants.xStorage.keys.logout] &&
                constants.xStorage.allowedSources.indexOf($window.localStorage[constants.xStorage.keys.logout]) !== -1
            ) {
                event.preventDefault();
                AuthenticationService.logout();
                $state.go('logout');
                return false;
            } else if ($window.localStorage[constants.xStorage.keys.data] &&
                $window.localStorage[constants.xStorage.keys.source] &&
                constants.xStorage.allowedSources.indexOf($window.localStorage[constants.xStorage.keys.source]) !== -1 &&
                !AuthenticationService.hasUserData()
            ) {
                var userData;
                try {
                    userData = angular.fromJson($window.localStorage[constants.xStorage.keys.data]);
                } catch (e) {
                    AuthenticationService.logout();
                    return false;
                }
                AuthenticationService.setUserData(userData.userData);
                AuthenticationService.setData(userData);
            }
            if ($window.localStorage[constants.xStorage.keys.sendToSession]) {
                if ($window.localStorage[constants.xStorage.keys.sendToSession] === 'true') {
                    $window.localStorage[constants.xStorage.keys.sendToSession] = 'false';
                }
            }
        });

        $rootScope.$on('$stateChangeSuccess', function () {
            dataLayer.push({
                event: 'ngRouteChange',
                attributes: {
                    route: $location.path()
                }
            });
            var restrictedPage = AuthenticationService.getPublicPages().indexOf($location.path()) === -1,
                isClientPage = $state.includes('clients') || $state.includes('user');
            App.services.authInterceptor().setOrganisationId($location.search().coreId);
            // if its restricted page and user is not logged in
            if (restrictedPage && !$localStorage.currentUser) {
                var redirectUrl = $location.url();
                // send user to login page
                $location.path('/').search({url: redirectUrl});
                $location.replace();
                // cancel all ajax requests
                $http.pendingRequests.forEach(function (pendingRequest) {
                    if (pendingRequest.cancel) {
                        pendingRequest.cancel.resolve(App.cancelMessage);
                    }
                });
            } else if (// logged in user is client and accessing backend page
                !isClientPage && $localStorage.currentUser &&
                $localStorage.currentUser.info.isClient &&
                $location.path() !== '/'
            ) {
                $location.path(constants.defaultClientPage).search({
                    coreId: App.services.authInterceptor().getOrganisationId() ?
                    App.services.authInterceptor().getOrganisationId() :
                    $localStorage.currentUser.info.primaryInstitution
                });
                $location.replace();
            } else if ( // logged in user is client
                $localStorage.currentUser &&
                $localStorage.currentUser.info.isClient
            ) {
                // check if user has access to institution he's trying to access
                var hasAccessTo = $localStorage.currentUser.info.institutions;
                if ($localStorage.currentUser.info.primaryInstitution &&
                    hasAccessTo.indexOf(parseInt($localStorage.currentUser.info.primaryInstitution, 10)) === -1
                ) {
                    hasAccessTo.push(parseInt($localStorage.currentUser.info.primaryInstitution, 10));
                }
                // if currently requested page is not in the allowed list, send user back to his primary institution
                if (hasAccessTo.indexOf(parseInt($localStorage.currentInstitutionId, 10)) === -1) {
                    if (!$localStorage.currentUser.info.passwordReset) {
                        var userHasAccessTo = false;
                        if ($location.path() !== '/') {
                            userHasAccessTo = $localStorage.currentUser.info.accessTo.indexOf($state.current.name.replace('clients.', '')) !== -1;
                        }
                        var path = userHasAccessTo ? $location.path() : constants.defaultClientPage;
                        $location.path(path).search({
                            coreId: $localStorage.currentUser.info.primaryInstitution
                        });
                        $location.replace();
                    }
                }
            }
        });

        $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {
            if (error === App.errors[401]) {
                AuthenticationService.logout();
                $state.go('logout');
            }
            if (error === App.errors[403]) {
                $state.go('staff.dashboard');
            }
        });
    };

    angular
        .module('qsHub')
        .service('authInterceptor', [
            '$q',
            '$location',
            '$localStorage',
            App.services.authInterceptor
        ])
        .config(App.config)
        .run(App.run, [
            '$rootScope',
            '$state',
            '$http',
            '$location',
            '$localStorage',
            '$window',
            'constants',
            'AuthenticationService',
            '$timeout'
        ]);

}(window.angular, window.Pace));
