(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.tuProfilePublish = function (
        $scope,
        constants,
        PublishService,
        InstitutionFactory,
        TuProfileFactory,
        TuProfileHistoryLogFactory,
        UserFactory,
        WebSocketsService,
        WatchService
    ) {
        var controller = this,
            alreadyInitialised = false;

        controller.devMode = constants.dev;
        controller.subscribedTo = [];
        $scope.institutionData = {};
        $scope.sections = {};
        $scope.institutionId = null;

        /**
         * Actions to do when publishing is triggered.
         *
         * @param {Object} section
         */
        $scope.handlePublish = function (section) {
            section.publishDisabled = true;
            section.status = constants.publishStatus.pending;
            section.statusMessage = '';
            PublishService.publish($scope.institutionId, section.type).then(function (response) {
                controller.publishCallback(section, response);
            });
        };

        /**
         * Publishing callback.
         *
         * @param {Object} section
         * @param {Object} response
         * @returns {boolean}
         */
        controller.publishCallback = function (section, response) {
            if (!response || !angular.isDefined(response.feedId)) {
                section.status = constants.publishStatus.failure;
                return false;
            }
            PublishService.setStatus(constants.publishStatus.pending);
            section.feedId = response.feedId;
            section.status = constants.publishStatus.pending;
        };

        /**
         * Subscribe to all available publishes
         */
        controller.publishSubscribe = function() {
            angular.forEach($scope.sections, function (section) {
                var subscribeType = $scope.institutionId + section.type;
                if (controller.subscribedTo.indexOf(subscribeType) === -1) {
                    controller.subscribedTo.push(subscribeType);
                    WebSocketsService.subscribe(subscribeType, 'PublishStatus' + subscribeType, function (response) {
                        controller.sectionPublishStatusCallback(section, response);
                    });
                }
            });
        };

        controller.sectionPublishStatusCallback = function (section, response) {
            section.publishDisabled = true;
            var status = response && response.status || constants.publishStatus.failure;
            section.status = status;
            switch (status) {
                case constants.publishStatus.failure:
                    section.publishDisabled = false;
                    section.statusMessage = PublishService.convertErrorMessage(
                        response.statusMessage,
                        UserFactory.isClient()
                    );
                    TuProfileHistoryLogFactory.setReload(true);
                    break;
                case constants.publishStatus.success:
                    section.publishDisabled = false;
                    section.statusMessage = response.statusMessage;
                    // Update nodeId
                    section.viewDisabled = !response.nodeId;
                    section.url = constants.drupal.tu.url + '/node/' + response.nodeId;
                    TuProfileHistoryLogFactory.setReload(true);
                    if (section.type === 'master') {
                        controller.updateStarsSection(response);
                    }
                    break;
                default:
                    break;
            }
        };

        /**
         * Updates stars section based on master section
         *
         * @param {array} response
         */
        controller.updateStarsSection = function (response) {
            for (var i = 0; i < $scope.sections.length; i++) {
                if ($scope.sections[i].type === 'stars') {
                    $scope.sections[i].viewDisabled = !response.nodeId;
                    $scope.sections[i].url = constants.drupal.tu.url + '/node/' + response.nodeId;
                }
            }
        };

        /**
         * Handle publish statuses response.
         *
         * @param {Promise.Object} publishStatus
         */
        controller.publishStatusCallback = function (publishStatus) {
            angular.forEach($scope.sections, function(section) {
                section.publishDisabled = true;
                if (angular.isDefined(publishStatus[section.type])) {
                    section.status = publishStatus[section.type].status;
                    if (section.status.length === 0 ||
                        section.status === constants.publishStatus.success ||
                        section.status === constants.publishStatus.failure
                    ) {
                        section.publishDisabled = false;
                    }
                    section.statusMessage = PublishService.convertErrorMessage(
                        publishStatus[section.type].message,
                        UserFactory.isClient()
                    );
                }
            });
        };

        /**
         * Initialize watches.
         */
        controller.initWatches = function () {
            // watch for active institution changes
            WatchService.create($scope, InstitutionFactory.getData, function (newValue) {
                if (newValue) {
                    $scope.institutionData = newValue;
                    $scope.institutionId = newValue.id;
                    $scope.sections = PublishService.getSections(!UserFactory.isClient(), $scope.institutionData);
                    controller.publishSubscribe($scope.sections);
                    // get publishing statuses
                    PublishService.getPublishStatus($scope.institutionId).then(function (response) {
                        controller.publishStatusCallback(response);
                    });
                }
            });
        };

        /**
         * @constructor
         */
        controller.init = function () {
            controller.initWatches();
        };

        // listen to publish tab visibility changes
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
        .controller('TuProfilePublishController', [
            '$scope',
            'constants',
            'TuProfilePublishService',
            'InstitutionFactory',
            'TuProfileFactory',
            'TuProfileHistoryLogFactory',
            'UserFactory',
            'WebSocketsService',
            'WatchService',
            App.controllers.tuProfilePublish
        ]);

}(window.angular));
