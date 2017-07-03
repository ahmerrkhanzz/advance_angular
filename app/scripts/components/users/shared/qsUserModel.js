(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {models:{}});

    App.models.QsUser = function ($resource, constants) {
        return $resource(constants.api.usersPermissions.url + '/v1/user/{:id}', null, {
            'update': { method:'PUT' }
        });
    };

    angular
        .module('qsHub')
        .factory('QsUserModel', ['$resource', 'constants', App.models.QsUser]);

}(window.angular));