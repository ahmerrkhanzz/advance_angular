(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.AuthenticationService = function (
        $resource,
        $q,
        $localStorage,
        $http,
        $window,
        constants,
        UserFactory,
        $rootScope,
        authInterceptor
    ) {
        var service = {
                username: null
            },
            deferred = null;

        /**
         * Get programs list API endpoint.
         *
         * @returns {$resource}
         */
        service.getAuthenticationModel = function () {
            return $resource(constants.api.usersPermissions.url + '/v1/signin');
        };

        service.setData = function (response) {
            var token = response.token,
                userData = {
                    coreId: response.userData.coreId,
                    isClient: response.userData.isClient,
                    title: response.userData.title,
                    userName: service.username,
                    email: response.userData.email,
                    firstName: response.userData.firstName,
                    phone: response.userData.phone,
                    profileLogo: response.userData.profileLogo,
                    primaryInstitutionName: response.userData.primaryInstitutionName,
                    lastName: response.userData.lastName,
                    fullName: response.userData.fullName,
                    primaryInstitution: response.userData.primaryInstitution,
                    accessTo: response.userData.accessTo,
                    roles: response.userData.roles,
                    position: response.userData.position,
                    institutions: angular.isArray(response.userData.institutions) ? response.userData.institutions : [],
                    passwordReset: !!response.userData.passwordReset,
                };
            // store username and token in local storage to keep user logged in between page refreshes
            $localStorage.currentUser = {
                token: token,
                info: userData
            };
            UserFactory.setData(userData);

            // add jwt token to auth header for all requests made by the $http service
            service.setAuthorizationHeader(token);
        };

        service.handleSuccess = function (response) {
            if (response.error && response.message) {
                return service.handleFailure(response);
            }
            authInterceptor.resetUrl();

            service.setData(response);

            service.clearXLocalStorage();
            $window.localStorage.setItem(constants.xStorage.keys.source, 'hub');
            $window.localStorage.setItem(constants.xStorage.keys.data, angular.toJson({
                token: $localStorage.currentUser.token,
                userData: $localStorage.currentUser.info
            }));

            deferred.resolve(true);
            deferred = null;
        };

        service.handleFailure = function (response) {
            deferred.resolve(response);
            deferred = null;
        };

        service.login = function (username, password) {
            deferred = $q.defer();

            if (!username || !username.length || !password || !password.length) {
                deferred.resolve(false);
            } else {
                service.username = username;
                var AuthModel = service.getAuthenticationModel();
                AuthModel.save(null, {
                    username: username,
                    password: password
                }, service.handleSuccess, service.handleFailure);
            }

            return deferred.promise;
        };

        service.logout = function () {
            // remove user from local storage
            delete $localStorage.currentUser;
            // clear http auth header
            $http.defaults.headers.common.Authorization = '';
            // clear app data
            $rootScope.$emit(constants.events.logout);

            angular.forEach(constants.xStorage.keys, function (itemKey) {
                $window.localStorage.removeItem(itemKey);
            });
        };

        service.setAuthorizationHeader = function(token) {
            $http.defaults.headers.common.Authorization = token;
        };

        service.getUserData = function () {
            return $localStorage.currentUser && $localStorage.currentUser.info ? $localStorage.currentUser.info : null;
        };

        service.setUserData = function (data) {
            if (typeof $localStorage.currentUser === 'undefined') {
                $localStorage.currentUser = {};
            }
            $localStorage.currentUser.info = data;
        };

        service.clearXLocalStorage = function () {
            angular.forEach(constants.xStorage.keys, function (itemKey) {
                $window.localStorage.removeItem(itemKey);
            });
        };

        service.setXLocalStorageLogout = function () {
            $window.localStorage.setItem(constants.xStorage.keys.logout, 'hub');
        };

        service.hasUserData = function () {
            return $localStorage.currentUser ? true: false;
        };

        service.getAuthorizationHeader = function () {
            return $localStorage.currentUser && $localStorage.currentUser.token ?
                { 'Authorization' : $localStorage.currentUser.token } : null;
        };

        service.getPublicPages = function () {
            return ['/', '/forgot-password', '/reset-password'];
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('AuthenticationService', [
            '$resource',
            '$q',
            '$localStorage',
            '$http',
            '$window',
            'constants',
            'UserFactory',
            '$rootScope',
            'authInterceptor',
            App.services.AuthenticationService
        ]);
}(window.angular));
