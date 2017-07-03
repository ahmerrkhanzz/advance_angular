(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.tmProfilePublish = function (
        $scope,
        constants,
        PublishService,
        InstitutionFactory,
        TmProfileFactory,
        TmProfileHistoryLogFactory,
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
         * @param {object} section
         * @param {string} publishProgramsBasic
         * @param {string} publishProgramsAdvanced
         */
        $scope.handlePublish = function (section, publishProgramsBasic, publishProgramsAdvanced) {
            section.publishDisabled = true;
            section.status = constants.publishStatus.pending;
            section.statusMessage = '';
            var publishBasicPrograms = publishProgramsBasic ? 'yes' : 'no';
            var publishAdvancedPrograms = publishProgramsAdvanced ? 'yes' : 'no';
            PublishService.publish($scope.institutionId, publishBasicPrograms, publishAdvancedPrograms).then(function (response) {
                controller.publishCallback(section, response);
            });
        };

        /**
         * Returns whether to disable the profile or not based on type
         *
         * @returns {Boolean}
         */
        controller.isProfileEnabled = function () {
            return !InstitutionFactory.isTmEnabled();
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
         * Check is section is for TM
         *
         * @param {string} type
         * @returns {Boolean}
         */
        $scope.isTm = function (type) {
            return type === 'tm';
        };

        /**
         * Check if institution has advanced programs to publish or not
         *
         * @returns {Boolean}
         */
        $scope.institutionHasAdvancedPrograms = function() {
            return $scope.institutionData.typeId === constants.typeId.topLevelInstitutionId ||
                    $scope.institutionData.typeId === constants.typeId.clientDepartmentId;
        };


        /**
         * Subscribe to all available publishes.
         *
         */
        controller.publishSubscribe = function() {
            angular.forEach($scope.sections, function (section) {
                var subscribeType = $scope.institutionId + 'tm';
                if (controller.subscribedTo.indexOf(subscribeType) === -1) {
                    controller.subscribedTo.push(subscribeType);
                    WebSocketsService.subscribe(subscribeType, 'PublishStatus' + subscribeType, function (response) {
                        controller.sectionPublishStatusCallback(section, response);
                    });
                }
            });
        };

        /**
         * Actions to do when status changes
         *
         * @param {Object} section
         * @param {Object} response
         */
        controller.sectionPublishStatusCallback = function (section, response) {
            section.publishDisabled = true;
            var status = response && response.status || constants.publishStatus.failure;
            section.status = status;
            switch (status) {
                case constants.publishStatus.failure:
                case constants.publishStatus.success:
                    section.publishDisabled = false;
                    section.statusMessage = response.statusMessage;
                    TmProfileHistoryLogFactory.setReload(true);
                    break;
                default:
                    break;
            }
            if (status === constants.publishStatus.success) {
                // Update nodeId
                section.viewDisabled = !response.nodeId;
                section.url = constants.drupal.tm.url + '/node/' + response.nodeId;
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
                if (publishStatus.hasOwnProperty('tm') && angular.isDefined(publishStatus.tm)) {
                    section.status = publishStatus.tm.status;
                    section.statusMessage = publishStatus.tm.message;
                    if (section.status.length === 0 ||
                        section.status === constants.publishStatus.success ||
                        section.status === constants.publishStatus.failure
                    ) {
                        section.publishDisabled = false;
                    }
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
                    controller.publishSubscribe();
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
        WatchService.create($scope, TmProfileFactory.isPublishTabSelected, function (isActive, wasActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TmProfilePublishController', [
            '$scope',
            'constants',
            'TmProfilePublishService',
            'InstitutionFactory',
            'TmProfileFactory',
            'TmProfileHistoryLogFactory',
            'UserFactory',
            'WebSocketsService',
            'WatchService',
            App.controllers.tmProfilePublish
        ]);

}(window.angular));
