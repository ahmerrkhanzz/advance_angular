(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers: {}});

    App.controllers.TmMediaBrochures = function (
        $scope,
        constants,
        TmProfileFactory,
        NotifierFactory,
        TmMediaBrochuresService,
        TmMediaService,
        ModalService,
        $filter,
        orderBy,
        WatchService
    ) {
        var controller = this;
        controller.devMode = constants.dev;
        TmMediaBrochuresService.coreId = 0;
        $scope.brochureItems = [];
        $scope.itemBrochure = {};
        $scope.displayLocationDeletePopup = true;
        $scope.type = TmMediaService.typeOverview();

        TmMediaBrochuresService.setType(TmMediaService.typeOverview());

        WatchService.create($scope, TmProfileFactory.getData, function (newValue) {
            if (newValue !== null) {
                TmMediaBrochuresService.setSelectedBrochure(TmMediaBrochuresService.getItemBrochure());
                angular.copy(newValue.brochures, $scope.brochureItems);
                TmMediaBrochuresService.coreId = newValue.id;
                TmMediaBrochuresService.setBrochureItems($scope.brochureItems);
                $scope.filteredBrochureItems = $filter('filter')($scope.brochureItems, {master: true});
                $scope.filteredBrochureItems = orderBy($scope.filteredBrochureItems, 'orderType.' + $scope.type, false);
            }
        });

        WatchService.create($scope, TmMediaBrochuresService.getBrochureItems, function (newValue, oldValue) {
            if (!angular.equals(oldValue, newValue)) {
                $scope.brochureItems = newValue;
            }
        });

        WatchService.create($scope, TmMediaBrochuresService.getTriggerChange, function () {
            if (angular.isDefined($scope.selectedItemId()) && $scope.selectedItemId().length > 0) {
                TmMediaBrochuresService.replaceByKey($scope.selectedItemId());
            }
            var selectedBrochure = TmMediaBrochuresService.getSelectedBrochure();
            $scope.filter('master');
        });

        $scope.sortableOptions = {
            disabled: false,
            'ui-floating': false,
            start: function () {
                controller.initialList = [];
                angular.copy($scope.filteredBrochureItems, controller.initialList);
            },
            update: function (e, ui) {
                var validateItems = TmMediaService.validateTypes($scope.brochureItems);
                if (true !== validateItems) {
                    ui.item.sortable.cancel();
                }
            },
            stop: function () {
                var validateItems = TmMediaService.validateTypes($scope.brochureItems);
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
                    TmMediaBrochuresService.saveOrder(TmMediaBrochuresService.coreId, $scope.brochureItems)
                        .then(function (success) {
                            NotifierFactory.show(
                                success ? 'success' : 'error',
                                success ? 'Success!' : 'Failure!',
                                'Brochure Order Save'
                            );
                            TmMediaBrochuresService.setSelectedBrochure(TmMediaBrochuresService.getItemBrochure());
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
                    TmMediaBrochuresService.setSelectedBrochure(validateItems);
                    TmMediaBrochuresService.displayTypesValid = true;

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
            var validateItems = TmMediaService.validateTypes($scope.brochureItems);
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
                TmMediaBrochuresService.setSelectedBrochure(validateItems);
                TmMediaBrochuresService.displayTypesValid = true;

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
            var validateItems = TmMediaService.validateTypes($scope.brochureItems);
            if (true === validateItems) {
                TmMediaBrochuresService.setHasErrors(false);
                TmMediaBrochuresService.displayTypesValid = false;
                $scope.itemBrochure = TmMediaBrochuresService.getItemBrochure();
                if (angular.isDefined(item)) {
                    TmMediaBrochuresService.setSelectedBrochure(item);
                } else {
                    TmMediaBrochuresService.setHasErrors(false);
                    TmMediaBrochuresService.setHighlighted(true);
                    TmMediaBrochuresService.setSelectedBrochure($scope.itemBrochure);
                }
                TmMediaBrochuresService.setTriggerReset(Math.random());
            } else {
                NotifierFactory.show(
                    'error',
                    'Failure!',
                    'Invalid items in brochure list'
                );
                TmMediaBrochuresService.setSelectedBrochure(validateItems);
                TmMediaBrochuresService.displayTypesValid = true;

                return false;
            }
        };

        $scope.selectedItem = function () {
            return TmMediaBrochuresService.getSelectedBrochure();
        };

        $scope.selectedItemId = function () {
            return TmMediaBrochuresService.getSelectedBrochure().id;
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
                TmMediaBrochuresService.deleteBrochure(TmMediaBrochuresService.coreId, item)
                    .then(function (success) {
                        $scope.submitInProgress = false;
                        NotifierFactory.show(
                            success ? 'success' : 'error',
                            success ? 'Success!' : 'Failure!',
                            'Delete Brochure'
                        );
                        if (success) {
                            TmMediaBrochuresService.setSelectedBrochure(TmMediaBrochuresService.getItemBrochure());
                            $scope.brochureItems.splice(TmMediaService.objectSearch($scope.brochureItems, item.id), 1);
                            $scope.filteredBrochureItems.splice(TmMediaService.objectSearch($scope.filteredBrochureItems, item.id), 1);


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
            return TmMediaService.typeOverview();
        };

    };

    angular
        .module('qsHub')
        .controller('TmMediaBrochuresController', [
            '$scope',
            'constants',
            'TmProfileFactory',
            'NotifierFactory',
            'TmMediaBrochuresService',
            'TmMediaService',
            'ModalService',
            '$filter',
            'orderByFilter',
            'WatchService',
            App.controllers.TmMediaBrochures
        ]);

}(window.angular));
