(function(angular) {
    "use strict";
    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.SharedProfileCampuses = function (
        $scope,
        NgTableParams,
        constants,
        CampusesService,
        SharedProfileService,
        InstitutionsListService,
        NotifierFactory,
        SharedProfileFactory,
        InstitutionFactory,
        MapInitializerFactory,
        WatchService
    ) {
        var controller = this,
            alreadyInitialised = false,
            newlyAdded = false;
        controller.devMode = constants.dev;
        controller.googleMapsMarker = null;
        controller.noCache = false;

        $scope.isQsUser = true; // @todo replace with real data
        $scope.campusesInEventsInclusionDisbaled = false;
        $scope.loadInProgress = true;
        $scope.displayMapBlock = false;
        $scope.selectedCampusId = null;
        $scope.mapMarkers = [];
        $scope.campusesToDelete = {};
        $scope.deleteInProgress = false;
        $scope.columns = [
            {
                title: 'Delete',
                show: true,
                field: 'delete',
                headerTemplateURL: 'ng-table/templates/campus/delete-header.html'
            },
            {
                title: 'Campus Name',
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
                title: 'Latitude',
                show: true,
                field: 'latitude'
            },
            {
                title: 'Longitude',
                show: true,
                field: 'longitude'
            },
            {
                title: 'Country Name',
                show: true,
                field: 'countryName'
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
            }
        ];
        $scope.campusMap = null;

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
         * Actions to do on add button click
         */
        $scope.handleAddClick = function () {
            SharedProfileFactory.setCampus({
                displayInFrontEnd: true
            });
            SharedProfileFactory.setCampusAddFormVisibility();
            $scope.displayMapBlock = false;
            $scope.selectedCampusId = null;
            if (SharedProfileFactory.isCampusFormVisible() && !SharedProfileFactory.isCampusEditForm()) {
                controller.initialiseMap();
                $scope.displayMapBlock = true;
            }
        };

        /**
         * Actions to do when data grid row is clicked.
         *
         * @param {Object} campus
         */
        $scope.handleDatagridRowClick = function (campus) {
            $scope.selectedCampusId = ($scope.selectedCampusId === campus.id) ? null : campus.id;

            // create new copy of campus for making changes in it
            var campusCopy = angular.copy(campus);
            SharedProfileFactory.setCampus(campusCopy);

            SharedProfileFactory.setCampusEditFormVisibility(
                $scope.selectedCampusId === campus.id && campus.id !== 'undefined'
            );
            $scope.displayMapBlock = true;
            controller.initialiseMap();
        };

        /**
         * Actions to do when campuses are included/excluded from events pages.
         */
        $scope.handleIncludeInEventsClick = function () {
            // indicate progress
            $scope.campusesInEventsInclusionDisbaled = true;
            // store changes
            SharedProfileService.update($scope.sharedProfile.id, {
                campusesOnEvents: $scope.sharedProfile.campusesOnEvents
            }).then(function (success) {
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Success!' : 'Failure!',
                    $scope.sharedProfile.campusesOnEvents ? 'Including campuses on events pages' : 'Excluding campuses on events pages'
                );
                // indicate progress end
                $scope.campusesInEventsInclusionDisbaled = false;
            });
        };

        /**
         * Sortable options
         */
        $scope.sortableOptions = {
            disabled: false,
            'ui-floating': false,
            stop: function () {
                $scope.sortableOptions.disabled = true;
                // change campuses order
                controller.reOrderCampuses();
                InstitutionsListService.saveOrder(InstitutionFactory.getId(), $scope.tableParams.data)
                    .then(function (success) {
                        NotifierFactory.show(
                            success ? 'success' : 'error',
                            success ? ' Order saved successfully!' : 'Saving order failed!',
                            'Campus'
                        );
                    })
                    .finally(function () {
                        $scope.sortableOptions.disabled = false;
                    });
            }
        };

        /**
         * Assigns new order for campuses starting with 1.
         */
        controller.reOrderCampuses = function () {
            var assignedOrder = 1;
            for (var index = 0; index < $scope.tableParams.data.length; index++) {
                $scope.tableParams.data[index].order = assignedOrder;
                assignedOrder++;
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
            var campusIds = controller.getCampusesToDelete();
            $scope.deleteInProgress = true;
            CampusesService.deleteCampuses(InstitutionFactory.getId(), campusIds).then(function (success) {
                $scope.deleteInProgress = false;
                if (success) {
                    // Check if current campus form belonged to one of the deleted campuses
                    for (var objectId in $scope.campusesToDelete) {
                        if (objectId === $scope.selectedCampusId) {
                            SharedProfileFactory.setCampusFormVisibility(false);
                            break;
                        }
                    }
                    $scope.campusesToDelete = {};
                    // reload campus datagrid
                    controller.noCache = true;
                    $scope.tableParams.reload();
                }
                NotifierFactory.show(
                    success ? 'success' : 'error',
                    success ? 'Deleted successfully!' : 'Deletion failed!',
                    'Campus'
                );
            });
        };

        controller.initWatches = function () {
            // watch for campuses list changes
            WatchService.create($scope, SharedProfileFactory.hasCampusesChanges, function (newValue) {
                if (newValue) {
                    controller.noCache = true;
                    $scope.campusesToDelete = {};
                    $scope.tableParams.reload();
                    $scope.selectedCampusId = newValue;
                }
            });

            // watch for campus form changes
            WatchService.create($scope, SharedProfileFactory.isCampusFormVisible, function (newValue) {
                // actions to do when form is not visible anymore
                if (!newValue) {
                    // reset selected campus ID
                    $scope.selectedCampusId = null;
                    // hide google maps
                    $scope.displayMapBlock = false;
                }
            });

            // Re-check the campus values and trigger map update
            WatchService.create($scope, SharedProfileFactory.mapUpdateRequest, function (newValue) {
                if (newValue && newValue !== null) {
                    var campus = SharedProfileFactory.getCampus(),
                        intLatitude,
                        intLongitude;
                    if (campus.latitude === null || campus.longitude === null) {
                        intLatitude = null;
                        intLongitude = null;
                    } else {
                        intLatitude = parseInt(campus.latitude, 10);
                        intLongitude = parseInt(campus.longitude, 10);
                    }

                    // check if latitude and longitude are correct
                    if (intLatitude === null || intLongitude === null ||
                        intLatitude < -90 || intLatitude > 90 ||
                        intLongitude < -180 || intLongitude > 180
                    ) {
                        return;
                    }

                    var googleMapsLatLng = new google.maps.LatLng({
                        lat: parseFloat(campus.latitude),
                        lng: parseFloat(campus.longitude)
                    });
                    if (null !== controller.googleMapsMarker) {
                        controller.googleMapsMarker.setPosition(googleMapsLatLng);
                        google.maps.event.trigger($scope.campusMap, 'resize');
                        $scope.campusMap.setCenter(controller.googleMapsMarker.getPosition());
                    }
                }
            });
        };

        controller.initDataGrid = function () {
            // get institution campuses
            $scope.tableParams = new NgTableParams({
                page: 1, // show first page
                count: 200, // count per page
                coreId: InstitutionFactory.getCoreId()
            }, {
                counts: [],
                debugMode: constants.dev,
                getData: function (params) {
                    var results = CampusesService.getCampusList(params, controller.noCache);
                    controller.noCache = false;

                    return results;
                }
            });
        };

        controller.initEvents = function () {
            $scope.$on(constants.events.institutionSharedProfileChanges, function() {
                alreadyInitialised = false;
                if (SharedProfileFactory.isCampusesTabSelected()) {
                    controller.initDataGrid();
                    alreadyInitialised = true;
                }
                $scope.campusesToDelete = {};
            });
        };

        controller.init = function () {
            controller.initWatches();
            controller.initEvents();
            controller.initDataGrid();
        };

        // listen to departments tab visibility changes
        WatchService.create($scope, SharedProfileFactory.isCampusesTabSelected, function (isActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive) {
                controller.init();
                alreadyInitialised = true;
            }
        });
    };

    angular
        .module('qsHub')
        .controller('SharedProfileCampusesController', [
            '$scope',
            'NgTableParams',
            'constants',
            'CampusesService',
            'SharedProfileService',
            'InstitutionsListService',
            'NotifierFactory',
            'SharedProfileFactory',
            'InstitutionFactory',
            'MapInitializerFactory',
            'WatchService',
            App.controllers.SharedProfileCampuses
        ]);
}(window.angular));
