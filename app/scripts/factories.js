(function(angular) {
    'use strict';

    var App = App || {};
    App = angular.extend({}, App, {factories:{}});

    /**
     * Factory to use notifications.
     * For more info: https://github.com/jirikavi/AngularJS-Toaster
     *
     * @param toaster
     * @returns {{show: show}}
     * @constructor
     */
    App.factories.Notifier = function (toaster) {
        return {
            show: function (type, body, title, sticky, id) {
                var notification = {
                    type: type,
                    body: body,
                    showCloseButton: true
                };
                if (title) {
                    notification.title = title;
                }
                if (id) {
                    notification.id = id;
                }
                if (sticky) {
                    notification.timeout = 0;
                    notification.extendedTimeOut = 0;
                }
                toaster.pop(notification);
            }
        };
    };

    App.factories.TuProfile = function () {
        var data = {},
            program = {},
            profileTabs = {
                overview : 0,
                subjects : 1,
                programs : 2,
                media : 3,
                publish : 4,
                departments : 5
            },
            programBeforeChanges = {},
            departments = {},
            videos = null,

            upgradeFormVisible = false,
            historyLogVisible = false,
            programAddFormVisible = false,
            programEditFormVisible = false,
            departmentAddFormVisible = false,
            departmentEditFormVisible = false,

            newProgram = false,
            triggerResetProgramForm = false,
            department = {},
            departmentBeforeChanges = {},
            isDepartmentNameUpdated = false,
            newDepartment = false,
            clearDepartmentFormAfterSave = false,
            selectedMediaTabId = null,
            selectedTabId = null,
            availableSubjects = {},
            isProgramUpdated = false,
            updateDepartmentsGrid = false,
            rowSelected = false,
            activeOverviewSubTabs = {
                'master': true,
                'ug': false,
                'pg': false
            },
            clientDepartmentUpgradeFormVisible = false,
            isDepartmentOverview = false,
            isProgramOverview = false;

        var closeSidebars = function () {
            upgradeFormVisible = false;
            historyLogVisible = false;
            programAddFormVisible = false;
            programEditFormVisible = false;
            departmentAddFormVisible = false;
            departmentEditFormVisible = false;
            clientDepartmentUpgradeFormVisible = false;
            newProgram = null;
            newDepartment = null;
            resetProgramForm();
        };

        var resetProgramForm = function () {
            triggerResetProgramForm = !triggerResetProgramForm;
        };

        return {
            closeSidebars: closeSidebars,
            resetProgramForm : resetProgramForm,
            getProfileTabs : function () {
                return profileTabs;
            },
            getData: function () {
                return data;
            },
            setData: function (newData) {
                data = newData;
            },
            reset: function () {
                data = {};
                department = {};
                program = {};
                availableSubjects = {};
                newDepartment = false;
                newProgram = false;
                selectedMediaTabId = null;
                selectedTabId = null;
                closeSidebars();
            },
            getId: function () {
                return data !== null && data.id || '';
            },
            getProgram: function () {
                return program;
            },
            setProgram: function (selectedProgram) {
                program = selectedProgram;
            },
            getIsDepartmentOverview: function () {
                return isDepartmentOverview;
            },
            setIsDepartmentOverview: function (newValue) {
                isDepartmentOverview = newValue;
            },
            getIsProgramOverview: function () {
                return isProgramOverview;
            },
            setIsProgramOverview: function (newValue) {
                isProgramOverview = newValue;
            },
            getProgramId: function () {
                return program && program.id ? program.id : null;
            },
            /**
             * Is program form reset.
             *
             * @returns {Boolean}
             */
            IsResetProgramForm : function () {
                return triggerResetProgramForm;
            },
            /**
             * Is history logs visible?
             *
             * @param {Integer} activeTab
             * @returns {boolean}
             */
            isHistoryLogVisible: function (activeTab) {
                if (typeof activeTab === 'undefined') {
                    return false;
                }
                return (activeTab === profileTabs.overview) && historyLogVisible;
            },
            /**
             * Set history logs visibility.
             *
             * @param {boolean|null} visibility
             */
            setHistoryLogVisibility: function (visibility) {
                if (typeof visibility === 'undefined') {
                    visibility = !historyLogVisible;
                }
                historyLogVisible = visibility;

                // hide upgrade form
                upgradeFormVisible = false;
                // hide program edit form
                programEditFormVisible = false;
                // hide program add form
                programAddFormVisible = false;
                // hide department edit form
                departmentEditFormVisible = false;
                // hide department add form
                departmentAddFormVisible = false;
                //hide upgrade department form for client
                clientDepartmentUpgradeFormVisible = false;
            },
            /**
             * Is upgrade form visible?
             *
             * @param {Integer} activeTab
             * @returns {boolean}
             */
            isUpgradeFormVisible: function (activeTab) {
                if (typeof activeTab === 'undefined') {
                    return false;
                }
                return ((activeTab === profileTabs.overview) ||
                    (activeTab === profileTabs.programs) ||
                    (activeTab === profileTabs.media) ||
                    (activeTab === profileTabs.departments)) &&
                    upgradeFormVisible;
            },
            /**
             * Set upgrade form visibility.
             *
             * @param {boolean|null} visibility
             */
            setUpgradeFormVisibility: function (visibility) {
                if (typeof visibility === 'undefined') {
                    visibility = !upgradeFormVisible;
                }
                upgradeFormVisible = visibility;

                // hide history logs
                historyLogVisible = false;
                // hide program edit form
                programEditFormVisible = false;
                // hide program add form
                programAddFormVisible = false;
                // hide department edit form
                departmentEditFormVisible = false;
                // hide department add form
                departmentAddFormVisible = false;
                //hide upgrade department form for client
                clientDepartmentUpgradeFormVisible = false;
            },
            /**
             * Is new program form visible?
             *
             * @param {Integer} activeTab
             * @returns {boolean}
             */
            isProgramAddFormVisible: function (activeTab) {
                if (typeof activeTab === 'undefined') {
                    return false;
                }
                resetProgramForm();
                return (activeTab === profileTabs.programs) && programAddFormVisible;
            },
            /**
             * Set new program form visibility.
             *
             * @param {boolean|null} visibility
             */
            setProgramAddFormVisibility: function (visibility) {
                if (typeof visibility === 'undefined') {
                    visibility = !programAddFormVisible;
                }
                programAddFormVisible = visibility;

                // hide history logs
                historyLogVisible = false;
                // hide program edit form
                programEditFormVisible = false;
                // hide upgrade form
                upgradeFormVisible = false;
                // hide department edit form
                departmentEditFormVisible = false;
                // hide department add form
                departmentAddFormVisible = false;
                //hide upgrade department form for client
                clientDepartmentUpgradeFormVisible = false;
            },
            /**
             * Is program edit form visible?
             *
             * @param {Integer} activeTab
             * @returns {boolean}
             */
            isProgramEditFormVisible: function (activeTab) {
                if (typeof activeTab === 'undefined') {
                    return false;
                }
                resetProgramForm();
                return (activeTab === profileTabs.programs) && programEditFormVisible;
            },
            /**
             * Set program edit form visibility.
             *
             * @param {boolean|null} visibility
             */
            setProgramEditFormVisibility: function (visibility) {
                if (typeof visibility === 'undefined') {
                    visibility = !programEditFormVisible;
                }
                programEditFormVisible = visibility;

                // hide history logs
                historyLogVisible = false;
                // hide program add form
                programAddFormVisible = false;
                // hide upgrade form
                upgradeFormVisible = false;
                // hide department edit form
                departmentEditFormVisible = false;
                // hide department add form
                departmentAddFormVisible = false;
                //hide upgrade department form for client
                clientDepartmentUpgradeFormVisible = false;
            },
            isClientDepartmentUpgradeFormVisible: function(activeTab) {
                if (typeof activeTab === 'undefined') {
                    return false;
                }

                return activeTab === profileTabs.departments && clientDepartmentUpgradeFormVisible;
            },
            setClientDepartmentUpgradeFormVisibility: function(visibility) {
                if (typeof visibility === 'undefined') {
                    visibility = !clientDepartmentUpgradeFormVisible;
                }
                clientDepartmentUpgradeFormVisible = visibility;

                // hide history logs
                historyLogVisible = false;
                // hide program add form
                programAddFormVisible = false;
                // hide upgrade form
                upgradeFormVisible = false;
                // hide department edit form
                departmentEditFormVisible = false;
                // hide department add form
                departmentAddFormVisible = false;
                // hide program edit form
                programEditFormVisible = false;
            },
            /**
             * Is new department form visible?
             *
             * @param {Integer} activeTab
             * @returns {boolean}
             */
            isDepartmentAddFormVisible: function (activeTab) {
                if (typeof activeTab === 'undefined') {
                    return false;
                }
                return (activeTab === profileTabs.departments) && departmentAddFormVisible;
            },
            /**
             * Set new department form visibility.
             *
             * @param {boolean|null} visibility
             */
            setDepartmentAddFormVisibility: function (visibility) {
                if (typeof visibility === 'undefined') {
                    visibility = !departmentAddFormVisible;
                }
                departmentAddFormVisible = visibility;

                // hide upgrade form
                upgradeFormVisible = false;
                // hide history logs
                historyLogVisible = false;
                // hide program edit form
                programEditFormVisible = false;
                // hide program add form
                programAddFormVisible = false;
                // hide department edit form
                departmentEditFormVisible = false;
                //hide upgrade department form for client
                clientDepartmentUpgradeFormVisible = false;
            },
            /**
             * Is department edit form visible?
             *
             * @param {Integer} activeTab
             * @returns {boolean}
             */
            isDepartmentEditFormVisible: function (activeTab) {
                if (typeof activeTab === 'undefined') {
                    return false;
                }
                return (activeTab === profileTabs.departments) && departmentEditFormVisible;
            },
            /**
             * Set department edit form visibility.
             *
             * @param {boolean|null} visibility
             */
            setDepartmentEditFormVisibility: function (visibility) {
                if (typeof visibility === 'undefined') {
                    visibility = !departmentEditFormVisible;
                }
                departmentEditFormVisible = visibility;

                // hide upgrade form
                upgradeFormVisible = false;
                // hide history logs
                historyLogVisible = false;
                // hide program edit form
                programEditFormVisible = false;
                // hide program add form
                programAddFormVisible = false;
                // hide department add form
                departmentAddFormVisible = false;
                //hide upgrade department form for client
                clientDepartmentUpgradeFormVisible = false;
            },
            setIsDepartmentRowSelected: function (value) {
                rowSelected = value;
            },
            getIsDepartmentRowSelected: function () {
                return rowSelected;
            },
            announceNewProgram: function (newProgramId) {
                newProgram = newProgramId;
            },
            hasNewProgram: function () {
                return newProgram;
            },
            setProgramBeforeChanges: function (programInstance) {
                programBeforeChanges = programInstance;
            },
            getProgramBeforeChanges: function () {
                return programBeforeChanges;
            },
            getDepartment: function () {
                return department;
            },
            setDepartment: function (selectedDepartment) {
                department = selectedDepartment;
            },
            getDepartmentId: function () {
                return department && department.id ? department.id : null;
            },
            setIsDepartmentUpdated: function (newValue) {
                isDepartmentNameUpdated = newValue;
            },
            getIsDepartmentUpdated: function () {
                return isDepartmentNameUpdated;
            },
            announceNewDepartment: function (newDepartmentId) {
                newDepartment = newDepartmentId;
            },
            hasNewDepartment: function () {
                return newDepartment;
            },
            setDepartmentBeforeChanges: function (departmentInstance) {
                departmentBeforeChanges = departmentInstance;
            },
            getDepartmentBeforeChanges: function () {
                return departmentBeforeChanges;
            },
            getDepartments: function () {
                return departments;
            },
            setDepartments: function (departmentsList) {
                departments = departmentsList;
            },
            getSelectedMediaTabId: function () {
                return selectedMediaTabId;
            },
            setSelectedMediaTabId: function (newSelectedMediaTabId) {
                selectedMediaTabId = newSelectedMediaTabId;
            },
            setSelectedTabId: function (newSelectedTabId) {
                selectedTabId = newSelectedTabId;
            },
            getSelectedTabId: function () {
                return selectedTabId;
            },
            isOverviewTabSelected: function () {
                return (typeof selectedTabId !== 'undefined') && selectedTabId === profileTabs.overview;
            },
            isDepartmentsTabSelected: function () {
                return (typeof selectedTabId !== 'undefined')  && selectedTabId === profileTabs.departments;
            },
            isSubjectsTabSelected: function () {
                return (typeof selectedTabId !== 'undefined')  && selectedTabId === profileTabs.subjects;
            },
            isProgramsTabSelected: function () {
                return (typeof selectedTabId !== 'undefined')  && selectedTabId === profileTabs.programs;
            },
            isMediaTabSelected: function () {
                return (typeof selectedTabId !== 'undefined')  && selectedTabId === profileTabs.media;
            },
            setMediaVideos: function (NewVideos) {
                videos = NewVideos;
            },
            getMediaVideos: function () {
                return videos;
            },
            isPublishTabSelected: function () {
                return (typeof selectedTabId !== 'undefined')  && selectedTabId === profileTabs.publish;
            },
            setAvailableSubjects : function (newSubjects) {
                availableSubjects = newSubjects;
            },
            getAvailableSubjects : function () {
                return availableSubjects;
            },
            setActiveOverviewSubTabs : function (newSubTabs) {
                if (angular.isDefined(newSubTabs)) {
                    if (angular.equals(0, newSubTabs)) {
                        activeOverviewSubTabs.master = true;
                        activeOverviewSubTabs.ug = false;
                        activeOverviewSubTabs.pg = false;
                    }
                    if (angular.equals(1, newSubTabs)) {
                        activeOverviewSubTabs.master = false;
                        activeOverviewSubTabs.ug = true;
                        activeOverviewSubTabs.pg = false;
                    }
                    if (angular.equals(2, newSubTabs)) {
                        activeOverviewSubTabs.master = false;
                        activeOverviewSubTabs.ug = false;
                        activeOverviewSubTabs.pg = true;
                    }
                }
            },
            getActiveOverviewSubTabs : function () {
                return activeOverviewSubTabs;
            },
            setUpdateProgramGrid: function (newValue) {
                isProgramUpdated = newValue;
            },
            getUpdateProgramGrid: function () {
                return isProgramUpdated;
            },
            setUpdateDepartmentsGrid: function (newValue) {
                updateDepartmentsGrid = newValue;
            },
            getUpdateDepartmentsGrid: function () {
                return updateDepartmentsGrid;
            },
            isProgramsAlphabeticalOrder: function () {
                return data && data.programsAlphabeticalOrder;
            }
        };
    };

    App.factories.SharedProfile = function () {
        var data = {},
            SharedProfileTabs = {
                general : 0,
                campuses : 1
            },
            loadInProgress = false,
            hasCampusesChanges = false,
            campusFormVisible = false,
            campusAddFormVisible = false,
            campusEditFormVisible = false,
            editMode = null,
            selectedTabId = null,
            campus = {},
            rootShowCampusInfoBlock = null,
            showCampusInfoBlock = null,
            campusList = {},
            columns = {},
            mapUpdateRequest = null,
            loadMoreInProgress = false,
            limit = 1;
        return {
            getData: function () {
                return data;
            },
            setData: function (newData) {
                data = newData;
            },
            getActiveTabs: function () {
                return SharedProfileTabs;
            },
            closeSidebars: function () {
                campusFormVisible = false;
                campusAddFormVisible = false;
                campusEditFormVisible = false;
            },
            isCampusFormVisible: function () {
                return campusFormVisible;
            },
            isCampusEditForm: function () {
                return editMode;
            },
            setCampusFormVisibility: function (visibility) {
                campusFormVisible = visibility && !campusFormVisible;
            },
            setCampusAddFormVisibility: function (visibility) {
                editMode = false;
                if (campusEditFormVisible) {
                    campusEditFormVisible = false;
                    visibility = true;
                }
                campusAddFormVisible = visibility || !campusAddFormVisible;
                campusFormVisible = visibility || !campusFormVisible;
            },
            setCampusEditFormVisibility: function (visibility) {
                editMode = true;
                if (campusAddFormVisible) {
                    campusAddFormVisible = false;
                    visibility = true;
                }
                campusEditFormVisible = visibility || !campusAddFormVisible;
                campusAddFormVisible = false;
                campusFormVisible = visibility || !campusFormVisible;
            },
            getCampus: function () {
                return campus;
            },
            setCampus: function (newData) {
                campus = newData;
            },
            getInstitutionListShowCampusInfoBlock: function () {
                return rootShowCampusInfoBlock;
            },
            setInstitutionListShowCampusInfoBlock: function (showCampusInfoBlock) {
                rootShowCampusInfoBlock = showCampusInfoBlock;
            },
            setColumns: function (setColumns) {
                columns = setColumns;
            },
            getColumns: function () {
                return columns;
            },
            announceCampusesChanges: function (campusId) {
                campusId = campusId || true;
                hasCampusesChanges = campusId;
            },
            hasCampusesChanges: function () {
                var hasChanges = angular.copy(hasCampusesChanges);
                if (hasCampusesChanges) {
                    hasCampusesChanges = false;
                }
                return hasChanges;
            },
            loadInProgress: function () {
                return loadInProgress;
            },
            setLoadInProgress: function (status) {
                loadInProgress = status;
            },
            getId: function () {
                return data.id || '';
            },
            setSelectedTabId: function (newSelectedTabId) {
                selectedTabId = newSelectedTabId;
            },
            hasSelectedTab: function () {
                return selectedTabId !== null;
            },
            isCampusesTabSelected: function () {
                return (typeof selectedTabId !== 'undefined') && (selectedTabId === SharedProfileTabs.campuses);
            },
            isGeneralTabSelected: function () {
                return (typeof selectedTabId !== 'undefined')  && (selectedTabId === SharedProfileTabs.general);
            },
            mapUpdateRequest: function () {
                return mapUpdateRequest;
            },
            setMapUpdateRequest: function (value) {
                mapUpdateRequest = value;
            },
            setLogLimit: function (logLimit) {
                if (!logLimit || logLimit < 1 || typeof logLimit === 'undefined') {
                    logLimit = 1;
                }
                limit = logLimit;
            },
            getLogLimit: function () {
                return limit;
            },
            isLoadMoreInProgress: function () {
                return loadMoreInProgress;
            },
            setLoadMoreInProgress: function (status) {
                loadMoreInProgress = status;
            },
        };
    };

    App.factories.Institution = function (TimeService) {
        var defaultData = {},
            departmentOverview = {
                institutionId: null,
                data: {}
            },
            data = defaultData,
            defaultCoreId = 700,
            clientDepartmentId = 3,
            advancedProgramId = 7,
            inactive,
            isSubscriptionTabActive = false,
            tuProgramsOverview = {
                institutionId: null
            },
            isProfileAdvanced = function (subscriptions, profile) {
                var isAdvanced = false,
                    subsProfile = profile === 'tu' ? subscriptions.tu : subscriptions.tm;

                if (subsProfile) {
                    isAdvanced = subsProfile.advanced && subsProfile.active;
                    if (!isAdvanced) {
                        var today = TimeService.getMiliSeconds(TimeService.now()),
                            weekLater = TimeService.getMiliSeconds(TimeService.add(7, 'days'));
                        if (subsProfile.startDate > today &&
                            subsProfile.endDate > subsProfile.startDate
                        ) {
                            var result = weekLater - subsProfile.startDate,
                                range = weekLater - today;
                            // Check if date is one week before it will be activated
                            if (result >= 0 && result <= range) {
                                isAdvanced = true;
                            }
                        }
                    }
                }

                return isAdvanced;
            };
        return {
            getData: function () {
                return data;
            },
            isDepartmentsAlphabeticalOrder: function () {
                return data && data.departmentsAlphabeticalOrder;
            },
            isEmpty: function () {
                return !data || angular.equals(data, defaultData);
            },
            setCampuses: function (campuses) {
                data.campus = campuses;
            },
            addCampus: function (campus) {
                if (!data) {
                    data = angular.copy(defaultData);
                }
                if (!data.campus) {
                    data.campus = [];
                }
                data.campus.push(campus);
            },
            getCampusData: function () {
                return data && data.campus || [];
            },
            setData: function (newData) {
                data = newData;
            },
            setSubscriptions: function (newData) {
                data.subscriptions = newData;
            },
            getSubscriptions: function () {
                 return data && data.hasOwnProperty('subscriptions') ? data.subscriptions : null;
            },
            getCoreId: function () {
                return data && data.coreId ? parseInt(data.coreId, 10) : null;
            },
            getDisplayName: function () {
                return data && data.name ? data.name : '';
            },
            getId: function () {
                return data && data.id ? data.id : '';
            },
            getParentCoreId: function () {
                return data && data.parentCoreId ? parseInt(data.parentCoreId, 10) : null;
            },
            getDefaultCoreId: function () {
                return defaultCoreId;
            },
            isTuAdvanced: function () {
                if (data && data.subscriptions) {
                    return isProfileAdvanced(data.subscriptions, 'tu');
                }
                return null;
            },
            isTmAdvanced: function () {
                if (data && data.subscriptions) {
                    return isProfileAdvanced(data.subscriptions, 'tm');
                }
                return null;
            },
            isTuSubscribed: function () {
                return data &&
                    data.subscriptions &&
                    data.subscriptions.tu &&
                    data.subscriptions.tu.subscribed;
            },
            isTuEnabled: function () {
                if (data && data.enabled) {
                    return data.enabled.tu;
                }
                return null;
            },
            isUgEnabled: function () {
                if (data && data.enabled) {
                    return data.enabled.ug;
                }
                return null;
            },
            isPgEnabled: function () {
                if (data && data.enabled) {
                    return data.enabled.pg;
                }
                return null;
            },
            isTmSubscribed: function () {
                return data &&
                    data.subscriptions &&
                    data.subscriptions.tm &&
                    data.subscriptions.tm.subscribed;
            },
            isTmEnabled: function () {
                if (data && data.enabled) {
                    return data.enabled.tm;
                }
                return null;
            },
            isClientDepartment: function () {
                return data && parseInt(data.typeId, 10) === clientDepartmentId;
            },
            isAdvancedProgram: function () {
                return data && parseInt(data.typeId, 10) === advancedProgramId;
            },
            hasNoDepartments: function () {
                return data && data.hasNoDepartments ? data.hasNoDepartments : false;
            },
            getCampuses: function () {
                return data && data.campus ? data.campus : [];
            },
            isActive: function () {
                return data  ? (data.active && (data.deleted === 'undefined' || !data.deleted)) : null;
            },
            getInstitutionIdTuProgramsOverview: function () {
                return tuProgramsOverview.institutionId;
            },
            setInstitutionIdTuProgramsOverview: function (institutionId) {
                tuProgramsOverview.institutionId = institutionId ? institutionId : null;
            },
            setDataDepartmentOverview: function (data) {
                departmentOverview.data = data;
            },
            getDataDepartmentOverview: function () {
                return departmentOverview.data;
            },
            getCampusDataDepartmentOverview: function () {
                return departmentOverview.data && departmentOverview.data.campus || [];
            },
            getInstitutionIdDepartmentOverview: function () {
                return departmentOverview.institutionId;
            },
            setInstitutionIdDepartmentOverview: function (institutionId) {
                departmentOverview.institutionId = institutionId ? institutionId : null;
            },
            resetDepartmentOverview: function () {
                departmentOverview = {
                    institutionId: null,
                    data: {}
                };
            },
            setActiveTab: function(active){
                isSubscriptionTabActive = active;
            },
            getActiveTab: function(){
                return isSubscriptionTabActive;
            }
        };
    };

    App.factories.User = function (DataHandlerFactory) {
        var data = {},
            handles = {
                'clients.profiles.shared': 'profiles.institution_details',
                'clients.profiles.tu': 'profiles.tu',
                'clients.profiles.tm': 'profiles.tm',
                'clients.statistics': 'statistics.statistics',
                'staff.users.qs': 'users.qs_users',
                'staff.users.institutions': 'users.schools_users',
                'staff.institutions.list': 'institutions.list',
                'staff.master-password' : 'master_password.master_password',
                'staff.tm-directory' : 'tm_directory.tm_directory'
            },
            defaultPages = [
                'user.my-profile'
            ];
        return {
            getData: function () {
                return data;
            },
            setData: function (newData) {
                data = newData;
            },
            isClient: function () {
                return data && data.isClient ? true : false;
            },
            hasData: function () {
                return !(angular.equals(data, {}) || angular.equals(data, null));
            },
            getFullName: function () {
                return data && data.fullName ? data.fullName : null;
            },
            getFirstName: function () {
                return data && data.firstName ? data.firstName : null;
            },
            getLastName: function () {
                return data && data.lastName ? data.lastName : null;
            },
            setFullName: function (fullName) {
                data.fullName = fullName;
            },
            setFirstName: function (firstName) {
                data.firstName = firstName;
            },
            setLastName: function (lastName) {
                data.lastName = lastName;
            },
            setTitle: function (title) {
                data.title = title;
            },
            setPhone: function (phone) {
                data.phone = phone;
            },
            setPosition: function (position) {
                data.position = position;
            },
            getUserName: function () {
                return data && data.userName ? data.userName : null;
            },
            getProfileLogo: function () {
                return data && data.profileLogo ? data.profileLogo : '';
            },
            setProfileLogo: function (profileLogo) {
                data.profileLogo = profileLogo;
            },
            getPrimaryInstitutionCoreId: function () {
                return data && data.primaryInstitution ? data.primaryInstitution : 0;
            },
            getPosition: function () {
                return data && data.position ? data.position : null;
            },
            isTuEnabled: function () {
                return data && data.accessTo && data.accessTo.indexOf('profiles.tu') !== -1;
            },
            hasTuProgramsOverviewAccess: function () {
                return data && data.accessTo && data.accessTo.indexOf('institutions.tu_programs_overview') !== -1;
            },
            hasDepartmentsOverviewAccess: function () {
                return data && data.accessTo && data.accessTo.indexOf('institutions.department_overview') !== -1;
            },
            hasTmDirectoryAccess: function () {
                return data && data.accessTo && data.accessTo.indexOf('tm_directory.tm_directory') !== -1;
            },
            hasMasterPasswordAccess: function () {
                return data && data.accessTo && data.accessTo.indexOf('master_password.master_password') !== -1;
            },
            hasContactsAccess: function () {
                return data && data.accessTo && data.accessTo.indexOf('contacts.contacts') !== -1;
            },
            hasInstitutionsListAccess: function () {
                return data && data.accessTo && data.accessTo.indexOf('institutions.list') !== -1;
            },
            hasQsUsersAccess: function () {
                return data && data.accessTo && data.accessTo.indexOf('users.qs_users') !== -1;
            },
            hasInstitutionsUsersAccess: function () {
                return data && data.accessTo && data.accessTo.indexOf('users.schools_users') !== -1;
            },
            isTmEnabled: function () {
                return data && data.accessTo && data.accessTo.indexOf('profiles.tm') !== -1;
            },
            getAllowedInstitutions: function () {
                return data && data.institutions ? data.institutions : [];
            },
            isAllowedToLogin: function (institutionCoreId) {
                var allowed = this.getAllowedInstitutions();
                if (this.getPrimaryInstitutionCoreId() && allowed.indexOf(parseInt(institutionCoreId, 10)) === -1) {
                    allowed.push(parseInt(this.getPrimaryInstitutionCoreId(), 10));
                }

                return allowed.indexOf(parseInt(institutionCoreId, 10)) !== -1;
            },
            hasAccess: function () {
                return data && data.accessTo && angular.isObject(data.accessTo) && !angular.equals({}, data.accessTo) &&
                    !angular.equals([], data.accessTo);
            },
            userHasAccessToPage: function (page) {
                return data.accessTo && data.accessTo.indexOf(page) !== -1;
            },
            noAccess: function (page) {
                return this.isClient() && defaultPages.indexOf(page) ===-1 &&
                    !this.userHasAccessToPage(this.getHandles()[page]);
            },
            hasAccessToInstitutionDetails: function () {
                return data && data.accessTo && data.accessTo.indexOf('profiles.institution_details') !== -1;
            },
            getFirstAllowedState: function (subscriptionsPrimaryInstitution) {
                var firstAllowedState = '/';
                if (this.hasAccess()) {
                    // search for state name
                    /**
                     * @todo remove when pages are implemented as it's a temporary fix
                     */
                    var notImplementedAccessTo = [
                        "dashboard.dashboard",
                        "contact_us.contact_us",
                        "faq.faq",
                        "messages.messages"
                    ];
                    // Exclude not implemented areas
                    var result = DataHandlerFactory.getDiffArray(data.accessTo, notImplementedAccessTo).sort(),
                        bestStateForUser = this.getBestStateForUser(subscriptionsPrimaryInstitution, result);

                    angular.forEach(handles, function (value, key) {
                        if (angular.equals(bestStateForUser, value)) {
                            firstAllowedState = key;
                        }
                    });
                }

                return firstAllowedState;
            },
            getBestStateForUser: function (subscriptions, states) {
                var hasTu = (angular.isDefined(subscriptions.tu) &&
                            subscriptions.tu.active),
                    hasTm = (angular.isDefined(subscriptions.tm) &&
                            subscriptions.tm.active);

                for (var i = 0; i < states.length; i++) {
                    if (states[i].indexOf('tu') !== -1 && hasTu) {
                        return states[i];
                    } else if (states[i].indexOf('tm') !== -1 && hasTm) {
                        return states[i];
                    }
                }

                return states[0];
            },
            getHandles: function () {
                return handles;
            },
            isPasswordReset: function () {
                return !!(data && data.passwordReset);
            },
            clearPasswordReset: function () {
                data.passwordReset = false;
            }
        };
    };

    App.factories.TuProfileHistoryLog = function () {
        var data = {},
            limit = 1,
            profileType = null,
            inProgress = false,
            loadMoreInProgress = false,
            visible = false,
            reload = false,
            isAdvanced = false,
            triggeredBy = null;

        return {
            getData: function () {
                return data;
            },
            setData: function (newData) {
                data = newData;
            },
            setLogLimit: function (logLimit) {
                if (!logLimit || logLimit < 1 || typeof logLimit === 'undefined') {
                    logLimit = 1;
                }
                limit = logLimit;
            },
            getLogLimit: function () {
                return limit;
            },
            setProfileType: function (newProfileType) {
                profileType = newProfileType;
            },
            getProfileType: function () {
                return profileType;
            },
            isInProgress: function () {
                return inProgress;
            },
            setInProgress: function (status) {
                inProgress = status;
            },
            isLoadMoreInProgress: function () {
                return loadMoreInProgress;
            },
            setLoadMoreInProgress: function (status) {
                loadMoreInProgress = status;
            },
            isVisible: function () {
                return visible;
            },
            setTriggeredBy: function (trigger) {
                triggeredBy = trigger;
            },
            shouldBeVisible: function (trigger) {
                if (triggeredBy === trigger) {
                    triggeredBy = null;
                    return false;
                }
                return true;
            },
            resetTriggeredBy: function () {
                triggeredBy = '';
            },
            setAdvanced: function (advanced) {
                isAdvanced = advanced;
            },
            isAdvanced: function () {
                return isAdvanced;
            },
            setReload: function(triggerReload) {
                reload = triggerReload;
            },
            isReloadRequired: function() {
                return reload;
            },
        };
    };

    App.factories.MapInitializer = function ($window, $q) {
        var loaded = false;
        // maps loader deferred object
        var mapsDefer = $q.defer();

        // Google's url for async maps initialization accepting callback function
        var asyncUrl = 'https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDN-E7GkRH050mItjaG6s2XIsDmi1OUsYg&callback=';

        // async loader
        var asyncLoad = function (asyncUrl, callbackName) {
            if (!loaded) {
                var script = document.createElement('script');
                //script.type = 'text/javascript';
                script.src = asyncUrl + callbackName;
                document.body.appendChild(script);
            }
        };

        // callback function - resolving promise after maps successfully loaded
        $window.googleMapsInitialized = function () {
            mapsDefer.resolve();
            loaded = true;
        };

        return {
            // usage: Initializer.mapsInitialized.then(callback)
            initStart: function () {
                asyncLoad(asyncUrl, 'googleMapsInitialized');
            },
            mapsInitialized: mapsDefer.promise
        };
    };

    App.factories.DataHandler = function () {
        return {
            objectToArray: function (obj) {
                var result = obj;
                if (!angular.isArray(obj)) {
                    result = [];
                    angular.forEach(obj, function (val) {
                        result.push(val);
                    });
                }

                return result;
            },
            getDiffArray: function(array1, array2) {
                return array1.filter(function(value) {
                    for (var i = 0; i <= array2.length; i++) {
                        if (value === array2[i]) {
                            return false;
                        }
                    }
                    return true;
                });
            }
        };
    };

    angular
        .module('qsHub')
        .factory('NotifierFactory', ['toaster', App.factories.Notifier])
        .factory('InstitutionFactory', ['TimeService', App.factories.Institution])
        .factory('UserFactory', ['DataHandlerFactory', App.factories.User])
        .factory('TuProfileFactory', [App.factories.TuProfile])
        .factory('SharedProfileFactory', [App.factories.SharedProfile])
        .factory('TuProfileHistoryLogFactory', [App.factories.TuProfileHistoryLog])
        .factory('MapInitializerFactory', ['$window', '$q', App.factories.MapInitializer])
        .factory('DataHandlerFactory', [App.factories.DataHandler]);

}(window.angular));
