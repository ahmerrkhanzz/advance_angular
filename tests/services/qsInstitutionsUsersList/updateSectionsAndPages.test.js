(function() {
    'use strict';
    describe('updateSectionsAndPages service', function() {
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
            it('should leave section and pages as they were before', function () {
                var notDefined;
                var userData = {
                    "accessTo": {
                        "contact_us.contact_us":true,
                        "contacts.contacts":true,
                        "dashboard.dashboard":true,
                        "faq.faq":true,
                        "messages.messages":true,
                        "statistics.statistics":true
                    },
                    "roles": {
                        "institution_access.statistics":true,
                        "institution_access.tm":true
                    }
                };
                var result = usersListService.updateSectionsAndPages(userData, notDefined);
                expect(result).toEqual(userData);
            });
        });

        describe('When a role is assigned', function() {
            it('should update accessTo with the correct pages', function () {
                var userData = {
                    "accessTo": {
                        "contact_us.contact_us":true,
                        "contacts.contacts":true,
                        "dashboard.dashboard":true,
                        "faq.faq":true,
                        "messages.messages":true,
                        "statistics.statistics":true
                    },
                    "roles": {
                        "institution_access.statistics":true,
                        "institution_access.tm":true // role for tm not assigned yet
                    }
                };

                var userDataUpdated = {
                    "accessTo": {
                        "contact_us.contact_us":true,
                        "contacts.contacts":true,
                        "dashboard.dashboard":true,
                        "faq.faq":true,
                        "messages.messages":true,
                        "profiles.institution_details":true, // new page added
                        "profiles.tm":true, // new page added
                        "statistics.statistics":true
                    },
                    "roles": {
                        "institution_access.statistics":true,
                        "institution_access.tm":true
                    }
                };
                var result = usersListService.updateSectionsAndPages(userData, roleList);
                expect(result).toEqual(userDataUpdated);
            });
        });

        describe('When a role is unassigned', function() {
            it('should update accessTo with the correct pages', function () {
                var userData = {
                    "accessTo": {},
                    "roles": {
                        "institution_access.statistics":true,
                        "institution_access.tm":false // tm role unassigned
                    }
                };

                var userDataUpdated = {
                    // pages updated with no tm access
                    "accessTo": {
                        "contact_us.contact_us":true,
                        "contacts.contacts":true,
                        "dashboard.dashboard":true,
                        "faq.faq":true,
                        "messages.messages":true,
                        "statistics.statistics":true
                    },
                    "roles": {
                        "institution_access.statistics":true,
                        "institution_access.tm":false
                    }
                };
                var result = usersListService.updateSectionsAndPages(userData, roleList);
                expect(result).toEqual(userDataUpdated);
            });
        });
    });
}());
