(function (angular) {
    "use strict";

    var App = App || {};

    App.handleMain = function (
        version,
        $scope,
        $state,
        $location,
        $localStorage,
        constants,
        InstitutionsService,
        InstitutionSwitchService,
        AuthenticationService,
        WatchService,
        WebSocketsService,
        InstitutionFactory,
        TuProfileFactory,
        UserFactory,
        SharedProfileFactory,
        AppUpdateMessageFactory,
        ModalService,
        AuthInterceptor
    ) {
        var controller = this;
        controller.handles = UserFactory.getHandles();

        $scope.version = version;
        $scope.institution = {
            selected: {
                name: InstitutionFactory.getDisplayName(),
                coreId: InstitutionFactory.getCoreId()
            }
        };
        $scope.institutionsDropdownList = null;
        $scope.email = null;
        $scope.profileLogo = UserFactory.getProfileLogo();

        /**
         * Action to do on search for institution.
         *
         * @param {String} searchPhrase
         */
        $scope.searchInstitutions = function searchInstitutions(searchPhrase) {
            $scope.searchInProgress = true;
            InstitutionSwitchService.searchInstitutions(searchPhrase).then(function (results) {
                $scope.institutionsDropdownList = results;
                $scope.searchInProgress = false;
            });
        };

        /**
         * Action to do on select a searched institution.
         *
         * @param {Object} institution
         */
        $scope.handleSearchInstitutionClick = function (institution) {
            if (!institution || !institution.coreId) {
                return false;
            }
            if ($state.$current.includes.staff) {
                $location.path(constants.defaultClientPage).search({ coreId: institution.coreId });
            } else {
                $location.path($location.path()).search({ coreId: institution.coreId });
            }
        };

        /**
         * Actions to do on goto parent institution button click.
         */
        $scope.handleGoToParentInstitution = function () {
            if (!$scope.parentCoreId) {
                return false;
            }

            $location.path(constants.defaultClientPage).search({ coreId: $scope.parentCoreId });
        };

        /**
         * Checks if user has access to page
         *
         * @param page
         * @returns {boolean}
         */
        controller.userHasAccessTo = function (page) {
            var userHasAccessTo = false;
            if (angular.isDefined($localStorage.currentUser) &&
                angular.isArray($localStorage.currentUser.info.accessTo) &&
                $localStorage.currentUser.info.accessTo.length > 0
            ) {
                userHasAccessTo = $localStorage.currentUser.info.accessTo.indexOf(page) !== -1;
            }
            if (angular.equals(UserFactory.getHandles()[$state.current.name], page)) {
                userHasAccessTo = true;
            }
            return userHasAccessTo;
        };

        /**
         * Is user allowed to login into institution.
         *
         * @param {Object} institutionData
         */
        controller.isInstitutionAllowed = function (institutionData) {
            // institution data is loaded
            if (institutionData && institutionData.typeId) {
                // if it's a simple department - login to parent institution
                if (institutionData.typeId === constants.typeId.simpleDepartmentId) {
                    $location.path($location.path()).search({ coreId: institutionData.parentCoreId });
                    return false;
                }
                // Check if user is accessing allowed institution
                if (UserFactory.isClient() && !UserFactory.isAllowedToLogin($localStorage.currentInstitutionId)) {
                    $location.path($location.path()).search({ coreId: $localStorage.currentUser.info.primaryInstitution });

                    return false;
                }
                // if the institution is marked as deleted or inactive
                if (
                    institutionData.deleted ||
                    (typeof institutionData.active !== 'undefined' && !institutionData.active)
                ) {
                    // show info message to a user about inactive institution
                    return false;
                }

                return true;
            } else {
                // if its qs user
                if (UserFactory.hasData() && !UserFactory.isClient()) {
                    // send user to qs dashboard
                    controller.resetInstitutionAndSendToQsDashboard();
                    return false;
                }
                // logout user
                AuthenticationService.logout();
                InstitutionFactory.setData(null);
                $location.path('/');
                $location.search('coreId', null);
                $location.replace();
                return false;
            }
        };

        /**
         * Check if logged in user is allowed to login to the selected institution
         *
         * @returns {Boolean}
         */
        controller.isAllowed = function () {
            return UserFactory.isAllowedToLogin($localStorage.currentInstitutionId);
        };

        /**
         * Check if client user has access to parent institution
         *
         * @returns {Boolean}
         */
        controller.allowParent = function () {
            var allowedInsitutes = UserFactory.getAllowedInstitutions();
            var hasAccessTo = false;
            if ($scope.parentCoreId) {
                if (UserFactory.isClient()) {
                    allowedInsitutes.forEach(function (item) {
                        if (item === $scope.parentCoreId) {
                            return (hasAccessTo = true);
                        }
                    });
                }
                else {
                    hasAccessTo = true;
                }
                return hasAccessTo;
            }
        };

        /**
         * Show disable banner for:
         *
         * QS or school Users if:
         * 1. institution is not active
         * 2. the current page is client page
         *
         * @returns {Boolean}
         */
        controller.isDisabled = function () {
            return InstitutionFactory.isActive() === false && $state.includes('clients');
        };

        /**
         * When user with specific access is logged in
         * and navigates institution that doesn't have that specific access
         *
         * @returns {boolean|*}
         */
        controller.noAccess = function () {
            // if current page is TU/TM and institution doesn't have TU/TM
            if (UserFactory.isClient() &&
                ((typeof $state.current.name !== 'undefined' && $state.current.name.indexOf('.tu') !== -1 &&
                    !InstitutionFactory.isTuSubscribed()) ||
                    (typeof $state.current.name !== 'undefined' && $state.current.name.indexOf('.tm') !== -1 &&
                        !InstitutionFactory.isTmSubscribed()))
            ) {
                return true;
            }

            return UserFactory.noAccess($state.current.name);
        };

        controller.resetInstitutionAndSendToQsDashboard = function () {
            // reset institution to default
            $localStorage.currentInstitutionId = InstitutionFactory.getDefaultCoreId();
            // send user to qs dashboard
            $location.path('/admin/dashboard');
            $location.search('coreId', InstitutionFactory.getDefaultCoreId());
            $location.replace();
        };

        /**
         * help Icon action handler.
         *
         * @param item
         */
        $scope.helpIcon = function (size) {
            var modalOptions = {
                closeButtonText: 'Ok',
                headerText: 'Need help?'

            };
            var modalDefaults = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                size: size,
                templateUrl: '/scripts/components/modal/helpModal.html'
            };
            ModalService.show(modalDefaults, modalOptions);
        };

        controller.coreIdWatch = function (newCoreId, oldCoreId) {
            if (AuthInterceptor.hasErrors()) {
                return false;
            }
            if (
                constants.publicPages.indexOf($location.path()) !== -1 ||
                (
                    !newCoreId &&
                    !UserFactory.hasData() &&
                    !AuthenticationService.hasUserData()
                )
            ) {
                return false;
            }
            TuProfileFactory.closeSidebars();
            SharedProfileFactory.closeSidebars();

            // if user data is not loaded
            if (!UserFactory.hasData()) {
                // check if user data exists in the session
                if (AuthenticationService.getUserData()) {
                    UserFactory.setData(AuthenticationService.getUserData());
                } else {
                    // temporary fix as this file will be excluded from project.
                    var publicPages = AuthenticationService.getPublicPages(),
                        restrictedPage = publicPages.indexOf($location.path()) === -1;
                    if (restrictedPage) {
                        // send user to login page
                        return $location.path('/');
                    }

                    return true;
                }
            }
            $scope.email = UserFactory.getUserName();
            $scope.profileLogo = UserFactory.getProfileLogo();
            $scope.isClient = UserFactory.isClient();
            //controller.fullName = UserFactory.getFullName();
            // if no Core id in the URL
            if (!newCoreId) {
                // if user is client
                if ($scope.isClient) {
                    if (oldCoreId) {
                        newCoreId = oldCoreId;
                    } else if ($localStorage.currentInstitutionId && controller.isAllowed()) {
                        newCoreId = $localStorage.currentInstitutionId;
                    } else {
                        newCoreId = UserFactory.getPrimaryInstitutionCoreId();
                    }
                } else {
                    if (oldCoreId) {
                        newCoreId = oldCoreId;
                    } else if ($localStorage.currentInstitutionId) {
                        newCoreId = $localStorage.currentInstitutionId;
                    } else {
                        newCoreId = InstitutionFactory.getDefaultCoreId();
                    }
                }
            }
            if ($scope.isClient) {
                InstitutionSwitchService.getClientInstitutions().then(function (institutionsList) {
                    // update institutions dropdown options
                    $scope.institutionsDropdownList = institutionsList;
                });
                // Check if user has access to new core id, if not, sent to primary institution
                if ($localStorage.currentUser.info.institutions.indexOf(parseInt(newCoreId)) === -1) {
                    newCoreId = $localStorage.currentUser.info.primaryInstitution;
                }
            }

            $localStorage.currentInstitutionId = newCoreId;
            controller.fullName = UserFactory.getFullName();

            controller.profileLogo = function () {
                return UserFactory.getProfileLogo();
            };
            InstitutionsService.getInstitutionData(newCoreId).then(function (data) {
                var institutionData = data && data.results ? data.results[0] : null;
                if (institutionData) {
                    controller.isInstitutionAllowed(institutionData);
                    InstitutionFactory.setData(institutionData);

                    var displayName = InstitutionFactory.getDisplayName();
                    if (!UserFactory.isClient()) {
                        displayName = displayName + ' [' + InstitutionFactory.getCoreId() + ']';
                    }
                    if (institutionData && institutionData.parentName) {
                        $scope.institution.selected = {
                            name: displayName,
                            coreId: InstitutionFactory.getCoreId(),
                            parentInstitutionName: institutionData.parentName
                        };
                    } else {
                        $scope.institution.selected = {
                            name: displayName,
                            coreId: InstitutionFactory.getCoreId()
                        };
                    }
                    $scope.parentCoreId = InstitutionFactory.getParentCoreId();
                }
            });
        };

        controller.releaseVersionWatch = function (releaseVersion) {
            AppUpdateMessageFactory.setVisible(version < releaseVersion);
        };

        controller.initWatches = function () {
            // watch for coreId changes in the URL
            WatchService.create($scope, function () {
                return $location.search().coreId;
            }, controller.coreIdWatch);

            WebSocketsService.subscribe('release', 'version', controller.releaseVersionWatch);

            // watch for Username changes changes at profile page
            WatchService.create($scope, UserFactory.getFullName, function (fullName) {
                if (fullName) {
                    controller.fullName = fullName;
                }
            });

            // watch for Username changes changes at profile page
            WatchService.create($scope, UserFactory.getProfileLogo, function (profileLogo) {
                if (profileLogo) {
                    $scope.profileLogo = profileLogo;
                }
            });
        };

        controller.init = function () {
            controller.initWatches();
        };
        controller.init();
    };

    angular
        .module('qsHub')
        .controller('MainController', [
            'version',
            '$scope',
            '$state',
            '$location',
            '$localStorage',
            'constants',
            'InstitutionsService',
            'InstitutionSwitchService',
            'AuthenticationService',
            'WatchService',
            'WebSocketsService',
            'InstitutionFactory',
            'TuProfileFactory',
            'UserFactory',
            'SharedProfileFactory',
            'AppUpdateMessageFactory',
            'ModalService',
            'authInterceptor',
            App.handleMain
        ]);
} (window.angular));
