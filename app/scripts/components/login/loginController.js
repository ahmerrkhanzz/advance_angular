(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.Login = function (
        $rootScope,
        $scope,
        $location,
        $localStorage,
        $state,
        $window,
        constants,
        AuthenticationService,
        PasswordService,
        UserFactory,
        InstitutionFactory,
        NotifierFactory,
        authInterceptor,
        InstitutionsListService
    ) {
        var controller = this;
        $scope.forms = {};
        $scope.credentials = {};
        $scope.forgottenPassword = {};
        $scope.showForgotPassword = false;
        $scope.showResetPassword = false;
        $scope.showResetPasswordConfirmation = false;
        $scope.showAfterResetPasswordConfirmation = false;
        $scope.loginInProgress = false;
        $scope.animate = false;
        controller.getPasswordValidator = function () {
            return [
                {name: 'Minimum 8 characters', status: false}, // 0
                {name: 'Maximum 32 characters', status: false}, // 1
                {name: 'Lowercase letter (a-z)', status: false}, // 2
                {name: 'Uppercase letter (A-Z)', status: false}, // 3
                {name: 'Number (0-9)', status: false}, // 4
                {name: 'Special characters', status: false}, // 5
                {name: 'Both passwords match', status: false} // 6
            ];
        };

        controller.isPasswordValid = function () {
            var result = true;
            angular.forEach($scope.validationItems, function (item) {
                if (result && !item.status) {
                    result = false;
                }
            });

            return result;
        };

        controller.errors = {
            missingRequired: 'Username and password are required',
            invalidUsername: 'Please enter a valid username',
            incorrectCredentials: 'Username or password is incorrect',
            accountNotComplete: 'Your account setup is not completed',
        };

        if ($state.current.data.page === 'forgot-password') {
            $scope.showResetPassword = false;
            $scope.showForgotPassword = true;
            $scope.showResetPasswordConfirmation = false;
            $scope.showAfterResetPasswordConfirmation = false;
        }

        if ($state.current.data.page === 'reset-password') {
            $scope.showResetPassword = true;
            $scope.showForgotPassword = false;
            $scope.showResetPasswordConfirmation = false;
            $scope.showAfterResetPasswordConfirmation = false;
            $scope.validationItems = controller.getPasswordValidator();
            $scope.password = null;
            $scope.repeatPassword = null;
        }

        $scope.validatePassword = function () {
            if ($scope.showResetPassword) {
                $scope.validationItems = controller.getPasswordValidator();
                var pattern = null;
                // 0
                if ($scope.forms.resetPasswordForm.password.$viewValue !== null &&
                    $scope.forms.resetPasswordForm.password.$viewValue.length > 7
                ) {
                    $scope.validationItems[0].status = true;
                }
                // 1
                if ($scope.forms.resetPasswordForm.password.$viewValue !== null &&
                    $scope.forms.resetPasswordForm.password.$viewValue.length < 33 &&
                    $scope.forms.resetPasswordForm.password.$viewValue.length > 0
                ) {
                    $scope.validationItems[1].status = true;
                }
                // 2
                pattern = new RegExp(/(?=.*?[a-z])/);
                if (pattern.test($scope.forms.resetPasswordForm.password.$viewValue)
                ) {
                    $scope.validationItems[2].status = true;
                }
                // 3
                pattern = new RegExp(/(?=.*?[A-Z])/);
                if (pattern.test($scope.forms.resetPasswordForm.password.$viewValue)
                ) {
                    $scope.validationItems[3].status = true;
                }
                // 4
                pattern = new RegExp(/(?=.*?[0-9])/);
                if (pattern.test($scope.forms.resetPasswordForm.password.$viewValue)
                ) {
                    $scope.validationItems[4].status = true;
                }
                // 5
                pattern = new RegExp(/(?=.*?[\s\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;<\=\>\?\@\[\\\]\^\_\`\{\|\}\~\£\¬\€])/);
                if (pattern.test($scope.forms.resetPasswordForm.password.$viewValue)
                ) {
                    $scope.validationItems[5].status = true;
                }
                // 6
                if ((angular.isDefined($scope.forms.resetPasswordForm.password.$viewValue) &&
                    angular.isDefined($scope.forms.resetPasswordForm.repeatPassword.$viewValue)) &&
                    angular.equals(
                        $scope.forms.resetPasswordForm.password.$viewValue,
                        $scope.forms.resetPasswordForm.repeatPassword.$viewValue
                    ) && ($scope.forms.resetPasswordForm.password.$viewValue.length > 0 &&
                    $scope.forms.resetPasswordForm.repeatPassword.$viewValue.length > 0)) {
                    $scope.validationItems[6].status = true;
                }
            }
        };

        $scope.handleForgotPasswordClick = function () {
            $scope.showResetPasswordConfirmation = false;
            $scope.resetSubmitInProgress = false;
            $scope.email = null;
            $scope.showForgotPassword = !$scope.showForgotPassword;
            if ($scope.showResetPassword) {
                $scope.showForgotPassword = false;
                $scope.showResetPassword = false;
                $state.go('logout');
            } else {
                $scope.showForgotPassword = !$scope.showForgotPassword;
                if ($scope.showForgotPassword) {
                    $state.go('forgot-password');
                } else {
                    $state.go('logout');
                }
            }
        };

        controller.showError = function (errorMessage) {
            $scope.animate = true;
            $scope.error = errorMessage;
            setTimeout(function() {
                $scope.animate = false;
            }, 1000);
        };

        /**
         * Reset errors.
         */
        $scope.resetErrors = function () {
            $scope.error = false;
        };

        /**
         * Actions to do when login button is clicked.
         *
         * @returns {boolean}
         */
        $scope.handleLogin = function () {
            $scope.forms.loginForm.$setSubmitted();
            if (
                $scope.loginInProgress ||
                !$scope.forms.loginForm ||
                !$scope.forms.loginForm.$valid
            ) {
                var error = $scope.forms.loginForm.$error.email ?
                    controller.errors.invalidUsername : controller.errors.missingRequired;
                controller.showError(error);

                return false;
            }
            $scope.loginInProgress = true;
            $scope.animate = false;
            AuthenticationService.login(
                $scope.credentials.username,
                $scope.credentials.password
            ).then(controller.loginCallback);
        };

        /**
         * Actions to do on login callback.
         *
         * @param {boolean} response
         */
        controller.loginCallback = function (response) {
            if (angular.equals(response, true)) {
                var redirectUrl = $location.search().url,
                    coreId = null;

                if (UserFactory.isClient()) {
                    coreId = UserFactory.getPrimaryInstitutionCoreId();
                    // if user has access to institution details page, send him there after login
                    if (!angular.isDefined(redirectUrl) &&
                        UserFactory.hasAccessToInstitutionDetails()
                    ) {
                        redirectUrl = constants.defaultClientPage;
                    } else {
                        if (angular.isDefined(redirectUrl) &&
                            redirectUrl.indexOf('profiles') === -1
                        ) {
                            // Get subscriptions for the primary institutuion
                            InstitutionsListService.getInstitution(coreId).then(function (response) {
                                var allowState = UserFactory.getFirstAllowedState(response.subscriptions);
                                // otherwise, send user to the first page in his access list
                                if (!angular.equals('/', allowState)) {
                                    if (allowState.indexOf('statistics') === -1) {
                                        $state.go(allowState);
                                    } else {
                                        // Redirect to statistics core page
                                        $window.location = constants.urls.core + '/statistics';
                                    }
                                } else {
                                    $scope.animate = false;
                                    $scope.loginInProgress = false;
                                    controller.showError(controller.errors.accountNotComplete);

                                    return false;
                                }

                                return true;
                            });
                        }
                    }
                    if (!UserFactory.hasAccess()) {
                        $scope.loginInProgress = false;
                        redirectUrl = '/';
                        controller.showError('Your account setup is not completed');
                    }
                } else {
                    if ($localStorage.currentInstitutionId) {
                        coreId = $localStorage.currentInstitutionId;
                    } else {
                        coreId = InstitutionFactory.getDefaultCoreId();
                    }
                    if (redirectUrl) {
                        // Check if the QS user has access to the area matching the
                        var urlStates = $state.get().map(function(state) {
                                var result = {};
                                if ($state.href(state.name) && !state.abstract) {
                                    result[$state.href(state.name).replace('#', '')] = state.name;
                                } else {
                                    result = null;
                                }
                                return result;
                            }).filter(function(e){return e;}),
                            resultUrlStates = {},
                            keyResult = '';

                        angular.forEach(urlStates, function (value, key) {
                            keyResult = Object.keys(value)[0];
                            resultUrlStates[keyResult] = value[keyResult];
                        });
                        var qsUserhasAccess = controller.userHasAccessTo(UserFactory.getHandles()[resultUrlStates[redirectUrl]]);
                        if (qsUserhasAccess) {
                            $location.url(redirectUrl);
                        } else {
                            redirectUrl = '/admin/dashboard';
                        }
                    } else {
                        redirectUrl = '/admin/dashboard';
                    }
                }
                redirectUrl = redirectUrl ? redirectUrl : constants.defaultClientPage;
                redirectUrl = decodeURIComponent(redirectUrl);
                $location.path(redirectUrl).search({coreId: coreId});
            } else {
                $scope.animate = true;
                $scope.error = 'Username or password is incorrect';
                $scope.loginInProgress = false;
                var displayMessage = controller.errors.invalidUsername;
                if (response.hasOwnProperty('message')) {
                    displayMessage = response.message;
                }
                controller.showError(displayMessage);
            }
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
         * Actions to do when send password button is clicked.
         *
         * @returns {boolean}
         */
        $scope.handleResetPasswordSubmitClick = function () {
            $scope.forgottenPasswordError = false;
            if (
                $scope.resetSubmitInProgress ||
                !$scope.forms.forgotPasswordForm ||
                !$scope.forms.forgotPasswordForm.$valid
            ) {
                return false;
            }
            $scope.resetSubmitInProgress = true;
            $scope.animate = false;
            PasswordService.create($scope.forgottenPassword.email).then(controller.resetPasswordCallback);
        };

        controller.resetPasswordCallback = function (response) {
            var responseObject = {
                'status' : false,
                'message' : 'Request failed, please try again'
            };
            if (response && response.hasOwnProperty('status')) {
                responseObject.status = response.status;
                if (!response.status) {
                    responseObject.message = response.message;
                }
            }
            $scope.resetSubmitInProgress = false;
            if (response.status) {
                // display confirmation
                $scope.showResetPasswordConfirmation = true;
                $scope.animate = false;
                $scope.forgottenPasswordError = false;
            } else {
                $scope.animate = true;
                $scope.forgottenPasswordError = true;
                $scope.forgottenPasswordErrorMessage = responseObject.message;
            }
        };

        controller.updateResetCallback = function (response) {
            $scope.resetSubmitInProgress = false;
            if (response) {
                // login user with controller.loginPassword
                // response will contain the email and the status
                NotifierFactory.show(
                    'success',
                    'New Password Saved',
                    'Password Reset'
                );
                AuthenticationService.login(response.email, controller.loginPassword).then(controller.loginCallback);
            }
        };

        $scope.handleResetSubmitPasswordSubmitClick = function () {
            if ($scope.resetSubmitInProgress ||
                !$scope.forms.resetPasswordForm ||
                !$scope.forms.resetPasswordForm.$valid
            ) {
                return false;
            }
            if (!controller.isPasswordValid()) {
                return false;
            }

            $scope.resetSubmitInProgress = true;
            controller.loginPassword = $scope.forms.resetPasswordForm.password.$modelValue;
            PasswordService.update($scope.requestId, controller.loginPassword).then(controller.updateResetCallback);
        };

        $scope.toggleForgottenPasswordForm = function () {
            $scope.forgottenPassword.email = '';
            $scope.showResetPasswordConfirmation = false;
            $scope.showForgotPassword = !$scope.showForgotPassword;
            $scope.forgottenPasswordError = false;
            $scope.animate = false;
            $scope.forms.forgotPasswordForm.$setPristine();
        };

        controller.destruct = function () {
            $location.path('/');
        };

        controller.init = function () {
            // reset login status
            AuthenticationService.logout();
            AuthenticationService.setXLocalStorageLogout();
            InstitutionFactory.setData(null);
            $rootScope.$on(constants.events.logout, controller.destruct);
        };

        controller.init();
    };

    angular
        .module('qsHub')
        .controller('LoginController', [
            '$rootScope',
            '$scope',
            '$location',
            '$localStorage',
            '$state',
            '$window',
            'constants',
            'AuthenticationService',
            'PasswordService',
            'UserFactory',
            'InstitutionFactory',
            'NotifierFactory',
            'authInterceptor',
            'InstitutionsListService',
            App.controllers.Login
        ]);

}(window.angular));
