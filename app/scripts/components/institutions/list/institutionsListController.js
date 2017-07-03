(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.institutionsList = function (
        $scope,
        $resource,
        $stateParams,
        constants,
        InstitutionsListService,
        SharedProfileFactory,
        NotifierFactory,
        InstitutionFactory,
        InstitutionsListFactory,
        orderBy,
        LoginService,
        TuProfileDepartmentsService,
        uiGridConstants,
        $timeout,
        WatchService,
        ModalService,
        TmProfileProgramsService,
        InstitutionService,
        GridService,
        InstitutionsListSubscriptionsFactory,
        TimeService
    ) {
        var controller = this;
        controller.devMode = constants.dev;
        controller.filters = {};
        controller.urls = {
            'tu': constants.drupal.tu.url + '/node/',
            'tm': constants.drupal.tm.url + '/node/'
        };
        controller.newInstitution = false;
        controller.isClient = false;
        controller.isSimple = false;
        controller.isAdvancedProgram = false;
        controller.subscriptionDates = [];
        controller.isDisplayDepartmentEnabled = false;
        $scope.institution = {};
        $scope.institutionBeforeChanges = {};
        $scope.columnsBeforeHide = [];
        $scope.forms = {};
        $scope.filterActive = true;
        $scope.isDatagridReloading = false;
        $scope.isSelectReloading = false;
        $scope.basicDetailsSubmitInProgress = false;
        $scope.subscriptionProfilesSubmitInProgress = false;
        $scope.subscriptionStatisticsSubmitInProgress = false;
        $scope.drupalSubmitInProgress = false;
        $scope.institutionGroupSubmitInProgress = false;
        $scope.institutionsWithoutGroup = [];
        $scope.isDatagridRendered = false;
        $scope.isProgramDowngradeDisabled = true;
        $scope.noChanges = true;
        $scope.visible = {};
        $scope.datePickerTu = {
            date: {
                startDate: null,
                endDate: null
            },
            options: {
                ranges: {
                    '6 months from today': [TimeService.now(), TimeService.add(6, 'months')],
                    '12 months from today': [TimeService.now(), TimeService.add(12, 'months')]
                },
                eventHandlers: {
                    'apply.daterangepicker': function (ev) {
                        $scope.handleDateRangePickerApplyClick(ev, 'tu');
                    }
                },
                opens: 'center',
                alwaysShowCalendars: true
            }
        };
        /**
         * Initialize vars for selected item and type
         */
        controller.setSelectedItem = function (typeId) {
            $scope.selectedItem = {
                selectedOptionType: {},
                parentCoreId: null
            };
            if (typeId) {
                angular.forEach(controller.typesList, function (item) {
                    if (item.uniqueId === typeId) {
                        $scope.selectedItem.selectedOptionType = item;
                    }
                });
            }
        };

        $scope.datePickerTm = {
            date: {
                startDate: null,
                endDate: null
            },
            options: {
                ranges: {
                    '6 months from today': [TimeService.now(), TimeService.add(6, 'months')],
                    '12 months from today': [TimeService.now(), TimeService.add(12, 'months')]
                },
                eventHandlers: {
                    'apply.daterangepicker': function (ev) {
                        $scope.handleDateRangePickerApplyClick(ev, 'tm');
                    }
                },
                opens: 'center',
                alwaysShowCalendars: true
            }
        };
        $scope.activeTab = 0;

        $scope.disabledInstitutionListTabs = {
            'basicDetails': false,
            'subscriptions': false,
            'campuses': false,
            'institutionGroups': false,
            'drupal': false
        };

        $scope.handleDateRangePickerApplyClick = function (element, type) {
            if (!element.model.startDate) {
                element.model.startDate = TimeService.now();
            }
            if (!element.model.endDate) {
                element.model.endDate = TimeService.now();
            }

            $scope.institution.subscriptions[type].startDate = TimeService.getInUnix(element.model.startDate);
            $scope.institution.subscriptions[type].endDate = TimeService.getInUnix(element.model.endDate);
        };

        controller.similarNames = {
            'display': false,
            'loading': false,
            'results': []
        };

        controller.showDepartments = {
            'display': false,
            'loading': false,
            'results': []
        };

        SharedProfileFactory.setInstitutionListShowCampusInfoBlock(false);

        $scope.disabledSubmit = function () {
            return (
                $scope.subscriptionProfilesSubmitInProgress ||
                (
                    $scope.institution.subscriptions &&
                    $scope.institution.subscriptions.tm &&
                    $scope.institution.subscriptions.tm.subscribed &&
                    $scope.institution.subscriptions.tm.advanced &&
                    (!$scope.institution.subscriptions.tm.startDate ||
                        !$scope.institution.subscriptions.tm.endDate)
                ) ||
                (
                    $scope.institution.subscriptions &&
                    $scope.institution.subscriptions.tu &&
                    $scope.institution.subscriptions.tu.subscribed &&
                    $scope.institution.subscriptions.tu.advanced &&
                    (!$scope.institution.subscriptions.tu.startDate ||
                        !$scope.institution.subscriptions.tu.endDate)
                )
            );
        };

        controller.reloadDatagrid = function () {
            controller.getPage();
        };

        controller.populateSubscriptionsDateDatepickers = function () {
            if ($scope.institution && $scope.institution.subscriptions) {
                if (
                    $scope.institution.subscriptions.tu &&
                    $scope.institution.subscriptions.tu.startDate &&
                    $scope.institution.subscriptions.tu.endDate
                ) {
                    $scope.datePickerTu.date.startDate = InstitutionsListService.formatSubscriptionDate(
                        $scope.institution.subscriptions.tu.startDate
                    );
                    $scope.datePickerTu.date.endDate = InstitutionsListService.formatSubscriptionDate(
                        $scope.institution.subscriptions.tu.endDate
                    );
                }
                if (
                    $scope.institution.subscriptions.tm &&
                    $scope.institution.subscriptions.tm.startDate &&
                    $scope.institution.subscriptions.tm.endDate
                ) {
                    $scope.datePickerTm.date.startDate = InstitutionsListService.formatSubscriptionDate(
                        $scope.institution.subscriptions.tm.startDate
                    );
                    $scope.datePickerTm.date.endDate = InstitutionsListService.formatSubscriptionDate(
                        $scope.institution.subscriptions.tm.endDate
                    );
                }
            }
        };

        controller.toggleColumns = function (hide, forceClose) {
            if (angular.isUndefined(forceClose)) {
                forceClose = false;
            }
            if (!$scope.gridOptions) {
                return;
            }
            if (hide && !forceClose) {
                // hide all columns except name
                angular.forEach($scope.gridOptions.columnDefs, function (column) {
                    $scope.visible[column.field] = column.visible;
                    column.visible = column.field === 'name';
                });
            } else {
                var columns = [];
                // show columns visible before hide
                angular.forEach($scope.columnsBeforeHide, function (column) {
                    column.visible = true;
                    columns.push(column.field);
                });
                angular.forEach($scope.gridOptions.columnDefs, function (column) {
                    if (columns.indexOf(column.field) !== -1) {
                        column.visible = true;
                    }
                });
                $scope.columnsBeforeHide = [];
                $scope.comesFromProfile = false;
            }
        };

        controller.getTuWarningMessage = function () {
            // if UG & PG front-end profile were enabled but now disabled
            if ($scope.institution.subscriptions &&
                $scope.institution.subscriptions.tu &&
                $scope.institution.subscriptions.tu.subscribed &&
                $scope.institution.enabled &&
                !$scope.institution.enabled.ug &&
                !$scope.institution.enabled.pg &&
                $scope.institutionBeforeChanges.enabled &&
                $scope.institutionBeforeChanges.enabled.ug &&
                $scope.institutionBeforeChanges.enabled.pg
            ) {
                return 'Institution will be unpublished from topuniversities.com. Press update to continue.';
            }
            // If UG front-end profile was enabled but now disabled
            if ($scope.institution.subscriptions &&
                $scope.institution.subscriptions.tu &&
                $scope.institution.subscriptions.tu.subscribed &&
                $scope.institution.enabled &&
                !$scope.institution.enabled.ug &&
                $scope.institutionBeforeChanges.enabled &&
                $scope.institutionBeforeChanges.enabled.ug
            ) {
                return 'Undergraduate profile will be unpublished on topuniversities.com. You can access profile in Qs Hub, however will not be able to publish. Press update to continue';
            }
            // if PG front-end profile was enabled but now disabled
            if ($scope.institution.subscriptions &&
                $scope.institution.subscriptions.tu &&
                $scope.institution.subscriptions.tu.subscribed &&
                $scope.institution.enabled &&
                !$scope.institution.enabled.pg &&
                $scope.institutionBeforeChanges.enabled &&
                $scope.institutionBeforeChanges.enabled.pg
            ) {
                return 'Postgraduate profile will be unpublished on topuniversities.com. You can access profile in Qs Hub, however will not be able to publish. Press update to continue';
            }
            // if TU hub profile was enabled but now disabled
            if ($scope.institution.subscriptions &&
                $scope.institution.subscriptions.tu &&
                !$scope.institution.subscriptions.tu.subscribed &&
                $scope.institutionBeforeChanges.subscriptions &&
                $scope.institutionBeforeChanges.subscriptions.tu &&
                $scope.institutionBeforeChanges.subscriptions.tu.subscribed
            ) {
                return 'Disabling in QS Hub will also disable profile in topuniversities.com. If you wish to continue please press update.';
            }
            return false;
        };

        controller.hasTuWarning = function () {
            return !!controller.getTuWarningMessage();
        };

        controller.getTmWarningMessage = function () {
            // if MBA front-end profile were enabled but now disabled
            if ($scope.institution.subscriptions &&
                $scope.institution.subscriptions.tm &&
                $scope.institution.subscriptions.tm.subscribed &&
                $scope.institution.enabled &&
                !$scope.institution.enabled.tm &&
                $scope.institutionBeforeChanges.enabled &&
                $scope.institutionBeforeChanges.enabled.tm
            ) {
                return 'Mba profile will be unpublished on topmba.com. You can access profile in Qs Hub, however will not be able to publish. Press update to continue.';
            }
            // if TM hub profile was enabled but now disabled
            if ($scope.institution.subscriptions &&
                $scope.institution.subscriptions.tm &&
                !$scope.institution.subscriptions.tm.subscribed &&
                $scope.institutionBeforeChanges.subscriptions &&
                $scope.institutionBeforeChanges.subscriptions.tm &&
                $scope.institutionBeforeChanges.subscriptions.tm.subscribed
            ) {
                return 'Disabling in QS Hub will also disable profile in topmba.com. If you wish to continue please press update.';
            }
            return false;
        };

        controller.hasTmWarning = function () {
            return !!controller.getTmWarningMessage();
        };

        controller.isTuSubscriptionDatesInvalid = function () {
            return $scope.institution.subscriptions &&
                $scope.institution.subscriptions.tu &&
                $scope.institution.subscriptions.tu.subscribed &&
                $scope.institution.subscriptions.tu.advanced && (
                    !$scope.institution.subscriptions.tu.startDate ||
                    $scope.institution.subscriptions.tu.startDate === '' ||
                    !$scope.institution.subscriptions.tu.endDate ||
                    $scope.institution.subscriptions.tu.endDate === '');
        };

        controller.isTmSubscriptionDatesInvalid = function () {
            return $scope.institution.subscriptions &&
                $scope.institution.subscriptions.tm &&
                $scope.institution.subscriptions.tm.subscribed &&
                $scope.institution.subscriptions.tm.advanced && (
                    !$scope.institution.subscriptions.tm.startDate ||
                    $scope.institution.subscriptions.tm.startDate === '' ||
                    !$scope.institution.subscriptions.tm.endDate ||
                    $scope.institution.subscriptions.tm.endDate === '');
        };

        /**
         * Actions to do when dataGrid row is clicked.
         *
         * @param {object} institution
         * @param {boolean|null} forceClose
         */
        $scope.handleDatagridRowClick = function (institution, forceClose) {
            controller.resetBasicDetailsForm();
            controller.resetDrupalForm();
            controller.isClient = InstitutionsListService.isClientDepartment(institution.typeId);
            controller.isSimple = InstitutionsListService.isSimpleDepartment(institution.typeId);
            if (angular.isUndefined(forceClose)) {
                forceClose = false;
            }
            $scope.institutionBeforeChanges = institution;
            $scope.noChanges = true;
            $scope.selectedInstitutionId = $scope.selectedInstitutionId === institution.id ? null : institution.id;
            if (institution.groupMembers) {
                // filter out current institution
                institution.groupMembers = InstitutionsListService.excludeGroupMember(
                    institution.coreId,
                    institution.groupMembers
                );
                $scope.institutionsWithoutGroup = institution.groupMembers;
                $scope.institutionBeforeChanges.groupMembers = angular.copy(institution.groupMembers);
            }
            $scope.institution = angular.copy(institution);
            // on load, order by order value that comes from database
            $scope.institution.campus = orderBy($scope.institution.campus, 'order', false);
            $scope.showInfoBlock = forceClose ? false : $scope.selectedInstitutionId === institution.id;
            $scope.gridOptions.enableGridMenu = !$scope.showInfoBlock;
            $scope.gridOptions.enableColumnResizing = $scope.selectedInstitutionId === null;
            $scope.gridOptions.enablePaginationControls = $scope.selectedInstitutionId === null;

            SharedProfileFactory.setInstitutionListShowCampusInfoBlock(false);
            if ($scope.selectedInstitutionId) {
                controller.setSelectedItem(institution.typeId);
                controller.allowedInstitutionTypes(true);
                $scope.disabledInstitutionListTabs.subscriptions = false;
                $scope.disabledInstitutionListTabs.campuses = false;
                $scope.disabledInstitutionListTabs.institutionGroups = false;
                $scope.disabledInstitutionListTabs.drupal = false;
            } else {
                controller.allowedInstitutionTypes();
                $scope.disabledInstitutionListTabs.subscriptions = true;
                $scope.disabledInstitutionListTabs.campuses = true;
                $scope.disabledInstitutionListTabs.institutionGroups = true;
                $scope.disabledInstitutionListTabs.drupal = true;
            }
            $scope.filterActive = true;
            if ($scope.selectedInstitutionId === institution.id && !forceClose) {
                angular.forEach($scope.gridOptions.columnDefs, function (column) {
                    if (angular.isDefined(column.visible) && column.visible === true) {
                        $scope.columnsBeforeHide.push(column);
                    }
                });
                $scope.filterActive = false;
                controller.populateSubscriptionsDateDatepickers();

                $scope.array = [];

                $scope.institutionsWithoutGroup = [];

            }

            controller.isAdvancedProgram = InstitutionsListService.isAdvancedProgram(institution.typeId);
            if (controller.isAdvancedProgram) {
                controller.isProgramDowngradeEnabled();
            }
            //enable Display department button conditionally
            if (controller.isAdvancedProgram || controller.isTopLevelInstitution(institution.typeId)) {
                TuProfileDepartmentsService.getAllDepartmentsByCoreId(institution.coreId).then(function (response) {
                    controller.isDisplayDepartmentEnabled = Object.keys(response).length ? true : false;
                });
            }
            controller.toggleColumns(institution.id !== 'undefined' && $scope.selectedInstitutionId === institution.id, forceClose);
        };

        controller.allowProgramDowngrade = function () {
            return !controller.programDowngradeInProgress &&
                $scope.institution && $scope.institution.active &&
                controller.isAdvancedProgram;
        };

        controller.handleProgramDowngradeClick = function (e) {
            if ($scope.isProgramDowngradeDisabled) {
                e.preventDefault();
                return false;
            }
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Yes',
                actionButtonClass: 'danger',
                headerText: 'Program Downgrade',
                bodyText: 'Are you sure you want to downgrade this program?'
            };
            ModalService.show({}, modalOptions).then(function () {
                controller.programDowngradeInProgress = true;
                // make downgrade request
                TmProfileProgramsService.downgrade($scope.institution.coreId).then(controller.programDowngradeCallback);
            });
        };

        /**
         * Actions to do when downgrade request is finished.
         *
         * @param {boolean} success
         */
        controller.programDowngradeCallback = function (success) {
            if (success) {
                // Fake "click" to close info panel
                $scope.handleDatagridRowClick($scope.institution);
                // reload datagrid
                controller.reloadDatagrid();
            }
            controller.programDowngradeInProgress = false;
            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'Downgrade successfully!' : 'Downgrade failed!',
                'Downgrade to Simple'
            );
        };

        /**
         * Set flag for downgrade program profile button
         */
        controller.isProgramDowngradeEnabled = function () {
            $scope.isProgramDowngradeDisabled = ($scope.institution.subscriptions.tm.subscribed &&
                $scope.institution.subscriptions.tm.advanced &&
                $scope.institution.subscriptions.tm.startDate !== null &&
                $scope.institution.subscriptions.tm.endDate !== null &&
                $scope.institution.subscriptions.tm.startDate < TimeService.nowUnix() &&
                $scope.institution.subscriptions.tm.endDate > TimeService.nowUnix()) ||
                controller.isFutureTmSubscription();
        };

        /**
         * Check if Tm subscription is in the future
         *
         * @returns {Boolean}
         */
        controller.isFutureTmSubscription = function () {
            return $scope.institution.subscriptions.tm.subscribed &&
                $scope.institution.subscriptions.tm.startDate !== null &&
                $scope.institution.subscriptions.tm.startDate > TimeService.nowUnix();
        };

        /**
         * Gets tooltip text for downgrade program profile button
         *
         * @returns {String}
         */
        controller.downgradeProgramTooltipText = function () {
            var text = controller.isFutureTmSubscription() ? 'future' : 'current';

            return 'Disabled due to tm ' + text + ' subscription';
        };


        /**
         * Reset user form.
         */
        $scope.handleResetClick = function () {
            $scope.institution = angular.copy($scope.institutionBeforeChanges);
            $scope.noChanges = true;
        };

        /**
         * Allowed to login as institution?
         *
         * @returns {boolean}
         */
        $scope.allowLoginAs = function () {
            return LoginService.allowLoginAs($scope.institution);
        };

        /**
         * Actions to do when login as button clicked.
         *
         * @returns {boolean}
         */
        $scope.handleLoginAsClick = function () {
            LoginService.getTuProfilesRedirect({ coreId: $scope.institution.coreId });
        };

        /**
         * Actions to do when deactivation is triggered.
         *
         * @param {Object} institution
         * @returns {boolean}
         */
        $scope.handleDeactivateClick = function (institution) {
            if (!institution || !institution.id || $scope.deactivateInProgress) {
                return false;
            }
            $scope.deactivateInProgress = true;
            InstitutionsListService.deactivate(institution.id).then(controller.deactivationCallback);
        };

        $scope.handleActivateClick = function (institution) {
            if (!institution.id || $scope.activateInProgress) {
                return false;
            }
            $scope.activateInProgress = true;
            InstitutionsListService.activate(institution.id).then(controller.activationCallback);
        };

        controller.deactivationCallback = function (success) {
            $scope.institution.active = success ? false : true;
            if (success) {
                $scope.institutionBeforeChanges.active = $scope.institution.active;
                controller.reloadDatagrid();
            }
            $scope.deactivateInProgress = false;

            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'Deactivated successfully!' : 'Deactivation failed!',
                'Deactivation'
            );
        };

        controller.activationCallback = function (success) {
            $scope.institution.active = success ? true : false;
            if (success) {
                $scope.institutionBeforeChanges.active = $scope.institution.active;
                controller.reloadDatagrid();
            }
            $scope.activateInProgress = false;

            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'Activated successfully!' : 'Activation failed!',
                'Activation'
            );
        };

        controller.basicDetailsSubmitCallback = function (response) {
            var message = 'Basic Details';
            var success = false;
            if (response) {
                success = !response.error;
                if (!success) {
                    if (response.hasOwnProperty('message') && response.message.length > 0) {
                        message = response.message;
                    }
                } else {
                    if (response.hasOwnProperty('insertedId') && response.insertedId.length > 0) {
                        $scope.institution.id = response.insertedId;
                        $scope.institution.coreId = response.insertedCoreId;
                        $scope.institution.coreIdAsString = response.insertedCoreId.toString();
                        $scope.institution.tuAdvanced = false;
                        $scope.institution.tmAdvanced = false;
                        $scope.institution.active = true;
                        $scope.institution.subscriptions = { all: { subscribed: true } };
                        $scope.activeTab = 1;
                        $scope.disabledInstitutionListTabs.subscriptions = false;
                        $scope.disabledInstitutionListTabs.campuses = false;
                        $scope.disabledInstitutionListTabs.institutionGroups = false;
                        $scope.disabledInstitutionListTabs.drupal = false;
                        controller.newInstitution = true;
                        $scope.noChanges = true;
                        $scope.selectedInstitutionId = $scope.institution.id;
                        message = 'Institution added successfully!';
                    }
                    // update original institution object with changes
                    $scope.institutionBeforeChanges = angular.copy($scope.institution);
                    controller.reloadDatagrid();
                    controller.isClient = InstitutionsListService.isClientDepartment($scope.institution.typeId);
                }
            }
            $scope.basicDetailsSubmitInProgress = false;

            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'Saved successfully!' : 'Saving failed!',
                message
            );
        };

        /**
         * Store basic details data.
         */
        $scope.handleBasicDetailsSubmit = function () {
            controller.resetBasicDetailsForm();
            if ($scope.basicDetailsSubmitInProgress ||
                !$scope.forms.basicDetailsForm ||
                !$scope.forms.basicDetailsForm.$valid
            ) {
                if (!$scope.forms.basicDetailsForm.name.$valid) {
                    controller.isInvalidNewSchoolName = true;
                }
                if (!$scope.forms.basicDetailsForm.typeId.$valid) {
                    controller.isInvalidType = true;
                }
                if (!$scope.forms.basicDetailsForm.countryCode.$valid) {
                    controller.isInvalidCountry = true;
                }
                if (!controller.isInvalidType && !$scope.forms.basicDetailsForm.belongsTo.$valid) {
                    controller.isInvalidBelongsTo = true;
                }
                if (!controller.isInvalidType && typeof $scope.institution.parentName === "undefined") {
                    controller.isInvalidParentInstitution = true;
                }
            }
            if (controller.isInvalidType ||
                controller.isInvalidNewSchoolName ||
                controller.isInvalidCountry ||
                controller.isInvalidBelongsTo ||
                controller.isInvalidParentInstitution
            ) {
                return false;
            }

            $scope.basicDetailsSubmitInProgress = true;
            if ($scope.institution.id) {
                InstitutionsListService.saveBasicDetails($scope.institution).then(
                    controller.basicDetailsSubmitCallback
                );
            } else {
                InstitutionsListService.insertBasicDetails($scope.institution).then(
                    controller.basicDetailsSubmitCallback
                );
            }
        };

        controller.resetBasicDetailsForm = function () {
            controller.isInvalidNewSchoolName = false;
            controller.isInvalidType = false;
            controller.isInvalidCountry = false;
            controller.isInvalidBelongsTo = false;
            controller.isInvalidParentInstitution = false;
        };

        /**
         * Validate Name field on Basic Details tab
         * @param {boolean} flag
         * @return {boolean}
         */
        controller.setIsInvalidNewSchoolName = function (flag) {
            controller.isInvalidNewSchoolName = flag;
        };

        /**
         * Validate field Belongs dropdown on Basic Details tab
         * @param {boolean} value
         * @return {boolean}
         */
        controller.setIsInvalidBelongsTo = function (value) {
            controller.isInvalidBelongsTo = value;
        };


        /**
         * Validate Parent Institution dropdown on Basic Details tab
         * @param {boolean} flag
         * @return {boolean}
         */
        controller.setIsInvalidParentInstitution = function (value) {
            controller.isInvalidParentInstitution = value;
        };

        /**
         * Store drupal related data.
         */
        $scope.handleDrupalSubmit = function () {
            controller.resetDrupalForm();
            if ($scope.drupalSubmitInProgress ||
                !$scope.forms.drupalForm ||
                !$scope.forms.drupalForm.$valid
            ) {
                if ($scope.forms.drupalForm.tuRegion && !$scope.forms.drupalForm.tuRegion.$valid) {
                    controller.isInvalidTuRegion = true;
                }
                if ($scope.forms.drupalForm.tmRegion && !$scope.forms.drupalForm.tmRegion.$valid) {
                    controller.isInvalidTmRegion = true;
                }
            }
            if (controller.isInvalidTuRegion || controller.isInvalidTmRegion) {
                return false;
            }
            //$scope.drupalSubmitInProgress = true;
            InstitutionsListService.saveDrupal($scope.institution).then(function (success) {
                $scope.drupalSubmitInProgress = false;
                $scope.institutionBeforeChanges = angular.copy($scope.institution);
                controller.reloadDatagrid();
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Saved successfully!' : 'Saving failed!',
                    'Drupal'
                );
            });
        };

        /**
         * Reset Drupal from feilds
         * @return {[type]} [description]
         */
        controller.resetDrupalForm = function () {
            controller.isInvalidTuRegion = false;
            controller.isInvalidTmRegion = false;
        };

        /**
         * Validate tuRegion dropdown on Drupal tab
         * @param {boolean} value
         * @return {boolean}
         */
        controller.setIsInvalidTuRegion = function (value) {
            controller.isInvalidTuRegion = value;
        };

        /**
         * Validate tmRegion dropdown on Drupal tab
         * @param {boolean} value
         * @return {boolean}
         */
        controller.setIsInvalidTmRegion = function (value) {
            controller.isInvalidTmRegion = value;
        };

        $scope.disallowGroupsSubmit = function () {
            // submit process is on going
            if ($scope.institutionGroupSubmitInProgress) {
                return true;
            }
            // current group members list is not empty & assigned members already in the list
            if (
                $scope.institutionBeforeChanges.groupMembers &&
                $scope.institution.groupMembers
            ) {
                return angular.equals($scope.institutionBeforeChanges.groupMembers, $scope.institution.groupMembers);
            }
            // current group members list is empty & no members assigned
            if (
                (
                    !$scope.institutionBeforeChanges.groupMembers ||
                    !$scope.institutionBeforeChanges.groupMembers.length
                ) &&
                (
                    !$scope.institution.groupMembers ||
                    !$scope.institution.groupMembers.length
                )
            ) {
                return true;
            }
            return false;
        };

        /**
         * Store basic Group Institutions.
         */
        $scope.handleInstitutionGroupSubmit = function () {
            if (
                $scope.institutionGroupSubmitInProgress ||
                !$scope.forms.basicDetailsForm ||
                !$scope.forms.basicDetailsForm.$valid
            ) {
                return false;
            }
            $scope.institutionGroupSubmitInProgress = true;
            InstitutionsListService.saveInstitutionGroup($scope.institution).then(function (success) {
                $scope.institutionGroupSubmitInProgress = false;
                if (success) {
                    $scope.institutionBeforeChanges.groupMembers = angular.copy($scope.institution.groupMembers);
                    // refresh table, it needs to update the new members as well
                    controller.reloadDatagrid();
                }
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Saved successfully!' : 'Saving failed!',
                    'Group Institutions'
                );
            });
        };

        $scope.searchInstitutionsWithoutGroup = function (searchPhrase) {
            $scope.isSelectReloading = true;
            InstitutionsListService.searchInstitutionsWithoutGroup(
                $scope.institution.coreId, searchPhrase
            ).then(function (results) {
                $scope.isSelectReloading = false;
                $scope.institutionsWithoutGroup = results;
            });
        };

        /**
         * Store Subscriptions data.
         */
        $scope.handleSubscriptionSubmit = function () {
            if (
                $scope.subscriptionProfilesSubmitInProgress ||
                !$scope.forms.subscriptionForm ||
                !$scope.forms.subscriptionForm.$valid
            ) {
                return false;
            }

            $scope.subscriptionProfilesSubmitInProgress = true;
            InstitutionsListService.saveSubscription($scope.institution).then(function (success) {
                $scope.subscriptionProfilesSubmitInProgress = false;
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Saved successfully!' : 'Saving failed!',
                    'Subscriptions'
                );
                $scope.institution.subscriptionsAsArray = [];
                $scope.institution.subscriptionsAsString = '';
                InstitutionsListService.getAllSubscriptions($scope.institution.coreId).then(function (res) {
                    controller.subscriptionDates = res;
                    var max = -Infinity,
                        key;
                    controller.subscriptionDates.forEach(function (v, k) {
                        if (max < +v) {
                            max = +v;
                            key = k;
                        }
                    });
                    InstitutionsListFactory.setInvalidDates(controller.subscriptionDates[key]);
                });

                if (success) {
                    // check if subscription data is in the past or in the future
                    if ($scope.institution.subscriptions) {
                        angular.forEach($scope.institution.subscriptions, function (subscription) {
                            if (subscription.subscribed &&
                                subscription.advanced &&
                                subscription.endDate < TimeService.nowUnix()
                            ) {
                                subscription.advanced = false;
                            }
                            if (subscription.subscribed &&
                                subscription.advanced &&
                                subscription.startDate > TimeService.nowUnix()
                            ) {
                                subscription.advanced = false;
                            }
                        });
                    }
                    InstitutionsListService.appendSubscriptionsData([$scope.institution]);
                    // check if current active institution is same as edited one
                    var currentCoreId = $scope.institution.coreId;
                    if (currentCoreId) {
                        var activeCoreId = InstitutionFactory.getCoreId();
                        if (activeCoreId && currentCoreId === activeCoreId) {
                            InstitutionFactory.setSubscriptions(angular.copy($scope.institution.subscriptions));
                        }
                    }
                    if (controller.isAdvancedProgram) {
                        controller.isProgramDowngradeEnabled();
                    }
                    // re-set institution edit instance
                    $scope.institutionBeforeChanges = angular.copy($scope.institution);
                    controller.reloadDatagrid();

                    InstitutionsListSubscriptionsFactory.setHasSubscriptionsChanges(true);
                }
            });
        };

        $scope.updateCountryName = function () {
            controller.isInvalidCountry = false;
            InstitutionsListService.getCountryNameByCode($scope.institution.countryCode).then(function (countryName) {
                $scope.institution.countryName = countryName;
            });
        };

        controller.defaultPaginationOptions = {
            page: 1,
            limit: 25
        };
        controller.paginationOptions = GridService.getColumnsFilters(
            constants.gridNameSpaces.institutionsGridFilters,
            []
        );
        controller.columnsVisibility = GridService.getColumnsVisibility(
            constants.gridNameSpaces.institutionsGridVisibility
        );

        controller.getPage = function () {
            return InstitutionsListService.getAll(
                angular.merge({}, controller.paginationOptions, controller.defaultPaginationOptions)
            ).then(function (response) {
                if (response && response.length === 0) {
                    return false;
                }
                if (!$scope.gridOptions) {
                    $scope.gridOptions = {};
                }
                // if new institution added, check if we shall add it in result set
                if (controller.newInstitution) {
                    var found = false;
                    // search for institution in display results
                    angular.forEach(response.results, function (institution) {
                        if (angular.equals(institution.id, $scope.institution.id)) {
                            found = true;
                        }
                    });
                    // item was not found, add it into the result set
                    if (!found) {
                        // add new institution to top of the result set
                        response.results.unshift($scope.institution);
                        // if there are more results than a page can display, remove extra elements
                        while (response.results.length > $scope.gridOptions.paginationPageSize) {
                            response.results.pop();
                        }
                        // update total items
                        response.totalMatching = response.results.length;
                    }
                    controller.newInstitution = false;
                }
                $scope.gridOptions.totalItems = response.totalMatching;
                $scope.gridOptions.data = response.results;
                $scope.gridOptions.minRowsToShow = response.totalFiltered.length < 25 ? response.totalFiltered : 25;
            });
        };

        controller.handleGridVisibleChanges = function () {
            var columnsVisibility = GridService.getColumnsVisibility(constants.gridNameSpaces.institutionsGridVisibility),
                reload = false,
                field = '';
            if (columnsVisibility && !$scope.comesFromProfile && $scope.filterActive) {
                angular.forEach($scope.gridOptions.columnDefs, function (column, key) {
                    field = controller.convertVisibleColumnsField(column.field);
                    if (columnsVisibility[field] === true &&
                        column.visible === false
                    ) {
                        $scope.gridOptions.columnDefs[key].filter.term = null;
                        controller.paginationOptions['filter[' + field + ']'] = null;
                        reload = true;
                    }
                });
            }
            if (!$scope.comesFromProfile && $scope.filterActive) {
                controller.saveStateVisibility();
            }
            if (reload) {
                controller.getPage();
            }
        };

        controller.handleGridFiltersChanges = function () {
            if ($scope.gridApi !== null) {
                var sortKeys = [];
                angular.forEach($scope.gridApi.grid.columns, function (column) {
                    if (typeof column.filters !== 'undefined' && column.filters[0].term !== 'undefined') {
                        if (
                            column.filters[0].type === uiGridConstants.filter.SELECT &&
                            typeof column.filters[0].term === 'object' &&
                            column.filters[0].term !== null &&
                            typeof column.filters[0].term.value !== 'undefined'
                        ) {
                            column.filters[0].term = column.filters[0].term.value;
                        }
                    }
                    if (typeof column.sort.priority !== 'undefined') {
                        sortKeys[column.sort.priority] = column.name;
                    }
                });
                if (sortKeys.length > 1) {
                    var latestSortKey = sortKeys.pop();
                    angular.forEach($scope.gridApi.grid.columns, function (column) {
                        if (typeof column.sort.priority !== 'undefined' && column.name !== latestSortKey) {
                            column.sort = {};
                        }
                    });
                }

                controller.paginationOptions = angular.copy(controller.defaultPaginationOptions);
                var filterColumn, sortColumn;
                angular.forEach($scope.gridApi.grid.columns, function (column) {
                    if (typeof column.filters !== 'undefined' && column.filters[0].term !== 'undefined') {
                        filterColumn = column.filters[0].column ? column.filters[0].column : column.field;
                        controller.paginationOptions['filter[' + filterColumn + ']'] = column.filters[0].term;
                    }
                    if (typeof column.sort.direction !== 'undefined') {
                        sortColumn = column.sort.column ? column.sort.column : column.field;
                        controller.paginationOptions['sorting[' + sortColumn + ']'] = column.sort.direction;
                    }
                });
                if (!$scope.comesFromProfile) {
                    GridService.storeColumnsFilters(
                        constants.gridNameSpaces.institutionsGridFilters,
                        controller.paginationOptions
                    );
                }

                if (angular.isDefined($scope.filterTimeout)) {
                    $timeout.cancel($scope.filterTimeout);
                }
                $scope.filterTimeout = $timeout(function () {
                    controller.getPage();
                }, 500);
            }
        };

        /**
         * Allowed to view TU site
         *
         * @returns {boolean}
         */
        controller.allowViewTuSite = function () {
            return $scope.institutionBeforeChanges &&
                $scope.institutionBeforeChanges.subscriptions &&
                $scope.institutionBeforeChanges.subscriptions.tu &&
                $scope.institutionBeforeChanges.subscriptions.tu.subscribed;
        };

        /**
         * Allowed to view TM site
         *
         * @returns {boolean}
         */
        controller.allowViewTmSite = function () {
            return $scope.institutionBeforeChanges &&
                $scope.institutionBeforeChanges.subscriptions &&
                $scope.institutionBeforeChanges.subscriptions.tm &&
                $scope.institutionBeforeChanges.subscriptions.tm.subscribed;
        };

        /**
         * View TU Site enabled?
         *
         * @returns {boolean}
         */
        controller.isViewTuSiteEnabled = function () {
            return angular.isDefined($scope.institutionBeforeChanges) &&
                $scope.institutionBeforeChanges &&
                $scope.institutionBeforeChanges.enabled &&
                (
                    $scope.institutionBeforeChanges.enabled.ug ||
                    $scope.institutionBeforeChanges.enabled.pg
                ) &&
                $scope.institutionBeforeChanges.hasOwnProperty('nids') &&
                $scope.institutionBeforeChanges.nids !== null &&
                $scope.institutionBeforeChanges.nids.hasOwnProperty('master') &&
                $scope.institutionBeforeChanges.nids.master;
        };

        /**
         * Check its client department with active profile subscription.
         * @returns {boolean}
         */
        controller.isClientDepartmentDowngradeDisabled = function () {
            return controller.isClientDepartment($scope.institutionBeforeChanges.typeId) &&
                $scope.institutionBeforeChanges &&
                $scope.institutionBeforeChanges.subscriptions && (
                    ($scope.institutionBeforeChanges.subscriptions.tu && $scope.institutionBeforeChanges.subscriptions.tu.subscribed) ||
                    ($scope.institutionBeforeChanges.subscriptions.tm && $scope.institutionBeforeChanges.subscriptions.tm.subscribed)
                );
        };

        /**
         * View TM Site enabled?
         *
         * @returns {boolean}
         */
        controller.allowViewTmSiteButtonEnabled = function () {
            return InstitutionService.isTmViewingEnabled($scope.institutionBeforeChanges);
        };

        controller.initDataGrid = function () {
            $scope.isDatagridReloading = false;

            $scope.typesList = [];
            InstitutionsListService.getTypeFilterData(true).then(function (results) {
                $scope.typesList = results;
            });

            var rankingsOptions = [];
            angular.forEach(controller.subscriptionsList, function (item) {
                if (InstitutionsListService.isStatisticsSubscription(item.type)) {
                    rankingsOptions.push({
                        value: item.handle,
                        label: item.name
                    });
                }
            });

            // get core id from URL
            controller.activeInstitutionCoreId = $stateParams.coreId;
            if (controller.activeInstitutionCoreId) {
                $scope.comesFromProfile = true;

                var filters = angular.copy(controller.paginationOptions);
                // update data fetch filters
                angular.forEach(filters, function (item, key) {
                    if (key.indexOf('filter') !== -1) {
                        filters[key] = null;
                        controller.paginationOptions[key] = null;
                    }
                });
                GridService.storeColumnsFilters(
                    constants.gridNameSpaces.institutionsGridFilters,
                    filters
                );
                controller.activeInstitutionCoreId = '=' + controller.activeInstitutionCoreId;
                controller.paginationOptions['filter[coreIdAsString]'] = controller.activeInstitutionCoreId;
            }

            $scope.countriesList = [];
            InstitutionsListService.getCountries().then(function (results) {
                controller.countriesList = results;
                angular.forEach(results, function (data) {
                    $scope.countriesList.push({
                        value: data.countryCode,
                        label: data.name
                    });
                });
            });
            var selectTemplate = '/scripts/shared/ui-grid/templates/selectFilterHeaderTemplate.html',
                selectCellTemplate = '/scripts/shared/ui-grid/templates/selectCellTemplate.html';
            controller.getPage().then(function () {
                $scope.gridOptions = angular.extend({}, $scope.gridOptions, {
                    enableSorting: true,
                    exporterMenuCsv: false,
                    enableGridMenu: true,
                    showGridFooter: false,
                    selectedItems: $scope.selectedProgramId,
                    enableFiltering: true,
                    useExternalFiltering: true,
                    enableColumnResize: true,
                    enableFullRowSelection: true,
                    enableRowSelection: true,
                    multiSelect: false,
                    enableRowHeaderSelection: false,
                    paginationPageSizes: [25, 50, 100],
                    paginationPageSize: 25,
                    useExternalPagination: true,
                    useExternalSorting: true,
                    rowTemplate: '/scripts/components/institutions/list/datagrid/rowTemplate.html',
                    columnDefs: [
                        {
                            displayName: 'Name',
                            visible: true, //GridService.getVisibilityByField(controller.columnsVisibility, 'name', true),
                            field: 'name',
                            filter: {
                                term: GridService.getFilterByField(controller.paginationOptions, 'name')
                            }
                        },
                        {
                            displayName: 'Local Name',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'localName', false),
                            field: 'localName',
                            filter: {
                                term: GridService.getFilterByField(controller.paginationOptions, 'localName')
                            }
                        },
                        {
                            displayName: 'Core ID',
                            visible: controller.activeInstitutionCoreId ?
                                true : GridService.getVisibilityByField(controller.columnsVisibility, 'coreId', true),
                            field: 'coreId',
                            maxWidth: 120,
                            filter: {
                                term: controller.activeInstitutionCoreId ?
                                    controller.activeInstitutionCoreId :
                                    GridService.getFilterByField(controller.paginationOptions, 'coreId')
                            }
                        },
                        {
                            displayName: 'Parent Institution Core ID',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'parentCoreId', false),
                            field: 'parentCoreId',
                            maxWidth: 120,
                            filter: {
                                term: GridService.getFilterByField(controller.paginationOptions, 'parentCoreId')
                            }
                        },
                        {
                            displayName: 'Parent Institution Name',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'parentName', false),
                            field: 'parentName',
                            maxWidth: 300,
                            filter: {
                                term: GridService.getFilterByField(controller.paginationOptions, 'parentName')
                            }
                        },
                        {
                            displayName: 'Type',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'typeId', true),
                            field: 'typeId',
                            filter: {
                                column: 'typeId',
                                type: uiGridConstants.filter.SELECT,
                                selectOptions: $scope.typesList,
                                term: GridService.getFilterByField(controller.paginationOptions, 'typeId')
                            },
                            filterHeaderTemplate: selectTemplate,
                            cellTemplate: selectCellTemplate
                        },
                        {
                            displayName: 'Country Name',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'countryCode', true),
                            field: 'countryCode',
                            filter: {
                                column: 'countryCode',
                                type: uiGridConstants.filter.SELECT,
                                selectOptions: $scope.countriesList,
                                searchEnabled: true,
                                term: GridService.getFilterByField(controller.paginationOptions, 'countryCode')
                            },
                            filterHeaderTemplate: selectTemplate,
                            cellTemplate: selectCellTemplate
                        },
                        {
                            displayName: 'Filemaker ID',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'filemakerId', false),
                            field: 'filemakerId',
                            filter: {
                                term: GridService.getFilterByField(controller.paginationOptions, 'filemakerId')
                            }
                        },
                        {
                            displayName: 'Has No Departments',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'hasNoDepartments', false),
                            field: 'hasNoDepartments',
                            filter: {
                                type: uiGridConstants.filter.SELECT,
                                selectOptions: [
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' }
                                ],
                                term: GridService.getFilterByField(controller.paginationOptions, 'hasNoDepartments')
                            },
                            filterHeaderTemplate: selectTemplate,
                            cellTemplate: selectCellTemplate
                        },
                        {
                            displayName: 'Active',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'active', true),
                            field: 'active',
                            filter: {
                                column: 'active',
                                type: uiGridConstants.filter.SELECT,
                                selectOptions: [
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' }
                                ],
                                term: GridService.getFilterByField(controller.paginationOptions, 'active')
                            },
                            maxWidth: 80,
                            filterHeaderTemplate: selectTemplate,
                            cellTemplate: selectCellTemplate
                        },
                        {
                            displayName: 'Advanced TU',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'tuAdvanced', true),
                            field: 'tuAdvanced',
                            filter: {
                                type: uiGridConstants.filter.SELECT,
                                selectOptions: [
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' }
                                ],
                                term: GridService.getFilterByField(controller.paginationOptions, 'tuAdvanced')
                            },
                            enableSorting: false,
                            maxWidth: 120,
                            filterHeaderTemplate: selectTemplate,
                            cellTemplate: selectCellTemplate
                        },
                        {
                            displayName: 'Advanced TM',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'tmAdvanced', true),
                            field: 'tmAdvanced',
                            filter: {
                                type: uiGridConstants.filter.SELECT,
                                selectOptions: [
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' }
                                ],
                                term: GridService.getFilterByField(controller.paginationOptions, 'tmAdvanced')
                            },
                            enableSorting: false,
                            maxWidth: 120,
                            filterHeaderTemplate: selectTemplate,
                            cellTemplate: selectCellTemplate
                        },
                        {
                            displayName: 'Rankings',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'subscriptionsAsString', true),
                            field: 'subscriptionsAsString',
                            enableSorting: false,
                            filter: {
                                type: uiGridConstants.filter.SELECT,
                                selectOptions: rankingsOptions,
                                term: GridService.getFilterByField(controller.paginationOptions, 'subscriptionsAsString')
                            },
                            filterHeaderTemplate: selectTemplate
                        },
                        {
                            displayName: 'UG node ID',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'nids.ug', false),
                            field: 'nids.ug',
                            filter: {
                                term: GridService.getFilterByField(controller.paginationOptions, 'nids.ug')
                            }
                        },
                        {
                            displayName: 'PG node ID',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'nids.pg', false),
                            field: 'nids.pg',
                            filter: {
                                term: GridService.getFilterByField(controller.paginationOptions, 'nids.pg')
                            }
                        },
                        {
                            displayName: 'Overview node ID',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'nids.master', false),
                            field: 'nids.master',
                            filter: {
                                term: GridService.getFilterByField(controller.paginationOptions, 'nids.master')
                            }
                        },
                        {
                            displayName: 'TM node ID',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'nids.tm', false),
                            field: 'nids.tm',
                            filter: {
                                term: GridService.getFilterByField(controller.paginationOptions, 'nids.tm')
                            }
                        },
                        {
                            displayName: 'Has UG',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'enabled.ug', false),
                            field: 'enabledUg',
                            filter: {
                                column: 'enabled.ug',
                                type: uiGridConstants.filter.SELECT,
                                selectOptions: [
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' }
                                ],
                                term: GridService.getFilterByField(controller.paginationOptions, 'enabled.ug')
                            },
                            filterHeaderTemplate: selectTemplate,
                            cellTemplate: selectCellTemplate
                        },
                        {
                            displayName: 'Has PG',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'enabled.pg', false),
                            field: 'enabledPg',
                            filter: {
                                column: 'enabled.pg',
                                type: uiGridConstants.filter.SELECT,
                                selectOptions: [
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' }
                                ],
                                term: GridService.getFilterByField(controller.paginationOptions, 'enabled.pg')
                            },
                            filterHeaderTemplate: selectTemplate,
                            cellTemplate: selectCellTemplate
                        },
                        {
                            displayName: 'Has TM',
                            visible: GridService.getVisibilityByField(controller.columnsVisibility, 'enabled.tm', false),
                            field: 'enabledTm',
                            filter: {
                                column: 'enabled.tm',
                                type: uiGridConstants.filter.SELECT,
                                selectOptions: [
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' }
                                ],
                                term: GridService.getFilterByField(controller.paginationOptions, 'enabled.tm')
                            },
                            filterHeaderTemplate: selectTemplate,
                            cellTemplate: selectCellTemplate
                        }
                    ],
                    onRegisterApi: function (gridApi) {
                        var columnsVisibilityBeforeChanges = angular.copy($scope.gridOptions.columnDefs);
                        $scope.gridApi = gridApi;
                        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                            $scope.handleDatagridRowClick(row.entity);
                        });
                        gridApi.core.on.rowsRendered($scope, function () {
                            $scope.isDatagridRendered = true;
                        });
                        gridApi.pagination.on.paginationChanged($scope, function (newPage, limit) {
                            controller.defaultPaginationOptions.page = newPage;
                            controller.defaultPaginationOptions.limit = limit;
                            controller.getPage();
                        });
                        // actions to do on filters changes
                        $scope.gridApi.core.on.filterChanged($scope, controller.handleGridFiltersChanges);
                        // actions to do on visible columns changes
                        $scope.gridApi.core.on.rowsVisibleChanged($scope, controller.handleGridVisibleChanges);
                        // actions to do on sort order changes
                        $scope.gridApi.core.on.sortChanged($scope, controller.handleGridFiltersChanges);
                        // reset columns visibility
                        GridService.resetExtend(columnsVisibilityBeforeChanges, $scope.gridOptions.columnDefs);
                        if (
                            controller.activeInstitutionCoreId &&
                            $scope.gridOptions.data &&
                            $scope.gridOptions.data.length === 1
                        ) {
                            // activate dit mode
                            $scope.handleDatagridRowClick($scope.gridOptions.data[0]);
                        }
                    }
                });
            });
        };

        /**
         * Disable institution types
         *
         * @param reset
         */
        controller.allowedInstitutionTypes = function (reset) {
            if (angular.isUndefined(reset)) {
                reset = false;
            }
            angular.forEach(controller.typesList, function (item) {
                if ((item.uniqueId !== constants.typeId.clientDepartmentId &&
                    item.uniqueId !== constants.typeId.topLevelInstitutionId) &&
                    !reset
                ) {
                    item.disabled = true;
                } else {
                    item.disabled = false;
                }
            });
        };

        /**
         * Add institution click action.
         */
        controller.handleAddInstitutionClick = function () {
            controller.setSelectedItem();
            controller.similarNames.display = false;
            controller.showDepartments.display = false;
            $scope.forms.basicDetailsForm.$setPristine();
            $scope.forms.basicDetailsForm.$setUntouched();
            $scope.activeTab = 0;
            var institution = {};
            institution.id = null;
            controller.similarNames.display = false;
            controller.similarNames.loading = false;
            controller.similarNames.results = [];
            $scope.handleDatagridRowClick(institution, $scope.selectedInstitutionId === null && $scope.showInfoBlock);
        };


        /**
         * Close sidebar
         */
        controller.handleEditCloseClick = function () {
            var institution = {};
            institution.id = $scope.selectedInstitutionId;
            $scope.handleDatagridRowClick(institution, true);
        };

        /**
         * @param {Object} selectedType
         */
        controller.setSelectedOptionType = function (selectedType) {
            controller.isInvalidType = false;
            if (angular.isDefined(selectedType) && selectedType.hasOwnProperty('uniqueId')) {
                $scope.institution.typeId = selectedType.uniqueId;
            }
        };

        /**
         * Search for similar institution names
         *
         * @param {Object} institution
         */
        controller.findSimilar = function (institution) {
            if (institution.id === null && angular.isDefined(institution.name) && institution.name.length > 0) {
                controller.similarNames.display = true;
                controller.similarNames.loading = true;
                InstitutionsListService.searchInstitutions(institution.name).then(function (results) {
                    controller.similarNames.results = results;
                    controller.similarNames.loading = false;
                });
            } else {
                controller.similarNames.display = false;
                controller.similarNames.loading = false;
                controller.similarNames.results = [];
            }
        };

        /**
         * Remove [coreId] from a string.
         *
         * @param institutionName
         * @returns {*}
         */
        controller.stripInstitutionId = function (institutionName) {
            return institutionName.replace(/\[[0-9]+]/g, '');
        };

        /**
         * Search for institutions (for client department parent institution)
         *
         * @param {Object} searchResult
         */
        controller.handleSearchInstitutionClick = function (selectedSearchResult) {
            $scope.institution.parentName = controller.stripInstitutionId(selectedSearchResult.name);
            $scope.institution.parentCoreId = selectedSearchResult.coreId;
            controller.showDepartments.display = false;
            controller.showDepartments.results = [];
            return true;
        };

        controller.initialiseBelongsTo = function () {
            // get belongs to list
            controller.belongsToList = InstitutionsListService.getBelongsToList();
        };

        controller.isClientDepartment = function (institutionTypeId) {
            return InstitutionsListService.isClientDepartment(institutionTypeId);
        };

        controller.showParentInstitution = function (institutionTypeId) {
            return InstitutionsListService.isClientDepartment(institutionTypeId) ||
                InstitutionsListService.isSimpleDepartment(institutionTypeId) ||
                InstitutionsListService.isAdvancedProgram(institutionTypeId);
        };

        controller.isTopLevelInstitution = function (institutionTypeId) {
            return InstitutionsListService.isTopLevelInstitution(institutionTypeId);
        };

        /**
         * Action to do on search for institution.
         *
         * @param {String} searchPhrase
         */
        $scope.searchInstitutions = function (searchPhrase) {
            $scope.searchInProgress = true;
            InstitutionsListService.searchTopLevelInstitutions(searchPhrase).then(function (results) {
                $scope.parentInstitutionSearchResults = results;
                $scope.searchInProgress = false;
            });
        };

        /**
         * Action to do on search for institution.
         *
         * @param {String} searchPhrase
         */
        $scope.searchTopLevelInstitutions = function (searchPhrase) {
            $scope.searchInProgress = true;
            InstitutionsListService.searchTopLevelInstitutions(searchPhrase).then(function (results) {
                $scope.parentInstitutionSearchResults = results;
                $scope.searchInProgress = false;
            });
        };

        /**
         * Show all departments button click (add institution, client department)
         */
        controller.showDepartments = function () {
            controller.showDepartments.loading = true;
            InstitutionsListService.getDepartments($scope.institution.parentCoreId).then(function (results) {
                controller.showDepartments.results = results;
                controller.showDepartments.loading = false;
                controller.showDepartments.display = true;
            });
        };

        controller.handleDepartmentsListCloseClick = function () {
            controller.showDepartments.display = false;
        };

        controller.handleGetCampusesWatch = function (newCampuses) {
            if ($scope.selectedInstitutionId) {
                $scope.institution.campus = newCampuses;
                $scope.institutionBeforeChanges.campus = newCampuses;
            }
        };

        controller.handleDowngradeClick = function () {
            if (controller.isClientDepartmentDowngradeDisabled()) {
                return false;
            }
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Yes',
                actionButtonClass: 'danger',
                headerText: 'Department Downgrade',
                bodyText: 'Are you sure you want to downgrade this department?',
            };
            ModalService.show({}, modalOptions).then(function () {
                $scope.downgradeInProgress = true;
                // make downgrade request
                TuProfileDepartmentsService.downgrade($scope.institution.id).then(controller.downgradeCallback);
            });
        };

        controller.hasMissingFields = function () {
            var uni = $scope.institutionBeforeChanges;
            if (angular.equals(uni, {})) {
                return;
            }
            if (InstitutionsListService.isSimpleDepartment(uni.typeId)) {
                // check if:
                // + name is valid
                // + parent is assigned
                // + country is valid
                return (!uni.name || !uni.parentCoreId || !uni.countryCode);
            } else if (InstitutionsListService.isAdvancedProgram(uni.typeId)) {
                // check if:
                // + name is valid
                // + parent is assigned
                // + country is valid
                // + TM drupal region is assigned
                return (!uni.name || !uni.parentCoreId || !uni.countryCode || !uni.drupalTmRegionId);
            } else if (InstitutionsListService.isClientDepartment(uni.typeId)) {
                // check if:
                // + name is valid
                // + parent is assigned
                // + country is valid
                // + belongs to is assigned
                // + TU drupal region is assigned
                // + TM drupal region is assigned
                return (!uni.name || !uni.parentCoreId || !uni.countryCode ||
                    !uni.belongsTo || !uni.belongsTo.length ||
                    !uni.drupalTuRegionId ||
                    !uni.drupalTmRegionId);
            } else if (InstitutionsListService.isTopLevelInstitution(uni.typeId)) {
                // check if:
                // + name is valid
                // + country is valid
                // + TU drupal region is assigned
                // + TM drupal region is assigned
                return (!uni.name || !uni.parentCoreId || !uni.countryCode ||
                    !uni.drupalTuRegionId ||
                    !uni.drupalTmRegionId);
            }
        };

        /**
         * Actions to do when downgrade request is finished.
         *
         * @param {boolean} success
         */
        controller.downgradeCallback = function (success) {
            if (success) {
                controller.isClient = false;
                controller.isSimple = true;
                controller.setSelectedItem(constants.typeId.simpleDepartmentId);
                $scope.institution.typeId = constants.typeId.simpleDepartmentId;
                if ($scope.institution.enabled) {
                    $scope.institution.enabled.ug = false;
                    $scope.institution.enabled.pg = false;
                }
                if ($scope.institution.subscriptions && $scope.institution.subscriptions.tu) {
                    delete $scope.institution.subscriptions.tu;
                }
                $scope.institutionBeforeChanges = angular.copy($scope.institution);
                controller.reloadDatagrid();
            }
            $scope.downgradeInProgress = false;
            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'Downgrade successfully!' : 'Downgrade failed!',
                'Downgrade to Simple'
            );
        };

        /**
         * Action to check if upgrade button at simple dipartment is disabled
         * @return {boolean}
         */
        controller.isUpgradeButtonDisabled = function () {
            return !$scope.institutionBeforeChanges.name ||
                !$scope.institutionBeforeChanges.name.length ||
                !$scope.institutionBeforeChanges.typeId ||
                parseInt($scope.institution.typeId, 10) !== constants.typeId.simpleDepartmentId ||
                !$scope.institutionBeforeChanges.countryCode ||
                !$scope.institutionBeforeChanges.countryCode.length;
        };

        /**
         * Actions to do when upgrade button clicked.
         *
         * @returns {boolean}
         */
        controller.handleUpgradeClick = function () {
            if (!$scope.institution || !$scope.institution.id) {
                return false;
            }
            $scope.upgradeInProgress = true;
            TuProfileDepartmentsService.upgrade($scope.institution.id).then(controller.upgradeCallback);
        };

        /**
         * Actions to do when upgrade request is finished.
         *
         * @param {boolean} success
         */
        controller.upgradeCallback = function (success) {
            if (success) {
                controller.isSimple = false;
                controller.isClient = true;
                $scope.institution.typeId = constants.typeId.clientDepartmentId;
                controller.setSelectedItem(constants.typeId.clientDepartmentId);
                $scope.institutionBeforeChanges = angular.copy($scope.institution);

                controller.reloadDatagrid();
            }
            $scope.upgradeInProgress = false;

            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'Upgraded successfully!' : 'Upgrade failed!',
                'Upgrade to Client'
            );
        };

        /**
         * check if active institution is simple dipartment
         * @param  {string} institutionTypeId
         * @return {boolean}
         */
        controller.isSimpleDepartment = function (institutionTypeId) {
            return InstitutionsListService.isSimpleDepartment(institutionTypeId);
        };

        /**
         * Check if it is All statistics handle
         * @param  {string} handle
         * @return {boolean}
         */
        controller.isAllStatistic = function (handle) {
            return InstitutionsListService.isAllStatistic(handle);
        };

        controller.convertVisibleColumnsField = function (value) {
            switch (value) {
                case 'enabledTm':
                    return 'enabled.tm';
                case 'enabledUg':
                    return 'enabled.ug';
                case 'enabledPg':
                    return 'enabled.pg';
                default:
                    return value;
            }
        };

        controller.saveStateVisibility = function () {
            var visibility = angular.copy($scope.gridOptions.columnDefs);
            angular.forEach(visibility, function (column) {
                if ([
                    'enabledTm',
                    'enabledUg',
                    'enabledPg'
                ].indexOf(column.field) !== -1
                ) {
                    column.field = controller.convertVisibleColumnsField(column.field);
                }
            });
            GridService.storeColumnsVisibility(
                constants.gridNameSpaces.institutionsGridVisibility,
                GridService.getGridColumnsVisibility(visibility)
            );
        };

        controller.initWatches = function () {
            // listen to active profile tab changes
            WatchService.create($scope, 'activeTab', function (newValue, oldValue) {
                if (!InstitutionsListFactory.hasSelectedTab() || !angular.equals(newValue, oldValue)) {
                    InstitutionsListFactory.setSelectedTabId(newValue);
                }
            });
            // listen to institution campuses changes
            WatchService.create($scope, InstitutionsListFactory.getCampuses, controller.handleGetCampusesWatch);

            WatchService.create($scope, InstitutionFactory.getActiveTab, function (newValue) {
                if (newValue) {
                    $scope.activeTab = 1;
                }
            });

            WatchService.create($scope, InstitutionsListFactory.isInstitutionListReload, function (value) {
                if (value) {
                    controller.reloadDatagrid();
                    InstitutionsListFactory.setReloadInstitutionList(false);
                }
            });

            var dataLoadWatch = WatchService.create($scope, 'dataToLoad', function (leftToLoad) {
                if (leftToLoad === 0) {
                    dataLoadWatch();
                    controller.initDataGrid();
                }
            });
        };

        controller.loadData = function () {
            $scope.dataToLoad = 4;
            InstitutionsListService.getSubscriptions().then(function (subscriptions) {
                controller.subscriptionsList = subscriptions;
                $scope.dataToLoad--;
            });
            InstitutionsListService.getTypes().then(function (list) {
                controller.typesList = list;
                $scope.dataToLoad--;
            });
            InstitutionsListService.getTuRegions().then(function (list) {
                controller.tuRegionsList = list;
                $scope.dataToLoad--;
            });
            InstitutionsListService.getTmRegions().then(function (list) {
                controller.tmRegionsList = list;
                $scope.dataToLoad--;
            });
        };

        controller.init = function () {
            controller.loadData();
            controller.initWatches();
            controller.initialiseBelongsTo();
        };

        controller.init();
    };

    angular
        .module('qsHub')
        .controller('InstitutionsListController', [
            '$scope',
            '$resource',
            '$stateParams',
            'constants',
            'InstitutionsListService',
            'SharedProfileFactory',
            'NotifierFactory',
            'InstitutionFactory',
            'InstitutionsListFactory',
            'orderByFilter',
            'LoginService',
            'TuProfileDepartmentsService',
            'uiGridConstants',
            '$timeout',
            'WatchService',
            'ModalService',
            'TmProfileProgramsService',
            'InstitutionService',
            'UiGridService',
            'InstitutionsListSubscriptionsFactory',
            'TimeService',
            App.controllers.institutionsList
        ]);

} (window.angular));
