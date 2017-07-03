(function () {
    'use strict';
    describe('AdminDashboardService service', function () {

        beforeEach(module('qsHub'));

        var service, $rootScope, $scope;

        if (typeof uiMode === 'undefined' || !uiMode) {
            beforeEach(module('templates'));
        }

        beforeEach(inject(function (_AdminDashboardService_, _$rootScope_) {
            service = _AdminDashboardService_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
        }));

        afterEach(function () {
            service = null;
        });


        it('should exist', function () {
            expect(service).toBeDefined();
        });

        it('should exist', function () {
            expect(service.getUserRoleNames).toBeDefined();
        });

        describe('when recieve a successful response', function () {
            it('should not throw an expectation', function () {
                var callback = function () {
                    var rolesList = [{
                        all: true,
                        groupHandle: "marcomms",
                        groupName: "Marcomms",
                        roleHandle: "marcomms.all",
                        roleName: "Marcomms - All",
                        sections: [
                            "admin_dashboard.dashboard", "tours.wmt", "tours.wgst", "tours.seminars", "memberships.comparison_per_day"
                        ]
                    }]
                    service.getUserRoleNames(null, rolesList);
                }
                expect(callback).not.toThrow();
            });
        });

        describe('when recieve a error message', function () {
            it('should not throw an expectation', function () {
                var callback = function () {
                    var rolesList = {
                        code: '400',
                        message: 'Could not recieve data from the API'
                    };
                    service.getUserRoleNames(null, rolesList);
                }
                expect(callback).not.toThrow();
            });
        });

        describe('when receiving a null response', function () {
            it('should not throw an exception', function () {
                var callback = function () {
                    service.getUserRoleNames(null);
                }
                expect(callback).not.toThrow();
            });
        });

        describe('when recieve a successful response', function () {
            it('should return true', function () {
                var callback = function () {
                    var rolesList = [{
                        all: true,
                        groupHandle: "marcomms",
                        groupName: "Marcomms",
                        roleHandle: "marcomms.all",
                        roleName: "Marcomms - All",
                        sections: [
                            "admin_dashboard.dashboard", "tours.wmt", "tours.wgst", "tours.seminars", "memberships.comparison_per_day"
                        ]
                    }]
                    var userRoles = ["global_admin.global_admin", "api.drupal_api"];
                    service.getUserRoleNames(null, rolesList);
                }
                expect(callback).toBeTruthy();
            });
        })

    });
} ());
