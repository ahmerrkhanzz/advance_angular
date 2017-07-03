(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { factories: {} });

    App.factories.TmProfile = function(
        TmProfileOverviewHistoryLogFactory
    ) {
        var data = {},
            program = {},
            backend = false,
            readOnly = false,
            selectedTabId = null,
            selectedMediaSubTabId = null,
            upgradeFormVisible = false,
            deletedProgramId = null,
            directoryVal = false,
            updatedProgramId = null,
            programAddFormVisible = false,
            programEditFormVisible = false,
            programSubscribeFormVisible = false,
            deleteFormVisible = false,
            programUpgradeFormVisible = false,
            programBeforeChanges = {},
            newProgram = false,
            programsDatagridReload = false,
            isUpgraded = false,
            profileTabs = {
                overview: 0,
                programs: 1,
                media: 2,
                publish: 3,
                programStats: 4
            },
            mediaTabs = {
                images: 1,
                video: 2,
                social: 3,
                brochures: 4
            },
            activeOverviewSubTabs = {
                'overview': true,
                'faq': false
            };

        return {
            setData: function(newData) {
                data = newData;
            },
            getData: function() {
                return data;
            },
            getProfileTabs : function () {
                return profileTabs;
            },
            setBackend: function (isBackend) {
                backend = isBackend;
            },
            isBackend: function () {
                return !!backend;
            },
            setReadOnly: function (isReadOnly) {
                readOnly = isReadOnly;
            },
            isReadOnly: function () {
                return !!readOnly;
            },
            reset: function() {
                data = {};
                program = {};
                newProgram = false;
                selectedMediaSubTabId = null;
                selectedTabId = null;
            },
            getId: function() {
                return data !== null && data.id || '';
            },
            getProgram: function() {
                return program;
            },
            setProgram: function (selectedProgram) {
                program = selectedProgram;
            },
            getProgramId: function () {
                return program && program.id ? program.id : null;
            },
            setSelectedTabId: function(newSelectedTabId) {
                selectedTabId = newSelectedTabId;
            },
            isProgramsTabSelected: function() {
                return (typeof selectedTabId !== 'undefined') && selectedTabId === profileTabs.programs;
            },
            isStatsTabSelected: function() {
                return (typeof selectedTabId !== 'undefined') && selectedTabId === profileTabs.programStats;
            },
            isPublishTabSelected: function() {
                return (typeof selectedTabId !== 'undefined') && selectedTabId === profileTabs.publish;
            },
            isOverviewTabSelected: function() {
                return (typeof selectedTabId !== 'undefined') && selectedTabId === profileTabs.overview;
            },
            isMediaTabSelected: function() {
                return (typeof selectedTabId !== 'undefined') && selectedTabId === profileTabs.media;
            },
            getOverviewTabId: function() {
                return profileTabs.overview;
            },
            setActiveOverviewSubTabs : function (newSubTabs) {
                if (angular.isDefined(newSubTabs)) {
                    if (angular.equals(0, newSubTabs)) {
                        activeOverviewSubTabs.overview = true;
                    }
                    if (angular.equals(1, newSubTabs)) {
                        activeOverviewSubTabs.overview = false;
                    }
                }
            },
            getActiveOverviewSubTabs : function () {
                return activeOverviewSubTabs;
            },
            isMediaImagesSubTabSelected: function() {
                return (typeof selectedMediaSubTabId !== 'undefined') && selectedMediaSubTabId === mediaTabs.images;
            },
            isMediaVideosSubTabSelected: function() {
                return (typeof selectedMediaSubTabId !== 'undefined') && selectedMediaSubTabId === mediaTabs.video;
            },
            isMediaSocialSubTabSelected: function() {
                return (typeof selectedMediaSubTabId !== 'undefined') && selectedMediaSubTabId === mediaTabs.social;
            },
            isMediaBrochuresSubTabSelected: function() {
                return (typeof selectedMediaSubTabId !== 'undefined') && selectedMediaSubTabId === mediaTabs.brochures;
            },
            getSelectedMediaSubTabId: function() {
                return selectedMediaSubTabId;
            },
            setSelectedMediaSubTabId: function(newSelectedSubTabId) {
                selectedMediaSubTabId = newSelectedSubTabId;
            },
            setMediaImagesSubTabSelected: function() {
                selectedMediaSubTabId = mediaTabs.images;
            },
            announceNewProgram: function (newProgramId) {
                newProgram = newProgramId;
            },
            hasNewProgram: function () {
                return newProgram;
            },
            announceProgramDeletion: function (newProgramId) {
                deletedProgramId = newProgramId;
            },
            hasDeletedProgram: function () {
                return !!deletedProgramId;
            },
            clearDeletedProgram: function () {
                deletedProgramId = null;
            },
            announceProgramUpdate: function (newProgramId) {
                updatedProgramId = newProgramId;
            },
            hasUpdatedProgram: function () {
                return !!updatedProgramId;
            },
            clearProgramUpdate: function () {
                updatedProgramId = null;
            },
            isRightSidePanelActive: function () {
                return programEditFormVisible || programAddFormVisible || deleteFormVisible || programUpgradeFormVisible;
            },
            setProgramBeforeChanges: function (programInstance) {
                programBeforeChanges = programInstance;
            },
            getProgramBeforeChanges: function () {
                return programBeforeChanges;
            },
            setUpgradeSubscription: function (val) {
                isUpgraded = val;
            },
            isUpgradedSubscriptions: function () {
                return isUpgraded;
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

                programAddFormVisible = false;
                programSubscribeFormVisible = false;
                upgradeFormVisible = false;
                deleteFormVisible = false;
                programUpgradeFormVisible = false;
                TmProfileOverviewHistoryLogFactory.closeAll();
            },
            isProgramEditFormVisible: function (activeTab) {
                if (typeof activeTab === 'undefined') {
                    return false;
                }
                return (activeTab === profileTabs.programs) && programEditFormVisible;
            },
            getProgramEditFormVisibility: function () {
                return programEditFormVisible;
            },
            /**
             * Set new program form visibility.
             *
             * @param {boolean|null} visibility
             */
            setProgramAddFormVisibility: function(visibility) {
                if (typeof visibility === 'undefined') {
                    visibility = !programAddFormVisible;
                }
                programAddFormVisible = visibility;

                programEditFormVisible = false;
                programSubscribeFormVisible = false;
                upgradeFormVisible = false;
                deleteFormVisible = false;
                programUpgradeFormVisible = false;
                TmProfileOverviewHistoryLogFactory.closeAll();
            },
            /**
             * Is new program form visible?
             *
             * @param {Integer} activeTab
             * @returns {boolean}
             */
            isProgramAddFormVisible: function(activeTab) {
                if (typeof activeTab === 'undefined') {
                    return false;
                }

                return (activeTab === profileTabs.programs) && programAddFormVisible;
            },

            /**
             * Set subscribe form visibility.
             *
             * @param {boolean|null} visibility
             */
            setProgramSubscribeFormVisibility: function(visibility) {
                if (typeof visibility === 'undefined') {
                    visibility = !programSubscribeFormVisible;
                }
                programSubscribeFormVisible = visibility;
            },

            getProgramSubscribeFormVisibility: function() {
                return programSubscribeFormVisible;
            },

            /**
             * Get new program form visibility.
             *
             * @param {boolean|null} visibility
             */
            getProgramAddFormVisibility: function() {
                return programAddFormVisible;
            },
            setUpgradeFormVisibility: function(visibility) {
                if (typeof visibility === 'undefined') {
                    visibility = !upgradeFormVisible;
                }
                upgradeFormVisible = visibility;

                programEditFormVisible = false;
                programAddFormVisible = false;
                deleteFormVisible = false;
                programUpgradeFormVisible = false;
                //TmProfileOverviewHistoryLogFactory.closeAll();

            },
            isUpgradeFormVisible: function(activeTab) {
                if (typeof activeTab === 'undefined') {
                    return false;
                }

                return (
                    activeTab === profileTabs.programs ||
                    activeTab === profileTabs.media ||
                    activeTab === profileTabs.overview
                 ) && upgradeFormVisible;
            },
            setDeleteFormVisibility: function(visibility) {
                if (typeof visibility === 'undefined') {
                    visibility = !deleteFormVisible;
                }
                deleteFormVisible = visibility;

                programEditFormVisible = false;
                programAddFormVisible = false;
                upgradeFormVisible = false;
                programUpgradeFormVisible = false;
                TmProfileOverviewHistoryLogFactory.closeAll();
            },
            isDeleteFormVisible: function(activeTab) {
                if (typeof activeTab === 'undefined') {
                    return false;
                }

                return activeTab === profileTabs.programs && deleteFormVisible;
            },
            setProgramUpgradeFormVisibility: function(visibility) {
                if (typeof visibility === 'undefined') {
                    visibility = !programUpgradeFormVisible;
                }
                programUpgradeFormVisible = visibility;

                programEditFormVisible = false;
                programAddFormVisible = false;
                upgradeFormVisible = false;
                deleteFormVisible = false;
                TmProfileOverviewHistoryLogFactory.closeAll();
            },
            isProgramUpgradeFormVisible: function(activeTab) {
                if (typeof activeTab === 'undefined') {
                    return false;
                }

                return activeTab === profileTabs.programs && programUpgradeFormVisible;
            },
            closeRightSidePanels: function () {
                // close history logs
                TmProfileOverviewHistoryLogFactory.closeAll();
                // close upgrade form
                upgradeFormVisible = false;
                // close program edit form
                programEditFormVisible = false;
                // close program add form
                programAddFormVisible = false;
            },
            resetProgramsDatagridReload: function () {
                programsDatagridReload = false;
            },
            requestProgramsDatagridReload: function() {
                programsDatagridReload = true;
            },
            isProgramsDatagridReload: function () {
                return programsDatagridReload;
            },
            setDirectory: function(newVal){
                directoryVal = newVal;
            },
            isDirectory: function(){
                return directoryVal;
            }
        };
    };

    angular
        .module('qsHub')
        .factory('TmProfileFactory', [
            'TmProfileOverviewHistoryLogFactory',
            App.factories.TmProfile
        ]);

}(window.angular));
