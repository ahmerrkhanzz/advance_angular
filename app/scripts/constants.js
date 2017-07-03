(function(angular) {
    'use strict';

    var env = 'local', shared = {
        globalAdminRole : 'global_admin.global_admin',
        gridNameSpaces : {
            qsUserGridFilters           : 'qsUserGridFilters',
            schoolUserGridFilters       : 'schoolUserGridFilters',
            institutionsGridFilters     : 'institutionsGridFilters',
            tmDirectoryGridFilters      : 'tmDirectoryGridFilters',
            departmentsGridFilters      : 'departmentsGridFilters',
            departmentsOvGridFilters    : 'departmentsOvGridFilters',
            programsGridFilters         : 'programsGridFilters',
            programsOvGridFilters       : 'programsOvGridFilters',
            programsTmGridFilters       : 'programsTmGridFilters',
            contactsGridFilters         : 'contactsGridFilters',
            qsUserGridVisibility        : 'qsUserGridVisibility',
            schoolUserGridVisibility    : 'schoolUserGridVisibility',
            institutionsGridVisibility  : 'institutionsGridVisibility',
            departmentsGridVisibility   : 'departmentsGridVisibility',
            departmentsOvGridVisibility : 'departmentsOvGridVisibility',
            programsGridVisibility      : 'programsGridVisibility',
            programsOvGridVisibility    : 'programsOvGridVisibility',
            programsTmGridVisibility    : 'programsTmGridVisibility',
            tmDirectoryGridVisibility   : 'tmDirectoryGridVisibility',
            contactsGridVisibility      : 'contactsGridVisibility'
        },
        coreFlag: {
            value : 'session?url='
        },
        drupal: {
            tu: {
                url: 'http://qs-hub-topu.pantheonsite.io'
            },
            tm: {
                url: 'http://test-qs-platform.pantheonsite.io',
            }
        },
        customRole: 'custom',
        events: {
            institutionTuProfileChanges: 'institutionTuProfileChanges',
            institutionSharedProfileChanges : 'institutionSharedProfileChanges',
            loadMoreHistoryLogs : 'loadMoreHistoryLogs',
            logout: 'logout',
            closingInstitutionsUsers : 'closingInstitutionsUsers',
            institutionsUserPrimaryInstitutionChanges : 'institutionsUserPrimaryInstitutionChanges'
        },
        publicPages : [
            '/',
            '/logout',
            '/forgot-password'
        ],
        profileTypes : {
            ug : 'ug',
            pg : 'pg',
            master : 'master'
        },
        typeId: {
            topLevelInstitutionId: 2,
            clientDepartmentId: 3,
            simpleDepartmentId: 5,
            advancedProgramId: 7,
            internalId: 1
        },
        airbrake: {
            enabled: true,
            projectId: 131822,
            key: '79104b307bdc43c018168ad3d715f57f',
        },
        urls: {
            core: 'http://core.qs.com',
        },
        datagrid : {
            contacts: {
                defaultRowsNumber: 25
            }
        },
        defaultClientPage: '/profiles/institution-details',
        noTuSubtypes: false,
        support: {
            tu: 'tusupport@qs.com',
            tm: 'tmsupport@qs.com'
        },
        xStorage: {
            activeSource: 'hub',
            allowedSources: [
                'core'
            ],
            keys : {
                source : 'x-source',
                data : 'x-currentUser',
                logout: 'x-logout',
                sendToSession : 'x-sendToSession'
            }
        },
        publishStatus: {
            pending: 'pending',
            progress: 'progress',
            success: 'success',
            failure: 'failure'
        },
    }, constants = {
        local : {
            api : {
                usersPermissions: {
                    url: 'http://users.qs-hub.local:8087'
                },
                institutions: {
                    url: 'http://institutions.qs-hub.local:8086'
                }
            },
            dev : false,
            emails: {
                upgradeTu: 'core.it@qs.com',
                upgradeTm: 'core.it@qs.com'
            },
            webSockets : {
                host : 'http://websocket',
                port : 3000
            },
            airbrake: {
                enabled: false
            },
            urls: {
                core: 'http://local.core.qs.com:8081',
            }
        },
        dev : {
            drupal: {
                tu: {
                    url: 'https://dev-topu.pantheonsite.io'
                },
                tm: {
                    url: 'https://test-qs-platform.pantheonsite.io',
                }
            },
            api : {
                usersPermissions: {
                    url: 'http://users.qs-hub.dev.qs.com'
                },
                institutions: {
                    url: 'http://institutions.qs-hub.dev.qs.com'
                }
            },
            dev : false,
            emails: {
                upgradeTu: 'tusupport@qs.com',
                upgradeTm: 'tmsupport@qs.com'
            },
            webSockets : {
                host : 'http://qs-hub-docker-dev.qs-aim.com',
                port : 3000
            },
            urls: {
                core: 'http://staging.core.qs.com',
            }
        },
        dev2 : {
            drupal: {
                tu: {
                    url: 'https://sprint-72-topu.pantheonsite.io'
                },
                tm: {
                    url: 'https://test-qs-platform.pantheonsite.io',
                }
            },
            api : {
                usersPermissions: {
                    url: 'http://users.qs-hub.dev2.qs.com'
                },
                institutions: {
                    url: 'http://institutions.qs-hub.dev2.qs.com'
                }
            },
            dev : false,
            emails: {
                upgradeTu: 'tusupport@qs.com',
                upgradeTm: 'tmsupport@qs.com'
            },
            webSockets : {
                host : 'http://qs-hub-docker-dev2.qs-aim.com',
                port : 3000
            },
            urls: {
                core: 'http://staging.core.qs.com',
            }
        },
        qa_test : {
            drupal: {
                tu: {
                    url: 'https://qs-hub-topu.pantheonsite.io'
                },
                tm: {
                    url: 'https://test-qs-platform.pantheonsite.io',
                }
            },
            api : {
                usersPermissions: {
                    url: 'http://users.qs-hub.qa-test.qs.com'
                },
                institutions: {
                    url: 'http://institutions.qs-hub.qa-test.qs.com'
                }
            },
            dev : false,
            emails: {
                upgradeTu: 'tusupport@qs.com',
                upgradeTm: 'tmsupport@qs.com'
            },
            webSockets : {
                host : 'http://qs-hub-docker-qa-test.qs-aim.com',
                port : 3000
            },
            urls: {
                core: 'http://qa-testing.core.qs.com',
            }
        },
        qa_prod : {
            drupal: {
                tu: {
                    url: 'https://sprint-73-topu.pantheonsite.io'
                },
                tm: {
                    url: 'https://dev-qs-platform.pantheonsite.io',
                }
            },
            api : {
                usersPermissions: {
                    url: 'https://users-qs-hub-qa-prod.qs.com'
                },
                institutions: {
                    url: 'https://institutions-qs-hub-qa-prod.qs.com'
                }
            },
            dev : false,
            emails: {
                upgradeTu: 'tusupport@qs.com',
                upgradeTm: 'tmsupport@qs.com'
            },
            webSockets : {
                host : 'https://websocket-qa-prod.qs.com',
                port : null
            },
            urls: {
                core: 'http://qa-prod.core.qs.com',
            }
        },
        staging : {
            drupal: {
                tu: {
                    url: 'https://cf-test.topuniversities.com'
                },
                tm: {
                    url: 'https://test-qs-platform.pantheonsite.io'
                }
            },
            api : {
                usersPermissions: {
                    url: 'https://users-qs-hub-staging.qs.com'
                },
                institutions: {
                    url: 'https://institutions-qs-hub-staging.qs.com'
                }
            },
            dev : false,
            emails: {
                upgradeTu: 'tusupport@qs.com',
                upgradeTm: 'tmsupport@qs.com'
            },
            webSockets : {
                host : 'https://websocket-staging.qs.com',
                port : null
            },
            urls: {
                core: 'http://qa-prod.core.qs.com',
            }
        },
        live : {
            drupal: {
                tu: {
                    url: 'https://www.topuniversities.com'
                },
                tm: {
                    url: 'https://www.topmba.com'
                }
            },
            api : {
                usersPermissions: {
                    url: 'https://users-qs-hub.qs.com'
                },
                institutions: {
                    url: 'https://institutions-qs-hub.qs.com'
                }
            },
            dev : false,
            emails: {
                upgradeTu: 'tusupport@qs.com',
                upgradeTm: 'tmsupport@qs.com'
            },
            webSockets : {
                host : 'https://websocket-qs-hub.qs.com',
                port : null
            },
            urls: {
                core: 'http://core.qs.com',
            }
        }
    };

    if (window && window.location && window.location.hostname) {
        switch (window.location.hostname) {
            case 'qs-hub.dev.qs.com':
            case 'qs-hub-dev.qs.com':
                env = 'dev';
                break;
            case 'qs-hub.dev2.qs.com':
            case 'qs-hub-dev2.qs.com':
                env = 'dev2';
                break;
            case 'qs-hub.qa-test.qs.com':
            case 'qs-hub-qa-test.qs.com':
                env = 'qa_test';
                break;
            case 'qs-hub.qa-prod.qs.com':
            case 'qs-hub-qa-prod.qs.com':
                env = 'qa_prod';
                break;
            case 'qs-hub.staging.qs.com':
            case 'qs-hub-staging.qs.com':
                env = 'staging';
                break;
            case 'qs-hub.qs.com':
                env = 'live';
                break;
        }
    }
    shared.env = env;

    angular
        .module('qsHub')
        .constant('constants', angular.extend(shared, constants[env]));

}(window.angular));
