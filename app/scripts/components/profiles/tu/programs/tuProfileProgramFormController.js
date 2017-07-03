(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.tuProfileProgramForm = function (
        $scope,
        constants,
        NotifierFactory,
        TuProfileFactory,
        InstitutionFactory,
        TuProfileService,
        TuProfileProgramsService,
        TuProfileDepartmentsService,
        UrlService,
        ObjectService,
        WatchService
    ) {
        var controller = this,
            alreadyInitialised = false;

        $scope.getTuProfileProgramFormController = function () {
            return controller;
        };
        $scope.InstitutionNameTuPrograms = null;
        controller.devMode = constants.dev;
        controller.upgradeProgramEmailsTo = constants.emails.upgradeTu;
        $scope.forms = {};
        $scope.addInProgress = false;
        $scope.editInProgress = false;
        $scope.newProgram = {
            belongsTo: null
        };
        $scope.newProgramBeforeChanges = {
            institutionCoreId: null
        };
        $scope.departmentsList = {};
        $scope.departmentsListArr = [];
        $scope.isClientDepartment = null;

        $scope.toggleProgramUpgradeForm = function () {
            TuProfileFactory.setProgramUpgradeFormVisibility();
        };

        $scope.toggleProgramAddForm = function () {
            controller.programFormVisibilityWatch();
            TuProfileFactory.setProgramAddFormVisibility();
        };

        $scope.toggleProgramEditForm = function () {
            TuProfileFactory.setProgramEditFormVisibility();
        };

        /**
         * Is program data fetch in progress?
         *
         * @returns {boolean}
         */
        $scope.isFetchInProgress = function () {
            return !$scope.program || !$scope.program.id;
        };

        /**
         * Get has errors flag.
         *
         * @returns {boolean|*}
         */
        $scope.getHasErrors = function () {
            return TuProfileProgramsService.getHasErrors();
        };

        $scope.setHasErrors = function (value) {
            TuProfileProgramsService.setHasErrors(value);
        };

        $scope.setIsInvalidName = function (value) {
            $scope.isInvalidName = value;
        };

        $scope.setIsInvalidUrl = function (value) {
            $scope.isInvalidUrl = value;
        };

        $scope.setIsInvalidDepartment = function (value) {
            $scope.isInvalidDepartment = value;
        };

        controller.restrictBelongsToOptions = function (departmentCoreId) {
            if (!departmentCoreId) {
                return false;
            }
            // reset array keys
            if (angular.isArray($scope.departmentsList)) {
                $scope.departmentsList = $scope.departmentsList.filter(function () { return true; });
            }

            var total = $scope.departmentsList.length,
                belongsTo,
                i = 0;
            for (i; i < total; ++i) {
                if ($scope.departmentsList[i].coreId === departmentCoreId) {
                    belongsTo = $scope.departmentsList[i].belongsTo;
                    break;
                }
            }
            if (!belongsTo) {
                return false;
            }
            $scope.belongsToList = TuProfileService.getBelongsToList();
            angular.forEach($scope.belongsToList, function (item) {
                if (belongsTo === 'all') {
                    item.disabled = false;
                } else if (belongsTo === 'ug') {
                    item.disabled = item.id !== 'ug';
                } else if (belongsTo === 'pg') {
                    item.disabled = item.id !== 'pg';
                }
            });
            // on edit, when department belongs to changed, the program belongs to should become empty
            angular.forEach($scope.belongsToList, function (item) {
                if (item.disabled && $scope.program.belongsTo === item.id) {
                    delete($scope.program.belongsTo);
                }
            });
        };

        controller.handleDepartmentChanges = function (coreId) {
            $scope.isInvalidDepartment = false;
            controller.restrictBelongsToOptions(coreId);
        };

        $scope.setIsInvalidBelongsTo = function (value) {
            $scope.isInvalidBelongsTo = value;
        };

        controller.departmentExists = function (departmentCoreId) {
            var exists = false;
            angular.forEach($scope.departmentsList, function (item) {
                if (item.coreId && item.coreId === departmentCoreId) {
                    exists = true;
                }
            });
            return exists;
        };

        controller.validateProgram = function (program) {
            $scope.isInvalidName = false;
            $scope.isInvalidUrl = false;
            $scope.isInvalidDepartment = false;
            $scope.isInvalidBelongsTo = false;

            if (!angular.isDefined(program.name) || !(angular.isDefined(program.name) && program.name.length > 0)) {
                $scope.isInvalidName = true;
            }
            if (!angular.isDefined(program.url) || program.url.length < 1 || program.url.length > 255) {
                $scope.isInvalidUrl = true;
            }
            if (!angular.isDefined(program.departmentCoreId) || !controller.departmentExists(program.departmentCoreId)) {
                $scope.isInvalidDepartment = true;
            }
            if (!angular.isDefined(program.belongsTo)) {
                $scope.isInvalidBelongsTo = true;
            }
            return $scope.isInvalidName ||
                $scope.isInvalidUrl ||
                $scope.isInvalidDepartment ||
                $scope.isInvalidBelongsTo;

        };

        controller.resetValidation = function () {
            $scope.isInvalidName = false;
            $scope.isInvalidUrl = false;
            $scope.isInvalidDepartment = false;
            $scope.isInvalidBelongsTo = false;
        };

        /**
         * Actions to do when program update button is clicked.
         *
         * @returns {boolean}
         */
        $scope.handleProgramUpdateClick = function () {
            TuProfileProgramsService.setHasErrors(false);
            var isInvalidProgram = controller.validateProgram($scope.program);
            if (
                $scope.editInProgress ||
                !$scope.forms.editProgramForm ||
                !$scope.forms.editProgramForm.$valid ||
                isInvalidProgram
            ) {
                $scope.setHasErrors(true);
                return false;
            }
            $scope.editInProgress = true;
            TuProfileProgramsService.update($scope.program).then(controller.updateCallback);
        };

        /**
         * Actions to do when update request is finished.
         *
         * @param {boolean} success
         */
        controller.updateCallback = function (success) {
            $scope.editInProgress = false;
            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'successfully!' : 'failure!',
                'Program Updated'
            );
            if (success) {
                // get program instance before changes
                var programInstance = TuProfileFactory.getProgramBeforeChanges();
                // apply changes to program
                angular.forEach($scope.program, function (value, key) {
                    programInstance[key] = value;
                });
                if (!$scope.isClientDepartment) {
                    programInstance.departmentName = TuProfileDepartmentsService.getDepartmentNameById(
                        programInstance.departmentCoreId
                    );
                }
                TuProfileProgramsService.formatList([programInstance]);
                //Update Programs grid
                if (TuProfileFactory.isProgramsAlphabeticalOrder()) {
                    TuProfileFactory.setUpdateProgramGrid(true);
                }
            }
        };

        //
        /**
         * Actions to do when new program create button is clicked.
         *
         * @returns {boolean}
         */
        $scope.handleProgramCreateClick = function () {
            TuProfileProgramsService.setHasErrors(false);
            var isInvalidProgram = controller.validateProgram($scope.newProgram);
            if (
                $scope.addInProgress ||
                !$scope.forms.addProgramForm ||
                !$scope.forms.addProgramForm.$valid ||
                isInvalidProgram
            ) {
                $scope.setHasErrors(true);
                return false;
            }
            $scope.addInProgress = true;
            TuProfileProgramsService.create($scope.newProgram).then(controller.createCallback);
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
                response ? 'successfully!' : 'failure!',
                'Program Created'
            );
            if (response) {
                var program = angular.copy($scope.newProgram);
                program.id = response.insertedId;
                // set new program as active
                TuProfileFactory.setProgram(program);
                // reset add form fields
                controller.initForm();
                // announce that new program was added
                TuProfileFactory.announceNewProgram(program.id);
            }
        };

        controller.programFormVisibilityWatch = function () {
            controller.resetValidation();
            controller.initForm();
        };

        controller.initWatches = function () {
            WatchService.create($scope, InstitutionFactory.getCoreId, function (newCoreId, oldCoreId) {
                if (newCoreId) {
                    // check if departments list was not fetched
                    if (angular.equals($scope.departmentsList, {}) || (oldCoreId && newCoreId !== oldCoreId)) {
                        // fetch departments and store for later usage
                        TuProfileDepartmentsService.getAllDepartments(
                            InstitutionFactory.isClientDepartment() ?
                            InstitutionFactory.getParentCoreId() :
                            InstitutionFactory.getCoreId(),
                            {
                                page: 1, // show first page
                                count: 1000, // count per page
                            }
                        );
                    }
                    $scope.newProgram.institutionCoreId = newCoreId;
                    $scope.newProgramBeforeChanges.institutionCoreId = newCoreId;

                    // check if institution is client department
                    $scope.isClientDepartment = InstitutionFactory.isClientDepartment();
                    if ($scope.isClientDepartment) {
                        $scope.newProgram.departmentCoreId = newCoreId;
                        $scope.departmentsList = [{
                            coreId: newCoreId,
                            name: InstitutionFactory.getDisplayName()
                        }];
                        $scope.newProgramBeforeChanges = {
                            institutionCoreId: newCoreId,
                            departmentCoreId: newCoreId
                        };
                    }
                }
            });

            WatchService.create($scope, TuProfileFactory.getProgram, function (newValue, oldValue) {
                controller.resetValidation();
                if (newValue !== oldValue) {
                    $scope.program = newValue;
                    controller.restrictBelongsToOptions($scope.program.departmentCoreId);
                }
            }, true);

            WatchService.create($scope, TuProfileFactory.getDepartments, function (departmentsList) {
                if (!InstitutionFactory.isClientDepartment()) {
                    if (Object.prototype.toString.call(departmentsList) === '[object Array]') {
                        $scope.departmentsListArr = TuProfileFactory.getDepartments();
                        // fixes scenario when switched to parent and clicked edit program, belongs to becomes empty
                        controller.handleDepartmentChanges(InstitutionFactory.getCoreId());
                    }
                    else{
                        $scope.departmentsList = TuProfileFactory.getDepartments();
                    }
                    $scope.departmentsList = departmentsList;
                } else {
                    // client department fix
                    if (Object.prototype.toString.call(departmentsList) === '[object Array]') {
                        $scope.departmentsListArr = TuProfileFactory.getDepartments();
                        $scope.departmentsList = angular.copy($scope.departmentsListArr);
                        controller.handleDepartmentChanges(InstitutionFactory.getCoreId());
                    }
                }
            }, true);

            // watch for program edit form visibility changes
            WatchService.create($scope, function () {
                return TuProfileFactory.isProgramEditFormVisible($scope.activeTab);
            }, controller.programFormVisibilityWatch);

            // watch for program add form visibility changes
            WatchService.create($scope, function () {
                return TuProfileFactory.isProgramAddFormVisible($scope.activeTab);
            }, controller.programFormVisibilityWatch);

            // watch for dpeartment update changes on edit program form
            WatchService.create($scope, TuProfileFactory.getIsDepartmentUpdated, function (isUpdated) {
                if (!InstitutionFactory.isClientDepartment()) {
                    $scope.departmentsList = TuProfileFactory.getDepartments();
                    $scope.belongsToList = [{}];
                }
            });
        };

        controller.initForm = function () {
            $scope.newProgram = angular.copy($scope.newProgramBeforeChanges);
            // watch for program changes
            $scope.program = TuProfileFactory.getProgram();
        };

        controller.init = function () {
            controller.initWatches();
        };

        // listen to departments tab visibility changes
        WatchService.create($scope, TuProfileFactory.isProgramsTabSelected, function (isActive, wasActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
            if (isActive) {
                controller.initForm();
                if ($scope.forms && $scope.forms.addProgramForm) {
                    $scope.forms.addProgramForm.$setUntouched();
                }
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TuProfileProgramForm', [
            '$scope',
            'constants',
            'NotifierFactory',
            'TuProfileFactory',
            'InstitutionFactory',
            'TuProfileService',
            'TuProfileProgramsService',
            'TuProfileDepartmentsService',
            'UrlService',
            'ObjectService',
            'WatchService',
            App.controllers.tuProfileProgramForm
        ]);

} (window.angular));
