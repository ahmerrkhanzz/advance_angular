(function(angular) {
    "use strict";

    function TmProgramValidation() {
        var service = {};

        function isNotEmpty (form, programObject, fieldName) {
            return !!(
                form && (form.$pristine || (form[fieldName] && form[fieldName].$pristine)) || (
                    programObject && programObject[fieldName] && programObject[fieldName].trim().length
                )
            );
        }

        function isFloat(n) {
            return Number(n) === n && n % 1 !== 0;
        }

        function isValidStatsRange(form, programObject, fieldName, min, max) {
            if (form && (form.$pristine || (form[fieldName] && form[fieldName].$pristine))) {
                return true;
            } else if (programObject &&
                programObject.stats &&
                programObject.stats[fieldName]
            ) {
                var value = programObject.stats[fieldName];
                if (isNaN(value) || isFloat(value) || String(value).indexOf('.') !== -1) {
                    return false;
                }
                value = parseInt(value, 10);
                return value >= min && value <= max;
            }
            return true;
        }

        service.isValidName = function (form, programObject) {
            return isNotEmpty(form, programObject, 'name');
        };

        service.isValidCampusName = function (form, programObject) {
            return isNotEmpty(form, programObject, 'name');
        };

        service.isValidCampusCountry = function (form, programObject) {
            return isNotEmpty(form, programObject, 'country');
        };

        service.isValidCampusAddressLine1 = function (form, programObject) {
            return isNotEmpty(form, programObject, 'addressLine1');
        };

        service.isValidCampusCity = function (form, programObject) {
            return isNotEmpty(form, programObject, 'city');
        };

        service.isValidType = function (form, programObject) {
            return isNotEmpty(form, programObject, 'type');
        };

        service.isValidDescription = function (form, programObject) {
            return isNotEmpty(form, programObject, 'description');
        };

        service.isValidCampusAssigned = function (form, programObject) {
            return form && form.$pristine || (programObject && programObject.campus && programObject.campus.length);
        };

        service.isValidAverageGmat = function (form, programObject) {
            return isValidStatsRange(form, programObject, 'avgGmat', 400, 800);
        };

        service.isValidClassSize = function (form, programObject) {
            return isValidStatsRange(form, programObject, 'classSize', 1, 2000);
        };

        service.isValidAverageSalaryAfterGraduation = function (form, programObject) {
            return isValidStatsRange(form, programObject, 'avgSalaryAfterGraduation', 0, 200000);
        };

        service.isValid = function (form, statsForm, programObject, isAdvanced) {
            isAdvanced = typeof isAdvanced === 'undefined' ? false: isAdvanced;
            return service.isValidDetails(form, programObject) &&
                service.isValidStats(statsForm, programObject) &&
                (
                    (!isAdvanced && service.isValidCampusAssigned(form, programObject)) ||
                    isAdvanced
                );
        };

        service.isValidDetails = function (form, programObject) {
            return service.isValidName(form, programObject) &&
                service.isValidType(form, programObject) &&
                service.isValidDescription(form, programObject);
        };

        service.isValidStats = function (form, programObject) {
            return service.isValidAverageGmat(form, programObject) &&
                service.isValidClassSize(form, programObject) &&
                service.isValidAverageSalaryAfterGraduation(form, programObject);
        };

        service.isValidCampus = function (form, programObject) {
            return service.isValidCampusName(form, programObject) &&
                service.isValidCampusCountry(form, programObject) &&
                service.isValidCampusAddressLine1(form, programObject) &&
                service.isValidCampusCity(form, programObject);
        };

        return service;
    }

    angular
        .module('qsHub')
        .service('TmProfileProgramValidationService', [
            TmProgramValidation
        ]);

}(window.angular));
