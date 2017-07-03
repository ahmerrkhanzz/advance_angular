(function (angular, moment) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.institutionsListStatus = function (
        $scope,
        constants,
        InstitutionsListFactory,
        InstitutionsListService,
        WatchService
    ) {
        var controller = this;

        controller.handleInstitutionChange = function (institution) {
            if (!institution) {
                return;
            }
            controller.institution = angular.copy(institution);
            controller.setType();
            controller.setCountry();
            controller.setBelongsTo();
            controller.setTuRegion();
            controller.setTmRegion();

            controller.isAdvancedProgram = InstitutionsListService.isAdvancedProgram(controller.institution.typeId);
        };

        controller.setType = function () {
            angular.forEach(controller.typesList, function (item) {
                if (item.value === controller.institution.typeId) {
                    controller.institution.type = item.label;
                }
            });
        };

        controller.setCountry = function () {
            angular.forEach(controller.countryList, function (item) {
                if (item.countryCode === controller.institution.countryCode) {
                    controller.institution.country = item.name;
                }
            });
        };

        controller.setBelongsTo = function () {
            angular.forEach(controller.belongsToList, function (item) {
                if (item.id === controller.institution.belongsTo) {
                    controller.institution.belongsToName = item.title;
                }
            });
        };

        controller.setTuRegion = function () {
            angular.forEach(controller.tuRegionsList, function (item) {
                if (item.tid === controller.institution.drupalTuRegionId) {
                    controller.institution.tuRegion = item.name;
                }
            });
        };

        controller.setTmRegion = function () {
            angular.forEach(controller.tmRegionsList, function (item) {
                if (item.tid === controller.institution.drupalTmRegionId) {
                    controller.institution.tmRegion = item.name;
                }
            });
        };

        controller.initLists = function () {
            controller.typesList = [];
            InstitutionsListService.getTypeFilterData(true).then(function (results) {
                controller.typesList = results;
                controller.setType();
            });
            controller.countryList = [];
            InstitutionsListService.getCountries().then(function (results) {
                controller.countryList = results;
                controller.setCountry();
            });
            controller.belongsToList = InstitutionsListService.getBelongsToList();
            InstitutionsListService.getTuRegions().then(function (list) {
                controller.tuRegionsList = list;
                controller.setTuRegion();
            });
            InstitutionsListService.getTmRegions().then(function (list) {
                controller.tmRegionsList = list;
                controller.setTmRegion();
            });
        };

        controller.initWatches = function () {
            WatchService.create($scope, 'institutionBeforeChanges', controller.handleInstitutionChange);
        };

        controller.init = function () {
            controller.initWatches();
            controller.initLists();
        };

        // listen to subscriptions tab visibility changes
        var cancelTabWatch = WatchService.create(
            $scope,
            InstitutionsListFactory.isStatusTabSelected,
            function (selected) {
                if (selected) {
                    cancelTabWatch();
                    controller.init();
                }
            }
        );
    };

    angular
        .module('qsHub')
        .controller('InstitutionsListStatusController', [
            '$scope',
            'constants',
            'InstitutionsListFactory',
            'InstitutionsListService',
            'WatchService',
            App.controllers.institutionsListStatus
        ]);

} (window.angular, window.moment));
