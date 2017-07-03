(function (angular, moment) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.tmProfileProgramForm = function (
        $scope,
        $state,
        constants,
        $uibModal,
        NotifierFactory,
        CampusesService,
        TmProfileFactory,
        InstitutionFactory,
        TmProfileProgramsService,
        UserFactory,
        InstitutionsListService,
        TmProfileService,
        InstitutionsService,
        LoginService,
        ModalService,
        TmProfileProgramValidationService,
        WatchService,
        TmDirectoryService,
        UiSelectService
    ) {
        var controller = this,
            alreadyInitialised = false;

        controller.devMode = constants.dev;
        controller.programDescriptionWordLimit = 200;
        controller.typesList = TmProfileService.getProgramTypesList();
        controller.feesRangesList = TmProfileService.getFeesRangesList();
        controller.monthsList = TmProfileService.getMonthsList();
        controller.accreditationsList = TmProfileService.getAccreditationsList();
        controller.lengthList = TmProfileService.getLengthList();
        controller.percentList = TmProfileService.getPercentList();
        controller.yearList1850 = TmProfileService.getYearList(18, 50);
        controller.yearList020 = TmProfileService.getYearList(0, 20);
        controller.offerScholarshipsList = UiSelectService.getYesNoOptions();
        controller.isNewCampus = false;
        controller.isEditCampus = false;
        controller.campusSubmitInProgress = false;
        controller.programSubmitInProgress = false;
        controller.downgradeInProgress = false;
        controller.upgradeInProgress = false;
        controller.addInProgress = false;
        controller.deleteInProgress = false;
        controller.editInProgress = false;
        controller.forms = {};
        controller.newCampus = {
            autoGenerate: false,
        };
        controller.oldCampus = {};
        controller.newProgram = {};
        controller.program = {};
        controller.oldProgramCampuses = [];
        controller.isBackend = false;
        controller.isReadOnly = false;
        controller.subscription = {};
        controller.institution = null;
        controller.programCampuses = [];
        controller.isDirectory = false;
        controller.submitted = false;
        controller.campusSubmitted = false;
        controller.campusesWithChanges = [];
        controller.campusesFullList = [];
        controller.isSchoolUser = null;
        controller.tmSupportEmail = constants.support.tm;
        $scope.showResubscribeBanner = false;
        $scope.showSubscriptionForm = false;
        $scope.showEdiProgramForm = true;
        $scope.datePickerTm = {
            date: {
                startDate: null,
                endDate: null
            },
            options: {
                ranges: {
                    '6 months from today': [moment(), moment().add(6, 'months')],
                    '12 months from today': [moment(), moment().add(12, 'months')]
                },
                eventHandlers: {
                    'apply.daterangepicker': function (ev) {
                        $scope.handleDateRangePickerApplyClick(ev);
                    },
                },
                opens: 'left',
                alwaysShowCalendars: true
            }
        };

        $scope.handleDateRangePickerApplyClick = function (element) {
            if (!element.model.startDate) {
                element.model.startDate = moment();
            }
            if (!element.model.endDate) {
                element.model.endDate = moment();
            }
            controller.subscription.startDate = element.model.startDate.format('x');
            controller.subscription.endDate = element.model.endDate.format('x');
        };
        $scope.specialisationsList = [];
        controller.programHistory = {};
        controller.isDirectory = false;
        controller.submitted = false;
        controller.campusSubmitted = false;

        controller.isAddMode = function () {
            // @todo replace with factory
            return !!$scope.showProgramAddForm;
        };

        controller.isEditMode = function () {
            // @todo replace with factory
            return !!$scope.showProgramEditForm;
        };

        controller.isValidName = function () {
            return TmProfileProgramValidationService.isValidName(
                controller.isAddMode() ? controller.forms.addProgramDetailsForm : controller.forms.editProgramDetailsForm,
                controller.isAddMode() ? controller.newProgram : controller.program
            );
        };

        controller.isValidType = function () {
            return TmProfileProgramValidationService.isValidType(
                controller.isAddMode() ? controller.forms.addProgramDetailsForm : controller.forms.editProgramDetailsForm,
                controller.isAddMode() ? controller.newProgram : controller.program
            );
        };

        controller.isValidDescription = function () {
            return TmProfileProgramValidationService.isValidDescription(
                controller.isAddMode() ? controller.forms.addProgramDetailsForm : controller.forms.editProgramDetailsForm,
                controller.isAddMode() ? controller.newProgram : controller.program
            );
        };

        controller.isValidCampusAssigned = function () {
            return !controller.submitted || TmProfileProgramValidationService.isValidCampusAssigned(
                controller.isAddMode() ? controller.forms.addProgramDetailsForm : controller.forms.editProgramDetailsForm,
                controller.isAddMode() ? controller.newProgram : controller.program
            );
        };

        controller.isValid = function (isAdvanced) {
            return TmProfileProgramValidationService.isValid(
                controller.isAddMode() ? controller.forms.addProgramDetailsForm : controller.forms.editProgramDetailsForm,
                controller.isAddMode() ? controller.forms.addProgramStatsForm : controller.forms.editProgramStatsForm,
                controller.isAddMode() ? controller.newProgram : controller.program,
                isAdvanced
            );
        };

        controller.isValidStats = function () {
            return TmProfileProgramValidationService.isValidStats(
                controller.isAddMode() ? controller.forms.addProgramStatsForm : controller.forms.editProgramStatsForm,
                controller.isAddMode() ? controller.newProgram : controller.program
            );
        };

        controller.isValidDetails = function () {
            return TmProfileProgramValidationService.isValidDetails(
                controller.isAddMode() ? controller.forms.addProgramDetailsForm : controller.forms.editProgramDetailsForm,
                controller.isAddMode() ? controller.newProgram : controller.program
            );
        };

        controller.isValidAddCampus = function () {
            return TmProfileProgramValidationService.isValidCampus(
                controller.forms.addCampusForm,
                controller.newCampus
            );
        };

        controller.isValidEditCampus = function () {
            return TmProfileProgramValidationService.isValidCampus(
                controller.forms.editCampusForm,
                controller.oldCampus
            );
        };

        controller.isValidAverageGmat = function () {
            return TmProfileProgramValidationService.isValidAverageGmat(
                controller.isAddMode() ? controller.forms.addProgramStatsForm : controller.forms.editProgramStatsForm,
                controller.isAddMode() ? controller.newProgram : controller.program
            );
        };

        controller.isValidClassSize = function () {
            return TmProfileProgramValidationService.isValidClassSize(
                controller.isAddMode() ? controller.forms.addProgramStatsForm : controller.forms.editProgramStatsForm,
                controller.isAddMode() ? controller.newProgram : controller.program
            );
        };

        controller.isValidAverageSalaryAfterGraduation = function () {
            return TmProfileProgramValidationService.isValidAverageSalaryAfterGraduation(
                controller.isAddMode() ? controller.forms.addProgramStatsForm : controller.forms.editProgramStatsForm,
                controller.isAddMode() ? controller.newProgram : controller.program
            );
        };

        controller.isValidCampusName = function () {
            return TmProfileProgramValidationService.isValidCampusName(
                controller.isEditCampus ? controller.forms.editCampusForm : controller.forms.addCampusForm,
                controller.isEditCampus ? controller.oldCampus : controller.newCampus
            );
        };

        controller.isValidCampusCountry = function () {
            return TmProfileProgramValidationService.isValidCampusCountry(
                controller.isEditCampus ? controller.forms.editCampusForm : controller.forms.addCampusForm,
                controller.isEditCampus ? controller.oldCampus : controller.newCampus
            );
        };

        controller.isValidCampusAddressLine1 = function () {
            return TmProfileProgramValidationService.isValidCampusAddressLine1(
                controller.isEditCampus ? controller.forms.editCampusForm : controller.forms.addCampusForm,
                controller.isEditCampus ? controller.oldCampus : controller.newCampus
            );
        };

        controller.isValidCampusCity = function () {
            return TmProfileProgramValidationService.isValidCampusCity(
                controller.isEditCampus ? controller.forms.editCampusForm : controller.forms.addCampusForm,
                controller.isEditCampus ? controller.oldCampus : controller.newCampus
            );
        };

        controller.setValid = function (fieldName, stats, campus) {
            controller.submitted = null;
            if (campus) {
                controller.campusSubmitted = null;
            }
            if (controller.isAddMode()) {
                if (fieldName) {
                    if (stats) {
                        controller.forms.addProgramStatsForm[fieldName].$setPristine();
                    } else if (campus) {
                        if (controller.isEditCampus) {
                            controller.forms.editCampusForm[fieldName].$setPristine();
                        } else {
                            controller.forms.addCampusForm[fieldName].$setPristine();
                        }
                    } else {
                        controller.forms.addProgramDetailsForm[fieldName].$setPristine();
                    }
                } else {
                    if (controller.forms.addProgramDetailsForm) {
                        controller.forms.addProgramDetailsForm.$setPristine();
                    }
                    if (controller.forms.addProgramStatsForm) {
                        controller.forms.addProgramStatsForm.$setPristine();
                    }
                }
            } else {
                if (fieldName) {
                    if (stats) {
                        controller.forms.editProgramStatsForm[fieldName].$setPristine();
                    } else if (campus) {
                        if (controller.isEditCampus) {
                            controller.forms.editCampusForm[fieldName].$setPristine();
                        } else {
                            controller.forms.addCampusForm[fieldName].$setPristine();
                        }
                    } else {
                        controller.forms.editProgramDetailsForm[fieldName].$setPristine();
                    }
                } else {
                    if (controller.forms.editProgramStatsForm) {
                        controller.forms.editProgramDetailsForm.$setPristine();
                    }
                    if (controller.forms.editProgramStatsForm) {
                        controller.forms.editProgramStatsForm.$setPristine();
                    }
                }
            }
        };

        /**
         * Actions to do when add campus button is clicked.
         */
        controller.handleAddCampusClick = function () {
            // toggle new campus status
            controller.isNewCampus = !controller.isNewCampus;
            controller.isEditCampus = false;
            // reset new campus
            controller.newCampus = {
                displayInFrontEnd: true
            };
            // reset forms validation
            if (controller.forms.addCampusForm) {
                controller.forms.addCampusForm.$setPristine();
                controller.forms.addCampusForm.name.$setPristine();
                controller.forms.addCampusForm.country.$setPristine();
                controller.forms.addCampusForm.addressLine1.$setPristine();
                controller.forms.addCampusForm.city.$setPristine();
            }
        };

        /**
         * Actions to do when cancel button is clicked in edit campus form.
         */
        controller.handleCancelCampusClick = function () {
            // toggle edit campus form
            controller.isEditCampus = !controller.isEditCampus;
        };

        /**
         * Actions to do when new campus is submitted.
         *
         * @returns {boolean}
         */
        controller.handleNewCampusSubmit = function () {
            controller.campusSubmitted = true;
            controller.forms.addCampusForm.$setDirty();
            controller.forms.addCampusForm.name.$setDirty();
            controller.forms.addCampusForm.country.$setDirty();
            controller.forms.addCampusForm.addressLine1.$setDirty();
            controller.forms.addCampusForm.city.$setDirty();

            // validate campus data
            if (controller.campusSubmitInProgress ||
                !controller.forms.addCampusForm ||
                !controller.isValidAddCampus()
            ) {
                return false;
            }
            controller.campusSubmitInProgress = true;

            controller.newCampus.id = TmProfileProgramsService.getTmpCampusId();
            if (controller.newCampus.primary || !controller.program.primaryCampusId) {
                // mark campus as primary
                controller.program.primaryCampusId = controller.newCampus.id;
                // mark all other programs as not primary
                angular.forEach(controller.programCampuses, function (campus) {
                    campus.primary = false;
                });
            }
            if (!controller.program.campus) {
                controller.program.campus = [];
            }
            // assign new program to program
            if (controller.isAddMode()) {
                controller.newProgram.campus.push(controller.newCampus.id);
            } else {
                controller.program.campus.push(controller.newCampus.id);
            }
            // store new campus in program campuses list
            controller.programCampuses.push(controller.newCampus);
            // add new campus to campuses list
            controller.campusesList.push({
                value: controller.newCampus.id,
                label: controller.newCampus.name
            });
            // close add campus form
            controller.handleAddCampusClick();

            controller.campusSubmitInProgress = false;
        };

        /**
         * Actions to do when campus is updated.
         *
         * @returns {boolean}
         */
        controller.handleUpdateCampus = function () {
            controller.campusSubmitted = true;
            controller.forms.editCampusForm.$setDirty();
            controller.forms.editCampusForm.name.$setDirty();
            controller.forms.editCampusForm.country.$setDirty();
            controller.forms.editCampusForm.addressLine1.$setDirty();
            controller.forms.editCampusForm.city.$setDirty();

            // validate campus data
            if (controller.campusSubmitInProgress ||
                !controller.forms.editCampusForm ||
                !controller.isValidEditCampus()
            ) {
                return false;
            }
            controller.campusSubmitInProgress = true;
            if (controller.oldCampus.primary) {
                controller.program.primaryCampusId = controller.oldCampus.id;
            }
            var i = 0, total = controller.programCampuses.length;
            for (i; i < total; i++) {
                if (controller.programCampuses[i].id === controller.oldCampus.id) {
                    controller.programCampuses[i] = angular.copy(controller.oldCampus);
                    break;
                }
            }
            i = 0;
            total = controller.campusesList.length;
            for (i; i < total; i++) {
                if (controller.campusesList[i].value === controller.oldCampus.id) {
                    controller.campusesList[i] = {
                        value: controller.oldCampus.id,
                        label: controller.oldCampus.name
                    };
                    break;
                }
            }
            // close add campus form
            controller.handleCancelCampusClick();
            controller.campusSubmitInProgress = false;
        };

        /**
         * Is campus form visible?
         *
         * @returns {boolean|*}
         */
        controller.isCampusFormVisible = function () {
            return controller.isNewCampus;
        };

        /**
         * Is edit campus form visible?
         *
         * @returns {boolean|*}
         */
        controller.isEditCampusFormVisible = function () {
            return controller.isEditCampus;
        };

        controller.showStatistics = function () {
            return !controller.isValidStats() && controller.submitted;
        };

        controller.showDetails = function () {
            return !controller.isValidDetails() && controller.submitted;
        };

        controller.showCampus = function () {
            return !controller.isValidCampusAssigned() && controller.submitted;
        };

        /**
         * Actions to do when new program create button is clicked.
         *
         * @returns {boolean}
         */
        controller.handleProgramCreateClick = function () {
            controller.submitted = true;
            controller.forms.addProgramDetailsForm.$setDirty();
            controller.forms.addProgramDetailsForm.name.$setDirty();
            controller.forms.addProgramDetailsForm.type.$setDirty();
            controller.forms.addProgramDetailsForm.description.$setDirty();
            controller.forms.addProgramStatsForm.$setDirty();
            controller.forms.addProgramStatsForm.avgGmat.$setDirty();
            controller.forms.addProgramStatsForm.classSize.$setDirty();
            controller.forms.addProgramStatsForm.avgSalaryAfterGraduation.$setDirty();

            // validate program data
            if (controller.programSubmitInProgress ||
                !controller.forms.addProgramDetailsForm ||
                !controller.forms.addProgramStatsForm ||
                !controller.isValid()
            ) {
                return false;
            }
            controller.programSubmitInProgress = true;
            controller.newProgram.parentInstitutionCoreId = InstitutionFactory.getCoreId();
            controller.newProgram.primaryCampusId = controller.program.primaryCampusId;

            // create new program
            TmProfileProgramsService.create(controller.newProgram).then(controller.createCallback);
        };

        /**
         * Actions to do when create request is finished.
         *
         * @param {Object} response
         */
        controller.createCallback = function (response) {
            if (response && response.insertedId) {
                controller.totalProcessedCampuses = 0;
                controller.createdProgram = angular.copy(controller.newProgram);
                var institutionId = controller.institutionId || InstitutionFactory.getId(),
                    hasTmp = false,
                    campusData,
                    campusId,
                    newCampusId,
                    isTmp;
                controller.createdProgram.id = response.insertedId;
                // create/update campuses
                angular.forEach(controller.programCampuses, function (campus) {
                    campusData = angular.copy(campus);
                    campusId = angular.copy(campus.id);
                    isTmp = TmProfileProgramsService.isTmpCampusId(campusId);
                    if (isTmp) {
                        hasTmp = true;
                        delete campusData.id;
                        campusData.primary = false;
                    }
                    if (isTmp || controller.campusesWithChanges.indexOf(campusId) !== -1) {
                        InstitutionsListService.saveCampus(institutionId, campusData).then(function (response) {
                            controller.totalProcessedCampuses++;
                            if (isTmp) {
                                newCampusId = response.insertedId;

                                // delete temporary ID
                                delete controller.createdProgram.campus[
                                    controller.createdProgram.campus.indexOf(campusId)
                                ];
                                // assign new real campus ID
                                controller.createdProgram.campus.push(newCampusId);
                                if (controller.createdProgram.primaryCampusId === campusId) {
                                    controller.createdProgram.primaryCampusId = newCampusId;
                                }

                                angular.forEach(controller.campusesList, function (item) {
                                    if (item.value === campus.id) {
                                        item.value = newCampusId;
                                    }
                                });
                                campus.id = newCampusId;
                                TmProfileService.clearCache();
                                InstitutionFactory.addCampus(campus);
                            }
                            // if all program campuses were updated/created
                            if (controller.programCampuses.length === controller.totalProcessedCampuses) {
                                // filter out empty campuses
                                controller.createdProgram.campus = controller.createdProgram.campus.filter(function (item) {
                                    return item !== null;
                                });
                                // update program
                                controller.createdProgram.skipStatus = true;
                                TmProfileProgramsService.update(controller.createdProgram).then(controller.newProgramUpdateCallback);
                            }
                        });
                    } else {
                        controller.totalProcessedCampuses++;
                    }
                });
                if (!hasTmp && !controller.campusesWithChanges.length) {
                    controller.newProgramUpdateCallback(true);
                    // update program
                    //TmProfileProgramsService.update(controller.createdProgram).then(controller.newProgramUpdateCallback);
                }
            } else {
                controller.newProgramUpdateCallback(false);
            }
        };

        controller.newProgramUpdateCallback = function (success) {
            controller.programSubmitInProgress = false;
            controller.setValid();
            // show notification about program submit status
            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? (UserFactory.isClient() ? 'Request sent' : 'Created successfully!') : 'Saving failed!',
                'New Program'
            );
            if (success) {
                // reset add form fields
                controller.initForms();
                // announce that new program was added
                TmProfileFactory.announceNewProgram(controller.createdProgram.id);
                TmProfileFactory.setProgramEditFormVisibility(true);
                // set new program as active
                TmProfileFactory.setProgram(controller.createdProgram);
            }
        };

        /**
         * Actions to do when program update button is clicked.
         *
         * @returns {boolean}
         */
        controller.handleProgramEditClick = function () {
            controller.submitted = true;
            controller.forms.editProgramDetailsForm.$setDirty();
            controller.forms.editProgramDetailsForm.name.$setDirty();
            controller.forms.editProgramDetailsForm.description.$setDirty();
            controller.forms.editProgramStatsForm.$setDirty();
            controller.forms.editProgramStatsForm.avgGmat.$setDirty();
            controller.forms.editProgramStatsForm.classSize.$setDirty();
            controller.forms.editProgramStatsForm.avgSalaryAfterGraduation.$setDirty();

            // validate program data
            if (controller.editInProgress ||
                !controller.forms.editProgramDetailsForm ||
                !controller.forms.editProgramStatsForm ||
                !controller.isValid()
            ) {
                return false;
            }
            controller.editInProgress = true;
            controller.totalProcessedCampuses = 0;
            var institutionId = controller.institutionId || InstitutionFactory.getId(),
                hasTmp = false;
            angular.forEach(controller.programCampuses, function (campus) {
                var campusData = angular.copy(campus),
                    isTmp = TmProfileProgramsService.isTmpCampusId(campus.id);
                if (isTmp) {
                    hasTmp = true;
                    delete campusData.id;
                    campusData.primary = false;
                }
                if (isTmp || controller.campusesWithChanges.indexOf(campus.id) !== -1) {
                    InstitutionsListService.saveCampus(institutionId, campusData).then(function (response) {
                        controller.totalProcessedCampuses++;
                        if (TmProfileProgramsService.isTmpCampusId(campus.id)) {
                            // delete temporary ID
                            delete controller.program.campus[controller.program.campus.indexOf(campus.id)];
                            // assign real new campus ID
                            controller.program.campus.push(response.insertedId);
                            if (controller.program.primaryCampusId === campus.id) {
                                controller.program.primaryCampusId = response.insertedId;
                            }
                        }
                        // if all program campuses were updated/created
                        if (controller.programCampuses.length === controller.totalProcessedCampuses) {
                            // filter out empty campuses
                            controller.program.campus = controller.program.campus.filter(function (item) {
                                return item !== null;
                            });
                            // update program
                            TmProfileProgramsService.update(controller.program).then(controller.updateCallback);
                        }
                    });
                } else {
                    controller.totalProcessedCampuses++;
                }
            });
            if (!hasTmp && !controller.campusesWithChanges.length) {
                // update program
                TmProfileProgramsService.update(controller.program).then(controller.updateCallback);
            }
        };

        /**
         * Actions to do when update request is finished.
         *
         * @param {Object} response
         */
        controller.updateCallback = function (response) {
            // show notification about program submit status
            NotifierFactory.show(
                response ? 'success' : 'error',
                response ? (UserFactory.isClient() ? 'Request sent successfully!' : 'Approved successfully!') : 'Update failed!',
                'Edit Program'
            );

            if (response) {
                // close edit mode
                TmProfileFactory.setProgramEditFormVisibility(false);
                // reload datagrid or update program in it
                TmProfileFactory.announceProgramUpdate(controller.program.id);
            }
            controller.editInProgress = false;
        };

        controller.handleDeleteClick = function () {
            if (UserFactory.isClient()) {
                TmProfileFactory.setDeleteFormVisibility();
            } else {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Delete',
                    actionButtonClass: 'danger',
                    headerText: 'Program Deletion',
                    bodyText: 'Are you sure you wish to delete "' + controller.program.name + '" program?',
                };
                ModalService.show({}, modalOptions).then(function () {
                    controller.deleteInProgress = true;
                    TmProfileProgramsService.delete(controller.program.id).then(controller.deleteCallback);
                });
            }
        };

        controller.deleteCallback = function (response) {
            controller.deleteInProgress = false;

            // show notification about program submit status
            NotifierFactory.show(
                response ? 'success' : 'error',
                response ? 'Deleted successfully!' : 'Delete failed!',
                'Delete Program'
            );

            if (response) {
                // close edit mode
                TmProfileFactory.setProgramEditFormVisibility(false);
                // reload datagrid or remove program in it
                TmProfileFactory.announceProgramDeletion(controller.program.id);
            }
        };

        /**
         * Actions to do when add program is clicked.
         */
        controller.closeAddProgramForm = function () {
            TmProfileFactory.setProgramAddFormVisibility(false);
        };

        /**
         * Actions to do when edit program is clicked.
         */
        controller.closeEditProgramForm = function () {
            TmProfileFactory.setProgramEditFormVisibility(false);
            $scope.showEdiProgramForm = true;
            $scope.showSubscriptionForm = false;
            TmProfileFactory.setProgram({});
            controller.subscription.startDate = null;
            controller.subscription.endDate = null;
        };

        /**
         * Actions to do when edit program is clicked.
         */
        controller.closeSubscribeProgramForm = function () {
            TmProfileFactory.setProgramEditFormVisibility(true);
            $scope.showSubscriptionForm = false;
            $scope.showEdiProgramForm = true;
            controller.subscription.startDate = null;
            controller.subscription.endDate = null;
        };

        controller.allowUpgrade = function () {
            return !controller.program.advanced && !controller.isReadOnly;
        };

        controller.allowDowngrade = function () {
            return !UserFactory.isClient() && controller.program.advanced;
        };

        controller.allowDelete = function () {
            return !controller.program.advanced && (
                (UserFactory.isClient() && !controller.isReadOnly) || !UserFactory.isClient()
            );
        };

        controller.allowUpdate = function () {
            return !controller.isReadOnly;
        };

        controller.allowLoginAs = function () {
            return controller.program.advanced;
        };

        controller.isAllowedToLogin = function () {
            return (UserFactory.isClient() &&
                UserFactory.isAllowedToLogin(controller.program.institutionCoreId)) ||
                !UserFactory.isClient();
        };

        controller.handleLoginAsClick = function () {
            LoginService.getTuProfilesRedirect({ coreId: controller.program.institutionCoreId });
            controller.closeEditProgramForm();
        };

        controller.isUndefined = function (value) {
            return (typeof value === 'undefined');
        };

        controller.getEditTitle = function () {
            return UserFactory.isClient() ?
                (controller.program.advanced ? 'Request to Edit Advanced Program' : 'Request to Edit Basic Program') :
                (controller.program.advanced ? 'Edit Advanced Program' : 'Edit Basic Program');
        };

        controller.getSubscriptionTitle = function () {
            return UserFactory.isClient() ?
                (controller.program.advanced ? 'Request to Edit Advanced Program' : 'Request to Edit Basic Program') :
                (controller.program.advanced ? 'Edit Advanced Program' : 'Upgrade to Advanced Program');
        };

        controller.getEditButtonTitle = function () {
            return UserFactory.isClient() ? 'Send' : 'Update';
        };

        controller.getDeleteButtonTitle = function () {
            return UserFactory.isClient() ?
                (controller.program.advanced ? 'Request to Delete Advanced Program' : 'Request to Delete Basic Program') : 'Delete';
        };

        controller.getUpgradeButtonTitle = function () {
            return UserFactory.isClient() ? 'Request to Upgrade to Advanced Program' : 'Upgrade to Advanced Program';
        };

        controller.getAllSubscriptionsCallback = function (tmSubscription) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                headerText: 'Current Subscription(s)',
                institutionCoreId: controller.program.institutionCoreId,
                tmSubscription: tmSubscription,
                showContent: function () {
                    return !!(tmSubscription &&
                        tmSubscription.startDate &&
                        tmSubscription.advanced &&
                        tmSubscription.subscribed);
                },
                completeDowngradeClick: function () {
                    this.close();
                    if (
                        modalOptions.tmSubscription &&
                        modalOptions.tmSubscription.startDate &&
                        modalOptions.tmSubscription.advanced &&
                        modalOptions.tmSubscription.subscribed
                    ) {
                        $state.go('staff.institutions.list', { coreId: controller.program.institutionCoreId });
                    } else {
                        TmProfileProgramsService.downgrade(controller.program.id).then(controller.downgradeCallback);
                    }
                }
            }, modalDefaults = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: '/scripts/components/profiles/tm/programs/modalDowngradeProgramView.html'
            };
            ModalService.show(modalDefaults, modalOptions);
            controller.downgradeInProgress = false;
        };

        controller.handleDowngradeClick = function () {
            // disable downgrade button while loading subscriptions
            controller.downgradeInProgress = true;
            // load program subscriptions
            InstitutionsListService.getTmSubscriptions(controller.program.institutionCoreId).then(controller.getAllSubscriptionsCallback);
        };

        controller.downgradeCallback = function (success) {
            controller.downgradeInProgress = false;
            TmProfileService.getCampusesKeyValuePairs(
                false,
                InstitutionFactory.getCoreId()
            ).then(function (campusesList) {
                controller.campusesList = campusesList;
            }).then(function () {
                // get campuses full details
                TmProfileService.getCampuses(
                    false,
                    InstitutionFactory.getCoreId()
                ).then(function (campuses) {
                    controller.campusesFullList = campuses;
                    controller.programCampuses = [];
                    if (controller.program.campus && controller.campusesList) {
                        var total = campuses.length,
                            i;
                        angular.forEach(controller.program.campus, function (campusId) {
                            i = 0;
                            for (i; i < total; i++) {
                                if (campusId === campuses[i].id) {
                                    controller.programCampuses.push(campuses[i]);
                                    break;
                                }
                            }
                        });
                    }
                });
            }).then(function () {
                // reload data grid
                TmProfileFactory.requestProgramsDatagridReload();
            }).then(function () {
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Downgraded successfully!' : 'Downgrade failed!',
                    'Advanced Program'
                );
            });
        };

        controller.handleUpgradeClick = function () {
            if (UserFactory.isClient()) {
                TmProfileFactory.setProgramUpgradeFormVisibility(true);
            } else {
                TmProfileFactory.setProgramSubscribeFormVisibility(true);
            }
        };

        /**
         * Actions to do when save button is clicked in subscription panel.
         */
        controller.handleUpgradeSubmit = function () {
            TmProfileProgramsService.upgrade(
                controller.program.id,
                null,
                controller.subscription.startDate,
                controller.subscription.endDate
            ).then(controller.upgradeCallback);
        };

        controller.upgradeCallback = function (success) {
            controller.upgradeInProgress = false;
            // show edit mode
            TmProfileFactory.setProgramSubscribeFormVisibility(false);
            // mark program as advanced for QS users
            if (success) {
                TmProfileFactory.setReadOnly(true);
                controller.program.advanced = true;
                if (!isNaN(success)) {
                    controller.program.institutionCoreId = success;
                }
                TmProfileFactory.setProgram(controller.program);
                TmProfileFactory.setUpgradeSubscription(true);
                // reload datagrid
                TmProfileFactory.requestProgramsDatagridReload();
            }
            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'Upgraded successfully!' : 'Upgrade failed!',
                'Basic Program'
            );
        };

        /**
         * Handle campus edit click.
         *
         * @param {Number} id
         * @returns {boolean}
         */
        controller.editCampus = function (id) {
            if (typeof id === 'undefined' || !controller.programCampuses.length || !controller.programCampuses[id]) {
                return false;
            }
            controller.oldProgramCampuses = angular.copy(controller.programCampuses);
            controller.oldCampus = controller.oldProgramCampuses[id];
            controller.oldCampus.primary = controller.oldCampus.id === controller.program.primaryCampusId;
            controller.isEditCampus = true;
            controller.isNewCampus = false;
            controller.campusesWithChanges.push(controller.programCampuses[id].id);
        };

        controller.isProgramSubmitDisabled = function () {
            return controller.isEditCampus ||
                controller.isNewCampus ||
                controller.editInProgress ||
                controller.addInProgress;
        };

        controller.getCampusById = function (campusId) {
            var total = controller.campusesFullList.length,
                i = 0;
            for (i; i < total; i++) {
                if (campusId === controller.campusesFullList[i].id) {
                    return controller.campusesFullList[i];
                }
            }
        };

        controller.clearTmpCampuses = function (campusId) {
            angular.forEach(controller.campusesList, function (campus, key) {
                if (TmProfileProgramsService.isTmpCampusId(campus.value)) {
                    if (campusId) {
                        if (campusId === campus.value) {
                            controller.campusesList[key] = null;
                        }
                    } else {
                        controller.campusesList[key] = null;
                    }
                }
            });
            if (controller.campusesList) {
                controller.campusesList = controller.campusesList.filter(function (item) {
                    return !!item;
                });
            }
        };

        controller.resetCampusList = function (campusId) {
            var campusObject;
            angular.forEach(controller.campusesList, function (campus) {
                if (campusId) {
                    if (campusId === campus.value) {
                        campusObject = controller.getCampusById(campus.value);
                        campus.label = campusObject.name;
                    }
                } else {
                    campusObject = controller.getCampusById(campus.value);
                    campus.label = campusObject.name;
                }
            });
        };

        controller.newProgramCampusWatch = function (selectedCampusesIds) {
            if (controller.isAddMode()) {
                controller.programCampusWatch(selectedCampusesIds);
            }
        };

        controller.existingProgramCampusWatch = function (selectedCampusesIds) {
            if (controller.isEditMode()) {
                controller.programCampusWatch(selectedCampusesIds);
            }
        };

        controller.programCampusWatch = function (selectedCampusesIds) {
            var existingIds = [],
                index,
                campus;
            if (selectedCampusesIds && selectedCampusesIds.length) {
                // walk threw already assigned campuses
                angular.forEach(controller.programCampuses, function (campus, index) {
                    // if its in the submitted list
                    if (selectedCampusesIds.indexOf(campus.id) !== -1) {
                        existingIds.push(campus.id);
                    } else {
                        if (controller.program.primaryCampusId === controller.programCampuses[index].id) {
                            controller.program.primaryCampusId = null;
                        }
                        controller.programCampuses[index] = null;
                        controller.clearTmpCampuses(campus.id);
                        if (!TmProfileProgramsService.isTmpCampusId(campus.id)) {
                            controller.resetCampusList(campus.id);
                        }
                    }
                });
                controller.programCampuses = controller.programCampuses.filter(function (item) {
                    return !!item;
                });

                // walk threw selected campuses ids
                angular.forEach(selectedCampusesIds, function (campusId) {
                    index = existingIds.indexOf(campusId);
                    campus = controller.getCampusById(campusId);
                    // if campus is not already assigned
                    if (campus && index === -1) {
                        controller.programCampuses.push(campus);
                    }
                });
                // remove deleted campuses
                controller.programCampuses = controller.programCampuses.filter(function (item) {
                    return !!item;
                });

                var totalAssignedCampuses = controller.programCampuses.length;
                // if assigned cmapuses list is not empty & no promary campus
                if (totalAssignedCampuses && !controller.program.primaryCampusId) {
                    // mark last campus as primary
                    controller.program.primaryCampusId = controller.programCampuses[totalAssignedCampuses - 1].id;
                }
            } else {
                // clear program campuses list
                controller.programCampuses = [];
                controller.program.primaryCampusId = null;
                controller.clearTmpCampuses();
                controller.resetCampusList();
            }
            controller.isEditCampus = false;
        };

        controller.programHistoryCallback = function (data) {
            if (!angular.equals('{}', data)) {
                controller.programHistory = data;
                // make arrays comma separated string
                angular.forEach(controller.programHistory, function (item, key) {
                    if (angular.isArray(item)) {
                        if (key === 'specialisations') {
                            var humanReadable = [];
                            angular.forEach(item, function (itemValue) {
                                angular.forEach(controller.specialisationsList, function (specListItem) {
                                    if (angular.equals(specListItem.handle, itemValue)) {
                                        humanReadable.push(specListItem.name);
                                    }
                                });
                            });
                            if (item.length === 0) {
                                humanReadable.push('No previous value');
                            }
                            controller.programHistory[key] = humanReadable.join(', ');
                        } else {
                            controller.programHistory[key] = item.join(', ');
                            if (item.length === 0) {
                                controller.programHistory[key] = 'No previous value';
                            }
                        }
                    }
                    if (angular.isObject(item)) {
                        angular.forEach(item, function (subItem, subKey) {
                            if (angular.isArray(subItem)) {
                                controller.programHistory[key][subKey] = subItem.join(', ');
                                if (subItem.length === 0) {
                                    controller.programHistory[key][subKey] = 'No previous value';
                                }
                            } else if (angular.isString(subItem) && subItem.length === 0) {
                                controller.programHistory[key][subKey] = 'No previous value';
                            }
                        });
                    }
                    // transform shorthands to human readable format
                    if (key === 'type') {
                        angular.forEach(controller.typesList, function (typeListItem) {
                            if (angular.equals(typeListItem.value, item)) {
                                controller.programHistory[key] = typeListItem.label;
                            }
                        });
                    }
                });
            }
        };

        controller.loadProgramCampuses = function () {
            // get institution campuses id & name pairs
            TmProfileService.getCampusesKeyValuePairs(
                controller.isDirectory || controller.programInstitutionCoreId === InstitutionFactory.getCoreId(),
                controller.programInstitutionCoreId
            ).then(function (campusesList) {
                controller.campusesList = campusesList;
                var exists;
                angular.forEach(controller.program.campus, function (assignedCampus, key) {
                    exists = false;
                    angular.forEach(controller.campusesList, function (availableCampus) {
                        if (availableCampus.value === assignedCampus) {
                            exists = true;
                        }
                    });
                    if (!exists) {
                        delete controller.program.campus[key];
                    }
                });
                if (controller.program.campus) {
                    controller.program.campus = controller.program.campus.filter(function (item) {
                        return typeof item !== 'undefined';
                    });
                }
            }).then(function () {
                // get campuses full details
                TmProfileService.getCampuses(
                    controller.isDirectory || controller.programInstitutionCoreId === InstitutionFactory.getCoreId(),
                    controller.programInstitutionCoreId
                ).then(function (campuses) {
                    controller.campusesFullList = campuses;
                    controller.programCampuses = [];
                    if (controller.program.campus && controller.campusesList) {
                        var total = campuses.length,
                            i;
                        angular.forEach(controller.program.campus, function (campusId) {
                            i = 0;
                            for (i; i < total; i++) {
                                if (campusId === campuses[i].id) {
                                    controller.programCampuses.push(campuses[i]);
                                    break;
                                }
                            }
                        });
                    }
                });
            });
        };

        /**
         * Action to do when active program changes.
         * @param {Object} program
         */
        controller.getProgramWatch = function (program) {
            controller.isEditCampus = false;
            controller.isNewCampus = false;
            if (!program ||
                (!controller.isAddMode() && !controller.isEditMode()) ||
                (controller.isEditMode() && typeof (program) !== 'undefined' && angular.equals({}, program))
            ) {
                return;
            }
            controller.program = angular.copy(program);
            controller.isProgramAdvanced = program.advanced;
            controller.programInstitutionCoreId = controller.program.advanced ? controller.program.institutionCoreId : (
                controller.program.parentInstitutionCoreId || InstitutionFactory.getCoreId()
            );
            if (!controller.isProgramAdvanced) {
                controller.loadProgramCampuses();
            }

            if (controller.program.coreId && controller.isSchoolUser === false) {
                TmDirectoryService.getProgramHistory(controller.program.coreId).then(
                    controller.programHistoryCallback
                );
            }
        };

        controller.changeValidateRange = function (targetVar, target, min, max) {
            if (controller[targetVar].stats === null) {
                controller[targetVar].stats = {};
            }
            if (!controller[targetVar].stats.hasOwnProperty(target) ||
                typeof controller[targetVar].stats[target] === 'undefined'
            ) {
                controller[targetVar].stats[target] = min;
            }

            if (controller[targetVar].stats[target] < min) {
                controller[targetVar].stats[target] = min;
            }
            if (controller[targetVar].stats[target] > max) {
                controller[targetVar].stats[target] = max;
            }
        };

        controller.formVisibilityWatch = function (isVisible, wasVisible) {
            if (isVisible && !wasVisible) {
                controller.initForms();
                controller.setValid();
                controller.program.primaryCampusId = null;
            }
        };

        /**
         * Get cordinates add campus
         */
        controller.autoGenerateCordinates = function () {
            if (controller.newCampus.autoGenerate) {
                CampusesService.getCoordinatesByCampus(controller.newCampus).then(
                    controller.getCoordinatesByCampusCallback
                );
            }
        };

        /**
         * Get coordinates callback.
         *
         * @param {Array }response
         */
        controller.getCoordinatesByCampusCallback = function (response) {
            if (response) {
                if (angular.isArray(response) && !angular.isObject(response[0]) && !angular.isObject(response[1])) {
                    controller.newCampus.latitude = response[0];
                    controller.newCampus.longitude = response[1];
                    controller.coordinatesUpdated('success', 'Coordinates updated!');
                } else {
                    controller.coordinatesUpdated('warning', 'Address not found!');
                }
            } else {
                controller.coordinatesUpdated('error', 'Error requesting coordinates!');
            }
        };

        /**
         * Get cordinates edit campus
         */
        controller.autoGenerateCordinatesEdit = function () {
            if (controller.oldCampus.autoGenerate) {
                CampusesService.getCoordinatesByCampus(controller.oldCampus).then(
                    controller.getCoordinatesByEditCampusCallback
                );
            }
        };

        /**
         * Get coordinates callback.
         *
         * @param {Array }response
         */
        controller.getCoordinatesByEditCampusCallback = function (response) {
            if (response) {
                if (angular.isArray(response) && !angular.isObject(response[0]) && !angular.isObject(response[1])) {
                    controller.oldCampus.latitude = response[0];
                    controller.oldCampus.longitude = response[1];
                    controller.coordinatesUpdated('success', 'Coordinates updated!');
                } else {
                    controller.coordinatesUpdated('warning', 'Address not found!');
                }
            } else {
                controller.coordinatesUpdated('error', 'Error requesting coordinates!');
            }
        };

        /**
         * Displays a message based on success
         *
         * @param {boolean} success
         * @param {string} message
         */
        controller.coordinatesUpdated = function (success, message) {
            NotifierFactory.show(
                success,
                message,
                'Address Search'
            );
        };


        controller.initForms = function () {
            controller.newProgram = {
                parentInstitutionCoreId: null,
                campus: [],
                specialisations: []
            };
            controller.newCampus = {};
        };

        controller.initWatches = function () {
            // listen to new program form visibility changes
            WatchService.create($scope, TmProfileFactory.getProgramAddFormVisibility, controller.formVisibilityWatch);
            // listen to program edit form visibility changes
            WatchService.create($scope, TmProfileFactory.getProgramEditFormVisibility, controller.formVisibilityWatch);

            WatchService.create($scope, TmProfileFactory.getProgramSubscribeFormVisibility, function (isVisible, wasVisible) {
                if (isVisible && !wasVisible) {
                    $scope.showEdiProgramForm = false;
                    $scope.showSubscriptionForm = true;
                } else {
                    $scope.showEdiProgramForm = true;
                    $scope.showSubscriptionForm = false;
                }
            });
            // listen to active program changes
            WatchService.create($scope, TmProfileFactory.getProgram, controller.getProgramWatch);

            WatchService.create($scope, TmProfileFactory.isReadOnly, function (isReadOnly) {
                controller.isReadOnly = isReadOnly;
            });

            WatchService.create($scope, TmProfileFactory.isDirectory, function (isDirectory) {
                controller.isDirectory = isDirectory;
            });
            // listen to new program campuses changes
            WatchService.create($scope, function () {
                return controller.newProgram.campus;
            }, controller.newProgramCampusWatch);

            WatchService.create($scope, function () {
                return controller.program.campus;
            }, controller.existingProgramCampusWatch);

            //listen to auto generate switch state
            WatchService.create($scope, function () {
                return controller.newCampus.autoGenerate;
            }, controller.autoGenerateCordinates);

            //listen to auto generate switch state on edit form
            WatchService.create($scope, function(){return controller.oldCampus.autoGenerate;}, function(newValue, oldValue) {
                if (typeof(newValue) !== "undefined" && typeof(oldValue) !== "undefined") {
                    controller.autoGenerateCordinatesEdit();
                }
            });

        };

        controller.init = function () {
            controller.initWatches();

            // load specialisations list
            TmProfileService.getSpecialisationsList().then(function (list) {
                controller.specialisationsList = list;
            });

            // load countries list
            InstitutionsListService.getCountries().then(function (list) {
                controller.countryList = list;
            });

            controller.isSchoolUser = UserFactory.isClient();
        };

        // listen to programs tab visibility changes
        WatchService.create($scope, TmProfileFactory.isProgramsTabSelected, function (isActive, wasActive) {
            if (!isActive) {
                return false;
            }
            // if not already initialized and tab is active
            if (!alreadyInitialised && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
            controller.initForms();
        });

        WatchService.create($scope, TmProfileFactory.isBackend, function (isBackend) {
            controller.isBackend = isBackend;
            if (!alreadyInitialised && isBackend) {
                controller.init();
                controller.initForms();
                alreadyInitialised = true;
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TmProfileProgramFormController', [
            '$scope',
            '$state',
            'constants',
            '$uibModal',
            'NotifierFactory',
            'CampusesService',
            'TmProfileFactory',
            'InstitutionFactory',
            'TmProfileProgramsService',
            'UserFactory',
            'InstitutionsListService',
            'TmProfileService',
            'InstitutionsService',
            'LoginService',
            'ModalService',
            'TmProfileProgramValidationService',
            'WatchService',
            'TmDirectoryService',
            'UiSelectService',
            App.controllers.tmProfileProgramForm
        ]);

} (window.angular, window.moment));
