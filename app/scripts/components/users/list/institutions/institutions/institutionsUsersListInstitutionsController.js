(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.tuProfilePrograms = function (
        $scope,
        constants,
        InstitutionsUsersListInstitutionsService,
        InstitutionsUsersListFactory,
        NotifierFactory,
        WatchService
    ) {
        var controller = this,
            alreadyInitialised = false;

        controller.devMode = constants.dev;
        controller.searchInProgress = false;

        controller.submitInProgress = false;
        
        $scope.selectedInstitutionsNamesLoaded = false;
        $scope.userInstitutions = {
            assigned : []
        };
        controller.newAssignedValues = {};
        $scope.institutionsSearchResults = [];

        controller.disallowSubmit = function () {
            // submit process is on going
            if (!$scope.user.id || controller.submitInProgress || !$scope.selectedInstitutionsNamesLoaded) {
                return true;
            }
            // missing primary institution
            if (!$scope.user.primaryInstitutionCoreId) {
                return true;
            }
            // current list is not empty & assigned institutions already in the list
            if (
                $scope.user.institutions &&
                $scope.user.institutions.length &&
                $scope.userBeforeChanges.institutions &&
                $scope.userBeforeChanges.institutions.length &&
                $scope.userInstitutions.assigned &&
                $scope.userInstitutions.assigned.length
            ) {
                var hasChanges = InstitutionsUsersListInstitutionsService.hasChanges(
                    $scope.user.institutions,
                    $scope.userBeforeChanges.institutions,
                    $scope.userInstitutions.assigned
                );
                if (
                    !hasChanges &&
                    $scope.user.primaryInstitutionCoreId === $scope.userBeforeChanges.primaryInstitutionCoreId
                ) {
                    return true;
                }
            }
            // current & assigned lists are empty
            if (
                $scope.user.institutions &&
                !$scope.user.institutions.length &&
                $scope.userBeforeChanges.institutions &&
                !$scope.userBeforeChanges.institutions.length &&
                $scope.userInstitutions.assigned &&
                !$scope.userInstitutions.assigned.length
            ) {
                return true;
            }

            return false;
        };

        /**
         * Is progress bar visible?
         *
         * @returns {boolean}
         */
        controller.isProgressBarVisible = function () {
            return !$scope.selectedInstitutionsNamesLoaded || controller.searchInProgress;
        };


        /**
         * Actions to do when institutions changes are submitted.
         */
        controller.handleInstitutionSubmit = function () {
            controller.submitInProgress = true;

            // fetch user institutions groups
            InstitutionsUsersListInstitutionsService.getInstitutionsGroups(
                $scope.user.primaryInstitutionCoreId
            ).then(function (institutionsGroups) {
                // re-format institution groups
                if (angular.isArray(institutionsGroups) && institutionsGroups.length > 0) {
                    var institutionsGroupsFormatted = {};
                    institutionsGroupsFormatted[0] = {};
                    angular.forEach(institutionsGroups, function (institutionsGroup) {
                        institutionsGroupsFormatted[0][institutionsGroup.coreId] = {
                            coreId: institutionsGroup.coreId,
                            name: institutionsGroup.name
                        };
                    });
                    institutionsGroups = institutionsGroupsFormatted;
                }
                $scope.user.institutionsGroups = institutionsGroups;
                // update user institutions
                InstitutionsUsersListInstitutionsService.saveInstitutions(
                    $scope.user.id,
                    $scope.userInstitutions.assigned,
                    {
                        primaryInstitutionCoreId : $scope.user.primaryInstitutionCoreId,
                        primaryInstitutionCoreIdAsString : '' + $scope.user.primaryInstitutionCoreId,
                        primaryInstitutionName : $scope.user.primaryInstitutionName,
                        qs : $scope.user.qs
                    },
                    institutionsGroups
                ).then(controller.saveInstitutionsCallback);
            });
        };

        /**
         * Actions to do after institutions changes are submission.
         *
         * @param {Boolean} success
         */
        controller.saveInstitutionsCallback = function (success) {
            var assignedIds = InstitutionsUsersListInstitutionsService.getObjectColumn(
                $scope.userInstitutions.assigned, 'coreId'
            );
            $scope.user.institutions = angular.copy(assignedIds);
            $scope.userBeforeChanges.institutions = angular.copy(assignedIds);
            $scope.userBeforeChanges.primaryInstitutionCoreId = $scope.user.primaryInstitutionCoreId;
            controller.submitInProgress = false;

            if (success) {
                controller.userInstitutionsBeforeChanges = angular.copy($scope.userInstitutions);
                $scope.user.primaryInstitutionCoreIdAsString = '' + $scope.user.primaryInstitutionCoreId;
                $scope.$emit(constants.events.institutionsUserPrimaryInstitutionChanges);
            }
            controller.newAssignedValues = angular.copy($scope.userInstitutions.assigned);
            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'Updated successfully!' : 'Update failed!',
                'User Institutions'
            );
        };

        /**
         * Actions to do after institutions search.
         *
         * @param {Array} results
         */
        controller.searchInstitutionsCallback = function (results) {
            controller.searchInProgress = false;
            $scope.institutionsSearchResults = results;
        };

        /**
         * Search for institution by search phrase.
         *
         * @param {String} searchPhrase
         */
        controller.searchInstitutions = function (searchPhrase) {
            controller.searchInProgress = true;
            InstitutionsUsersListInstitutionsService.searchInstitutions(
                searchPhrase,
                $scope.user.primaryInstitutionCoreId,
                $scope.userInstitutions.assigned
            ).then(controller.searchInstitutionsCallback);
        };

        /**
         * Actions to do after institutions full names search.
         *
         * @param {Array} results
         */
        controller.getInstitutionsNamesCallback = function (results) {
            $scope.selectedInstitutionsNamesLoaded = true;
            $scope.userInstitutions.assigned = results;
            var addPrimary = true;
            for (var r in results) {
                if (results[r].coreId === $scope.user.primaryInstitutionCoreId) {
                    addPrimary = false;
                    break;
                }
            }
            if (addPrimary &&
                $scope.user.primaryInstitutionCoreId &&
                $scope.user.primaryInstitutionName !== '' &&
                $scope.user.primaryInstitutionName
            ) {
                $scope.userInstitutions.assigned.push({
                    coreId : $scope.user.primaryInstitutionCoreId,
                    name : $scope.user.primaryInstitutionName + ' [' + $scope.user.primaryInstitutionCoreId + ']'
                });
            }
            controller.userInstitutionsBeforeChanges = angular.copy($scope.userInstitutions);
        };

        controller.handleItemSelect = function (item) {
            if ($scope.userInstitutions.assigned.length === 1) {
                $scope.user.primaryInstitutionCoreId = item.coreId;
                $scope.user.primaryInstitutionName = item.name.replace(' [' + item.coreId + ']','');
            }
        };

        controller.handleItemRemove = function (item) {
            if (item && $scope.user.primaryInstitutionCoreId === item.coreId) {
                $scope.user.primaryInstitutionCoreId = null;
            }
        };

        controller.handlePrimaryInstitutionChanges = function () {
            for (var i in  $scope.userInstitutions.assigned) {
                // find primary institution object in assigned institutions list
                if ($scope.userInstitutions.assigned[i].coreId === $scope.user.primaryInstitutionCoreId) {
                    $scope.user.primaryInstitutionName = $scope.userInstitutions.assigned[i].name.replace(' [' + $scope.user.primaryInstitutionCoreId + ']', '');
                    $scope.user.primaryInstitutionCoreIdAsString = ''+ $scope.userInstitutions.assigned[i].coreId;
                    break;
                }
            }
        };

        /**
         * Initialise user institutions.
         */
        controller.initUserInstitutions = function () {
            $scope.selectedInstitutionsNamesLoaded = false;
            if ($scope.user && $scope.user.institutions && $scope.user.institutions.length) {
                InstitutionsUsersListInstitutionsService.getInstitutionNames(
                    $scope.user.institutions
                ).then(controller.getInstitutionsNamesCallback);
            } else {
                controller.getInstitutionsNamesCallback([]);
            }
        };

        /**
         * Initialise watches.
         */
        controller.initWatches = function () {
            // listen to active user changes
            WatchService.create($scope, InstitutionsUsersListFactory.getActiveUserId, function (userId) {
                if (userId) {
                    if (InstitutionsUsersListFactory.isInstitutionsTabSelected()) {
                        controller.initUserInstitutions();
                    }
                } else {
                    $scope.selectedInstitutionsNamesLoaded = true;
                    controller.getInstitutionsNamesCallback([]);
                }
            });

            /**
             * Restore value for primaryInstitutionCoreId if it gets undefined
             */
            WatchService.create($scope, 'user.primaryInstitutionCoreId', function(newValue, oldValue) {
                if (newValue === undefined) {
                    $scope.user.primaryInstitutionCoreId = oldValue;
                }
            });

            /**
             * Restore value for primaryInstitutionCoreId if it gets undefined
             */
            WatchService.create($scope, 'userInstitutions.assigned', function(newValue, oldValue) {
                if (newValue.length === 0 && oldValue.length > 0) {
                    $scope.user.primaryInstitutionName = null;
                    $scope.user.primaryInstitutionCoreId = null;
                    $scope.user.primaryInstitutionCoreIdAsString = null;
                }
            });

            WatchService.create($scope, function() {return controller.newAssignedValues;}, function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.userInstitutions.assigned = angular.copy(newValue);
                }
            });

            $scope.$on(constants.events.closingInstitutionsUsers, function () {
                // reset unsaved changes
                $scope.userInstitutions = angular.copy(controller.userInstitutionsBeforeChanges);
                $scope.selectedInstitutionsNamesLoaded = false;
            });

            // listen if institution tab is selected, init user institutions
            WatchService.create($scope, InstitutionsUsersListFactory.isInstitutionsTabSelected, function (isSelected) {
                if (isSelected) {
                    controller.initUserInstitutions();
                }
            });
        };

        controller.init = function () {
            controller.initWatches();
        };

        // listen to institutions tab visibility changes
        WatchService.create($scope, InstitutionsUsersListFactory.isInstitutionsTabSelected, function (isActive, wasActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
            if (isActive && InstitutionsUsersListFactory.getActiveUserId() && !$scope.selectedInstitutionsNamesLoaded) {
                controller.initUserInstitutions();
            }
        });
    };

    angular
        .module('qsHub')
        .controller('InstitutionsUsersInstitutionsController', [
            '$scope',
            'constants',
            'InstitutionsUsersListInstitutionsService',
            'InstitutionsUsersListFactory',
            'NotifierFactory',
            'WatchService',
            App.controllers.tuProfilePrograms
        ]);

}(window.angular));
