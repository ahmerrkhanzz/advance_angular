(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {services:{}});

    App.services.Modal = function ($uibModal) {
        var service = {
            modalDefaults : {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: '/scripts/shared/modal/modalView.html'
            },
            modalOptions : {
                closeButtonText: 'Close',
                actionButtonText: 'OK',
                actionButtonClass: 'danger',
                headerText: 'Proceed?',
                bodyText: 'Perform this action?'
            }
        };

        service.show = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) {
                customModalDefaults = {};
            }

            // create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {},
                tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, service.modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, service.modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $uibModalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $uibModalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $uibModalInstance.dismiss('cancel');
                    };
                };
            }

            return $uibModal.open(tempModalDefaults).result;
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('ModalService', [
            '$uibModal',
            App.services.Modal
        ]);
}(window.angular));
