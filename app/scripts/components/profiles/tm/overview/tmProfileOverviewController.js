(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.TmProfileOverview = function (
        $scope,
        constants,
        TmProfileOverviewService,
        UrlService,
        ObjectService,
        TextService,
        NotifierFactory,
        UserFactory,
        TmProfileFactory,
        TmProfileOverviewHistoryLogFactory,
        TmProfileOverviewFactory,
        InstitutionFactory,
        WatchService
    ) {
        var controller = this,
            alreadyInitialised = false;

        controller.devMode = constants.dev;
        controller.fetchingHistoryLogsInProgress = false;
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
        controller.advancedOverviewWords = 0;
        controller.basicDescriptionWordLimit = 200;
        controller.validationMessageBasicDescriptionWordLimit =
            'Profile basic description has exceeded the limit of ' +
            controller.basicDescriptionWordLimit +
            ' words. Please reduce number of words.';
        controller.basicOverviewWords = 0;
        controller.submitted = false;

        $scope.overviewBasicFormSubmitInProgress = false;
        $scope.forms = {};
        $scope.upgradeRequest = {
            name: UserFactory.getFullName(),
            email: UserFactory.getUserName()
        };

        controller.isInvalidUrl = function () {
            if (!controller.submitted) {
                return false;
            }
            var url = $scope.tmProfile.websiteUrl;
            return url && url.length > 1 && url.length < 7;
        };

        /**
         * Count words in the string.
         *
         * @param {string} text
         */
        $scope.countWords = function (text) {
            return TextService.countWords(text);
        };

        /**
         * Handle basic  profile submission.
         *
         * @returns {boolean}
         */
        $scope.handleOverviewBasicDataSubmit = function () {
            $scope.isBasicTmOverviewEmpty = false;
            if (typeof ($scope.tmProfile.basicOverview) !== "undefined" &&
                TextService.cleanHtmlTags($scope.tmProfile.basicOverview).length === 0 ||
                $scope.tmProfile.basicOverview === ""
            ) {
                $scope.isBasicTmOverviewEmpty = true;
            }
            /**
             * Validation 1:
             * Number of words in Basic Description is exceeding the limit of basicDescriptionWordLimit words
             */
            if ($scope.countWords($scope.tmProfile.basicOverview) > controller.basicDescriptionWordLimit) {
                NotifierFactory.show(
                    'error',
                    controller.validationMessageBasicDescriptionWordLimit,
                    'Saving failed!'
                );

                return false;
            }
            if (
                $scope.overviewBasicFormSubmitInProgress ||
                !$scope.forms.overviewBasicForm ||
                !$scope.forms.overviewBasicForm.$valid ||
                $scope.isBasicTmOverviewEmpty
            ) {
                return false;
            }
            $scope.overviewBasicFormSubmitInProgress = true;

            TmProfileOverviewService.saveOverviewData($scope.tmProfile.id, {
                basicOverview: $scope.tmProfile.basicOverview
            }).then(function (success) {
                $scope.overviewBasicFormSubmitInProgress = false;
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Saved successfully!' : 'Saving failed!',
                    'Overview Information'
                );
            });
        };

        $scope.setIsBasicTmOverviewEmpty = function (value) {
            $scope.isBasicTmOverviewEmpty = value;
        };

        /**
         * Handle advanced profile submission.
         *
         * @returns {boolean}
         */
        $scope.handleOverviewAdvancedDataSubmit = function () {
            controller.submitted = true;
            $scope.isAdvancedTmOverviewEmpty = false;
            if (typeof ($scope.tmProfile.advancedOverview) !== "undefined" &&
                TextService.cleanHtmlTags($scope.tmProfile.advancedOverview).length === 0 ||
                $scope.tmProfile.advancedOverview === ""
            ) {
                $scope.isAdvancedTmOverviewEmpty = true;
            }
            /**
             * Validation 1:
             * Number of words in Advanced Description is exceeding the limit of advancedDescriptionWordLimit words
             */
            if ($scope.countWords($scope.tmProfile.advancedOverview) > controller.advancedDescriptionWordLimit) {
                NotifierFactory.show(
                    'error',
                    controller.validationMessageAdvancedDescriptionWordLimit,
                    'Saving failed!'
                );

                return false;
            }
            $scope.tmProfile.websiteUrl = UrlService.prependHttp($scope.tmProfile.websiteUrl);
            if (
                $scope.overviewAdvancedFormSubmitInProgress ||
                !$scope.forms.overviewAdvancedForm ||
                !$scope.forms.overviewAdvancedForm.$valid ||
                controller.isInvalidUrl() ||
                $scope.isAdvancedTmOverviewEmpty
            ) {
                return false;
            }
            $scope.overviewAdvancedFormSubmitInProgress = true;
            TmProfileOverviewService.saveOverviewData($scope.tmProfile.id, {
                advanced: true,
                advancedOverview: $scope.tmProfile.advancedOverview,
                websiteUrl: $scope.tmProfile.websiteUrl,
                requestInfoEmail: $scope.tmProfile.requestInfoEmail
            }).then(function (success) {
                $scope.overviewAdvancedFormSubmitInProgress = false;
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Saved successfully!' : 'Saving failed!',
                    'Overview Information'
                );
            });
        };

        $scope.setIsAdvancedTmOverviewEmpty = function (value) {
            $scope.isAdvancedTmOverviewEmpty = value;
        };

        controller.handleTmOverviewHistoryLogClick = function (advanced) {
            controller.fetchingHistoryLogsInProgress = true;
            advanced = advanced || false;
            var isVisible = !TmProfileOverviewHistoryLogFactory.isOverviewVisible();
            TmProfileOverviewHistoryLogFactory.setOverviewVisible(isVisible);
            if (isVisible) {
                // load logs
                TmProfileOverviewService.getOverviewHistoryLogs($scope.tmProfile.id, advanced).then(function (data) {
                    TmProfileOverviewHistoryLogFactory.setLogs(data);
                    controller.fetchingHistoryLogsInProgress = false;
                });
                TmProfileFactory.setUpgradeFormVisibility(false);
            }
        };

        controller.handleTmFaqHistoryLogClick = function () {
            controller.fetchingHistoryLogsInProgress = true;
            var isVisible = !TmProfileOverviewHistoryLogFactory.isFaqVisible();
            TmProfileOverviewHistoryLogFactory.setFaqVisible(isVisible);
            if (isVisible) {
                // load logs
                TmProfileOverviewService.getFaqHistoryLogs($scope.tmProfile.id).then(function (data) {
                    TmProfileOverviewHistoryLogFactory.setLogs(data);
                    controller.fetchingHistoryLogsInProgress = false;
                });
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

        $scope.isRightSidePanelActive = function () {
            // media tab is active
            if (TmProfileFactory.isOverviewTabSelected && $scope.showUpgradeForm) {
                return true;
            }
            return false;
        };

        controller.isOverviewInvalid = function () {
            return controller.submitted && ($scope.isAdvancedTmOverviewEmpty || $scope.isBasicTmOverviewEmpty);
        };

        controller.setOverviewInvalid = function (type) {
            if (type === 'advancedTmOverview') {
                $scope.setIsAdvancedTmOverviewEmpty(false);
            }
            else if (type === 'basicTmOverview') {
                $scope.setIsBasicTmOverviewEmpty(false);
            }
        };

        controller.activeOverviewSubTabWatch = function (selectedTabId) {
            // set selected tab id
            TmProfileOverviewFactory.setSelectedTabId(selectedTabId);
            // close right side panels
            TmProfileFactory.closeRightSidePanels();
        };

        controller.isLoadMoreRequestWatch = function (loadMore) {
            if (loadMore) {
                TmProfileOverviewHistoryLogFactory.loadMore(false);

                TmProfileOverviewHistoryLogFactory.setLoadMoreInProgress(true);
                var limit = TmProfileOverviewHistoryLogFactory.getLimit() + 5;

                if (TmProfileOverviewHistoryLogFactory.isOverviewVisible()) {
                    // load logs
                    TmProfileOverviewService.getOverviewHistoryLogs(
                        $scope.tmProfile.id,
                        InstitutionFactory.isTmAdvanced(),
                        limit
                    ).then(function (data) {
                        TmProfileOverviewHistoryLogFactory.setLogs(data);
                        TmProfileOverviewHistoryLogFactory.setLoadMoreInProgress(false);
                        TmProfileOverviewHistoryLogFactory.setLimit(limit);
                    });
                } else {
                    TmProfileOverviewService.getFaqHistoryLogs(
                        $scope.tmProfile.id, limit
                    ).then(function (data) {
                        TmProfileOverviewHistoryLogFactory.setLogs(data);
                        TmProfileOverviewHistoryLogFactory.setLoadMoreInProgress(false);
                        TmProfileOverviewHistoryLogFactory.setLimit(limit);
                    });
                }
            }
        };

        controller.initWatches = function () {
            WatchService.create($scope, 'activeOverviewSubTab', controller.activeOverviewSubTabWatch);
            WatchService.create($scope, TmProfileOverviewHistoryLogFactory.isLoadMoreRequest, controller.isLoadMoreRequestWatch);

            // get tu profile data
            WatchService.create($scope, TmProfileFactory.getData, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.tmProfile = newValue;
                }
            });

            WatchService.create($scope, TmProfileFactory.isUpgradeFormVisible($scope.activeTab), function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.upgradeRequest.comments = null;
                    $scope.showUpgradeForm = newValue;
                }
            });

            // watch active institution coreId changes
            WatchService.create($scope, InstitutionFactory.getCoreId, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    controller.resetDescriptionForm();
                }
            });
        };

        controller.init = function () {
            controller.initWatches();
        };

        /**
         * reset description form for overview.
         */
        controller.resetDescriptionForm = function () {
            $scope.setIsBasicTmOverviewEmpty(false);
            $scope.setIsAdvancedTmOverviewEmpty(false);
        };

        // listen to Overview tab visibility changes
        WatchService.create($scope, TmProfileFactory.isOverviewTabSelected, function (isActive, wasActive) {
            if (wasActive) {
                controller.resetDescriptionForm();
            }
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TmProfileOverviewController', [
            '$scope',
            'constants',
            'TmProfileOverviewService',
            'UrlService',
            'ObjectService',
            'TextService',
            'NotifierFactory',
            'UserFactory',
            'TmProfileFactory',
            'TmProfileOverviewHistoryLogFactory',
            'TmProfileOverviewFactory',
            'InstitutionFactory',
            'WatchService',
            App.controllers.TmProfileOverview
        ]);

} (window.angular));
