(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.tuProfileResubscribe = function (
        $scope,
        TuProfileResubscribeService,
        InstitutionFactory,
        TuProfileFactory,
        UserFactory,
        NotifierFactory,
        WatchService
    ) {
        var controller = this,
            alreadyInitialised = false,
            displayResubscribeBannerDays = 31;

        controller.profileId = '';
        controller.expiresDate = '';
        controller.isAdvanced = false;
        controller.displayResubscribeForm = false;
        controller.inProgress = false;
        /**
         * Data used in resubscribe form
         * @type {{comments: string, name: string, email: string, to: string, subject: string}}
         */
        controller.formData = {
            'comments': '',
            'name': '',
            'email': '',
            'to': 'tusupport@qs.com',
            'subject': 'I would like more information about Resubscribing an Advance Profile'
        };

        /**
         * Re-init form data
         */
        controller.initFormData = function () {
            controller.formData.comments = '';
        };

        /**
         * Resubscribe button click
         */
        controller.resubscribeClick = function () {
            controller.initFormData();
            controller.displayResubscribeForm = !controller.displayResubscribeForm;
        };

        /**
         * Cancel button click
         */
        controller.cancelClick = function () {
            controller.initFormData();
            controller.resubscribeClick();
        };

        controller.createCallback = function (response) {
            if (response) {
                controller.initFormData();
                controller.resubscribeClick();
            }
            controller.inProgress = false;
            NotifierFactory.show(
                response ? 'success' : 'error',
                response ? 'Request sent successfully!' : 'Request sending failed!',
                'Resubscribe Request'
            );
        };

        /**
         * Submit form button click
         */
        controller.submitClick = function () {
            controller.inProgress = true;
            TuProfileResubscribeService.create(
                controller.profileId,
                controller.formData.comments,
                controller.formData.name,
                controller.formData.email
            ).then(controller.createCallback);
        };

        /**
         * Check if we should show the resubscribe button
         * Button should display when subscription expires in less than 1 month
         *
         * @returns {boolean}
         */
        controller.showResubscribeButton = function () {
            // calculate if subscription expires in less than one month
            if (controller.expiresDate) {
                var expiresDate, todayDate, daysLeft, leftMs;
                expiresDate = new Date(parseInt(controller.expiresDate, 10));
                todayDate = new Date();
                leftMs = expiresDate.getTime() - todayDate.getTime();
                daysLeft = Math.ceil(Math.abs(leftMs)) / (1000 * 3600 * 24);

                return leftMs > 0 ? daysLeft < displayResubscribeBannerDays : false;
            }

            return false;
        };

        /**
         * Init watches
         */
        controller.initWatches = function () {
            // watch for active institution changes
            WatchService.create($scope, TuProfileFactory.getData, function (newValue) {
                controller.profileId = newValue && newValue.id ? newValue.id : '';
            });
            WatchService.create($scope, InstitutionFactory.getData, function (newValue) {
                if (newValue){
                    controller.isAdvanced = InstitutionFactory.isTuAdvanced();
                    controller.expiresDate = angular.isDefined(newValue.subscriptions.tu) ? newValue.subscriptions.tu.endDate : '';
                    controller.formData.name = UserFactory.getFullName();
                    controller.formData.email = UserFactory.getUserName();
                }
            });
        };

        /**
         * @constructor
         */
        controller.init = function () {
            controller.initWatches();
        };

        /**
         * listen to publish tab visibility changes
         */
        WatchService.create($scope, TuProfileFactory.isPublishTabSelected, function (isActive, wasActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TuProfileResubscribeController', [
            '$scope',
            'TuProfileResubscribeService',
            'InstitutionFactory',
            'TuProfileFactory',
            'UserFactory',
            'NotifierFactory',
            'WatchService',
            App.controllers.tuProfileResubscribe
        ]);

} (window.angular));
