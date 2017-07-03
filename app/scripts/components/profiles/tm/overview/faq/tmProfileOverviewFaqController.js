(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.TmProfileOverviewFaq = function (
        $scope,
        constants,
        TmProfileOverviewService,
        TextService,
        NotifierFactory,
        TmProfileFactory,
        TmProfileOverviewFactory,
        WatchService
    ) {
        var controller = this,
            alreadyInitialised = false;

        controller.devMode = constants.dev;
        controller.maxItems = TmProfileOverviewService.maxFaqItems;
        controller.updateInProgress = false;
        controller.wordsLimit = 200;
        controller.defaultItem = {
            answer: null,
            question: null
        };
        controller.textEditorAdvancedOptions = {
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
        controller.wordsCounters = [];
        controller.items = new Array(controller.maxItems);
        controller.tmProfile = null;
        $scope.faq = [];

        controller.handleTextEditorChanges = function (key, text) {
            controller.wordsCounters[key] = controller.countWords(text);
        };

        controller.isInvalidAnswer = function (key) {
            return controller.wordsCounters[key] > controller.wordsLimit;
        };

        controller.countWords = function (text) {
            return TextService.countWords(text);
        };

        controller.handleAddClick = function () {
            if ($scope.faq.length < controller.maxItems) {
                $scope.faq.push(angular.copy(controller.defaultItem));
            }
        };

        controller.handleUpdateClick = function () {
            // check if FAQ answers are valid
            for (var key in $scope.faq) {
                if (controller.isInvalidAnswer(key)) {
                    NotifierFactory.show(
                        'error',
                        'FAQ answer has exceeded the limit of ' + controller.wordsLimit +
                        ' words. Please reduce number of words.',
                        'Saving failed!'
                    );
                    return false;
                }
            }

            controller.updateInProgress = true;
            TmProfileOverviewService.saveOverviewData(controller.tmProfileId, {
                faq: $scope.faq
            }).then(function (success) {
                controller.updateInProgress = false;
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Updated successfully!' : 'Update failed!',
                    'Overview FAQ'
                );
                if (success) {
                    controller.tmProfile.faq = angular.copy($scope.faq);
                    TmProfileFactory.setData(controller.tmProfile);
                }
            });

        };

        controller.handleRemoveClick = function (key) {
            if (typeof $scope.faq === 'undefined' || !$scope.faq.length) {
                return false;
            }
            key = parseInt(key, 10);
            if (typeof $scope.faq[key] !== 'undefined') {
                $scope.faq.splice(key, 1);
            }
        };

        controller.isRemoveDisabled = function () {
            return controller.updateInProgress;
        };

        controller.isItemVisible = function (key) {
            if (typeof $scope.faq === 'undefined') {
                return key === 0 ? true : false;
            }
            key = parseInt(key, 10);

            return (typeof $scope.faq !== 'undefined' && $scope.faq !== null &&
                typeof $scope.faq[key] !== 'undefined') ||  key === 0;
        };

        controller.showAddFaq = function (itemIndex) {
            return $scope.faq && $scope.faq.length === itemIndex + 1;
        };

        controller.resetFaq = function () {
            if (controller.tmProfile && controller.tmProfile.faq) {
                $scope.faq = angular.copy(controller.tmProfile.faq);
            }
        };

        controller.initWatches = function () {
            // get tm profile data
            WatchService.create($scope, TmProfileFactory.getData, function (newValue) {
                controller.tmProfile = angular.copy(newValue);
                $scope.faq = newValue && newValue.faq ? newValue.faq : null;
                controller.tmProfileId = newValue && newValue.id ? newValue.id : null;
            });

            // listen to over tab changes
            WatchService.create($scope, TmProfileOverviewFactory.isOverviewTabSelected, function (isActive) {
                if (!isActive) {
                    controller.resetFaq();
                }
            });
        };

        controller.init = function () {
            controller.initWatches();
        };


        // listen to Overview tab visibility changes
        WatchService.create($scope, TmProfileOverviewFactory.isFaqSelected, function (isActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive) {
                controller.init();
                alreadyInitialised = true;
            } else if (isActive) {
                controller.resetFaq();
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TmProfileOverviewFaqController', [
            '$scope',
            'constants',
            'TmProfileOverviewService',
            'TextService',
            'NotifierFactory',
            'TmProfileFactory',
            'TmProfileOverviewFactory',
            'WatchService',
            App.controllers.TmProfileOverviewFaq
        ]);

} (window.angular));
