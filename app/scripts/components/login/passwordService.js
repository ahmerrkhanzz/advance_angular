(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services: {}});

    App.services.Password = function (
        $resource,
        $log,
        constants
    ) {
        var service = {};

        service.getPasswordModel = function () {
            return $resource(constants.api.usersPermissions.url + '/v1/password-reset/:requestId', null, {
                update:  { method: 'PATCH' }
            });
        };

        service.create = function (email) {
            var CreateModel = service.getPasswordModel();
            return CreateModel.save(
                {email: email}
            ).$promise.then(function (data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return data;
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return false;
            });
        };

        service.update = function (id, password) {
            var CreateModel = service.getPasswordModel();
            return CreateModel.update(
                {requestId: id},
                {password: password}
            ).$promise.then(function (data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return data;
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return false;
            });
        };

        service.getPasswordValidator = function () {
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

        service.validatePassword = function (password) {
            if (!angular.isDefined(password) || password === null) {
                return false;
            }
            var validationItems = service.getPasswordValidator().splice(
                0, service.getPasswordValidator().length - 1
            ), pattern = null;
            // 0
            if (password.length > 7
            ) {
                validationItems[0].status = true;
            }
            // 1
            if (password.length < 33 &&
                password.length > 0
            ) {
                validationItems[1].status = true;
            }
            // 2
            pattern = new RegExp(/(?=.*?[a-z])/);
            if (pattern.test(password)
            ) {
                validationItems[2].status = true;
            }
            // 3
            pattern = new RegExp(/(?=.*?[A-Z])/);
            if (pattern.test(password)
            ) {
                validationItems[3].status = true;
            }
            // 4
            pattern = new RegExp(/(?=.*?[0-9])/);
            if (pattern.test(password)
            ) {
                validationItems[4].status = true;
            }
            // 5
            pattern = new RegExp(/(?=.*?[\s\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;<\=\>\?\@\[\\\]\^\_\`\{\|\}\~\£\¬\€])/);
            if (pattern.test(password)
            ) {
                validationItems[5].status = true;
            }

            return validationItems;
        };

        service.isPasswordValid = function (password) {
            if (angular.isUndefined(password) || password === null || password.length === 0) {
                return false;
            }
            var validationItems = service.validatePassword(password), invalidCount = 0;
            angular.forEach(validationItems, function (item) {
                if (!item.status) {
                    invalidCount++;
                }
            });

            return invalidCount === 0;
        };
        
        /**
         * Sets has errors flag.
         *
         * @param {boolean} hasErrors
         */
        service.setHasErrors = function (hasErrors) {
            service.hasErrors = hasErrors;
        };

        /**
         * Gets has errors flag.
         *
         * @returns {boolean|*}
         */
        service.getHasErrors = function () {
            return service.hasErrors;
        };

        function isNotEmpty (form, userObj, fieldName) {
            return !!(
                form &&
                (
                    form.$pristine ||
                    (form[fieldName] && form[fieldName].$pristine)
                ) ||
                (userObj && userObj[fieldName] && userObj[fieldName].trim().length)
            );
        }

        service.isValidFirstName = function (form, userObj, fieldName) {
            fieldName = fieldName || 'firstname';
            return isNotEmpty(form, userObj, fieldName);
        };

        service.isValidLastName = function (form, userObj, fieldName) {
            fieldName = fieldName || 'lastname';
            return isNotEmpty(form, userObj, fieldName);
        };

        service.isValidEmail = function (form, userObj) {
            return isNotEmpty(form, userObj, 'email');
        };

        service.isValid = function (form, userObj) {
            return service.isValidFirstName(form, userObj) &&
                service.isValidLastName(form, userObj) &&
                service.isValidEmail(form, userObj);
        };

        service.setValid = function (form, fieldName) {
            if (fieldName) {
                if (form && form[fieldName]) {
                    form[fieldName].$setPristine();
                }
            } else {
                form.$setPristine();
            }
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('PasswordService', [
            '$resource',
            '$log',
            'constants',
            App.services.Password
        ]);

}(window.angular));
