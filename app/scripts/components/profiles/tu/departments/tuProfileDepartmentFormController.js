(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.tuProfileDepartmentForm = function (
        $scope,
        $state,
        $rootScope,
        $resource,
        constants,
        NotifierFactory,
        TuProfileFactory,
        InstitutionFactory,
        UserFactory,
        TuProfileDepartmentsService,
        LoginService,
        ModalService,
        WatchService,
        InstitutionsListService
    ) {
        var controller = this,
            alreadyInitialised = false;

        controller.devMode = constants.dev;
        $scope.forms = {};
        $scope.upgradeInProgress = false;
        $scope.downgradeInProgress = false;
        $scope.addInProgress = false;
        $scope.editInProgress = false;
        $scope.newDepartment = {};
        $scope.newDepartmentBeforeChanges = {
            parentCoreId: null
        };
        $scope.campusList = [];
        $scope.department = {};
        $scope.belongsToList = [];
        controller.modifiedAtField = 'modifiedAt';
        controller.tuSupportEmail = constants.support.tu;

        $scope.getTuProfileDepartmentForm = function () {
            return controller;
        };

        /**
         * Is department data fetch in progress?
         *
         * @returns {boolean}
         */
        $scope.isFetchInProgress = function () {
            return !$scope.department || !$scope.department.id;
        };

        /**
         * Is department upgrade allowed?
         *
         * @returns {boolean}
         */
        $scope.allowUpgrade = function () {
            return TuProfileDepartmentsService.allowUpgrade($scope.department);
        };

        /**
         * Allowed to login as department?
         *
         * @returns {boolean}
         */
        $scope.allowLoginAs = function () {
            return TuProfileDepartmentsService.allowLoginAs($scope.department);
        };

        $scope.allowEdit = function () {
            if (!UserFactory.isClient() || !InstitutionsListService.isClientDepartment($scope.department.typeId)) {
                return true;
            }

            return UserFactory.isAllowedToLogin($scope.department.coreId);
        };

        controller.isLoginRestricted = function () {
            return UserFactory.isClient() && !UserFactory.isAllowedToLogin($scope.department.coreId);
        };

        /**
         * Is department downgrade allowed?
         *
         * @param {Object} department
         * @returns {boolean}
         */
        $scope.allowDowngrade = function () {
            return TuProfileDepartmentsService.allowDowngrade($scope.department);
        };

        /**
         * Is department downgrade disabled?
         *
         * @returns {boolean}
         */
        $scope.isDowngradeDisabled = function () {
            return TuProfileDepartmentsService.hasActiveSubscription($scope.department);
        };

        /**
         * Get department core ID.
         *
         * @returns {null|int}
         */
        controller.getDepartmentCoreId = function () {
            if (angular.isDefined($scope.department.coreId)) {
                return $scope.department.coreId;
            } else {
                var department = TuProfileFactory.getDepartmentBeforeChanges();
                return department && department.coreId ? department.coreId : null;
            }
        };

        /**
         * Actions to do when upgrade button clicked.
         *
         * @returns {boolean}
         */
        controller.handleUpgradeClick = function () {
            if (UserFactory.isClient()) {
                TuProfileFactory.setClientDepartmentUpgradeFormVisibility();
            } else {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    headerText: 'Upgrade To Client Department',
                    institutionCoreId: controller.getDepartmentCoreId(),
                    completeUpgradeClick: function () {
                        this.close();
                        if (!$scope.department || !$scope.department.id || $scope.upgradeInProgress) {
                            return false;
                        }
                        $scope.upgradeInProgress = true;
                        TuProfileDepartmentsService.upgrade($scope.department.id).then(controller.upgradeCallback);
                    }
                }, modalDefaults = {
                    backdrop: true,
                    keyboard: true,
                    modalFade: true,
                    templateUrl: '/scripts/components/profiles/tu/departments/modalUpgradeDepartmentView.html'
                };
                ModalService.show(modalDefaults, modalOptions);
            }
        };

        /**
         * Actions to do when upgrade request is finished.
         *
         * @param {boolean} success
         */
        controller.upgradeCallback = function (success) {
            if (success) {
                // get department instance before changes
                var departmentInstance = TuProfileFactory.getDepartmentBeforeChanges();
                // apply changes to original department
                departmentInstance.typeId = constants.typeId.clientDepartmentId;
                TuProfileDepartmentsService.formatList([departmentInstance]);
                // apply changes to active department
                $scope.department.typeId = constants.typeId.clientDepartmentId;
                $scope.department.typeName = TuProfileDepartmentsService.getTypeName(constants.typeId.clientDepartmentId);
                $scope.department.coreId = departmentInstance.coreId;
                InstitutionFactory.setActiveTab(true);
            }
            $scope.upgradeInProgress = false;

            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'Upgraded successfully!' : 'Upgrade failed!',
                'Upgrade to Client'
            );
        };

        /**
         * Actions to do when downgrade button clicked.
         *
         * @returns {boolean}
         */
        $scope.handleDowngradeClick = function () {
            $scope.downgradeInProgress = true;
            var modalOptions = {
                closeButtonText: 'Cancel',
                headerText: 'Current Subscription(s)',
                institutionCoreId: controller.getDepartmentCoreId(),
                department: $scope.department,
                downgradeAndDelete: $scope.downgradeAndDelete,
                subscriptions: TuProfileDepartmentsService.hasActiveSubscription($scope.department),
                completeDowngradeClick: function (downgradeAndDelete) {
                    this.close();
                    if (modalOptions.subscriptions && !downgradeAndDelete) {
                        $state.go('staff.institutions.list', {coreId: modalOptions.institutionCoreId});
                    } else {
                        TuProfileDepartmentsService.downgrade($scope.department.id).then(controller.downgradeCallback);
                    }
                }
            }, modalDefaults = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: '/scripts/components/profiles/tu/departments/modalDowngradeDepartmentView.html'
            };
            ModalService.show(modalDefaults, modalOptions);
        };

        /**
         * Actions to do when downgrade request is finished.
         *
         * @param {boolean} success
         */
        controller.downgradeCallback = function (success) {
            if (success) {
                // get department instance before changes
                var departmentInstance = TuProfileFactory.getDepartmentBeforeChanges();
                // apply changes to original department
                departmentInstance.typeId = constants.typeId.simpleDepartmentId;
                TuProfileDepartmentsService.formatList([departmentInstance]);
                // apply changes to active department
                $scope.department.typeId = constants.typeId.simpleDepartmentId;
                $scope.department.typeName = TuProfileDepartmentsService.getTypeName(
                    constants.typeId.simpleDepartmentId
                );
            }
            $scope.downgradeInProgress = false;

            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'Downgrade successfully!' : 'Downgrade failed!',
                'Downgrade to Simple'
            );
        };

        /**
         * Actions to do when login as button clicked.
         *
         * @returns {boolean}
         */
        $scope.handleLoginAsClick = function () {
            LoginService.getTuProfilesRedirect({ coreId: $scope.department.coreId });
            TuProfileFactory.setDepartmentEditFormVisibility();
            TuProfileFactory.setDepartment(null);
        };

        /**
         * Actions to do when department update button is clicked.
         *
         * @returns {boolean}
         */
        $scope.handleDepartmentUpdateClick = function () {
            if (!controller.isValid($scope.department)) {
                return;
            }
            $scope.editInProgress = true;
            TuProfileDepartmentsService.update($scope.department).then(controller.updateCallback);
        };

        $scope.setIsInvalidDepartmentNameUpdate = function (value) {
            $scope.isInvalidDepartmentNameUpdate = value;
        };

        $scope.setIsInvalidBelongsToUpdate = function (value) {
            $scope.isInvalidBelongsToUpdate = value;
        };

        /**
         * Actions to do when update request is finished.
         *
         * @param {Object} response
         */
        controller.updateCallback = function (response) {
            var success = false;
            if (response.hasOwnProperty('modifiedAt')) {
                success = true;
            }
            $scope.editInProgress = false;
            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'Updated successfully!' : 'Update failed!',
                'Update Department'
            );
            if (success) {
                // get department instance before changes
                var departmentInstance = TuProfileFactory.getDepartmentBeforeChanges();
                // apply changes to department
                angular.forEach($scope.department, function (value, key) {
                    departmentInstance[key] = value;
                    if (key === controller.modifiedAtField) {
                        departmentInstance[key] = response.modifiedAt;
                    }
                });
                TuProfileDepartmentsService.formatList([departmentInstance]);
                // Update Programs grid
                TuProfileFactory.setIsDepartmentUpdated(true);
                //Update Departments grid
                if (InstitutionFactory.isDepartmentsAlphabeticalOrder()) {
                    TuProfileFactory.setUpdateDepartmentsGrid(true);
                }
            }
        };

        controller.isUpgradeDisabled = function () {
            return !controller.isValid($scope.department, false);
        };

        controller.isValid = function (item, triggerValidators)
        {
            triggerValidators = typeof triggerValidators === 'undefined' ? true : triggerValidators;

            var isEdit = !!item.id;
            if (triggerValidators) {
                if (isEdit) {
                    $scope.isInvalidDepartmentNameUpdate = false;
                    $scope.isInvalidBelongsToUpdate = false;
                } else {
                    $scope.isInvalidNewDepartmentName = false;
                    $scope.isInvalidNewBelongsTo = false;
                }
            }

            if (!item.name || !item.name.length) {
                if (triggerValidators) {
                    if (isEdit) {
                        $scope.isInvalidDepartmentNameUpdate = true;
                    } else {
                        $scope.isInvalidNewDepartmentName = true;
                    }
                } else {
                    return false;
                }
            }
            if (!item.belongsTo || !item.belongsTo.length) {
                if (triggerValidators) {
                    if (isEdit) {
                        $scope.isInvalidBelongsToUpdate = true;
                    } else {
                        $scope.isInvalidNewBelongsTo = true;
                    }
                } else {
                    return false;
                }
            }

            if (triggerValidators) {
                if (isEdit) {
                    if (
                        $scope.editInProgress ||
                        !$scope.forms.editDepartmentForm ||
                        !$scope.forms.editDepartmentForm.$valid ||
                        $scope.isInvalidBelongsToUpdate ||
                        $scope.isInvalidDepartmentNameUpdate
                    ) {
                        TuProfileFactory.setIsDepartmentRowSelected(false);
                        return false;
                    }
                } else {
                    if (
                        $scope.addInProgress ||
                        !$scope.forms.addDepartmentForm ||
                        !$scope.forms.addDepartmentForm.$valid ||
                        $scope.isInvalidNewDepartmentName ||
                        $scope.isInvalidNewBelongsTo
                    ) {
                        return false;
                    }
                }
            } else {
                return isEdit ?
                    (!$scope.editInProgress || !$scope.forms.editDepartmentForm.$valid) :
                    (!$scope.addInProgress || !$scope.forms.addDepartmentForm.$valid);
            }

            return true;
        };

        /**
         * Actions to do when new department create button is clicked.
         *
         * @returns {boolean}
         */
        $scope.handleDepartmentCreateClick = function () {
            if (!controller.isValid($scope.newDepartment)) {
                return;
            }

            $scope.addInProgress = true;
            $scope.newDepartment[controller.modifiedAtField] = null;
            TuProfileDepartmentsService.create($scope.newDepartment).then(controller.createCallback);
        };

        $scope.setIsInvalidNewDepartmentName = function (value) {
            $scope.isInvalidNewDepartmentName = value;
        };

        $scope.setIsInvalidNewBelongsTo = function (value) {
            $scope.isInvalidNewBelongsTo = value;
        };

        /**
         * Actions to do when create request is finished.
         *
         * @param {Object} response
         */
        controller.createCallback = function (response) {
            // enable add button
            $scope.addInProgress = false;
            // show notification message
            NotifierFactory.show(
                response ? 'success' : 'error',
                response ? 'Saved successfully!' : 'Saving failed!',
                'Department'
            );
            if (response) {
                var department = angular.copy($scope.newDepartment);
                department.id = response.insertedId;
                // set department type
                department.typeName = response.typeName;
                // set department typeId
                department.typeId = response.typeId;
                // set new department as active
                TuProfileFactory.setDepartment(department);
                // announce that new department was added
                TuProfileFactory.announceNewDepartment(department.id);
            }
        };

        controller.resetAddForm = function () {
            if ($scope.newDepartment.name) {
                $scope.newDepartment.name = null;
            }
            if ($scope.newDepartment.belongsTo) {
                $scope.newDepartment.belongsTo = null;
            }
            if ($scope.newDepartment.primaryCampusId) {
                $scope.newDepartment.primaryCampusId = null;
            }
            $scope.isInvalidNewDepartmentName = false;
            $scope.isInvalidNewBelongsTo = false;
        };

        /**
         * Toggle Client Department Upgrade Form
         */
        controller.toggleClientUpgradeForm = function () {
            TuProfileFactory.setDepartmentEditFormVisibility(true);
        };

        controller.initWatches = function () {
            // watch for core ID changes
            WatchService.create($scope, InstitutionFactory.getCoreId, function (parentCoreId) {
                $scope.newDepartmentBeforeChanges.parentCoreId = parentCoreId;
                $scope.newDepartment.parentCoreId = parentCoreId;
            });

            WatchService.create($scope, TuProfileFactory.getDepartment, function (newValue) {
                $scope.department = newValue;
                $scope.isInvalidDepartmentNameUpdate = false;
                $scope.isInvalidBelongsToUpdate = false;
                $scope.isInvalidNewDepartmentName = false;
                $scope.isInvalidNewBelongsTo = false;
            }, true);

            WatchService.create($scope, InstitutionFactory.getCampusData, function (newValue) {
                if (newValue) {
                    $scope.campusList = TuProfileDepartmentsService.formatCampusList(newValue);
                }
            }, true);

            // if department add form visible hide popovers
            WatchService.create($scope, function () {
                return TuProfileFactory.isDepartmentAddFormVisible($scope.activeTab);
            }, function (visible) {
                if (visible) {
                    controller.resetAddForm();
                }
            });

            // watch for department row selection changed
            WatchService.create($scope, function () {
                return TuProfileFactory.getIsDepartmentRowSelected();
            }, function (visible) {
                if (visible) {
                    $scope.isInvalidDepartmentNameUpdate = false;
                    $scope.isInvalidBelongsToUpdate = false;
                    $scope.isInvalidCampusUpdate = false;
                }
            });
        };

        controller.initialiseForm = function () {
            // get belongs to list
            $scope.belongsToList = TuProfileDepartmentsService.getBelongsToList();
            // prepare new department object
            $scope.newDepartment = angular.copy($scope.newDepartmentBeforeChanges);
        };

        controller.init = function () {
            controller.initWatches();
        };

        // listen to departments tab visibility changes
        WatchService.create($scope, TuProfileFactory.isDepartmentsTabSelected, function (isActive, wasActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
            if (isActive) {
                controller.initialiseForm();
                if ($scope.forms && $scope.forms.addDepartmentForm) {
                    $scope.forms.addDepartmentForm.$setUntouched();
                }
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TuProfileDepartmentForm', [
            '$scope',
            '$state',
            '$rootScope',
            '$resource',
            'constants',
            'NotifierFactory',
            'TuProfileFactory',
            'InstitutionFactory',
            'UserFactory',
            'TuProfileDepartmentsService',
            'LoginService',
            'ModalService',
            'WatchService',
            'InstitutionsListService',
            App.controllers.tuProfileDepartmentForm
        ]);

} (window.angular));
