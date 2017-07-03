(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.TuMediaSocialMediasSidebar = function (
        $scope,
        $resource,
        $location,
        $timeout,
        constants,
        NotifierFactory,
        TuProfileFactory,
        TuMediaSocialMediasService,
        WatchService,
        UrlService
    ) {
        var controller = this,
            alreadyInitialised = false;
        $scope.hasErrors = false;
        $scope.invalidCheckboxes = [];
        $scope.invalidFields = [];
        TuMediaSocialMediasService.displayTypesValid = false;

        controller.onKeyUp = function ($event, type, index) {
            if ($event.keyCode === 13) {
                return;
            }

            var url = $event.target.value;
            if (url && url.length > 5 && (url.indexOf('http') !== 0 || url.indexOf('http') === -1)) {
                url = UrlService.prependHttp(url);
                $scope.selectedSocialMedia[type][index].url = url;
            }
        };

        /**
         * Reset Invalid Url
         *
         * @params {Integer} index
         */
        $scope.resetInvalidField = function (index) {
            $scope.invalidFields[index] = false;
        };

        /**
         * Reset Invalid Checkboxes
         *
         * @params {Integer} index
         */
        $scope.resetInvalidCheckbox = function (index) {
            if ($scope.invalidCheckboxes[index]) {
                $scope.invalidCheckboxes[index] = false;
            }
            // reset all URL fields validations
            $scope.invalidFields = [];
        };

        /**
         * Resets the
         */
        controller.resetIfEmpty = function () {
            if ($scope.selectedSocialMedia[$scope.type()][0].display &&
                !$scope.selectedSocialMedia[$scope.type()][0].master &&
                !$scope.selectedSocialMedia[$scope.type()][0].ug &&
                !$scope.selectedSocialMedia[$scope.type()][0].pg &&
                $scope.selectedSocialMedia[$scope.type()][1].display &&
                !$scope.selectedSocialMedia[$scope.type()][1].master &&
                !$scope.selectedSocialMedia[$scope.type()][1].ug &&
                !$scope.selectedSocialMedia[$scope.type()][1].pg &&
                $scope.selectedSocialMedia[$scope.type()][2].display &&
                !$scope.selectedSocialMedia[$scope.type()][2].master &&
                !$scope.selectedSocialMedia[$scope.type()][2].ug &&
                !$scope.selectedSocialMedia[$scope.type()][2].pg) {
                $scope.clearSocialMediaForm();
            }
        };


        controller.urlPattern = UrlService.getPattern();
        /**
         * Save form.
         *
         * @returns {boolean}
         */
        $scope.saveSocialMediaForm = function () {
            $scope.invalidFields = [];
            var invalidItems = TuMediaSocialMediasService.socialMediaValidation(angular.copy($scope.selectedSocialMedia[$scope.type()]));
            if (typeof invalidItems === 'undefined') {
                invalidItems = TuMediaSocialMediasService.socialMediaFormValidation($scope.forms.formSocialMedia);
            }
            TuMediaSocialMediasService.displayTypesValid = false;
            TuMediaSocialMediasService.setHasErrors(false);
            if ($scope.submitInProgress || !$scope.forms.formSocialMedia || (invalidItems && invalidItems.length > 0)
            ) {
                $scope.invalidCheckboxes = [];
                $scope.hasErrors = true;
                angular.forEach(invalidItems, function (item) {
                    if (item.invalid) {
                        $scope.invalidCheckboxes[item.index] = item.invalid || false;
                    } else if (item.invalidUrl) {
                        $scope.invalidFields[item.index] = item.invalidUrl || false;
                    }
                });
                return false;
            }
            var socialMediaItem = TuMediaSocialMediasService.formatSocialMedia(
                angular.copy($scope.selectedSocialMedia[$scope.type()])
            );
            $scope.hasErrors = false;
            $scope.invalidFields = [];
            $scope.invalidCheckboxes = [];
            $scope.submitInProgress = true;
            var actionName = $scope.isEditMode($scope.type()) ? 'Updated' : 'Added';
            TuMediaSocialMediasService.saveSocialMedia(TuMediaSocialMediasService.coreId, socialMediaItem)
                .then(function (success) {
                    $scope.submitInProgress = false;
                    NotifierFactory.show(
                        success ? 'success' : 'error',
                        success ? 'Successfully!' : 'Failure!',
                        'Social Media ' + actionName + ' (' + $scope.type() + ')'
                    );
                    if (success) {
                        controller.resetIfEmpty();
                        $scope.selectedSocialMediaBeforeChanges = angular.copy($scope.selectedSocialMedia);
                        TuMediaSocialMediasService.setChanges(socialMediaItem);
                    }
                });
        };

        /**
         * Clear social media item.
         */
        $scope.clearSocialMediaForm = function () {
            var setValue = false;
            var setUrl = '';
            angular.forEach($scope.selectedSocialMedia[$scope.type()], function (value, key) {
                setValue = key === 0;
                $scope.selectedSocialMedia[$scope.type()][key].master = setValue;
                $scope.selectedSocialMedia[$scope.type()][key].ug = setValue;
                $scope.selectedSocialMedia[$scope.type()][key].pg = setValue;
                $scope.selectedSocialMedia[$scope.type()][key].url = setUrl;
            });
            $scope.invalidCheckboxes = [];
            $scope.invalidFields = [];
            $scope.checkCheckboxes();
        };

        /**
         * Get selected item.
         *
         * @returns {*}
         */
        $scope.getSelectedSocialMedia = function () {
            return TuMediaSocialMediasService.getSelectedSocialMedia();
        };

        /**
         * Get socialMedia items.
         *
         * @returns {*}
         */
        $scope.getSocialMediaItems = function () {
            return TuMediaSocialMediasService.getSocialMediaItems();
        };

        /**
         * Get has errors flag.
         *
         * @returns {boolean}
         */
        $scope.getHasErrors = function () {
            return TuMediaSocialMediasService.getHasErrors();
        };

        $scope.setHasErrors = function (value) {
            TuMediaSocialMediasService.setHasErrors(value);
        };

        $scope.type = function () {
            return TuMediaSocialMediasService.getType();
        };

        $scope.setDisplayTypesValidation = function (value) {
            TuMediaSocialMediasService.displayTypesValid = value;
        };

        $scope.getDisplayTypesValidation = function () {
            return TuMediaSocialMediasService.displayTypesValid;
        };

        /**
         * Check which items to hide
         */
        $scope.checkCheckboxes = function () {
            var checked = 0;
            var displayValue = true;
            var valueChanged = false;
            var prevValueChanged = false;
            angular.forEach($scope.selectedSocialMedia[$scope.type()], function (item, key) {
                if (item.master) {
                    checked++;
                    valueChanged = true;
                }
                if (item.ug) {
                    checked++;
                    valueChanged = true;
                }
                if (item.pg) {
                    checked++;
                    valueChanged = true;
                }
                if ((!valueChanged && !prevValueChanged && checked > 1) || (checked === 3 && !valueChanged)) {
                    displayValue = false;
                }
                $scope.selectedSocialMedia[$scope.type()][key].display = displayValue;
                if (!displayValue) {
                    delete $scope.invalidCheckboxes[key];
                    delete $scope.invalidFields[key];
                }
                prevValueChanged = valueChanged;
                valueChanged = false;
            });
        };

        $scope.checkboxChanged = function (selectedSocialMedia, index, itemChanged) {
            var checkedOnChanged = 0;
            if ($scope.selectedSocialMedia[$scope.type()][index].master === true) {
                checkedOnChanged++;
            }
            if ($scope.selectedSocialMedia[$scope.type()][index].ug === true) {
                checkedOnChanged++;
            }
            if ($scope.selectedSocialMedia[$scope.type()][index].pg === true) {
                checkedOnChanged++;
            }
            // if same URL assigned to all subtypes
            if (checkedOnChanged === 3) {
                // reset other URLs
                angular.forEach($scope.selectedSocialMedia[$scope.type()], function (value, key) {
                    if (key !== index) {
                        value.url = null;
                    }
                });
            }

            var uniqueItems = [];
            angular.forEach($scope.selectedSocialMedia[$scope.type()], function (totalItems, totalKey) {
                if ($scope.selectedSocialMedia[$scope.type()][totalKey].master && uniqueItems.indexOf('master') === -1) {
                    uniqueItems.push('master');
                }
                if ($scope.selectedSocialMedia[$scope.type()][totalKey].ug && uniqueItems.indexOf('ug') === -1) {
                    uniqueItems.push('ug');
                }
                if ($scope.selectedSocialMedia[$scope.type()][totalKey].pg && uniqueItems.indexOf('pg') === -1) {
                    uniqueItems.push('pg');
                }
            });
            var totalChecked = uniqueItems.length;

            var visibleCount = 0;
            angular.forEach($scope.selectedSocialMedia[$scope.type()], function (totalItems, totalKey) {
                if ($scope.selectedSocialMedia[$scope.type()][totalKey].display) {
                    visibleCount++;
                }
            });

            angular.forEach($scope.selectedSocialMedia[$scope.type()], function (items, key) {
                if (key !== index) {
                    if ($scope.selectedSocialMedia[$scope.type()][index][itemChanged] && $scope.selectedSocialMedia[$scope.type()][key][itemChanged]) {
                        if (!($scope.selectedSocialMedia[$scope.type()][key].master ||
                            $scope.selectedSocialMedia[$scope.type()][key].ug ||
                            $scope.selectedSocialMedia[$scope.type()][key].pg
                        )
                        ) {
                            $scope.selectedSocialMedia[$scope.type()][key].display = true;
                        }
                    }
                    if ($scope.selectedSocialMedia[$scope.type()][index][itemChanged]) { // checked
                        if ($scope.selectedSocialMedia[$scope.type()][key][itemChanged]) { // if there's another key with itemChanged changed, set it to false
                            $scope.selectedSocialMedia[$scope.type()][key][itemChanged] = !$scope.selectedSocialMedia[$scope.type()][index][itemChanged];
                            if (visibleCount === 3 && ((totalChecked < 2) || totalChecked === visibleCount)) {
                                $scope.selectedSocialMedia[$scope.type()][key].display = false;
                                delete $scope.invalidCheckboxes[key];
                                delete $scope.invalidFields[key];
                            }
                        } else { // hide the ones based on number of checked items
                            if (checkedOnChanged === totalChecked) { // all checked items are on current record
                                if (checkedOnChanged > 1 && checkedOnChanged < visibleCount) {
                                    $scope.selectedSocialMedia[$scope.type()][key].display = false;
                                    delete $scope.invalidCheckboxes[key];
                                    delete $scope.invalidFields[key];
                                    visibleCount--;
                                } else if (checkedOnChanged === 1) {
                                    angular.forEach($scope.selectedSocialMedia[$scope.type()], function (totalItems, totalKey) {
                                        $scope.selectedSocialMedia[$scope.type()][totalKey].display = true;
                                    });
                                }
                            } else { // some are not on current.
                                angular.forEach($scope.selectedSocialMedia[$scope.type()], function (totalItems, totalKey) {
                                    if (totalKey !== index) {
                                        if ((totalChecked === visibleCount || totalChecked < visibleCount) || totalChecked === 3) {
                                            if (!($scope.selectedSocialMedia[$scope.type()][totalKey].master ||
                                                $scope.selectedSocialMedia[$scope.type()][totalKey].ug ||
                                                $scope.selectedSocialMedia[$scope.type()][totalKey].pg
                                            )
                                            ) {
                                                $scope.selectedSocialMedia[$scope.type()][totalKey].display = false;
                                                delete $scope.invalidCheckboxes[key];
                                                delete $scope.invalidFields[key];
                                                visibleCount--;
                                            }
                                            if (totalChecked === 2 && checkedOnChanged !== totalChecked) {
                                                $scope.selectedSocialMedia[$scope.type()][totalKey].display = true;
                                            }
                                        }
                                    }
                                });
                            }
                        }
                        if (checkedOnChanged === 3) {
                            $scope.selectedSocialMedia[$scope.type()][key].display = false;
                            delete $scope.invalidCheckboxes[key];
                            delete $scope.invalidFields[key];
                        }
                    } else { // unchecked
                        if (totalChecked === 0) {
                            angular.forEach($scope.selectedSocialMedia[$scope.type()], function (totalItems, totalKey) {
                                $scope.selectedSocialMedia[$scope.type()][totalKey].display = true;
                            });
                        }
                        if (totalChecked === 1) {
                            angular.forEach($scope.selectedSocialMedia[$scope.type()], function (totalItems, totalKey) {
                                $scope.selectedSocialMedia[$scope.type()][totalKey].display = true;
                            });
                        }
                        if (totalChecked === 2) {
                            if (checkedOnChanged === totalChecked && checkedOnChanged > visibleCount) {
                                angular.forEach($scope.selectedSocialMedia[$scope.type()], function (totalItems, totalKey) {
                                    if (totalKey !== index && checkedOnChanged > visibleCount) {
                                        $scope.selectedSocialMedia[$scope.type()][totalKey].display = true;
                                        visibleCount++;
                                    }
                                });
                            } else {
                                if (checkedOnChanged !== totalChecked && totalChecked === 2 && visibleCount < 3 && checkedOnChanged > 0) {
                                    angular.forEach($scope.selectedSocialMedia[$scope.type()], function (totalItems, totalKey) {
                                        $scope.selectedSocialMedia[$scope.type()][totalKey].display = true;
                                        visibleCount++;
                                    });
                                }
                            }
                        }
                    }
                }
            });
        };

        /**
         * Is edit mode?
         *
         * @returns {boolean}
         */
        $scope.isEditMode = function (type) {
            return $scope.selectedSocialMedia && $scope.selectedSocialMedia[type] ? true : false;
        };

        controller.initWatches = function () {
            WatchService.create($scope, TuMediaSocialMediasService.getSelectedSocialMedia, function (selectedSocialMedia) {
                if (selectedSocialMedia) {
                    $scope.selectedSocialMediaBeforeChanges = selectedSocialMedia;
                    $scope.selectedSocialMedia = angular.copy(selectedSocialMedia);
                    $scope.checkCheckboxes();
                }
            });

            WatchService.create($scope, TuMediaSocialMediasService.getTriggerChange, function () {
                if (angular.isDefined($scope.selectedSocialMediaBeforeChanges)) {
                    $scope.selectedSocialMedia = angular.copy($scope.selectedSocialMediaBeforeChanges);
                    $scope.checkCheckboxes();
                }
                $scope.invalidFields = [];
                $scope.invalidCheckboxes = [];
            });

            //watch for social media type changes
            WatchService.create($scope, TuMediaSocialMediasService.getType, function (socialMediaType) {
                if (socialMediaType) {
                    controller.selectedSocialMediaUrl = TuMediaSocialMediasService.getSelectedSocialMediaUrl(socialMediaType);
                }
            });

            WatchService.create($scope, TuMediaSocialMediasService.getHighlighted, function (newValue) {
                if (newValue) {
                    $scope.isHighlighted = newValue;
                    $timeout(function () {
                        TuMediaSocialMediasService.setHighlighted(false);
                        $scope.isHighlighted = false;
                    }, 200);
                }
            });

            WatchService.create($scope, TuProfileFactory.getSelectedMediaTabId, function (tabId) {
                if (tabId === 3) {
                    // restore data on tab type switch
                    if (typeof $scope.selectedSocialMediaBeforeChanges !== 'undefined') {
                        $scope.selectedSocialMedia = angular.copy($scope.selectedSocialMediaBeforeChanges);
                    }
                    $timeout(function () {
                        TuMediaSocialMediasService.setHighlighted(true);
                    }, 200);
                } else {
                    $scope.invalidFields = [];
                    $scope.invalidCheckboxes = [];
                }
            });
        };

        controller.init = function () {
            controller.initWatches();
        };

        // listen to departments tab visibility changes
        WatchService.create($scope, TuProfileFactory.isMediaTabSelected, function (isActive, wasActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive && !wasActive) {
                controller.init();
                alreadyInitialised = true;
            }
        });
    };

    angular
        .module('qsHub')
        .controller('TuMediaSocialMediasSidebarController', [
            '$scope',
            '$resource',
            '$location',
            '$timeout',
            'constants',
            'NotifierFactory',
            'TuProfileFactory',
            'TuMediaSocialMediasService',
            'WatchService',
            'UrlService',
            App.controllers.TuMediaSocialMediasSidebar
        ]);

} (window.angular));