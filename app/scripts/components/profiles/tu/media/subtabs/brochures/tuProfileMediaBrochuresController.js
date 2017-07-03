(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers: {}});

    App.controllers.TuMediaBrochures = function (
        $scope,
        constants,
        TuProfileFactory,
        NotifierFactory,
        TuMediaBrochuresService,
        TuMediaService,
        ModalService,
        $filter,
        orderBy,
        WatchService
    ) {
        var controller = this;
        controller.devMode = constants.dev;
        TuMediaBrochuresService.coreId = 0;
        $scope.brochureItems = [];
        $scope.itemBrochure = {};
        $scope.displayLocationDeletePopup = true;
        $scope.type = TuMediaService.typeOverview();

        TuMediaBrochuresService.setType(TuMediaService.typeOverview());

        WatchService.create($scope, function () {
            return TuProfileFactory.getData();
        }, function (newValue) {
            TuMediaBrochuresService.setSelectedBrochure(TuMediaBrochuresService.getItemBrochure());

            if (newValue && typeof newValue.brochures !== 'undefined') {
                angular.copy(newValue.brochures, $scope.brochureItems);
            } else {
                $scope.brochureItems = [];
            }
            if (newValue !== null) {
                TuMediaBrochuresService.coreId = newValue.id;
                TuMediaBrochuresService.setBrochureItems($scope.brochureItems);
                $scope.filteredBrochureItems = $filter('filter')($scope.brochureItems, {master: true});
                $scope.filteredBrochureItems = orderBy($scope.filteredBrochureItems, 'orderType.' + $scope.type, false);}
            }
        );

        WatchService.create($scope, TuMediaBrochuresService.getBrochureItems(), function (newValue, oldValue) {
            if (!angular.equals(oldValue, newValue)) {
                $scope.brochureItems = newValue;

            }
        });

        WatchService.create($scope, TuMediaBrochuresService.getTriggerChange, function () {
            if (angular.isDefined($scope.selectedItemId()) && $scope.selectedItemId().length > 0) {
                TuMediaBrochuresService.replaceByKey($scope.selectedItemId());
            }
            var selectedBrochure = TuMediaBrochuresService.getSelectedBrochure();
            if (
                ($scope.type === 'ug' && selectedBrochure.ug) || 
                (!selectedBrochure.master && selectedBrochure.ug && !selectedBrochure.pg) || 
                (!selectedBrochure.master && selectedBrochure.ug && selectedBrochure.pg && ($scope.type === 'ug' || $scope.type === 'master'))
            ) {
                $scope.filter('ug');
            } else if (($scope.type === 'pg' && selectedBrochure.pg) || (!selectedBrochure.master && !selectedBrochure.ug && selectedBrochure.pg)) {
                $scope.filter('pg');
            } else {
                $scope.filter('master');
            }
        });

        $scope.sortableOptions = {
            disabled: false,
            'ui-floating': false,
            start: function () {
                controller.initialList = [];
                angular.copy($scope.filteredBrochureItems, controller.initialList);
            },
            update: function (e, ui) {
                var validateItems = TuMediaService.validateTypes($scope.brochureItems);
                if (true !== validateItems) {
                    ui.item.sortable.cancel();
                }
            },
            stop: function () {
                var validateItems = TuMediaService.validateTypes($scope.brochureItems);
                if (true === validateItems) {
                    var assignedOrder = 1;
                    // change brochures order
                    for (var index = 0; index < $scope.filteredBrochureItems.length; index++) {
                        if ($scope.filteredBrochureItems[index][$scope.type]) {
                            $scope.filteredBrochureItems[index].orderType[$scope.type] = assignedOrder;
                            assignedOrder++;
                        }
                    }

                    $scope.sortableOptions.disabled = false;
                    TuMediaBrochuresService.saveOrder(TuMediaBrochuresService.coreId, $scope.brochureItems)
                        .then(function (success) {
                            NotifierFactory.show(
                                success ? 'success' : 'error',
                                success ? 'Success!' : 'Failure!',
                                'Brochure Order Save'
                            );
                            TuMediaBrochuresService.setSelectedBrochure(TuMediaBrochuresService.getItemBrochure());
                        })
                        .finally(function () {
                            $scope.sortableOptions.disabled = false;
                        });
                } else {
                    NotifierFactory.show(
                        'error',
                        'Failure!',
                        'Invalid items in brochure list'
                    );
                    TuMediaBrochuresService.setSelectedBrochure(validateItems);
                    TuMediaBrochuresService.displayTypesValid = true;

                    return false;
                }
            }
        };

        /**
         * Filter change.
         *
         * @param type
         */
        $scope.filter = function (type) {
            var validateItems = TuMediaService.validateTypes($scope.brochureItems);
            if (true === validateItems) {
                $scope.type = type;
                var params = {};
                params[type] = true;
                $scope.filteredBrochureItems = $filter('filter')($scope.brochureItems, params);
                $scope.filteredBrochureItems = orderBy($scope.filteredBrochureItems, 'orderType.' + type, false);
            } else {
                NotifierFactory.show(
                    'error',
                    'Failure!',
                    'Invalid items in brochure list'
                );
                TuMediaBrochuresService.setSelectedBrochure(validateItems);
                TuMediaBrochuresService.displayTypesValid = true;

                return false;
            }
        };

        /**
         * Select brochure.
         *
         * @param {Object} item
         */
        $scope.selectBrochure = function (item) {
            item = angular.copy(item);
            var validateItems = TuMediaService.validateTypes($scope.brochureItems);
            if (true === validateItems) {
                TuMediaBrochuresService.setHasErrors(false);
                TuMediaBrochuresService.displayTypesValid = false;
                $scope.itemBrochure = TuMediaBrochuresService.getItemBrochure();
                if (angular.isDefined(item)) {
                    TuMediaBrochuresService.setSelectedBrochure(item);
                } else {
                    TuMediaBrochuresService.setHasErrors(false);
                    TuMediaBrochuresService.setHighlighted(true);
                    TuMediaBrochuresService.setSelectedBrochure($scope.itemBrochure);
                }
                TuMediaBrochuresService.setTriggerReset(Math.random());
            } else {
                NotifierFactory.show(
                    'error',
                    'Failure!',
                    'Invalid items in brochure list'
                );
                TuMediaBrochuresService.setSelectedBrochure(validateItems);
                TuMediaBrochuresService.displayTypesValid = true;

                return false;
            }
        };

        $scope.selectedItem = function () {
            return TuMediaBrochuresService.getSelectedBrochure();
        };

        $scope.selectedItemId = function () {
            return TuMediaBrochuresService.getSelectedBrochure().id;
        };

        /**
         * Delete brochure.
         *
         * @param item
         */
        $scope.deleteBrochure = function (item) {
            var itemName = angular.isDefined(item.name) && item.name !== null ? ': ' + item.name : '';
            var modalOptions = {
                closeButtonText: 'No',
                actionButtonText: 'Yes',
                headerText: 'Delete Brochure' + itemName + ' ?',
                bodyText: 'Are you sure you wish to delete this brochure?',
            };
            ModalService.show({}, modalOptions).then(function (result) {
                TuMediaBrochuresService.deleteBrochure(TuMediaBrochuresService.coreId, item)
                    .then(function (success) {
                        $scope.submitInProgress = false;
                        NotifierFactory.show(
                            success ? 'success' : 'error',
                            success ? 'Success!' : 'Failure!',
                            'Delete Brochure'
                        );
                        if (success) {
                            TuMediaBrochuresService.setSelectedBrochure(TuMediaBrochuresService.getItemBrochure());
                            $scope.brochureItems.splice(TuMediaService.objectSearch($scope.brochureItems, item.id), 1);
                            $scope.filteredBrochureItems.splice(TuMediaService.objectSearch($scope.filteredBrochureItems, item.id), 1);


                            var assignedOrder = 1;
                            for (var index = 0; index < $scope.filteredBrochureItems.length; index++) {
                                if ($scope.filteredBrochureItems[index][$scope.type]) {
                                    $scope.filteredBrochureItems[index].orderType[$scope.type] = assignedOrder;
                                    assignedOrder++;
                                }
                            }
                            $scope.filteredBrochureItems = orderBy($scope.filteredBrochureItems, 'orderType.' + $scope.type, false);
                        }
                    });
            });
        };

        $scope.typeOverview = function () {
            return TuMediaService.typeOverview();
        };

        $scope.typeUndergraduate = function () {
            return TuMediaService.typeUndergraduate();
        };

        $scope.typePostgraduate = function () {
            return TuMediaService.typePostgraduate();
        };
    };

    angular
        .module('qsHub')
        .controller('TuMediaBrochuresController', [
            '$scope',
            'constants',
            'TuProfileFactory',
            'NotifierFactory',
            'TuMediaBrochuresService',
            'TuMediaService',
            'ModalService',
            '$filter',
            'orderByFilter',
            'WatchService',
            App.controllers.TuMediaBrochures
        ]);

}(window.angular));
