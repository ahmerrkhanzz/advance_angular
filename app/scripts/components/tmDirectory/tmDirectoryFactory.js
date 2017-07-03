(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {factories:{}});

    App.factories.TmDirectory = function () {
        var editMode,
            addMode;
        return {
            isEditMode: function () {
                return !!editMode;
            },
            setEditMode: function (enabled) {
                editMode = enabled;
            }
        };
    };

    angular
        .module('qsHub')
        .factory('TmDirectoryFactory', [
            App.factories.TmDirectory
        ]);

}(window.angular));
