/* global google */
(function(angular) {
    "use strict";
    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.campusesList = function (
        $scope,
        $resource,
        NgTableParams,
        constants,
        InstitutionsListService,
        CampusesService,
        NotifierFactory,
        SharedProfileFactory,
        MapInitializerFactory,
        InstitutionsListFactory,
        WatchService
    ) {
        var controller = this,
            newlyAdded,
            alreadyInitialised = false,
            notificationTitle = 'Campus';

        $scope.refreshMapInProgress = false;

        InstitutionsListService.getCountries().then(function (list) {
            controller.countriesList = list;
        });
        /**
         * Required to prevent selecting campus with null id (had
         * ng-class="{'active': campus.id == selectedCampusId}
         */
        $scope.selectedCampusId = false;

        controller.resetColumns = function () {
            angular.forEach($scope.columns, function (column, key) {
                column.show = SharedProfileFactory.getColumns()[key].show;
            });
        };

        $scope.campusesToDelete = {};
        $scope.deleteInProgress = false;
        $scope.showCampusInfoBlock = false;
        // reset values if user visits repeatedly edit campus and navigates out without reload
        SharedProfileFactory.setInstitutionListShowCampusInfoBlock($scope.showCampusInfoBlock);

        $scope.columns = [
            {
                title: 'Delete',
                show: true,
                field: 'delete',
                headerTemplateURL: 'ng-table/templates/campus/delete-header.html'
            },
            {
                title: 'Name',
                show: true,
                field: 'name'
            },
            {
                title: 'Address',
                show: true,
                field: 'addressLine'
            },
            {
                title: 'Postcode',
                show: true,
                field: 'postcode'
            },
            {
                title: 'Town/City',
                show: true,
                field: 'city'
            },
            {
                title: 'Country',
                show: false,
                field: 'country'
            },
            {
                title: 'Country Name',
                show: true,
                field: 'countryName'
            },
            {
                title: 'Primary Campus',
                show: false,
                field: 'primary'
            },
            {
                title: 'Primary Campus',
                show: true,
                field: 'primaryName'
            },
            {
                title: 'Order',
                show: false,
                field: 'order'
            },
        ];

        SharedProfileFactory.setColumns($scope.columns);
        $scope.campusMap = null;

        var hiddenColumns = [];
        angular.forEach($scope.columns, function (column) {
            if (!column.show) {
                hiddenColumns.push(column);
            }
        });
        $scope.hiddenColumns = hiddenColumns;

        /**
         * Render campus in google map.
         */
        controller.renderMap = function () {
            var campus = SharedProfileFactory.getCampus();
            if (!campus.latitude) {
                campus.latitude = null;
            }
            if (!campus.longitude) {
                campus.longitude = null;
            }
            SharedProfileFactory.setCampus(campus);
            var campusLatitude = campus.latitude,
                campusLongitude = campus.longitude;
            if (campusLatitude === null || campusLongitude === null) {
                campusLatitude = 0;
                campusLongitude = 0;
            }
            var googleMapsLatLng = new google.maps.LatLng({
                lat: parseFloat(campusLatitude),
                lng: parseFloat(campusLongitude)
            });
            $scope.campusMap.panTo(googleMapsLatLng);
            $scope.campusMap.setOptions({
                //center: googleMapsLatLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                draggable: true
            });
            if (controller.googleMapsMarker) {
                controller.googleMapsMarker.setMap(null);
            }
            controller.googleMapsMarker = new google.maps.Marker({
                map: $scope.campusMap,
                position: googleMapsLatLng,
                draggable: true
            });

            google.maps.event.addListener(controller.googleMapsMarker, 'dragend', function (event) {
                $scope.campusMap.panTo(event.latLng);
                campus.autoGenerate = false;
                campus.latitude = event.latLng.lat();
                campus.longitude = event.latLng.lng();
                google.maps.event.trigger($scope.campusMap, 'resize');
                $scope.campusMap.setCenter(controller.googleMapsMarker.getPosition());
                $scope.campus = campus;
                $scope.$apply(); // otherwise the changes are not updated on sidebar
            });

            /**
             * This fixes the bug when user already visited campus edit page,
             * then navigated out, then returned to campuses edit page.
             */
            $scope.campusMap.addListener('idle', function() {
                if (newlyAdded) {
                    google.maps.event.trigger($scope.campusMap, 'resize');
                    $scope.campusMap.setCenter(controller.googleMapsMarker.getPosition());
                    newlyAdded = false;
                }
            });
        };

        /**
         * Initialise google maps.
         */
        controller.initialiseMap = function () {
            if (!$scope.campusMap) {
                MapInitializerFactory.initStart();
            }
            MapInitializerFactory.mapsInitialized
                .then(function() {
                    if (null === $scope.campusMap) {
                        $scope.campusMap = new google.maps.Map(document.getElementById("campusMap"), {
                            zoom: 15,
                            mapTypeId: google.maps.MapTypeId.ROADMAP,
                            draggable: true
                        });
                        newlyAdded = true;
                    }
                    controller.renderMap();
                });
        };

        /**
         * Actions to do when data grid row is clicked.
         *
         * @param {object} campus
         * @param {boolean} mapInit
         */
        $scope.handleDataGridRowClickCampus = function (campus) {
            $scope.submitted = false;
            // create new copy of campus for making changes in it
            var campusCopy = angular.copy(campus);
            SharedProfileFactory.setCampus(campusCopy);

            $scope.selectedCampusId = $scope.selectedCampusId === campusCopy.id ? false : campusCopy.id;
            $scope.campus = campusCopy;
            SharedProfileFactory.setCampus(campusCopy);
            $scope.lat = campusCopy.latitude;
            $scope.log = campusCopy.longitude;
            $scope.displayMap = true;
            $scope.showCampusInfoBlock = $scope.selectedCampusId === campusCopy.id;
            SharedProfileFactory.setInstitutionListShowCampusInfoBlock($scope.showCampusInfoBlock);
            if ($scope.selectedCampusId === campusCopy.id) {
                angular.forEach($scope.columns, function (column) {
                    if (column.field === 'name') {
                        return;
                    }
                    column.show = false;
                });
            } else {
                controller.resetColumns();
            }
            controller.initialiseMap();
        };

        /**
         * Store organisation details.
         */
        $scope.handleCampusSubmit = function () {
            if ($scope.campusSubmitInProgress ||
                !$scope.forms.campusDetailsForm ||
                !$scope.forms.campusDetailsForm.$valid
            ) {
                $scope.submitted = true;
                NotifierFactory.show(
                    'error',
                    'Error: Please fill in all required fields',
                    notificationTitle
                );

                return false;
            }
            $scope.campusSubmitInProgress = true;
            InstitutionsListService.saveCampus($scope.institution.id, $scope.campus)
                .then(function (success) {
                    $scope.campusSubmitInProgress = false;
                    NotifierFactory.show(
                        success ? 'success' : 'error',
                        success ? 'Saved successfully!' : 'Saving failed!',
                        notificationTitle
                    );
                    /**
                     * Update generated data grid fields
                     */
                    if (success) {
                        if (angular.isUndefined($scope.campus.id)) {
                            $scope.campus.id = success.insertedId;
                            if (!angular.isArray($scope.institution.campus)) {
                                $scope.institution.campus = [];
                            }
                            $scope.institution.campus.push($scope.campus);
                            $scope.selectedCampusId = $scope.campus.id;
                            $scope.showCampusInfoBlock = true;
                        }
                        if (angular.isDefined(success.coordinates)) {
                            $scope.campus.latitude = success.coordinates.latitude;
                            $scope.campus.longitude = success.coordinates.longitude;
                            SharedProfileFactory.setMapUpdateRequest(Math.random());
                        }
                        angular.forEach($scope.institution.campus, function(campus, index) {
                            if (campus.id === $scope.campus.id) {
                                $scope.institution.campus[index] = angular.copy($scope.campus);
                                $scope.institution.campus[index].addressLine = InstitutionsListService.getCampusAddress(
                                    $scope.campus
                                );
                                $scope.campus.addressLine = $scope.institution.campus[index].addressLine;
                                $scope.institution.campus[index].primaryName = InstitutionsListService.getCampusIsPrimary(
                                    $scope.campus
                                );
                                $scope.campus.primaryName = $scope.institution.campus[index].primaryName;
                                InstitutionsListService.getCountryNameByCode($scope.campus.country).then(function (countryName) {
                                    $scope.institution.campus[index].countryName = countryName;
                                });
                            } else {
                                if ($scope.campus.primary) {
                                    $scope.institution.campus[index].primary = false;
                                    $scope.institution.campus[index].primaryName = InstitutionsListService.getCampusIsPrimary(
                                        $scope.institution.campus[index]
                                    );
                                }
                            }
                        });
                        controller.reloadDatagrid();
                        InstitutionsListService.syncCampuses($scope.institution);
                        InstitutionsListFactory.setReloadInstitutionList(true);
                    }
            });
        };

        /**
         * Sortable options
         */
        $scope.sortableOptions = {
            disabled: false,
            'ui-floating': false,
            start: function () {
                controller.initialList = [];
                controller.initialList = angular.copy($scope.institution.campus);
            },
            stop: function () {
                $scope.sortableOptions.disabled = true;
                // change campuses order
                controller.reOrderCampuses();
                InstitutionsListService.saveOrder($scope.institution.id, $scope.institution.campus)
                    .then(function (success) {
                        NotifierFactory.show(
                            success ? 'success' : 'error',
                            success ? ' Order saved successfully!' : 'Saving order failed!',
                            notificationTitle
                        );
                        if (!success) {
                            $scope.institution.campus = controller.initialList;
                        } else {
                            InstitutionsListService.syncCampuses($scope.institution);
                        }
                    })
                    .finally(function () {
                        $scope.sortableOptions.disabled = false;
                    });
            }
        };

        controller.getCampusesToDelete = function () {
            var campusIds = [];
            if ($scope.campusesToDelete) {
                angular.forEach($scope.campusesToDelete, function (remove, id) {
                    if (remove) {
                        campusIds.push(id);
                    }
                });
            }

            return campusIds;
        };

        controller.hasCampusesToDelete = function () {
            var departmentsIds = controller.getCampusesToDelete();
            return departmentsIds.length !== 0;
        };

        $scope.isDeleteButtonDisabled = function () {
            return $scope.deleteInProgress ||
                !controller.hasCampusesToDelete();
        };

        /**
         * Actions to do when campuses delete button is clicked.
         *
         * @returns {boolean}
         */
        $scope.handleDeleteClick = function () {
            if ($scope.deleteInProgress || !controller.hasCampusesToDelete()) {
                return false;
            }
            // set deletion in progress
            $scope.deleteInProgress = true;
            // get campuses ids to delete
            var campusIds = controller.getCampusesToDelete();
            // request deletion on server side
            InstitutionsListService.deleteCampuses($scope.institution.id, campusIds).then(function (success) {
                if (success) {
                    // reset deletable campuses list
                    $scope.campusesToDelete = {};
                    // remove campuses from institution instance
                    angular.forEach(campusIds, function (campusId) {
                        angular.forEach($scope.institution.campus, function (campus, key) {
                            if (campus.id === campusId) {
                                delete $scope.institution.campus[key];
                            }
                        });
                    });
                    $scope.institution.campus = $scope.institution.campus.filter(function (item) {
                        return item !== 'undefined';
                    });
                    // reload campuses datagrid
                    controller.reloadDatagrid();

                    InstitutionsListService.syncCampuses($scope.institution);
                }
                $scope.deleteInProgress = false;
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Deleted successfully!' : 'Deletion failed!',
                    notificationTitle
                );
            });
        };

        controller.reloadDatagrid = function () {
            $scope.tableParams.reload();
        };

        /**
         * Assigns new order for campuses starting with 1.
         */
        controller.reOrderCampuses = function () {
            var assignedOrder = 1;
            for (var index = 0; index < $scope.institution.campus.length; index++) {
                $scope.institution.campus[index].order = assignedOrder;
                assignedOrder++;
            }
        };

        $scope.getMode = function () {
            return $scope.showCampusInfoBlock && $scope.selectedCampusId;
        };

        /**
         * Actions to do on add button click.
         */
        $scope.handleAddClick = function () {
            if ($scope.selectedCampusId) {
                SharedProfileFactory.setInstitutionListShowCampusInfoBlock(true);
            } else {
                SharedProfileFactory.setInstitutionListShowCampusInfoBlock(!$scope.showCampusInfoBlock);
            }
            $scope.selectedCampusId = false;
            angular.forEach($scope.columns, function (column) {
                if (column.field === 'name') {
                    return;
                }
                column.show = false;
            });
            $scope.campus = {
                displayInFrontEnd: true
            };
            if (!$scope.campus.latitude) {
                $scope.lat = $scope.campus.latitude = null;
            }
            if (!$scope.campus.longitude) {
                $scope.log = $scope.campus.longitude = null;
            }
            SharedProfileFactory.setCampus($scope.campus);
            $scope.displayMap = true;
            controller.initialiseMap();
        };

        $scope.coordinatesChanged = function () {
            SharedProfileFactory.setMapUpdateRequest(Math.random());
        };

        /**
         * Displays a message based on success.
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

        /**
         * Get coordinates callback.
         *
         * @param {Array }response
         */
        controller.getCoordinatesByCampusCallback = function (response) {
            if (response) {
                if (angular.isArray(response) && !angular.isObject(response[0]) && !angular.isObject(response[1])) {
                    $scope.campus.latitude = response[0];
                    $scope.campus.longitude = response[1];
                    SharedProfileFactory.setMapUpdateRequest(Math.random());
                    SharedProfileFactory.announceCampusesChanges($scope.campus.id);
                    controller.coordinatesUpdated('success', 'Coordinates updated!');
                } else {
                    controller.coordinatesUpdated('warning', 'Address not found!');
                }
            } else {
                controller.coordinatesUpdated('error', 'Error requesting coordinates!');
            }
            $scope.refreshMapInProgress = false;
        };

        /**
         * Refresh map function.
         */
        controller.refreshMap = function () {
            $scope.refreshMapInProgress = true;
            if ($scope.campus.autoGenerate) { // generate map by address fields
                CampusesService.getCoordinatesByCampus($scope.campus).then(
                    controller.getCoordinatesByCampusCallback
                );
            } else {  // generate map by coordinates
                // announce map reload request
                SharedProfileFactory.setMapUpdateRequest(Math.random());
                //SharedProfileFactory.announceCampusesChanges($scope.campus.id);
                $scope.refreshMapInProgress = false;
            }
        };

        /**
         * Initialise datagrid.
         */
        controller.initDataGrid = function () {
            $scope.tableParams = new NgTableParams({
                page: 1, // show first page
                count: 1000 // count per page
            }, {
                filterDelay: 0,
                getData: function() {
                    return $scope.institution.campus;
                }
            });
            alreadyInitialised = true;
        };

        /**
         * Initialise watches & events.
         */
        controller.initWatches = function () {
            // re-check the campus values and trigger map update
            WatchService.create($scope, SharedProfileFactory.mapUpdateRequest, function (newValue) {
                if (newValue && newValue !== null) {
                    if (angular.isDefined($scope.campus) &&
                        angular.isDefined($scope.campus.latitude) &&
                        angular.isDefined($scope.campus.longitude) &&
                        null !== $scope.campus
                    ) {
                        var campus = $scope.campus;
                        var intLatitude = parseInt(campus.latitude, 10),
                            intLongitude = parseInt(campus.longitude, 10);
                        if (-90 <= intLatitude && intLatitude <= 90 &&
                            -180 <= intLongitude && intLongitude <= 180) {
                            var googleMapsLatLng = new google.maps.LatLng({
                                lat: parseFloat(campus.latitude),
                                lng: parseFloat(campus.longitude)
                            });
                            if (angular.isDefined(controller.googleMapsMarker)) {
                                controller.googleMapsMarker.setPosition(googleMapsLatLng);
                                google.maps.event.trigger($scope.campusMap, 'resize');
                                $scope.campusMap.setCenter(controller.googleMapsMarker.getPosition());
                            }
                        }
                    }

                }
            });

            // watch to active institution changes
            WatchService.create($scope, 'institution.id', function (newId, oldId) {
                if (newId && newId !== oldId) {
                    $scope.campusesToDelete = {};
                    controller.reloadDatagrid();
                }
            });

            // listen to campus edit/add visibility changes
            WatchService.create($scope, SharedProfileFactory.getInstitutionListShowCampusInfoBlock, function (show) {
                if (!show) {
                    $scope.selectedCampusId = false;
                    controller.resetColumns();
                }
                $scope.showCampusInfoBlock = show;
            });
        };

        /**
         * Initialise controller.
         */
        controller.init = function () {
            controller.initWatches();
            controller.initDataGrid();
        };

        // listen to departments tab visibility changes
       
        var cancelInitWatch =  WatchService.create($scope, InstitutionsListFactory.isCampusesTabSelected, function (isActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive) {
                alreadyInitialised = true;
                controller.init();
                cancelInitWatch();
            }
        });

        /**
         * Display on front end switch clicked.
         */
        controller.displayOnFrontEndClick = function () {
            if ($scope.campus.displayInFrontEnd &&
                (($scope.campus.longitude === null || !$scope.campus.longitude) ||
                ($scope.campus.latitude === null || !$scope.campus.latitude))
            ) {
                $scope.campus.autoGenerate = true;
            }
        };
    };

    angular
        .module('qsHub')
        .controller('CampusesListController', [
            '$scope',
            '$resource',
            'NgTableParams',
            'constants',
            'InstitutionsListService',
            'CampusesService',
            'NotifierFactory',
            'SharedProfileFactory',
            'MapInitializerFactory',
            'InstitutionsListFactory',
            'WatchService',
            App.controllers.campusesList,
        ]);
}(window.angular));
