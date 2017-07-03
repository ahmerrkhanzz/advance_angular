(function() {
    'use strict';
    describe('updateRolesWithAll service', function() {
        beforeEach(module('qsHub'));

        var usersListService;
        beforeEach(inject(function (_UsersListService_) {
            usersListService = _UsersListService_;
        }));

        var roleList = [
            {
               "groupHandle":"institution_access",
               "groupName":"Institution Access",
               "roleName":"Institution Access - All",
               "roleHandle":"institution_access.all",
               "all":true,
               "sections":[
                  "dashboard.dashboard",
                  "profiles.institution_details",
                  "profiles.ug",
                  "profiles.pg",
                  "profiles.tm",
                  "contact_us.contact_us",
                  "faq.faq",
                  "messages.messages",
                  "contacts.contacts",
                  "statistics.statistics"
               ],
               "$$hashKey":"object:416"
            },
            {
               "groupHandle":"institution_access",
               "groupName":"Institution Access",
               "roleName":"Institution Access - TU",
               "roleHandle":"institution_access.tu",
               "all":false,
               "sections":[
                  "dashboard.dashboard",
                  "profiles.institution_details",
                  "profiles.ug",
                  "profiles.pg",
                  "contact_us.contact_us",
                  "faq.faq",
                  "messages.messages",
                  "contacts.contacts",
                  "statistics.statistics"
               ],
               "$$hashKey":"object:417"
            },
            {
               "groupHandle":"institution_access",
               "groupName":"Institution Access",
               "roleName":"Institution Access - TM",
               "roleHandle":"institution_access.tm",
               "all":false,
               "sections":[
                  "dashboard.dashboard",
                  "profiles.institution_details",
                  "profiles.tm",
                  "contact_us.contact_us",
                  "faq.faq",
                  "messages.messages",
                  "contacts.contacts",
                  "statistics.statistics"
               ],
               "$$hashKey":"object:418"
            },
            {
               "groupHandle":"institution_access",
               "groupName":"Institution Access",
               "roleName":"Institution Access - Statistics",
               "roleHandle":"institution_access.statistics",
               "all":false,
               "sections":[
                  "dashboard.dashboard",
                  "contact_us.contact_us",
                  "faq.faq",
                  "messages.messages",
                  "contacts.contacts",
                  "statistics.statistics"
               ],
               "$$hashKey":"object:419"
            },
            {
               "groupName":"Custom",
               "roleName":"Switching off will revert changes to default",
               "roleHandle":"custom",
               "all":false,
               "$$hashKey":"object:436"
            }
        ];

        describe('When role list is not defined', function() {
            it('should leave user roles as they were before', function () {
                var notDefined;
                var userData = {
                    "roles": {
                        "institution_access.all":true,
                        "institution_access.statistics":true,
                        "institution_access.tm":true
                    }
                };
                var result = usersListService.updateRolesWithAll(userData, notDefined);
                expect(result).toEqual(userData);
            });
        });

        describe('When role ALL is assigned but not all the children are assigned', function() {
            it('should update roles so all the children are assigned', function () {
                var userData = {
                    "roles": {
                        "institution_access.all":true,
                        "institution_access.statistics":true,
                        "institution_access.tm":true
                    }
                };
                var userDataUpdate = {
                    "roles": {
                        "institution_access.all":true,
                        "institution_access.statistics":true,
                        "institution_access.tu":true,
                        "institution_access.tm":true
                    }
                };
                var result = usersListService.updateRolesWithAll(userData, roleList);
                expect(result).toEqual(userDataUpdate);
            });
        });
    });
}());
