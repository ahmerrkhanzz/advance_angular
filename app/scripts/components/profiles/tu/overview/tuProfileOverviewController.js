(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.TuProfileOverview = function (
        $scope,
        $resource,
        $location,
        $timeout,
        constants,
        TuProfileService,
        TuProfileOverviewService,
        UrlService,
        ObjectService,
        TextService,
        NotifierFactory,
        TuProfileFactory,
        TuProfileHistoryLogFactory,
        WatchService,
        InstitutionFactory
    ) {
        var controller = this,
            alreadyInitialised = false;
        controller.devMode = constants.dev;
        controller.textEditorBasicOptions = {
            disableDragAndDrop: true,
            styleWithSpan: false,
            minHeight: 280,
            maxHeight: 280,
            toolbar: [
                ['alignment', ['ul', 'ol']],
                ['edit', ['undo', 'redo']],
                ['view', ['codeview']]
            ],
            popover: {
                link: []
            }
        };
        controller.textEditorAdvancedOptions = {
            disableDragAndDrop: true,
            styleWithSpan: false,
            minHeight: 280,
            maxHeight: 280,
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough']],
                ['alignment', ['ul', 'ol']],
                ['insert', ['link', 'unlink']],
                ['edit', ['undo', 'redo']],
                ['view', ['codeview']]
            ],
            popover: {
                link: []
            }
        };
        controller.advancedDescriptionWordLimit = 500;
        controller.validationMessageAdvancedDescriptionWordLimit =
            'Profile advanced description has exceeded the limit of ' +
            controller.advancedDescriptionWordLimit +
            ' words. Please reduce number of words.';
        controller.advancedMasterOverviewWords = 0;
        controller.advancedUgOverviewWords = 0;
        controller.advancedPgOverviewWords = 0;
        controller.basicDescriptionWordLimit = 200;
        controller.validationMessageBasicDescriptionWordLimit =
            'Profile basic description has exceeded the limit of ' +
            controller.basicDescriptionWordLimit +
            ' words. Please reduce number of words.';
        controller.basicMasterOverviewWords = 0;
        controller.basicUgOverviewWords = 0;
        controller.basicPgOverviewWords = 0;
        controller.submitted = {
            master: false,
            ug: false,
            pg: false
        };

        $scope.forms = {};
        $scope.overviewBasicMasterFormSubmitInProgress = false;
        $scope.overviewBasicUgFormSubmitInProgress = false;
        $scope.overviewBasicPgFormSubmitInProgress = false;
        $scope.activeOverviewSubTab = TuProfileOverviewService.getActiveTabs().master;

        controller.isInvalidUrl = function (profileType) {
            if (!controller.submitted[profileType]) {
                return false;
            }
            var url = $scope.tuProfile[profileType + 'WebsiteUrl'];
            return url && url.length > 1 && url.length < 7;
        };

        //watch for Overview tab active or not
        WatchService.create($scope, "activeOverviewSubTab", function (newValue, oldValue) {
            if ((newValue !== oldValue) && (typeof newValue !== 'undefined')) {
                TuProfileFactory.setActiveOverviewSubTabs(newValue);
                if ($scope.showHistory && (newValue === TuProfileOverviewService.getActiveTabs().master)) {
                    TuProfileHistoryLogFactory.setLogLimit(1);
                    if ($scope.tuIsAdvanced) {
                        $scope.handleTuOverviewHistoryLogClick(
                            'master',
                            true
                        );
                    } else {
                        $scope.handleTuOverviewHistoryLogClick('master');
                    }
                } else if ($scope.showHistory && (newValue === TuProfileOverviewService.getActiveTabs().ug)) {
                    TuProfileHistoryLogFactory.setLogLimit(1);
                    if ($scope.ugIsAdvanced) {
                        $scope.handleTuOverviewHistoryLogClick(
                            'ug',
                            true
                        );
                    }
                    else if ((!$scope.ugIsAdvanced)) {
                        $scope.handleTuOverviewHistoryLogClick('ug');
                    }
                } else if ($scope.showHistory && (newValue === TuProfileOverviewService.getActiveTabs().pg)) {
                    TuProfileHistoryLogFactory.setLogLimit(1);
                    if ($scope.tuIsAdvanced) {
                        $scope.handleTuOverviewHistoryLogClick(
                            'pg',
                            true
                        );
                    } else {
                        $scope.handleTuOverviewHistoryLogClick('pg');
                    }
                }
            }
        });

        // watch active institution coreId changes
        $scope.$watch(InstitutionFactory.getCoreId, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                controller.resetDescriptionForm();
            }
        });

        /**
         * Count words in the string.
         *
         * @param {string} text
         */
        $scope.countWords = function (text) {
            return TextService.countWords(text);
        };

        /**
         * Handle basic master profile submission.
         *
         * @returns {boolean}
         */
        $scope.handleOverviewBasicMasterDataSubmit = function () {
            $scope.isBasicOverviewEmpty = false;
            if (typeof ($scope.tuProfile.basicMasterOverview) !== "undefined" &&
                TextService.cleanHtmlTags($scope.tuProfile.basicMasterOverview).length === 0 ||
                $scope.tuProfile.basicMasterOverview === ""
            ) {
                $scope.isBasicOverviewEmpty = true;
            }
            /**
             * Validation 1:
             * Number of words in Basic Description is exceeding the limit of basicDescriptionWordLimit words
             */
            if ($scope.countWords($scope.tuProfile.basicMasterOverview) > controller.basicDescriptionWordLimit) {
                NotifierFactory.show(
                    'error',
                    controller.validationMessageBasicDescriptionWordLimit,
                    'Saving failed!'
                );

                return false;
            }
            if (
                $scope.overviewBasicMasterFormSubmitInProgress ||
                !$scope.forms.overviewBasicMasterForm ||
                !$scope.forms.overviewBasicMasterForm.$valid ||
                $scope.isBasicOverviewEmpty
            ) {
                return false;
            }
            $scope.overviewBasicMasterFormSubmitInProgress = true;

            TuProfileOverviewService.saveOverviewData($scope.tuProfile.id, {
                type: constants.profileTypes.master,
                basicMasterOverview: $scope.tuProfile.basicMasterOverview
            }).then(function (success) {
                $scope.overviewBasicMasterFormSubmitInProgress = false;
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Saved successfully!' : 'Saving failed!',
                    'Overview Information'
                );
            });
        };

        $scope.setIsBasicOverviewEmpty = function (value) {
            $scope.isBasicOverviewEmpty = value;
        };

        /**
         * Handle advanced master profile submission.
         *
         * @returns {boolean}
         */
        $scope.handleOverviewAdvancedMasterDataSubmit = function () {
            controller.submitted.master = true;
            $scope.isAdvancedOverviewEmpty = false;
            if (typeof ($scope.tuProfile.advancedMasterOverview) !== "undefined" &&
                TextService.cleanHtmlTags($scope.tuProfile.advancedMasterOverview).length === 0 ||
                $scope.tuProfile.advancedMasterOverview === ""
            ) {
                $scope.isAdvancedOverviewEmpty = true;
            }
            /**
             * Validation 1:
             * Number of words in Advanced Description is exceeding the limit of advancedDescriptionWordLimit words
             */
            if ($scope.countWords($scope.tuProfile.advancedMasterOverview) > controller.advancedDescriptionWordLimit) {
                NotifierFactory.show(
                    'error',
                    controller.validationMessageAdvancedDescriptionWordLimit,
                    'Saving failed!'
                );

                return false;
            }
            $scope.tuProfile.masterWebsiteUrl = UrlService.prependHttp($scope.tuProfile.masterWebsiteUrl);
            if (
                $scope.overviewAdvancedMasterFormSubmitInProgress ||
                !$scope.forms.overviewAdvancedMasterForm ||
                !$scope.forms.overviewAdvancedMasterForm.$valid ||
                $scope.isAdvancedOverviewEmpty ||
                controller.isInvalidUrl('master')
            ) {
                return false;
            }
            $scope.overviewAdvancedMasterFormSubmitInProgress = true;
            TuProfileOverviewService.saveOverviewData($scope.tuProfile.id, {
                type: constants.profileTypes.master,
                advanced: true,
                requestInfoTypeMaster: $scope.tuProfile.requestInfoTypeMaster,
                advancedMasterOverview: $scope.tuProfile.advancedMasterOverview,
                masterWebsiteUrl: $scope.tuProfile.masterWebsiteUrl,
                masterRequestInfoUrl: $scope.tuProfile.masterRequestInfoUrl,
                masterRequestInfoUrlTitle: $scope.tuProfile.masterRequestInfoUrlTitle,
                masterRequestInfoEmail: $scope.tuProfile.masterRequestInfoEmail
            }).then(function (success) {
                $scope.overviewAdvancedMasterFormSubmitInProgress = false;
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Saved successfully!' : 'Saving failed!',
                    'Overview Information'
                );
            });
        };

        $scope.setIsAdvancedOverviewEmpty = function (value) {
            $scope.isAdvancedOverviewEmpty = value;
        };

        /**
         * Handle basic UG profile submission.
         *
         * @returns {boolean}
         */
        $scope.handleOverviewBasicUgDataSubmit = function () {
            $scope.isBasicUgOverviewEmpty = false;
            if (typeof ($scope.tuProfile.basicUgOverview) !== "undefined" &&
                TextService.cleanHtmlTags($scope.tuProfile.basicUgOverview).length === 0 ||
                $scope.tuProfile.basicUgOverview === ""
            ) {
                $scope.isBasicUgOverviewEmpty = true;
            }
            /**
             * Validation 1:
             * Number of words in Basic Description is exceeding the limit of basicDescriptionWordLimit words
             */
            if ($scope.countWords($scope.tuProfile.basicUgOverview) > controller.basicDescriptionWordLimit) {
                NotifierFactory.show(
                    'error',
                    controller.validationMessageBasicDescriptionWordLimit,
                    'Saving failed!'
                );

                return false;
            }
            if (
                $scope.overviewBasicUgFormSubmitInProgress ||
                !$scope.forms.overviewBasicUgForm ||
                !$scope.forms.overviewBasicUgForm.$valid ||
                $scope.isBasicUgOverviewEmpty
            ) {
                return false;
            }
            $scope.overviewBasicUgFormSubmitInProgress = true;

            TuProfileOverviewService.saveOverviewData($scope.tuProfile.id, {
                type: constants.profileTypes.ug,
                basicUgOverview: $scope.tuProfile.basicUgOverview
            }).then(function (success) {
                $scope.overviewBasicUgFormSubmitInProgress = false;
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Saved successfully!' : 'Saving failed!',
                    'Overview Information'
                );
            });
        };

        $scope.setIsBasicUgOverviewEmpty = function (value) {
            $scope.isBasicUgOverviewEmpty = value;
        };

        /**
         * Handle advanced UG profile submission.
         *
         * @returns {boolean}
         */
        $scope.handleOverviewAdvancedUgDataSubmit = function () {
            controller.submitted.ug = true;
            $scope.isAdvancedUgOverviewEmpty = false;
            if (typeof ($scope.tuProfile.advancedUgOverview) !== "undefined" &&
                TextService.cleanHtmlTags($scope.tuProfile.advancedUgOverview).length === 0 ||
                $scope.tuProfile.advancedUgOverview === ""
            ) {
                $scope.isAdvancedUgOverviewEmpty = true;
            }

            /**
             * Validation 1:
             * Number of words in Advanced Description is exceeding the limit of advancedDescriptionWordLimit words
             */
            if ($scope.countWords($scope.tuProfile.advancedUgOverview) > controller.advancedDescriptionWordLimit) {
                NotifierFactory.show(
                    'error',
                    controller.validationMessageAdvancedDescriptionWordLimit,
                    'Saving failed!'
                );

                return false;
            }
            $scope.tuProfile.ugWebsiteUrl = UrlService.prependHttp($scope.tuProfile.ugWebsiteUrl);
            if (
                $scope.overviewAdvancedUgFormSubmitInProgress ||
                !$scope.forms.overviewAdvancedUgForm ||
                !$scope.forms.overviewAdvancedUgForm.$valid ||
                $scope.isAdvancedUgOverviewEmpty ||
                controller.isInvalidUrl('ug')
            ) {
                return false;
            }
            $scope.overviewAdvancedUgFormSubmitInProgress = true;

            TuProfileOverviewService.saveOverviewData($scope.tuProfile.id, {
                type: constants.profileTypes.ug,
                advanced: true,
                requestInfoTypeUg: $scope.tuProfile.requestInfoTypeUg,
                advancedUgOverview: $scope.tuProfile.advancedUgOverview,
                ugWebsiteUrl: $scope.tuProfile.ugWebsiteUrl,
                ugRequestInfoUrlTitle: $scope.tuProfile.ugRequestInfoUrlTitle,
                ugRequestInfoUrl: $scope.tuProfile.ugRequestInfoUrl,
                ugRequestInfoEmail: $scope.tuProfile.ugRequestInfoEmail
            }).then(function (success) {
                $scope.overviewAdvancedUgFormSubmitInProgress = false;
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Saved successfully!' : 'Saving failed!',
                    'Overview Information'
                );
            });
        };

        $scope.setIsAdvancedUgOverviewEmpty = function (value) {
            $scope.isAdvancedUgOverviewEmpty = value;
        };

        /**
         * Handle basic PG profile submission.
         *
         * @returns {boolean}
         */
        $scope.handleOverviewBasicPgDataSubmit = function () {
            $scope.isBasicPgOverviewEmpty = false;
            if (typeof ($scope.tuProfile.basicPgOverview) !== "undefined" &&
                TextService.cleanHtmlTags($scope.tuProfile.basicPgOverview).length === 0 ||
                $scope.tuProfile.basicPgOverview === ""
            ) {
                $scope.isBasicPgOverviewEmpty = true;
            }
            /**
             * Validation 1:
             * Number of words in Basic Description is exceeding the limit of basicDescriptionWordLimit words
             */
            if ($scope.countWords($scope.tuProfile.basicPgOverview) > controller.basicDescriptionWordLimit) {
                NotifierFactory.show(
                    'error',
                    controller.validationMessageBasicDescriptionWordLimit,
                    'Saving failed!'
                );

                return false;
            }
            if (
                $scope.overviewBasicPgFormSubmitInProgress ||
                !$scope.forms.overviewBasicPgForm ||
                !$scope.forms.overviewBasicPgForm.$valid ||
                $scope.isBasicPgOverviewEmpty
            ) {
                return false;
            }
            $scope.overviewBasicPgFormSubmitInProgress = true;

            TuProfileOverviewService.saveOverviewData($scope.tuProfile.id, {
                type: constants.profileTypes.pg,
                basicPgOverview: $scope.tuProfile.basicPgOverview
            }).then(function (success) {
                $scope.overviewBasicPgFormSubmitInProgress = false;
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Saved successfully!' : 'Saving failed!',
                    'Overview Information'
                );
            });
        };

        $scope.setIsBasicPgOverviewEmpty = function (value) {
            $scope.isBasicPgOverviewEmpty = value;
        };

        controller.setOverviewInvalid = function (type) {
            switch (type) {
                case 'advancedOverview':
                    $scope.setIsAdvancedOverviewEmpty(false);
                    break;
                case 'advancedPgOverview':
                    $scope.setIsAdvancedPgOverviewEmpty(false);
                    break;
                case 'advancedUgOverview':
                    $scope.setIsAdvancedUgOverviewEmpty(false);
                    break;
                case 'basicOverview':
                    $scope.setIsBasicOverviewEmpty(false);
                    break;
                case 'basicUgOverview':
                    $scope.setIsBasicUgOverviewEmpty(false);
                    break;
                case 'basicpgOverview':
                    $scope.setIsBasicPgOverviewEmpty(false);
                    break;
            }
        };


        /**
         * Handle advanced PG profile submission.
         *
         * @returns {boolean}
         */
        $scope.handleOverviewAdvancedPgDataSubmit = function () {
            controller.submitted.pg = true;
            $scope.isAdvancedPgOverviewEmpty = false;
            if (typeof ($scope.tuProfile.advancedPgOverview) !== "undefined" &&
                TextService.cleanHtmlTags($scope.tuProfile.advancedPgOverview).length === 0 ||
                $scope.tuProfile.advancedPgOverview === ""
            ) {
                $scope.isAdvancedPgOverviewEmpty = true;
            }

            /**
             * Validation 1:
             * Number of words in Advanced Description is exceeding the limit of advancedDescriptionWordLimit words
             */
            if ($scope.countWords($scope.tuProfile.advancedPgOverview) > controller.advancedDescriptionWordLimit) {
                NotifierFactory.show(
                    'error',
                    controller.validationMessageAdvancedDescriptionWordLimit,
                    'Saving failed!'
                );

                return false;
            }
            $scope.tuProfile.pgWebsiteUrl = UrlService.prependHttp($scope.tuProfile.pgWebsiteUrl);
            if (
                $scope.overviewAdvancedPgFormSubmitInProgress ||
                !$scope.forms.overviewAdvancedPgForm ||
                !$scope.forms.overviewAdvancedPgForm.$valid ||
                $scope.isAdvancedPgOverviewEmpty ||
                controller.isInvalidUrl('pg')
            ) {
                return false;
            }
            $scope.overviewAdvancedPgFormSubmitInProgress = true;


            TuProfileOverviewService.saveOverviewData($scope.tuProfile.id, {
                type: constants.profileTypes.pg,
                advanced: true,
                requestInfoTypePg: $scope.tuProfile.requestInfoTypePg,
                advancedPgOverview: $scope.tuProfile.advancedPgOverview,
                pgWebsiteUrl: $scope.tuProfile.pgWebsiteUrl,
                pgRequestInfoUrlTitle: $scope.tuProfile.pgRequestInfoUrlTitle,
                pgRequestInfoUrl: $scope.tuProfile.pgRequestInfoUrl,
                pgRequestInfoEmail: $scope.tuProfile.pgRequestInfoEmail
            }).then(function (success) {
                $scope.overviewAdvancedPgFormSubmitInProgress = false;
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Saved successfully!' : 'Saving failed!',
                    'Overview Information'
                );
            });
        };

        $scope.setIsAdvancedPgOverviewEmpty = function (value) {
            $scope.isAdvancedPgOverviewEmpty = value;
        };

        /**
         * Listen the load more history log click event
         *
         * @param {event} event
         * @params {Integer} limit
         */
        $scope.$on(constants.events.loadMoreHistoryLogs, function (event, profileType, advanced, limit) {
            advanced = advanced || false;
            TuProfileHistoryLogFactory.setLoadMoreInProgress(true);
            TuProfileFactory.setHistoryLogVisibility(true);
            TuProfileOverviewService.getHistoryLog(
                $scope.tuProfile.id, profileType, advanced, limit
            ).then(function (data) {
                TuProfileHistoryLogFactory.setData(data);
                TuProfileHistoryLogFactory.setLoadMoreInProgress(false);
            });
        });

        /**
         * Actions to do when history log button os clicked.
         *
         * @param {string} profileType
         * @param {null|boolean} advanced
         */
        $scope.handleTuOverviewHistoryLogClick = function (profileType, advanced) {
            advanced = advanced || false;

            TuProfileHistoryLogFactory.setAdvanced(advanced);
            if ($scope.tuProfile.id !== TuProfileOverviewService.getProfileId()) {
                TuProfileHistoryLogFactory.setLogLimit(1);
            }

            if (TuProfileHistoryLogFactory.shouldBeVisible($scope.tuProfile.id)) {
                TuProfileHistoryLogFactory.setInProgress(true);
                TuProfileFactory.setHistoryLogVisibility(true);
                TuProfileHistoryLogFactory.setProfileType(profileType);

                TuProfileOverviewService.getHistoryLog(
                    $scope.tuProfile.id,
                    profileType,
                    advanced,
                    TuProfileHistoryLogFactory.getLogLimit()
                ).then(function (data) {
                    TuProfileHistoryLogFactory.setData(data);
                    TuProfileHistoryLogFactory.setInProgress(false);
                });

                TuProfileHistoryLogFactory.setTriggeredBy($scope.tuProfile.id);
            } else {
                TuProfileHistoryLogFactory.setLogLimit(1);
                TuProfileHistoryLogFactory.setTriggeredBy('');
                TuProfileFactory.setHistoryLogVisibility(false);
            }
        };

        controller.isAdvancedOverviewInvalid = function (advancedOverviewWords) {
            return advancedOverviewWords > controller.advancedDescriptionWordLimit;
        };

        controller.isBasicOverviewInvalid = function (basicOverviewWords) {
            return basicOverviewWords > controller.basicDescriptionWordLimit;
        };

        controller.onKeyUp = function ($event) {
            if ($event.keyCode === 13) {
                return;
            }
            var url = $event.target.value,
                variableName = $event.target.getAttribute('ng-model');

            if (url && url.length > 5 && (url.indexOf('http') !== 0 || url.indexOf('http') === -1)) {
                url = UrlService.prependHttp(url);
                if (variableName) {
                    ObjectService.set($scope, variableName, url);
                }
            }
        };

        controller.initWatches = function () {
            // get tu profile data
            WatchService.create($scope, TuProfileFactory.getData, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.tuProfile = newValue;
                }
            });
        };

        controller.init = function () {
            controller.initWatches();
        };

        /**
         * reset description form for overview, ug, pg
         */
        controller.resetDescriptionForm = function () {
            $scope.setIsAdvancedOverviewEmpty(false);
            $scope.setIsAdvancedUgOverviewEmpty(false);
            $scope.setIsAdvancedPgOverviewEmpty(false);
            $scope.setIsBasicOverviewEmpty(false);
            $scope.setIsBasicUgOverviewEmpty(false);
            $scope.setIsBasicPgOverviewEmpty(false);
        };
        // listen to Overview tab visibility changes
        WatchService.create($scope, TuProfileFactory.isOverviewTabSelected, function (isActive, wasActive) {
            if (wasActive) {
                controller.resetDescriptionForm();
            }
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TuProfileOverviewController', [
            '$scope',
            '$resource',
            '$location',
            '$timeout',
            'constants',
            'TuProfileService',
            'TuProfileOverviewService',
            'UrlService',
            'ObjectService',
            'TextService',
            'NotifierFactory',
            'TuProfileFactory',
            'TuProfileHistoryLogFactory',
            'WatchService',
            'InstitutionFactory',
            App.controllers.TuProfileOverview
        ]);

} (window.angular));
