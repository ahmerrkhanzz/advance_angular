(function(angular, airbrakeJs) {
    'use strict';

    var App = App || {};
    App = angular.extend({}, App, {factories:{}});

    App.factories.ExceptionHandler = function ($log, constants, version, InstitutionFactory, UserFactory) {
        if (!constants.airbrake.enabled) {
            return function (exception) {
                $log.error(exception);
            };
        }
        var airbrake = new airbrakeJs.Client({
            projectId: constants.airbrake.projectId,
            projectKey: constants.airbrake.key
        });
        airbrake.addFilter(function (notice) {
            notice.context.environment = constants.env;
            notice.context.version = version;
            notice.params = {};
            if (!InstitutionFactory.isEmpty()) {
                notice.params.institutionCoreId = InstitutionFactory.getCoreId();
            }
            if (UserFactory.hasData()) {
                notice.params.username = UserFactory.getUserName();
            }

            return notice;
        });

        return function (exception, cause) {
            $log.error(exception);
            airbrake.notify({error: exception, params: {angular_cause: cause}});
        };
    };

    angular
        .module('qsHub')
        .factory('$exceptionHandler', [
            '$log',
            'constants',
            'version',
            'InstitutionFactory',
            'UserFactory',
            App.factories.ExceptionHandler
        ]);

}(window.angular, window.airbrakeJs));
