(function(angular) {
'use strict';
angular.module('qsHubTemplates', []).run([
'$templateCache',
function($templateCache) {
  

  $templateCache.put('/scripts/components/contacts/contactsView.html',
    "<div class=\"page-contacts\" ng-controller=\"ContactsListController as ContactsListController\">\n" +
    "    <div ng-include src=\"'/scripts/components/contacts/institutionsUsersListCloneView.html'\"></div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/contacts/institutionsUsersListCloneView.html',
    "<div class=\"wrapper wrapper-content animated fadeInRight page-institutions-users-list\" ng-controller=\"InstitutionsUsersListCloneController as UsersList\">\n" +
    "    <div class=\"alert alert-info\">\n" +
    "        <p>\n" +
    "            <i class=\"fa fa-info-circle\"></i>\n" +
    "            <span>QS Staff have access to this section only</span>\n" +
    "            <span ng-if=\"!UsersList.hasWriteAccess\">. You don't have permissions to make changes.</span>\n" +
    "        </p>\n" +
    "    </div>\n" +
    "    <p>\n" +
    "        <button type=\"button\" class=\"btn btn-primary\"\n" +
    "                ng-click=\"UsersList.handleAddInstitutionsUserClick()\"\n" +
    "                ng-disabled=\"!UsersList.hasWriteAccess\">\n" +
    "            <i class=\"fa fa-user-plus\"></i>\n" +
    "            Add User\n" +
    "        </button>\n" +
    "    </p>\n" +
    "    <div class=\"row\">\n" +
    "        <div id=\"schoolUsersTable\" ng-class=\"showInfoBlock ? 'col-sm-3 hide-ng-table-pager' : 'col-sm-12'\">\n" +
    "            <div class=\"ibox float-e-margins\">\n" +
    "                <div class=\"ibox-content table-responsive\">\n" +
    "                    <div wave-spinner class=\"wave-spinner\" ng-show=\"UsersList.isDatagridReloading || !UsersList.isDatagridRendered\"></div>\n" +
    "\n" +
    "                    <div class=\"full-width scroll-horizontal hide-vertical-overflow\" mouse-scroll-horizontal>\n" +
    "                        <div ng-if=\"UsersList.showDatagrid\" ng-class=\"{'modal-overlay-35': UsersList.isDatagridReloading}\">\n" +
    "                            <ui-grid-info ng-if=\"!showInfoBlock\"></ui-grid-info>\n" +
    "                            <div class=\"grid\"\n" +
    "                                 ui-grid=\"UsersList.grid.options\"\n" +
    "                                 ui-grid-pagination\n" +
    "                                 ui-grid-selection\n" +
    "                                 ui-grid-resize-columns\n" +
    "                                 ui-grid-auto-resize></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div fixed-element-while-scrolling=\"#schoolUsersTable\" ng-show=\"showInfoBlock\" class=\"col-sm-9 scroll-floating-element\">\n" +
    "            <div class=\"ibox block-user\">\n" +
    "                <div class=\"ibox-content\">\n" +
    "                    <div class=\"ibox-tools\">\n" +
    "                        <a class=\"close-link\" ng-click=\"UsersList.handleEditCloseClick()\">\n" +
    "                            <i class=\"fa fa-times\"></i>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"tab-content\">\n" +
    "                        <div class=\"tab-pane active\">\n" +
    "\n" +
    "                            <div class=\"row m-b-lg\" ng-show=\"user.id\">\n" +
    "                                <div class=\"col-lg-4 text-center\">\n" +
    "                                    <div class=\"m-b-sm\">\n" +
    "                                        <img alt=\"image\" class=\"img-circle\" gravatar-src=\"user.email\" gravatar-size=\"100\">\n" +
    "                                    </div>\n" +
    "                                    <div class=\"m-b-sm\">\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-lg-8\">\n" +
    "                                    <h2>\n" +
    "                                        {{user.fullname}}\n" +
    "                                    </h2>\n" +
    "                                    <a href=\"mailto:{{user.email}}\" class=\"btn btn-primary btn-sm\" ng-class=\"{disabled: !UsersList.hasWriteAccess}\">\n" +
    "                                        <i class=\"fa fa-envelope\"></i> Send Email\n" +
    "                                    </a>\n" +
    "                                    <a class=\"btn btn-warning btn-sm\"\n" +
    "                                       ng-show=\"!user.active\"\n" +
    "                                       ng-click=\"handleActivateClick(user)\"\n" +
    "                                       ng-class=\"{'disabled':activateInProgress || !UsersList.hasWriteAccess}\">\n" +
    "                                        <i class=\"fa fa-undo\"></i> Activate\n" +
    "                                    </a>\n" +
    "                                    <a class=\"btn btn-danger btn-sm\"\n" +
    "                                       ng-show=\"user.active\"\n" +
    "                                       ng-click=\"handleDeactivateClick(user)\"\n" +
    "                                       ng-class=\"{'disabled':deactivateInProgress || !UsersList.hasWriteAccess}\">\n" +
    "                                        <i class=\"fa fa-ban\"></i> Deactivate\n" +
    "                                    </a>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"client-detail\">\n" +
    "                                <div class=\"full-height-scroll\">\n" +
    "                                    <div class=\"row\">\n" +
    "                                        <div class=\"col-lg-12\">\n" +
    "                                            <div class=\"tabs-container\">\n" +
    "                                                <uib-tabset active=\"activeTab\">\n" +
    "                                                    <uib-tab heading=\"Personal details\" disable=\"disabledInstitutionsUserListSubTabs['personalDetails']\">\n" +
    "                                                        <div ng-include src=\"'/scripts/components/users/list/institutions/personal-details/institutionsUsersListPersonalDetailsView.html'\"></div>\n" +
    "                                                    </uib-tab>\n" +
    "                                                    <uib-tab heading=\"Permissions\" disable=\"disabledInstitutionsUserListSubTabs['permissions']\">\n" +
    "                                                        <div ng-include src=\"'/scripts/components/users/list/institutions/permissions/institutionsUsersListPermissionsView.html'\"></div>\n" +
    "                                                    </uib-tab>\n" +
    "                                                    <uib-tab heading=\"Institutions\" disable=\"disabledInstitutionsUserListSubTabs['institutions']\">\n" +
    "                                                        <div ng-include src=\"'/scripts/components/users/list/institutions/institutions/institutionsUsersListInstitutionsView.html'\"></div>\n" +
    "                                                    </uib-tab>\n" +
    "                                                </uib-tabset>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <pre ng-show=\"UsersList.devMode\">{{user|json}}</pre>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/dashboard/admin/dashboardAdminView.html',
    "<div class=\"admin-dashboard wrapper wrapper-content\" ng-controller=\"AdminDashboardController as AdminDashboard\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-lg-6\">\n" +
    "            <div class=\"ibox\">\n" +
    "                <div class=\"ibox-title\">\n" +
    "                    <h5>You have access to the following institutions</h5>\n" +
    "                    <div class=\"ibox-tools\">\n" +
    "                        <a ng-click=\"showHide()\" class=\"collapse-link\">\n" +
    "                            <i class=\"fa fa-chevron-up\"></i>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"ibox-content\">\n" +
    "                    <ul class=\"list-group clear-list m-t\">\n" +
    "                        <li class=\"list-group-item fist-item\">\n" +
    "                            All institutions\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-lg-6\">\n" +
    "            <div class=\"ibox\">\n" +
    "                <div class=\"ibox-title\">\n" +
    "                    <h5>Your roles are</h5>\n" +
    "                    <div class=\"ibox-tools\">\n" +
    "                        <a ng-click=\"showHide()\" class=\"collapse-link\">\n" +
    "                            <i class=\"fa fa-chevron-up\"></i>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"ibox-content\">\n" +
    "                    <ul class=\"list-group clear-list m-t\">\n" +
    "                        <li ng-if=\"!userRoles.length\" class=\"list-group-item fist-item\">\n" +
    "                            None\n" +
    "                        </li>\n" +
    "                        <li ng-if=\"userRoles.length\" class=\"list-group-item\" ng-class=\"{'fist-item': key === 0}\" ng-repeat=\"(key,role) in userRoles\">\n" +
    "                            {{role}}\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/institutions/department/departmentOverview.html',
    "<div  class=\"wrapper wrapper-content animated fadeInRight page-institution\" ng-controller=\"DepartmentOverviewController as DepartmentOverviewController\">\n" +
    "    <div class=\"row\">\n" +
    "        <div id=\"departmentOverview\" ng-class=\"DepartmentOverviewController.isRightSidePanelActive() ? 'col-sm-8' : 'col-sm-12'\">\n" +
    "            <!-- SECTION -->\n" +
    "            <div class=\"section\">\n" +
    "              <!-- SECTION HEADER -->\n" +
    "              <div class=\"section-header\">\n" +
    "                <!-- Institution switch for QS users -->\n" +
    "                <div class=\"search-dropdown pull-left\">\n" +
    "                    <ui-select\n" +
    "                        ng-model=\"DepartmentOverviewController.institution.selected\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        ng-change=\"DepartmentOverviewController.handleSearchInstitutionClick(DepartmentOverviewController.institution.selected)\">\n" +
    "                        <ui-select-match placeholder=\"Institution search...\">\n" +
    "                            <i class=\"fa fa-building\"></i>\n" +
    "                            <span>{{$select.selected.name}}</span>\n" +
    "                        </ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          refresh-delay=\"500\"\n" +
    "                          refresh=\"DepartmentOverviewController.searchInstitution($select.search)\"\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option in DepartmentOverviewController.institutionsList | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.name | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                    </ui-select>\n" +
    "                    <div class=\"spinner\" ng-show=\"DepartmentOverviewController.searchInProgress\" wave-spinner></div>\n" +
    "                </div>\n" +
    "\n" +
    "                <button class=\"btn btn-primary pull-right\"\n" +
    "                        ng-disabled=\"DepartmentOverviewController.isAddButtonDisabled()\"\n" +
    "                        ng-click=\"handleAddDepartmentClick()\">\n" +
    "                    <i class=\"fa fa-plus\"></i>\n" +
    "                    <span>Add Department</span>\n" +
    "                </button>\n" +
    "              </div><!-- /SECTION HEADER -->\n" +
    "\n" +
    "              <!-- SECTION BODY -->\n" +
    "              <div class=\"section-body\">\n" +
    "                <div id=\"departmentsTable\" ng-class=\"{'locked': !DepartmentOverviewController.isInstitutionSelected()}\">\n" +
    "                    <div wave-spinner class=\"wave-spinner\" ng-show=\"DepartmentOverviewController.isDatagridReloading || !isDatagridRendered\"></div>\n" +
    "\n" +
    "                    <div ng-if=\"!DepartmentOverviewController.isDatagridReloading && gridOptions\">\n" +
    "                        <ui-grid-info ng-if=\"!DepartmentOverviewController.isRightSidePanelActive()\"></ui-grid-info>\n" +
    "                        <div class=\"grid\"\n" +
    "                           ui-grid=\"gridOptions\"\n" +
    "                           ui-grid-draggable-rows\n" +
    "                           ui-grid-selection\n" +
    "                           ui-grid-resize-columns\n" +
    "                           ui-grid-auto-resize>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "              </div><!-- /SECTION BODY -->\n" +
    "            </div><!-- /SECTION -->\n" +
    "        </div>\n" +
    "\n" +
    "        <div id=\"departmentOverviewForm\">\n" +
    "          <div ng-show=\"showDepartmentEditForm || showDepartmentAddForm\"\n" +
    "            id=\"departmentBlockPanel\"\n" +
    "            fixed-element-while-scrolling=\"#departmentsTable\"\n" +
    "            class=\"col-sm-4\"\n" +
    "            ng-controller=\"DepartmentOverviewFormController as DepartmentFormController\">\n" +
    "            <div class=\"department-form\" ng-show=\"showDepartmentEditForm\" ng-include src=\"'/scripts/components/profiles/tu/departments/tuProfileEditDepartmentFormView.html'\"></div>\n" +
    "            <div class=\"department-form\" ng-show=\"showDepartmentAddForm\" ng-include src=\"'/scripts/components/profiles/tu/departments/tuProfileAddDepartmentFormView.html'\"></div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/institutions/list/datagrid/rowTemplate.html',
    "<div grid=\"grid\">\n" +
    "    <div class=\"ui-grid-cell pointer\"\n" +
    "        ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\"\n" +
    "        ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader, 'active': row.entity.id == grid.appScope.selectedInstitutionId }\"\n" +
    "        role=\"{{col.isRowHeader ? 'rowheader' : 'gridcell'}}\"\n" +
    "        ui-grid-cell>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/institutions/list/datagrid/selectCellTemplate.html',
    "<div class=\"ui-grid-cell-contents\">{{COL_FIELD CUSTOM_FILTERS | boolToText:col.filter.selectOptions}}</div>\n"
  );


  $templateCache.put('/scripts/components/institutions/list/institutionsListView.html',
    "<div class=\"wrapper wrapper-content animated fadeInRight page-institution-list\" ng-controller=\"InstitutionsListController as InstitutionsController\">\n" +
    "\n" +
    "    <p>\n" +
    "        <button type=\"button\" class=\"btn btn-primary\"\n" +
    "                ng-click=\"InstitutionsController.handleAddInstitutionClick()\"\n" +
    "                ng-class=\"{'modal-overlay-35': !isDatagridRendered}\">\n" +
    "            <i class=\"fa fa-building-o\"></i>\n" +
    "            Add Institution\n" +
    "        </button>\n" +
    "    </p>\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div id=\"institutionsTable\" ng-class=\"showInfoBlock ? 'col-sm-3 col-xs-4 hide-ng-table-pager' : 'col-sm-12'\">\n" +
    "            <div class=\"ibox float-e-margins\">\n" +
    "                <div class=\"ibox-content\">\n" +
    "                    <div wave-spinner class=\"wave-spinner\" ng-show=\"isDatagridReloading || !isDatagridRendered\"></div>\n" +
    "\n" +
    "                    <div ng-if=\"!isDatagridReloading && gridOptions\">\n" +
    "                        <ui-grid-info ng-if=\"!showInfoBlock\"></ui-grid-info>\n" +
    "                        <div class=\"grid\"\n" +
    "                             ui-grid=\"gridOptions\"\n" +
    "                             ui-grid-selection\n" +
    "                             ui-grid-resize-columns\n" +
    "                             ui-grid-auto-resize\n" +
    "                             ui-grid-cellnav\n" +
    "                             ui-grid-pagination></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div fixed-element-while-scrolling=\"#institutionsTable\" ng-show=\"showInfoBlock\" class=\"col-sm-9 col-xs-8\">\n" +
    "            <div class=\"ibox block-institution\">\n" +
    "                <div class=\"ibox-content\">\n" +
    "                    <div class=\"ibox-tools\">\n" +
    "                        <a class=\"close-link\" ng-click=\"InstitutionsController.handleEditCloseClick()\">\n" +
    "                            <i class=\"fa fa-times\"></i>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                    <div class=\"tab-content\">\n" +
    "                        <div class=\"tab-pane active\">\n" +
    "                            <div class=\"row m-b-lg\" ng-show=\"institution.id\">\n" +
    "                                <div class=\"col-lg-12\">\n" +
    "                                    <h2>\n" +
    "                                        {{institutionBeforeChanges.name}}\n" +
    "                                    </h2>\n" +
    "\n" +
    "                                    <a ng-show=\"!institution.active\" ng-click=\"handleActivateClick(institution)\" class=\"btn btn-warning btn-sm pull-left m-b-xs\" ng-class=\"{'disabled':activateInProgress}\">\n" +
    "                                        <i class=\"fa fa-undo\"></i> Activate\n" +
    "                                    </a>\n" +
    "\n" +
    "                                    <a ng-show=\"institution.active\" ng-click=\"handleDeactivateClick(institution)\" class=\"btn btn-danger btn-sm pull-left m-b-xs\" ng-class=\"{'disabled':deactivateInProgress}\">\n" +
    "                                        <i class=\"fa fa-ban\"></i> Deactivate\n" +
    "                                    </a>\n" +
    "\n" +
    "                                    <a class=\"btn btn-default btn-sm pull-left m-b-xs\" ng-click=\"handleResetClick(institution)\">\n" +
    "                                        <i class=\"fa fa-refresh\"></i> Reset unsaved changes\n" +
    "                                    </a>\n" +
    "\n" +
    "                                    <a ng-if=\"allowLoginAs()\" class=\"btn btn-default btn-sm pull-left m-b-xs\" ng-click=\"handleLoginAsClick()\">\n" +
    "                                        <i class=\"fa fa-sign-in\"></i> Login as institution\n" +
    "                                    </a>\n" +
    "\n" +
    "                                    <a class=\"btn btn-default btn-sm pull-left m-b-xs\"\n" +
    "                                       uib-popover=\"{{InstitutionsController.downgradeProgramTooltipText()}}\"\n" +
    "                                       popover-placement=\"bottom\"\n" +
    "                                       popover-enable=\"isProgramDowngradeDisabled\"\n" +
    "                                       popover-trigger=\"'mouseenter'\"\n" +
    "                                       ng-if=\"InstitutionsController.allowProgramDowngrade()\"\n" +
    "                                       ng-click=\"!isProgramDowngradeDisabled && InstitutionsController.handleProgramDowngradeClick($event)\"\n" +
    "                                       ng-disabled=\"isProgramDowngradeDisabled\">\n" +
    "                                        <i class=\"fa fa-arrow-circle-o-down\"></i> Downgrade to Basic Program\n" +
    "                                    </a>\n" +
    "\n" +
    "                                    <a class=\"btn btn-default btn-sm pull-left m-b-xs\"\n" +
    "                                       ng-if=\"InstitutionsController.isSimple\"\n" +
    "                                       ng-disabled=\"InstitutionsController.isUpgradeButtonDisabled()\"\n" +
    "                                       ng-click=\"!InstitutionsController.isUpgradeButtonDisabled() &&InstitutionsController.handleUpgradeClick()\"\n" +
    "\n" +
    "                                       uib-popover=\"Mandatory fields must be entered first to upgrade.\"\n" +
    "                                       popover-placement=\"bottom\"\n" +
    "                                       popover-enable=\"InstitutionsController.isUpgradeButtonDisabled()\"\n" +
    "                                       popover-trigger=\"'mouseenter'\">\n" +
    "                                        <i class=\"fa fa-arrow-circle-o-up\"></i> Upgrade to Client Department\n" +
    "                                    </a>\n" +
    "\n" +
    "                                    <a class=\"btn btn-default btn-sm pull-left m-b-xs\"\n" +
    "                                       ng-if=\"InstitutionsController.isClient\"\n" +
    "                                       ng-disabled=\"InstitutionsController.isClientDepartmentDowngradeDisabled()\"\n" +
    "                                       ng-click=\"!InstitutionsController.isClientDepartmentDowngradeDisabled() && InstitutionsController.handleDowngradeClick()\"\n" +
    "\n" +
    "                                       uib-popover=\"Unable to downgrade due to current TU/TM subscription.\"\n" +
    "                                       popover-placement=\"bottom\"\n" +
    "                                       popover-enable=\"InstitutionsController.isClientDepartmentDowngradeDisabled()\"\n" +
    "                                       popover-trigger=\"'mouseenter'\">\n" +
    "                                        <i class=\"fa fa-arrow-circle-o-down\"></i> Downgrade to Simple Department\n" +
    "                                    </a>\n" +
    "\n" +
    "\n" +
    "                                    <a class=\"btn pull-left btn-default btn-sm m-b-xs\" target=\"_blank\"\n" +
    "                                       ng-href=\"{{InstitutionsController.isViewTuSiteEnabled() ? InstitutionsController.urls.tu + institution.nids.master : ''}}\"\n" +
    "                                       ng-if=\"InstitutionsController.allowViewTuSite()\"\n" +
    "                                       ng-disabled=\"!InstitutionsController.isViewTuSiteEnabled()\"\n" +
    "\n" +
    "                                       uib-popover=\"{{institution.nids.master ? 'Display on topuniversities.com is disabled under Subscriptions tab.' : 'Please publish TU profiles first'}}\"\n" +
    "                                       popover-placement=\"bottom\"\n" +
    "                                       popover-enable=\"!InstitutionsController.isViewTuSiteEnabled()\"\n" +
    "                                       popover-trigger=\"'mouseenter'\">\n" +
    "                                        <i class=\"fa fa-share\"></i> View TU Site\n" +
    "                                    </a>\n" +
    "\n" +
    "                                    <a class=\"btn pull-left btn-default btn-sm m-b-xs\" target=\"_blank\"\n" +
    "                                       ng-if=\"InstitutionsController.allowViewTmSite()\"\n" +
    "                                       ng-href=\"{{InstitutionsController.allowViewTmSiteButtonEnabled() ? InstitutionsController.urls.tm + institution.nids.tm : ''}}\"\n" +
    "                                       ng-disabled=\"!InstitutionsController.allowViewTmSiteButtonEnabled()\"\n" +
    "\n" +
    "                                       uib-popover=\"{{institution.nids.master ? 'Display on topmba.com  is disabled under Subscriptions tab.' : 'Please publish TM profile first'}}\"\n" +
    "                                       popover-placement=\"bottom\"\n" +
    "                                       popover-enable=\"!InstitutionsController.allowViewTmSiteButtonEnabled()\"\n" +
    "                                       popover-trigger=\"'mouseenter'\">\n" +
    "                                        <i class=\"fa fa-share\"></i> View TM Site\n" +
    "                                    </a>\n" +
    "                                    \n" +
    "                                    <button ng-if=\"InstitutionsController.isAdvancedProgram || InstitutionsController.isTopLevelInstitution(institution.typeId)\"\n" +
    "                                       class=\"btn btn-default btn-sm\"\n" +
    "                                       ui-sref=\"staff.institutions.department({coreId: institution.coreId, name: institution.name})\"\n" +
    "                                       ng-disabled=\"!InstitutionsController.isDisplayDepartmentEnabled\">Display Departments\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"institution-detail\">\n" +
    "                                <div class=\"full-height-scroll\">\n" +
    "                                    <div class=\"row\">\n" +
    "                                        <div class=\"col-lg-12\">\n" +
    "                                            <div class=\"tabs-container\">\n" +
    "                                                <uib-tabset active=\"activeTab\">\n" +
    "                                                    <uib-tab heading=\"Basic Details\" disable=\"disabledInstitutionListTabs['basicDetails']\">\n" +
    "                                                        <div ng-include src=\"'/scripts/components/institutions/list/partial/basicDetails.html'\"></div>\n" +
    "                                                    </uib-tab>\n" +
    "\n" +
    "                                                    <uib-tab heading=\"Subscriptions\" disable=\"disabledInstitutionListTabs['subscriptions']\">\n" +
    "                                                        <div ng-include src=\"'/scripts/components/institutions/list/subscriptions/institutionsListSubscriptionsView.html'\"></div>\n" +
    "                                                    </uib-tab>\n" +
    "\n" +
    "                                                    <uib-tab heading=\"Campuses\" disable=\"disabledInstitutionListTabs['campuses']\">\n" +
    "                                                        <div ng-include src=\"'/scripts/components/institutions/list/partial/campuses.html'\"></div>\n" +
    "                                                    </uib-tab>\n" +
    "\n" +
    "                                                    <uib-tab heading=\"Group Institutions\" disable=\"disabledInstitutionListTabs['institutionGroups']\">\n" +
    "                                                        <div ng-include src=\"'/scripts/components/institutions/list/partial/groupInstitutions.html'\"></div>\n" +
    "                                                    </uib-tab>\n" +
    "\n" +
    "                                                    <uib-tab heading=\"Drupal\" disable=\"disabledInstitutionListTabs['drupal']\">\n" +
    "                                                        <div ng-include src=\"'/scripts/components/institutions/list/partial/drupal.html'\"></div>\n" +
    "                                                    </uib-tab>\n" +
    "                                                    \n" +
    "                                                    <uib-tab disable=\"disabledInstitutionListTabs['status']\">\n" +
    "                                                        <uib-tab-heading>\n" +
    "                                                            <span ng-class=\"{'text-danger': InstitutionsController.hasMissingFields()}\">Status</span>\n" +
    "                                                        </uib-tab-heading>\n" +
    "                                                        <div ng-include src=\"'/scripts/components/institutions/list/status/institutionsListStatusView.html'\"></div>\n" +
    "                                                    </uib-tab>\n" +
    "                                                </uib-tabset>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <pre ng-show=\"InstitutionsController.devMode\">{{institution|json}}</pre>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/institutions/list/partial/basicDetails.html',
    "<div class=\"panel-body\">\n" +
    "    <div class=\"row\">\n" +
    "        <form name=\"forms.basicDetailsForm\" class=\"clearfix\" novalidate>\n" +
    "            <div class=\"col-lg-6 block-basic-details\">\n" +
    "                <div class=\"form-group\" ng-class=\"{'has-errors': InstitutionsController.isInvalidNewSchoolName}\">\n" +
    "                    <label>Name *</label>\n" +
    "\n" +
    "                    <div ng-if=\"institution.id\">\n" +
    "                        <input type=\"text\" class=\"form-control\"\n" +
    "                            name=\"name\"\n" +
    "                            ng-model=\"institution.name\"\n" +
    "                            ng-required=\"true\"\n" +
    "                            custom-popover\n" +
    "                            popover-html=\"Add institution name\"\n" +
    "                            popover-placement=\"left\"\n" +
    "                            popover-trigger=\"manual\"\n" +
    "                            popover-visibility=\"{{InstitutionsController.isInvalidNewSchoolName}}\"\n" +
    "                            ng-focus=\"InstitutionsController.setIsInvalidNewSchoolName(false)\">\n" +
    "                    </div>\n" +
    "                    <div ng-if=\"!institution.id\">\n" +
    "                        <input type=\"text\" class=\"form-control\"\n" +
    "                            name=\"name\"\n" +
    "                            ng-model=\"institution.name\"\n" +
    "                            ng-required=\"true\"\n" +
    "                            ng-change=\"InstitutionsController.findSimilar(institution)\"\n" +
    "                            ng-model-options=\"{ debounce: 750 }\"\n" +
    "                            custom-popover\n" +
    "                            popover-html=\"Add institution name\"\n" +
    "                            popover-placement=\"left\"\n" +
    "                            popover-trigger=\"manual\"\n" +
    "                            popover-visibility=\"{{InstitutionsController.isInvalidNewSchoolName}}\"\n" +
    "                            ng-focus=\"InstitutionsController.setIsInvalidNewSchoolName(false)\">\n" +
    "                        <div wave-spinner class=\"wave-spinner\" ng-show=\"InstitutionsController.similarNames.loading\"></div>\n" +
    "\n" +
    "                        <div class=\"similar-names\" ng-show=\"!institution.id && InstitutionsController.similarNames.display\">\n" +
    "                            <small class=\"m-b block\">\n" +
    "                                <span class=\"text-muted\">Similarly named existing institutions:</span>\n" +
    "                                <span class=\"text-navy\" ng-show=\"!InstitutionsController.similarNames.results.length\">no results</span>\n" +
    "                            </small>\n" +
    "                            <div ng-show=\"!InstitutionsController.similarNames.loading\" class=\"text-center\">\n" +
    "                                <div ng-repeat=\"similarInstitution in InstitutionsController.similarNames.results\">\n" +
    "                                    <div><a target=\"_blank\" ng-href=\"/#/profiles/institution-details?coreId={{similarInstitution.coreId}}\">{{similarInstitution.name}} {{similarInstitution.active ? '' : '[inactive]'}}</a></div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\" ng-class=\"{'has-errors': InstitutionsController.isInvalidType}\">\n" +
    "                    <label>Type * </label>\n" +
    "                    <ui-select\n" +
    "                        name=\"typeId\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        ng-disabled=\"institution.id\"\n" +
    "                        ng-model=\"selectedItem.selectedOptionType\"\n" +
    "                        on-select=\"InstitutionsController.setSelectedOptionType(selectedItem.selectedOptionType)\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        custom-popover\n" +
    "                        popover-html=\"Select an option\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{InstitutionsController.isInvalidType ? true : false}}\"\n" +
    "                        >\n" +
    "                        <ui-select-match placeholder=\"Select an option\">{{$select.selected.name}}</ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                            position=\"down\"\n" +
    "                            ui-disable-choice=\"option.disabled\"\n" +
    "                            repeat=\"option in InstitutionsController.typesList | filter:$select.search track by option.uniqueId\">\n" +
    "                            <div ng-bind-html=\"option.name | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\" ng-show=\"InstitutionsController.isClientDepartment(institution.typeId)\" ng-class=\"{'has-errors': InstitutionsController.isInvalidBelongsTo}\">\n" +
    "                    <label>\n" +
    "                        Belongs to *\n" +
    "                    </label>\n" +
    "                    <ui-select\n" +
    "                        name=\"belongsTo\"\n" +
    "                        ng-required=\"InstitutionsController.isClientDepartment(institution.typeId)\"\n" +
    "                        ng-model=\"institution.belongsTo\"\n" +
    "                        on-select=\"InstitutionsController.setIsInvalidBelongsTo(false)\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        reset-search-input=\"true\"\n" +
    "                        custom-popover\n" +
    "                        popover-html=\"Select an option\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{InstitutionsController.isInvalidBelongsTo ? true : false}}\"\n" +
    "                        >\n" +
    "                        <ui-select-match placeholder=\"Select an option\">{{$select.selected.title}}</ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                            position=\"down\"\n" +
    "                            repeat=\"option.id as option in InstitutionsController.belongsToList | filter:$select.search\">\n" +
    "                            <div ng-bind-html=\"option.title | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <switch class=\"green\"\n" +
    "                            ng-model=\"institution.businessSchool\"\n" +
    "                            ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId)\"></switch>\n" +
    "                    Business School\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <switch class=\"green\" name=\"hasNoDepartments\"\n" +
    "                            ng-model=\"institution.hasNoDepartments\"\n" +
    "                            ng-disabled=\"InstitutionsController.isClientDepartment(institution.typeId) || InstitutionsController.isSimpleDepartment(institution.typeId)\"></switch> Has No Departments\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col-lg-6 block-contact-types\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label>Local Name</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"institution.localName\" name=\"localName\">\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group force-width-100\"\n" +
    "                     ng-show=\"InstitutionsController.showParentInstitution(institution.typeId)\"\n" +
    "                     ng-class=\"{'has-errors': InstitutionsController.isInvalidParentInstitution}\">\n" +
    "                    <label>Parent institution *</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"institution.parentName\" ng-show=\"institution.id\" disabled/>\n" +
    "                    <div class=\"search-institutions\" ng-show=\"!institution.id\">\n" +
    "                        <ui-select\n" +
    "                            close-on-select=\"true\"\n" +
    "                            ng-model=\"institution.parent\"\n" +
    "                            on-select=\"InstitutionsController.handleSearchInstitutionClick($item)\"\n" +
    "                            theme=\"bootstrap\"\n" +
    "                            name=\"parentInstitution\"\n" +
    "                            reset-search-input=\"true\"\n" +
    "                            custom-popover\n" +
    "                            popover-html=\"Type parent institution name\"\n" +
    "                            popover-placement=\"left\"\n" +
    "                            popover-trigger=\"manual\"\n" +
    "                            popover-visibility=\"{{InstitutionsController.isInvalidParentInstitution}}\"\n" +
    "                            ng-click=\"InstitutionsController.setIsInvalidParentInstitution(false)\"\n" +
    "                            >\n" +
    "                            <ui-select-match placeholder=\"Type parent institution name...\">{{$select.selected.name}}</ui-select-match>\n" +
    "                            <ui-select-choices\n" +
    "                                refresh-delay=\"1000\"\n" +
    "                                refresh=\"searchTopLevelInstitutions($select.search)\"\n" +
    "                                position=\"down\"\n" +
    "                                repeat=\"option in parentInstitutionSearchResults | filter:$select.search\">\n" +
    "                                <div ng-bind-html=\"option.name | highlight: $select.search\"></div>\n" +
    "                            </ui-select-choices>\n" +
    "                            <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                        </ui-select>\n" +
    "\n" +
    "                        <div class=\"show-departments mt-5px\" ng-show=\"institution.parentCoreId\">\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-lg-12\">\n" +
    "                                    <div class=\"ibox-tools\">\n" +
    "                                        <button class=\"btn btn-default btn-xs\"\n" +
    "                                                ng-show=\"!InstitutionsController.showDepartments.display\"\n" +
    "                                                ng-click=\"InstitutionsController.showDepartments()\">Show All Departments</button>\n" +
    "                                        <a class=\"close-link\"\n" +
    "                                           ng-show=\"InstitutionsController.showDepartments.display\"\n" +
    "                                           ng-click=\"InstitutionsController.handleDepartmentsListCloseClick()\">\n" +
    "                                            <i class=\"fa fa-times\"></i>\n" +
    "                                        </a>\n" +
    "\n" +
    "                                        <div class=\"pull-left\" ng-show=\"!InstitutionsController.showDepartments.loading && InstitutionsController.showDepartments.display\">\n" +
    "                                            <small class=\"m-b block\">\n" +
    "                                                <span class=\"text-muted\">Current Client departments:</span>\n" +
    "                                                <span class=\"text-navy\" ng-show=\"!InstitutionsController.showDepartments.results.length\">no results</span>\n" +
    "                                            </small>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-lg-12 text-center\">\n" +
    "                                    <div wave-spinner class=\"wave-spinner\" ng-show=\"InstitutionsController.showDepartments.loading\"></div>\n" +
    "                                    <div ng-show=\"InstitutionsController.showDepartments.display && InstitutionsController.showDepartments.results.length\">\n" +
    "                                        <div ng-repeat=\"clientDeparmtent in InstitutionsController.showDepartments.results\">\n" +
    "                                            <div>\n" +
    "                                                <a target=\"_blank\" ng-href=\"/#/profiles/institution-details?coreId={{clientDeparmtent.coreId}}\">{{clientDeparmtent.name}}</a>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label>FileMaker ID</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"institution.filemakerId\" name=\"filemakerId\">\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\" ng-class=\"{'has-errors': InstitutionsController.isInvalidCountry}\">\n" +
    "                    <label>Country *</label>\n" +
    "                    <ui-select\n" +
    "                        id=\"campusCountry\"\n" +
    "                        name=\"countryCode\"\n" +
    "                        ng-model=\"institution.countryCode\"\n" +
    "                        on-select=\"updateCountryName()\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        custom-popover\n" +
    "                        popover-html=\"Select an option\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{InstitutionsController.isInvalidCountry ? true : false}}\"\n" +
    "                        >\n" +
    "                        <ui-select-match placeholder=\"Select an option\">{{$select.selected.name}}</ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                            position=\"auto\"\n" +
    "                            ui-disable-choice=\"option.disabled\"\n" +
    "                            repeat=\"option.countryCode as option in InstitutionsController.countriesList | filter:$select.search\">\n" +
    "                            <div ng-bind-html=\"option.name | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "\n" +
    "                <button class=\"btn btn-primary btn-sm btn-block\"\n" +
    "                        ng-disabled=\"basicDetailsSubmitInProgress\"\n" +
    "                        ng-click=\"handleBasicDetailsSubmit()\">{{institution.id ? 'Update' : 'Save'}}</button>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "        </form>\n" +
    "    </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/institutions/list/partial/campuses.html',
    "<script id=\"ng-table/templates/campus/delete-header.html\" type=\"text/ng-template\">\n" +
    "    <th class=\"header\" ng-if=\"$column.show(this)\">\n" +
    "        <button type=\"button\" class=\"btn btn-danger btn-sm\" ng-class=\"{'disabled': isDeleteButtonDisabled()}\" ng-click=\"handleDeleteClick()\">\n" +
    "            <span class=\"glyphicon glyphicon-trash\"></span> {{$column.title(this)}}\n" +
    "        </button>\n" +
    "    </th>\n" +
    "</script>\n" +
    "<div class=\"panel-body\">\n" +
    "    <div class=\"row\" ng-controller=\"CampusesListController as CampusesController\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"handleAddClick()\" ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId)\">\n" +
    "                <i class=\"fa fa-globe\"></i>\n" +
    "                Add Campus\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div id=\"campusesTable\" ng-class=\"showCampusInfoBlock ? 'col-sm-3' : 'col-sm-12'\">\n" +
    "                <div class=\"ibox float-e-margins\">\n" +
    "                    <display-filtering class=\"pull-right\" columns=\"hiddenColumns\" active=\"filterActive\"></display-filtering>\n" +
    "\n" +
    "                    <table class=\"table table-striped table-bordered table-hover\"\n" +
    "                           ng-show=\"institution.campus.length\"\n" +
    "                           ng-table-dynamic=\"tableParams with columns\"\n" +
    "                           show-filter=\"false\">\n" +
    "                        <tbody ui-sortable=\"sortableOptions\" ng-model=\"institution.campus\">\n" +
    "\n" +
    "                        <tr ng-repeat=\"campus in $data\" ng-class=\"{'active': campus.id == selectedCampusId}\">\n" +
    "                            <td ng-click=\"col.field === 'delete'? '' : handleDataGridRowClickCampus(campus, false)\" ng-repeat=\"col in $columns\">\n" +
    "                                <input ng-if=\"col.field === 'delete'\" ng-model=\"campusesToDelete[campus.id]\" i-checkbox type=\"checkbox\">\n" +
    "                                <p ng-if=\"col.field !== 'delete'\">\n" +
    "                                    {{ campus[col.field] }}\n" +
    "                                </p>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        </tbody>\n" +
    "                    </table>\n" +
    "                    <p ng-show=\"!institution.campus.length && !showCampusInfoBlock\" class=\"text-center text-muted\">\n" +
    "                        List is empty\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-show=\"showCampusInfoBlock\" class=\"col-sm-9 valuesTable\">\n" +
    "                <div class=\"ibox block-campus\">\n" +
    "                    <div class=\"tab-content\">\n" +
    "                        <div class=\"tab-pane active\">\n" +
    "                            <div class=\"client-detail\">\n" +
    "                                <div class=\"full-height-scroll scroll-floating-element\" full-scroll>\n" +
    "                                    <div class=\"row\">\n" +
    "                                        <form name=\"forms.campusDetailsForm\" class=\"clearfix\" ng-class=\"{submitted:submitted}\" novalidate>\n" +
    "                                            <div class=\"col-lg-6\">\n" +
    "\n" +
    "                                                <div class=\"form-group\">\n" +
    "                                                    <label for=\"campusName\">Campus Name *</label>\n" +
    "                                                    <input id=\"campusName\" type=\"text\" class=\"form-control\" ng-model=\"campus.name\" ng-required=\"true\" ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId)\">\n" +
    "                                                </div>\n" +
    "\n" +
    "                                                <div class=\"form-group\">\n" +
    "                                                    <label for=\"campusAddressLine1\">Address Line 1 *</label>\n" +
    "                                                    <input id=\"campusAddressLine1\" type=\"text\" class=\"form-control\" ng-model=\"campus.addressLine1\" ng-required=\"true\" ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId)\">\n" +
    "                                                </div>\n" +
    "\n" +
    "                                                <div class=\"form-group\">\n" +
    "                                                    <label for=\"campusCity\">Town / City *</label>\n" +
    "                                                    <input id=\"campusCity\" type=\"text\" class=\"form-control\" ng-model=\"campus.city\" ng-required=\"true\" ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId)\">\n" +
    "                                                </div>\n" +
    "\n" +
    "                                                <div class=\"form-group\">\n" +
    "                                                    <label for=\"campusPostCode\">Postcode</label>\n" +
    "                                                    <input id=\"campusPostCode\" type=\"text\" class=\"form-control\" ng-model=\"campus.postcode\" ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId)\">\n" +
    "                                                </div>\n" +
    "\n" +
    "                                                <div class=\"form-group\">\n" +
    "                                                    <label for=\"campusLatitude\">Latitude</label>\n" +
    "                                                    <input id=\"campusLatitude\" type=\"text\" class=\"form-control\" ng-model=\"campus.latitude\" ng-change=\"coordinatesChanged()\" ng-readonly=\"campus.autoGenerate || InstitutionsController.isSimpleDepartment(institution.typeId)\">\n" +
    "                                                </div>\n" +
    "\n" +
    "                                                <div class=\"form-group\">\n" +
    "                                                    <label class=\"full-width\">Auto Generate</label>\n" +
    "                                                    <switch ng-model=\"campus.autoGenerate\" class=\"green\" ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId)\"></switch>\n" +
    "                                                    <span>Use the address to auto generate latitude & longitude values.</span>\n" +
    "                                                </div>\n" +
    "\n" +
    "                                                <div class=\"form-group\">\n" +
    "                                                    <label class=\"full-width\">Display In Frontend</label>\n" +
    "                                                    <switch ng-model=\"campus.displayInFrontEnd\" ng-change=\"CampusesController.displayOnFrontEndClick()\" class=\"green\" ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId)\"></switch>\n" +
    "                                                    <span>If selected, campus will be sent to profile. (Latitude and longitude is required)</span>\n" +
    "                                                </div>\n" +
    "\n" +
    "                                            </div>\n" +
    "\n" +
    "                                            <div class=\"col-lg-6\">\n" +
    "\n" +
    "                                                <div class=\"form-group\">\n" +
    "                                                    <label>Country *</label>\n" +
    "                                                    <ui-select\n" +
    "                                                        name=\"country\"\n" +
    "                                                        ng-model=\"campus.country\"\n" +
    "                                                        ng-required=\"true\"\n" +
    "                                                        ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId)\"\n" +
    "                                                        theme=\"bootstrap\">\n" +
    "                                                        <ui-select-match placeholder=\"Select an Option\">{{$select.selected.name}}</ui-select-match>\n" +
    "                                                        <ui-select-choices \n" +
    "                                                            position='down'\n" +
    "                                                            refresh-delay=\"1000\"\n" +
    "                                                            repeat=\"option.countryCode as option in CampusesController.countriesList | filter:$select.search\">\n" +
    "                                                            <div ng-bind-html=\"option.name | highlight: $select.search\"></div>\n" +
    "                                                        </ui-select-choices>\n" +
    "                                                        <ui-select-no-choice>\n" +
    "                                                            Not found\n" +
    "                                                        </ui-select-no-choice>\n" +
    "                                                    </ui-select>\n" +
    "                                                </div>\n" +
    "\n" +
    "                                                <div class=\"form-group\">\n" +
    "                                                    <label for=\"campusAddressLine2\">Address Line 2</label>\n" +
    "                                                    <input id=\"campusAddressLine2\" type=\"text\" class=\"form-control\" ng-model=\"campus.addressLine2\" ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId)\">\n" +
    "                                                </div>\n" +
    "\n" +
    "                                                <div class=\"form-group\">\n" +
    "                                                    <label for=\"campusState\">State / Province</label>\n" +
    "                                                    <input id=\"campusState\" type=\"text\" class=\"form-control\" ng-model=\"campus.state\" ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId)\">\n" +
    "                                                </div>\n" +
    "\n" +
    "                                                <div class=\"form-group\">\n" +
    "                                                    <label for=\"campusLongitude\">Longitude</label>\n" +
    "                                                    <input id=\"campusLongitude\" type=\"text\" class=\"form-control\" ng-model=\"campus.longitude\" ng-change=\"coordinatesChanged()\" ng-readonly=\"campus.autoGenerate || InstitutionsController.isSimpleDepartment(institution.typeId)\">\n" +
    "                                                </div>\n" +
    "\n" +
    "                                                 <div class=\"form-group\">\n" +
    "                                                    <label class=\"full-width\">Primary Campus</label>\n" +
    "                                                    <switch id=\"campusPrimary\" ng-model=\"campus.primary\" class=\"green\" ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId)\"></switch>\n" +
    "                                                </div>\n" +
    "\n" +
    "                                                <div class=\"form-group\">\n" +
    "                                                    <a class=\"btn btn-primary btn-sm btn-block\" ng-class=\"{'disabled':campusSubmitInProgress || InstitutionsController.isSimpleDepartment(institution.typeId)}\" ng-click=\"handleCampusSubmit()\">{{getMode() ? 'Update' : 'Save'}}</a>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                        </form>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"row\">\n" +
    "                                        <div class=\"col-lg-12\">\n" +
    "                                            <section id=\"map\" ng-controller=\"CampusesListController\" class=\"form-group\">\n" +
    "                                                <div id=\"campusMap\" class=\"h-166\"></div>\n" +
    "                                            </section>\n" +
    "                                            <p class=\"text-center\">\n" +
    "                                                <button type=\"button\" class=\"btn btn-default btn-xs\"\n" +
    "                                                        ng-click=\"CampusesController.refreshMap()\"\n" +
    "                                                        ng-disabled=\"refreshMapInProgress\">Refresh Map</button>\n" +
    "                                            </p>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/institutions/list/partial/drupal.html',
    "<div class=\"panel-body\">\n" +
    "    <div class=\"row\">\n" +
    "        <form name=\"forms.drupalForm\" class=\"clearfix\" novalidate>\n" +
    "\n" +
    "            <div class=\"col-lg-6\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label>Overview node ID</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"institution.nids.master\" disabled=\"disabled\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label>UG node ID</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"institution.nids.ug\" disabled=\"disabled\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label>PG node ID</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"institution.nids.pg\" disabled=\"disabled\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label>TM node ID</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"institution.nids.tm\" disabled=\"disabled\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col-lg-6\">\n" +
    "                <div class=\"form-group\" ng-class=\"{'has-errors': InstitutionsController.isInvalidTuRegion}\" ng-if=\"!InstitutionsController.isAdvancedProgram\">\n" +
    "                    <label>TU Region *</label>\n" +
    "                    <ui-select\n" +
    "                        name=\"tuRegion\"\n" +
    "                        ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId)\"\n" +
    "                        ng-model=\"institution.drupalTuRegionId\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId)\"\n" +
    "                        on-select=\"InstitutionsController.setIsInvalidTuRegion(false)\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        custom-popover\n" +
    "                        popover-html=\"Select an option\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{InstitutionsController.isInvalidTuRegion}}\"\n" +
    "                        >\n" +
    "                        <ui-select-match placeholder=\"Select an option\">{{$select.selected.name}}</ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                            position=\"down\"\n" +
    "                            ui-disable-choice=\"option.disabled\"\n" +
    "                            repeat=\"option.tid as option in InstitutionsController.tuRegionsList\">\n" +
    "                            <div ng-bind-html=\"option.name | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\" ng-class=\"{'has-errors': InstitutionsController.isInvalidTmRegion}\">\n" +
    "                    <label>TM Region *</label>\n" +
    "                    <ui-select\n" +
    "                        name=\"tmRegion\"\n" +
    "                        ng-model=\"institution.drupalTmRegionId\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId)\"\n" +
    "                        on-select=\"InstitutionsController.setIsInvalidTmRegion(false)\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        custom-popover\n" +
    "                        popover-html=\"Select an option\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{InstitutionsController.isInvalidTmRegion}}\"\n" +
    "                        >\n" +
    "                        <ui-select-match placeholder=\"Select an option\">{{$select.selected.name}}</ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                            position=\"down\"\n" +
    "                            ui-disable-choice=\"option.disabled\"\n" +
    "                            repeat=\"option.tid as option in InstitutionsController.tmRegionsList\">\n" +
    "                            <div ng-bind-html=\"option.name | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "\n" +
    "                <button class=\"btn btn-primary btn-sm btn-block\"\n" +
    "                   ng-disabled=\"drupalSubmitInProgress || InstitutionsController.isSimpleDepartment(institution.typeId)\"\n" +
    "                   ng-click=\"handleDrupalSubmit()\">Update</button>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/institutions/list/partial/groupInstitutions.html',
    "<div class=\"panel-body\">\n" +
    "    <div class=\"row\">\n" +
    "        <div wave-spinner class=\"wave-spinner\" ng-show=\"isSelectReloading\"></div>\n" +
    "\n" +
    "        <div class=\"col-lg-12 block-group-institutions-search\">\n" +
    "         <label>Access to Outreach for C121 and CM only</label>\n" +
    "            <ui-select\n" +
    "                      ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId)\"\n" +
    "                      multiple\n" +
    "                       close-on-select=\"false\"\n" +
    "                       ng-model=\"institution.groupMembers\"\n" +
    "                       theme=\"bootstrap\"\n" +
    "                       reset-search-input=\"true\">\n" +
    "                <ui-select-match placeholder=\"Type institution name...\">{{$item.name}}</ui-select-match>\n" +
    "                <ui-select-choices refresh-delay=\"1000\"\n" +
    "                                   refresh=\"searchInstitutionsWithoutGroup($select.search)\"\n" +
    "                                   repeat=\"option in institutionsWithoutGroup | filter:$select.search\">\n" +
    "                    <div ng-bind-html=\"option.name | highlight: $select.search\"></div>\n" +
    "                </ui-select-choices>\n" +
    "            </ui-select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <br>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-lg-6 block-group-institutions-warning\">\n" +
    "            <i>Institution \"{{institution.name}}\" will be included by default</i>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-lg-6 block-group-institutions-update\">\n" +
    "            <a class=\"btn btn-primary btn-sm btn-block\" ng-class=\"{'disabled': disallowGroupsSubmit() || InstitutionsController.isSimpleDepartment(institution.typeId)}\" ng-click=\"handleInstitutionGroupSubmit()\">Update</a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/institutions/list/status/institutionsListStatusView.html',
    "<div class=\"panel-body\" ng-controller=\"InstitutionsListStatusController as InstitutionsListStatusController\">\n" +
    "    <div class=\"row\">\n" +
    "\n" +
    "        <div class=\"col-lg-4\">\n" +
    "            <div class=\"ibox float-e-margins\">\n" +
    "                <div class=\"ibox-title\">\n" +
    "                    <h5>Basic details</h5>\n" +
    "                </div>\n" +
    "                <div class=\"ibox-content no-padding\">\n" +
    "                    <ul class=\"list-group\">\n" +
    "                        <li class=\"list-group-item\">\n" +
    "                            <i ng-class=\"InstitutionsListStatusController.institution.name ? 'fa-check text-navy' : 'fa-times text-danger'\" class=\"fa\"></i>\n" +
    "                            <span class=\"m-l-xs\">Name</span>\n" +
    "                            <span class=\"m-l-xs text-muted\"\n" +
    "                                  ng-show=\"InstitutionsListStatusController.institution.name\"> - {{InstitutionsListStatusController.institution.name}}</span>\n" +
    "                            <i class=\"fa fa-info-circle pull-right m-t-xs\" tooltip-placement=\"top\" uib-tooltip=\"Name is a compulsory field.\"></i>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\">\n" +
    "                            <i ng-class=\"InstitutionsListStatusController.institution.type ? 'fa-check text-navy' : 'fa-times text-danger'\" class=\"fa\"></i>\n" +
    "                            <span class=\"m-l-xs\">Type</span>\n" +
    "                            <span class=\"m-l-xs text-muted\"\n" +
    "                                  ng-show=\"InstitutionsListStatusController.institution.type\"> - {{InstitutionsListStatusController.institution.type}}</span>\n" +
    "                            <i class=\"fa fa-info-circle pull-right m-t-xs\" tooltip-placement=\"top\" uib-tooltip=\"Type is a a compulsory field.\"></i>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\">\n" +
    "                            <i ng-class=\"InstitutionsListStatusController.institution.country ? 'fa-check text-navy' : 'fa-times text-danger'\" class=\"fa\"></i>\n" +
    "                            <span class=\"m-l-xs\">Country</span>\n" +
    "                            <span class=\"m-l-xs text-muted\"\n" +
    "                                  ng-show=\"InstitutionsListStatusController.institution.country\"> - {{InstitutionsListStatusController.institution.country}}</span>\n" +
    "                            <i class=\"fa fa-info-circle pull-right m-t-xs\" tooltip-placement=\"top\" uib-tooltip=\"Country is a compulsory field.\"></i>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\"\n" +
    "                            ng-show=\"InstitutionsController.isClientDepartment(InstitutionsListStatusController.institution.typeId)\">\n" +
    "                            <i ng-class=\"InstitutionsListStatusController.institution.belongsToName ? 'fa-check text-navy' : 'fa-times text-danger'\" class=\"fa\"></i>\n" +
    "                            <span class=\"m-l-xs\">Belongs to</span>\n" +
    "                            <span class=\"m-l-xs text-muted\"\n" +
    "                                  ng-show=\"InstitutionsListStatusController.institution.belongsToName\"> - {{InstitutionsListStatusController.institution.belongsToName}}</span>\n" +
    "                            <i class=\"fa fa-info-circle pull-right m-t-xs\" tooltip-placement=\"top\" uib-tooltip=\"Belongs to is a compulsory field.\"></i>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\"\n" +
    "                            ng-show=\"InstitutionsController.showParentInstitution(InstitutionsListStatusController.institution.typeId)\">\n" +
    "                            <i ng-class=\"InstitutionsListStatusController.institution.parentName ? 'fa-check text-navy' : 'fa-times text-danger'\" class=\"fa\"></i>\n" +
    "                            <span class=\"m-l-xs\">Parent institution</span>\n" +
    "                            <span class=\"m-l-xs text-muted\"\n" +
    "                                  ng-show=\"InstitutionsListStatusController.institution.parentName\"> - {{InstitutionsListStatusController.institution.parentName}}</span>\n" +
    "                            <i class=\"fa fa-info-circle pull-right m-t-xs\" tooltip-placement=\"top\" uib-tooltip=\"Parent Institution is a compulsory field.\"></i>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-lg-4\">\n" +
    "            <div class=\"ibox float-e-margins\">\n" +
    "                <div class=\"ibox-title\">\n" +
    "                    <h5>Subscriptions</h5>\n" +
    "                </div>\n" +
    "                <div class=\"ibox-content no-padding\">\n" +
    "                    <div class=\"ibox-title\" ng-if=\"!InstitutionsListStatusController.isAdvancedProgram\">\n" +
    "                        <h5>TU</h5>\n" +
    "                    </div>\n" +
    "                    <ul class=\"list-group\" ng-if=\"!InstitutionsListStatusController.isAdvancedProgram\">\n" +
    "                        <li class=\"list-group-item\">\n" +
    "                            <i ng-class=\"InstitutionsListStatusController.institution.subscriptions.tu.subscribed ? 'fa-check text-navy' : 'fa-times'\" class=\"fa\"></i>\n" +
    "                            <span class=\"m-l-xs\">UG / PG enabled</span>\n" +
    "                            <i class=\"fa fa-info-circle pull-right m-t-xs\" tooltip-placement=\"top\" uib-tooltip=\"This enable the institution to have UG/PG profile in hub\"></i>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\">\n" +
    "                            <i ng-class=\"InstitutionsListStatusController.institution.subscriptions.tu.advanced ? 'fa-check text-navy' : 'fa-times'\" class=\"fa\"></i>\n" +
    "                            <span class=\"m-l-xs\">TU advanced</span>\n" +
    "                            <span class=\"m-l-xs text-muted\"\n" +
    "                                  ng-show=\"InstitutionsListStatusController.institution.subscriptions.tu.advanced\">\n" +
    "                                {{InstitutionsListStatusController.institution.subscriptions.tu.startDate| date:'mediumDate'}} - {{InstitutionsListStatusController.institution.subscriptions.tu.endDate| date:'mediumDate'}}\n" +
    "                            </span>\n" +
    "                            <i class=\"fa fa-info-circle pull-right m-t-xs\" tooltip-placement=\"top\" uib-tooltip=\"Subscription date is compulsory if the UG/PG profile is advanced\"></i>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\">\n" +
    "                            <i ng-class=\"InstitutionsListStatusController.institution.enabled.ug ? 'fa-check text-navy' : 'fa-times'\" class=\"fa\"></i>\n" +
    "                            <span class=\"m-l-xs\">Display UG on TopUniversities.com</span>\n" +
    "                            <i class=\"fa fa-info-circle pull-right m-t-xs\" tooltip-placement=\"top\" uib-tooltip=\"Enable to display UG profile on frontend site\"></i>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\">\n" +
    "                            <i ng-class=\"InstitutionsListStatusController.institution.enabled.pg ? 'fa-check text-navy' : 'fa-times'\" class=\"fa\"></i>\n" +
    "                            <span class=\"m-l-xs\">Display PG on TopUniversities.com</span>\n" +
    "                            <i class=\"fa fa-info-circle pull-right m-t-xs\" tooltip-placement=\"top\" uib-tooltip=\"Enable to display PG profile on frontend site\"></i>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                    <div class=\"ibox-title\">\n" +
    "                        <h5>TM</h5>\n" +
    "                    </div>\n" +
    "                    <ul class=\"list-group\">\n" +
    "                        <li class=\"list-group-item\">\n" +
    "                            <i ng-class=\"InstitutionsListStatusController.institution.subscriptions.tm.subscribed ? 'fa-check text-navy' : 'fa-times'\" class=\"fa\"></i>\n" +
    "                            <span class=\"m-l-xs\">MBA enabled</span>\n" +
    "                            <i class=\"fa fa-info-circle pull-right m-t-xs\" tooltip-placement=\"top\" uib-tooltip=\"This enable the institution to have MBA profile in hub\"></i>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\">\n" +
    "                            <i ng-class=\"InstitutionsListStatusController.institution.subscriptions.tm.advanced ? 'fa-check text-navy' : 'fa-times'\" class=\"fa\"></i>\n" +
    "                            <span class=\"m-l-xs\">MBA advanced</span>\n" +
    "                            <span class=\"m-l-xs text-muted\"\n" +
    "                                  ng-show=\"InstitutionsListStatusController.institution.subscriptions.tm.advanced\">\n" +
    "                                {{InstitutionsListStatusController.institution.subscriptions.tm.startDate| date:'mediumDate'}} - {{InstitutionsListStatusController.institution.subscriptions.tm.endDate| date:'mediumDate'}}\n" +
    "                            </span>\n" +
    "                            <i class=\"fa fa-info-circle pull-right m-t-xs\" tooltip-placement=\"top\" uib-tooltip=\"Subscription date is compulsory if the MBA profile is advanced\"></i>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\">\n" +
    "                            <i ng-class=\"InstitutionsListStatusController.institution.enabled.tm ? 'fa-check text-navy' : 'fa-times'\" class=\"fa\"></i>\n" +
    "                            <span class=\"m-l-xs\">Display on TopMba.com</span>\n" +
    "                            <i class=\"fa fa-info-circle pull-right m-t-xs\" tooltip-placement=\"top\" uib-tooltip=\"Enable to display MBA profile on frontend site\"></i>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-lg-4\" ng-class=\"{'modal-overlay':InstitutionsController.isSimpleDepartment(institution.typeId)}\">\n" +
    "            <div class=\"ibox float-e-margins\">\n" +
    "                <div class=\"ibox-title\">\n" +
    "                    <h5>Drupal</h5>\n" +
    "                </div>\n" +
    "                <div class=\"ibox-content no-padding\">\n" +
    "                    <ul class=\"list-group\">\n" +
    "                        <li class=\"list-group-item\" ng-if=\"!InstitutionsListStatusController.isAdvancedProgram\">\n" +
    "                            <i ng-class=\"InstitutionsListStatusController.institution.tuRegion ? 'fa-check text-navy' : 'fa-times text-danger'\" class=\"fa\"></i>\n" +
    "                            <span class=\"m-l-xs\">TU Region</span>\n" +
    "                            <span class=\"m-l-xs text-muted\"\n" +
    "                                  ng-show=\"InstitutionsListStatusController.institution.tuRegion\">\n" +
    "                                - {{InstitutionsListStatusController.institution.tuRegion}}\n" +
    "                            </span>\n" +
    "                            <i class=\"fa fa-info-circle pull-right m-t-xs\" tooltip-placement=\"top\" uib-tooltip=\"TU region is compulsory if profile has UG/PG subscription\"></i>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\">\n" +
    "                            <i ng-class=\"InstitutionsListStatusController.institution.tmRegion ? 'fa-check text-navy' : 'fa-times text-danger'\" class=\"fa\"></i>\n" +
    "                            <span class=\"m-l-xs\">TM Region</span>\n" +
    "                            <span class=\"m-l-xs text-muted\"\n" +
    "                                  ng-show=\"InstitutionsListStatusController.institution.tmRegion\">\n" +
    "                                - {{InstitutionsListStatusController.institution.tmRegion}}\n" +
    "                            </span>\n" +
    "                            <i class=\"fa fa-info-circle pull-right m-t-xs\" tooltip-placement=\"top\" uib-tooltip=\"TM region is compulsory if profile has MBA subscription\"></i>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/institutions/list/subscriptions/institutionsListSubscriptionsView.html',
    "<div class=\"panel-body\" ng-controller=\"InstitutionsSubscriptionsController as InstitutionsSubscriptionsController\">\n" +
    "    <div class=\"row\">\n" +
    "        <form name=\"forms.subscriptionForm\">\n" +
    "            <div class=\"col-lg-6\">\n" +
    "                <div wave-spinner class=\"wave-spinner\" ng-show=\"InstitutionsSubscriptionsController.isProfilesLoading()\"></div>\n" +
    "                <div class=\"ibox float-e-margins\" ng-show=\"!InstitutionsSubscriptionsController.isProfilesLoading()\">\n" +
    "                    <div class=\"ibox-title\">\n" +
    "                        <h5>Profiles</h5>\n" +
    "                        <div class=\"ibox-tools\">\n" +
    "                            <a ng-click=\"showHide()\" class=\"collapse-link\">\n" +
    "                                <i class=\"fa fa-chevron-up\"></i>\n" +
    "                            </a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"ibox-content\">\n" +
    "                        <div class=\"subscription-tu\" ng-if=\"InstitutionsSubscriptionsController.allowTu()\">\n" +
    "                            <label class=\"m-t-none m-b\">QS Hub</label>\n" +
    "\n" +
    "                            <div class=\"form-group subscriptions\">\n" +
    "                                <switch\n" +
    "                                    class=\"green\"\n" +
    "                                    ng-model=\"institution.subscriptions.tu.subscribed\"\n" +
    "                                    ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId) || !InstitutionsSubscriptionsController.isDowngradeAllowedTu(institution.subscriptions.tu.subscribed)\"\n" +
    "                                    uib-popover=\"Disabled due to associated child institutions. Child institutions must be switched off first.\"\n" +
    "                                    popover-placement=\"bottom\"\n" +
    "                                    popover-enable=\"!InstitutionsSubscriptionsController.isDowngradeAllowedTu(institution.subscriptions.tu.subscribed)\"\n" +
    "                                    popover-trigger=\"'mouseenter'\">\n" +
    "                                </switch> Enable UG / PG\n" +
    "                                <a class=\"btn btn-default btn-xs\"\n" +
    "                                   ng-click=\"InstitutionsSubscriptionsController.handleHistoryLogClick('tu')\">\n" +
    "                                    <i class=\"fa fa-clock-o\"></i>\n" +
    "                                </a>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-inline\" ng-class=\"{'modal-overlay-35': !institution.subscriptions.tu.subscribed}\">\n" +
    "                                <div class=\"form-group col-md-offset-1\">\n" +
    "                                    <switch\n" +
    "                                        class=\"green\"\n" +
    "                                        ng-model=\"institution.subscriptions.tu.advanced\"\n" +
    "                                        ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId)\"></switch> Advanced\n" +
    "                                    <span ng-if=\"institution.subscriptions.tu.startDate > InstitutionsSubscriptionsController.getCurrentDate() && !institution.subscriptions.tu.advanced\">\n" +
    "                                        <small class=\"badge badge-info\">\n" +
    "                                            {{institution.subscriptions.tu.startDate | mDate}} - {{institution.subscriptions.tu.endDate| mDate}}\n" +
    "                                        </small>\n" +
    "                                        <small>\n" +
    "                                            <p>Profile will become advanced 1 week prior to the subscription date for editing and publishing purposes.</p>\n" +
    "                                        </small>\n" +
    "                                    </span>\n" +
    "                                    <span ng-if=\"!InstitutionsController.isSimpleDepartment(institution.typeId)\"\n" +
    "                                          class=\"date-picker form-control btn\" type=\"text\"\n" +
    "                                          date-range-picker\n" +
    "                                          options=\"datePickerTu.options\"\n" +
    "                                          ng-model=\"datePickerTu.date\"\n" +
    "                                          ng-style=\"{'display': institution.subscriptions.tu.advanced ? 'block' : 'none'}\">\n" +
    "                                        {{institution.subscriptions.tu.startDate| mDate}} - {{institution.subscriptions.tu.endDate| mDate}}\n" +
    "                                    </span>\n" +
    "                                    <span ng-if=\"InstitutionsController.isSimpleDepartment(institution.typeId)\" class=\"form-control\" disabled=\"disabled\">\n" +
    "                                        {{institution.subscriptions.tu.startDate| mDate}} - {{institution.subscriptions.tu.endDate| mDate}}\n" +
    "                                    </span>\n" +
    "                                    <p>\n" +
    "                                        <i class=\"text-red\" ng-show=\"InstitutionsController.isTuSubscriptionDatesInvalid()\">\n" +
    "                                            Add the date before you save\n" +
    "                                        </i>\n" +
    "                                    </p>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\" ng-show=\"InstitutionsSubscriptionsController.isHistoryLogVisible('tu')\">\n" +
    "                                <div wave-spinner class=\"wave-spinner\" ng-show=\"InstitutionsSubscriptionsController.isSubscriptionsLogLoading('tu')\"></div>\n" +
    "                                <div class=\"history-log tu col-md-offset-1 text-muted\">\n" +
    "                                    <div class=\"history-log-content\" ng-show=\"!InstitutionsSubscriptionsController.isSubscriptionsLogLoading('tu')\">\n" +
    "                                        <label class=\"m-t-none m-b\">Subscription History</label>\n" +
    "                                        <div class=\"history-items\"\n" +
    "                                             ng-show=\"InstitutionsSubscriptionsController.getSubscriptionsLog('tu').length\"\n" +
    "                                             ng-repeat=\"item in InstitutionsSubscriptionsController.getSubscriptionsLog('tu')\">\n" +
    "                                            <i class=\"fa fa-bell\" aria-hidden=\"true\" ng-if=\"item.future\"></i> {{item.startDate | mDate}} - {{item.endDate | mDate}} <span class=\"subscription-log-submitted-by\" ng-if=\"item.createdByFullName\">Submitted by: {{item.createdByFullName}}</span>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"history-items-empty\" ng-show=\"!InstitutionsSubscriptionsController.getSubscriptionsLog('tu').length\">\n" +
    "                                            Log is empty\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <label class=\"m-t-none m-b\">Display on topuniversities.com</label>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <switch ng-model=\"institution.enabled.ug\" ng-disabled=\"!institution.subscriptions.tu.subscribed || InstitutionsController.isSimpleDepartment(institution.typeId)\" class=\"green\"></switch> Undergraduate\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <switch ng-model=\"institution.enabled.pg\" ng-disabled=\"!institution.subscriptions.tu.subscribed || InstitutionsController.isSimpleDepartment(institution.typeId)\" class=\"green\"></switch> Postgraduate\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"alert alert-warning\" ng-show=\"InstitutionsController.hasTuWarning()\">\n" +
    "                                {{InstitutionsController.getTuWarningMessage()}}\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"hr-line-dashed\"></div>\n" +
    "\n" +
    "                        <div class=\"subscription-tm\">\n" +
    "                            <label class=\"m-t-none m-b\">QS Hub</label>\n" +
    "\n" +
    "                            <div class=\"form-group subscriptions\">\n" +
    "                                <switch class=\"green\"\n" +
    "                                        ng-model=\"institution.subscriptions.tm.subscribed\"\n" +
    "                                        ng-change=\"InstitutionsController.handleTmSubscribed()\"\n" +
    "                                        ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId) || !InstitutionsSubscriptionsController.isDowngradeAllowedTm(institution.subscriptions.tm.subscribed)\"\n" +
    "                                        uib-popover=\"Disabled due to associated child institutions. Child institutions must be switched off first.\"\n" +
    "                                        popover-placement=\"bottom\"\n" +
    "                                        popover-enable=\"!InstitutionsSubscriptionsController.isDowngradeAllowedTm(institution.subscriptions.tm.subscribed)\"\n" +
    "                                        popover-trigger=\"'mouseenter'\">\n" +
    "                                </switch> Enable MBA\n" +
    "                                <a class=\"btn btn-default btn-xs\"\n" +
    "                                   ng-click=\"InstitutionsSubscriptionsController.handleHistoryLogClick('tm')\">\n" +
    "                                    <i class=\"fa fa-clock-o\"></i>\n" +
    "                                </a>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-inline\">\n" +
    "                                <div class=\"form-group col-md-offset-1\" ng-class=\"{'modal-overlay-35': !institution.subscriptions.tm.subscribed}\">\n" +
    "                                    <switch class=\"green\"\n" +
    "                                            ng-model=\"institution.subscriptions.tm.advanced\"\n" +
    "                                            ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId)\"></switch> Advanced\n" +
    "                                    <span ng-if=\"institution.subscriptions.tm.startDate > InstitutionsSubscriptionsController.getCurrentDate() && !institution.subscriptions.tm.advanced\">\n" +
    "                                        <small class=\"badge badge-info\">\n" +
    "                                            {{institution.subscriptions.tm.startDate | mDate}} - {{institution.subscriptions.tm.endDate| mDate}}\n" +
    "                                        </small>\n" +
    "                                        <small>\n" +
    "                                            <p>Profile will become advanced 1 week prior to the subscription date for editing and publishing purposes.</p>\n" +
    "                                        </small>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"date-picker form-control btn\" type=\"text\"\n" +
    "                                          ng-if=\"!InstitutionsController.isSimpleDepartment(institution.typeId)\"\n" +
    "                                          date-range-picker\n" +
    "                                          options=\"datePickerTm.options\"\n" +
    "                                          ng-model=\"datePickerTm.date\"\n" +
    "                                          ng-style=\"{'display': institution.subscriptions.tm.advanced  ? 'block' : 'none'}\">\n" +
    "                                        {{institution.subscriptions.tm.startDate| mDate}} - {{institution.subscriptions.tm.endDate| mDate}}\n" +
    "                                    </span>\n" +
    "                                    <span ng-if=\"InstitutionsController.isSimpleDepartment(institution.typeId)\" class=\"form-control\" disabled=\"disabled\">\n" +
    "                                        {{institution.subscriptions.tm.startDate| mDate}} - {{institution.subscriptions.tm.endDate| mDate}}\n" +
    "                                    </span>\n" +
    "                                    <p>\n" +
    "                                        <i class=\"text-red\" ng-show=\"InstitutionsController.isTmSubscriptionDatesInvalid()\">\n" +
    "                                            Add the date before you save\n" +
    "                                        </i>\n" +
    "                                    </p>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\" ng-show=\"InstitutionsSubscriptionsController.isHistoryLogVisible('tm')\">\n" +
    "                                <div wave-spinner class=\"wave-spinner\" ng-show=\"InstitutionsSubscriptionsController.isSubscriptionsLogLoading('tm')\"></div>\n" +
    "                                <div class=\"history-log tm col-md-offset-1 text-muted\">\n" +
    "                                    <div class=\"history-log-content\" ng-show=\"!InstitutionsSubscriptionsController.isSubscriptionsLogLoading('tm')\">\n" +
    "                                        <label class=\"m-t-none m-b\">Subscription History</label>\n" +
    "                                        <div class=\"history-items\"\n" +
    "                                             ng-show=\"InstitutionsSubscriptionsController.getSubscriptionsLog('tm').length\"\n" +
    "                                             ng-repeat=\"item in InstitutionsSubscriptionsController.getSubscriptionsLog('tm')\">\n" +
    "                                            <i class=\"fa fa-bell\" aria-hidden=\"true\" ng-if=\"item.future\"></i> {{item.startDate | mDate}} - {{item.endDate | mDate}} <span class=\"subscription-log-submitted-by\" ng-if=\"item.createdByFullName\">Submitted by: {{item.createdByFullName}}</span>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"history-items-empty\" ng-show=\"!InstitutionsSubscriptionsController.getSubscriptionsLog('tm').length\">\n" +
    "                                            Log is empty\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div ng-show=\"InstitutionsController.isTopLevelInstitution(institution.typeId) || InstitutionsController.isClientDepartment(institution.typeId)\">\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <switch class=\"green\"\n" +
    "                                            ng-model=\"institution.linkedWithAdvancedPrograms\"\n" +
    "                                            ng-disabled=\"!institution.subscriptions.tm.subscribed\"></switch>\n" +
    "                                    Link with advanced programs subscriptions\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <label class=\"m-t-none m-b\">Display on topmba.com</label>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <switch ng-model=\"institution.enabled.tm\" ng-disabled=\"!institution.subscriptions.tm.subscribed || InstitutionsController.isSimpleDepartment(institution.typeId)\" class=\"green\"></switch> MBA\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"alert alert-warning\" ng-show=\"InstitutionsController.hasTmWarning()\">\n" +
    "                                {{InstitutionsController.getTmWarningMessage()}}\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col-lg-6\">\n" +
    "                <div class=\"ibox float-e-margins\">\n" +
    "                    <div class=\"ibox-title\">\n" +
    "                        <h5>Statistics</h5>\n" +
    "                        <div class=\"ibox-tools\">\n" +
    "                            <a ng-click=\"showHide()\">\n" +
    "                                <i class=\"fa fa-chevron-up\"></i>\n" +
    "                            </a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"ibox-content\">\n" +
    "                        <div ng-repeat=\"(key, value) in InstitutionsController.subscriptionsList\">\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <switch\n" +
    "                                    ng-model=\"institution.subscriptions[value.handle].subscribed\"\n" +
    "                                    class=\"green\"\n" +
    "                                    ng-disabled=\"InstitutionsController.isSimpleDepartment(institution.typeId) ||\n" +
    "                                    InstitutionsController.isAllStatistic(value.handle)\">\n" +
    "                                </switch> {{value.name}}\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <a class=\"btn btn-primary btn-sm btn-block\"\n" +
    "                           ng-class=\"{'disabled': disabledSubmit() || InstitutionsController.isSimpleDepartment(institution.typeId)}\"\n" +
    "                           ng-click=\"handleSubscriptionSubmit()\">Update</a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/institutions/tu-programs/institutionsTuProgramsView.html',
    "<div class=\"wrapper wrapper-content animated fadeInRight page-institution\" ng-controller=\"InstitutionsTuProgramsController as ProgramsController\">\n" +
    "    <div class=\"row\">\n" +
    "        <div ng-class=\"isRightSidePanelActive() ? 'col-sm-8' : 'col-sm-12'\">\n" +
    "            <!-- SECTION -->\n" +
    "            <div class=\"section\">\n" +
    "                <!-- SECTION HEADER -->\n" +
    "                <div class=\"section-header\">\n" +
    "                    <!-- Institution switch for QS users -->\n" +
    "                    <div class=\"search-dropdown pull-left\">\n" +
    "                        <ui-select\n" +
    "                            class=\"search-dropdown\"\n" +
    "                            ng-model=\"selectedInstitution.selected\"\n" +
    "                            theme=\"bootstrap\"\n" +
    "                            ng-change=\"handleSearchInstitutionClick(selectedInstitution.selected)\">\n" +
    "                            <ui-select-match placeholder=\"Institution search...\">\n" +
    "                                <i class=\"fa fa-building\"></i>\n" +
    "                                <span>{{$select.selected.name}}</span>\n" +
    "                            </ui-select-match>\n" +
    "                            <ui-select-choices\n" +
    "                                refresh-delay=\"500\"\n" +
    "                                refresh=\"ProgramsController.searchInstitution($select.search)\"\n" +
    "                                position=\"down\"\n" +
    "                                repeat=\"option in ProgramsController.institutionsDropdownList | filter: $select.search\">\n" +
    "                                <div class=\"test\" ng-bind-html=\"option.name | highlight: $select.search\"></div>\n" +
    "                            </ui-select-choices>\n" +
    "                        </ui-select>\n" +
    "                        <div class=\"spinner\" ng-show=\"ProgramsController.searchInProgress\" wave-spinner></div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <button class=\"btn btn-primary pull-right\"\n" +
    "                        type=\"button\"\n" +
    "                        ng-click=\"handleAddProgramClick()\"\n" +
    "                        ng-disabled=\"programsTabSubmitInProgress || !isInstitutionSelected() || isRightSidePanelActive()\">\n" +
    "                        <i class=\"fa fa-plus\"></i>\n" +
    "                        <span>Add Program</span>\n" +
    "                    </button>\n" +
    "\n" +
    "                </div><!-- /SECTION HEADER -->\n" +
    "\n" +
    "                <!-- SECTION BODY -->\n" +
    "                <div class=\"section-body\">\n" +
    "                    <div id=\"programsTable\" ng-class=\"{'locked': !isInstitutionSelected()}\">\n" +
    "                        <div wave-spinner class=\"wave-spinner\" ng-show=\"isDatagridReloading || !isDatagridRendered\"></div>\n" +
    "\n" +
    "                        <div ng-if=\"!isDatagridReloading && gridOptions\">\n" +
    "                            <ui-grid-info ng-if=\"!isRightSidePanelActive()\"></ui-grid-info>\n" +
    "                            <div class=\"grid\"\n" +
    "                                ui-grid=\"gridOptions\"\n" +
    "                                ui-grid-draggable-rows\n" +
    "                                ui-grid-selection\n" +
    "                                ui-grid-resize-columns\n" +
    "                                ui-grid-auto-resize>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "              </div><!-- /SECTION BODY -->\n" +
    "            </div><!-- /SECTION -->\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-sm-4\"\n" +
    "            ng-show=\"showProgramEditForm || showProgramAddForm\"\n" +
    "            fixed-element-while-scrolling=\"#programsTable\"\n" +
    "            ng-controller=\"InstitutionsTuProgramsFormController as ProgramFormController\">\n" +
    "            <div ng-show=\"showProgramEditForm\" ng-include src=\"'/scripts/components/profiles/tu/programs/tuProfileEditProgramFormView.html'\"></div>\n" +
    "            <div ng-show=\"showProgramAddForm\" ng-include src=\"'/scripts/components/profiles/tu/programs/tuProfileAddProgramFormView.html'\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/login/loginFormView.html',
    "<div class=\"animated fadeInDown w-300 box-middle\">\n" +
    "    <form class=\"m-t\" name=\"forms.loginForm\" ng-submit=\"handleLogin()\" novalidate autocomplete=\"off\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <input name=\"email\" type=\"email\" class=\"form-control\" ng-class=\"{'border-red': error}\" placeholder=\"Username\" ng-model=\"credentials.username\" ng-focus=\"resetErrors()\" ng-required=\"true\">\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input name=\"password\" type=\"password\" class=\"form-control\" ng-class=\"{'border-red': error}\" placeholder=\"Password\" ng-model=\"credentials.password\" ng-focus=\"resetErrors()\" ng-required=\"true\">\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <button ng-disabled=\"loginInProgress\" class=\"btn btn-primary block full-width m-b\">Login</button>\n" +
    "            <div ng-show=\"error\" class=\"alert alert-danger\" ng-class=\"{'animated shake': animate}\">{{error}}</div>\n" +
    "            <div ng-show=\"loginInProgress\" wave-spinner class=\"text-right\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <a ng-click=\"toggleForgottenPasswordForm()\"><small>Forgot password?</small></a>\n" +
    "    </form>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/login/passwordForgotView.html',
    "<div class=\"password-box animated fadeInDown w-300 box-middle\">\n" +
    "    <h2 class=\"font-bold\">Forgot password</h2>\n" +
    "    <div ng-show=\"!showResetPasswordConfirmation\">\n" +
    "        <p>\n" +
    "            Enter your email address and your password will be reset and emailed to you.\n" +
    "        </p>\n" +
    "        <form name=\"forms.forgotPasswordForm\" class=\"m-t clearfix\" novalidate role=\"form\" autocomplete=\"off\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"email\" name=\"email\"\n" +
    "                       class=\"form-control\"\n" +
    "                       ng-class=\"{'red-border': forms.forgotPasswordForm.$submitted && forms.forgotPasswordForm.$invalid}\"\n" +
    "                       placeholder=\"Email address\"\n" +
    "                       ng-required=\"true\"\n" +
    "                       ng-model=\"forgottenPassword.email\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <button type=\"submit\" class=\"btn btn-primary btn-block full-width m-b\" ng-class=\"{'disabled':resetSubmitInProgress}\" ng-click=\"handleResetPasswordSubmitClick()\"><i class=\"fa fa-envelope\"></i> Send new password</button>\n" +
    "                <div ng-show=\"forgottenPasswordError\" class=\"alert alert-danger\" ng-class=\"animate ? 'animated shake' : ''\">{{forgottenPasswordErrorMessage}}</div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "    <div ng-show=\"showResetPasswordConfirmation\">\n" +
    "        <p>Thank you. An email with instructions to reset your password has been sent to you.</p>\n" +
    "    </div>\n" +
    "    <a ng-click=\"toggleForgottenPasswordForm()\">\n" +
    "        <small>Go back</small>\n" +
    "    </a>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/login/passwordResetView.html',
    "<div class=\"password-box animated fadeInDown\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-lg-12\"><h2 class=\"font-bold\">Reset password</h2></div>\n" +
    "                    <div class=\"col-lg-7 col-md-7 col-sm-6 col-xs-6\">\n" +
    "                        <form name=\"forms.resetPasswordForm\" class=\"m-t clearfix\" novalidate role=\"form\" autocomplete=\"off\">\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <input ng-class=\"LoginController.isPasswordValid() ? 'valid' : 'invalid'\" type=\"password\" name=\"password\" class=\"form-control\" placeholder=\"New password\" required=\"\" ng-model=\"password\" ng-change=\"validatePassword()\" autocomplete=\"off\">\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <input ng-class=\"LoginController.isPasswordValid() ? 'valid' : 'invalid'\" type=\"password\" name=\"repeatPassword\" class=\"form-control\" placeholder=\"Repeat password\" required=\"\" ng-model=\"repeatPassword\" ng-change=\"validatePassword()\" autocomplete=\"off\">\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <input type=\"text\" ng-model=\"requestId\" required class=\"hidden\">\n" +
    "                                <div class=\"text-red\" ng-hide=\"requestId.length > 1\">\n" +
    "                                    <p>Invalid Link, please try to request a new reset link</p>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <button type=\"submit\" class=\"btn btn-primary btn-block full-width m-b\" ng-class=\"{'disabled':resetSubmitInProgress}\" ng-click=\"handleResetSubmitPasswordSubmitClick()\">Reset</button>\n" +
    "                            <a ng-click=\"handleForgotPasswordClick()\" ng-hide=\"requestId.length > 1\">\n" +
    "                                <small>Go back</small>\n" +
    "                            </a>\n" +
    "                        </form>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-lg-5 col-md-5 col-sm-6 col-xs-6 text-left\">\n" +
    "                        <div class=\"form-group m-t\">\n" +
    "                            <div class=\"validation-items\">\n" +
    "                                <div class=\"validation-item\" ng-repeat=\"item in validationItems\"><i class=\"fa fa-circle\" ng-class=\"item.status ? 'text-navy' : 'text-danger'\"></i> {{item.name}}</div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/master-password/masterPasswordView.html',
    "<div class=\"wrapper wrapper-content animated fadeInRight page-master-password\" ng-controller=\"MasterPasswordController as MasterPasswordController\">\n" +
    "    <div class=\"section\" ng-show=\"MasterPasswordController.masterPassword.loaded\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-4\" ng-show=\"!MasterPasswordController.masterPassword.enabled\">\n" +
    "                <div class=\"content-box\">\n" +
    "                    <h5 class=\"m-b-md\">Master password</h5>\n" +
    "                    <h2 class=\"text-danger\">\n" +
    "                        <i class=\"fa fa-play fa-rotate-90\"></i>\n" +
    "                        <span ng-if=\"!MasterPasswordController.masterPassword.success\">Not available</span>\n" +
    "                    </h2>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-show=\"MasterPasswordController.masterPassword.enabled\">\n" +
    "                <div class=\"col-md-3 b-r\">\n" +
    "                    <div class=\"content-box\">\n" +
    "                        <h3>Password expires in</h3>\n" +
    "                        <h1 class=\"text-navy\">\n" +
    "                            {{MasterPasswordController.isExpired() ? 'Password expired' : MasterPasswordController.secondsLeft() | date:'HH:mm:ss'}}\n" +
    "                        </h1>\n" +
    "                        <div class=\"progress progress-mini\">\n" +
    "                            <div class=\"progress-bar\" style=\"width: {{ MasterPasswordController.timeLeftPercentage() }}%;\"></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"col-md-9\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-md-6 b-r\" ng-show=\"!MasterPasswordController.isExpired()\">\n" +
    "                            <div class=\"content-box\">\n" +
    "                                <h3>Password valid for 24 hours</h3>\n" +
    "                                <ul class=\"list-group clear-list m-t\">\n" +
    "                                    <li class=\"list-group-item fist-item\">\n" +
    "                                        <strong>From:</strong>\n" +
    "                                        <span class=\"pull-right\">{{MasterPasswordController.masterPassword.from | date:'HH:mm:ss, dd MMMM, yyyy':'UTC'}} UK/GMT </span>\n" +
    "                                    </li>\n" +
    "                                    <li class=\"list-group-item\">\n" +
    "                                        <strong>To:</strong>\n" +
    "                                        <span class=\"pull-right\">{{MasterPasswordController.masterPassword.to | date:'HH:mm:ss, dd MMMM, yyyy':'UTC'}} UK/GMT </span>\n" +
    "                                    </li>\n" +
    "                                    <li class=\"list-group-item\">\n" +
    "                                        <strong>Current time:</strong>\n" +
    "                                        <span class=\"pull-right\">{{MasterPasswordController.getTime() | date:'HH:mm:ss, dd MMMM, yyyy':'UTC'}} UK/GMT </span>\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"col-md-6\" ng-show=\"!MasterPasswordController.isExpired()\">\n" +
    "                            <div class=\"content-box\">\n" +
    "                                <h3>Master password</h3>\n" +
    "                                <p class=\"text-navy\">\n" +
    "                                    <input class=\"no-borders\" \n" +
    "                                        ng-show=\"!showPassword\"\n" +
    "                                        type=\"password\"\n" +
    "                                        value=\"{{MasterPasswordController.masterPassword.password}}\"\n" +
    "                                        select-on-click readonly />\n" +
    "                                    <input class=\"no-borders\" \n" +
    "                                        ng-show=\"showPassword\"\n" +
    "                                        type=\"text\"\n" +
    "                                        value=\"{{MasterPasswordController.masterPassword.password}}\"\n" +
    "                                        select-on-click readonly />\n" +
    "                                </p>\n" +
    "                                <small>\n" +
    "                                    <switch class=\"green\" ng-model=\"showPassword\"></switch>\n" +
    "                                    <span>Show Password</span>\n" +
    "                                </small>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-show=\"!MasterPasswordController.masterPassword.loaded\">\n" +
    "            <div wave-spinner class=\"text-right\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/modal/helpModal.html',
    "<div class=\"modal-header\">\n" +
    "    <h3>{{modalOptions.headerText}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <h4>While we work on help section, please use the instructions below:</h4>\n" +
    "    <p>\n" +
    "        <p>For help with TopUniversities profiles, please email\n" +
    "            <a href=\"mailto:tusupport@qs.com\">tusupport@qs.com</a>\n" +
    "        </p>\n" +
    "        <p>\n" +
    "            For help with TopMBA profiles, please email \n" +
    "            <a href=\"mailto:tmsupport@qs.com\">tmsupport@qs.com</a>\n" +
    "        </p>\n" +
    "        <p>For all other queries, please email \n" +
    "            <a href=\"mailto:websupport@qs.com\">websupport@qs.com</a>\n" +
    "        </p>\n" +
    "    </p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-primary\" data-ng-click=\"modalOptions.close()\">{{modalOptions.closeButtonText}}</button>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profile/logo/profileLogoView.html',
    "<div ng-controller=\"ProfileLogoController as ProfileLogoController\">\n" +
    "    <div class=\"col-lg-12 block-spinner\">\n" +
    "        <div wave-spinner class=\"text-right\" ng-show=\"displaySpinner\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-2\">\n" +
    "            <div class=\"img-list\">\n" +
    "                <form name=\"forms.imageForm\"\n" +
    "                      class=\"clearfix dropzone image-form no-background\"\n" +
    "                      enctype=\"multipart/form-data\"\n" +
    "                      ng-dropzone\n" +
    "                      dropzone=\"ProfileLogoController.dropZoneImageInstance\"\n" +
    "                      dropzone-config=\"ProfileLogoController.imageConfig.dropzone\"\n" +
    "                      event-handlers=\"ProfileLogoController.imageConfig.eventHandlers\"\n" +
    "                      novalidate>\n" +
    "                    <div class=\"fallback\">\n" +
    "                        <input name=\"file\" type=\"file\" />\n" +
    "                    </div>\n" +
    "\n" +
    "                    <span class=\"dz-message\" ng-show=\"uploadEnabled\"></span>\n" +
    "\n" +
    "                    <div ng-show=\"displayRemoveLink\" class=\"dropzone-previews\" ng-class=\"{dzPreview: displayRemoveLink}\"></div>\n" +
    "                </form>\n" +
    "            </div>\n" +
    "            <div class=\"default-image\" ng-show=\"!displayRemoveLink\">\n" +
    "                <img alt=\"image\" ng-show=\"gravatar\" class=\"img-circle\" gravatar-src=\"user.email\" gravatar-size=\"100\">\n" +
    "                <img alt=\"image\" ng-show=\"!gravatar\" class=\"img-circle\" ng-src=\"{{user.profileLogo}}\" width=\"100px\" height=\"100px\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"profile-info-header col-sm-8\">\n" +
    "            <h3>{{user.fullName}}</h3>\n" +
    "            <p>{{user.position}}</p>\n" +
    "            <a class=\"btn btn-primary btn-sm upload-button\" ng-show=\"!displayRemoveLink\" ng-class=\"{'disabled': generalSubmitDisabled}\">\n" +
    "                <i class=\"fa fa-undo\"></i> Upload Image\n" +
    "            </a>\n" +
    "            <a class=\"btn btn-warning btn-sm\" ng-click=\"removeUploaderImage()\" ng-show=\"displayRemoveLink\">\n" +
    "                <i class=\"fa fa-times\"></i>\n" +
    "                <span>Click here to remove uploaded logo</span>\n" +
    "            </a>\n" +
    "            <a class=\"btn btn-primary btn-sm\" ng-click=\"handleGeneralSubmit()\" ng-show=\"displayRemoveLink\" ng-class=\"{'disabled': generalSubmitDisabled}\">\n" +
    "                <i class=\"fa fa-check-circle\"></i> Save\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profile/password/profilePasswordView.html',
    "<div class=\"password\" ng-controller=\"ProfilePasswordController as ProfilePasswordController\">\n" +
    "    <div class=\"ibox\">\n" +
    "        <div class=\"ibox-title\">\n" +
    "            <h5>{{isPasswordReset ? 'Password reset is required' : 'Password'}}</h5>\n" +
    "        </div>\n" +
    "        <div class=\"ibox-content\">\n" +
    "            <form name=\"ProfilePasswordController.forms.password\" class=\"clearfix form-horizontal\" novalidate autocomplete=\"off\">\n" +
    "                <div class=\"form-group\" ng-show=\"!ProfilePasswordController.isPasswordFieldsVisible() && !isPasswordReset\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">Password *</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <input name=\"password\" type=\"text\" class=\"form-control\" value=\"**********\"\n" +
    "                               ng-focus=\"ProfilePasswordController.togglePasswordFields()\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-show=\"ProfilePasswordController.isPasswordFieldsVisible() || isPasswordReset\">\n" +
    "                    <user-password user=\"user\"\n" +
    "                                   reset-validators=\"!ProfilePasswordController.isPasswordFieldsVisible() && !isPasswordReset\"\n" +
    "                                   config=\"{resetOnLogin: false, label: 'New Password', labelClass: 'control-label col-sm-12', blockClass: null}\"></user-password>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <div class=\"col-sm-12\">\n" +
    "                            <a class=\"btn btn-primary pull-right\"\n" +
    "                               ng-class=\"{'disabled': ProfilePasswordController.isDisabled()}\"\n" +
    "                               ng-click=\"ProfilePasswordController.update()\">\n" +
    "                                <i class=\"fa fa-check-circle\"></i>\n" +
    "                                <span>Update</span>\n" +
    "                            </a>\n" +
    "                            <a class=\"btn btn-default pull-right\"\n" +
    "                               ng-if=\"!isPasswordReset\"\n" +
    "                               ng-class=\"{'disabled': ProfilePasswordController.isDisabled()}\"\n" +
    "                               ng-click=\"ProfilePasswordController.togglePasswordFields()\">\n" +
    "                                <i class=\"fa fa-ban\"></i>\n" +
    "                                <span>Cancel</span>\n" +
    "                            </a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profile/personalDetails/profilePersonalDetailsView.html',
    "<div class=\"personal-details\" ng-controller=\"ProfilePersonalDetailsController as ProfilePersonalDetailsController\">\n" +
    "    <div class=\"ibox\">\n" +
    "        <div class=\"ibox-title\">\n" +
    "            <h5>Personal Details</h5>\n" +
    "        </div>\n" +
    "        <div class=\"ibox-content\">\n" +
    "            <form name=\"ProfilePersonalDetailsController.forms.personalDetails\" class=\"clearfix form-horizontal\" novalidate autocomplete=\"off\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">Title</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <input name=\"title\" type=\"text\" class=\"form-control\" ng-model=\"ProfilePersonalDetailsController.user.title\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\" ng-class=\"{'has-errors': !ProfilePersonalDetailsController.isValidFirstName()}\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">First (Given) Name *</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <input type=\"text\"\n" +
    "                               class=\"form-control\"\n" +
    "                               name=\"firstName\"\n" +
    "                               ng-model=\"ProfilePersonalDetailsController.user.firstName\"\n" +
    "                               ng-required=\"true\"\n" +
    "                               ng-focus=\"ProfilePersonalDetailsController.setValid('firstName')\"\n" +
    "                               focus-delay=\"250\"\n" +
    "                               custom-popover popover-html=\"Add a first (given) name\"\n" +
    "                               popover-placement=\"left\"\n" +
    "                               popover-trigger=\"manual\"\n" +
    "                               popover-visibility=\"{{!ProfilePersonalDetailsController.isValidFirstName()}}\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\" ng-class=\"{'has-errors': !ProfilePersonalDetailsController.isValidLastName()}\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">Last (Family) Name *</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <input type=\"text\"\n" +
    "                               class=\"form-control\"\n" +
    "                               name=\"lastName\"\n" +
    "                               ng-model=\"ProfilePersonalDetailsController.user.lastName\"\n" +
    "                               ng-required=\"true\"\n" +
    "\n" +
    "                               focus-delay=\"250\"\n" +
    "                               custom-popover\n" +
    "                               popover-html=\"Add a last (family) name\"\n" +
    "                               popover-placement=\"left\"\n" +
    "                               popover-trigger=\"manual\"\n" +
    "                               popover-visibility=\"{{!ProfilePersonalDetailsController.isValidLastName()}}\"\n" +
    "                               ng-focus=\"ProfilePersonalDetailsController.setValid('lastName')\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">Position</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <input name=\"position\" type=\"text\" class=\"form-control\" ng-model=\"ProfilePersonalDetailsController.user.position\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-if=\"ProfilePersonalDetailsController.user.isClient\" class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">Phone</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <input name=\"phone\" type=\"text\" class=\"form-control\" ng-model=\"ProfilePersonalDetailsController.user.phone\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">Email *</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <input type=\"email\"\n" +
    "                               class=\"form-control\"\n" +
    "                               name=\"email\"\n" +
    "                               ng-model=\"ProfilePersonalDetailsController.user.email\"\n" +
    "                               ng-required=\"true\"\n" +
    "                               ng-disabled=\"true\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div ng-if=\"ProfilePersonalDetailsController.user.isClient\" class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">Primary Institution *</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <input type=\"email\"\n" +
    "                               class=\"form-control\"\n" +
    "                               name=\"email\"\n" +
    "                               ng-model=\"ProfilePersonalDetailsController.user.primaryInstitutionName\"\n" +
    "                               ng-required=\"true\"\n" +
    "                               ng-disabled=\"true\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-sm-12\">\n" +
    "                        <a class=\"btn btn-primary pull-right\"\n" +
    "                           ng-class=\"{'disabled': ProfilePersonalDetailsController.isDisabled()}\"\n" +
    "                           ng-click=\"ProfilePersonalDetailsController.update()\">\n" +
    "                            <i class=\"fa fa-check-circle\"></i>\n" +
    "                            <span>Update</span>\n" +
    "                        </a>\n" +
    "                        <a class=\"btn btn-default pull-right\"\n" +
    "                           ng-class=\"{'disabled': ProfilePasswordController.isDisabled()}\"\n" +
    "                           ng-click=\"ProfilePersonalDetailsController.cancel()\">\n" +
    "                            <i class=\"fa fa-ban\"></i>\n" +
    "                            <span>Cancel</span>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profile/profileView.html',
    "<div class=\"wrapper wrapper-content animated fadeInRight page-profile\" ng-controller=\"ProfileController as ProfileController\">\n" +
    "    <div class=\"row profile-logo\" ng-class=\"{'modal-overlay-35': isPasswordReset}\">\n" +
    "        <div class=\"col-sm-6\">\n" +
    "            <div class=\"panel-body\" ng-include src=\"'/scripts/components/profile/logo/profileLogoView.html'\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-6\" ng-class=\"{'modal-overlay-35': isPasswordReset}\">\n" +
    "            <div class=\"panel-body profile-personal-details\">\n" +
    "                <div ng-include src=\"'/scripts/components/profile/personalDetails/profilePersonalDetailsView.html'\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "            <div class=\"panel-body profile-password\">\n" +
    "                <div ng-include src=\"'/scripts/components/profile/password/profilePasswordView.html'\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/shared/campuses/sharedProfileCampusFormButtonsView.html',
    "<div class=\"col-sm-12\">\n" +
    "    <a class=\"btn btn-primary pull-right btn-float-fix\" ng-if=\"editMode\" ng-class=\"{'disabled':campusSubmitInProgress}\" ng-click=\"handleUpdateClick()\">\n" +
    "        <i class=\"fa fa-check-circle\"></i>\n" +
    "        <span>Update</span>\n" +
    "    </a>\n" +
    "    \n" +
    "    <div class=\"pull-right m-lr-sm btn-float-fix\" ng-show=\"displayDelete\">\n" +
    "        <a class=\"btn btn-danger btn-float-fix\" ng-class=\"{'disabled':campusSubmitInProgress}\" ng-click=\"handleDeleteClick()\">\n" +
    "            <i class=\"fa fa-trash\"></i>\n" +
    "            <span>Delete</span>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "\n" +
    "    <a class=\"btn btn-primary pull-right btn-float-fix\" ng-if=\"!editMode\" ng-class=\"{'disabled':campusSubmitInProgress}\" ng-click=\"handleCreateClick()\">\n" +
    "        <i class=\"fa fa-check-circle\"></i>\n" +
    "        <span>Save</span>\n" +
    "    </a>\n" +
    "\n" +
    "    <a class=\"btn btn-default pull-right btn-float-fix\" ng-class=\"{'disabled':campusSubmitInProgress}\" ng-click=\"handleCancelClick()\">\n" +
    "        <i class=\"fa fa-ban\"></i>\n" +
    "        <span>Cancel</span>\n" +
    "    </a>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/profiles/shared/campuses/sharedProfileCampusFormView.html',
    "<div class=\"ibox\" ng-controller=\"SharedProfileCampusFormController as SharedProfileCampusFormController\">\n" +
    "    <div class=\"\">\n" +
    "    <div class=\"ibox-title m-t-xl\">\n" +
    "        <h5>{{editMode ? 'Edit' : 'Add'}} Campus</h5>\n" +
    "        <div class=\"ibox-tools\">\n" +
    "            <a class=\"close-link\" ng-click=\"handleCancelClick()\">\n" +
    "                <i class=\"fa fa-times\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <div wave-spinner ng-show=\"isFetchInProgress()\"></div>\n" +
    "\n" +
    "        <form class=\"form-horizontal add-campus\" name=\"forms.campusForm\" ng-class=\"{submitted:submitted}\" novalidate autocomplete=\"off\">\n" +
    "\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors': !SharedProfileCampusFormController.isValidName()}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Campus Name *</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <input type=\"text\" class=\"form-control\" name=\"name\"\n" +
    "                           ng-model=\"campus.name\"\n" +
    "                           ng-required=\"true\"\n" +
    "                           ng-focus=\"SharedProfileCampusFormController.setValid('name')\"\n" +
    "                           focus-delay=\"250\"\n" +
    "\n" +
    "                           custom-popover\n" +
    "                           popover-html=\"Add a campus name\"\n" +
    "                           popover-placement=\"left\"\n" +
    "                           popover-trigger=\"manual\"\n" +
    "                           popover-visibility=\"{{!SharedProfileCampusFormController.isValidName()}}\"/>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors': !SharedProfileCampusFormController.isValidCountry()}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Country *</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <ui-select\n" +
    "                        name=\"country\"\n" +
    "                        ng-model=\"campus.country\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        on-select=\"SharedProfileCampusFormController.setValid('country')\"\n" +
    "                        focus-delay=\"250\"\n" +
    "                        custom-popover\n" +
    "                        popover-html=\"Select an option\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{!SharedProfileCampusFormController.isValidCountry()}}\"\n" +
    "                        >\n" +
    "                        <ui-select-match placeholder=\"Select an Option\">{{$select.selected.name}}</ui-select-match>\n" +
    "                        <ui-select-choices \n" +
    "                            refresh-delay=\"1000\"\n" +
    "                            repeat=\"option.countryCode as option in countriesList | filter:$select.search\">\n" +
    "                            <div ng-bind-html=\"option.name | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors': !SharedProfileCampusFormController.isValidAddress()}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Address *</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <input type=\"text\" class=\"form-control\" name=\"addressLine1\"\n" +
    "                           ng-model=\"campus.addressLine1\"\n" +
    "                           ng-required=\"true\"\n" +
    "                           ng-focus=\"SharedProfileCampusFormController.setValid('addressLine1')\"\n" +
    "                           focus-delay=\"250\"\n" +
    "\n" +
    "                           custom-popover\n" +
    "                           popover-html=\"Add an address\"\n" +
    "                           popover-placement=\"left\"\n" +
    "                           popover-trigger=\"manual\"\n" +
    "                           popover-visibility=\"{{!SharedProfileCampusFormController.isValidAddress()}}\"/>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">&nbsp;</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"campus.addressLine2\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors': !SharedProfileCampusFormController.isValidCity()}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Town / City *</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <input type=\"text\" class=\"form-control\" name=\"city\"\n" +
    "                           ng-model=\"campus.city\"\n" +
    "                           ng-required=\"true\"\n" +
    "                           focus-delay=\"250\"\n" +
    "\n" +
    "                           custom-popover\n" +
    "                           popover-html=\"Add a town/city\"\n" +
    "                           popover-placement=\"left\"\n" +
    "                           popover-trigger=\"manual\"\n" +
    "                           popover-visibility=\"{{!SharedProfileCampusFormController.isValidCity()}}\"/>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\" for=\"campusState\">State / Province</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <input id=\"campusState\" type=\"text\" class=\"form-control\" ng-model=\"campus.state\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\" for=\"campusPostCode\">Postcode</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <input id=\"campusPostCode\" type=\"text\" class=\"form-control\" ng-model=\"campus.postcode\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"separator\"></div>\n" +
    "\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-12 col-lg-6\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-5\" for=\"campusLatitude\">Latitude</label>\n" +
    "                        <div class=\"col-sm-7\">\n" +
    "                            <input id=\"campusLatitude\" type=\"text\" class=\"form-control\" ng-model=\"campus.latitude\" ng-readonly=\"campus.autoGenerate\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12 col-lg-6\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-5\" for=\"campusLongitude\">Longitude</label>\n" +
    "                        <div class=\"col-sm-7\">\n" +
    "                            <input id=\"campusLongitude\" type=\"text\" class=\"form-control\" ng-model=\"campus.longitude\" ng-readonly=\"campus.autoGenerate\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"separator dashed text-center\">\n" +
    "                <span class=\"text\">or</span>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Auto Generate</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <div class=\"btn-toggle\">\n" +
    "                        <switch ng-model=\"campus.autoGenerate\" class=\"green\"></switch>\n" +
    "                        <span class=\"switch-text\">Use address to auto generate latitude and longitude.</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\"></label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <button type=\"button\" class=\"btn btn-default btn-xs pull-right\"\n" +
    "                        ng-click=\"SharedProfileCampusFormController.refreshMap()\"\n" +
    "                        ng-disabled=\"refreshMapInProgress || !campus.autoGenerate\">\n" +
    "                        <i class=\"fa fa-refresh\"></i>\n" +
    "                        <span>Refresh Map</span>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"separator\"></div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Display In Frontend</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <div class=\"btn-toggle\">\n" +
    "                        <switch ng-model=\"campus.displayInFrontEnd\" ng-change=\"SharedProfileCampusFormController.displayOnFrontEndClick()\" class=\"green\"></switch>\n" +
    "                        <span class=\"switch-text\">If selected, campus will be sent to profile. (Latitude and longitude is required)</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Primary Campus</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <div class=\"btn-toggle\">\n" +
    "                        <switch id=\"campusPrimary\" ng-model=\"campus.primary\" class=\"green\"></switch>\n" +
    "                        <span class=\"switch-text\">Please only check if it's the main campus</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"white-space\"></div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-include=\"'/scripts/components/profiles/shared/campuses/sharedProfileCampusFormButtonsView.html'\"></div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "\n" +
    "    <pre ng-if=\"SharedProfileCampusFormController.devMode\">{{campus|json}}</pre>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/shared/campuses/sharedProfileCampusesView.html',
    "<script id=\"ng-table/templates/campus/delete-header.html\" type=\"text/ng-template\">\n" +
    "    <th class=\"header\" ng-if=\"$column.show(this)\">\n" +
    "        <button type=\"button\" class=\"btn btn-danger btn-sm\" ng-class=\"{'disabled': isDeleteButtonDisabled()}\" ng-click=\"handleDeleteClick()\">\n" +
    "            <span class=\"glyphicon glyphicon-trash\"></span> {{$column.title(this)}}\n" +
    "        </button>\n" +
    "    </th>\n" +
    "</script>\n" +
    "<div ng-controller=\"SharedProfileCampusesController as ProfileCampusesController\">\n" +
    "    <!-- START CAMPUS TAB SECTION -->\n" +
    "    <div class=\"campus-tab\">\n" +
    "        <div class=\"tab-header\">\n" +
    "            <div class=\"btn-toggle\" ng-show=\"isQsUser\">\n" +
    "                <switch class=\"green\"\n" +
    "                    ng-disabled=\"campusesInEventsInclusionDisbaled\"\n" +
    "                    ng-model=\"sharedProfile.campusesOnEvents\"\n" +
    "                    ng-change=\"!campusesInEventsInclusionDisbaled ? handleIncludeInEventsClick() : null\">\n" +
    "                </switch>\n" +
    "                <span class=\"switch-text\">Include all campuses in events page</span>\n" +
    "            </div>\n" +
    "            <button class=\"btn btn-primary pull-right\" type=\"button\" ng-click=\"handleAddClick()\">\n" +
    "                <i class=\"fa fa-plus\"></i>\n" +
    "                <span>Add Campus</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <div class=\"tab-body\">\n" +
    "            <div id=\"campusesTable\">\n" +
    "                <div class=\"ibox float-e-margins scroll-horizontal hide-vertical-overflow\">\n" +
    "                    <table ng-table-dynamic=\"tableParams with columns\" show-filter=\"false\" class=\"table table-striped table-bordered table-hover pointer\">\n" +
    "                        <tbody ui-sortable=\"sortableOptions\" ng-model=\"$data\">\n" +
    "                            <tr ng-repeat=\"campus in $data track by $index\" ng-class=\"{'active': campus.id == selectedCampusId}\">\n" +
    "                                <td ng-click=\"col.field === 'delete'? '' : handleDatagridRowClick(campus)\" ng-repeat=\"col in $columns\">\n" +
    "                                    <input ng-if=\"col.field === 'delete'\" ng-model=\"campusesToDelete[campus.id]\" i-checkbox type=\"checkbox\">\n" +
    "                                    <p ng-if=\"col.field !== 'delete'\">\n" +
    "                                        {{ col.field === 'createdAt' && campus[col.field] ? (campus[col.field] | date:'medium') : campus[col.field] }}\n" +
    "                                    </p>\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                        </tbody>\n" +
    "                    </table>\n" +
    "                    showing {{ tableParams.total() }} entries out of {{  tableParams.totalEntries }}\n" +
    "                </div>\n" +
    "                <div id=\"mapContainer\" class=\"visibility\" ng-class=\"displayMapBlock ? 'visibility-visible' : 'visibility-hidden'\">\n" +
    "                    <h1>Locations</h1>\n" +
    "                    <div id=\"map\">\n" +
    "                        <div id=\"campusMap\"></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        \n" +
    "    </div><!-- END CAMPUS TAB SECTION -->\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('/scripts/components/profiles/shared/general/sharedProfileGeneralHistoryView.html',
    "<div class=\"ibox\">\n" +
    "    <div class=\"ibox-title m-t-xl\">\n" +
    "        <h5>History Log <small>showing last {{SharedProfileController.historyLog.totalReturned}} records of {{SharedProfileController.historyLog.total}}</small></h5>\n" +
    "        <div class=\"ibox-tools\">\n" +
    "            <a class=\"close-link\" ng-click=\"handleGeneralHistoryCloseClick()\">\n" +
    "                <i class=\"fa fa-times\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"ibox block-institution\">\n" +
    "        <div class=\"ibox-content\">\n" +
    "            <div wave-spinner class=\"text-right\" ng-show=\"fetchingHistory\"></div>\n" +
    "            <div ng-repeat=\"log in generalHistoryLog\">\n" +
    "                <ul class=\"list-unstyled list-history break-word\">\n" +
    "                    <li>\n" +
    "                        <span class=\"bold\">Modified on:</span>\n" +
    "                        <span>{{log.modifiedAt| date:'medium'}}</span>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <span class=\"bold\">Submitted by:</span>\n" +
    "                        <span>{{log.modifiedByFullName}}</span>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <span class=\"bold\">Institution Profile Name Display:</span>\n" +
    "                        <span>{{log.fullName}}</span>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <span class=\"bold\">Foundation Year:</span>\n" +
    "                        <span>{{log.foundationYear}}</span>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <span class=\"bold\">Logo:</span>\n" +
    "                        <span>{{log.smallLogo.path && log.mediumLogo.path && log.largeLogo.path ? 'Yes' : 'No'}}</span>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "                <div class=\"hr-line-dashed\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"row\" ng-show=\"SharedProfileController.handleHistoryLogVisibility()\">\n" +
    "                <div wave-spinner class=\"text-right\" ng-show=\"SharedProfileController.fetchingMoreHistoryLog()\"></div>\n" +
    "                <div class=\"col-sm-8 col-sm-offset-2\">\n" +
    "                    <a class=\"btn btn-primary btn-block\" ng-click=\"SharedProfileController.handleLoadMoreHistoryLog()\" ng-disabled=\"SharedProfileController.fetchingMoreHistoryLog()\">Load more</a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/profiles/shared/general/sharedProfileGeneralView.html',
    "<div ng-controller=\"SharedProfileGeneralController as SharedProfileGeneralController\">\n" +
    "    <div class=\"general-tab\">\n" +
    "        <form class=\"form-horizontal\" name=\"forms.generalForm\" novalidate=\"\">\n" +
    "\n" +
    "            <a class=\"btn btn-warning btn-history\" ng-class=\"{'disabled':generalHistoryDisabled}\" ng-click=\"handleHistoryLogClick()\">\n" +
    "                <i class=\"fa fa-clock-o\"></i>\n" +
    "            </a>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-3 col-md-2\">\n" +
    "                    {{SharedProfileGeneralController.logoDropzoneInstance.files[0].status === 'success' ? 'Preview Logo' : 'Upload Logo'}}\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-4 col-md-10\">\n" +
    "                    <div class=\"upload\">\n" +
    "                        <div class=\"dropzone\"\n" +
    "                             name=\"forms.logosForm\"\n" +
    "                             enctype=\"multipart/form-data\"\n" +
    "                             ng-dropzone\n" +
    "                             dropzone=\"SharedProfileGeneralController.logoDropzoneInstance\"\n" +
    "                             dropzone-config=\"SharedProfileGeneralController.logoConfig.dropzone\"\n" +
    "                             event-handlers=\"SharedProfileGeneralController.logoConfig.eventHandlers\"\n" +
    "                             novalidate >\n" +
    "                            <div class=\"fallback\">\n" +
    "                                <input name=\"file\" type=\"file\" />\n" +
    "                            </div>\n" +
    "                            <div class=\"dz-message\" ng-show=\"uploadEnabled\">\n" +
    "                                <i class=\"fa fa-upload\"></i>\n" +
    "                            </div>\n" +
    "                            <div class=\"dropzone-previews\"></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"note\">\n" +
    "                        <div class=\"note-header\">\n" +
    "                            <span class=\"bold\">Note:</span>\n" +
    "                        </div>\n" +
    "                        <div class=\"note-body\">\n" +
    "                            <p>\n" +
    "                                <span class=\"bold\">File types:</span>\n" +
    "                                <small>.jpeg &nbsp; .jpg</small>\n" +
    "                            </p>\n" +
    "                            <p>\n" +
    "                                <span class=\"bold\">Image dimensions:</span>\n" +
    "                                <small>200px x 200px</small>\n" +
    "                            </p>\n" +
    "                            <p>\n" +
    "                                <span class=\"bold\">Maximum size:</span>\n" +
    "                                <small>400 KB</small>\n" +
    "                            </p>\n" +
    "                        </div>\n" +
    "                        <div class=\"note-footer\" ng-show=\"displayRemoveLink\">\n" +
    "                            <p>\n" +
    "                                <span> Press \"Update\" to apply changes.</span>\n" +
    "                                <span class=\"or bold\">OR</span>\n" +
    "                            </p>\n" +
    "                            <a class=\"btn btn-warning btn-sm\" ng-click=\"removeUploaderImage()\">\n" +
    "                                <i class=\"fa fa-times\"></i>\n" +
    "                                <span>Click here to remove uploaded logo.</span>\n" +
    "                            </a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-3 col-md-2\">Current Logo</label>\n" +
    "                <div class=\"col-sm-4 col-md-10\">\n" +
    "                    <div class=\"preview-group\">\n" +
    "                        <div class=\"logo-preview\">\n" +
    "                            <div class=\"logo-img\">\n" +
    "                                <span\n" +
    "                                    class=\"info\"\n" +
    "                                    uib-tooltip='Used in profile pages'\n" +
    "                                    tooltip-placement=\"top\">\n" +
    "                                    <i class=\"fa fa-info-circle\"></i>\n" +
    "                                </span>\n" +
    "                                <img class=\"large-logo img-responsive\" alt=\"Large Logo\" ng-src=\"{{profile.largeLogoPath ? profile.largeLogoPath : '/images/profile/logo-large.jpg'}}\" ng-class=\"{'shadow-1px': !profile.largeLogoPath}\" />\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"logo-preview\">\n" +
    "                            <div class=\"logo-img\">\n" +
    "                                <span\n" +
    "                                    class=\"info\"\n" +
    "                                    uib-tooltip='Used in ranking widget, search results page, featured profile widget'\n" +
    "                                    tooltip-placement=\"top\">\n" +
    "                                    <i class=\"fa fa-info-circle\"></i>\n" +
    "                                </span>\n" +
    "                                <img class=\"medium-logo img-responsive\" alt=\"Medium Logo\" ng-src=\"{{profile.mediumLogoPath ? profile.mediumLogoPath : '/images/profile/logo-medium.jpg'}}\" ng-class=\"{'shadow-1px': !profile.mediumLogoPath}\" />\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"logo-preview\">\n" +
    "                            <div class=\"logo-img\">\n" +
    "                                <span\n" +
    "                                    class=\"info\"\n" +
    "                                    uib-tooltip='Used in ranking tables'\n" +
    "                                    tooltip-placement=\"top\">\n" +
    "                                    <i class=\"fa fa-info-circle\"></i>\n" +
    "                                </span>\n" +
    "                                <img class=\"small-logo img-responsive\" alt=\"Small Logo\" ng-src=\"{{profile.smallLogoPath ? profile.smallLogoPath : '/images/profile/logo-small.jpg'}}\" ng-class=\"{'shadow-1px': !profile.smallLogoPath}\" />\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-3 col-md-2\">\n" +
    "                    <span>Institution Profile Name Display</span>\n" +
    "                    <i class=\"fa fa-info-circle\"\n" +
    "                        uib-tooltip='This will change the display on your institution profile only. For other changes contact tusupport@qs.com (TopUniversities) or tmsupport@qs.com (TopMBA)'\n" +
    "                        tooltip-placement=\"top\"></i>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-9 col-md-10\">\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"profile.fullName\" />\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-3 col-md-2\">Foundation Year</label>\n" +
    "                <div class=\"col-sm-4 col-md-2\">\n" +
    "                    <input type=\"text\" class=\"form-control\" touch-spin=\"\" spin-options=\"foundationYearSpinOptions\" ng-model=\"profile.foundationYear\" />\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div wave-spinner ng-show=\"generalSubmitDisabled && displaySpinner\"></div>\n" +
    "\n" +
    "            <div class=\"clearfix\">\n" +
    "                <a class=\"btn btn-primary pull-right\" ng-class=\"{'disabled':generalSubmitDisabled}\" ng-click=\"handleGeneralSubmit()\">\n" +
    "                    <i class=\"fa fa-check-circle\" aria-hidden=\"true\"></i>\n" +
    "                    <span>Update</span>\n" +
    "                </a>\n" +
    "                <a class=\"btn btn-danger pull-right\" ng-class=\"{'disabled':SharedProfileGeneralController.isRemoveLogosDisabled()}\" ng-click=\"handleClearLogosClick()\">\n" +
    "                    <i class=\"fa fa-times\"></i>\n" +
    "                    <span>Remove logos</span>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "\n" +
    "        </form>\n" +
    "    </div>\n" +
    "\n" +
    "    <p><pre ng-show=\"SharedProfileGeneralController.devMode\">{{profile|json}}</pre></p>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/profiles/shared/sharedProfileView.html',
    "<div class=\"wrapper wrapper-content animated fadeInDown\" ng-controller=\"SharedProfileController as SharedProfileController\">\n" +
    "    <div class=\"row\">\n" +
    "        <div ng-class=\"isRightSidePanelActive() ? 'col-sm-8' : 'col-sm-12'\">\n" +
    "            <div class=\"tabs-container\" ng-class=\"{'modal-overlay': loadInProgress}\">\n" +
    "                <uib-tabset active=\"activeTab\">\n" +
    "                    <uib-tab heading=\"General\">\n" +
    "                        <div class=\"panel-body\">\n" +
    "                            <div ng-include=\"'/scripts/components/profiles/shared/general/sharedProfileGeneralView.html'\"></div>\n" +
    "                        </div>\n" +
    "                    </uib-tab>\n" +
    "\n" +
    "                    <uib-tab heading=\"Campuses\">\n" +
    "                        <div class=\"panel-body\">\n" +
    "                            <div ng-include=\"'/scripts/components/profiles/shared/campuses/sharedProfileCampusesView.html'\"></div>\n" +
    "                        </div>\n" +
    "                    </uib-tab>\n" +
    "                </uib-tabset>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"isGeneralTabActive() && showGeneralHistoryBlock\" class=\"col-sm-4\">\n" +
    "            <div ng-include=\"'/scripts/components/profiles/shared/general/sharedProfileGeneralHistoryView.html'\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"isCampusesTabActive() && showCampusForm\" class=\"col-sm-4\" fixed-element-while-scrolling=\"#campusesTable\">\n" +
    "            <div ng-include=\"'/scripts/components/profiles/shared/campuses/sharedProfileCampusFormView.html'\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/media/subtabs/brochures/tmProfileMediaBrochuresSidebarView.html',
    "<div class=\"ibox\" ng-class=\"getSelected() === 4 ? 'selected' : 'collapsed'\"  ng-controller=\"TmMediaBrochuresSidebarController as TmMediaBrochuresSidebarController\">\n" +
    "    <div class=\"ibox-title clickable\" ng-click=\"setSelected(4)\">\n" +
    "        <h5>Brochures ({{getBrochureItems().length}})</h5>\n" +
    "        <div class=\"ibox-tools\">\n" +
    "            <a>\n" +
    "                <i class=\"fa fa-chevron-up\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <div class=\"addForm\">\n" +
    "            <form class=\"form-horizontal\" name=\"forms.formBrochure\" id=\"form-brochure\" novalidate>\n" +
    "                <div class=\"alert alert-info\">\n" +
    "                    <p>\n" +
    "                        <i class=\"fa fa-info-circle\"></i>\n" +
    "                        <span>Please add your brochure title and link.</span><br />\n" +
    "                        <span>Drag and drop brochures from left to right to change the order.</span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "\n" +
    "                <div>\n" +
    "                    <div class=\"form-group\" ng-class=\"{'has-errors': isInvalidTitle}\">\n" +
    "                        <label class=\"control-label col-sm-3 col-md-2\">\n" +
    "                            <span>Title *</span>\n" +
    "                            <small>110 characters</small>\n" +
    "                        </label>\n" +
    "                        <div class=\"col-sm-9 col-md-10\">\n" +
    "                            <input class=\"form-control\"\n" +
    "                                   name=\"brochure-title\"\n" +
    "                                   maxlength=\"110\"\n" +
    "                                   ng-required=\"required\"\n" +
    "                                   type=\"text\"\n" +
    "                                   focus-if=\"isHighlighted\"\n" +
    "                                   focus-delay=\"250\"\n" +
    "                                   ng-focus=\"setIsInvalidTitle(false)\"\n" +
    "                                   ng-model=\"selectedBrochure.name\"\n" +
    "\n" +
    "                                   custom-popover\n" +
    "                                   popover-html=\"Add a brochure title\"\n" +
    "                                   popover-placement=\"left\"\n" +
    "                                   popover-trigger=\"manual\"\n" +
    "                                   popover-visibility=\"{{isInvalidTitle ? true : false}}\"/>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\" ng-class=\"{'has-errors': isInvalidUrl}\">\n" +
    "                        <label class=\"control-label col-sm-3 col-md-2\">\n" +
    "                            <span>URL *</span>\n" +
    "                        </label>\n" +
    "                        <div class=\"col-sm-9 col-md-10\">\n" +
    "                            <input class=\"form-control\"\n" +
    "                                   name=\"url\"\n" +
    "                                   type=\"url\"\n" +
    "                                   placeholder=\"http://\"\n" +
    "                                   ng-required=\"required\"\n" +
    "                                   ng-model=\"selectedBrochure.url\"\n" +
    "                                   ng-pattern=\"TmMediaBrochuresSidebarController.urlPattern\"\n" +
    "                                   ng-focus=\"setIsInvalidUrl(false)\"\n" +
    "                                   ng-keyup=\"TmMediaBrochuresSidebarController.onKeyUp($event)\"\n" +
    "\n" +
    "                                   custom-popover\n" +
    "                                   popover-html=\"Add a valid brochure link\"\n" +
    "                                   popover-placement=\"left\"\n" +
    "                                   popover-trigger=\"manual\"\n" +
    "                                   popover-visibility=\"{{isInvalidUrl ? true : false}}\"/>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group m-b-none\">\n" +
    "                        <div class=\"col-sm-12\">\n" +
    "                            <button class=\"btn btn-primary pull-right\" ng-click=\"saveBrochureForm(selectedBrochure)\">\n" +
    "                                <i class=\"fa fa-check-circle\"></i>\n" +
    "                                <span>{{isEditMode() ? 'Update' : 'Save'}}</span>\n" +
    "                            </button>\n" +
    "                            <button class=\"btn btn-default pull-right\" ng-click=\"clearBrochureForm(selectedBrochure)\">\n" +
    "                                <i class=\"fa fa-ban\"></i>\n" +
    "                                <span>Clear</span>\n" +
    "                            </button>\n" +
    "                            \n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/media/subtabs/brochures/tmProfileMediaBrochuresView.html',
    "<div ng-controller=\"TmMediaBrochuresController\">\n" +
    "    <h3 class=\"heading\">Brochures ({{brochureItems.length}})</h3>\n" +
    "    <div class=\"tab-body\">\n" +
    "        <div class=\"gallery\">\n" +
    "            <div class=\"grid-view upload\" ng-class=\"selectedItem().id === '' ? 'selected' : 'unselected'\" ng-click=\"selectBrochure()\" ng-click=\"selectBrochure()\">\n" +
    "                <div class=\"source-link\">\n" +
    "                    <i class=\"fa fa-plus\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ui-sortable=\"sortableOptions\" ng-model=\"filteredBrochureItems\">\n" +
    "                <div class=\"grid-view\" ng-class=\"selectedItem().id === item.id ? 'selected' : 'unselected'\"\n" +
    "                     ng-click=\"selectBrochure(item)\" ng-repeat=\"item in filteredBrochureItems\">\n" +
    "                    \n" +
    "                    <div class=\"preview\" ng-class=\"item.imageUrl ? '' : 'overlay' \">\n" +
    "                        <img ng-src=\"{{item.imageUrl || '/images/media/pdf-thumbnail.jpg'}}\"/>\n" +
    "                    </div>\n" +
    "                    \n" +
    "                    <div class=\"info\">\n" +
    "                        <div class=\"title\" item-order=\"{{item['orderType'][type]}}\">{{item.name}}</div>\n" +
    "                        <div class=\"types\">\n" +
    "                            <i class=\"fa fa-book\" ng-show=\"item.master\"></i>\n" +
    "                        </div>\n" +
    "                        <div class=\"actions\">\n" +
    "                            <a href=\"{{item.url}}\" target=\"_blank\" title=\"View {{item.name}}\">\n" +
    "                                <i class=\"fa fa-search\"></i>\n" +
    "                            </a>\n" +
    "                            <a ng-click=\"deleteBrochure(item)\" title=\"Delete {{item.name}}\">\n" +
    "                                <i class=\"fa fa-times-circle\"></i>\n" +
    "                            </a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/media/subtabs/images/tmProfileMediaImagesSidebarView.html',
    "<div class=\"ibox\" ng-class=\"getSelected() === 1 ? 'selected' : 'collapsed'\" ng-controller=\"TmMediaImagesSidebarController\">\n" +
    "    <div class=\"ibox-title clickable\" ng-click=\"setSelected(1)\">\n" +
    "        <h5>Images ({{getImageItems().length}})</h5>\n" +
    "        <div class=\"ibox-tools\">\n" +
    "            <a>\n" +
    "                <i class=\"fa fa-chevron-up\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <div class=\"addForm\" ng-class=\"getImageUploadingInProgress() ? 'modal-overlay' : '' \">\n" +
    "            <form class=\"form-horizontal\" name=\"forms.formImage\" id=\"form-image\" novalidate>\n" +
    "                <div class=\"alert alert-info\" ng-hide=\"selectedImage.id.length > 0\">\n" +
    "                    <p>\n" +
    "                        <i class=\"fa fa-info-circle\"></i>\n" +
    "                        <span>Please click on the upload sign to upload an image or drag and drop image into it.</span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "                <div class=\"alert alert-info\">\n" +
    "                    <p>\n" +
    "                        <i class=\"fa fa-info-circle\"></i>\n" +
    "                        <span>File must be: Less than 400KB / in jpg, jpeg format.</span><br />\n" +
    "                        <span>Images are scaled to 703 x 398 on front-end site.</span><br />\n" +
    "                        <span>Drag and drop images from left to right to change the order.</span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-show=\"selectedImage.id.length > 0\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3 col-md-2\" for=\"title\">\n" +
    "                            <span>Title</span>\n" +
    "                            <small>110 characters</small>\n" +
    "                        </label>\n" +
    "                        <div class=\"col-sm-9 col-md-10\">\n" +
    "                            <input class=\"form-control\" name=\"title\" id=\"title\" placeHolder=\"Add title\" maxlength=\"110\" type=\"text\" ng-model=\"selectedImage.name\" focus-if=\"isHighlighted\" focus-delay=\"250\" />\n" +
    "                        </div> \n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3 col-md-2\" for=\"description\">\n" +
    "                            <span>Description</span>\n" +
    "                            <small>160 characters</small>\n" +
    "                        </label>\n" +
    "                        <div class=\"col-sm-9 col-md-10\">\n" +
    "                            <textarea class=\"form-control\" name=\"description\" placeHolder=\"Add description\" id=\"description\" maxlength=\"160\" ng-model=\"selectedImage.description\"></textarea>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group  m-b-none\">\n" +
    "                        <div class=\"col-sm-12\">\n" +
    "                            <button class=\"btn btn-primary pull-right\" ng-class=\"{'disabled': submitInProgress()}\" ng-click=\"saveImageForm(selectedImage)\">\n" +
    "                                <i class=\"fa fa-check-circle\"></i>\n" +
    "                                <span>Update</span>\n" +
    "                            </button>\n" +
    "                            <button class=\"btn btn-default pull-right\" ng-class=\"{'disabled': submitInProgress()}\" ng-click=\"clearImageForm(selectedImage)\">\n" +
    "                                <i class=\"fa fa-ban\"></i>\n" +
    "                                <span>{{isEditMode() ? 'Clear' : 'Cancel'}}</span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/media/subtabs/images/tmProfileMediaImagesView.html',
    "<div ng-controller=\"TmMediaImagesController as TmMediaImagesController\">\n" +
    "    <h3 class=\"heading\">Images ({{imageItems.length}}/48)</h3>\n" +
    "    <div class=\"tab-body\">\n" +
    "        <div class=\"gallery\">\n" +
    "            <div class=\"grid-view upload\" ng-class=\"isSelected() ? 'selected' : 'unselected'\" ng-click=\"selectImage()\">\n" +
    "                <div ng-show=\"!isTemporary()\">\n" +
    "                    <form name=\"forms.imageForm\"\n" +
    "                        class=\"clearfix dropzone image-form\"\n" +
    "                        enctype=\"multipart/form-data\"\n" +
    "                        ng-dropzone dropzone=\"TmMediaImagesController.dropZoneImageInstance\"\n" +
    "                        dropzone-config=\"imageConfig.dropzone\"\n" +
    "                        event-handlers=\"imageConfig.eventHandlers\"\n" +
    "                        novalidate >\n" +
    "                        <div class=\"upload-image\">\n" +
    "                            <i class=\"fa fa-upload\" aria-hidden=\"true\"></i>\n" +
    "                        </div>\n" +
    "                        <div class=\"fallback\">\n" +
    "                            <input name=\"file\" type=\"file\" />\n" +
    "                        </div>\n" +
    "                        <div class=\"dz-message\" ng-show=\"uploadEnabled\">\n" +
    "                            <i class=\"fa fa-upload\"></i>\n" +
    "                        </div>\n" +
    "                        <div class=\"dropzone-previews\"></div>\n" +
    "                    </form>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"preview\" ng-show=\"isTemporary()\">\n" +
    "                    <img ng-src=\"{{item.thumbnailUrl || '/images/media/media-image.png'}}\" />\n" +
    "                </div>\n" +
    "                \n" +
    "                <div class=\"info\" ng-show=\"isTemporary()\" ng-class=\"getImageUploadingInProgress() ? 'modal-overlay' : '' \">\n" +
    "                    <div class=\"title\" item-order=\"{{item['orderType'][type]}}\">\n" +
    "                        {{item.name}}\n" +
    "                    </div>\n" +
    "                    <div class=\"types\">\n" +
    "                        <i class=\"fa fa-book\" ng-show=\"item.master\"></i>\n" +
    "                    </div>\n" +
    "                    <div class=\"actions\">\n" +
    "                        <a href=\"{{item.url}}\" target=\"_blank\" title=\"View {{item.name}}\">\n" +
    "                            <i class=\"fa fa-search\"></i>\n" +
    "                        </a>\n" +
    "                        <a ng-click=\"deleteImage(item)\" title=\"Delete {{item.name}}\">\n" +
    "                            <i class=\"fa fa-times-circle\"></i>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ui-sortable=\"sortableOptions\" ng-model=\"imageItems\">\n" +
    "                <div class=\"grid-view\" ng-class=\"selectedItem().id === item.id ? 'selected' : 'unselected'\" ng-click=\"selectImage(item)\" ng-repeat=\"item in imageItems\">\n" +
    "                    <div class=\"preview\">\n" +
    "                        <img ng-src=\"{{item.thumbnailUrl || '/images/media/media-image.png'}}\" />\n" +
    "                    </div>\n" +
    "                    <div class=\"info\">\n" +
    "                        <div class=\"title\" item-order=\"{{item['orderType']}}\">\n" +
    "                            {{item.name}}\n" +
    "                        </div>\n" +
    "                        <div class=\"types\">\n" +
    "                            <i class=\"fa fa-book\"></i>\n" +
    "                        </div>\n" +
    "                        <div class=\"actions\">\n" +
    "                            <a ng-click=\"openLightboxModal($index, item)\" title=\"View {{item.name}}\">\n" +
    "                                <i class=\"fa fa-search\"></i>\n" +
    "                            </a\n" +
    "                            >\n" +
    "                            <a ng-click=\"deleteImage(item)\" title=\"Delete {{item.name}}\">\n" +
    "                                <i class=\"fa fa-times-circle\"></i>\n" +
    "                            </a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/media/subtabs/socialMedia/tmProfileMediaSocialMediaSidebarView.html',
    "<div class=\"ibox\" ng-class=\"getSelected() === 3 ? 'selected' : 'collapsed'\" ng-controller=\"TmMediaSocialMediasSidebar as TmMediaSocialMediasSidebarController\">\n" +
    "    <div class=\"ibox-title clickable\" ng-click=\"setSelected(3)\">\n" +
    "        <h5>Social Media</h5>\n" +
    "        <div class=\"ibox-tools\">\n" +
    "            <a>\n" +
    "                <i class=\"fa fa-chevron-up\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <p class=\"bold text-capitalize\">{{type()}}</p>\n" +
    "\n" +
    "        <div class=\"addForm social-media-form\">\n" +
    "            <form class=\"form-horizontal\" name=\"forms.formSocialMedia\" id=\"form-social-media\" novalidate>\n" +
    "                <div class=\"alert alert-info\">\n" +
    "                    <p>\n" +
    "                        <i class=\"fa fa-info-circle\"></i>\n" +
    "                        <span>Please add your</span>\n" +
    "                        <span class=\"text-capitalize\">{{type() === \"other\" ? \"Website\" : type()}}</span>\n" +
    "                        <span>link, e.g.</span>\n" +
    "                        <span class=\"text-nowrap\">{{TmMediaSocialMediasSidebarController.selectedSocialMediaUrl}}</span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-repeat=\"selectedSocialMedia in selectedSocialMedia[type()]\">\n" +
    "                    <div ng-show=\"selectedSocialMedia.display\">\n" +
    "                        \n" +
    "                        <div class=\"form-group\" ng-class=\"{'has-errors': invalidFields[$index]}\">\n" +
    "                            <label class=\"control-label col-sm-3 col-md-2\">\n" +
    "                                <span>URL</span>\n" +
    "                            </label>\n" +
    "                            <div class=\"col-sm-9 col-md-10\">\n" +
    "                                <input class=\"form-control\"\n" +
    "                                       name=\"url{{$index}}\"\n" +
    "                                       type=\"url\"\n" +
    "                                       focus-if=\"(isHighlighted && $index === 0) ? true : false\"\n" +
    "                                       focus-delay=\"250\"\n" +
    "                                       placeholder=\"http://\"\n" +
    "                                       ng-pattern=\"TmMediaSocialMediasSidebarController.urlPattern\"\n" +
    "                                       ng-focus=\"resetInvalidField($index)\"\n" +
    "                                       ng-model=\"selectedSocialMedia.url\"\n" +
    "                                       ng-keyup=\"TmMediaSocialMediasSidebarController.onKeyUp($event, type(), $index)\"\n" +
    "\n" +
    "                                       custom-popover\n" +
    "                                       popover-trigger=\"manual\"\n" +
    "                                       popover-visibility=\"{{invalidFields[$index]}}\"\n" +
    "                                       popover-html=\"Add a valid <span class='text-capitalize'>{{type() === 'other' ? 'Website' : type()}}</span> link\"\n" +
    "                                       popover-placement=\"left\"/>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group m-b-none\">\n" +
    "                    <div class=\"col-sm-12\">\n" +
    "                        <button class=\"btn btn-primary pull-right\" ng-click=\"saveSocialMediaForm()\">\n" +
    "                            <i class=\"fa fa-check-circle\"></i>\n" +
    "                            <span>{{isEditMode(type()) ? 'Update' : 'Save'}}</span>\n" +
    "                        </button>\n" +
    "                        <button class=\"btn btn-default pull-right\" ng-click=\"clearSocialMediaForm()\">\n" +
    "                            <i class=\"fa fa-ban\"></i>\n" +
    "                            <span>Clear</span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/media/subtabs/socialMedia/tmProfileMediaSocialMediaView.html',
    "<div ng-controller=\"TmMediaSocialMediasController\">\n" +
    "    <h3 class=\"heading\">Social Media</h3>\n" +
    "\n" +
    "    <div class=\"tab-body\">\n" +
    "        <div class=\"gallery\">\n" +
    "            <div class=\"grid-view\" ng-repeat=\"(key, item) in socialMediaItems\" ng-class=\"type === key ? 'selected' : 'unselected'\" ng-click=\"selectSocialMedia(key)\">\n" +
    "                <div class=\"add-link\" ng-class=\"item.master ? 'hidden' : 'visible'\">\n" +
    "                    <i class=\"fa fa-plus\"></i>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"preview\" ng-class=\"item.master ? '' : 'overlay'\">\n" +
    "                    <img ng-src=\"/images/media/{{key}}-thumbnail.jpg\"/>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"info\">\n" +
    "                    <div class=\"title text-capitalize\">{{key}}</div>\n" +
    "                    <div class=\"types\">\n" +
    "                        <i class=\"fa fa-book\" ng-show=\"item.master\"></i>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/media/subtabs/videos/tmProfileMediaVideosSidebarView.html',
    "<div class=\"ibox\" ng-class=\"getSelected() === 2 ? 'selected' : 'collapsed'\" ng-controller=\"TmMediaVideosSidebarController as TmMediaVideosSidebarController\">\n" +
    "    <div class=\"ibox-title clickable\" ng-click=\"setSelected(2)\">\n" +
    "        <h5>Videos ({{getVideoItems().length}})</h5>\n" +
    "        <div class=\"ibox-tools\">\n" +
    "            <a>\n" +
    "                <i class=\"fa fa-chevron-up\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <div class=\"addForm\">\n" +
    "            <form class=\"form-horizontal\" name=\"forms.formVideo\" id=\"form-video\" novalidate>\n" +
    "                <div class=\"alert alert-info\">\n" +
    "                    <p>\n" +
    "                        <i class=\"fa fa-info-circle\"></i>\n" +
    "                        <span>Please add a YouTube link. Shortened video links with .be extension are not allowed.</span><br />\n" +
    "                        <span>Video title & description will be retrieved from YouTube.</span><br />\n" +
    "                        <span>Drag and drop videos from left to right to change the order.</span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    <div class=\"form-group\" ng-class=\"{'has-errors': getHasErrors()}\">\n" +
    "                        <label class=\"control-label col-sm-3 col-md-2\" for=\"url\">\n" +
    "                            <span>URL *</span>\n" +
    "                        </label>\n" +
    "                        <div class=\"col-sm-9 col-md-10\">\n" +
    "                            <input name=\"url\" id=\"url\" class=\"form-control\"\n" +
    "                                   ng-required=\"required\"\n" +
    "                                   focus-if=\"isHighlighted\"\n" +
    "                                   focus-delay=\"250\"\n" +
    "                                   type=\"url\"\n" +
    "                                   placeholder=\"http://\"\n" +
    "                                   ng-model=\"selectedVideo.url\"\n" +
    "                                   ng-pattern=\"youtubeUrlPattern\"\n" +
    "                                   ng-keyup=\"TmMediaVideosSidebarController.onKeyUp($event)\"\n" +
    "\n" +
    "                                   custom-popover\n" +
    "                                   popover-html=\"Add a valid YouTube link\"\n" +
    "                                   popover-placement=\"left\"\n" +
    "                                   popover-trigger=\"manual\"\n" +
    "                                   popover-visibility=\"{{getHasErrors() ? true : false}}\"\n" +
    "                                   ng-focus=\"setHasErrors(false)\" />\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <div class=\"col-sm-12\">\n" +
    "                            <button class=\"btn btn-primary pull-right\" ng-click=\"saveVideoForm(selectedVideo)\">\n" +
    "                                <i class=\"fa fa-check-circle\"></i>\n" +
    "                                <span>{{isEditMode() ? 'Update' : 'Save'}}</span>\n" +
    "                            </button>\n" +
    "                            <button class=\"btn btn-default pull-right\" ng-click=\"clearVideoForm(selectedVideo)\">\n" +
    "                                <i class=\"fa fa-ban\"></i>\n" +
    "                                <span>Clear</span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/media/subtabs/videos/tmProfileMediaVideosView.html',
    "<div ng-controller=\"TmMediaVideosController\">\n" +
    "    <h3 class=\"heading\">Videos ({{videoItems.length}})</h3>\n" +
    "    <div class=\"tab-body\">\n" +
    "        <div class=\"gallery\">\n" +
    "            <div class=\"grid-view upload\" ng-class=\"selectedItem().id === '' ? 'selected' : 'unselected'\" ng-click=\"selectVideo()\" ng-click=\"selectVideo()\">\n" +
    "                <div class=\"source-link\">\n" +
    "                    <i class=\"fa fa-plus\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ui-sortable=\"sortableOptions\" ng-model=\"filteredVideoItems\">\n" +
    "                <div class=\"grid-view\" ng-class=\"selectedItem().id === item.id ? 'selected' : 'unselected'\" ng-click=\"selectVideo(item)\" ng-repeat=\"item in filteredVideoItems\">\n" +
    "                    <div class=\"preview\" ng-class=\"item.imageUrl ? '' : 'overlay' \">\n" +
    "                        <img ng-src=\"{{item.imageUrl || '/images/media/youtube-thumbnail.jpg'}}\" />\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"info\">\n" +
    "                        <div class=\"title\" item-order=\"{{item['orderType'][type]}}\">\n" +
    "                            {{item.name || 'Retrieving title...' }}\n" +
    "                        </div>\n" +
    "                        <div class=\"types\">\n" +
    "                            <i class=\"fa fa-book\" ng-show=\"item.master\"></i>\n" +
    "                        </div>\n" +
    "                        <div class=\"actions\">\n" +
    "                            <a href=\"{{item.url}}\" target=\"_blank\" title=\"View {{item.name}}\">\n" +
    "                                <i class=\"fa fa-search\"></i>\n" +
    "                            </a>\n" +
    "                            <a ng-click=\"deleteVideo(item)\" title=\"Delete {{item.name}}\">\n" +
    "                                <i class=\"fa fa-times-circle\"></i>\n" +
    "                            </a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/media/tmProfileMediaLinkManagerView.html',
    "<div class=\"nested-ibox\" ng-hide=\"showUpgradeForm\" ng-controller=\"TmMediaCommonSidebarController\">\n" +
    "    <div class=\"ibox-title m-t-xl\">\n" +
    "        <h4>Media Manager ({{getGeneralCounter()}})</h4>\n" +
    "    </div>\n" +
    "    <div class=\"ibox\">\n" +
    "        <div class=\"ibox-content\">\n" +
    "            <div include-replace ng-include src=\"'/scripts/components/profiles/tm/media/subtabs/images/tmProfileMediaImagesSidebarView.html'\"></div>\n" +
    "            <div include-replace ng-include src=\"'/scripts/components/profiles/tm/media/subtabs/videos/tmProfileMediaVideosSidebarView.html'\"></div>\n" +
    "            <div include-replace ng-include src=\"'/scripts/components/profiles/tm/media/subtabs/socialMedia/tmProfileMediaSocialMediaSidebarView.html'\"></div>\n" +
    "            <div include-replace ng-include src=\"'/scripts/components/profiles/tm/media/subtabs/brochures/tmProfileMediaBrochuresSidebarView.html'\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/media/tmProfileMediaView.html',
    "<div ng-controller=\"TmProfileMediaController as TmProfileMediaController\">\n" +
    "    <div upgrade-banner\n" +
    "         info-block-class=\"TmProfileMediaController.isRightSidePanelActive() ? 'col-lg-9' : 'col-lg-10'\"\n" +
    "         buttons-block-class=\"TmProfileMediaController.isRightSidePanelActive() ? 'col-lg-3' : 'col-lg-2'\"\n" +
    "         basic-profile=\"!tmIsAdvanced ? true : false\"\n" +
    "         upgrade-email=\"{{upgradeEmailsTo}}\"\n" +
    "         upgrade-click=\"TmProfileController.toggleUpgradeForm()\"></div>\n" +
    "\n" +
    "    <div ng-class=\"tmIsAdvanced ? '': 'modal-overlay-35'\">\n" +
    "        <div wave-spinner class=\"wave-spinner\" ng-show=\"isMediaReloading\"></div>\n" +
    "        <div ng-if=\"!isMediaReloading\">\n" +
    "            <div ng-show=\"TmProfileMediaController.isImagesTabActive()\" ng-include src=\"'/scripts/components/profiles/tm/media/subtabs/images/tmProfileMediaImagesView.html'\"></div>\n" +
    "            <div ng-show=\"TmProfileMediaController.isVideosTabActive()\" ng-include src=\"'/scripts/components/profiles/tm/media/subtabs/videos/tmProfileMediaVideosView.html'\"></div>\n" +
    "            <div ng-show=\"TmProfileMediaController.isSocialMediaTabActive()\" ng-include src=\"'/scripts/components/profiles/tm/media/subtabs/socialMedia/tmProfileMediaSocialMediaView.html'\"></div>\n" +
    "            <div ng-show=\"TmProfileMediaController.isBrochuresTabActive()\" ng-include src=\"'/scripts/components/profiles/tm/media/subtabs/brochures/tmProfileMediaBrochuresView.html'\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/overview/faq/tmProfileOverviewFaqHistoryLogView.html',
    "<div class=\"ibox\">\n" +
    "    <div class=\"ibox-title m-t-xl\">\n" +
    "        <h5>History Log <small>showing last {{TmProfileController.overviewLog.totalFiltered}} records of {{TmProfileController.overviewLog.totalMatching}}</small></h5>\n" +
    "        <div class=\"ibox-tools\">\n" +
    "            <a class=\"close-link\" ng-click=\"TmProfileController.closeHistoryLogs()\">\n" +
    "                <i class=\"fa fa-times\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <div wave-spinner ng-show=\"TmProfileController.fetchingHistoryLogsInProgress\"></div>\n" +
    "\n" +
    "        <p class=\"text-muted text-center\" ng-show=\"!TmProfileController.fetchingHistoryLogsInProgress && !TmProfileController.overviewLog.total\">\n" +
    "            History log is empty\n" +
    "        </p>\n" +
    "\n" +
    "        <div ng-show=\"!TmProfileController.fetchingHistoryLogsInProgress\" ng-repeat=\"logs in TmProfileController.overviewLog.results\">\n" +
    "            <ul class=\"list-unstyled list-history break-word\">\n" +
    "                <li ng-if=\"logs.modifiedAt\">\n" +
    "                    <span class=\"bold\">Modified on:</span>\n" +
    "                    <span>{{logs.modifiedAt| date:'medium'}}</span>\n" +
    "                </li>\n" +
    "                <li ng-if=\"logs.modifiedByFullName\">\n" +
    "                    <span class=\"bold\">Submitted by:</span>\n" +
    "                    <span>{{logs.modifiedByFullName}}</span>\n" +
    "                </li>\n" +
    "                <li ng-repeat=\"log in logs.faq\">\n" +
    "                    <div>\n" +
    "                        <span class=\"bold\">Question {{$index + 1}}/{{TmProfileController.maxFaqItems}}:</span>\n" +
    "                        <span>{{log.question | htmlToPlaintext}}</span>\n" +
    "                    </div>\n" +
    "                    <div>\n" +
    "                        <span class=\"bold\">Answer {{$index + 1}}/{{TmProfileController.maxFaqItems}}:</span>\n" +
    "                        <span>{{log.answer | htmlToPlaintext}}</span>\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            \n" +
    "            <div class=\"separator dashed\"></div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\" ng-show=\"TmProfileController.isMoreLogsAvailable()\">\n" +
    "            <div wave-spinner class=\"text-right\" ng-show=\"TmProfileController.isLoadMoreHistoryLogsInProgress\"></div>\n" +
    "            <div class=\" col-lg-8 col-lg-offset-2\">\n" +
    "                <a class=\"btn btn-primary btn-block\" ng-click=\"TmProfileController.handleLoadMoreHistoryLogs()\" ng-disabled=\"TmProfileController.isLoadMoreHistoryLogsInProgress\">\n" +
    "                   Load more\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/overview/faq/tmProfileOverviewFaqView.html',
    "<div class=\"alert alert-info\">\n" +
    "    <p>\n" +
    "        <i class=\"fa fa-info-circle\"></i>\n" +
    "        <span>You can add up to five FAQs. These will display in the order they are added below.</span>\n" +
    "    </p>\n" +
    "</div>\n" +
    "<div class=\"tab-header\">\n" +
    "    <div wave-spinner ng-show=\"historyDisabled\"></div>\n" +
    "    <h3 class=\"heading\"><span class=\"sr-only\">FAQ</span></h3>\n" +
    "    <a class=\"btn btn-warning btn-history\" ng-show=\"!historyDisabled\" ng-click=\"TmProfileOverviewController.handleTmFaqHistoryLogClick()\">\n" +
    "        <i class=\"fa fa-clock-o\"></i>\n" +
    "    </a>\n" +
    "</div>\n" +
    "<div class=\"tab-body\">\n" +
    "    <div ng-controller=\"TmProfileOverviewFaqController as TmProfileOverviewFaqController\">\n" +
    "        <form enctype=\"multipart/form-data\">\n" +
    "            <div ng-repeat=\"item in TmProfileOverviewFaqController.items track by $index\">\n" +
    "                <div ng-if=\"TmProfileOverviewFaqController.isItemVisible($index)\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label>Question {{$index + 1}}/{{TmProfileOverviewFaqController.maxItems}}</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"e.g. How do I apply for the X program at X Business School?\" ng-model=\"faq[$index].question\" />\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label>Answer</label>\n" +
    "                        <summernote\n" +
    "                            config=\"TmProfileOverviewFaqController.textEditorAdvancedOptions\"\n" +
    "                            ng-model=\"faq[$index].answer\"\n" +
    "                            on-init=\"TmProfileOverviewFaqController.handleTextEditorChanges($index, faq[$index].answer)\"\n" +
    "                            on-change=\"TmProfileOverviewFaqController.handleTextEditorChanges($index, contents)\"\n" +
    "                            count-word=\"controller.wordsCounters[$index]\">\n" +
    "                        </summernote>\n" +
    "                    </div>\n" +
    "                    <div class=\"editor-note form-group\">\n" +
    "                        <span ng-class=\"{'text-red': TmProfileOverviewFaqController.isInvalidAnswer($index, faq[$index].answer)}\">\n" +
    "                            <span class=\"bold\">\n" +
    "                                <ng-pluralize count=\"TmProfileOverviewFaqController.wordsCounters[$index] || 0\" when=\"{'one': '1 word inserted','other': '{} words inserted'}\"></ng-pluralize>\n" +
    "                            </span>\n" +
    "                        </span>\n" +
    "                        <span class=\"pull-right\">Maximum {{TmProfileOverviewFaqController.wordsLimit}} words</span>\n" +
    "                    </div>\n" +
    "                    <div class=\"actions m-b-md\">\n" +
    "                        <a class=\"btn btn-danger\"\n" +
    "                           ng-class=\"{'disabled': TmProfileOverviewFaqController.isRemoveDisabled($index)}\"\n" +
    "                           ng-click=\"TmProfileOverviewFaqController.handleRemoveClick($index)\">\n" +
    "                            <i class=\"fa fa-ban\"></i>\n" +
    "                            <span>Delete FAQ</span>\n" +
    "                        </a>\n" +
    "                        <a class=\"btn btn-primary\"\n" +
    "                           ng-show=\"TmProfileOverviewFaqController.showAddFaq($index)\"\n" +
    "                           ng-class=\"{'disabled': programsTabSubmitInProgress || faq.length === 5}\"\n" +
    "                           ng-click=\"TmProfileOverviewFaqController.handleAddClick()\">\n" +
    "                            <i class=\"fa fa-plus\"></i>\n" +
    "                            <span>Add FAQ</span>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"tab-footer\">\n" +
    "                <a class=\"btn btn-primary pull-right\" ng-click=\"TmProfileOverviewFaqController.handleUpdateClick()\">\n" +
    "                    <i class=\"fa fa-check-circle\"></i>\n" +
    "                    <span>Update</span>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/profiles/tm/overview/overview/tmProfileOverviewAdvancedOverviewView.html',
    "<form name=\"forms.overviewAdvancedForm\" enctype=\"multipart/form-data\">\n" +
    "    <div class=\"tab-header\">\n" +
    "        <div wave-spinner ng-show=\"historyDisabled\"></div>\n" +
    "        <h3 class=\"heading\">Advanced Description *</h3>\n" +
    "        <a class=\"btn btn-warning btn-history\" ng-show=\"!historyDisabled\" ng-click=\"TmProfileOverviewController.handleTmOverviewHistoryLogClick(true)\">\n" +
    "            <i class=\"fa fa-clock-o\"></i>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"tab-body\">\n" +
    "        <div class=\"summernote-container\" ng-class=\"{'has-errors': TmProfileOverviewController.isOverviewInvalid()}\">\n" +
    "            <summernote\n" +
    "                config=\"TmProfileOverviewController.textEditorAdvancedOptions\"\n" +
    "                ng-model=\"tmProfile.advancedOverview\"\n" +
    "                on-focus=\"TmProfileOverviewController.setOverviewInvalid('advancedTmOverview')\"\n" +
    "                on-change=\"TmProfileOverviewController.advancedOverviewWords = countWords(contents)\"\n" +
    "                on-init=\"TmProfileOverviewController.advancedOverviewWords = countWords(tmProfile.advancedOverview)\"\n" +
    "                count-word=\"TmProfileOverviewController.advancedOverviewWords\">\n" +
    "            </summernote>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"editor-note form-group\">\n" +
    "            <span ng-class=\"{'text-red': TmProfileOverviewController.isAdvancedOverviewInvalid(TmProfileOverviewController.advancedOverviewWords)}\">\n" +
    "                <span class=\"bold\">{{TmProfileOverviewController.advancedOverviewWords}}</span>\n" +
    "                <span>words inserted</span>\n" +
    "            </span>\n" +
    "            <span class=\"pull-right\">Maximum {{TmProfileOverviewController.advancedDescriptionWordLimit}} words</span>\n" +
    "\n" +
    "            <div\n" +
    "                focus-delay=\"250\"\n" +
    "                custom-popover\n" +
    "                popover-html=\"Add a general description about your business school\"\n" +
    "                popover-placement=\"left\"\n" +
    "                popover-trigger=\"manual\"\n" +
    "                popover-visibility=\"{{isAdvancedTmOverviewEmpty ? true : false}}\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "<div class=\"separator\"></div>\n" +
    "\n" +
    "<div  class=\"row\">\n" +
    "    <div class=\"col-lg-6 form-group\">\n" +
    "        <div>\n" +
    "            <h3>University Website</h3>\n" +
    "        </div>\n" +
    "        <input type=\"text\"\n" +
    "           placeholder=\"http://\"\n" +
    "           ng-model=\"tmProfile.websiteUrl\"\n" +
    "           ng-keyup=\"TmProfileOverviewController.onKeyUp($event)\"\n" +
    "           class=\"form-control\" />\n" +
    "    </div>\n" +
    "    <div class=\"col-lg-6 form-group\">\n" +
    "        <div class=\"display-inline-request-info margin-right-30\">\n" +
    "            <h3 class=\"inline\">Request info - Email</h3>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <input type=\"email\" placeholder=\"Email\" ng-model=\"tmProfile.requestInfoEmail\" class=\"form-control\" >\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"tab-footer\">\n" +
    "    <a class=\"btn btn-primary pull-right\"\n" +
    "       ng-class=\"{'disabled': overviewAdvancedFormSubmitInProgress}\"\n" +
    "       ng-click=\"handleOverviewAdvancedDataSubmit()\">\n" +
    "       <i class=\"fa fa-check-circle\"></i>\n" +
    "       <span>Update</span>\n" +
    "    </a>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/profiles/tm/overview/overview/tmProfileOverviewBasicOverviewView.html',
    "<form name=\"forms.overviewBasicForm\" enctype=\"multipart/form-data\">\n" +
    "    <div class=\"tab-header\">\n" +
    "      <div wave-spinner ng-show=\"historyDisabled\"></div>\n" +
    "      <h3 class=\"heading\">Basic Description *</h3>\n" +
    "      <a class=\"btn btn-warning btn-history\" ng-show=\"!historyDisabled\" ng-click=\"TmProfileOverviewController.handleTmOverviewHistoryLogClick()\">\n" +
    "        <i class=\"fa fa-clock-o\"></i>\n" +
    "      </a>\n" +
    "    </div>\n" +
    "    <div class=\"tab-body\">\n" +
    "        <div class=\"summernote-container\" ng-class=\"{'has-errors': TmProfileOverviewController.isOverviewInvalid()}\">\n" +
    "            <summernote\n" +
    "                config=\"TmProfileOverviewController.textEditorBasicOptions\"\n" +
    "                ng-model=\"tmProfile.basicOverview\"\n" +
    "                on-focus=\"TmProfileOverviewController.setOverviewInvalid('basicTmOverview')\"\n" +
    "                on-change=\"TmProfileOverviewController.basicOverviewWords = countWords(contents)\"\n" +
    "                on-init=\"TmProfileOverviewController.basicOverviewWords = countWords(tmProfile.basicOverview)\"\n" +
    "                count-word=\"TmProfileOverviewController.basicOverviewWords\">\n" +
    "            </summernote>\n" +
    "        </div>\n" +
    "\n" +
    "      <div class=\"editor-note form-group\">\n" +
    "        <span ng-class=\"{'text-red': TmProfileOverviewController.isBasicOverviewInvalid(TmProfileOverviewController.basicOverviewWords)}\">\n" +
    "          <span class=\"bold\">{{TmProfileOverviewController.basicOverviewWords}}</span>\n" +
    "          <span>words inserted</span>\n" +
    "        </span>\n" +
    "        <span class=\"pull-right\">Maximum {{TmProfileOverviewController.basicDescriptionWordLimit}} words</span>\n" +
    "        \n" +
    "        <div\n" +
    "            focus-delay=\"250\"\n" +
    "            custom-popover\n" +
    "            popover-html=\"Add a general description about your business school\"\n" +
    "            popover-placement=\"left\"\n" +
    "            popover-trigger=\"manual\"\n" +
    "            popover-visibility=\"{{isBasicTmOverviewEmpty ? true : false}}\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"tab-footer\">\n" +
    "        <a class=\"btn btn-primary pull-right\"\n" +
    "          ng-class=\"{'disabled': overviewBasicFormSubmitInProgress}\"\n" +
    "          ng-click=\"handleOverviewBasicDataSubmit()\">\n" +
    "          <i class=\"fa fa-check-circle\"></i>\n" +
    "          <span>Update</span>\n" +
    "        </a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "</form>\n" +
    "\n" +
    "<div upgrade-banner\n" +
    "     info-block-class=\"isRightSidePanelActive() ? 'col-lg-9' : 'col-lg-10'\"\n" +
    "     buttons-block-class=\"isRightSidePanelActive() ? 'col-lg-3' : 'col-lg-2'\"\n" +
    "     basic-profile=\"true\"\n" +
    "     upgrade-email=\"{{upgradeEmailsTo}}\"\n" +
    "     upgrade-click=\"TmProfileController.toggleUpgradeForm()\"></div>\n" +
    "\n" +
    "<div class=\"separator\"></div>\n" +
    "\n" +
    "<div class=\"locked\">\n" +
    "    <div  class=\"row\">\n" +
    "        <div class=\"col-lg-6 form-group\">\n" +
    "            <div>\n" +
    "                <h3>University Website</h3>\n" +
    "            </div>\n" +
    "            <input type=\"text\"\n" +
    "               disabled\n" +
    "               placeholder=\"http://\"\n" +
    "               ng-model=\"tmProfile.websiteUrl\"\n" +
    "               class=\"form-control\" />\n" +
    "        </div>\n" +
    "        <div class=\"col-lg-6 form-group\">\n" +
    "            <div class=\"display-inline-request-info margin-right-30\">\n" +
    "                <h3 class=\"inline\">Request info - Email</h3>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"email\"\n" +
    "                   disabled\n" +
    "                   placeholder=\"Email\"\n" +
    "                   ng-model=\"tmProfile.requestInfoEmail\"\n" +
    "                   class=\"form-control\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/overview/overview/tmProfileOverviewHistoryLogView.html',
    "<div class=\"ibox\">\n" +
    "    <div class=\"ibox-title m-t-xl\">\n" +
    "        <h5>History Log <small>showing last {{TmProfileController.overviewLog.totalFiltered}} records of {{TmProfileController.overviewLog.totalMatching}}</small></h5>\n" +
    "        <div class=\"ibox-tools\">\n" +
    "            <a class=\"close-link\" ng-click=\"TmProfileController.closeHistoryLogs()\">\n" +
    "                <i class=\"fa fa-times\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <div wave-spinner ng-show=\"TmProfileController.fetchingHistoryLogsInProgress\"></div>\n" +
    "\n" +
    "        <p class=\"text-muted text-center\" ng-show=\"!TmProfileController.fetchingHistoryLogsInProgress && !TmProfileController.overviewLog.total\">\n" +
    "            History log is empty\n" +
    "        </p>\n" +
    "\n" +
    "        <div ng-show=\"!TmProfileController.fetchingHistoryLogsInProgress\" ng-repeat=\"log in TmProfileController.overviewLog.results\">\n" +
    "            <ul class=\"list-unstyled list-history break-word\">\n" +
    "                <li ng-if=\"log.modifiedAt\">\n" +
    "                    <span class=\"bold\">Modified on:</span>\n" +
    "                    <span>{{log.modifiedAt| date:'medium'}}</span>\n" +
    "                </li>\n" +
    "                <li ng-if=\"log.modifiedByFullName\">\n" +
    "                    <span class=\"bold\">Submitted by:</span>\n" +
    "                    <span>{{log.modifiedByFullName}}</span>\n" +
    "                </li>\n" +
    "                <li ng-show=\"!log.advanced\">\n" +
    "                    <span class=\"bold\">Basic Description:</span>\n" +
    "                    <span>{{log.basicOverview | htmlToPlaintext}}</span>\n" +
    "                </li>\n" +
    "                <li ng-show=\"log.advanced\">\n" +
    "                    <span class=\"bold\">Advanced Description:</span>\n" +
    "                    <span>{{log.advancedOverview | htmlToPlaintext}}</span>\n" +
    "                </li>\n" +
    "                <li ng-show=\"log.advanced\">\n" +
    "                    <span class=\"bold\">University Website:</span>\n" +
    "                    <a ng-show=\"log.websiteUrl\" href=\"{{log.websiteUrl}}\" target=\"_blank\">{{log.websiteUrl}}</a>\n" +
    "                </li>\n" +
    "                <li ng-show=\"log.advanced\">\n" +
    "                    <span class=\"bold\">Request info - Email:</span>\n" +
    "                    <span>{{log.requestInfoEmail}}</span>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "\n" +
    "            <div class=\"separator dashed\"></div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\" ng-show=\"TmProfileController.isMoreLogsAvailable()\">\n" +
    "            <div wave-spinner ng-show=\"TmProfileController.isLoadMoreHistoryLogsInProgress\"></div>\n" +
    "            <div class=\" col-lg-8 col-lg-offset-2\">\n" +
    "                <a class=\"btn btn-primary btn-block\" ng-click=\"TmProfileController.handleLoadMoreHistoryLogs()\" ng-disabled=\"TmProfileController.isLoadMoreHistoryLogsInProgress\">\n" +
    "                   Load more\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/overview/tmProfileOverviewView.html',
    "<div ng-controller=\"TmProfileOverviewController as TmProfileOverviewController\">\n" +
    "    <div class=\"tabs-container\">\n" +
    "        <uib-tabset active=\"activeOverviewSubTab\">\n" +
    "            <uib-tab heading=\"Overview\">\n" +
    "                <div class=\"panel-body\">\n" +
    "                    <div ng-if=\"tmIsAdvanced\" ng-include src=\"'/scripts/components/profiles/tm/overview/overview/tmProfileOverviewAdvancedOverviewView.html'\"></div>\n" +
    "                    <div ng-if=\"!tmIsAdvanced\" ng-include src=\"'/scripts/components/profiles/tm/overview/overview/tmProfileOverviewBasicOverviewView.html'\"></div>\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "            <uib-tab heading=\"FAQ\">\n" +
    "                <div class=\"panel-body\">\n" +
    "                    <div ng-if=\"!tmIsAdvanced\"\n" +
    "                         upgrade-banner\n" +
    "                         info-block-class=\"isRightSidePanelActive() ? 'col-lg-9' : 'col-lg-10'\"\n" +
    "                         buttons-block-class=\"isRightSidePanelActive() ? 'col-lg-3' : 'col-lg-2'\"\n" +
    "                         basic-profile=\"true\"\n" +
    "                         upgrade-email=\"{{upgradeEmailsTo}}\"\n" +
    "                         upgrade-click=\"TmProfileController.toggleUpgradeForm()\"></div>\n" +
    "\n" +
    "                    <div ng-class=\"{'modal-overlay-35': !tmIsAdvanced}\"\n" +
    "                         ng-include src=\"'/scripts/components/profiles/tm/overview/faq/tmProfileOverviewFaqView.html'\"></div>\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "        </uib-tabset>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/profiles/tm/program-stats/tmProfileProgramStatsView.html',
    "<div class=\"ibox m-b-none\" ng-controller=\"TmProfileProgramStatsController as TmProfileProgramStatsController\">\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <ng-form name=\"TmProfileProgramStatsController.forms.addProgramStatsForm\" class=\"clearfix\" novalidate autocomplete=\"off\">\n" +
    "\n" +
    "            <div class=\"form-group row\" ng-if=\"!TmProfileProgramStatsController.isSchoolUser\">\n" +
    "                <div class=\"col-md-3\"><label>Program ID</label>  {{programId}}</div>\n" +
    "                <div class=\"col-md-2\"><label>Node ID</label>  {{program.nodeId}}</div>\n" +
    "                <div class=\"col-md-2\"><label>Core ID</label>  {{program.coreId}}</div>\n" +
    "                <div class=\"col-md-2\"><label>Institution Core ID</label>  {{program.institutionCoreId}}</div>\n" +
    "                <div class=\"col-md-3\"><label>Status</label>  {{program.status}}</div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"hr-line-dashed\"></div>\n" +
    "            <div class=\"form-group row\">\n" +
    "                <label class=\"col-sm-2\">Specialisation/s</label>\n" +
    "                <div class=\"col-sm-10\">\n" +
    "                    <ui-select\n" +
    "                        multiple\n" +
    "                        close-on-select=\"false\"\n" +
    "                        ng-model=\"specialisations\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        >\n" +
    "                        <ui-select-match placeholder=\"Select an Option\">{{$item.name}}</ui-select-match>\n" +
    "                        <ui-select-choices \n" +
    "                            refresh-delay=\"1000\"\n" +
    "                            repeat=\"option.handle as option in TmProfileProgramStatsController.specialisationsList | filter:$select.search\">\n" +
    "                            <div ng-bind-html=\"option.name | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"hr-line-dashed\"></div>\n" +
    "\n" +
    "            <div class=\"form-group row\">\n" +
    "                <label class=\"col-sm-2\">Average GMAT score for your cohort</label>\n" +
    "                <div class=\"col-sm-4\">\n" +
    "                    <input type=\"text\" class=\"form-control\" name=\"avgGmat\"\n" +
    "                           ng-model=\"stats.avgGmat\"\n" +
    "                           ng-class=\"{'border-red': !TmProfileProgramStatsController.isValidAverageGmat()}\"\n" +
    "                           ng-focus=\"TmProfileProgramStatsController.setValid('avgGmat', true)\"\n" +
    "                           custom-popover\n" +
    "                           popover-html=\"Enter values between 400-800\"\n" +
    "                           popover-placement=\"bottom\"\n" +
    "                           popover-trigger=\"manual\"\n" +
    "                           popover-visibility=\"{{!TmProfileProgramStatsController.isValidAverageGmat()}}\"\n" +
    "                    >\n" +
    "                </div>\n" +
    "                <label class=\"col-sm-2\">Tuition fee range for the full MBA course (USD)</label>\n" +
    "                <div class=\"col-sm-4\">\n" +
    "                    <ui-select\n" +
    "                        ng-model=\"stats.tuitionRange\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        >\n" +
    "                        <ui-select-match placeholder=\"Select an Option\">{{$select.selected.label}}</ui-select-match>\n" +
    "                        <ui-select-choices \n" +
    "                            refresh-delay=\"1000\"\n" +
    "                            repeat=\"option.value as option in TmProfileProgramStatsController.feesRangesList | filter:$select.search\">\n" +
    "                            <div ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"hr-line-dashed\"></div>\n" +
    "            <div class=\"form-group row\">\n" +
    "                <label class=\"col-sm-2\">Start month/s</label>\n" +
    "                <div class=\"col-sm-4\">\n" +
    "                    <ui-select\n" +
    "                        multiple\n" +
    "                        limit=\"4\"\n" +
    "                        close-on-select=\"false\"\n" +
    "                        ng-model=\"stats.startDates\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        search-enabled=\"true\"\n" +
    "                        >\n" +
    "                        <ui-select-match placeholder=\"Select an Option\">{{$item.label}}</ui-select-match>\n" +
    "                        <ui-select-choices \n" +
    "                            refresh-delay=\"1000\"\n" +
    "                            repeat=\"option.value as option in TmProfileProgramStatsController.monthsList | filter:$select.search\">\n" +
    "                            <div ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "                <label class=\"col-sm-2\">Length of your program in months</label>\n" +
    "                <div class=\"col-sm-4\">\n" +
    "                    <ui-select\n" +
    "                        ng-model=\"stats.programLength\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        search-enabled=\"true\"\n" +
    "                        >\n" +
    "                        <ui-select-match placeholder=\"Select an Option\">{{$select.selected.label}}</ui-select-match>\n" +
    "                        <ui-select-choices \n" +
    "                            refresh-delay=\"1000\"\n" +
    "                            repeat=\"option.value as option in TmProfileProgramStatsController.lengthList | filter:$select.search\">\n" +
    "                            <div ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"hr-line-dashed\"></div>\n" +
    "\n" +
    "            <div class=\"form-group row\">\n" +
    "                <label class=\"col-sm-2\">Accreditation/s</label>\n" +
    "                <div class=\"col-sm-4\">\n" +
    "                    <ui-select\n" +
    "                        multiple\n" +
    "                        limit=\"3\"\n" +
    "                        close-on-select=\"false\"\n" +
    "                        ng-model=\"stats.accreditations\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        search-enabled=\"true\"\n" +
    "                        >\n" +
    "                        <ui-select-match placeholder=\"Select an Option\">{{$item.label}}</ui-select-match>\n" +
    "                        <ui-select-choices \n" +
    "                            refresh-delay=\"1000\"\n" +
    "                            repeat=\"option.value as option in TmProfileProgramStatsController.accreditationsList | filter:$select.search\">\n" +
    "                            <div ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "                <label class=\"col-sm-2\">\n" +
    "                    Number of students on your program (Class size)\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-4\">\n" +
    "                    <input type=\"text\" class=\"form-control\" name=\"classSize\"\n" +
    "                       ng-model=\"stats.classSize\"\n" +
    "                       ng-class=\"{'border-red': !TmProfileProgramStatsController.isValidClassSize()}\"\n" +
    "                       ng-focus=\"TmProfileProgramStatsController.setValid('classSize', true)\"\n" +
    "                       custom-popover\n" +
    "                       popover-html=\"Enter values between 1-2000\"\n" +
    "                       popover-placement=\"bottom\"\n" +
    "                       popover-trigger=\"manual\"\n" +
    "                       popover-visibility=\"{{!TmProfileProgramStatsController.isValidClassSize()}}\"\n" +
    "                    >\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"hr-line-dashed\"></div>\n" +
    "\n" +
    "            <div class=\"form-group row\">\n" +
    "                <label class=\"col-sm-2\">\n" +
    "                    % of International students\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-4\">\n" +
    "                    <ui-select\n" +
    "                        ng-model=\"stats.percentInternationalStudents\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        search-enabled=\"true\"\n" +
    "                        >\n" +
    "                        <ui-select-match placeholder=\"Select an Option\">{{$select.selected.label}}</ui-select-match>\n" +
    "                        <ui-select-choices \n" +
    "                            refresh-delay=\"1000\"\n" +
    "                            repeat=\"option.value as option in TmProfileProgramStatsController.percentList | filter:$select.search\">\n" +
    "                            <div ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "                <label class=\"col-sm-2\">\n" +
    "                    Average age of students in your cohort\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-4\">\n" +
    "                    <ui-select\n" +
    "                        ng-model=\"stats.avgStudentAge\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        search-enabled=\"true\"\n" +
    "                        >\n" +
    "                        <ui-select-match placeholder=\"Select an Option\">{{$select.selected.label}}</ui-select-match>\n" +
    "                        <ui-select-choices \n" +
    "                            refresh-delay=\"1000\"\n" +
    "                            repeat=\"option.value as option in TmProfileProgramStatsController.yearList1850 | filter:$select.search\">\n" +
    "                            <div ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"hr-line-dashed\"></div>\n" +
    "\n" +
    "            <div class=\"form-group row\">\n" +
    "                <label class=\"col-sm-2\">\n" +
    "                    % of women in your cohort\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-4\">\n" +
    "                    <ui-select\n" +
    "                        ng-model=\"stats.percentWomenStudents\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        search-enabled=\"true\"\n" +
    "                        >\n" +
    "                        <ui-select-match placeholder=\"Select an Option\">{{$select.selected.label}}</ui-select-match>\n" +
    "                        <ui-select-choices \n" +
    "                            refresh-delay=\"1000\"\n" +
    "                            repeat=\"option.value as option in TmProfileProgramStatsController.percentList | filter:$select.search\">\n" +
    "                            <div ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "\n" +
    "                <label class=\"col-sm-2\">\n" +
    "                    Average years of work experience\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-4\">\n" +
    "                    <ui-select\n" +
    "                        ng-model=\"stats.avgWorkExperience\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        search-enabled=\"true\"\n" +
    "                        >\n" +
    "                        <ui-select-match placeholder=\"Select an Option\">{{$select.selected.label}}</ui-select-match>\n" +
    "                        <ui-select-choices \n" +
    "                            refresh-delay=\"1000\"\n" +
    "                            repeat=\"option.value as option in TmProfileProgramStatsController.yearList020 | filter:$select.search\">\n" +
    "                            <div ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"hr-line-dashed\"></div>\n" +
    "\n" +
    "            <div class=\"form-group row\">\n" +
    "                <label class=\"col-sm-2\">\n" +
    "                    Average salary 3 months post study (USD)\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-4\">\n" +
    "                    <input type=\"text\" class=\"form-control\" name=\"avgSalaryAfterGraduation\"\n" +
    "                       ng-model=\"stats.avgSalaryAfterGraduation\"\n" +
    "                       ng-class=\"{'border-red': !TmProfileProgramStatsController.isValidAverageSalaryAfterGraduation()}\"\n" +
    "                       ng-focus=\"TmProfileProgramStatsController.setValid('avgSalaryAfterGraduation', true)\"\n" +
    "\n" +
    "                       custom-popover\n" +
    "                       popover-html=\"Enter values between 0-200000\"\n" +
    "                       popover-placement=\"bottom\"\n" +
    "                       popover-trigger=\"manual\"\n" +
    "                       popover-visibility=\"{{!TmProfileProgramStatsController.isValidAverageSalaryAfterGraduation()}}\"\n" +
    "                    >\n" +
    "                </div>\n" +
    "\n" +
    "                <label class=\"col-sm-2\">\n" +
    "                    % employed 3 months post study\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-4\">\n" +
    "                    <ui-select\n" +
    "                        ng-model=\"stats.percentEmploymentAfterGraduation\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        search-enabled=\"true\"\n" +
    "                        >\n" +
    "                        <ui-select-match placeholder=\"Select an Option\">{{$select.selected.label}}</ui-select-match>\n" +
    "                        <ui-select-choices \n" +
    "                            refresh-delay=\"1000\"\n" +
    "                            repeat=\"option.value as option in TmProfileProgramStatsController.percentList | filter:$select.search\">\n" +
    "                            <div ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"hr-line-dashed\"></div>\n" +
    "\n" +
    "            <div class=\"form-group row\">\n" +
    "                <label class=\"col-sm-2\">\n" +
    "                    Do you offer a scholarship/s?\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-4\">\n" +
    "                    <ui-select\n" +
    "                        name=\"scholorship\"\n" +
    "                        ng-model=\"stats.offerScholarships\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        >\n" +
    "                        <ui-select-match placeholder=\"Select an Option\">{{$select.selected.label}}</ui-select-match>\n" +
    "                        <ui-select-choices \n" +
    "                            refresh-delay=\"1000\"\n" +
    "                            repeat=\"option.value as option in TmProfileProgramStatsController.offerScholarshipsList | filter:$select.search\">\n" +
    "                            <div ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"hr-line-dashed\"></div>\n" +
    "\n" +
    "            <div class=\"row\" ng-class=\"{'modal-overlay': TmProfileProgramStatsController.editInProgress}\">\n" +
    "                <div class=\"col-sm-12 text-right\">\n" +
    "                    <a ng-click=\"TmProfileProgramStatsController.handleUpdateClick()\" class=\"btn btn-sm btn-primary\">\n" +
    "                        <i class=\"fa fa-check-circle\"></i> {{TmProfileProgramStatsController.getEditButtonTitle()}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </ng-form>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/programs/datagrid/advancedCellTemplate.html',
    "<div class=\"ui-grid-cell-contents no-select text-center\" ng-click=\"$event.stopPropagation()\">\n" +
    "    <i ng-if=\"row.entity.advanced\" class=\"fa fa-star-o\"></i>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/profiles/tm/programs/datagrid/rowTemplate.html',
    "<div grid=\"grid\">\n" +
    "    <div class=\"ui-grid-cell pointer\"\n" +
    "        ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\"\n" +
    "        ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader, 'active': row.entity.id == grid.appScope.selectedProgramId }\"\n" +
    "        role=\"{{col.isRowHeader ? 'rowheader' : 'gridcell'}}\"\n" +
    "        ui-grid-cell>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/programs/modalDowngradeProgramView.html',
    "<div class=\"modal-header\">\n" +
    "    <h3>{{modalOptions.headerText}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <div ng-show=\"modalOptions.showContent()\">\n" +
    "        <p>\n" +
    "            The advance program currently has an active subscription. The subscription will need to be turned off in order to downgrade.\n" +
    "            If you wish to continue, press the downgrade button and you will be navigated to the backend of the advance profile\n" +
    "        </p>\n" +
    "        <hr>\n" +
    "        <p>\n" +
    "            Advanced TM : from <strong>{{modalOptions.tmSubscription.startDate | date:'short'}}</strong> to <strong>{{modalOptions.tmSubscription.endDate | date:'short'}}</strong>\n" +
    "        </p>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"!modalOptions.showContent()\">\n" +
    "        <p>\n" +
    "            Advanced program does not have an active subscription. Press the downgrade button to downgrade to basic now.\n" +
    "        </p>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" ng-click=\"modalOptions.close()\">\n" +
    "        {{modalOptions.closeButtonText}}\n" +
    "    </button>\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"modalOptions.completeDowngradeClick()\">\n" +
    "        {{modalOptions.showContent() ? 'Downgrade from Backend' : 'Downgrade now'}}\n" +
    "    </button>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/programs/tmProfileAddProgramFormCampusView.html',
    "<div class=\"ibox\">\n" +
    "    <div class=\"ibox-title\">\n" +
    "        <h5>Campuses</h5>\n" +
    "        <div id=\"program-campuses\" class=\"ibox-tools\" expand=\"TmProfileProgramFormController.showCampus()\">\n" +
    "            <a ng-click=\"showHide()\" class=\"collapse-link\">\n" +
    "                <i class=\"fa fa-chevron-down\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"ibox-content pace-inactive p-b-none\">\n" +
    "        <p ng-class=\"{'text-danger': !TmProfileProgramFormController.isValidCampusAssigned()}\">\n" +
    "            <i class=\"fa fa-info-circle\"></i>\n" +
    "            <span>Add at least one campus to this program. Editing a Campus does not require Admin permissions and will also edit the Institution campus.</span>\n" +
    "        </p>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"col-sm-12\">\n" +
    "                <p ng-show=\"TmProfileProgramFormController.programCampuses.length\">\n" +
    "                    <strong>Campuses currently added to the program:</strong>\n" +
    "                </p>\n" +
    "                <ul class=\"list-unstyled list-campus\">\n" +
    "                    <li class=\"clearfix\"\n" +
    "                        ng-repeat=\"campus in TmProfileProgramFormController.programCampuses\"\n" +
    "                        ng-class=\"{'locked': TmProfileProgramFormController.isReadOnly}\">\n" +
    "                        <span>\n" +
    "                            {{campus.name}}\n" +
    "                            <i class=\"fa fa-star\"\n" +
    "                               uib-tooltip='Program primary campus'\n" +
    "                               tooltip-placement=\"top\"\n" +
    "                               ng-show=\"campus.id === TmProfileProgramFormController.program.primaryCampusId\">\n" +
    "                            </i>\n" +
    "                        </span>\n" +
    "                        <a class=\"btn btn-sm btn-outline btn-default pull-right\"\n" +
    "                            ng-click=\"TmProfileProgramFormController.editCampus($index)\">\n" +
    "                            <span>Edit</span>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col-sm-12\">\n" +
    "                <ui-select\n" +
    "                    name=\"campus\"\n" +
    "                    multiple\n" +
    "                    close-on-select=\"false\"\n" +
    "                    ng-required=\"true\"\n" +
    "                    ng-model=\"TmProfileProgramFormController.newProgram.campus\"\n" +
    "                    theme=\"bootstrap\"\n" +
    "                    search-enabled=\"true\"\n" +
    "                    >\n" +
    "                    <ui-select-match placeholder=\"Select an Option\">{{$item.label}}</ui-select-match>\n" +
    "                    <ui-select-choices \n" +
    "                        refresh-delay=\"1000\"\n" +
    "                        repeat=\"option.value as option in TmProfileProgramFormController.campusesList | filter:$select.search\">\n" +
    "                        <div ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                    </ui-select-choices>\n" +
    "                    <ui-select-no-choice>\n" +
    "                        Not found\n" +
    "                    </ui-select-no-choice>\n" +
    "                </ui-select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"separator dashed text-center\">\n" +
    "            <span class=\"text\">OR</span>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"col-sm-12\">\n" +
    "                <a class=\"btn btn-default btn-block\"\n" +
    "                    ng-class=\"{'locked': TmProfileProgramFormController.campusSubmitInProgress}\"\n" +
    "                    ng-click=\"TmProfileProgramFormController.handleAddCampusClick()\">\n" +
    "                    <i class=\"fa fa-plus\"></i>\n" +
    "                    <span>Create new campus</span>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"TmProfileProgramFormController.isCampusFormVisible()\">\n" +
    "            <div ng-include src=\"'/scripts/components/profiles/tm/programs/tmProfileProgramsAddCampusFormView.html'\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"TmProfileProgramFormController.isEditCampusFormVisible()\">\n" +
    "            <div ng-include src=\"'/scripts/components/profiles/tm/programs/tmProfileProgramsEditCampusFormView.html'\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/profiles/tm/programs/tmProfileAddProgramFormDetailsView.html',
    "<div class=\"ibox\">\n" +
    "    <div class=\"ibox-title\">\n" +
    "        <h5>Program Details</h5>\n" +
    "        <div id=\"program-details\" class=\"ibox-tools\" expand=\"TmProfileProgramFormController.showDetails()\">\n" +
    "            <a ng-click=\"showHide()\" class=\"collapse-link\">\n" +
    "                <i class=\"fa fa-chevron-up\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <ng-form name=\"TmProfileProgramFormController.forms.addProgramDetailsForm\" novalidate autocomplete=\"off\">\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors': !TmProfileProgramFormController.isValidName()}\">\n" +
    "                 <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "                  <span>Program Name *</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <input type=\"text\"\n" +
    "                      name=\"name\"\n" +
    "                      placeholder=\"e.g. ESSEC Mannheim Executive MBA\"\n" +
    "                      ng-model=\"TmProfileProgramFormController.newProgram.name\"\n" +
    "                      class=\"form-control\"\n" +
    "                      ng-required=\"true\"\n" +
    "                      ng-class=\"isInvalidName ? 'border-red' : ''\"\n" +
    "                      ng-focus=\"TmProfileProgramFormController.setValid('name')\"\n" +
    "                      focus-delay=\"250\"\n" +
    "                      custom-popover popover-html=\"Add a program title\"\n" +
    "                      popover-placement=\"left\"\n" +
    "                      popover-trigger=\"manual\"\n" +
    "                      popover-visibility=\"{{!TmProfileProgramFormController.isValidName()}}\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors': !TmProfileProgramFormController.isValidType()}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "                  <span>Program Type *</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <ui-select\n" +
    "                        name=\"type\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.newProgram.type\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        focus-delay=\"250\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        custom-popover popover-html=\"Select an option\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{!TmProfileProgramFormController.isValidType()}}\"\n" +
    "                        on-select=\"TmProfileProgramFormController.setValid('type')\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$select.selected.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.typesList | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group row\" ng-class=\"{'has-errors': !TmProfileProgramFormController.isValidDescription()}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "                  <span>Program Description *</span>\n" +
    "                  <small class=\"pull-left\">Max {{TmProfileProgramFormController.programDescriptionWordLimit}} words</small>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                  <textarea class=\"form-control no-resize\" rows=\"7\" cols=\"50\"\n" +
    "                        name=\"description\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        placeholder=\"e.g. The program X provides a unique opportunity to study and live in…\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.newProgram.description\"\n" +
    "                        ng-focus=\"TmProfileProgramFormController.setValid('description')\"\n" +
    "                        custom-popover popover-html=\"Add a program description\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{!TmProfileProgramFormController.isValidDescription()}}\">\n" +
    "                    </textarea>\n" +
    "                    <p class=\"text-right\" ng-show=\"newProgram.description.length >= programDescriptionWordLimit\">\n" +
    "                        <span class=\"text-danger\">Reached maximum words limit</span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-show=\"TmProfileProgramFormController.isSchoolUser\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "                  <span>Comments</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                  <textarea class=\"form-control no-resize\" rows=\"4\" cols=\"50\"\n" +
    "                    name=\"comments\"\n" +
    "                    placeholder=\"Please add comments supporting your request\"\n" +
    "                    ng-model=\"TmProfileProgramFormController.newProgram.comments\">\n" +
    "                  </textarea>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </ng-form>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/programs/tmProfileAddProgramFormStatisticsView.html',
    "<div class=\"ibox\">\n" +
    "    <div class=\"ibox-title\">\n" +
    "        <h5>Program Statistics</h5>\n" +
    "        <div id=\"program-stats\" class=\"ibox-tools\" expand=\"TmProfileProgramFormController.showStatistics()\">\n" +
    "            <a ng-click=\"showHide()\" class=\"collapse-link\">\n" +
    "                <i class=\"fa fa-chevron-down\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"ibox-content pace-inactive\">\n" +
    "        <ng-form name=\"TmProfileProgramFormController.forms.addProgramStatsForm\" novalidate autocomplete=\"off\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <span>Specialisation/s</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                            multiple\n" +
    "                            close-on-select=\"false\"\n" +
    "                            ng-model=\"TmProfileProgramFormController.newProgram.specialisations\"\n" +
    "                            theme=\"bootstrap\"\n" +
    "                            >\n" +
    "                        <ui-select-match placeholder=\"Select an Option\">{{$item.name}}</ui-select-match>\n" +
    "                        <ui-select-choices refresh-delay=\"1000\"\n" +
    "                            repeat=\"option.handle as option in TmProfileProgramFormController.specialisationsList | filter:$select.search\">\n" +
    "                            <div ng-bind-html=\"option.name | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors': !TmProfileProgramFormController.isValidAverageGmat()}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <span>Average GMAT score for your cohort</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <input type=\"text\"\n" +
    "                        class=\"form-control\"\n" +
    "                        name=\"avgGmat\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.newProgram.stats.avgGmat\"\n" +
    "\n" +
    "                        ng-focus=\"TmProfileProgramFormController.setValid('avgGmat', true)\"\n" +
    "                        custom-popover\n" +
    "                        popover-html=\"Enter values between 400-800\"\n" +
    "                        popover-placement=\"bottom\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{!TmProfileProgramFormController.isValidAverageGmat()}}\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <span>Tuition fee range for the full MBA course (USD)</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                        placeholder=\"Select an option\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.newProgram.stats.tuitionRange\"\n" +
    "                        theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\">\n" +
    "                            <span>{{$select.selected.label}}</span>\n" +
    "                        </ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.feesRangesList | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <span>Start month/s</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                        multiple\n" +
    "                        close-on-select=\"false\"\n" +
    "                        limit= \"4\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.newProgram.stats.startDates\"\n" +
    "                        theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$item.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.monthsList | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <span>Length of your program in months</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                        placeholder=\"Select an option\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.newProgram.stats.programLength\"\n" +
    "                        theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$select.selected.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.lengthList | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <span>Accreditation/s</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                        multiple\n" +
    "                        close-on-select=\"false\"\n" +
    "                        limit= \"3\",\n" +
    "                        ng-model=\"TmProfileProgramFormController.newProgram.stats.accreditations\"\n" +
    "                        theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$item.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.accreditationsList | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors': !TmProfileProgramFormController.isValidClassSize()}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <span>Number of students on your program (Class size)</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <input type=\"text\"\n" +
    "                        class=\"form-control\"\n" +
    "                        name=\"classSize\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.newProgram.stats.classSize\"\n" +
    "                        ng-focus=\"TmProfileProgramFormController.setValid('classSize', true)\"\n" +
    "                        custom-popover\n" +
    "                        popover-html=\"Enter values between 1-2000\"\n" +
    "                        popover-placement=\"bottom\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{!TmProfileProgramFormController.isValidClassSize()}}\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <span>% of International students</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                        ng-model=\"TmProfileProgramFormController.newProgram.stats.percentInternationalStudents\"\n" +
    "                        theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$select.selected.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.percentList | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <span>Average age of students in your cohort</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                        ng-model=\"TmProfileProgramFormController.newProgram.stats.avgStudentAge\"\n" +
    "                        theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$select.selected.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.yearList1850 | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <span>% of women in your cohort</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                        placeholder=\"Select an option\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.newProgram.stats.percentWomenStudents\"\n" +
    "                        theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$select.selected.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.percentList | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <span>Average years of work experience</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                        ng-model=\"TmProfileProgramFormController.newProgram.stats.avgWorkExperience\"\n" +
    "                        theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$select.selected.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.yearList020 | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <span>Do you offer a scholarship/s?</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                        name=\"scholorship\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.newProgram.stats.offerScholarships\"\n" +
    "                        theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$select.selected.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.offerScholarshipsList | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors': !TmProfileProgramFormController.isValidAverageSalaryAfterGraduation()}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <span>Average salary 3 months post study (USD)</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <input type=\"number\"\n" +
    "                        class=\"form-control\"\n" +
    "                        name=\"avgSalaryAfterGraduation\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.newProgram.stats.avgSalaryAfterGraduation\"\n" +
    "                        ng-focus=\"TmProfileProgramFormController.setValid('avgSalaryAfterGraduation', true)\"\n" +
    "                        custom-popover\n" +
    "                        popover-html=\"Enter values between 0-200000\"\n" +
    "                        popover-placement=\"bottom\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{!TmProfileProgramFormController.isValidAverageSalaryAfterGraduation()}}\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <span>% employed 3 months post study</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                        ng-model=\"TmProfileProgramFormController.newProgram.stats.percentEmploymentAfterGraduation\"\n" +
    "                        theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$select.selected.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.percentList | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </ng-form>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/profiles/tm/programs/tmProfileAddProgramFormView.html',
    "<div class=\"ibox\">\n" +
    "    <div class=\"ibox-title m-t-xl\">\n" +
    "        <h5>{{TmProfileProgramFormController.isSchoolUser ? 'Request to Add a Program' : 'Add Program'}}</h5>\n" +
    "        <div class=\"ibox-tools\">\n" +
    "            <a class=\"close-link\" ng-click=\"TmProfileProgramFormController.closeAddProgramForm()\">\n" +
    "                <i class=\"fa fa-times\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"ibox-content\">        \n" +
    "        <form class=\"form-horizontal\" name=\"forms.addProgramForm\" novalidate autocomplete=\"off\">\n" +
    "            <div ng-include src=\"'/scripts/components/profiles/tm/programs/tmProfileAddProgramFormDetailsView.html'\"></div>\n" +
    "            <div ng-include src=\"'/scripts/components/profiles/tm/programs/tmProfileAddProgramFormStatisticsView.html'\"></div>\n" +
    "            <div ng-include src=\"'/scripts/components/profiles/tm/programs/tmProfileAddProgramFormCampusView.html'\"></div>\n" +
    "            <div class=\"hr-line-dashed\"></div>\n" +
    "            <div class=\"form-group\" ng-class=\"{'locked': TmProfileProgramFormController.isProgramSubmitDisabled()}\">\n" +
    "                <div class=\"col-sm-12\">\n" +
    "                    <a class=\"btn btn-primary pull-right\"\n" +
    "                       ng-click=\"TmProfileProgramFormController.handleProgramCreateClick()\">\n" +
    "                        <i class=\"fa fa-check-circle\"></i>\n" +
    "                        <span>{{TmProfileProgramFormController.isSchoolUser ? 'Send' : 'Save'}}</span>\n" +
    "                    </a>\n" +
    "                    <a class=\"btn btn-default pull-right\" ng-click=\"TmProfileProgramFormController.closeAddProgramForm()\">\n" +
    "                        <i class=\"fa fa-ban\"></i>\n" +
    "                        <span>Cancel</span>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/programs/tmProfileEditProgramFormCampusView.html',
    "<div class=\"ibox\">\n" +
    "    <div class=\"ibox-title\">\n" +
    "        <h5>Campuses</h5>\n" +
    "        <div id=\"program-campuses\" class=\"ibox-tools\" expand=\"TmProfileProgramFormController.showCampus()\">\n" +
    "            <a ng-click=\"showHide()\" class=\"collapse-link\">\n" +
    "                <i class=\"fa fa-chevron-down\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"ibox-content pace-inactive p-b-none\">\n" +
    "        <p ng-class=\"{'text-danger': !TmProfileProgramFormController.isValidCampusAssigned()}\">\n" +
    "            <i class=\"fa fa-info-circle\"></i>\n" +
    "            <span>Add at least one campus to this program. Editing a Campus does not require Admin permissions and will also edit the Institution campus.</span>\n" +
    "        </p>\n" +
    "\n" +
    "        <div ng-class=\"{'modal-overlay-35': TmProfileProgramFormController.campusSubmitInProgress || TmProfileProgramFormController.isReadOnly}\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-sm-12\">\n" +
    "                    <p ng-show=\"TmProfileProgramFormController.programCampuses.length\">\n" +
    "                        <strong>Campuses currently added to the program:</strong>\n" +
    "                    </p>\n" +
    "                    <ul class=\"list-unstyled list-campus\">\n" +
    "                        <li class=\"clearfix\"\n" +
    "                            ng-repeat=\"campus in TmProfileProgramFormController.programCampuses\">\n" +
    "                        <span>\n" +
    "                            {{campus.name}}\n" +
    "                            <i class=\"fa fa-star\"\n" +
    "                               uib-tooltip='Program primary campus'\n" +
    "                               tooltip-placement=\"top\"\n" +
    "                               ng-show=\"campus.id === TmProfileProgramFormController.program.primaryCampusId\">\n" +
    "                            </i>\n" +
    "                        </span>\n" +
    "                            <a class=\"btn btn-sm btn-outline btn-default pull-right\"\n" +
    "                               ng-click=\"TmProfileProgramFormController.editCampus($index)\">\n" +
    "                                <span>Edit</span>\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"col-sm-12\">\n" +
    "                    <ui-select\n" +
    "                        name=\"campus\"\n" +
    "                        multiple\n" +
    "                        ng-required=\"true\"\n" +
    "                        ng-disabled=\"TmProfileProgramFormController.isReadOnly\"\n" +
    "                        close-on-select=\"false\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.program.campus\"\n" +
    "                        focus-delay=\"250\"\n" +
    "                        theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\">\n" +
    "                            <span>{{$item.label}}</span>\n" +
    "                        </ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                            position=\"down\"\n" +
    "                            name=\"campus\"\n" +
    "                            repeat=\"option.value as option in TmProfileProgramFormController.campusesList | filter: $select.search\">\n" +
    "                            <div ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"separator dashed text-center\">\n" +
    "                <span class=\"text\">OR</span>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-sm-12\">\n" +
    "                    <a class=\"btn btn-default btn-block\"\n" +
    "                       ng-click=\"TmProfileProgramFormController.handleAddCampusClick()\">\n" +
    "                        <i class=\"fa fa-plus\"></i>\n" +
    "                        <span>Create new campus</span>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <div ng-show=\"TmProfileProgramFormController.isCampusFormVisible()\">\n" +
    "            <div ng-include src=\"'/scripts/components/profiles/tm/programs/tmProfileProgramsAddCampusFormView.html'\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"TmProfileProgramFormController.isEditCampusFormVisible()\">\n" +
    "            <div ng-include src=\"'/scripts/components/profiles/tm/programs/tmProfileProgramsEditCampusFormView.html'\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/profiles/tm/programs/tmProfileEditProgramFormDetailsView.html',
    "<div class=\"ibox\">\n" +
    "    <div class=\"ibox-title\">\n" +
    "        <h5>Program Details</h5>\n" +
    "        <div id=\"program-details\" class=\"ibox-tools\" expand=\"TmProfileProgramFormController.showDetails()\">\n" +
    "            <a ng-click=\"showHide()\" class=\"collapse-link\">\n" +
    "                <i class=\"fa fa-chevron-up\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <ng-form name=\"TmProfileProgramFormController.forms.editProgramDetailsForm\" novalidate autocomplete=\"off\">\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors': !TmProfileProgramFormController.isValidName()}\">\n" +
    "                <label class=\"control-label col-sm-5  col-md-4\">\n" +
    "                    <i ng-if=\"TmProfileProgramFormController.programHistory.name\"\n" +
    "                       class=\"fa fa-info-circle cursor-default\"\n" +
    "                       uib-tooltip='{{TmProfileProgramFormController.programHistory.name}}'\n" +
    "                       tooltip-placement=\"left\">\n" +
    "                    </i>\n" +
    "                    <span>Program Name *</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <input type=\"text\"\n" +
    "                       name=\"name\"\n" +
    "                       class=\"form-control\"\n" +
    "                       placeholder=\"e.g. ESSEC Mannheim Executive MBA\"\n" +
    "                       ng-model=\"TmProfileProgramFormController.program.name\"\n" +
    "                       ng-disabled=\"TmProfileProgramFormController.isReadOnly\"\n" +
    "                       ng-required=\"true\"\n" +
    "                       ng-class=\"isInvalidName ? 'border-red' : ''\"\n" +
    "                       ng-focus=\"TmProfileProgramFormController.setValid('name')\"\n" +
    "                       focus-delay=\"250\"\n" +
    "                       custom-popover popover-html=\"Add a program title\"\n" +
    "                       popover-placement=\"left\"\n" +
    "                       popover-trigger=\"manual\"\n" +
    "                       popover-visibility=\"{{!TmProfileProgramFormController.isValidName()}}\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors': !TmProfileProgramFormController.isValidType()}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "                    <i ng-if=\"TmProfileProgramFormController.programHistory.type\"\n" +
    "                       class=\"fa fa-info-circle cursor-default\"\n" +
    "                       uib-tooltip='{{TmProfileProgramFormController.programHistory.type}}'\n" +
    "                       tooltip-placement=\"left\">\n" +
    "                    </i>\n" +
    "                    <span>Program Type *</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <ui-select\n" +
    "                        name=\"type\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.program.type\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        focus-delay=\"250\"\n" +
    "                        custom-popover popover-html=\"Select an option\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{!TmProfileProgramFormController.isValidType()}}\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$select.selected.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.typesList | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors': !TmProfileProgramFormController.isValidDescription()}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "                    <i ng-if=\"TmProfileProgramFormController.programHistory.description\"\n" +
    "                       class=\"fa fa-info-circle cursor-default\"\n" +
    "                       uib-tooltip='{{TmProfileProgramFormController.programHistory.description}}'\n" +
    "                       tooltip-placement=\"left\">\n" +
    "                    </i>\n" +
    "                    <span>Program Description *</span>\n" +
    "                    <small>Max {{TmProfileProgramFormController.programDescriptionWordLimit}} words</small>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                  <textarea class=\"form-control no-resize\" rows=\"7\" cols=\"50\"\n" +
    "                        name=\"description\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        placeholder=\"e.g. The program X provides a unique opportunity to study and live in…\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.program.description\"\n" +
    "                        ng-disabled=\"TmProfileProgramFormController.isReadOnly\"\n" +
    "                        ng-focus=\"TmProfileProgramFormController.setValid('description')\"\n" +
    "                        custom-popover popover-html=\"Add a program description\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{!TmProfileProgramFormController.isValidDescription()}}\">\n" +
    "                    </textarea>\n" +
    "                  <p class=\"text-right\" ng-show=\"program.description.length >= programDescriptionWordLimit\">\n" +
    "                    <span class=\"text-danger\">Reached maximum words limit</span>\n" +
    "                  </p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\" ng-show=\"(TmProfileProgramFormController.isSchoolUser) || (TmProfileProgramFormController.isDirectory)\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "                    <i class=\"fa fa-info-circle cursor-default\"\n" +
    "                      ng-if=\"TmProfileProgramFormController.programHistory.comments\"\n" +
    "                      uib-tooltip='{{TmProfileProgramFormController.programHistory.comments}}'\n" +
    "                      tooltip-placement=\"left\">\n" +
    "                    </i>\n" +
    "                    <span>Comments</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                  <textarea class=\"form-control no-resize\" rows=\"4\" cols=\"50\"\n" +
    "                        placeholder=\"Please add comments supporting your request\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.program.comments\"\n" +
    "                        ng-disabled=\"TmProfileProgramFormController.isReadOnly || TmProfileProgramFormController.isDirectory\">\n" +
    "                    </textarea>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </ng-form>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/profiles/tm/programs/tmProfileEditProgramFormStatisticsView.html',
    "<div class=\"ibox\">\n" +
    "    <div class=\"ibox-title\">\n" +
    "        <h5>Program Statistics</h5>\n" +
    "        <div id=\"program-stats\" class=\"ibox-tools\" expand=\"TmProfileProgramFormController.showStatistics()\">\n" +
    "            <a ng-click=\"showHide()\" class=\"collapse-link\">\n" +
    "                <i class=\"fa fa-chevron-down\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"ibox-content pace-inactive\">\n" +
    "        <ng-form name=\"TmProfileProgramFormController.forms.editProgramStatsForm\" novalidate autocomplete=\"off\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <i class=\"fa fa-info-circle\"\n" +
    "                        ng-if=\"TmProfileProgramFormController.programHistory.specialisations\"\n" +
    "                        uib-tooltip='{{TmProfileProgramFormController.programHistory.specialisations}}'\n" +
    "                        tooltip-placement=\"left\">\n" +
    "                    </i>\n" +
    "                    <span>Specialisation/s</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                    ng-disabled=\"TmProfileProgramFormController.isReadOnly\"\n" +
    "                    multiple\n" +
    "                    close-on-select=\"false\"\n" +
    "                    ng-model=\"TmProfileProgramFormController.program.specialisations\"\n" +
    "                    theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an Option\">{{$item.name}}</ui-select-match>\n" +
    "                        <ui-select-choices refresh-delay=\"1000\"\n" +
    "                                        repeat=\"option.handle as option in TmProfileProgramFormController.specialisationsList | filter:$select.search\">\n" +
    "                            <div ng-bind-html=\"option.name | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors': !TmProfileProgramFormController.isValidAverageGmat()}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <i class=\"fa fa-info-circle\"\n" +
    "                        ng-if=\"TmProfileProgramFormController.programHistory.stats.avgGmat\"\n" +
    "                        uib-tooltip='{{TmProfileProgramFormController.programHistory.stats.avgGmat}}'\n" +
    "                        tooltip-placement=\"left\">\n" +
    "                    </i>\n" +
    "                    <span>Average GMAT score for your cohort</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <input type=\"text\"\n" +
    "                        class=\"form-control\"\n" +
    "                        name=\"avgGmat\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.program.stats.avgGmat\"\n" +
    "                        ng-focus=\"TmProfileProgramFormController.setValid('avgGmat', true)\"\n" +
    "                        ng-disabled=\"TmProfileProgramFormController.isReadOnly\"\n" +
    "                        custom-popover\n" +
    "                        popover-html=\"Enter values between 400-800\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{!TmProfileProgramFormController.isValidAverageGmat()}}\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <i class=\"fa fa-info-circle\"\n" +
    "                        ng-if=\"TmProfileProgramFormController.programHistory.stats.tuitionRange\"\n" +
    "                        uib-tooltip='{{TmProfileProgramFormController.programHistory.stats.tuitionRange}}'\n" +
    "                        tooltip-placement=\"left\">\n" +
    "                    </i>\n" +
    "                    <span>Tuition fee range for the full MBA course (USD)</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                    ng-disabled=\"TmProfileProgramFormController.isReadOnly\"\n" +
    "                    ng-model=\"TmProfileProgramFormController.program.stats.tuitionRange\"\n" +
    "                    theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$select.selected.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.feesRangesList | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <i class=\"fa fa-info-circle\"\n" +
    "                        ng-if=\"TmProfileProgramFormController.programHistory.stats.startDates\"\n" +
    "                        uib-tooltip='{{TmProfileProgramFormController.programHistory.stats.startDates}}'\n" +
    "                        tooltip-placement=\"left\">\n" +
    "                    </i>\n" +
    "                    <span>Start month/s</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                        multiple\n" +
    "                        close-on-select=\"false\"\n" +
    "                        ng-disabled=\"TmProfileProgramFormController.isReadOnly\"\n" +
    "                        limit= \"4\",\n" +
    "                        ng-model=\"TmProfileProgramFormController.program.stats.startDates\"\n" +
    "                        theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$item.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.monthsList | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <i class=\"fa fa-info-circle\"\n" +
    "                        ng-if=\"TmProfileProgramFormController.programHistory.stats.programLength\"\n" +
    "                        uib-tooltip='{{TmProfileProgramFormController.programHistory.stats.programLength}}'\n" +
    "                        tooltip-placement=\"left\">\n" +
    "                    </i>\n" +
    "                    <span>Length of your program in months</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                        ng-disabled=\"TmProfileProgramFormController.isReadOnly\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.program.stats.programLength\"\n" +
    "                        theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$select.selected.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.lengthList | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <i class=\"fa fa-info-circle\"\n" +
    "                        ng-if=\"TmProfileProgramFormController.programHistory.stats.accreditations\"\n" +
    "                        uib-tooltip='{{TmProfileProgramFormController.programHistory.stats.accreditations}}'\n" +
    "                        tooltip-placement=\"left\">\n" +
    "                    </i>\n" +
    "                    <span>Accreditation/s</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                        multiple\n" +
    "                        ng-disabled=\"TmProfileProgramFormController.isReadOnly\"\n" +
    "                        close-on-select=\"false\"\n" +
    "                        limit=\"3\",\n" +
    "                        ng-model=\"TmProfileProgramFormController.program.stats.accreditations\"\n" +
    "                        theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$item.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.accreditationsList | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors': !TmProfileProgramFormController.isValidClassSize()}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <i class=\"fa fa-info-circle\"\n" +
    "                        ng-if=\"TmProfileProgramFormController.programHistory.stats.classSize\"\n" +
    "                        uib-tooltip='{{TmProfileProgramFormController.programHistory.stats.classSize}}'\n" +
    "                        tooltip-placement=\"left\">\n" +
    "                    </i>\n" +
    "                    <span>Number of students on your program (Class size)</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <input type=\"text\"\n" +
    "                        class=\"form-control\"\n" +
    "                        name=\"classSize\"\n" +
    "                        ng-disabled=\"TmProfileProgramFormController.isReadOnly\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.program.stats.classSize\"\n" +
    "                        ng-focus=\"TmProfileProgramFormController.setValid('classSize', true)\"\n" +
    "                        custom-popover\n" +
    "                        popover-html=\"Enter values between 1-2000\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{!TmProfileProgramFormController.isValidClassSize()}}\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <i class=\"fa fa-info-circle\"\n" +
    "                        ng-if=\"TmProfileProgramFormController.programHistory.stats.percentInternationalStudents\"\n" +
    "                        uib-tooltip='{{TmProfileProgramFormController.programHistory.stats.percentInternationalStudents}} %'\n" +
    "                        tooltip-placement=\"left\">\n" +
    "                    </i>\n" +
    "                    <span>% of International students</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                    ng-disabled=\"TmProfileProgramFormController.isReadOnly\"\n" +
    "                    ng-model=\"TmProfileProgramFormController.program.stats.percentInternationalStudents\"\n" +
    "                    theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$select.selected.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.percentList | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <i class=\"fa fa-info-circle\"\n" +
    "                        ng-if=\"TmProfileProgramFormController.programHistory.stats.avgStudentAge\"\n" +
    "                        uib-tooltip='{{TmProfileProgramFormController.programHistory.stats.avgStudentAge}} years'\n" +
    "                        tooltip-placement=\"left\">\n" +
    "                    </i>\n" +
    "                    <span>Average age of students in your cohort</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                        ng-disabled=\"TmProfileProgramFormController.isReadOnly\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.program.stats.avgStudentAge\"\n" +
    "                        theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$select.selected.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.yearList1850 | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <i class=\"fa fa-info-circle\"\n" +
    "                        ng-if=\"TmProfileProgramFormController.programHistory.stats.percentWomenStudents\"\n" +
    "                        uib-tooltip='{{TmProfileProgramFormController.programHistory.stats.percentWomenStudents}} %'\n" +
    "                        tooltip-placement=\"left\">\n" +
    "                    </i>\n" +
    "                    <span>% of women in your cohort</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                        ng-model=\"TmProfileProgramFormController.program.stats.percentWomenStudents\"\n" +
    "                        ng-disabled=\"TmProfileProgramFormController.isReadOnly\"\n" +
    "                        theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$select.selected.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.percentList | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <i class=\"fa fa-info-circle\"\n" +
    "                        ng-if=\"TmProfileProgramFormController.programHistory.stats.avgWorkExperience\"\n" +
    "                        uib-tooltip='{{TmProfileProgramFormController.programHistory.stats.avgWorkExperience}} years'\n" +
    "                        tooltip-placement=\"left\">\n" +
    "                    </i>\n" +
    "                    <span>Average years of work experience</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                        ng-disabled=\"TmProfileProgramFormController.isReadOnly\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.program.stats.avgWorkExperience\"\n" +
    "                        theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$select.selected.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.yearList020 | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <i class=\"fa fa-info-circle\"\n" +
    "                        ng-if=\"!TmProfileProgramFormController.isUndefined(TmProfileProgramFormController.programHistory.stats.offerScholarships)\"\n" +
    "                        uib-tooltip='{{TmProfileProgramFormController.programHistory.stats.offerScholarships ? \"Yes\" : \"No\"}}'\n" +
    "                        tooltip-placement=\"left\">\n" +
    "                    </i>\n" +
    "                    <span>Do you offer a scholarship/s?</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                        ng-disabled=\"TmProfileProgramFormController.isReadOnly\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.program.stats.offerScholarships\"\n" +
    "                        theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$select.selected.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.offerScholarshipsList | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors': !TmProfileProgramFormController.isValidAverageSalaryAfterGraduation()}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <i class=\"fa fa-info-circle\"\n" +
    "                        ng-if=\"TmProfileProgramFormController.programHistory.stats.avgSalaryAfterGraduation\"\n" +
    "                        uib-tooltip='{{TmProfileProgramFormController.programHistory.stats.avgSalaryAfterGraduation}}'\n" +
    "                        tooltip-placement=\"left\">\n" +
    "                    </i>\n" +
    "                    <span>Average salary 3 months post study (USD)</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <input type=\"number\"\n" +
    "                        class=\"form-control\"\n" +
    "                        name=\"avgSalaryAfterGraduation\"\n" +
    "                        ng-model=\"TmProfileProgramFormController.program.stats.avgSalaryAfterGraduation\"\n" +
    "                        ng-disabled=\"TmProfileProgramFormController.isReadOnly\"\n" +
    "                        ng-focus=\"TmProfileProgramFormController.setValid('avgSalaryAfterGraduation', true)\"\n" +
    "                        custom-popover\n" +
    "                        popover-html=\"Enter values between 0-200000\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{!TmProfileProgramFormController.isValidAverageSalaryAfterGraduation()}}\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-5\">\n" +
    "                    <i class=\"fa fa-info-circle\"\n" +
    "                        ng-if=\"TmProfileProgramFormController.programHistory.stats.percentEmploymentAfterGraduation\"\n" +
    "                        uib-tooltip='{{TmProfileProgramFormController.programHistory.stats.percentEmploymentAfterGraduation}} %'\n" +
    "                        tooltip-placement=\"left\">\n" +
    "                    </i>\n" +
    "                    <span>% employed 3 months post study</span>\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-7\">\n" +
    "                    <ui-select\n" +
    "                        ng-model=\"TmProfileProgramFormController.program.stats.percentEmploymentAfterGraduation\"\n" +
    "                        ng-disabled=\"TmProfileProgramFormController.isReadOnly\"\n" +
    "                        theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\"><span>{{$select.selected.label}}</span></ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.value as option in TmProfileProgramFormController.percentList | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.label | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </ng-form>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/profiles/tm/programs/tmProfileEditProgramFormView.html',
    "<div class=\"ibox\">\n" +
    "    <div class=\"ibox-title m-t-xl\">\n" +
    "        <h5 ng-show=\"showEdiProgramForm\">{{TmProfileProgramFormController.getEditTitle()}}</h5>\n" +
    "        <h5 ng-show=\"showSubscriptionForm\">{{TmProfileProgramFormController.getSubscriptionTitle()}}</h5>\n" +
    "        <div class=\"ibox-tools\">\n" +
    "            <a ng-click=\"TmProfileProgramFormController.closeEditProgramForm()\">\n" +
    "                <i class=\"fa fa-times\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <div ng-show=\"showEdiProgramForm\">\n" +
    "            <form class=\"form-horizontal\" name=\"forms.editProgramForm\" novalidate autocomplete=\"off\">\n" +
    "                <div class=\"alert alert-info\" ng-if=\"TmProfileProgramFormController.allowDowngrade()\">\n" +
    "                    <i class=\"fa fa-info-circle\"></i>\n" +
    "                    <span>Login as Program to edit Advanced Program</span>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\"\n" +
    "                    ng-if=\"TmProfileProgramFormController.allowUpgrade()\">\n" +
    "                    <div class=\"col-sm-12\">\n" +
    "                        <a class=\"btn btn-warning btn-block\"\n" +
    "                            ng-click=\"TmProfileProgramFormController.handleUpgradeClick()\">\n" +
    "                            <i class=\"fa fa-star\"></i>\n" +
    "                            <span>{{TmProfileProgramFormController.getUpgradeButtonTitle()}}</span>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-include src=\"'/scripts/components/profiles/tm/programs/tmProfileEditProgramFormDetailsView.html'\"></div>\n" +
    "                <div ng-include src=\"'/scripts/components/profiles/tm/programs/tmProfileEditProgramFormStatisticsView.html'\"></div>\n" +
    "                <div ng-show=\"!TmProfileProgramFormController.isProgramAdvanced\" ng-include src=\"'/scripts/components/profiles/tm/programs/tmProfileEditProgramFormCampusView.html'\"></div>\n" +
    "\n" +
    "\n" +
    "                <div class=\"separator\"></div>\n" +
    "\n" +
    "                <div class=\"form-group\" ng-class=\"{'locked': TmProfileProgramFormController.isProgramSubmitDisabled()}\">\n" +
    "                    <div class=\"col-sm-12\">\n" +
    "                        <a class=\"btn btn-primary pull-right\" ng-if=\"TmProfileProgramFormController.allowUpdate()\" ng-click=\"TmProfileProgramFormController.handleProgramEditClick()\">\n" +
    "                            <i class=\"fa fa-check-circle\"></i>\n" +
    "                            <span>{{TmProfileProgramFormController.getEditButtonTitle()}}</span>\n" +
    "                        </a>\n" +
    "\n" +
    "                        <a class=\"btn btn-default pull-right\" ng-click=\"TmProfileProgramFormController.closeEditProgramForm()\">\n" +
    "                            <i class=\"fa fa-ban\"></i>\n" +
    "                            <span>Cancel</span>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"separator\"></div>\n" +
    "\n" +
    "                <div class=\"form-group\" ng-if=\"TmProfileProgramFormController.allowLoginAs()\">\n" +
    "                    <div class=\"col-sm-12\">\n" +
    "                        <a class=\"btn btn-default btn-block\"\n" +
    "                            ng-class=\"{'disabled': !TmProfileProgramFormController.isAllowedToLogin()}\"\n" +
    "                            ng-click=\"TmProfileProgramFormController.isAllowedToLogin() && TmProfileProgramFormController.handleLoginAsClick()\"\n" +
    "\n" +
    "                            uib-tooltip='Login has been disabled due to permission. Contact {{TmProfileProgramFormController.tmSupportEmail}}'\n" +
    "                            tooltip-enable=\"!TmProfileProgramFormController.isAllowedToLogin()\"\n" +
    "                            tooltip-placement=\"left\">\n" +
    "                            <i class=\"fa fa-sign-in\"></i>\n" +
    "                            <span>Login as Program</span>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\"\n" +
    "                   ng-if=\"TmProfileProgramFormController.allowDowngrade()\"\n" +
    "                    ng-class=\"{'locked': TmProfileProgramFormController.downgradeInProgress}\">\n" +
    "                    <div class=\"col-sm-12\">\n" +
    "                        <a class=\"btn btn-danger btn-block\"\n" +
    "                            ng-click=\"TmProfileProgramFormController.handleDowngradeClick()\">\n" +
    "                            <i class=\"fa fa-arrow-circle-o-down\"></i>\n" +
    "                            <span>Downgrade to simple program</span>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\"\n" +
    "                    ng-if=\"TmProfileProgramFormController.allowDelete()\"\n" +
    "                    ng-class=\"{'locked': TmProfileProgramFormController.deleteInProgress}\">\n" +
    "                        <div class=\"col-sm-12\">\n" +
    "                            <a class=\"btn btn-danger btn-block\"\n" +
    "                                ng-click=\"TmProfileProgramFormController.handleDeleteClick()\">\n" +
    "                                <i class=\"fa fa-arrow-circle-o-down\"></i>\n" +
    "                                <span>{{TmProfileProgramFormController.getDeleteButtonTitle()}}</span>\n" +
    "                            </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </form>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"showSubscriptionForm\">\n" +
    "            <div ng-include src=\"'/scripts/components/profiles/tm/programs/tmProfileProgramAddSubscriptionView.html'\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/profiles/tm/programs/tmProfileProgramAddSubscriptionView.html',
    "<form class=\"form-horizontal\" name=\"TmProfileProgramFormController.forms.subscriptionForm\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"col-sm-12\">\n" +
    "            <span date-range-picker\n" +
    "                class=\"btn btn-default btn-block\"\n" +
    "                type=\"text\"\n" +
    "                ng-model=\"datePickerTm.date\"\n" +
    "                options=\"datePickerTm.options\">\n" +
    "                {{(TmProfileProgramFormController.subscription.startDate| date:'mediumDate') || \"Start Date\"}} - {{(TmProfileProgramFormController.subscription.endDate| date:'mediumDate') || \"End Date\"}}\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"col-sm-12\">\n" +
    "            <a class=\"btn btn-primary pull-right\"\n" +
    "               ng-class=\"{'disabled' : !TmProfileProgramFormController.subscription.startDate}\"\n" +
    "               ng-click=\"TmProfileProgramFormController.handleUpgradeSubmit()\">\n" +
    "                <i class=\"fa fa-check-circle\"></i>\n" +
    "                <span>Save</span>\n" +
    "            </a>\n" +
    "            <a class=\"btn btn-default pull-right\"\n" +
    "               ng-click=\"TmProfileProgramFormController.closeSubscribeProgramForm()\">\n" +
    "               <i class=\"fa fa-ban\"></i>\n" +
    "               <span>Cancel</span>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/programs/tmProfileProgramsAddCampusFormView.html',
    "<ng-form name=\"TmProfileProgramFormController.forms.addCampusForm\" novalidate autocomplete=\"off\">\n" +
    "  <div class=\"form-group\" ng-class=\"{'has-errors': !TmProfileProgramFormController.isValidCampusName()}\">\n" +
    "      <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "        <span>Campus Name *</span>\n" +
    "      </label>\n" +
    "      <div class=\"col-sm-7 col-md-8\">\n" +
    "          <input type=\"text\"\n" +
    "            name=\"name\"\n" +
    "            class=\"form-control\"\n" +
    "            ng-required=\"true\"\n" +
    "            ng-model=\"TmProfileProgramFormController.newCampus.name\"\n" +
    "            ng-class=\"{'border-red': !TmProfileProgramFormController.isValidCampusName()}\"\n" +
    "            ng-focus=\"TmProfileProgramFormController.setValid('name', false, true)\"\n" +
    "            focus-delay=\"250\"\n" +
    "            custom-popover\n" +
    "            popover-html=\"Add a campus name\"\n" +
    "            popover-placement=\"left\"\n" +
    "            popover-trigger=\"manual\"\n" +
    "            popover-visibility=\"{{!TmProfileProgramFormController.isValidCampusName()}}\">\n" +
    "      </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\" ng-class=\"{'has-errors': !TmProfileProgramFormController.isValidCampusCountry()}\">\n" +
    "      <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "        <span>Country *</span>\n" +
    "      </label>\n" +
    "      <div class=\"col-sm-7 col-md-8\">\n" +
    "          <ui-select\n" +
    "           name=\"country\"\n" +
    "           ng-model=\"TmProfileProgramFormController.newCampus.country\"\n" +
    "           focus-delay=\"250\"\n" +
    "           custom-popover\n" +
    "           popover-html=\"Select an option\"\n" +
    "           popover-placement=\"left\"\n" +
    "           popover-trigger=\"manual\"\n" +
    "           popover-visibility=\"{{!TmProfileProgramFormController.isValidCampusCountry()}}\"\n" +
    "           theme=\"bootstrap\">\n" +
    "            <ui-select-match placeholder=\"Select an option\"><span>{{$select.selected.name}}</span></ui-select-match>\n" +
    "            <ui-select-choices\n" +
    "                position=\"down\"\n" +
    "                repeat=\"option.countryCode as option in TmProfileProgramFormController.countryList | filter: $select.search\">\n" +
    "                <div class=\"test\" ng-bind-html=\"option.name | highlight: $select.search\"></div>\n" +
    "            </ui-select-choices>\n" +
    "            <ui-select-no-choice>\n" +
    "                Not found\n" +
    "            </ui-select-no-choice>\n" +
    "         </ui-select>\n" +
    "      </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\" ng-class=\"{'has-errors': !TmProfileProgramFormController.isValidCampusAddressLine1()}\">\n" +
    "      <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "        <span>Address *</span>\n" +
    "      </label>\n" +
    "      <div class=\"col-sm-7 col-md-8\">\n" +
    "          <input type=\"text\"\n" +
    "            class=\"form-control\"\n" +
    "            name=\"addressLine1\"\n" +
    "            ng-model=\"TmProfileProgramFormController.newCampus.addressLine1\"\n" +
    "            ng-required=\"true\"\n" +
    "            ng-class=\"{'border-red': !TmProfileProgramFormController.isValidCampusAddressLine1()}\"\n" +
    "            ng-focus=\"TmProfileProgramFormController.setValid('addressLine1', false, true)\"\n" +
    "            focus-delay=\"250\"\n" +
    "            custom-popover\n" +
    "            popover-html=\"Add an address\"\n" +
    "            popover-placement=\"left\"\n" +
    "            popover-trigger=\"manual\"\n" +
    "            popover-visibility=\"{{!TmProfileProgramFormController.isValidCampusAddressLine1()}}\">\n" +
    "      </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "      <label class=\"control-label col-sm-5 col-md-4\">&nbsp;</label>\n" +
    "      <div class=\"col-sm-7 col-md-8\">\n" +
    "          <input type=\"text\" class=\"form-control\" ng-model=\"TmProfileProgramFormController.newCampus.addressLine2\">\n" +
    "      </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\" ng-class=\"{'has-errors': !TmProfileProgramFormController.isValidCampusCity()}\">\n" +
    "      <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "        <span>Town / City *</span>\n" +
    "      </label>\n" +
    "      <div class=\"col-sm-7 col-md-8\">\n" +
    "          <input type=\"text\"\n" +
    "            class=\"form-control\"\n" +
    "            name=\"city\"\n" +
    "            ng-model=\"TmProfileProgramFormController.newCampus.city\"\n" +
    "            ng-required=\"true\"\n" +
    "            ng-class=\"{'border-red': !TmProfileProgramFormController.isValidCampusCity()}\"\n" +
    "            ng-focus=\"TmProfileProgramFormController.setValid('city', false, true)\"\n" +
    "            focus-delay=\"250\"\n" +
    "            custom-popover\n" +
    "            popover-html=\"Add a town/city\"\n" +
    "            popover-placement=\"left\"\n" +
    "            popover-trigger=\"manual\"\n" +
    "            popover-visibility=\"{{!TmProfileProgramFormController.isValidCampusCity()}}\">\n" +
    "      </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "      <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "        <span>State / Province</span>\n" +
    "      </label>\n" +
    "      <div class=\"col-sm-7 col-md-8\">\n" +
    "          <input type=\"text\" class=\"form-control\" ng-model=\"TmProfileProgramFormController.newCampus.state\">\n" +
    "      </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "      <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "        <span>Postcode</span>\n" +
    "      </label>\n" +
    "      <div class=\"col-sm-7 col-md-8\">\n" +
    "          <input type=\"text\" class=\"form-control\" ng-model=\"TmProfileProgramFormController.newCampus.postcode\">\n" +
    "      </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"campusLatitude\" class=\"control-label col-sm-5 col-md-4\">\n" +
    "      <span>Latitude</span>\n" +
    "    </label>\n" +
    "    <div class=\"control-label col-sm-7 col-md-8\">\n" +
    "      <input id=\"campusLatitude\" type=\"text\" class=\"form-control\" ng-model=\"TmProfileProgramFormController.newCampus.latitude\" ng-readonly=\"TmProfileProgramFormController.newCampus.autoGenerate\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"campusLongitude\" class=\"control-label col-sm-5 col-md-4\">\n" +
    "      <span>Longitude</span>\n" +
    "    </label>\n" +
    "    <div class=\"control-label col-sm-7 col-md-8\">\n" +
    "      <input id=\"campusLongitude\" type=\"text\" class=\"form-control\" ng-model=\"TmProfileProgramFormController.newCampus.longitude\" ng-readonly=\"TmProfileProgramFormController.newCampus.autoGenerate\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"control-label col-sm-5 col-md-4\" >Auto Generate</label>\n" +
    "    <div class=\"col-sm-7 col-md-8\">\n" +
    "      <switch ng-model=\"TmProfileProgramFormController.newCampus.autoGenerate\" class=\"green\" ></switch>\n" +
    "      <span>Use the address to auto generate latitude & longitude values.</span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  \n" +
    "  <div class=\"form-group\">\n" +
    "      <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "        <span>Program Primary Campus</span>\n" +
    "      </label>\n" +
    "      <div class=\"col-sm-7 col-md-8\">\n" +
    "          <switch class=\"green\" ng-model=\"TmProfileProgramFormController.newCampus.primary\"></switch>\n" +
    "      </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "      <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "        <span>Display In Frontend</span>\n" +
    "      </label>\n" +
    "      <div class=\"col-sm-7 col-md-8\">\n" +
    "          <switch class=\"green\" ng-model=\"TmProfileProgramFormController.newCampus.displayInFrontEnd\"></switch>\n" +
    "      </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"form-group\"></div>\n" +
    "\n" +
    "  <div class=\"form-group\" ng-class=\"{'locked': TmProfileProgramFormController.campusSubmitInProgress}\">\n" +
    "      <div class=\"col-sm-12\">\n" +
    "          <a class=\"btn btn-primary pull-right btn-float-fix\" ng-click=\"TmProfileProgramFormController.handleNewCampusSubmit()\">\n" +
    "            <i class=\"fa fa-check-circle\"></i>\n" +
    "            <span>Add Campus to Program</span>\n" +
    "          </a>\n" +
    "          <a class=\"btn btn-default pull-right btn-float-fix\" ng-click=\"TmProfileProgramFormController.handleAddCampusClick()\">\n" +
    "            <i class=\"fa fa-ban\"></i>\n" +
    "            <span>Cancel</span>\n" +
    "          </a>\n" +
    "      </div>\n" +
    "  </div>\n" +
    "</ng-form>"
  );


  $templateCache.put('/scripts/components/profiles/tm/programs/tmProfileProgramsEditCampusFormView.html',
    "<ng-form name=\"TmProfileProgramFormController.forms.editCampusForm\" novalidate autocomplete=\"off\">\n" +
    "  <div class=\"form-group\" ng-class=\"{'has-errors': !TmProfileProgramFormController.isValidCampusName()}\">\n" +
    "      <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "        <span>Campus Name *</span>\n" +
    "      </label>\n" +
    "      <div class=\"col-sm-7 col-md-8\">\n" +
    "          <input type=\"text\"\n" +
    "            name=\"name\"\n" +
    "            class=\"form-control\"\n" +
    "            ng-required=\"true\"\n" +
    "            ng-model=\"TmProfileProgramFormController.oldCampus.name\"\n" +
    "            ng-focus=\"TmProfileProgramFormController.setValid('name', false, true)\"\n" +
    "            custom-popover\n" +
    "            popover-html=\"Add a campus name\"\n" +
    "            popover-placement=\"left\"\n" +
    "            popover-trigger=\"manual\"\n" +
    "            popover-visibility=\"{{!TmProfileProgramFormController.isValidCampusName()}}\">\n" +
    "      </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\" ng-class=\"{'has-errors': !TmProfileProgramFormController.isValidCampusCountry()}\">\n" +
    "      <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "        <span>Country *</span>\n" +
    "      </label>\n" +
    "      <div class=\"col-sm-7 col-md-8\">\n" +
    "          <ui-select\n" +
    "           name=\"country\"\n" +
    "           ng-model=\"TmProfileProgramFormController.oldCampus.country\"\n" +
    "           focus-delay=\"250\"\n" +
    "           custom-popover\n" +
    "           popover-html=\"Select an option\"\n" +
    "           popover-placement=\"left\"\n" +
    "           popover-trigger=\"manual\"\n" +
    "           popover-visibility=\"{{!TmProfileProgramFormController.isValidCampusCountry()}}\"\n" +
    "           theme=\"bootstrap\">\n" +
    "            <ui-select-match placeholder=\"Select an option\"><span>{{$select.selected.name}}</span></ui-select-match>\n" +
    "            <ui-select-choices\n" +
    "                position=\"down\"\n" +
    "                repeat=\"option.countryCode as option in TmProfileProgramFormController.countryList | filter: $select.search\">\n" +
    "                <div class=\"test\" ng-bind-html=\"option.name | highlight: $select.search\"></div>\n" +
    "            </ui-select-choices>\n" +
    "            <ui-select-no-choice>\n" +
    "                Not found\n" +
    "            </ui-select-no-choice>\n" +
    "         </ui-select>\n" +
    "      </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\" ng-class=\"{'has-errors': !TmProfileProgramFormController.isValidCampusAddressLine1()}\">\n" +
    "      <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "        <span>Address *</span>\n" +
    "      </label>\n" +
    "      <div class=\"col-sm-7 col-md-8\">\n" +
    "          <input type=\"text\"\n" +
    "            name=\"addressLine1\"\n" +
    "            class=\"form-control\"\n" +
    "            ng-required=\"true\"\n" +
    "            ng-model=\"TmProfileProgramFormController.oldCampus.addressLine1\"\n" +
    "            custom-popover popover-html=\"Add an address\"\n" +
    "            popover-placement=\"left\"\n" +
    "            popover-trigger=\"manual\"\n" +
    "            popover-visibility=\"{{!TmProfileProgramFormController.isValidCampusAddressLine1()}}\">\n" +
    "      </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "      <label class=\"control-label col-sm-5 col-md-4\">&nbsp;</label>\n" +
    "      <div class=\"col-sm-7 col-md-8\">\n" +
    "          <input type=\"text\" class=\"form-control\" ng-model=\"TmProfileProgramFormController.oldCampus.addressLine2\">\n" +
    "      </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\" ng-class=\"{'has-errors': !TmProfileProgramFormController.isValidCampusCity()}\">\n" +
    "      <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "        <span>Town / City *</span>\n" +
    "      </label>\n" +
    "      <div class=\"col-sm-7 col-md-8\">\n" +
    "          <input type=\"text\"\n" +
    "            class=\"form-control\"\n" +
    "            name=\"city\"\n" +
    "            ng-required=\"true\"\n" +
    "            ng-model=\"TmProfileProgramFormController.oldCampus.city\"\n" +
    "            custom-popover popover-html=\"Add a town/city\"\n" +
    "            popover-placement=\"left\"\n" +
    "            popover-trigger=\"manual\"\n" +
    "            popover-visibility=\"{{!TmProfileProgramFormController.isValidCampusCity()}}\">\n" +
    "      </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "      <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "        <span>State / Province</span>\n" +
    "      </label>\n" +
    "      <div class=\"col-sm-7 col-md-8\">\n" +
    "          <input type=\"text\" class=\"form-control\" ng-model=\"TmProfileProgramFormController.oldCampus.state\">\n" +
    "      </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "      <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "        <span>Postcode</span>\n" +
    "      </label>\n" +
    "      <div class=\"col-sm-7 col-md-8\">\n" +
    "          <input type=\"text\" class=\"form-control\" ng-model=\"TmProfileProgramFormController.oldCampus.postcode\">\n" +
    "      </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"campusLatitude\" class=\"control-label col-sm-3 col-md-2\"><span>Latitude</span></label>\n" +
    "    <div class=\"col-sm-3 col-md-4\">\n" +
    "      <input id=\"campusLatitude\" type=\"text\" class=\"form-control\" ng-model=\"TmProfileProgramFormController.oldCampus.latitude\" ng-readonly=\"TmProfileProgramFormController.oldCampus.autoGenerate\">\n" +
    "    </div>\n" +
    "    <label for=\"campusLongitude\" class=\"control-label col-sm-3 col-md-2\"><span>Longitude</span></label>\n" +
    "      <div class=\"col-sm-3 col-md-4\">\n" +
    "        <input id=\"campusLongitude\" type=\"text\" class=\"form-control\" ng-model=\"TmProfileProgramFormController.oldCampus.longitude\" ng-readonly=\"TmProfileProgramFormController.oldCampus.autoGenerate\">\n" +
    "      </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"full-width\" class=\"control-label col-sm-5 col-md-4\" >Auto Generate</label>\n" +
    "    <div class=\"col-sm-7 col-md-8\">\n" +
    "      <switch ng-model=\"TmProfileProgramFormController.oldCampus.autoGenerate\" class=\"green\" ></switch>\n" +
    "      <span>Use the address to auto generate latitude & longitude values.</span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "      <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "        <span>Program Primary Campus</span>\n" +
    "      </label>\n" +
    "      <div class=\"col-sm-7 col-md-8\">\n" +
    "          <switch class=\"green\" ng-model=\"TmProfileProgramFormController.oldCampus.primary\"></switch>\n" +
    "      </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "      <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "        <span>Display In Frontend</span>\n" +
    "      </label>\n" +
    "      <div class=\"col-sm-7 col-md-8\">\n" +
    "          <switch class=\"green\" ng-model=\"TmProfileProgramFormController.oldCampus.displayInFrontEnd\"></switch>\n" +
    "      </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\" ng-class=\"{'locked': TmProfileProgramFormController.campusSubmitInProgress}\">\n" +
    "      <div class=\"col-sm-12\">\n" +
    "          <a class=\"btn btn-primary pull-right\" ng-click=\"TmProfileProgramFormController.handleUpdateCampus()\">\n" +
    "            <i class=\"fa fa-check-circle\"></i>\n" +
    "            <span>Update</span>\n" +
    "          </a>\n" +
    "          <a class=\"btn btn-default pull-right\" ng-click=\"TmProfileProgramFormController.handleCancelCampusClick()\">\n" +
    "            <i class=\"fa fa-ban\"></i>\n" +
    "            <span>Cancel</span>\n" +
    "          </a>\n" +
    "      </div>\n" +
    "  </div>\n" +
    "  <div class=\"separator dashed\"></div>\n" +
    "</ng-form>"
  );


  $templateCache.put('/scripts/components/profiles/tm/programs/tmProfileProgramsView.html',
    "<div ng-controller=\"TmProfileProgramsController as ProgramsController\">\n" +
    "    <div class=\"tab-header\">\n" +
    "        <a class=\"btn btn-primary pull-right\"\n" +
    "           ng-class=\"{'disabled': programsTabSubmitInProgress}\"\n" +
    "           ng-click=\"ProgramsController.handleAddProgramClick()\">\n" +
    "            <i class=\"fa fa-plus\"></i>\n" +
    "            <span>{{ProgramsController.isClient() ? 'Request to add Program' : 'Add Program'}}</span>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"tab-body\">\n" +
    "        <div id=\"programsTable\">\n" +
    "            <div wave-spinner class=\"wave-spinner\" ng-show=\"ProgramsController.isDatagridReloading || !ProgramsController.isDatagridRendered\"></div>\n" +
    "\n" +
    "            <div ng-if=\"!ProgramsController.isDatagridReloading && gridOptions\">\n" +
    "                <ui-grid-info ng-if=\"!showProgramEditForm && !showProgramAddForm\"></ui-grid-info>\n" +
    "                <div class=\"grid\"\n" +
    "                     ui-grid=\"gridOptions\"\n" +
    "                     ui-grid-selection\n" +
    "                     ui-grid-resize-columns\n" +
    "                     ui-grid-auto-resize>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/publish/tmProfilePublishHistoryView.html',
    "<div class=\"ibox publish-logs\" ng-controller=\"TmProfilePublishLogsController as PublishLogsController\">\n" +
    "    <div class=\"ibox-title m-t-xl\">\n" +
    "        <h5>Publish Logs</h5>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <div wave-spinner ng-show=\"fetchingPublishLog()\"></div>\n" +
    "        <div ng-show=\"!fetchingPublishLog()\" ng-repeat=\"logs in publishLogs\">\n" +
    "            <div ng-repeat=\"logsPerDay in logs\">\n" +
    "                <div class=\"panel panel-default\">\n" +
    "                    <div class=\"panel-heading\">\n" +
    "                        <span>{{logsPerDay.date | date:'mediumDate'}}</span>\n" +
    "                    </div>\n" +
    "                    <div class=\"panel-body\">\n" +
    "                        <ul class=\"list-unstyled\">\n" +
    "                            <li ng-repeat=\"log in logsPerDay.logs\">\n" +
    "                                <span class=\"status\">\n" +
    "                                    <span class=\"icon text-success\" ng-if=\"log.status === 'success'\">\n" +
    "                                        <i class=\"fa fa-check\"></i>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"icon text-danger\" ng-if=\"log.status === 'failure'\">\n" +
    "                                        <i class=\"fa fa-exclamation\"></i>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"icon text-info\" ng-if=\"log.status === 'progress'\">\n" +
    "                                        <i class=\"fa fa-spinner fa-spin\"></i>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"icon text-warning\" ng-if=\"log.status === 'pending'\">\n" +
    "                                        <i class=\"fa fa-clock-o\"></i>\n" +
    "                                    </span>\n" +
    "                                </span>\n" +
    "                                \n" +
    "                                <span>{{log.status === 'failure' ? 'Failed' : 'Published'}}:</span>\n" +
    "                                <span class=\"bold\">{{log.createdByFullName}}</span>\n" +
    "                                <span class=\"time\">{{log.createdAt | date:'shortTime'}}</span>\n" +
    "                                \n" +
    "                                <span class=\"program\">\n" +
    "                                    <span class=\"icon round bg-primary\" ng-if=\"log.type === 'tm'\">\n" +
    "                                        <i class=\"fa fa-book\"></i>\n" +
    "                                    </span>\n" +
    "                                </span>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"!publishLogs.results.length\">No publish history</div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/publish/tmProfilePublishView.html',
    "<div ng-controller=\"TmProfilePublishController as PublishController\">\n" +
    "    <div class=\"alert alert-info\">\n" +
    "        <p>\n" +
    "            <i class=\"fa fa-info-circle\"></i>\n" +
    "            <span>Please be aware that published changes will not appear straight away and could take up to 6 hours to be visible on the frontend website.</span>\n" +
    "        </p>\n" +
    "        <p>\n" +
    "            <i class=\"fa fa-info-circle\"></i>\n" +
    "            <span>Whilst a publish is occurring, you may navigate away from this page and it will still progress in the background.</span>\n" +
    "        </p>\n" +
    "    </div>\n" +
    "    <div id=\"publishContainer\" class=\"tab-body\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-lg-4 meter\" ng-repeat=\"section in sections\">\n" +
    "                <div class=\"panel panel-default\">\n" +
    "                    <div class=\"panel-heading\">\n" +
    "                        <h5 class=\"pull-left\">\n" +
    "                            <span class=\"icon round bg-primary\" ng-if=\"isTm(section.type)\">\n" +
    "                                <i class=\"fa fa-book\"></i>\n" +
    "                            </span>\n" +
    "                            <span>{{section.name}}</span>\n" +
    "                        </h5>\n" +
    "\n" +
    "                        <a class=\"btn btn-primary btn-xs pull-right m-b-xs\"\n" +
    "                           ng-class=\"{'disabled': section.publishDisabled || PublishController.isProfileEnabled()}\"\n" +
    "                           ng-click=\"handlePublish(section, section.publishProgramsBasic, section.publishProgramsAdvanced)\">\n" +
    "                            <i class=\"fa fa-cloud-upload\"></i>\n" +
    "                            <span>Publish</span>\n" +
    "                        </a>\n" +
    "                        <div class=\"clearfix\" ng-if=\"institutionHasAdvancedPrograms() && tmIsAdvanced\">\n" +
    "                            <input ng-model=\"section.publishProgramsAdvanced\" i-checkbox type=\"checkbox\">\n" +
    "                            <span>Include all Advanced Programs</span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"panel-body\">\n" +
    "                        <div class=\"clearfix m-b-md\">\n" +
    "                            <a class=\"btn btn-default btn-sm btn-block\"\n" +
    "                                target=\"_blank\"\n" +
    "                                ng-href=\"{{section.url}}\"\n" +
    "                                ng-class=\"{'disabled': section.viewDisabled}\">\n" +
    "                                <i class=\"fa fa-eye\"></i>\n" +
    "                                <span>View webpage</span>\n" +
    "                            </a>\n" +
    "                            <a class=\"btn btn-default btn-sm btn-block\"\n" +
    "                                ng-if=\"PublishController.devMode\"\n" +
    "                                target=\"_blank\"\n" +
    "                                ng-href=\"{{section.feedPreviewUrl}}\"\n" +
    "                                ng-class=\"{'disabled': section.viewDisabled}\">\n" +
    "                                <i class=\"fa fa-eye\"></i>\n" +
    "                                <span>Preview feed</span>\n" +
    "                            </a>\n" +
    "                        </div>\n" +
    "                        <div class=\"response\" ng-if=\"section.statusMessage\">\n" +
    "                            <p><strong>Reason for Failed Publish:</strong></p>\n" +
    "                            <span class=\"truncate\"><strong>{{section.statusMessage}}</strong></span>\n" +
    "                        </div>\n" +
    "                        <div progress-circle=\"section.status\"></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/publish/tmProfileResubscribeView.html',
    "<div class=\"resubscribe\" ng-controller=\"TmProfileResubscribeController as TmResubscribeController\">\n" +
    "    <div class=\"ibox m-t-xl\" ng-show=\"TmResubscribeController.isAdvanced\">\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-body\">\n" +
    "                <div class=\"subscribe\">\n" +
    "                    <div class=\"pull-left\">\n" +
    "                        <p>Your subscription expires:</p>\n" +
    "                        <span class=\"bold\">{{TmResubscribeController.expiresDate | date:'dd MMMM yyyy'}}</span>\n" +
    "                    </div>\n" +
    "                    <button class=\"btn btn-warning btn-lg pull-right\"\n" +
    "                            ng-click=\"TmResubscribeController.resubscribeClick()\"\n" +
    "                            ng-show=\"TmResubscribeController.showResubscribeButton()\">\n" +
    "                        <i class=\"fa fa-envelope-o\"></i>\n" +
    "                        <span>Resubscribe</span>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    \n" +
    "    <div class=\"ibox m-t-xl\" ng-show=\"TmResubscribeController.displayResubscribeForm\">\n" +
    "        <div class=\"ibox-title\">\n" +
    "            <h5>Resubscribe to Advance Profile</h5>\n" +
    "        </div>\n" +
    "        <div class=\"ibox-content\">\n" +
    "            <form class=\"form-horizontal preview\" name=\"forms.resubscribeForm\" novalidate>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">To:</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <span class=\"text-label\">{{TmResubscribeController.formData.to}}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                \n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">Subject:</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <span class=\"text-label\">{{TmResubscribeController.formData.subject}}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">Name:</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <span class=\"text-label\">{{TmResubscribeController.formData.name}}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">Email:</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <span class=\"text-label\">{{TmResubscribeController.formData.email}}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">Comments:</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <div class=\"textarea\"><textarea class=\"form-control full-width\" ng-model=\"TmResubscribeController.formData.comments\" name=\"comments\" ng-trim=\"true\" rows=\"5\"></textarea></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                \n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-sm-12\">\n" +
    "                        <a class=\"btn btn-primary pull-right\" ng-class=\"{'disabled': TmResubscribeController.inProgress}\" ng-click=\"TmResubscribeController.submitClick()\">\n" +
    "                           <i class=\"fa fa-check-circle\"></i>\n" +
    "                           <span>Submit</span>\n" +
    "                        </a>\n" +
    "                        <a class=\"btn btn-default pull-right\" ng-click=\"TmResubscribeController.cancelClick()\">\n" +
    "                            <i class=\"fa fa-ban\"></i>\n" +
    "                            <span>Cancel</span>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/profiles/tm/tmProfileDeleteFormView.html',
    "<div class=\"ibox-title m-t-xl\">\n" +
    "    <h5>Request to Delete Basic Program</h5>\n" +
    "    <div class=\"ibox-tools\">\n" +
    "        <a class=\"close-link\" ng-click=\"TmProfileController.handleCloseDeleteForm()\">\n" +
    "            <i class=\"fa fa-times\"></i>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"ibox\">\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <form class=\"form-horizontal preview\" name=\"forms.upgradeProfile\" novalidate>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">To</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <span class=\"text-label\">{{upgradeEmailsTo}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Subject</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <span class=\"text-label\">I would like program <strong>{{deleteRequest.program.name}}</strong> to be deleted</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Name</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <span class=\"text-label\">{{deleteRequest.name}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Email</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <span class=\"text-label\">{{deleteRequest.email}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Comments</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <div class=\"textarea\"><textarea class=\"form-control no-resize\" rows=\"7\" cols=\"50\" placeholder=\"Please add comments supporting your request\" ng-model=\"deleteRequest.comments\"></textarea></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-sm-12\">\n" +
    "                    <a class=\"btn btn-primary pull-right\"\n" +
    "                       ng-class=\"{'disabled': TmProfileController.deleteRequestInProgress}\"\n" +
    "                       ng-click=\"TmProfileController.handleSendDeleteRequestClick()\">\n" +
    "                       <i class=\"fa fa-check-circle\"></i>\n" +
    "                       <span>Send</span>\n" +
    "                    </a>\n" +
    "                    <a class=\"btn btn-default pull-right\" ng-click=\"TmProfileController.handleCloseDeleteForm()\">\n" +
    "                        <i class=\"fa fa-ban\"></i>\n" +
    "                        <span>Close</span>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/tmProfileProgramUpgradeFormView.html',
    "<div class=\"ibox-title m-t-xl\">\n" +
    "    <h5>Upgrade to Advanced Program</h5>\n" +
    "    <div class=\"ibox-tools\">\n" +
    "        <a class=\"close-link\" ng-click=\"TmProfileController.toggleUpgradeProgramForm()\">\n" +
    "            <i class=\"fa fa-times\"></i>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"ibox\">\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <form class=\"form-horizontal preview\" name=\"forms.upgradeProgramProfile\" novalidate>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">To</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <span class=\"text-label\">{{upgradeEmailsTo}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Subject</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <span class=\"text-label\">I would like more information about Upgrading to an Advanced Program</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Name</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <span class=\"text-label\">{{upgradeRequest.name}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Email</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <span class=\"text-label\">{{upgradeRequest.email}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Comments</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <div class=\"textarea\"><textarea class=\"form-control no-resize\" rows=\"7\" cols=\"50\" placeholder=\"Comments...\" ng-model=\"upgradeRequest.comments\"></textarea></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-sm-12\">\n" +
    "                    <a class=\"btn btn-primary pull-right\"\n" +
    "                       ng-class=\"{'disabled': TmProfileController.upgradeInProgress}\"\n" +
    "                       ng-click=\"TmProfileController.handleProgramUpgradeRequestClick()\">\n" +
    "                       <i class=\"fa fa-check-circle\"></i>\n" +
    "                       <span>Send</span>\n" +
    "                    </a>\n" +
    "                    <a class=\"btn btn-default pull-right\" ng-click=\"TmProfileController.toggleUpgradeProgramForm()\">\n" +
    "                        <i class=\"fa fa-ban\"></i>\n" +
    "                        <span>Close</span>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/tmProfileUpgradeFormView.html',
    "<div class=\"ibox-title m-t-xl\">\n" +
    "    <h5>Upgrade to Advanced Profile</h5>\n" +
    "    <div class=\"ibox-tools\">\n" +
    "        <a class=\"close-link\" ng-click=\"TmProfileController.toggleUpgradeForm()\">\n" +
    "            <i class=\"fa fa-times\"></i>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"ibox\">\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <form class=\"form-horizontal preview\" name=\"forms.upgradeProfile\" novalidate>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">To</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <span class=\"text-label\">{{upgradeEmailsTo}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Subject</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <span class=\"text-label\">I would like more information about Upgrading to an Advanced Profile</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Name</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <span class=\"text-label\">{{upgradeRequest.name}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Email</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <span class=\"text-label\">{{upgradeRequest.email}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Comments</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <div class=\"textarea\"><textarea class=\"form-control no-resize\" rows=\"7\" cols=\"50\" placeholder=\"Please add comments supporting your request\" ng-model=\"upgradeRequest.comments\"></textarea></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-sm-12\">\n" +
    "                    <a class=\"btn btn-primary pull-right\"\n" +
    "                       ng-class=\"{'disabled': TmProfileController.upgradeInProgress}\"\n" +
    "                       ng-click=\"TmProfileController.handleUpgradeClick()\">\n" +
    "                       <i class=\"fa fa-check-circle\"></i>\n" +
    "                       <span>Send</span>\n" +
    "                    </a>\n" +
    "                    <a class=\"btn btn-default pull-right\" ng-click=\"TmProfileController.toggleUpgradeForm()\">\n" +
    "                        <i class=\"fa fa-ban\"></i>\n" +
    "                        <span>Close</span>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tm/tmProfileView.html',
    "<div class=\"wrapper wrapper-content animated fadeInRight page-profiles-tm\" ng-controller=\"TmProfileController as TmProfileController\">\n" +
    "    <div class=\"row\">\n" +
    "        <div ng-class=\"TmProfileController.isRightSidePanelActive() ? 'col-sm-8' : 'col-sm-12'\">\n" +
    "            <div class=\"tabs-container\" ng-class=\"{'modal-overlay': TmProfileController.loadInProgress()}\">\n" +
    "                <uib-tabset active=\"activeTab\">\n" +
    "                    <uib-tab index=\"0\" heading=\"Overview\">\n" +
    "                        <div class=\"panel-body overview\">\n" +
    "                            <div ng-include src=\"'/scripts/components/profiles/tm/overview/tmProfileOverviewView.html'\"></div>\n" +
    "                        </div>\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab index=\"1\" heading=\"Programs\" ng-if=\"!TmProfileController.showProgramStasTab\">\n" +
    "                        <div class=\"panel-body programs\">\n" +
    "                            <div ng-include src=\"'/scripts/components/profiles/tm/programs/tmProfileProgramsView.html'\"></div>\n" +
    "                        </div>\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab index=\"4\" heading=\"Program Statistics\" ng-if=\"TmProfileController.showProgramStasTab\">\n" +
    "                        <div class=\"panel-body program-stats\">\n" +
    "                            <div ng-include src=\"'/scripts/components/profiles/tm/program-stats/tmProfileProgramStatsView.html'\"></div>\n" +
    "                        </div>\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab index=\"2\" heading=\"Media\">\n" +
    "                        <div class=\"panel-body media\">\n" +
    "                            <div ng-include src=\"'/scripts/components/profiles/tm/media/tmProfileMediaView.html'\" id=\"mediaTab\"></div>\n" +
    "                        </div>\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab index=\"3\" heading=\"Publish\">\n" +
    "                        <div class=\"panel-body publish\">\n" +
    "                            <div ng-include src=\"'/scripts/components/profiles/tm/publish/tmProfilePublishView.html'\"></div>\n" +
    "                        </div>\n" +
    "                    </uib-tab>\n" +
    "                </uib-tabset>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-show=\"showUpgradeForm\" class=\"col-sm-4\">\n" +
    "            <div ng-include src=\"'/scripts/components/profiles/tm/tmProfileUpgradeFormView.html'\"></div>\n" +
    "        </div>\n" +
    "        <div ng-show=\"showUpgradeProgramRequest\" class=\"col-sm-4\">\n" +
    "            <div ng-include src=\"'/scripts/components/profiles/tm/tmProfileProgramUpgradeFormView.html'\"></div>\n" +
    "        </div>\n" +
    "        <div ng-show=\"showDeleteForm\" class=\"col-sm-4\">\n" +
    "            <div ng-include src=\"'/scripts/components/profiles/tm/tmProfileDeleteFormView.html'\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"TmProfileController.showOverviewHistory\" class=\"col-sm-4\">\n" +
    "            <div ng-include src=\"'/scripts/components/profiles/tm/overview/overview/tmProfileOverviewHistoryLogView.html'\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"TmProfileController.showFaqHistory\" class=\"col-sm-4\">\n" +
    "            <div ng-include src=\"'/scripts/components/profiles/tm/overview/faq/tmProfileOverviewFaqHistoryLogView.html'\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"showProgramEditForm || showProgramAddForm\"\n" +
    "             fixed-element-while-scrolling=\"#programsTable\"\n" +
    "             class=\"col-sm-4\"\n" +
    "             ng-controller=\"TmProfileProgramFormController as TmProfileProgramFormController\">\n" +
    "            <div class=\"nested-ibox\" ng-show=\"showProgramAddForm\" ng-include src=\"'/scripts/components/profiles/tm/programs/tmProfileAddProgramFormView.html'\"></div>\n" +
    "            <div class=\"nested-ibox\" ng-show=\"showProgramEditForm\" ng-include src=\"'/scripts/components/profiles/tm/programs/tmProfileEditProgramFormView.html'\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"isMediaTabActive()\" class=\"col-sm-4\" ng-class=\"tmIsAdvanced ? '': 'modal-overlay-35'\" fixed-element-while-scrolling=\"#mediaTab\">\n" +
    "            <div id=\"mediaSidebar\" ng-include src=\"'/scripts/components/profiles/tm/media/tmProfileMediaLinkManagerView.html'\"></div>\n" +
    "        </div>\n" +
    "        <div ng-show=\"isPublishTabActive()\" class=\"col-sm-4\">\n" +
    "            <div ng-include src=\"'/scripts/components/profiles/tm/publish/tmProfileResubscribeView.html'\"></div>\n" +
    "            <div ng-include src=\"'/scripts/components/profiles/tm/publish/tmProfilePublishHistoryView.html'\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/departments/datagrid/createdAtFilterHeaderTemplate.html',
    "<div class=\"ui-grid-filter-container\" ng-repeat=\"colFilter in col.filters\" ng-if=\"colFilter.visible\">\n" +
    "    <input type=\"text\" class=\"ui-grid-filter-input date-picker\"\n" +
    "           ng-model=\"grid.appScope.filters.createdAt\"\n" +
    "           date-range-picker=\"\"\n" +
    "           options=\"{eventHandlers: {'apply.daterangepicker': grid.appScope.handleCreatedAtDateRange}, opens: 'left'}\" />\n" +
    "    <div class=\"ui-grid-filter-button\" ng-click=\"grid.appScope.handleCreatedAtDateRange(); grid.appScope.filters.createdAt = {}\">\n" +
    "      	<i class=\"ui-grid-icon-cancel\" ng-if=\"grid.appScope.filters.createdAt && grid.appScope.filters.createdAt.startDate\">&nbsp;</i> \n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/departments/datagrid/deleteCellTemplate.html',
    "<div class=\"ui-grid-cell-contents no-select text-center\" ng-click=\"$event.stopPropagation()\">\n" +
    "    <div class=\"inline\" ng-if=\"row.entity.typeId === 3\">\n" +
    "        <span custom-popover\n" +
    "              popover-html=\"{{grid.appScope.cutomCheckboxMessage()}}\"\n" +
    "              popover-placement=\"right\"\n" +
    "              popover-container=\"body\"\n" +
    "              popover-trigger=\"hover\">\n" +
    "            <input\n" +
    "                disabled=\"disabled\"\n" +
    "                ng-model=\"grid.appScope.departmentsToDelete[row.entity.id]\"\n" +
    "                i-checkbox\n" +
    "                type=\"checkbox\">\n" +
    "        </span>\n" +
    "    </div>\n" +
    "    <div class=\"inline\" ng-if=\"row.entity.typeId !== 3\">\n" +
    "        <input\n" +
    "            ng-model=\"grid.appScope.departmentsToDelete[row.entity.id]\"\n" +
    "            i-checkbox\n" +
    "            type=\"checkbox\">\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/departments/datagrid/deleteHeaderCellTemplate.html',
    "<button type=\"button\"\n" +
    "        ng-disabled=\"grid.appScope.isDeleteButtonDisabled()\"\n" +
    "        class=\"btn btn-danger btn-sm\"\n" +
    "        ng-class=\"{'disabled': grid.appScope.isDeleteButtonDisabled()}\"\n" +
    "        ng-click=\"grid.appScope.handleDeleteClick()\">\n" +
    "    <span class=\"glyphicon glyphicon-trash\"></span><!--  {{col.displayName}} -->\n" +
    "</button>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/departments/datagrid/rowTemplate.html',
    "<div grid=\"grid\" class=\"ui-grid-draggable-row\" draggable=\"true\">\n" +
    "    <div class=\"ui-grid-cell pointer\"\n" +
    "        ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\"\n" +
    "        ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader, 'active': row.entity.id == grid.appScope.selectedDepartmentId }\"\n" +
    "        role=\"{{col.isRowHeader ? 'rowheader' : 'gridcell'}}\"\n" +
    "        ui-grid-cell>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/departments/modalDowngradeDepartmentView.html',
    "<div class=\"modal-header\">\n" +
    "    <h3>{{modalOptions.headerText}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <p ng-show=\"!modalOptions.subscriptions\">\n" +
    "        Client department has no active subscription. Press Downgrade Now to downgrade to simple department.\n" +
    "    </p>\n" +
    "    <div ng-show=\"modalOptions.subscriptions\">\n" +
    "        <p>This client department currently has an active subscription. The subscription will need to be turned off in order to downgrade and delete the profile. If you wish to downgrade the client department and delete the profile in Drupal (front end) please select accordingly and press update to continue.</p>\n" +
    "        <hr>\n" +
    "        <p>Enabled:\n" +
    "            <code ng-if=\"modalOptions.department.enabled.pg\">PG</code>\n" +
    "            <code ng-if=\"modalOptions.department.enabled.ug\">UG</code>\n" +
    "            <code ng-if=\"modalOptions.department.enabled.tm\">MBA</code>\n" +
    "        </p>\n" +
    "        <p ng-if=\"modalOptions.department.subscriptions.tu.advanced\">\n" +
    "            Advanced TU : <strong>From {{modalOptions.department.subscriptions.tu.startDate | date:'short'}}</strong> to <strong>{{modalOptions.department.subscriptions.tu.endDate | date:'short'}}</strong>\n" +
    "        </p>\n" +
    "        <p ng-if=\"modalOptions.department.subscriptions.tm.advanced\">\n" +
    "            Advanced TM : <strong>From {{modalOptions.department.subscriptions.tm.startDate | date:'short'}}</strong> to <strong>{{modalOptions.department.subscriptions.tm.endDate| date:'short'}}</strong>\n" +
    "        </p>\n" +
    "        <switch ng-model=\"modalOptions.downgradeAndDelete\" class=\"green\"></switch>\n" +
    "        Downgrade the client department and delete the profile in Drupal (front end)\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" ng-click=\"modalOptions.close()\">\n" +
    "        {{modalOptions.closeButtonText}}\n" +
    "    </button>\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"modalOptions.completeDowngradeClick(modalOptions.downgradeAndDelete)\">\n" +
    "        {{modalOptions.subscriptions ? (modalOptions.downgradeAndDelete ? 'Downgrade & Delete' : 'Downgrade in Backend') : 'Downgrade Now'}}\n" +
    "    </button>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/departments/modalUpgradeDepartmentView.html',
    "<div class=\"modal-header\">\n" +
    "    <button type=\"button\" class=\"close\" data-ng-click=\"modalOptions.close()\">&times;</button>\n" +
    "    <h3>{{modalOptions.headerText}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <p>\n" +
    "        To complete this department upgrade you must enter subscription dates, country, etc.\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        Click on the button below to navigate to Institution List backend to enter these details.\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        Please note that without these details, the upgrade will not be complete.\n" +
    "    </p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <a class=\"btn btn-primary btn-sm\"\n" +
    "           ng-click=\"modalOptions.completeUpgradeClick()\"\n" +
    "           ui-sref=\"staff.institutions.list({coreId: modalOptions.institutionCoreId})\">Complete upgrade now</a>\n" +
    "    <button type=\"button\" class=\"btn btn-sm\"\n" +
    "            ng-click=\"modalOptions.close()\">{{modalOptions.closeButtonText}}</button>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/departments/tuProfileAddDepartmentFormView.html',
    "<div class=\"ibox\">\n" +
    "    <div class=\"ibox-title m-t-xl\">\n" +
    "        <h5>Add Department</h5>\n" +
    "        <div class=\"ibox-tools\">\n" +
    "            <a class=\"close-link\" ng-click=\"toggleDepartmentAddForm()\">\n" +
    "                <i class=\"fa fa-times\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <div wave-spinner class=\"text-right\" ng-show=\"fetchingHistoryLog()\"></div>\n" +
    "\n" +
    "        <form class=\"form-horizontal add-department\" name=\"forms.addDepartmentForm\" novalidate>\n" +
    "            <div class=\"form-group\" ng-if=\"DepartmentOverviewController.isInstitutionSelected()\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Institution Name *</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <input type=\"text\" class=\"form-control\"\n" +
    "                           ng-model=\"DepartmentOverviewController.institution.selected.name\"\n" +
    "                           ng-disabled=\"true\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors': isInvalidNewDepartmentName}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">\n" +
    "                    Department Name *\n" +
    "                </label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <input type=\"text\"\n" +
    "                        placeholder=\"Add name\"\n" +
    "                        ng-model=\"newDepartment.name\"\n" +
    "                        class=\"form-control\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        focus-delay=\"250\"\n" +
    "                        custom-popover\n" +
    "                        popover-html=\"Add a department name\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{isInvalidNewDepartmentName ? true : false}}\"\n" +
    "                        ng-focus=\"setIsInvalidNewDepartmentName(false)\" />\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors': isInvalidNewBelongsTo}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Belongs to *</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <ui-select\n" +
    "                        ng-model=\"newDepartment.belongsTo\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        focus-delay=\"250\"\n" +
    "                        custom-popover popover-html=\"Select an option\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{isInvalidNewBelongsTo ? true : false}}\"\n" +
    "                        on-select=\"setIsInvalidNewBelongsTo(false)\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\">\n" +
    "                            <i class=\"fa fa-building\"></i>\n" +
    "                            <span>{{$select.selected.title}}</span>\n" +
    "                        </ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.id as option in belongsToList | filter: $select.search\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.title | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"white-space\"></div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-sm-12\">\n" +
    "                    <a class=\"btn btn-primary pull-right\" ng-class=\"{'disabled': addInProgress}\" ng-click=\"handleDepartmentCreateClick()\">\n" +
    "                        <i class=\"fa fa-check-circle\"></i>\n" +
    "                        <span>Save</span>\n" +
    "                    </a>\n" +
    "                    <a class=\"btn btn-default pull-right\" ng-click=\"toggleDepartmentAddForm()\">\n" +
    "                        <i class=\"fa fa-ban\"></i>\n" +
    "                        <span>Cancel</span>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/departments/tuProfileDepartmentsView.html',
    "<div ng-controller=\"TuProfileDepartmentsController as DepartmentsController\">\n" +
    "    <div class=\"alert alert-info\">\n" +
    "        <p>\n" +
    "            <i class=\"fa fa-info-circle\"></i>\n" +
    "            <span>Only the first top 50 departments will be published.</span>\n" +
    "        </p>\n" +
    "        <p>\n" +
    "            <i class=\"fa fa-info-circle\"></i>\n" +
    "            <span>Departments can be published only for advanced profiles.</span>\n" +
    "        </p>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"tab-header\">\n" +
    "        <div class=\"btn-toggle\">\n" +
    "            <switch class=\"green\"\n" +
    "                ng-disabled=\"alphabeticalOrderingInProgress\"\n" +
    "                ng-model=\"institutionData.departmentsAlphabeticalOrder\"\n" +
    "                ng-change=\"!alphabeticalOrderingInProgress ? handleAlphabeticalOrderClick(institutionData.departmentsAlphabeticalOrder) : null\"></switch>\n" +
    "            <span class=\"switch-text\"> Display in alphabetical order?</span>\n" +
    "        </div>\n" +
    "\n" +
    "        <button class=\"btn btn-primary pull-right\" type=\"button\" \n" +
    "            ng-class=\"{'disabled': departmentsTabSubmitInProgress}\"\n" +
    "            ng-click=\"handleAddDepartmentClick()\">\n" +
    "            <i class=\"fa fa-plus\"></i>\n" +
    "            <span>Add Department</span>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"tab-body\">\n" +
    "        <div wave-spinner class=\"wave-spinner\" ng-show=\"isDatagridReloading || !isDatagridRendered\"></div>\n" +
    "\n" +
    "        <div ng-if=\"!isDatagridReloading && gridOptions\">\n" +
    "            <ui-grid-info ng-if=\"!showDepartmentEditForm && !showDepartmentAddForm && !showClientUpgradeForm\"></ui-grid-info>\n" +
    "            <div class=\"grid\"\n" +
    "                ui-grid=\"gridOptions\"\n" +
    "                ui-grid-draggable-rows\n" +
    "                ui-grid-selection\n" +
    "                ui-grid-resize-columns\n" +
    "                ui-grid-auto-resize></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/departments/tuProfileEditDepartmentFormView.html',
    "<div class=\"ibox\">\n" +
    "    <div class=\"ibox-title m-t-xl\">\n" +
    "        <h5>Edit Department</h5>\n" +
    "        <div class=\"ibox-tools\">\n" +
    "            <a class=\"close-link\" ng-click=\"toggleDepartmentEditForm()\">\n" +
    "                <i class=\"fa fa-times\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <div wave-spinner class=\"text-right\" ng-show=\"isFetchInProgress()\"></div>\n" +
    "        <div ng-show=\"!isFetchInProgress()\" ng-class=\"{'modal-overlay-35': !allowEdit()}\">\n" +
    "            <form class=\"form-horizontal add-department\" name=\"forms.editDepartmentForm\" novalidate>\n" +
    "                <div class=\"form-group\" ng-if=\"DepartmentOverviewController.isInstitutionSelected()\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">Institution Name *</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <input type=\"text\" class=\"form-control\"\n" +
    "                               ng-model=\"DepartmentOverviewController.institution.selected.name\"\n" +
    "                               ng-required=\"true\"\n" +
    "                               ng-disabled=\"true\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\" ng-class=\"{'has-errors': isInvalidDepartmentNameUpdate}\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">Department Name *</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <input type=\"text\"\n" +
    "                            placeholder=\"Add name\"\n" +
    "                            ng-model=\"department.name\"\n" +
    "                            class=\"form-control\"\n" +
    "                            ng-required=\"true\"\n" +
    "                            focus-delay=\"250\"\n" +
    "                            custom-popover\n" +
    "\n" +
    "                            popover-html=\"Add a department name\"\n" +
    "                            popover-placement=\"left\"\n" +
    "                            popover-trigger=\"manual\"\n" +
    "                            popover-visibility=\"{{isInvalidDepartmentNameUpdate ? true : false}}\"\n" +
    "                            ng-focus=\"setIsInvalidDepartmentNameUpdate(false)\" />\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "               <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">Department Type *</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <input type=\"text\" class=\"form-control\"\n" +
    "                               ng-model=\"department.typeName\"\n" +
    "                               ng-required=\"true\"\n" +
    "                               ng-disabled=\"true\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\" ng-class=\"{'has-errors': isInvalidBelongsToUpdate}\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">Belongs to *</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <ui-select\n" +
    "                            ng-model=\"department.belongsTo\"\n" +
    "                            theme=\"bootstrap\"\n" +
    "                            focus-delay=\"250\"\n" +
    "                            custom-popover popover-html=\"Select an option\"\n" +
    "                            popover-placement=\"left\"\n" +
    "                            popover-trigger=\"manual\"\n" +
    "                            popover-visibility=\"{{isInvalidBelongsToUpdate ? true : false}}\"\n" +
    "                            ng-change=\"setIsInvalidBelongsToUpdate(false)\">\n" +
    "                            <ui-select-match placeholder=\"Select an option\">\n" +
    "                                <i class=\"fa fa-building\"></i>\n" +
    "                                <span>{{$select.selected.title}}</span>\n" +
    "                            </ui-select-match>\n" +
    "                            <ui-select-choices\n" +
    "                            position=\"down\"\n" +
    "                            repeat=\"option.id as option in belongsToList | filter: $select.search\">\n" +
    "                            <div class=\"test\" ng-bind-html=\"option.title | highlight: $select.search\"></div>\n" +
    "                            </ui-select-choices>\n" +
    "                        </ui-select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"white-space\"></div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-sm-12\">\n" +
    "                        <a class=\"btn btn-primary pull-right\"\n" +
    "                           ng-class=\"{'disabled': editInProgress}\"\n" +
    "                           ng-click=\"handleDepartmentUpdateClick()\">\n" +
    "                            <i class=\"fa fa-check-circle\"></i>\n" +
    "                            <span>Update</span>\n" +
    "                        </a>\n" +
    "                        <a class=\"btn btn-default pull-right\" ng-click=\"toggleDepartmentEditForm()\">\n" +
    "                            <i class=\"fa fa-ban\"></i>\n" +
    "                            <span>Cancel</span>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"separator dashed\"></div>\n" +
    "\n" +
    "                <div class=\"btn-adjustment\" ng-if=\"allowUpgrade()\">\n" +
    "                    <a class=\"btn btn-warning col-lg-10 col-lg-offset-1\"\n" +
    "                       ng-disabled=\"DepartmentFormController.isUpgradeDisabled()\"\n" +
    "                       ng-click=\"!DepartmentFormController.isUpgradeDisabled() && DepartmentFormController.handleUpgradeClick()\"\n" +
    "                       uib-popover=\"Mandatory fields must be entered first to upgrade\"\n" +
    "                       popover-placement=\"left\"\n" +
    "                       popover-enable=\"DepartmentFormController.isUpgradeDisabled()\"\n" +
    "                       popover-trigger=\"'mouseenter'\">\n" +
    "                        <i class=\"fa fa-star\"></i>\n" +
    "                        <span>Upgrade Department</span>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                \n" +
    "                <div class=\"form-group\" ng-if=\"allowDowngrade()\">\n" +
    "                    <a class=\"btn btn-danger col-lg-10 col-lg-offset-1\"\n" +
    "                       ng-click=\"handleDowngradeClick()\">\n" +
    "                        <i class=\"fa fa-arrow-circle-o-down\"></i>\n" +
    "                        <span>Downgrade to simple department</span>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\" ng-if=\"allowLoginAs()\">\n" +
    "                    <a class=\"btn btn-info col-lg-10 col-lg-offset-1\"\n" +
    "                       ng-disabled=\"DepartmentFormController.isLoginRestricted()\"\n" +
    "                       ng-click=\"!DepartmentFormController.isLoginRestricted() && handleLoginAsClick()\"\n" +
    "\n" +
    "                       uib-tooltip='Login has been disabled due to permission. Contact {{DepartmentFormController.tuSupportEmail}}'\n" +
    "                       tooltip-enable=\"DepartmentFormController.isLoginRestricted()\"\n" +
    "                       tooltip-placement=\"left\">\n" +
    "                        <i class=\"fa fa-sign-in\"></i>\n" +
    "                        <span>Login as Department</span>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/departments/tuProfileUpgradeClientDepartmentFormView.html',
    "<div class=\"ibox-title\">\n" +
    "    <h5>Upgrade Department</h5>\n" +
    "    <div class=\"ibox-tools\">\n" +
    "        <a class=\"close-link\" ng-click=\"DepartmentFormController.toggleClientUpgradeForm()\">\n" +
    "            <i class=\"fa fa-times\"></i>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"ibox block-institution\">\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <form name=\"forms.upgradeTuDepartment\" class=\"clearfix form-horizontal\" novalidate>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-sm-3\">To</label>\n" +
    "                <div class=\"col-sm-9\">{{upgradeEmailsTo}}</div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-sm-3\">Subject</label>\n" +
    "                <div class=\"col-sm-9\">I would like more information about Upgrading the Department.</div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-sm-3\">Name</label>\n" +
    "                <div class=\"col-sm-9\">\n" +
    "                    {{upgradeRequest.name}}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-sm-3\">Email</label>\n" +
    "                <div class=\"col-sm-9\">\n" +
    "                    {{upgradeRequest.email}}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-sm-3\">Comments</label>\n" +
    "                <div class=\"col-sm-9\">\n" +
    "                    <textarea rows=\"7\" cols=\"50\" placeholder=\"Comments...\" ng-model=\"upgradeRequest.comments\" class=\"form-control no-resize\" ></textarea>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-lg-6 text-left\">\n" +
    "                    <a class=\"btn btn-default btn-sm btn-block\" ng-click=\"DepartmentFormController.toggleClientUpgradeForm()\">Close</a>\n" +
    "                </div>\n" +
    "                <div class=\"col-lg-6 text-right\">\n" +
    "                    <a class=\"btn btn-primary btn-sm btn-block\" ng-class=\"{'disabled': TopUniversitiesController.upgradeInProgress}\" ng-click=\"TopUniversitiesController.handleSendUpgradeRequestClick()\">Send</a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/media/subtabs/brochures/tuProfileMediaBrochuresSidebarView.html',
    "<div class=\"ibox\" ng-class=\"getSelected() === 4 ? 'selected' : 'collapsed'\"  ng-controller=\"TuMediaBrochuresSidebarController as TuMediaBrochuresSidebarController\">\n" +
    "    <div class=\"ibox-title clickable\" ng-click=\"setSelected(4)\">\n" +
    "        <h5>Brochures ({{getBrochureItems().length}})</h5>\n" +
    "        <div class=\"ibox-tools\">\n" +
    "            <a>\n" +
    "                <i class=\"fa fa-chevron-up\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <div class=\"addForm\">\n" +
    "            <form class=\"form-horizontal\" name=\"forms.formBrochure\" id=\"form-brochure\" novalidate>\n" +
    "                <div class=\"alert alert-info\">\n" +
    "                    <p>\n" +
    "                        <i class=\"fa fa-info-circle\"></i>\n" +
    "                        <span>Please add your brochure title and link.</span><br />\n" +
    "                        <span>Drag and drop brochures from left to right to change the order.</span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "\n" +
    "                <div>\n" +
    "                    <div class=\"form-group\" ng-class=\"{'has-errors': getHasErrors()}\">\n" +
    "                        <div class=\"col-sm-12\" use-tu-subtypes>\n" +
    "                            <div class=\"checkbox-inline i-checkbox\">\n" +
    "                                <label for=\"brochure-overview\">\n" +
    "                                    <input i-checkbox type=\"checkbox\" name=\"overview\" id=\"brochure-overview\" focus-if=\"getDisplayTypesValidation()\" focus-delay=\"250\" ng-model=\"selectedBrochure.master\"  ng-change=\"selectedBrochure.master? setDisplayTypesValidation(false) : ''\" />\n" +
    "                                    <span>Overview</span>\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"checkbox-inline i-checkbox\">\n" +
    "                                <label for=\"brochure-undergraduate\">\n" +
    "                                    <input i-checkbox type=\"checkbox\" name=\"undergraduate\" id=\"brochure-undergraduate\" ng-model=\"selectedBrochure.ug\" ng-change=\"selectedBrochure.ug? setDisplayTypesValidation(false) : ''\" />\n" +
    "                                    <span>Undergraduate</span>\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"checkbox-inline i-checkbox\">\n" +
    "                                <label for=\"brochure-postgraduate\">\n" +
    "                                    <input i-checkbox type=\"checkbox\" name=\"postgraduate\" id=\"brochure-postgraduate\" ng-model=\"selectedBrochure.pg\" ng-change=\"selectedBrochure.pg? setDisplayTypesValidation(false) : ''\" />\n" +
    "                                    <span>Postgraduate</span>\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div ng-class=\"getDisplayTypesValidation()? 'has-errors' : ''\" >\n" +
    "                                <span\n" +
    "                                    custom-popover popover-html=\"Assign brochure to at least one of the three profiles\" \n" +
    "                                    popover-placement=\"left\"\n" +
    "                                    popover-trigger=\"manual\"\n" +
    "                                    popover-visibility=\"{{getDisplayTypesValidation() ? true : false}}\"></span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\" ng-class=\"{'has-errors': isInvalidTitle}\">\n" +
    "                        <label class=\"control-label col-sm-3 col-md-2\" for=\"brochure-title\">\n" +
    "                            <span>Title *</span>\n" +
    "                            <small>110 characters</small>\n" +
    "                        </label>\n" +
    "                        <div class=\"col-sm-9 col-md-10\">\n" +
    "                            <input class=\"form-control\"\n" +
    "                                   name=\"brochure-title\"\n" +
    "                                   id=\"brochure-title\"\n" +
    "                                   maxlength=\"110\"\n" +
    "                                   ng-required=\"required\"\n" +
    "                                   type=\"text\"\n" +
    "                                   focus-if=\"isHighlighted\"\n" +
    "                                   focus-delay=\"250\"\n" +
    "\n" +
    "                                   custom-popover\n" +
    "                                   popover-html=\"Add a brochure title\"\n" +
    "                                   popover-placement=\"left\"\n" +
    "                                   popover-trigger=\"manual\"\n" +
    "                                   popover-visibility=\"{{isInvalidTitle ? true : false}}\"\n" +
    "                                   ng-focus=\"setIsInvalidTitle(false)\"\n" +
    "                                   ng-model=\"selectedBrochure.name\" />\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\" ng-class=\"{'has-errors': isInvalidUrl}\">\n" +
    "                        <label class=\"control-label col-sm-3 col-md-2\">\n" +
    "                            <span>URL *</span>\n" +
    "                        </label>\n" +
    "                        <div class=\"col-sm-9 col-md-10\">\n" +
    "                            <input class=\"form-control\"\n" +
    "                                   name=\"url\"\n" +
    "                                   type=\"url\"\n" +
    "                                   placeholder=\"http://\"\n" +
    "                                   ng-required=\"required\"\n" +
    "                                   ng-model=\"selectedBrochure.url\"\n" +
    "                                   ng-pattern=\"TuMediaBrochuresSidebarController.urlPattern\"\n" +
    "                                   ng-keyup=\"TuMediaBrochuresSidebarController.onKeyUp($event)\"\n" +
    "                                   ng-focus=\"setIsInvalidUrl(false)\"\n" +
    "\n" +
    "                                   custom-popover\n" +
    "                                   popover-html=\"Add a valid brochure link\"\n" +
    "                                   popover-placement=\"left\"\n" +
    "                                   popover-trigger=\"manual\"\n" +
    "                                   popover-visibility=\"{{isInvalidUrl ? true : false}}\"/>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group m-b-none\">\n" +
    "                        <div class=\"col-sm-12\">\n" +
    "                            <button class=\"btn btn-primary pull-right\" ng-click=\"saveBrochureForm(selectedBrochure)\">\n" +
    "                                <i class=\"fa fa-check-circle\"></i>\n" +
    "                                <span>{{isEditMode() ? 'Update' : 'Save'}}</span>\n" +
    "                            </button>\n" +
    "                            <button class=\"btn btn-warning pull-right\" ng-click=\"clearBrochureForm(selectedBrochure)\">\n" +
    "                                <i class=\"fa fa-ban\"></i>\n" +
    "                                <span>Clear</span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/media/subtabs/brochures/tuProfileMediaBrochuresView.html',
    "<div ng-controller=\"TuMediaBrochuresController\">\n" +
    "    <h3 class=\"heading\">Brochures ({{brochureItems.length}})</h3>\n" +
    "    <div class=\"tab-body\">\n" +
    "        <div class=\"sort-filter\" use-tu-subtypes>\n" +
    "            <a class=\"btn btn-link btn-overview\" ng-click=\"filter(typeOverview())\" ng-class=\"type === typeOverview() ? 'active' : 'inactive'\">\n" +
    "                <i class=\"fa fa-book\"></i>\n" +
    "                <span>Overview ({{(brochureItems | filter:{master:true}).length}})</span>\n" +
    "            </a>\n" +
    "            <a class=\"btn btn-link btn-university\" ng-click=\"filter(typeUndergraduate())\" ng-class=\"type === typeUndergraduate() ? 'active' : 'inactive'\">\n" +
    "                <i class=\"fa fa-university\"></i>\n" +
    "                <span>Undergraduate ({{(brochureItems | filter:{ug:true}).length}})</span>\n" +
    "            </a>\n" +
    "            <a class=\"btn btn-link btn-graduation\" ng-click=\"filter(typePostgraduate())\" ng-class=\"type === typePostgraduate() ? 'active' : 'inactive'\">\n" +
    "                <i class=\"fa fa-graduation-cap\"></i>\n" +
    "                <span>Postgraduate ({{(brochureItems | filter:{pg:true}).length}})</span>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"gallery\">\n" +
    "            <div class=\"grid-view upload\" ng-class=\"selectedItem().id === '' ? 'selected' : 'unselected'\" ng-click=\"selectBrochure()\" ng-click=\"selectBrochure()\">\n" +
    "                <div class=\"source-link\">\n" +
    "                    <i class=\"fa fa-plus\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ui-sortable=\"sortableOptions\" ng-model=\"filteredBrochureItems\">\n" +
    "                <div class=\"grid-view\" ng-class=\"selectedItem().id === item.id ? 'selected' : 'unselected'\" ng-click=\"selectBrochure(item)\" ng-repeat=\"item in filteredBrochureItems\">\n" +
    "                    \n" +
    "                    <div class=\"preview\" ng-class=\"item.imageUrl ? '' : 'overlay' \">\n" +
    "                        <img ng-src=\"{{item.imageUrl || '/images/media/pdf-thumbnail.jpg'}}\"/>\n" +
    "                    </div>\n" +
    "                    \n" +
    "                    <div class=\"info\">\n" +
    "                        <div class=\"title\" item-order=\"{{item['orderType'][type]}}\">{{item.name}}</div>\n" +
    "                        <div class=\"types\" use-tu-subtypes>\n" +
    "                            <i class=\"fa fa-book\" ng-show=\"item.master\"></i>\n" +
    "                            <i class=\"fa fa-university\" ng-show=\"item.ug\"></i>\n" +
    "                            <i class=\"fa fa-graduation-cap\" ng-show=\"item.pg\"></i>\n" +
    "                        </div>\n" +
    "                        <div class=\"actions\">\n" +
    "                            <a href=\"{{item.url}}\" target=\"_blank\" title=\"View {{item.name}}\">\n" +
    "                                <i class=\"fa fa-search\"></i>\n" +
    "                            </a>\n" +
    "                            <a ng-click=\"deleteBrochure(item)\" title=\"Delete {{item.name}}\">\n" +
    "                                <i class=\"fa fa-times-circle\"></i>\n" +
    "                            </a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/media/subtabs/images/tuProfileMediaImagesSidebarView.html',
    "<div class=\"ibox\" ng-class=\"getSelected() === 1 ? 'selected' : 'collapsed'\" ng-controller=\"TuMediaImagesSidebarController\">\n" +
    "    <div class=\"ibox-title clickable\" ng-click=\"setSelected(1)\">\n" +
    "        <h5>Images ({{getImageItems().length}})</h5>\n" +
    "        <div class=\"ibox-tools\">\n" +
    "            <a>\n" +
    "                <i class=\"fa fa-chevron-up\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <div class=\"addForm\" ng-class=\"getImageUploadingInProgress() ? 'modal-overlay' : '' \">\n" +
    "            <form class=\"form-horizontal\" name=\"forms.formImage\" id=\"form-image\" novalidate>\n" +
    "                <div class=\"alert alert-info\" ng-hide=\"selectedImage.id.length > 0\">\n" +
    "                    <p>\n" +
    "                        <i class=\"fa fa-info-circle\"></i>\n" +
    "                        <span>Please click on the upload sign to upload an image or drag and drop image into it.</span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "                <div class=\"alert alert-info\">\n" +
    "                    <p>\n" +
    "                        <i class=\"fa fa-info-circle\"></i>\n" +
    "                        <span>File must be: Less than 400KB / in jpg, jpeg format.</span><br />\n" +
    "                        <span>Images are scaled to 703 x 398 on front-end site.</span><br />\n" +
    "                        <span>Drag and drop images from left to right to change the order.</span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "                \n" +
    "                <div ng-show=\"selectedImage.id.length > 0\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <div class=\"col-sm-12\" use-tu-subtypes>\n" +
    "                            <div class=\"checkbox-inline i-checkbox\">\n" +
    "                                <label for=\"overview\">\n" +
    "                                    <input i-checkbox type=\"checkbox\" name=\"overview\" id=\"overview\" ng-model=\"selectedImage.master\" focus-if=\"getDisplayIsValidType()\" focus-delay=\"250\" ng-change=\"selectedImage.master? setDisplayIsValidType(false) : ''\"/>\n" +
    "                                    <span>Overview</span>\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "                            <div class=\"checkbox-inline i-checkbox\">\n" +
    "                                <label for=\"undergraduate\">\n" +
    "                                    <input i-checkbox type=\"checkbox\" name=\"undergraduate\" id=\"undergraduate\" ng-model=\"selectedImage.ug\" ng-change=\"selectedImage.ug? setDisplayIsValidType(false) : ''\"/>\n" +
    "                                    <span>Undergraduate</span>\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "                            <div class=\"checkbox-inline i-checkbox\">\n" +
    "                                <label for=\"postgraduate\">\n" +
    "                                    <input i-checkbox type=\"checkbox\" name=\"postgraduate\" id=\"postgraduate\" ng-model=\"selectedImage.pg\" ng-change=\"selectedImage.pg? setDisplayIsValidType(false) : ''\"/>\n" +
    "                                    <span>Postgraduate</span>\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "                            <div ng-class=\"getDisplayIsValidType()? 'has-errors' : ''\" >\n" +
    "                                <span \n" +
    "                                    custom-popover popover-html=\"Assign image to at least one of the three profiles\"\n" +
    "                                    popover-placement=\"left\"\n" +
    "                                    popover-trigger=\"manual\"\n" +
    "                                    popover-visibility=\"{{getDisplayIsValidType() ? true : false}}\"></span>   \n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3 col-md-2\" for=\"title\">\n" +
    "                            <span>Title</span>\n" +
    "                            <small>110 characters</small>\n" +
    "                        </label>\n" +
    "                        <div class=\"col-sm-9 col-md-10\">\n" +
    "                            <input class=\"form-control\" name=\"title\" id=\"title\" placeHolder=\"Add title\" maxlength=\"110\" type=\"text\" ng-model=\"selectedImage.name\" focus-if=\"isHighlighted\" focus-delay=\"250\"/>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    \n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3 col-md-2\" for=\"description\">\n" +
    "                            <span>Description</span>\n" +
    "                            <small>160 characters</small>\n" +
    "                        </label>\n" +
    "                        <div class=\"col-sm-9 col-md-10\">\n" +
    "                            <textarea id=\"description\" class=\"form-control\" name=\"description\" placeHolder=\"Add description\" maxlength=\"160\" ng-model=\"selectedImage.description\"></textarea>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group m-b-none\">\n" +
    "                        <div class=\"col-sm-12\">\n" +
    "                            <button class=\"btn btn-primary pull-right\" ng-class=\"{'disabled': submitInProgress}\" ng-click=\"saveImageForm(selectedImage)\">\n" +
    "                                <i class=\"fa fa-check-circle\"></i>\n" +
    "                                <span>{{isEditMode() ? 'Update' : 'Save'}}</span>\n" +
    "                            </button>\n" +
    "                            <button class=\"btn btn-warning pull-right\" ng-class=\"{'disabled': submitInProgress}\" ng-click=\"clearImageForm(selectedImage)\">\n" +
    "                                <i class=\"fa fa-ban\"></i>\n" +
    "                                <span>{{isEditMode() ? 'Clear' : 'Cancel'}}</span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/profiles/tu/media/subtabs/images/tuProfileMediaImagesView.html',
    "<div ng-controller=\"TuMediaImagesController as TuMediaImagesController\">\n" +
    "    <h3 class=\"heading\">Images ({{imageItems.length}})</h3>\n" +
    "    <div class=\"tab-body\">\n" +
    "        <div class=\"sort-filter\" use-tu-subtypes>\n" +
    "            <a class=\"btn btn-link btn-overview\" ng-click=\"filter(typeOverview(), true)\" ng-class=\"type === typeOverview() ? 'active' : 'inactive'\">\n" +
    "                <i class=\"fa fa-book\"></i>\n" +
    "                <span>Overview ({{uploadedImagesCount[typeOverview()]}}/{{TuMediaImagesController.maxImages}})</span>\n" +
    "            </a> | \n" +
    "            <a class=\"btn btn-link btn-university\" ng-click=\"filter(typeUndergraduate(), true)\" ng-class=\"type === typeUndergraduate() ? 'active' : 'inactive'\">\n" +
    "                <i class=\"fa fa-university\"></i>\n" +
    "                <span>Undergraduate ({{uploadedImagesCount[typeUndergraduate()]}}/{{TuMediaImagesController.maxImages}})</span>\n" +
    "            </a> | \n" +
    "            <a class=\"btn btn-link btn-graduation\" ng-click=\"filter(typePostgraduate(), true)\" ng-class=\"type === typePostgraduate() ? 'active' : 'inactive'\">\n" +
    "                <i class=\"fa fa-graduation-cap\"></i>\n" +
    "                <span>Postgraduate ({{uploadedImagesCount[typePostgraduate()]}}/{{TuMediaImagesController.maxImages}})</span>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"gallery\">\n" +
    "            <div class=\"grid-view upload\" ng-class=\"isSelected() ? 'selected' : 'unselected'\" ng-click=\"selectImage()\">\n" +
    "                <div ng-show=\"!isTemporary()\">\n" +
    "                    <form name=\"forms.imageForm\"\n" +
    "                          class=\"dropzone image-form\"\n" +
    "                          enctype=\"multipart/form-data\"\n" +
    "                          ng-dropzone\n" +
    "                          dropzone=\"TuMediaImagesController.dropZoneImageInstance\"\n" +
    "                          dropzone-config=\"imageConfig.dropzone\"\n" +
    "                          event-handlers=\"imageConfig.eventHandlers\"\n" +
    "                          novalidate >\n" +
    "                        <div class=\"upload-image\">\n" +
    "                            <i class=\"fa fa-upload\"></i>\n" +
    "                        </div>\n" +
    "                        <div class=\"fallback\">\n" +
    "                            <input name=\"file\" type=\"file\" />\n" +
    "                        </div>\n" +
    "                        <div class=\"dz-message\" ng-show=\"uploadEnabled\">\n" +
    "                            <i class=\"fa fa-upload\"></i>\n" +
    "                        </div>\n" +
    "                        <div class=\"dropzone-previews\"></div>\n" +
    "                    </form>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"preview\" ng-show=\"isTemporary()\">\n" +
    "                    <img ng-src=\"{{item.thumbnailUrl || '/images/media/media-image.png'}}\"/>\n" +
    "                </div>\n" +
    "                \n" +
    "                <div class=\"info\" ng-show=\"isTemporary()\" ng-class=\"getImageUploadingInProgress() ? 'modal-overlay' : '' \">\n" +
    "                    <div class=\"title\" item-order=\"{{item['orderType'][type]}}\">\n" +
    "                        {{item.name}}\n" +
    "                    </div>\n" +
    "                    <div class=\"types\">\n" +
    "                        <i class=\"fa fa-book\" ng-show=\"item.master\"></i>\n" +
    "                        <i class=\"fa fa-university\" ng-show=\"item.ug\"></i>\n" +
    "                        <i class=\"fa fa-graduation-cap\" ng-show=\"item.pg\"></i>\n" +
    "                    </div>\n" +
    "                    <div class=\"actions\">\n" +
    "                        <a href=\"{{item.url}}\" target=\"_blank\" title=\"View {{item.name}}\">\n" +
    "                            <i class=\"fa fa-search\"></i>\n" +
    "                        </a>\n" +
    "                        <a ng-click=\"deleteImage(item)\" title=\"Delete {{item.name}}\">\n" +
    "                            <i class=\"fa fa-times-circle\"></i>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ui-sortable=\"sortableOptions\" ng-model=\"filteredImageItems\">\n" +
    "                <div class=\"grid-view\" ng-class=\"selectedItem().id === item.id ? 'selected' : 'unselected'\" ng-click=\"selectImage(item)\" ng-repeat=\"item in filteredImageItems\">\n" +
    "                    <div class=\"preview\">\n" +
    "                        <img ng-src=\"{{item.thumbnailUrl || '/images/media/media-image.png'}}\"/>\n" +
    "                    </div>\n" +
    "                    <div class=\"info\">\n" +
    "                        <div class=\"title\" item-order=\"{{item['orderType'][type]}}\">\n" +
    "                            {{item.name}}\n" +
    "                        </div>\n" +
    "                        <div class=\"types\" use-tu-subtypes>\n" +
    "                            <i class=\"fa fa-book\" ng-show=\"item.master\"></i>\n" +
    "                            <i class=\"fa fa-university\" ng-show=\"item.ug\"></i>\n" +
    "                            <i class=\"fa fa-graduation-cap\" ng-show=\"item.pg\"></i>\n" +
    "                        </div>\n" +
    "                        <div class=\"actions\">\n" +
    "                            <a ng-click=\"openLightboxModal($index, item)\" title=\"View {{item.name}}\">\n" +
    "                                <i class=\"fa fa-search\"></i>\n" +
    "                            </a>\n" +
    "                            <a ng-click=\"deleteImage(item)\" title=\"Delete {{item.name}}\">\n" +
    "                                <i class=\"fa fa-times-circle\"></i>\n" +
    "                            </a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <ul>\n" +
    "                <li ng-repeat=\"image in images\">\n" +
    "                    <a ng-click=\"openLightboxModal($index)\">\n" +
    "                        <img ng-src=\"{{image.thumbUrl}}\" class=\"img-thumbnail\">\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/profiles/tu/media/subtabs/socialMedia/tuProfileMediaSocialMediaSidebarView.html',
    "<div class=\"ibox\" ng-class=\"getSelected() === 3 ? 'selected' : 'collapsed'\" ng-controller=\"TuMediaSocialMediasSidebarController as TuMediaSocialMediasSidebarController\">\n" +
    "    <div class=\"ibox-title clickable\" ng-click=\"setSelected(3)\">\n" +
    "        <h5>Social Media</h5>\n" +
    "        <div class=\"ibox-tools\">\n" +
    "            <a>\n" +
    "                <i class=\"fa fa-chevron-up\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <p class=\"bold text-capitalize\">{{type()}}</p>\n" +
    "        \n" +
    "        <div class=\"addForm\">\n" +
    "            <form class=\"form-horizontal\" name=\"forms.formSocialMedia\" id=\"form-social-media\" novalidate>\n" +
    "                <div class=\"alert alert-info\">\n" +
    "                    <p>\n" +
    "                        <i class=\"fa fa-info-circle\"></i>\n" +
    "                        <span>Please add your</span>\n" +
    "                        <span class=\"text-capitalize\">{{type() === \"other\" ? \"Website\" : type()}}</span>\n" +
    "                        <span>link, e.g.</span>\n" +
    "                        <span class=\"text-nowrap\">{{TuMediaSocialMediasSidebarController.selectedSocialMediaUrl}}</span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-repeat=\"selectedSocialMedia in selectedSocialMedia[type()]\">\n" +
    "                    <div ng-show=\"selectedSocialMedia.display\">\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <div class=\"col-sm-12\">\n" +
    "                                <div class=\"checkbox-inline i-checkbox\">\n" +
    "                                    <label>\n" +
    "                                        <input i-checkbox type=\"checkbox\" ng-change=\"checkboxChanged(selectedSocialMedia, $index, 'master')\" ng-click=\"resetInvalidCheckbox($index)\" name=\"overview\" id=\"social-media-overview-{{$index}}\" focus-if=\"getDisplayTypesValidation()\" ng-blur=\"setDisplayTypesValidation(false)\" focus-delay=\"250\" ng-model=\"selectedSocialMedia.master\" />\n" +
    "                                        <span>Overview</span>\n" +
    "                                    </label>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"checkbox-inline i-checkbox\">\n" +
    "                                    <label>\n" +
    "                                        <input i-checkbox type=\"checkbox\" ng-change=\"checkboxChanged(selectedSocialMedia, $index, 'ug')\" ng-click=\"resetInvalidCheckbox($index)\"  name=\"undergraduate\" id=\"social-media-undergraduate-{{$index}}\" ng-model=\"selectedSocialMedia.ug\" />\n" +
    "                                        <span>Undergraduate</span>\n" +
    "                                    </label>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"checkbox-inline i-checkbox\">\n" +
    "                                    <label>\n" +
    "                                        <input i-checkbox type=\"checkbox\" ng-change=\"checkboxChanged(selectedSocialMedia, $index, 'pg')\" ng-click=\"resetInvalidCheckbox($index)\"  name=\"postgraduate\" id=\"social-media-postgraduate-{{$index}}\" ng-model=\"selectedSocialMedia.pg\" />\n" +
    "                                        <span>Postgraduate</span>\n" +
    "                                    </label>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div ng-class=\"invalidCheckboxes[$index] ? 'has-errors' : ''\" >\n" +
    "                                    <span \n" +
    "                                        custom-popover popover-html=\"Assign social media to at least one of the three profiles\" \n" +
    "                                        popover-placement=\"left\" \n" +
    "                                        popover-trigger=\"manual\" \n" +
    "                                        popover-visibility=\"{{invalidCheckboxes[$index]}}\"></span>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"form-group\" ng-class=\"invalidFields[$index] ? 'has-errors' : ''\">\n" +
    "                            <label class=\"control-label col-sm-3 col-md-2\">\n" +
    "                                <span>URL *</span>\n" +
    "                            </label>\n" +
    "                            <div class=\"col-sm-9 col-md-10\">\n" +
    "                            <input class=\"form-control\"\n" +
    "                                   name=\"url{{$index}}\"\n" +
    "                                   type=\"url\"\n" +
    "                                   placeholder=\"http://\"\n" +
    "                                   focus-if=\"(isHighlighted && $index === 0) ? true : false\"\n" +
    "                                   focus-delay=\"250\"\n" +
    "                                   ng-pattern=\"TuMediaSocialMediasSidebarController.urlPattern\"\n" +
    "                                   ng-model=\"selectedSocialMedia.url\"\n" +
    "                                   ng-focus = \"resetInvalidField($index)\"\n" +
    "                                   ng-keyup=\"TuMediaSocialMediasSidebarController.onKeyUp($event, type(), $index)\"\n" +
    "\n" +
    "                                   custom-popover\n" +
    "                                   popover-trigger = \"manual\"\n" +
    "                                   popover-visibility = \"{{invalidFields[$index]}}\"\n" +
    "                                   popover-html=\"Add a valid <span class='text-capitalize'>{{type() === 'other' ? 'Website' : type()}}</span> link\"\n" +
    "                                   popover-placement=\"left\"/>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"separator dashed\"></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group m-b-none\">\n" +
    "                    <div class=\"col-sm-12\">\n" +
    "                        <button class=\"btn btn-primary pull-right\" ng-click=\"saveSocialMediaForm()\">\n" +
    "                            <i class=\"fa fa-check-circle\"></i>\n" +
    "                            <span>{{isEditMode(type()) ? 'Update' : 'Save'}}</span>\n" +
    "                        </button>\n" +
    "                        <button class=\"btn btn-warning pull-right\" ng-click=\"clearSocialMediaForm()\">\n" +
    "                            <i class=\"fa fa-ban\"></i>\n" +
    "                            <span>Clear</span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/media/subtabs/socialMedia/tuProfileMediaSocialMediaView.html',
    "<div ng-controller=\"TuMediaSocialMediasController\">\n" +
    "    <h3 class=\"heading\">Social Media</h3>\n" +
    "    <div class=\"tab-body\">\n" +
    "        <div class=\"sort-filter\">\n" +
    "            <a class=\"btn btn-link btn-overview\" ng-click=\"filter(typeOverview())\" ng-class=\"type === typeOverview() ? 'active' : 'inactive'\">\n" +
    "                <i class=\"fa fa-book\"></i>\n" +
    "                <span>Overview</span>\n" +
    "            </a>\n" +
    "            <a class=\"btn btn-link btn-university\" ng-click=\"filter(typeUndergraduate())\" ng-class=\"type === typeUndergraduate() ? 'active' : 'inactive'\">\n" +
    "                <i class=\"fa fa-university\"></i>\n" +
    "                <span>Undergraduate</span>\n" +
    "            </a>\n" +
    "            <a class=\"btn btn-link btn-graduation\" ng-click=\"filter(typePostgraduate())\" ng-class=\"type === typePostgraduate() ? 'active' : 'inactive'\">\n" +
    "                <i class=\"fa fa-graduation-cap\"></i>\n" +
    "                <span>Postgraduate</span>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"gallery\">\n" +
    "            <div class=\"grid-view\" ng-repeat=\"(key, item) in socialMediaItems\" ng-class=\"type === key ? 'selected' : 'unselected'\" ng-click=\"selectSocialMedia(key)\">\n" +
    "                \n" +
    "                <div class=\"add-link\" ng-class=\"item.master || item.ug || item.pg ? 'hidden' : 'visible'\">\n" +
    "                    <i class=\"fa fa-plus\"></i>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"preview\" ng-class=\"item.master || item.ug || item.pg ? '' : 'overlay'\">\n" +
    "                    <img ng-src=\"/images/media/{{key}}-thumbnail.jpg\"/>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"info\">\n" +
    "                    <div class=\"title text-capitalize\">{{key}}</div>\n" +
    "                    <div class=\"types\">\n" +
    "                        <i class=\"fa fa-book\" ng-show=\"item.master\"></i>\n" +
    "                        <i class=\"fa fa-university\" ng-show=\"item.ug\"></i>\n" +
    "                        <i class=\"fa fa-graduation-cap\" ng-show=\"item.pg\"></i>\n" +
    "                    </div>\n" +
    "                    <div class=\"actions hidden\">\n" +
    "                        <a href=\"{{item.url}}\" target=\"_blank\" title=\"View {{item.name}}\">\n" +
    "                            <i class=\"fa fa-search\"></i>\n" +
    "                        </a>\n" +
    "                        <a ng-click=\"deleteVideo(item)\" title=\"Delete {{item.name}}\">\n" +
    "                            <i class=\"fa fa-times-circle\"></i>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/media/subtabs/videos/tuProfileMediaVideosSidebarView.html',
    "<div class=\"ibox\" ng-class=\"getSelected() === 2 ? 'selected' : 'collapsed'\" ng-controller=\"TuMediaVideosSidebarController as TuMediaVideosSidebarController\">\n" +
    "    <div class=\"ibox-title clickable\" ng-click=\"setSelected(2)\">\n" +
    "        <h5>Videos ({{getVideoItems().length}})</h5>\n" +
    "        <div class=\"ibox-tools\">\n" +
    "            <a>\n" +
    "                <i class=\"fa fa-chevron-up\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <div class=\"addForm\">\n" +
    "            <form id=\"form-video\" class=\"form-horizontal\" name=\"forms.formVideo\" novalidate>\n" +
    "                <div class=\"alert alert-info\">\n" +
    "                    <p>\n" +
    "                        <i class=\"fa fa-info-circle\"></i>\n" +
    "                        <span>Please add a YouTube link. Shortened video links with .be extension are not allowed.</span><br />\n" +
    "                        <span>Video title & description will be retrieved from YouTube.</span><br />\n" +
    "                        <span>Drag and drop videos from left to right to change the order.</span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "                <div ng-class=\"getHasErrors()? 'has-errors' : ''\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <div class=\"col-sm-12\" use-tu-subtypes>\n" +
    "                            <div class=\"checkbox-inline i-checkbox\">\n" +
    "                                <label for=\"overview\">\n" +
    "                                    <input i-checkbox type=\"checkbox\" name=\"overview\" id=\"overview\" focus-if=\"getDisplayTypesValidation()\" focus-delay=\"250\" ng-model=\"selectedVideo.master\" ng-change=\"selectedVideo.master? setDisplayTypesValidation(false) : ''\"/>\n" +
    "                                    <span>Overview</span>\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"checkbox-inline i-checkbox\">\n" +
    "                                <label for=\"undergraduate\">\n" +
    "                                    <input i-checkbox type=\"checkbox\" name=\"undergraduate\" id=\"undergraduate\" ng-model=\"selectedVideo.ug\" ng-change=\"selectedVideo.ug? setDisplayTypesValidation(false) : ''\" />\n" +
    "                                    <span>Undergraduate</span>\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "                            \n" +
    "                            <div class=\"checkbox-inline i-checkbox\">\n" +
    "                                <label for=\"postgraduate\">\n" +
    "                                    <input i-checkbox type=\"checkbox\" name=\"postgraduate\" id=\"postgraduate\" ng-model=\"selectedVideo.pg\" ng-change=\"selectedVideo.pg? setDisplayTypesValidation(false) : ''\"/>\n" +
    "                                    <span>Postgraduate</span>\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div ng-class=\"getDisplayTypesValidation()? 'has-errors' : ''\" >\n" +
    "                                <span \n" +
    "                                    custom-popover popover-html=\"Assign video to at least one of the three profiles\"\n" +
    "                                    popover-placement=\"left\"\n" +
    "                                    popover-trigger=\"manual\"\n" +
    "                                    popover-visibility=\"{{getDisplayTypesValidation() ? true : false}}\"></span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\" ng-class=\"{'has-errors': getHasErrors()}\">\n" +
    "                        <label class=\"control-label col-sm-3 col-md-2\">\n" +
    "                            <span>URL *</span>\n" +
    "                        </label>\n" +
    "                        <div class=\"col-sm-9 col-md-10\">\n" +
    "                            <input class=\"form-control\"\n" +
    "                                   name=\"url\"\n" +
    "                                   type=\"url\"\n" +
    "                                   placeholder=\"http://\"\n" +
    "                                   ng-required=\"required\"\n" +
    "                                   focus-if=\"isHighlighted\"\n" +
    "                                   focus-delay=\"250\"\n" +
    "                                   ng-model=\"selectedVideo.url\"\n" +
    "                                   ng-pattern=\"youtubeUrlPattern\"\n" +
    "                                   ng-keyup=\"TuMediaVideosSidebarController.onKeyUp($event)\"\n" +
    "                                   ng-focus=\"setHasErrors(false)\"\n" +
    "\n" +
    "                                   custom-popover\n" +
    "                                   popover-html=\"Add a valid YouTube link\"\n" +
    "                                   popover-placement=\"left\"\n" +
    "                                   popover-trigger=\"manual\"\n" +
    "                                   popover-visibility=\"{{getHasErrors() ? true : false}}\"/>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    \n" +
    "                    <div class=\"form-group m-b-none\">\n" +
    "                        <div class=\"col-sm-12\">\n" +
    "                            <button class=\"btn btn-primary pull-right\" ng-click=\"saveVideoForm(selectedVideo)\">\n" +
    "                                <i class=\"fa fa-check-circle\"></i>\n" +
    "                                <span>{{isEditMode() ? 'Update' : 'Save'}}</span>\n" +
    "                            </button>\n" +
    "                             <button class=\"btn btn-warning pull-right\" ng-click=\"clearVideoForm(selectedVideo)\">\n" +
    "                                <i class=\"fa fa-ban\"></i>\n" +
    "                                <span>Clear</span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/media/subtabs/videos/tuProfileMediaVideosView.html',
    "<div ng-controller=\"TuMediaVideosController\">\n" +
    "    <h3 class=\"heading\">Videos ({{videoItems.length}})</h3>\n" +
    "    <div class=\"tab-body\">\n" +
    "        <div class=\"sort-filter\" use-tu-subtypes>\n" +
    "            <a class=\"btn btn-link btn-overview\" ng-click=\"filter(typeOverview())\" ng-class=\"type === typeOverview() ? 'active' : 'inactive'\">\n" +
    "                <i class=\"fa fa-book\"></i>\n" +
    "                <span>Overview ({{(videoItems | filter:{master:true}).length}})</span>\n" +
    "            </a> |\n" +
    "            <a class=\"btn btn-link btn-university\" ng-click=\"filter(typeUndergraduate())\" ng-class=\"type === typeUndergraduate() ? 'active' : 'inactive'\">\n" +
    "                <i class=\"fa fa-university\"></i>\n" +
    "                <span>Undergraduate ({{(videoItems | filter:{ug:true}).length}})</span>\n" +
    "            </a> |\n" +
    "            <a class=\"btn btn-link btn-graduation\" ng-click=\"filter(typePostgraduate())\" ng-class=\"type === typePostgraduate() ? 'active' : 'inactive'\">\n" +
    "                <i class=\"fa fa-graduation-cap\"></i>\n" +
    "                <span>Postgraduate ({{(videoItems | filter:{pg:true}).length}})</span>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"gallery\">\n" +
    "            <div class=\"grid-view upload\" ng-class=\"selectedItem().id === '' ? 'selected' : 'unselected'\" ng-click=\"selectVideo()\" ng-click=\"selectVideo()\">\n" +
    "                <div class=\"source-link\">\n" +
    "                    <i class=\"fa fa-plus\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ui-sortable=\"sortableOptions\" ng-model=\"filteredVideoItems\">\n" +
    "                <div class=\"grid-view\" ng-class=\"selectedItem().id === item.id ? 'selected' : 'unselected'\" ng-click=\"selectVideo(item)\" ng-repeat=\"item in filteredVideoItems\">\n" +
    "                    \n" +
    "                    <div class=\"preview\" ng-class=\"item.imageUrl ? '' : 'overlay' \">\n" +
    "                        <img ng-src=\"{{item.imageUrl || '/images/media/youtube-thumbnail.jpg'}}\"/>\n" +
    "                    </div>\n" +
    "                    \n" +
    "                    <div class=\"info\">\n" +
    "                        <div class=\"title\" item-order=\"{{item['orderType'][type]}}\">\n" +
    "                            {{item.name || 'Retrieving title...' }}\n" +
    "                        </div>\n" +
    "                        <div class=\"types\" use-tu-subtypes>\n" +
    "                            <i class=\"fa fa-book\" ng-show=\"item.master\"></i>\n" +
    "                            <i class=\"fa fa-university\" ng-show=\"item.ug\"></i>\n" +
    "                            <i class=\"fa fa-graduation-cap\" ng-show=\"item.pg\"></i>\n" +
    "                        </div>\n" +
    "                        <div class=\"actions\">\n" +
    "                            <a href=\"{{item.url}}\" target=\"_blank\" title=\"View {{item.name}}\">\n" +
    "                                <i class=\"fa fa-search\"></i>\n" +
    "                            </a>\n" +
    "                            <a ng-click=\"deleteVideo(item)\" title=\"Delete {{item.name}}\">\n" +
    "                                <i class=\"fa fa-times-circle\"></i>\n" +
    "                            </a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/profiles/tu/media/tuProfileMediaLinkManagerView.html',
    "<div class=\"nested-ibox\" ng-hide=\"showUpgradeForm\" ng-controller=\"TuMediaCommonSidebarController\">\n" +
    "    <div class=\"ibox-title m-t-xl\">\n" +
    "        <h4>Media Manager ({{getGeneralCounter()}})</h4>\n" +
    "    </div>\n" +
    "    <div class=\"ibox\">\n" +
    "        <div class=\"ibox-content\">\n" +
    "            <div include-replace ng-include src=\"'/scripts/components/profiles/tu/media/subtabs/images/tuProfileMediaImagesSidebarView.html'\"></div>\n" +
    "            <div include-replace ng-include src=\"'/scripts/components/profiles/tu/media/subtabs/videos/tuProfileMediaVideosSidebarView.html'\"></div>\n" +
    "            <div include-replace ng-include src=\"'/scripts/components/profiles/tu/media/subtabs/socialMedia/tuProfileMediaSocialMediaSidebarView.html'\"></div>\n" +
    "            <div include-replace ng-include src=\"'/scripts/components/profiles/tu/media/subtabs/brochures/tuProfileMediaBrochuresSidebarView.html'\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/media/tuProfileMediaView.html',
    "<div ng-controller=\"TuProfileMediaController as TuProfileMediaController\">\n" +
    "    <div upgrade-banner\n" +
    "         info-block-class=\"isRightSidePanelActive() ? 'col-lg-9' : 'col-lg-10'\"\n" +
    "         buttons-block-class=\"isRightSidePanelActive() ? 'col-lg-3' : 'col-lg-2'\"\n" +
    "         basic-profile=\"!tuIsAdvanced ? true : false\"\n" +
    "         upgrade-email=\"{{upgradeEmailsTo}}\"\n" +
    "         upgrade-click=\"toggleUpgradeForm()\"></div>\n" +
    "\n" +
    "    <div ng-class=\"tuIsAdvanced ? '': 'modal-overlay-35'\">\n" +
    "        <div wave-spinner class=\"wave-spinner\" ng-show=\"isMediaReloading\"></div>\n" +
    "        <div ng-if=\"!isMediaReloading\">\n" +
    "            <div ng-show=\"TuProfileMediaController.isImagesTabActive()\" ng-include src=\"'/scripts/components/profiles/tu/media/subtabs/images/tuProfileMediaImagesView.html'\"></div>\n" +
    "            <div ng-show=\"TuProfileMediaController.isVideosTabActive()\" ng-include src=\"'/scripts/components/profiles/tu/media/subtabs/videos/tuProfileMediaVideosView.html'\"></div>\n" +
    "            <div ng-show=\"TuProfileMediaController.isSocialMediaTabActive()\" ng-include src=\"'/scripts/components/profiles/tu/media/subtabs/socialMedia/tuProfileMediaSocialMediaView.html'\"></div>\n" +
    "            <div ng-show=\"TuProfileMediaController.isBrochuresTabActive()\" ng-include src=\"'/scripts/components/profiles/tu/media/subtabs/brochures/tuProfileMediaBrochuresView.html'\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/overview/partial/advancedMasterSubTab.html',
    "<form name=\"forms.overviewAdvancedMasterForm\" enctype=\"multipart/form-data\">\n" +
    "    <div class=\"tab-header\">\n" +
    "        <h3 class=\"heading\">Advanced Description *</h3>\n" +
    "        <a class=\"btn btn-warning btn-history\" ng-show=\"!historyDisabled\" ng-click=\"handleTuOverviewHistoryLogClick('master', true)\">\n" +
    "            <i class=\"fa fa-clock-o\"></i>\n" +
    "        </a>\n" +
    "        <div wave-spinner class=\"text-right\" ng-show=\"historyDisabled\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"tab-body\">\n" +
    "        <div class=\"summernote-container\" ng-class=\"{'has-errors': isAdvancedOverviewEmpty}\">\n" +
    "            <summernote\n" +
    "                config=\"TuProfileOverviewController.textEditorAdvancedOptions\"\n" +
    "                ng-model=\"tuProfile.advancedMasterOverview\"\n" +
    "                on-focus=\"TuProfileOverviewController.setOverviewInvalid('advancedOverview')\"\n" +
    "                on-change=\"TuProfileOverviewController.advancedMasterOverviewWords = countWords(contents)\"\n" +
    "                on-init=\"TuProfileOverviewController.advancedMasterOverviewWords = countWords(tuProfile.advancedMasterOverview)\"\n" +
    "                count-word=\"TuProfileOverviewController.advancedMasterOverviewWords\">\n" +
    "            </summernote>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <div class=\"editor-note form-group\">\n" +
    "            <span ng-class=\"{'text-red': TuProfileOverviewController.isAdvancedOverviewInvalid(TuProfileOverviewController.advancedMasterOverviewWords)}\">\n" +
    "                <span class=\"bold\">{{TuProfileOverviewController.advancedMasterOverviewWords}}</span>\n" +
    "                <span>words inserted</span>\n" +
    "            </span>\n" +
    "            <span class=\"pull-right\">Maximum {{TuProfileOverviewController.advancedDescriptionWordLimit}} words</span>\n" +
    "            \n" +
    "            <div\n" +
    "                focus-delay=\"250\"\n" +
    "                custom-popover\n" +
    "                popover-html=\"Add a general description about your university\"\n" +
    "                popover-placement=\"left\"\n" +
    "                popover-trigger=\"manual\"\n" +
    "                popover-visibility=\"{{isAdvancedOverviewEmpty ? true : false}}\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"separator\"></div>\n" +
    "\n" +
    "        <div  class=\"row\">\n" +
    "            <div class=\"col-lg-6 form-group\">\n" +
    "                <div>\n" +
    "                    <h3>University Website</h3>\n" +
    "                </div>\n" +
    "                <input type=\"text\"\n" +
    "                       placeholder=\"http://\"\n" +
    "                       ng-model=\"tuProfile.masterWebsiteUrl\"\n" +
    "                       ng-keyup=\"TuProfileOverviewController.onKeyUp($event)\"\n" +
    "                       class=\"form-control\" />\n" +
    "            </div>\n" +
    "            <div class=\"col-lg-6 form-group\">\n" +
    "                <div class=\"display-inline-request-info margin-right-30\">\n" +
    "                    <h3 class=\"inline\">Request info</h3>\n" +
    "                    <span class=\"small dfn text-left text-nowrap\"> (please select one) </span>\n" +
    "                </div>\n" +
    "                <div class=\"display-inline-request-info request-info-title\">\n" +
    "                    <div class=\"display-inline-request-info\">\n" +
    "                        <input i-checkbox type=\"radio\" value=\"email\" ng-model=\"tuProfile.requestInfoTypeMaster\"> Email\n" +
    "                    </div>\n" +
    "                    <span class=\"or-checkboxes-request-info\">OR</span>\n" +
    "                    <div class=\"display-inline-request-info\">\n" +
    "                        <input i-checkbox type=\"radio\" value=\"url\" ng-model=\"tuProfile.requestInfoTypeMaster\"> URL\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div ng-show=\"tuProfile.requestInfoTypeMaster === 'url'\" class=\"url-option\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"text\" placeholder=\"Title\" ng-model=\"tuProfile.masterRequestInfoUrlTitle\" class=\"form-control\">\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"url\"\n" +
    "                            name=\"tuProfile.masterRequestInfoUrl\"\n" +
    "                            placeholder=\"URL\"\n" +
    "                            ng-model=\"tuProfile.masterRequestInfoUrl\"\n" +
    "                            ng-keyup=\"TuProfileOverviewController.onKeyUp($event)\"\n" +
    "                            class=\"form-control\" />\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div ng-show=\"tuProfile.requestInfoTypeMaster === 'email'\" class=\"email-option\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"email\" placeholder=\"Email\" ng-model=\"tuProfile.masterRequestInfoEmail\" class=\"form-control\" >\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"tab-footer\">\n" +
    "            <a class=\"btn btn-primary pull-right\"\n" +
    "                ng-class=\"{'disabled': overviewAdvancedMasterFormSubmitInProgress}\"\n" +
    "                ng-click=\"handleOverviewAdvancedMasterDataSubmit()\">\n" +
    "                <i class=\"fa fa-check-circle\"></i>\n" +
    "                <span>Update</span>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/overview/partial/advancedPgSubTab.html',
    "<form name=\"forms.overviewAdvancedPgForm\" enctype=\"multipart/form-data\">\n" +
    "    <div class=\"tab-header\">\n" +
    "        <h3 class=\"heading\">Advanced Description *</h3>\n" +
    "        <a class=\"btn btn-warning btn-history\" ng-show=\"!historyDisabled\" ng-click=\"handleTuOverviewHistoryLogClick('pg', true)\">\n" +
    "            <i class=\"fa fa-clock-o\"></i>\n" +
    "        </a>\n" +
    "        <div wave-spinner=\"\" class=\"text-right\" ng-show=\"historyDisabled\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"tab-body\">\n" +
    "        <div class=\"summernote-container\" ng-class=\"{'has-errors': isAdvancedPgOverviewEmpty}\">\n" +
    "            <summernote\n" +
    "                config=\"TuProfileOverviewController.textEditorAdvancedOptions\"\n" +
    "                ng-model=\"tuProfile.advancedPgOverview\"\n" +
    "                on-focus=\"TuProfileOverviewController.setOverviewInvalid('advancedPgOverview')\"\n" +
    "                on-change=\"TuProfileOverviewController.advancedPgOverviewWords = countWords(contents)\"\n" +
    "                on-init=\"TuProfileOverviewController.advancedPgOverviewWords = countWords(tuProfile.advancedPgOverview)\"\n" +
    "                count-word=\"TuProfileOverviewController.advancedPgOverviewWords\">\n" +
    "            </summernote>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"editor-note form-group\">\n" +
    "            <span ng-class=\"{'text-red': TuProfileOverviewController.isAdvancedOverviewInvalid(TuProfileOverviewController.advancedPgOverviewWords)}\">\n" +
    "                <span class=\"bold\">{{TuProfileOverviewController.advancedPgOverviewWords}}</span>\n" +
    "                <span>words inserted</span>\n" +
    "            </span>\n" +
    "            <span class=\"pull-right\">Maximum {{TuProfileOverviewController.advancedDescriptionWordLimit}} words</span>\n" +
    "            <div\n" +
    "              focus-delay=\"250\"\n" +
    "              custom-popover\n" +
    "              popover-html=\"Add a general description about the Postgraduate Courses you offer\"\n" +
    "              popover-placement=\"left\"\n" +
    "              popover-trigger=\"manual\"\n" +
    "              popover-visibility=\"{{isAdvancedPgOverviewEmpty ? true : false}}\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"separator\"></div>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-lg-6 form-group\">\n" +
    "                <div>\n" +
    "                    <h3>University Website</h3>\n" +
    "                </div>\n" +
    "                <input type=\"text\"\n" +
    "                       placeholder=\"http://\"\n" +
    "                       ng-model=\"tuProfile.pgWebsiteUrl\"\n" +
    "                       ng-keyup=\"TuProfileOverviewController.onKeyUp($event)\"\n" +
    "                       class=\"form-control\" />\n" +
    "            </div>\n" +
    "            <div class=\"col-lg-6 form-group\">\n" +
    "                <div class=\"display-inline-request-info margin-right-30\">\n" +
    "                    <h3 class=\"inline\">Request info</h3>\n" +
    "                    <span class=\"small dfn text-left text-nowrap\"> (please select one) </span>\n" +
    "                </div>\n" +
    "                <div class=\"display-inline-request-info request-info-title\">\n" +
    "                    <div class=\"display-inline-request-info\">\n" +
    "                        <input i-checkbox type=\"radio\" name=\"requestInfoOverview\" value=\"email\" ng-model=\"tuProfile.requestInfoTypePg\"> Email\n" +
    "                    </div>\n" +
    "                    <span class=\"or-checkboxes-request-info\">OR</span>\n" +
    "                    <div class=\"display-inline-request-info\">\n" +
    "                        <input i-checkbox type=\"radio\" name=\"requestInfoOverview\" value=\"url\" ng-model=\"tuProfile.requestInfoTypePg\"> URL\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-show=\"tuProfile.requestInfoTypePg === 'url'\" class=\"url-option\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"text\" placeholder=\"Title\" ng-model=\"tuProfile.pgRequestInfoUrlTitle\" class=\"form-control\">\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"url\"\n" +
    "                            name=\"tuProfile.pgRequestInfoUrl\"\n" +
    "                            placeholder=\"URL\"\n" +
    "                            ng-model=\"tuProfile.pgRequestInfoUrl\"\n" +
    "                            ng-keyup=\"TuProfileOverviewController.onKeyUp($event)\"\n" +
    "                            class=\"form-control\" />\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div ng-show=\"tuProfile.requestInfoTypePg === 'email'\" class=\"email-option\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"email\" placeholder=\"Email\" ng-model=\"tuProfile.pgRequestInfoEmail\" class=\"form-control\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"tab-footer\">  \n" +
    "            <a class=\"btn btn-primary pull-right\"\n" +
    "                ng-class=\"{'disabled': overviewAdvancedPgFormSubmitInProgress}\"\n" +
    "                ng-click=\"handleOverviewAdvancedPgDataSubmit()\">\n" +
    "                <i class=\"fa fa-check-circle\"></i>\n" +
    "                <span>Update</span>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>"
  );


  $templateCache.put('/scripts/components/profiles/tu/overview/partial/advancedUgSubTab.html',
    "<form name=\"forms.overviewAdvancedUgForm\" enctype=\"multipart/form-data\">    \n" +
    "    <div class=\"tab-header\">\n" +
    "        <h3 class=\"heading\">Advanced Description *</h3>\n" +
    "        <a class=\"btn btn-warning btn-history\" ng-show=\"!historyDisabled\" ng-click=\"handleTuOverviewHistoryLogClick('ug', true)\">\n" +
    "            <i class=\"fa fa-clock-o\"></i>\n" +
    "        </a>\n" +
    "        <div wave-spinner class=\"text-right\" ng-show=\"historyDisabled\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"tab-body\">\n" +
    "        <div class=\"summernote-container\" ng-class=\"{'has-errors': isAdvancedUgOverviewEmpty}\">\n" +
    "            <summernote\n" +
    "                config=\"TuProfileOverviewController.textEditorAdvancedOptions\"\n" +
    "                ng-model=\"tuProfile.advancedUgOverview\"\n" +
    "                on-focus=\"TuProfileOverviewController.setOverviewInvalid('advancedUgOverview')\"\n" +
    "                on-change=\"TuProfileOverviewController.advancedUgOverviewWords = countWords(contents)\"\n" +
    "                on-init=\"TuProfileOverviewController.advancedUgOverviewWords = countWords(tuProfile.advancedUgOverview)\"\n" +
    "                count-word=\"TuProfileOverviewController.advancedUgOverviewWords\">\n" +
    "            </summernote>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"editor-note form-group\">\n" +
    "            <span ng-class=\"{'text-red': TuProfileOverviewController.isAdvancedOverviewInvalid(TuProfileOverviewController.advancedUgOverviewWords)}\">\n" +
    "                <span class=\"bold\">{{TuProfileOverviewController.advancedUgOverviewWords}}</span>\n" +
    "                <span>words inserted</span>\n" +
    "            </span>\n" +
    "            <span class=\"pull-right\">Maximum {{TuProfileOverviewController.advancedDescriptionWordLimit}} words</span>\n" +
    "        \n" +
    "            <div\n" +
    "              focus-delay=\"250\"\n" +
    "              custom-popover\n" +
    "              popover-html=\"Add a general description about the Undergraduate Courses you offer\"\n" +
    "              popover-placement=\"left\"\n" +
    "              popover-trigger=\"manual\"\n" +
    "              popover-visibility=\"{{isAdvancedUgOverviewEmpty ? true : false}}\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"separator\"></div>\n" +
    "\n" +
    "        <div  class=\"row\">\n" +
    "            <div class=\"col-lg-6 form-group\">\n" +
    "                <div>\n" +
    "                    <h3>University Website</h3>\n" +
    "                </div>\n" +
    "                <input type=\"text\"\n" +
    "                       placeholder=\"http://\"\n" +
    "                       ng-model=\"tuProfile.ugWebsiteUrl\"\n" +
    "                       ng-keyup=\"TuProfileOverviewController.onKeyUp($event)\"\n" +
    "                       class=\"form-control\" />\n" +
    "            </div>\n" +
    "            <div class=\"col-lg-6 form-group\">\n" +
    "                <div class=\"display-inline-request-info margin-right-30\">\n" +
    "                    <h3 class=\"inline\">Request info</h3>\n" +
    "                    <span class=\"small dfn text-left text-nowrap\"> (please select one) </span>\n" +
    "                </div>\n" +
    "                <div class=\"display-inline-request-info request-info-title\">\n" +
    "                    <div class=\"display-inline-request-info\">\n" +
    "                        <input i-checkbox type=\"radio\" name=\"requestInfoOverview\" value=\"email\" ng-model=\"tuProfile.requestInfoTypeUg\"> Email\n" +
    "                    </div>\n" +
    "                    <span class=\"or-checkboxes-request-info\">OR</span>\n" +
    "                    <div class=\"display-inline-request-info\">\n" +
    "                        <input i-checkbox type=\"radio\" name=\"requestInfoOverview\" value=\"url\" ng-model=\"tuProfile.requestInfoTypeUg\"> URL\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div ng-show=\"tuProfile.requestInfoTypeUg === 'url'\" class=\"url-option\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"text\" placeholder=\"Title\" ng-model=\"tuProfile.ugRequestInfoUrlTitle\" class=\"form-control\" >\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"url\"\n" +
    "                            name=\"tuProfile.ugRequestInfoUrl\"\n" +
    "                            placeholder=\"URL\"\n" +
    "                            ng-model=\"tuProfile.ugRequestInfoUrl\"\n" +
    "                            ng-keyup=\"TuProfileOverviewController.onKeyUp($event)\"\n" +
    "                            class=\"form-control\" />\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div ng-show=\"tuProfile.requestInfoTypeUg === 'email'\" class=\"email-option\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"email\" placeholder=\"Email\" ng-model=\"tuProfile.ugRequestInfoEmail\" class=\"form-control\" >\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div class=\"tab-footer\">\n" +
    "            <a class=\"btn btn-primary pull-right\"\n" +
    "                ng-class=\"{'disabled': overviewBasicUgFormSubmitInProgress}\"\n" +
    "                ng-click=\"handleOverviewAdvancedUgDataSubmit()\">\n" +
    "                <i class=\"fa fa-check-circle\"></i>\n" +
    "                <span>Update</span>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>"
  );


  $templateCache.put('/scripts/components/profiles/tu/overview/partial/basicMasterSubTab.html',
    "<form name=\"forms.overviewBasicMasterForm\" enctype=\"multipart/form-data\">\n" +
    "    <div class=\"tab-header\">\n" +
    "      <h3 class=\"heading\">Basic Description *</h3>\n" +
    "      <a class=\"btn btn-warning btn-history\" ng-show=\"!historyDisabled\" ng-click=\"handleTuOverviewHistoryLogClick('master')\">\n" +
    "          <i class=\"fa fa-clock-o\"></i>\n" +
    "      </a>\n" +
    "      <div wave-spinner=\"\" class=\"text-right\" ng-show=\"historyDisabled\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"tab-body\">\n" +
    "        <div class=\"summernote-container\" ng-class=\"{'has-errors': isBasicOverviewEmpty}\">\n" +
    "            <summernote\n" +
    "                config=\"TuProfileOverviewController.textEditorBasicOptions\"\n" +
    "                ng-model=\"tuProfile.basicMasterOverview\"\n" +
    "                on-focus=\"TuProfileOverviewController.setOverviewInvalid('basicOverview')\"\n" +
    "                on-change=\"TuProfileOverviewController.basicMasterOverviewWords = countWords(contents)\"\n" +
    "                on-init=\"TuProfileOverviewController.basicMasterOverviewWords = countWords(tuProfile.basicMasterOverview)\"\n" +
    "                count-word=\"TuProfileOverviewController.basicMasterOverviewWords\">\n" +
    "            </summernote>\n" +
    "        </div>\n" +
    "\n" +
    "      <div class=\"editor-note form-group\">\n" +
    "        <span ng-class=\"{'text-red': TuProfileOverviewController.isBasicOverviewInvalid(TuProfileOverviewController.basicMasterOverviewWords)}\">\n" +
    "          <span class=\"bold\">{{TuProfileOverviewController.basicMasterOverviewWords}}</span>\n" +
    "          <span>words inserted</span>\n" +
    "        </span>\n" +
    "        <span class=\"pull-right\">Maximum {{TuProfileOverviewController.basicDescriptionWordLimit}} words</span>\n" +
    "        <div\n" +
    "            focus-delay=\"250\"\n" +
    "            custom-popover\n" +
    "            popover-html=\"Add a general description about your university\"\n" +
    "            popover-placement=\"left\"\n" +
    "            popover-trigger=\"manual\"\n" +
    "            popover-visibility=\"{{isBasicOverviewEmpty ? true : false}}\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"tab-footer\">\n" +
    "          <a class=\"btn btn-primary pull-right\"\n" +
    "            ng-class=\"{'disabled': overviewBasicMasterFormSubmitInProgress}\"\n" +
    "            ng-click=\"handleOverviewBasicMasterDataSubmit()\">\n" +
    "            <i class=\"fa fa-check-circle\"></i>\n" +
    "            <span>Update</span>\n" +
    "          </a>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>    \n" +
    "</form>\n" +
    "\n" +
    "<div upgrade-banner\n" +
    "     info-block-class=\"isRightSidePanelActive() ? 'col-lg-9' : 'col-lg-10'\"\n" +
    "     buttons-block-class=\"isRightSidePanelActive() ? 'col-lg-3' : 'col-lg-2'\"\n" +
    "     basic-profile=\"true\"\n" +
    "     upgrade-email=\"{{upgradeEmailsTo}}\"\n" +
    "     upgrade-click=\"toggleUpgradeForm()\"></div>\n" +
    "\n" +
    "<div class=\"separator\"></div>\n" +
    "\n" +
    "<div class=\"locked\">\n" +
    "    <div  class=\"row\">\n" +
    "        <div class=\"col-lg-6 form-group\">\n" +
    "            <div>\n" +
    "                <h3>University Website</h3>\n" +
    "            </div>\n" +
    "            <input type=\"text\"\n" +
    "                   disabled\n" +
    "                   placeholder=\"http://\"\n" +
    "                   ng-model=\"tuProfile.masterWebsiteUrl\"\n" +
    "                   class=\"form-control\" />\n" +
    "        </div>\n" +
    "        <div class=\"col-lg-6 form-group\">\n" +
    "            <div class=\"display-inline-request-info margin-right-30\">\n" +
    "                <h3 class=\"inline\">Request info</h3>\n" +
    "                <span class=\"small dfn text-left text-nowrap\"> (please select one) </span>\n" +
    "            </div>\n" +
    "            <div class=\"display-inline-request-info request-info-title\">\n" +
    "                <div class=\"display-inline-request-info\">\n" +
    "                    <input i-checkbox\n" +
    "                       disabled\n" +
    "                       type=\"radio\"\n" +
    "                       value=\"email\"\n" +
    "                       ng-model=\"tuProfile.requestInfoTypeMaster\"> Email\n" +
    "                </div>\n" +
    "                <span class=\"or-checkboxes-request-info\">OR</span>\n" +
    "                <div class=\"display-inline-request-info\">\n" +
    "                    <input i-checkbox\n" +
    "                       disabled\n" +
    "                       type=\"radio\"\n" +
    "                       value=\"url\"\n" +
    "                       ng-model=\"tuProfile.requestInfoTypeMaster\"> URL\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-show=\"tuProfile.requestInfoTypeMaster === 'url'\" class=\"url-option\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <input type=\"text\"\n" +
    "                           disabled\n" +
    "                           placeholder=\"Title\"\n" +
    "                           ng-model=\"tuProfile.masterRequestInfoUrlTitle\"\n" +
    "                           class=\"form-control\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <input type=\"url\"\n" +
    "                           disabled\n" +
    "                           placeholder=\"URL\"\n" +
    "                           ng-model=\"tuProfile.masterRequestInfoUrl\"\n" +
    "                           class=\"form-control\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-show=\"tuProfile.requestInfoTypeMaster === 'email'\" class=\"email-option\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <input type=\"email\"\n" +
    "                           disabled\n" +
    "                           placeholder=\"Email\"\n" +
    "                           ng-model=\"tuProfile.masterRequestInfoEmail\"\n" +
    "                           class=\"form-control\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/overview/partial/basicPgSubTab.html',
    "<form name=\"forms.overviewBasicPgForm\" enctype=\"multipart/form-data\">\n" +
    "    <div class=\"tab-header\">\n" +
    "      <h3 class=\"heading\">Basic Description *</h3>\n" +
    "      <a class=\"btn btn-warning btn-history\"\n" +
    "        ng-class=\"{'disabled': historyDisabled}\"\n" +
    "        ng-click=\"handleTuOverviewHistoryLogClick('pg')\">\n" +
    "        <i class=\"fa fa-clock-o\"></i>\n" +
    "      </a>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"tab-body\">\n" +
    "        <div class=\"summernote-container\" ng-class=\"{'has-errors': isBasicPgOverviewEmpty}\">\n" +
    "            <summernote\n" +
    "                config=\"TuProfileOverviewController.textEditorBasicOptions\"\n" +
    "                ng-model=\"tuProfile.basicPgOverview\"\n" +
    "                on-focus=\"TuProfileOverviewController.setOverviewInvalid('basicPgOverview')\"\n" +
    "                on-change=\"TuProfileOverviewController.basicPgOverviewWords = countWords(contents)\"\n" +
    "                on-init=\"TuProfileOverviewController.basicPgOverviewWords = countWords(tuProfile.basicPgOverview)\"\n" +
    "                count-word=\"TuProfileOverviewController.basicPgOverviewWords\">\n" +
    "            </summernote>\n" +
    "        </div>\n" +
    "\n" +
    "      <div class=\"editor-note form-group\">\n" +
    "        <span ng-class=\"{'text-red': TuProfileOverviewController.isBasicOverviewInvalid(TuProfileOverviewController.basicPgOverviewWords)}\">\n" +
    "          <span class=\"bold\">{{TuProfileOverviewController.basicPgOverviewWords}}</span>\n" +
    "          <span>words inserted</span>\n" +
    "        </span>\n" +
    "        <span class=\"pull-right\">Maximum {{TuProfileOverviewController.basicDescriptionWordLimit}} words</span>\n" +
    "      \n" +
    "        <div\n" +
    "            focus-delay=\"250\"\n" +
    "            custom-popover\n" +
    "            popover-html=\"Add a general description about the Postgraduate Courses you offer\"\n" +
    "            popover-placement=\"left\"\n" +
    "            popover-trigger=\"manual\"\n" +
    "            popover-visibility=\"{{isBasicPgOverviewEmpty ? true : false}}\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"tab-footer\">\n" +
    "        <a class=\"btn btn-primary pull-right\"\n" +
    "          ng-class=\"{'disabled': overviewTabOverviewSubTabSubmitInProgress}\"\n" +
    "          ng-click=\"handleOverviewBasicPgDataSubmit()\">\n" +
    "          <i class=\"fa fa-check-circle\"></i>\n" +
    "          <span>Update</span>\n" +
    "        </a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "<div upgrade-banner\n" +
    "     info-block-class=\"isRightSidePanelActive() ? 'col-lg-9' : 'col-lg-10'\"\n" +
    "     buttons-block-class=\"isRightSidePanelActive() ? 'col-lg-3' : 'col-lg-2'\"\n" +
    "     basic-profile=\"true\"\n" +
    "     upgrade-email=\"{{upgradeEmailsTo}}\"\n" +
    "     upgrade-click=\"toggleUpgradeForm()\"></div>\n" +
    "\n" +
    "<div class=\"separator\"></div>\n" +
    "\n" +
    "<div class=\"locked\">\n" +
    "    <div  class=\"row\">\n" +
    "        <div class=\"col-lg-6 form-group\">\n" +
    "            <div>\n" +
    "                <h3>University Website</h3>\n" +
    "            </div>\n" +
    "            <input type=\"text\"\n" +
    "                   disabled\n" +
    "                   placeholder=\"http://\"\n" +
    "                   ng-model=\"tuProfile.pgWebsiteUrl\"\n" +
    "                   class=\"form-control\" />\n" +
    "        </div>\n" +
    "        <div class=\"col-lg-6 form-group\">\n" +
    "            <div class=\"display-inline-request-info margin-right-30\">\n" +
    "                <h3 class=\"inline\">Request info</h3>\n" +
    "                <span class=\"small dfn text-left text-nowrap\"> (please select one) </span>\n" +
    "            </div>\n" +
    "            <div class=\"display-inline-request-info request-info-title\">\n" +
    "                <div class=\"display-inline-request-info\">\n" +
    "                    <input i-checkbox\n" +
    "                       disabled\n" +
    "                       type=\"radio\"\n" +
    "                       value=\"email\"\n" +
    "                       ng-model=\"tuProfile.requestInfoTypePg\"> Email\n" +
    "                </div>\n" +
    "                <span class=\"or-checkboxes-request-info\">OR</span>\n" +
    "                <div class=\"display-inline-request-info\">\n" +
    "                    <input i-checkbox\n" +
    "                       disabled\n" +
    "                       type=\"radio\"\n" +
    "                       value=\"url\"\n" +
    "                       ng-model=\"tuProfile.requestInfoTypePg\"> URL\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-show=\"tuProfile.requestInfoTypePg === 'url'\" class=\"url-option\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <input type=\"text\"\n" +
    "                           disabled\n" +
    "                           placeholder=\"Title\"\n" +
    "                           ng-model=\"tuProfile.pgRequestInfoUrlTitle\"\n" +
    "                           class=\"form-control\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <input type=\"url\"\n" +
    "                           disabled\n" +
    "                           placeholder=\"URL\"\n" +
    "                           ng-model=\"tuProfile.pgRequestInfoUrl\"\n" +
    "                           class=\"form-control\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-show=\"tuProfile.requestInfoTypePg === 'email'\" class=\"email-option\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <input type=\"email\"\n" +
    "                           disabled\n" +
    "                           placeholder=\"Email\"\n" +
    "                           ng-model=\"tuProfile.pgRequestInfoEmail\"\n" +
    "                           class=\"form-control\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/overview/partial/basicUgSubTab.html',
    "<form name=\"forms.overviewBasicUgForm\" enctype=\"multipart/form-data\">\n" +
    "    <div class=\"tab-header\">\n" +
    "      <h3 class=\"heading\">Basic Description *</h3>\n" +
    "      <a class=\"btn btn-warning btn-history\" ng-class=\"{'disabled': historyDisabled}\" ng-click=\"handleTuOverviewHistoryLogClick('ug')\">\n" +
    "        <i class=\"fa fa-clock-o\"></i>\n" +
    "      </a>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"tab-body\">\n" +
    "        <div class=\"summernote-container\" ng-class=\"{'has-errors': isBasicUgOverviewEmpty}\">\n" +
    "            <summernote\n" +
    "                config=\"TuProfileOverviewController.textEditorBasicOptions\"\n" +
    "                ng-model=\"tuProfile.basicUgOverview\"\n" +
    "                on-focus=\"TuProfileOverviewController.setOverviewInvalid('basicUgOverview')\"\n" +
    "                on-change=\"TuProfileOverviewController.basicUgOverviewWords = countWords(contents)\"\n" +
    "                on-init=\"TuProfileOverviewController.basicUgOverviewWords = countWords(tuProfile.basicUgOverview)\"\n" +
    "                count-word=\"TuProfileOverviewController.basicUgOverviewWords\">\n" +
    "            </summernote>\n" +
    "        </div>\n" +
    "\n" +
    "      <div class=\"editor-note form-group\">\n" +
    "        <span ng-class=\"{'text-red': TuProfileOverviewController.isBasicOverviewInvalid(TuProfileOverviewController.basicUgOverviewWords)}\">\n" +
    "          <span class=\"bold\">{{TuProfileOverviewController.basicUgOverviewWords}}</span>\n" +
    "          <span>words inserted</span>\n" +
    "        </span>\n" +
    "        <span class=\"pull-right\">Maximum {{TuProfileOverviewController.basicDescriptionWordLimit}} words</span>\n" +
    "        <div\n" +
    "            focus-delay=\"250\"\n" +
    "            custom-popover\n" +
    "            popover-html=\"Add a general description about the Undergraduate Courses you offer\"\n" +
    "            popover-placement=\"left\"\n" +
    "            popover-trigger=\"manual\"\n" +
    "            popover-visibility=\"{{isBasicUgOverviewEmpty ? true : false}}\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"tab-footer\">\n" +
    "        <a class=\"btn btn-primary pull-right\"\n" +
    "          ng-class=\"{'disabled': overviewBasicUgFormSubmitInProgress}\"\n" +
    "          ng-click=\"handleOverviewBasicUgDataSubmit()\">\n" +
    "          <i class=\"fa fa-check-circle\"></i>\n" +
    "          <span>Update</span>\n" +
    "        </a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "<div upgrade-banner\n" +
    "     info-block-class=\"isRightSidePanelActive() ? 'col-lg-9' : 'col-lg-10'\"\n" +
    "     buttons-block-class=\"isRightSidePanelActive() ? 'col-lg-3' : 'col-lg-2'\"\n" +
    "     basic-profile=\"true\"\n" +
    "     upgrade-email=\"{{upgradeEmailsTo}}\"\n" +
    "     upgrade-click=\"toggleUpgradeForm()\"></div>\n" +
    "\n" +
    "<div class=\"separator\"></div>\n" +
    "\n" +
    "<div class=\"locked\">\n" +
    "    <div  class=\"row\">\n" +
    "        <div class=\"col-lg-6 form-group\">\n" +
    "            <div>\n" +
    "                <h3>University Website</h3>\n" +
    "            </div>\n" +
    "            <input type=\"text\"\n" +
    "                   disabled\n" +
    "                   placeholder=\"http://\"\n" +
    "                   ng-model=\"tuProfile.ugWebsiteUrl\"\n" +
    "                   class=\"form-control\" />\n" +
    "        </div>\n" +
    "        <div class=\"col-lg-6 form-group\">\n" +
    "            <div class=\"display-inline-request-info margin-right-30\">\n" +
    "                <h3 class=\"inline\">Request info</h3>\n" +
    "                <span class=\"small dfn text-left text-nowrap\"> (please select one) </span>\n" +
    "            </div>\n" +
    "            <div class=\"display-inline-request-info request-info-title\">\n" +
    "                <div class=\"display-inline-request-info\">\n" +
    "                    <input i-checkbox\n" +
    "                       disabled\n" +
    "                       type=\"radio\"\n" +
    "                       value=\"email\"\n" +
    "                       ng-model=\"tuProfile.requestInfoTypeUg\"> Email\n" +
    "                </div>\n" +
    "                <span class=\"or-checkboxes-request-info\">OR</span>\n" +
    "                <div class=\"display-inline-request-info\">\n" +
    "                    <input i-checkbox\n" +
    "                       disabled\n" +
    "                       type=\"radio\"\n" +
    "                       value=\"url\"\n" +
    "                       ng-model=\"tuProfile.requestInfoTypeUg\"> URL\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-show=\"tuProfile.requestInfoTypeUg === 'url'\" class=\"url-option\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <input type=\"text\"\n" +
    "                           disabled\n" +
    "                           placeholder=\"Title\"\n" +
    "                           ng-model=\"tuProfile.ugRequestInfoUrlTitle\"\n" +
    "                           class=\"form-control\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <input type=\"url\"\n" +
    "                           disabled\n" +
    "                           placeholder=\"URL\"\n" +
    "                           ng-model=\"tuProfile.ugRequestInfoUrl\"\n" +
    "                           class=\"form-control\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-show=\"tuProfile.requestInfoTypeUg === 'email'\" class=\"email-option\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <input type=\"email\"\n" +
    "                           disabled\n" +
    "                           placeholder=\"Email\"\n" +
    "                           ng-model=\"tuProfile.ugRequestInfoEmail\"\n" +
    "                           class=\"form-control\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/overview/tuProfileOverviewHistoryView.html',
    "<div class=\"ibox\">\n" +
    "    <div class=\"ibox-title m-t-xl\">\n" +
    "        <h5>History Log <small>showing last {{historyLog.totalReturned}} records of {{historyLog.total}}</small></h5>\n" +
    "        <div class=\"ibox-tools\">\n" +
    "            <a class=\"close-link\" ng-click=\"toggleHistory(false)\">\n" +
    "                <i class=\"fa fa-times\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <div wave-spinner=\"\" ng-show=\"fetchingHistoryLog()\"></div>\n" +
    "\n" +
    "        <p class=\"text-muted text-center\" ng-show=\"!fetchingHistoryLog() && !historyLog.total\">\n" +
    "            History log is empty\n" +
    "        </p>\n" +
    "\n" +
    "        <div ng-show=\"!fetchingHistoryLog()\" ng-repeat=\"log in historyLog.log\">\n" +
    "            <ul class=\"list-unstyled list-history break-word\">\n" +
    "                <li ng-if=\"log.modifiedAt\">\n" +
    "                    <span class=\"bold\">Modified on:</span>\n" +
    "                    <spna>{{log.modifiedAt| date:'medium'}}</spna>\n" +
    "                </li>\n" +
    "                <li ng-if=\"log.modifiedByFullName\">\n" +
    "                    <span class=\"bold\">Submitted by:</span>\n" +
    "                    <spna>{{log.modifiedByFullName}}</spna>\n" +
    "                </li>\n" +
    "                <li ng-show=\"!log.advanced\">\n" +
    "                    <span class=\"bold\">Basic Description:</span>\n" +
    "                    <spna>\n" +
    "                        {{log.basicMasterOverview | htmlToPlaintext}}\n" +
    "                        {{log.basicUgOverview | htmlToPlaintext}}\n" +
    "                        {{log.basicPgOverview | htmlToPlaintext}}\n" +
    "                    </spna>\n" +
    "                </li>\n" +
    "                <li ng-show=\"log.advanced\">\n" +
    "                    <span class=\"bold\">Advanced Description:</span>\n" +
    "                    <spna>\n" +
    "                        {{log.advancedMasterOverview | htmlToPlaintext}}\n" +
    "                        {{log.advancedUgOverview | htmlToPlaintext}}\n" +
    "                        {{log.advancedPgOverview | htmlToPlaintext}}\n" +
    "                    </spna>\n" +
    "                </li>\n" +
    "                <li ng-show=\"log.advanced\">\n" +
    "                    <span class=\"bold\">University Website:</span>\n" +
    "                    <spna>\n" +
    "                        <a ng-show=\"log.masterWebsiteUrl\" href=\"{{log.masterWebsiteUrl}}\" target=\"_blank\">{{log.masterWebsiteUrl}}</a>\n" +
    "                        <a ng-show=\"log.ugWebsiteUrl\" href=\"{{log.ugWebsiteUrl}}\" target=\"_blank\">{{log.ugWebsiteUrl}}</a>\n" +
    "                        <a ng-show=\"log.pgWebsiteUrl\" href=\"{{log.pgWebsiteUrl}}\" target=\"_blank\">{{log.pgWebsiteUrl}}</a>\n" +
    "                    </spna>\n" +
    "                </li>\n" +
    "                <li ng-show=\"log.advanced\">\n" +
    "                    <div ng-show=\"!TopUniversitiesController.isRequestInfoTypeUrl(log)\">\n" +
    "                        <span class=\"bold\">Request info - Email:</span>\n" +
    "                        <span>\n" +
    "                            {{log.masterRequestInfoEmail}}\n" +
    "                            {{log.ugRequestInfoEmail}}\n" +
    "                            {{log.pgRequestInfoEmail}}\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                    <div ng-show=\"TopUniversitiesController.isRequestInfoTypeUrl(log)\">\n" +
    "                        <span class=\"bold\">Request info - Title:</span>\n" +
    "                        <span>\n" +
    "                            {{log.masterRequestInfoUrlTitle}}\n" +
    "                            {{log.ugRequestInfoUrlTitle}}\n" +
    "                            {{log.pgRequestInfoUrlTitle}}\n" +
    "                        </span>\n" +
    "                        \n" +
    "                        <br>\n" +
    "                        \n" +
    "                        <span class=\"bold\">Request info - URL:</span>\n" +
    "                        <a ng-show=\"log.masterRequestInfoUrl\" href=\"{{log.masterRequestInfoUrl}}\" target=\"_blank\">{{log.masterRequestInfoUrl}}</a>\n" +
    "                        <a ng-show=\"log.ugRequestInfoUrl\" href=\"{{log.ugRequestInfoUrl}}\" target=\"_blank\">{{log.ugRequestInfoUrl}}</a>\n" +
    "                        <a ng-show=\"log.pgRequestInfoUrl\" href=\"{{log.pgRequestInfoUrl}}\" target=\"_blank\">{{log.pgRequestInfoUrl}}</a>\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "\n" +
    "            <div class=\"separator dashed\"></div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\" ng-show=\"handleHistoryLogVisibility()\">\n" +
    "            <div wave-spinner=\"\" ng-show=\"fetchingMoreHistoryLog()\"></div>\n" +
    "            <div class=\" col-lg-8 col-lg-offset-2\">\n" +
    "                <a class=\"btn btn-primary btn-block\" ng-click=\"handleLoadMoreHistoryLog()\" ng-disabled=\"fetchingMoreHistoryLog()\">\n" +
    "                    Load more\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/overview/tuProfileOverviewView.html',
    "<div ng-controller=\"TuProfileOverviewController as TuProfileOverviewController\">\n" +
    "    <div class=\"tabs-container\">\n" +
    "        <uib-tabset active=\"activeOverviewSubTab\">\n" +
    "            <uib-tab heading=\"Overview\">\n" +
    "                <div class=\"panel-body\">\n" +
    "                    <div ng-if=\"tuIsAdvanced\" ng-include src=\"'/scripts/components/profiles/tu/overview/partial/advancedMasterSubTab.html'\"></div>\n" +
    "                    <div ng-if=\"!tuIsAdvanced\" ng-include src=\"'/scripts/components/profiles/tu/overview/partial/basicMasterSubTab.html'\"></div>\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "            <uib-tab heading=\"Undergraduate\">\n" +
    "                <div class=\"panel-body\">\n" +
    "                    <div ng-if=\"tuIsAdvanced\" ng-include src=\"'/scripts/components/profiles/tu/overview/partial/advancedUgSubTab.html'\"></div>\n" +
    "                    <div ng-if=\"!tuIsAdvanced\" ng-include src=\"'/scripts/components/profiles/tu/overview/partial/basicUgSubTab.html'\"></div>\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "            <uib-tab heading=\"Postgraduate\">\n" +
    "                <div class=\"panel-body\">\n" +
    "                    <div ng-if=\"tuIsAdvanced\" ng-include src=\"'/scripts/components/profiles/tu/overview/partial/advancedPgSubTab.html'\"></div>\n" +
    "                    <div ng-if=\"!tuIsAdvanced\" ng-include src=\"'/scripts/components/profiles/tu/overview/partial/basicPgSubTab.html'\"></div>\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "        </uib-tabset>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/programs/datagrid/deleteCellTemplate.html',
    "<div class=\"ui-grid-cell-contents no-select text-center\" ng-click=\"$event.stopPropagation()\">\n" +
    "    <input ng-model=\"grid.appScope.programsToDelete[row.entity.id]\" i-checkbox type=\"checkbox\">\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/programs/datagrid/deleteHeaderCellTemplate.html',
    "<button type=\"button\"\n" +
    "        ng-disabled=\"grid.appScope.isDeleteButtonDisabled()\"\n" +
    "        class=\"btn btn-danger btn-sm\"\n" +
    "        ng-class=\"{'disabled': grid.appScope.isDeleteButtonDisabled()}\"\n" +
    "        ng-click=\"grid.appScope.handleDeleteClick()\">\n" +
    "    <span class=\"glyphicon glyphicon-trash\"></span> <!-- {{col.displayName}} -->\n" +
    "</button>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/programs/datagrid/rowTemplate.html',
    "<div grid=\"grid\" class=\"ui-grid-draggable-row\" draggable=\"true\">\n" +
    "    <div class=\"ui-grid-cell pointer\"\n" +
    "        ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\"\n" +
    "        ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader, 'active': row.entity.id == grid.appScope.selectedProgramId }\"\n" +
    "        role=\"{{col.isRowHeader ? 'rowheader' : 'gridcell'}}\"\n" +
    "        ui-grid-cell>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/programs/tuProfileAddProgramFormView.html',
    "<div class=\"ibox\">\n" +
    "    <div class=\"ibox-title m-t-xl\">\n" +
    "        <h5>Add Program</h5>\n" +
    "        <div class=\"ibox-tools\">\n" +
    "            <a ng-click=\"toggleProgramAddForm()\">\n" +
    "                <i class=\"fa fa-times\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <div wave-spinner class=\"text-right\" ng-show=\"fetchingHistoryLog()\"></div>\n" +
    "\n" +
    "        <form class=\"form-horizontal add-program\" name=\"forms.addProgramForm\" novalidate autocomplete=\"off\">\n" +
    "            <div class=\"form-group\" ng-if=\"InstitutionNameTuPrograms\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Institution Name *</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <input type=\"text\" class=\"form-control\"\n" +
    "                           ng-model=\"InstitutionNameTuPrograms\"\n" +
    "                           ng-disabled=\"true\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors' : isInvalidName}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Program Name *</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <input type=\"text\" placeholder=\"Add name\" class=\"form-control\"\n" +
    "                           ng-model=\"newProgram.name\"\n" +
    "                           ng-required=\"true\"\n" +
    "\n" +
    "                           focus-delay=\"250\"\n" +
    "                           custom-popover popover-html=\"Add a Program name\"\n" +
    "                           popover-placement=\"left\"\n" +
    "                           popover-trigger=\"manual\"\n" +
    "                           popover-visibility=\"{{isInvalidName ? true : false}}\"\n" +
    "                           ng-focus=\"setIsInvalidName(false)\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors' : isInvalidUrl}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">URL Landing Page *</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"Add a Landing Page\"\n" +
    "                        ng-model=\"newProgram.url\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        ng-maxlength=\"255\"\n" +
    "                        ng-keyup=\"ProgramFormController.onKeyUp($event)\"\n" +
    "                        focus-delay=\"250\"\n" +
    "                        custom-popover popover-html=\"Add a valid landing page link. Maximum 255 characters\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{isInvalidUrl ? true : false}}\"\n" +
    "                        ng-focus=\"setIsInvalidUrl(false)\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors' : isInvalidDepartment}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Department *</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <ui-select\n" +
    "                        ng-model=\"newProgram.departmentCoreId\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        ng-disabled=\"isClientDepartment\"\n" +
    "                        on-select=\"ProgramFormController.handleDepartmentChanges(newProgram.departmentCoreId)\"\n" +
    "                        focus-delay=\"250\"\n" +
    "                        custom-popover popover-html=\"Select an option\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{isInvalidDepartment ? true : false}}\"\n" +
    "                        >\n" +
    "                        <ui-select-match placeholder=\"Select an Option\">{{$select.selected.name}}</ui-select-match>\n" +
    "                        <ui-select-choices \n" +
    "                            refresh-delay=\"1000\"\n" +
    "                            repeat=\"option.coreId as option in departmentsListArr | filter:$select.search\">\n" +
    "                            <div ng-bind-html=\"option.name | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors' : isInvalidBelongsTo}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Belongs to *</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <ui-select\n" +
    "                        placeholder=\"Select an option\"\n" +
    "                        ng-model=\"newProgram.belongsTo\"\n" +
    "                        ng-disabled=\"!newProgram.departmentCoreId\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        focus-delay=\"250\"\n" +
    "                        custom-popover popover-html=\"Select an option\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{isInvalidBelongsTo ? true : false}}\"\n" +
    "                        ng-change=\"setIsInvalidBelongsTo(false)\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\">\n" +
    "                            <span>{{$select.selected.title}}</span>\n" +
    "                        </ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.id as option in belongsToList | filter: $select.search\"\n" +
    "                          ui-disable-choice=\"option.disabled\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.title | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-sm-12\">\n" +
    "                    <a class=\"btn btn-primary pull-right\" ng-class=\"{'disabled': addInProgress}\" ng-click=\"handleProgramCreateClick()\">\n" +
    "                        <i class=\"fa fa-check-circle\"></i>\n" +
    "                        <span>Save</span>\n" +
    "                    </a>\n" +
    "                    <a class=\"btn btn-default pull-right\" ng-click=\"toggleProgramAddForm()\">\n" +
    "                        <i class=\"fa fa-ban\"></i>\n" +
    "                        <span>Cancel</span>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/programs/tuProfileEditProgramFormView.html',
    "<div class=\"ibox\">\n" +
    "    <div class=\"ibox-title\">\n" +
    "        <h5>Edit Program</h5>\n" +
    "        <div class=\"ibox-tools\">\n" +
    "            <a ng-click=\"toggleProgramEditForm()\">\n" +
    "                <i class=\"fa fa-times\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <div wave-spinner class=\"text-right\" ng-show=\"isFetchInProgress()\"></div>\n" +
    "        <form class=\"form-horizontal add-program\" ng-show=\"!isFetchInProgress()\" name=\"forms.editProgramForm\" novalidate>\n" +
    "            <div class=\"form-group\" ng-if=\"InstitutionNameTuPrograms\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Institution Name *</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <input type=\"text\" ng-model=\"InstitutionNameTuPrograms\" class=\"form-control\" ng-required=\"true\" ng-disabled=\"true\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors' : isInvalidName}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Program Name *</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <input type=\"text\" placeholder=\"Add name\" ng-model=\"program.name\" class=\"form-control\"\n" +
    "                    ng-required=\"true\"\n" +
    "                    focus-delay=\"250\"\n" +
    "                    custom-popover popover-html=\"Add a Program name\"\n" +
    "                    popover-placement=\"left\"\n" +
    "                    popover-trigger=\"manual\"\n" +
    "                    popover-visibility=\"{{isInvalidName ? true : false}}\"\n" +
    "                    ng-focus=\"setIsInvalidName(false)\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors' : isInvalidUrl}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">URL Landing Page *</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"Add a Landing Page\"\n" +
    "                        ng-model=\"program.url\"\n" +
    "                        ng-keyup=\"ProgramFormController.onKeyUp($event)\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        ng-maxlength=\"255\"\n" +
    "                        focus-delay=\"250\"\n" +
    "                        custom-popover popover-html=\"Add a valid landing page link. Maximum 255 characters\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{isInvalidUrl ? true : false}}\"\n" +
    "                        ng-focus=\"setIsInvalidUrl(false)\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors' : isInvalidDepartment}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Department *</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <ui-select\n" +
    "                        ng-required=\"true\"\n" +
    "                        ng-model=\"program.departmentCoreId\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        ng-disabled=\"isClientDepartment\"\n" +
    "                        on-select=\"ProgramFormController.handleDepartmentChanges(newProgram.departmentCoreId)\"\n" +
    "                        focus-delay=\"250\"\n" +
    "                        custom-popover popover-html=\"Select an option\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{isInvalidDepartment ? true : false}}\"\n" +
    "                        >\n" +
    "                        <ui-select-match placeholder=\"Select an Option\">{{$select.selected.name}}</ui-select-match>\n" +
    "                        <ui-select-choices \n" +
    "                            refresh-delay=\"1000\"\n" +
    "                            repeat=\"option.coreId as option in departmentsListArr | filter:$select.search\">\n" +
    "                            <div ng-bind-html=\"option.name | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-errors' : isInvalidBelongsTo}\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Belongs to *</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <ui-select\n" +
    "                        placeholder=\"Select an option\"\n" +
    "                        ng-model=\"program.belongsTo\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        theme=\"bootstrap\"\n" +
    "                        focus-delay=\"250\"\n" +
    "                        custom-popover popover-html=\"Select an option\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{isInvalidBelongsTo ? true : false}}\"\n" +
    "                        ng-change=\"setIsInvalidBelongsTo(false)\">\n" +
    "                        <ui-select-match placeholder=\"Select an option\">\n" +
    "                            <span>{{$select.selected.title}}</span>\n" +
    "                        </ui-select-match>\n" +
    "                        <ui-select-choices\n" +
    "                          position=\"down\"\n" +
    "                          repeat=\"option.id as option in belongsToList | filter: $select.search\"\n" +
    "                          ui-disable-choice=\"option.disabled\">\n" +
    "                          <div class=\"test\" ng-bind-html=\"option.title | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-sm-12\">\n" +
    "                    <a class=\"btn btn-primary pull-right\"\n" +
    "                       ng-class=\"{'disabled': editInProgress}\"\n" +
    "                       ng-click=\"handleProgramUpdateClick()\">\n" +
    "                        <i class=\"fa fa-check-circle\"></i>\n" +
    "                        <span>Update</span>\n" +
    "                    </a>\n" +
    "                    <a class=\"btn btn-default pull-right\" ng-click=\"toggleProgramEditForm()\">\n" +
    "                        <i class=\"fa fa-ban\"></i>\n" +
    "                        <span>Cancel</span>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/programs/tuProfileProgramsView.html',
    "<div ng-controller=\"TuProfileProgramsController as ProgramsController\">\n" +
    "    <div upgrade-banner\n" +
    "         info-block-class=\"isRightSidePanelActive() ? 'col-sm-9' : 'col-sm-10'\"\n" +
    "         buttons-block-class=\"isRightSidePanelActive() ? 'col-sm-3' : 'col-sm-2'\"\n" +
    "         basic-profile=\"!tuIsAdvanced ? true : false\"\n" +
    "         upgrade-email=\"{{upgradeEmailsTo}}\"\n" +
    "         upgrade-click=\"toggleUpgradeForm()\">\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"alert alert-info\">\n" +
    "        <p>\n" +
    "            <i class=\"fa fa-info-circle\"></i>\n" +
    "            <span>Drag and Drop Rows to Order Program List or profiles.</span>\n" +
    "        </p>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"tab-header\" ng-class=\"{'locked': !tuIsAdvanced}\">\n" +
    "        <div class=\"btn-toggle\">\n" +
    "            <switch class=\"green\"\n" +
    "                ng-disabled=\"alphabeticalOrderingInProgress\"\n" +
    "                ng-model=\"tuProfileData.programsAlphabeticalOrder\"\n" +
    "                ng-change=\"!alphabeticalOrderingInProgress ? handleAlphabeticalOrderClick(tuProfileData.programsAlphabeticalOrder) : null\">\n" +
    "            </switch>\n" +
    "            <span> Display in alphabetical order?</span>\n" +
    "        </div>\n" +
    "        <a class=\"btn btn-primary pull-right\"\n" +
    "            ng-class=\"{'disabled': programsTabSubmitInProgress}\"\n" +
    "            ng-click=\"handleAddProgramClick()\">\n" +
    "            <i class=\"fa fa-plus\"></i>\n" +
    "            <span>Add Program</span>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"tab-body\" ng-class=\"{'locked': !tuIsAdvanced}\">\n" +
    "        <div wave-spinner class=\"wave-spinner\" ng-show=\"isDatagridReloading || !isDatagridRendered\"></div>\n" +
    "\n" +
    "        <div id=\"programsTable\" \n" +
    "            ng-class=\"{'overlay-white': alphabeticalOrderingInProgress}\"\n" +
    "            ng-if=\"!isDatagridReloading && gridOptions\">\n" +
    "            <ui-grid-info ng-if=\"!isRightSidePanelActive()\"></ui-grid-info>\n" +
    "            <div class=\"grid\"\n" +
    "                ui-grid=\"gridOptions\"\n" +
    "                ui-grid-draggable-rows\n" +
    "                ui-grid-selection\n" +
    "                ui-grid-resize-columns\n" +
    "                ui-grid-auto-resize>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/publish/tuProfilePublishHistoryView.html',
    "<div class=\"ibox publish-logs\" ng-controller=\"TuProfilePublishLogsController as PublishLogsController\">\n" +
    "    <div class=\"ibox-title m-t-xl\">\n" +
    "        <h5>Publish Logs</h5>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <div wave-spinner ng-show=\"fetchingPublishLog()\"></div>\n" +
    "        <div ng-show=\"!fetchingPublishLog()\" ng-repeat=\"logs in publishLogs\">\n" +
    "            <div class=\"panel panel-default\" ng-repeat=\"logsPerDay in logs\">\n" +
    "                <div class=\"panel-heading\">\n" +
    "                    <span>{{logsPerDay.date | date:'mediumDate'}}</span>\n" +
    "                </div>\n" +
    "                <div class=\"panel-body\">\n" +
    "                    <ul class=\"list-unstyled\">\n" +
    "                        <li ng-repeat=\"log in logsPerDay.logs\">\n" +
    "                            <span class=\"status\">\n" +
    "                                <span class=\"icon text-success\" ng-if=\"log.status === 'success'\">\n" +
    "                                    <i class=\"fa fa-check\"></i>\n" +
    "                                </span>\n" +
    "                                <span class=\"icon text-danger\" ng-if=\"log.status === 'failure'\">\n" +
    "                                    <i class=\"fa fa-exclamation\"></i>\n" +
    "                                </span>\n" +
    "                                <span class=\"icon text-info\" ng-if=\"log.status === 'progress'\">\n" +
    "                                    <i class=\"fa fa-spinner fa-spin\"></i>\n" +
    "                                </span>\n" +
    "                                <span class=\"icon text-warning\" ng-if=\"log.status === 'pending'\">\n" +
    "                                    <i class=\"fa fa-clock-o\"></i>\n" +
    "                                </span>\n" +
    "                            </span>\n" +
    "                            \n" +
    "                            <span>{{PublishLogsController.getPublishStatusMapped(log.status)}}:</span>\n" +
    "                            <span class=\"bold\">{{log.createdByFullName}}</span>\n" +
    "                            <span class=\"time\">[{{log.createdAt | date:'shortTime'}}]</span>\n" +
    "\n" +
    "                            <span class=\"program\">\n" +
    "                                <span class=\"icon round bg-info\" ng-if=\"log.type === 'ug'\">\n" +
    "                                    <i class=\"fa fa-university\"></i>\n" +
    "                                </span>\n" +
    "                                <span class=\"icon round bg-warning\" ng-if=\"log.type === 'pg'\">\n" +
    "                                    <i class=\"fa fa-graduation-cap\"></i>\n" +
    "                                </span>\n" +
    "                                <span class=\"icon round bg-primary\" ng-if=\"log.type === 'master'\">\n" +
    "                                    <i class=\"fa fa-book\"></i>\n" +
    "                                </span>\n" +
    "                                <span class=\"icon icon-star\" ng-if=\"log.type === 'stars'\">\n" +
    "                                    <i></i>\n" +
    "                                </span>\n" +
    "                            </span>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"!publishLogs.results.length\">\n" +
    "            No publish history\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/publish/tuProfilePublishView.html',
    "<div ng-controller=\"TuProfilePublishController as PublishController\">\n" +
    "    <div class=\"clearfix\" ng-if=\"ugOrPgDisabled\" ng-include=\"'/scripts/shared/banners/ugPgProfileDisable.html'\"></div>\n" +
    "    <div class=\"alert alert-info\">\n" +
    "        <p>\n" +
    "            <i class=\"fa fa-info-circle\"></i>\n" +
    "            <span>Please be aware that published changes will not appear straight away and could take up to 6 hours to be visible on the frontend website.</span>\n" +
    "        </p>\n" +
    "        <p>\n" +
    "            <i class=\"fa fa-info-circle\"></i>\n" +
    "            <span>Whilst a publish is occurring, you may navigate away from this page and it will still progress in the background.</span>\n" +
    "        </p>\n" +
    "    </div>\n" +
    "    <div id=\"publishContainer\" class=\"tab-body\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-lg-4 meter\" ng-repeat=\"section in sections\"\n" +
    "                 ng-class=\"{'modal-overlay-35': section.publishDisabled || isProfileEnabled(section.type)}\">\n" +
    "                <div class=\"panel panel-default\">\n" +
    "                    <div class=\"panel-heading\">\n" +
    "                        <h5 class=\"pull-left\">\n" +
    "                            <span class=\"icon round bg-info\" ng-if=\"section.type == 'ug'\">\n" +
    "                                <i class=\"fa fa-university\"></i>\n" +
    "                            </span>\n" +
    "                            <span class=\"icon round bg-warning\" ng-if=\"section.type == 'pg'\">\n" +
    "                                <i class=\"fa fa-graduation-cap\"></i>\n" +
    "                            </span>\n" +
    "                            <span class=\"icon round bg-primary\" ng-if=\"section.type == 'master'\">\n" +
    "                                <i class=\"fa fa-book\"></i>\n" +
    "                            </span>\n" +
    "                            <span class=\"icon icon-star\" ng-if=\"section.type == 'stars'\">\n" +
    "                                <i></i>\n" +
    "                            </span>\n" +
    "                            <span>{{section.name}}</span>\n" +
    "                        </h5>\n" +
    "                        <a class=\"btn btn-primary btn-xs pull-right\"\n" +
    "                           ng-click=\"handlePublish(section)\">\n" +
    "                            <i class=\"fa fa-cloud-upload\"></i>\n" +
    "                            <span>Publish</span>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"panel-body\">\n" +
    "                        <div class=\"clearfix m-b-md\">\n" +
    "                            <a class=\"btn btn-default btn-sm btn-block\"\n" +
    "                                target=\"_blank\"\n" +
    "                                ng-href=\"{{section.url}}\"\n" +
    "                                ng-class=\"{'disabled': section.viewDisabled}\">\n" +
    "                                <i class=\"fa fa-eye\"></i>\n" +
    "                                <span>View webpage</span>\n" +
    "                            </a>\n" +
    "                            <a class=\"btn btn-default btn-sm btn-block\"\n" +
    "                                ng-if=\"PublishController.devMode\"\n" +
    "                                target=\"_blank\"\n" +
    "                                ng-href=\"{{section.feedPreviewUrl}}\"\n" +
    "                                ng-class=\"{'disabled': section.viewDisabled}\">\n" +
    "                                <i class=\"fa fa-eye\"></i>\n" +
    "                                <span>Preview feed</span>\n" +
    "                            </a>\n" +
    "                        </div>\n" +
    "                        <div class=\"response\" ng-if=\"section.statusMessage\">\n" +
    "                            <p><strong>Reason for Failed Publish:</strong></p>\n" +
    "                            <span class=\"truncate\"><strong>{{section.statusMessage}}</strong></span>\n" +
    "                        </div>\n" +
    "                        <div progress-circle=\"section.status\"></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/publish/tuProfileResubscribeView.html',
    "<div class=\"resubscribe\" ng-controller=\"TuProfileResubscribeController as TuResubscribeController\">\n" +
    "    <div class=\"ibox m-t-xl\" ng-show=\"TuResubscribeController.isAdvanced\">\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-body\">\n" +
    "                <div class=\"subscribe\">\n" +
    "                    <div class=\"pull-left\">\n" +
    "                        <p>Your subscription expires:</p>\n" +
    "                        <span class=\"bold\">{{TuResubscribeController.expiresDate | date:'dd MMMM yyyy'}}</span>\n" +
    "                    </div>\n" +
    "                    <button class=\"btn btn-warning btn-lg pull-right\"\n" +
    "                            ng-show=\"TuResubscribeController.showResubscribeButton()\"\n" +
    "                            ng-click=\"TuResubscribeController.resubscribeClick()\">\n" +
    "                        <i class=\"fa fa-envelope-o\"></i>\n" +
    "                        <span>Resubscribe</span>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"ibox m-t-xl\" ng-show=\"TuResubscribeController.displayResubscribeForm\">\n" +
    "        <div class=\"ibox-title\">\n" +
    "            <h5>Resubscribe to Advance Profile</h5>\n" +
    "        </div>\n" +
    "        <div class=\"ibox-content\">\n" +
    "            <form class=\"form-horizontal preview\" name=\"forms.resubscribeForm\" novalidate>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">To:</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <span class=\"text-label\">{{TuResubscribeController.formData.to}}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">Subject:</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <span class=\"text-label\">{{TuResubscribeController.formData.subject}}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">Name:</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <span class=\"text-label\">{{TuResubscribeController.formData.name}}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">Email:</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <span class=\"text-label\">{{TuResubscribeController.formData.email}}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-5 col-md-4\">Comments:</label>\n" +
    "                    <div class=\"col-sm-7 col-md-8\">\n" +
    "                        <div class=\"textarea\"><textarea class=\"form-control full-width\" ng-model=\"TuResubscribeController.formData.comments\" name=\"comments\" ng-trim=\"true\" rows=\"5\" ></textarea></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-sm-12\">\n" +
    "                        <a class=\"btn btn-primary pull-right\" ng-class=\"{'disabled': TuResubscribeController.inProgress}\" ng-click=\"TuResubscribeController.submitClick()\">\n" +
    "                           <i class=\"fa fa-check-circle\"></i>\n" +
    "                           <span>Submit</span>\n" +
    "                        </a>\n" +
    "                        <a class=\"btn btn-default pull-right\" ng-click=\"TuResubscribeController.cancelClick()\">\n" +
    "                            <i class=\"fa fa-ban\"></i>\n" +
    "                            <span>Cancel</span>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/profiles/tu/subjects/tuProfileSubjectsListsView.html',
    "<div class=\"ibox-title m-t-xl\">\n" +
    "    <h5>Selected Subjects</h5>\n" +
    "</div>\n" +
    "<div class=\"ibox block-institution\">\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <div class=\"subject-selected\" ng-repeat=\"(groupName, groupSubjects) in TopUniversitiesController.subjects\">\n" +
    "            <h5 class=\"title bold\">\n" +
    "                <div class=\"name\">\n" +
    "                    <span>{{groupName}}</span>\n" +
    "                </div>\n" +
    "                <div class=\"program\">\n" +
    "                    <span>\n" +
    "                        UG\n" +
    "                        <span> / </span>\n" +
    "                        PG\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "            </h5>\n" +
    "            \n" +
    "            <div class=\"subject\" ng-repeat=\"subject in groupSubjects | orderBy:'name'\" ng-show=\"tuProfile.ugSubjects[subject.handle] || tuProfile.pgSubjects[subject.handle]\">\n" +
    "                <div class=\"name\">\n" +
    "                    <span>{{subject.name}}</span>\n" +
    "                </div>\n" +
    "                <div class=\"program\">\n" +
    "                    <span><i ng-show=\"tuProfile.ugSubjects[subject.handle]\" class=\"fa fa-check-square-o\"></i></span>\n" +
    "                    <span><i ng-show=\"tuProfile.pgSubjects[subject.handle]\" class=\"fa fa-check-square-o\"></i></span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"hr-line-dashed\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/profiles/tu/subjects/tuProfileSubjectsView.html',
    "<div class=\"subject-tab\" ng-controller=\"TuProfileSubjectsController as SubjectsController\">\n" +
    "    <form name=\"forms.subjectsForm\">\n" +
    "        <div class=\"tab-header\">\n" +
    "            <div class=\"btn-toggle\">\n" +
    "                <switch class=\"green\" ng-model=\"tuProfile.hasPhdSubjects\"></switch>\n" +
    "                <span>Do you do PhD for any of the subjects selected below?</span>\n" +
    "            </div>\n" +
    "            <a class=\"btn btn-primary pull-right\" ng-class=\"{'disabled': subjectsTabSubmitInProgress}\" ng-click=\"handleSubjectTabSubmit()\">\n" +
    "                <i class=\"fa fa-check-circle\"></i>\n" +
    "                <span>Update</span>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "        <div class=\"tab-body\">\n" +
    "            <div wave-spinner class=\"wave-spinner\" ng-show=\"isDatagridReloading\"></div>\n" +
    "            <div class=\"col-wrap\">\n" +
    "                <div class=\"col\" ng-repeat=\"(index, subjectsChunk) in SubjectsController.subjects\">\n" +
    "                    <div ng-repeat=\"(groupName, groupSubjects) in subjectsChunk\">\n" +
    "                        <h4 class=\"title\">\n" +
    "                            <div class=\"name\">\n" +
    "                                <span>{{groupName}}</span>\n" +
    "                            </div>\n" +
    "                            <div class=\"program\">\n" +
    "                                <span>\n" +
    "                                    UG\n" +
    "                                    <span>/</span>\n" +
    "                                    PG\n" +
    "                                </span>\n" +
    "                            </div>\n" +
    "                        </h4>\n" +
    "\n" +
    "                        <div class=\"subject\" ng-repeat=\"subject in groupSubjects | orderBy:'name'\">\n" +
    "                            <div class=\"name\">\n" +
    "                                <span>{{subject.name}}</span>\n" +
    "                            </div>\n" +
    "                            <div class=\"program\">\n" +
    "                                <input i-checkbox type=\"checkbox\" ng-model=\"tuProfile.ugSubjects[subject.handle]\" />\n" +
    "                                <input i-checkbox type=\"checkbox\" ng-model=\"tuProfile.pgSubjects[subject.handle]\" />\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"tab-footer\">\n" +
    "                <a class=\"btn btn-primary pull-right\" ng-class=\"{'disabled': subjectsTabSubmitInProgress}\" ng-click=\"handleSubjectTabSubmit()\">\n" +
    "                    <i class=\"fa fa-check-circle\"></i>\n" +
    "                    <span>Update</span>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/tuProfileUpgradeFormView.html',
    "<div class=\"ibox-title\">\n" +
    "    <h5>Upgrade to Advanced Profile</h5>\n" +
    "    <div class=\"ibox-tools\">\n" +
    "        <a class=\"close-link\" ng-click=\"toggleUpgradeForm()\">\n" +
    "            <i class=\"fa fa-times\"></i>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"ibox\">\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <form class=\"form-horizontal preview\" name=\"forms.upgradeProfile\" novalidate>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">To</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <span class=\"text-label\">{{upgradeEmailsTo}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Subject</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <span class=\"text-label\">I would like more information about Upgrading to an Advanced Profile</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Name</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <span class=\"text-label\">{{upgradeRequest.name}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Email</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <span class=\"text-label\">{{upgradeRequest.email}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-sm-5 col-md-4\">Comments</label>\n" +
    "                <div class=\"col-sm-7 col-md-8\">\n" +
    "                    <div class=\"textarea\"><textarea rows=\"7\" cols=\"50\" placeholder=\"Comments...\" ng-model=\"upgradeRequest.comments\" class=\"form-control no-resize\" ></textarea></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-sm-12\">\n" +
    "                    <a class=\"btn btn-primary pull-right\" ng-class=\"{'disabled': upgradeInProgress}\" ng-click=\"handleUpgradeClick()\">\n" +
    "                        <i class=\"fa fa-check-circle\"></i>\n" +
    "                        <span>Send</span>\n" +
    "                    </a>\n" +
    "                    <a class=\"btn btn-default pull-right\" ng-click=\"toggleUpgradeForm()\">\n" +
    "                        <i class=\"fa fa-ban\"></i>\n" +
    "                        <span>Close</span>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/profiles/tu/tuProfileView.html',
    "<div class=\"wrapper wrapper-content animated fadeInRight page-profiles-tu\" ng-controller=\"TuProfileController as TopUniversitiesController\">\n" +
    "    <div class=\"row\">\n" +
    "        <div ng-class=\"isRightSidePanelActive() ? 'col-sm-8' : 'col-sm-12'\">\n" +
    "            <div class=\"tabs-container\" ng-class=\"{'modal-overlay': loadInProgress()}\">\n" +
    "                <uib-tabset active=\"activeTab\">\n" +
    "                    <uib-tab heading=\"Overview\">\n" +
    "                        <div class=\"panel-body overview\">\n" +
    "                            <div ng-include src=\"'/scripts/components/profiles/tu/overview/tuProfileOverviewView.html'\"></div>\n" +
    "                        </div>\n" +
    "                    </uib-tab>\n" +
    "\n" +
    "                    <uib-tab heading=\"Departments\" ng-if=\"showDepartmentsTab()\">\n" +
    "                          <div class=\"panel-body departments\">\n" +
    "                              <div ng-include src=\"'/scripts/components/profiles/tu/departments/tuProfileDepartmentsView.html'\"></div>\n" +
    "                          </div>\n" +
    "                    </uib-tab>\n" +
    "\n" +
    "                    <uib-tab heading=\"Subjects\">\n" +
    "                        <div class=\"panel-body subjects\">\n" +
    "                            <div ng-include src=\"'/scripts/components/profiles/tu/subjects/tuProfileSubjectsView.html'\"></div>\n" +
    "                        </div>\n" +
    "                    </uib-tab>\n" +
    "\n" +
    "                    <uib-tab heading=\"Programs\">\n" +
    "                        <div class=\"panel-body programs\">\n" +
    "                            <div ng-include src=\"'/scripts/components/profiles/tu/programs/tuProfileProgramsView.html'\"></div>\n" +
    "                        </div>\n" +
    "                    </uib-tab>\n" +
    "\n" +
    "                     <uib-tab heading=\"Media\">\n" +
    "                         <div class=\"panel-body media\">\n" +
    "                             <div ng-include src=\"'/scripts/components/profiles/tu/media/tuProfileMediaView.html'\" id=\"mediaTab\"></div>\n" +
    "                         </div>\n" +
    "                     </uib-tab>\n" +
    "\n" +
    "                   <uib-tab heading=\"Publish\">\n" +
    "                       <div class=\"panel-body publish\">\n" +
    "                           <div ng-include src=\"'/scripts/components/profiles/tu/publish/tuProfilePublishView.html'\"></div>\n" +
    "                       </div>\n" +
    "                   </uib-tab>\n" +
    "\n" +
    "                </uib-tabset>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"showUpgradeForm\" class=\"col-sm-4\">\n" +
    "            <div ng-include src=\"'/scripts/components/profiles/tu/tuProfileUpgradeFormView.html'\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"showHistory\" class=\"col-sm-4\">\n" +
    "            <div ng-include src=\"'/scripts/components/profiles/tu/overview/tuProfileOverviewHistoryView.html'\"></div>\n" +
    "        </div>\n" +
    "        <div ng-show=\"showDepartmentEditForm || showDepartmentAddForm || showClientUpgradeForm\" id=\"departmentBlockPanel\"\n" +
    "             fixed-element-while-scrolling=\"#departmentsTable\"\n" +
    "             class=\"col-sm-4\"\n" +
    "             ng-controller=\"TuProfileDepartmentForm as DepartmentFormController\">\n" +
    "            <div class=\"department-form\" ng-show=\"showDepartmentEditForm\" ng-include src=\"'/scripts/components/profiles/tu/departments/tuProfileEditDepartmentFormView.html'\"></div>\n" +
    "            <div class=\"department-form\" ng-show=\"showDepartmentAddForm\" ng-include src=\"'/scripts/components/profiles/tu/departments/tuProfileAddDepartmentFormView.html'\"></div>\n" +
    "            <div class=\"department-form\" ng-show=\"showClientUpgradeForm\" ng-include src=\"'/scripts/components/profiles/tu/departments/tuProfileUpgradeClientDepartmentFormView.html'\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-if=\"isSubjectsTabActive()\" class=\"col-sm-4\">\n" +
    "            <div ng-include src=\"'/scripts/components/profiles/tu/subjects/tuProfileSubjectsListsView.html'\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"showProgramEditForm || showProgramAddForm\" id=\"programBlockPanel\"\n" +
    "             fixed-element-while-scrolling=\"#programsTable\"\n" +
    "             class=\"col-sm-4\"\n" +
    "             ng-controller=\"TuProfileProgramForm as ProgramFormController\">\n" +
    "            <div ng-show=\"showProgramAddForm\" ng-include src=\"'/scripts/components/profiles/tu/programs/tuProfileAddProgramFormView.html'\"></div>\n" +
    "            <div ng-show=\"showProgramEditForm\" ng-include src=\"'/scripts/components/profiles/tu/programs/tuProfileEditProgramFormView.html'\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"isMediaTabActive()\" class=\"col-sm-4\" ng-class=\"tuIsAdvanced ? '': 'modal-overlay-35'\" fixed-element-while-scrolling=\"#mediaTab\">\n" +
    "            <div id=\"mediaSidebar\" ng-include src=\"'/scripts/components/profiles/tu/media/tuProfileMediaLinkManagerView.html'\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"isPublishTabActive()\" class=\"col-sm-4\">\n" +
    "            <div ng-include src=\"'/scripts/components/profiles/tu/publish/tuProfileResubscribeView.html'\"></div>\n" +
    "            <div ng-include src=\"'/scripts/components/profiles/tu/publish/tuProfilePublishHistoryView.html'\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/tmDirectory/datagrid/campusCellTemplate.html',
    "<div class=\"ui-grid-cell-contents\">{{COL_FIELD CUSTOM_FILTERS | campusArrayToText:col.filter.selectOptions}}</div>\n"
  );


  $templateCache.put('/scripts/components/tmDirectory/datagrid/selectCellTemplate.html',
    "<div class=\"ui-grid-cell-contents\">{{COL_FIELD CUSTOM_FILTERS | boolToText:col.filter.selectOptions}}</div>\n"
  );


  $templateCache.put('/scripts/components/tmDirectory/edit/tmDirectoryEditProgramFormView.html',
    "<div class=\"ibox\" ng-controller=\"TmProfileProgramFormController as TmProfileProgramFormController\">\n" +
    "    <div class=\"ibox-title\">\n" +
    "        <h5>{{ TmDirectoryController.getFormTitle() }}</h5>\n" +
    "        <div class=\"ibox-tools\">\n" +
    "            <a class=\"close-link\" ng-click=\"TmDirectoryController.closeEditForm()\">\n" +
    "                <i class=\"fa fa-times\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"ibox-content\">\n" +
    "        <div>\n" +
    "            <form class=\"form-horizontal\" name=\"forms.editProgramForm\" novalidate autocomplete=\"off\">\n" +
    "                <div ng-include src=\"'/scripts/components/profiles/tm/programs/tmProfileEditProgramFormDetailsView.html'\"></div>\n" +
    "                <div ng-include src=\"'/scripts/components/profiles/tm/programs/tmProfileEditProgramFormStatisticsView.html'\"></div>\n" +
    "                <div ng-show=\"!TmDirectoryController.isProgramAdvanced\" ng-include src=\"'/scripts/components/profiles/tm/programs/tmProfileEditProgramFormCampusView.html'\"></div>\n" +
    "\n" +
    "                <div class=\"separator dashed\"></div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-sm-12\">\n" +
    "                        <switch value=\"yes\"\n" +
    "                            class=\"green\"\n" +
    "                            ng-model=\"TmDirectoryController.sendEmailToClient\"\n" +
    "                            ng-disabled=\"TmDirectoryController.approved\"></switch>\n" +
    "                            <span>Include program requester in status update email</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\" ng-class=\"{'modal-overlay': TmProfileProgramFormController.editInProgress}\">\n" +
    "                    <div class=\"pull-right btn-float-fix\" ng-if=\"!TmDirectoryController.pendingDeletion\">\n" +
    "                        <a class=\"btn btn-primary btn-float-fix\"\n" +
    "                           ng-click=\"TmDirectoryController.handleProgramApproveClick(TmProfileProgramFormController, false)\">\n" +
    "                            <i class=\"fa fa-check-circle\"></i>\n" +
    "                            <span>{{TmDirectoryController.approveButtonTitle}}</span>\n" +
    "                        </a>\n" +
    "                        <a class=\"btn btn-default btn-float-fix\"\n" +
    "                           ng-click=\"TmDirectoryController.handleProgramApproveClick(TmProfileProgramFormController, true)\">\n" +
    "                            <i class=\"fa fa-check-circle\"></i>\n" +
    "                            <span>{{TmDirectoryController.approveButtonTitle}} & Publish</span>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"pull-right btn-float-fix\" ng-if=\"TmDirectoryController.pendingDeletion\">\n" +
    "                        <a class=\"btn btn-default btn-float-fix\"\n" +
    "                           ng-class=\"{'disabled': TmDirectoryController.isProgramAdvanced}\"\n" +
    "                           ng-click=\"TmDirectoryController.handleCancelDeletionClick()\">\n" +
    "                            <i class=\"fa fa-check-circle\"></i>\n" +
    "                            <span>Cancel Deletion</span>\n" +
    "                        </a>\n" +
    "                        <a class=\"btn btn-danger btn-float-fix\"\n" +
    "                           ng-class=\"{'disabled': TmDirectoryController.isProgramAdvanced}\"\n" +
    "                           ng-click=\"TmDirectoryController.handleDeleteAndPublishClick()\">\n" +
    "                            <i class=\"fa fa-check-circle\"></i>\n" +
    "                            <span>Delete & Publish</span>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <a class=\"btn btn-default pull-right m-r-xs btn-float-fix\" ng-click=\"TmDirectoryController.closeEditForm()\">\n" +
    "                        <i class=\"fa fa-ban\"></i>\n" +
    "                        <span>Cancel</span>\n" +
    "                    </a>\n" +
    "\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/tmDirectory/tmDirectoryView.html',
    "<div class=\"wrapper wrapper-content animated fadeInRight page-tm-directory\" ng-controller=\"TmDirectoryController as TmDirectoryController\">\n" +
    "    <div class=\"row\">\n" +
    "        <div id=\"tmDirectoryTable\" ng-class=\"TmDirectoryController.showInfoBlock ? 'col-sm-8 hide-ng-table-pager' : 'col-sm-12'\">\n" +
    "            <div class=\"section\">\n" +
    "                <div class=\"section-body\">\n" +
    "                    <div wave-spinner class=\"wave-spinner\" ng-show=\"!TmDirectoryController.isDatagridRendered\"></div>\n" +
    "\n" +
    "                    <div ng-if=\"gridOptions\">\n" +
    "                        <ui-grid-info ng-if=\"!TmDirectoryController.showInfoBlock\"></ui-grid-info>\n" +
    "                        <div class=\"grid\"\n" +
    "                             ui-grid=\"gridOptions\"\n" +
    "                             ui-grid-selection\n" +
    "                             ui-grid-resize-columns\n" +
    "                             ui-grid-auto-resize\n" +
    "                             ui-grid-cellnav\n" +
    "                             ui-grid-exporter\n" +
    "                             ui-grid-pagination></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"TmDirectoryController.showInfoBlock\"\n" +
    "             fixed-element-while-scrolling=\"#tmDirectoryTable\"\n" +
    "             class=\"col-sm-4\">\n" +
    "            <div class=\"nested-ibox\" ng-show=\"TmDirectoryController.showProgramEditForm\" ng-include src=\"'/scripts/components/tmDirectory/edit/tmDirectoryEditProgramFormView.html'\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/users/list/institutions/datagrid/dateFilterHeaderTemplate.html',
    "<div class=\"ui-grid-filter-container\" ng-repeat=\"colFilter in col.filters\" ng-if=\"colFilter.visible\">\n" +
    "    <input type=\"text\" class=\"ui-grid-filter-input date-picker\"\n" +
    "           ng-model=\"grid.appScope.filters.lastLoginAtRange\"\n" +
    "           date-range-picker=\"\"\n" +
    "           options=\"{eventHandlers: {'apply.daterangepicker': grid.appScope.handleLastLoginAtDateRange}, opens: 'left'}\" />\n" +
    "\n" +
    "    <div role=\"button\" class=\"ui-grid-filter-button-select\"\n" +
    "         ng-click=\"removeFilter(colFilter, $index)\"\n" +
    "         ng-if=\"!colFilter.disableCancelFilterButton\"\n" +
    "         ng-disabled=\"colFilter.term === undefined || colFilter.term === null || colFilter.term === ''\"\n" +
    "         ng-show=\"colFilter.term !== undefined && colFilter.term != null\">\n" +
    "        <i class=\"ui-grid-icon-cancel\" ui-grid-one-bind-aria-label=\"aria.removeFilter\">&nbsp;</i>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/users/list/institutions/datagrid/rowTemplate.html',
    "<div grid=\"grid\" draggable=\"true\">\n" +
    "    <div class=\"ui-grid-cell pointer\"\n" +
    "         ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\"\n" +
    "         ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader, 'active': row.entity.id == grid.appScope.selectedUserId }\"\n" +
    "         role=\"{{col.isRowHeader ? 'rowheader' : 'gridcell'}}\"\n" +
    "         ui-grid-cell>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/users/list/institutions/institutions/institutionsUsersListInstitutionsView.html',
    "<div  class=\"panel-body institutions\" ng-controller=\"InstitutionsUsersInstitutionsController as InstitutionsController\">\n" +
    "    <div class=\"row\">\n" +
    "        <div wave-spinner class=\"load-bar col-lg-12\" ng-show=\"InstitutionsController.isProgressBarVisible()\"></div>\n" +
    "\n" +
    "        <div class=\"col-lg-12\" ng-show=\"selectedInstitutionsNamesLoaded\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-lg-12\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label>Access to Hub and Outreach *</label>\n" +
    "                        <ui-select multiple\n" +
    "                                   close-on-select=\"false\"\n" +
    "                                   ng-model=\"userInstitutions.assigned\"\n" +
    "                                   theme=\"bootstrap\"\n" +
    "                                   reset-search-input=\"true\"\n" +
    "                                   on-remove=\"InstitutionsController.handleItemRemove($item)\"\n" +
    "                                   on-select=\"InstitutionsController.handleItemSelect($item)\"\n" +
    "                                   ng-required=\"true\">\n" +
    "                            <ui-select-match placeholder=\"Type institution name...\">{{$item.name}}</ui-select-match>\n" +
    "                            <ui-select-choices refresh-delay=\"1000\"\n" +
    "                                               position=\"down\"\n" +
    "                                               refresh=\"InstitutionsController.searchInstitutions($select.search)\"\n" +
    "                                               repeat=\"option in institutionsSearchResults | filter:$select.search\">\n" +
    "                                <div ng-bind-html=\"option.name | highlight: $select.search\"></div>\n" +
    "                            </ui-select-choices>\n" +
    "                        </ui-select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-lg-12\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label>Primary Institution *</label>\n" +
    "                        <ui-select\n" +
    "                            id=\"primary-institution-dropdown\"\n" +
    "                            ng-model=\"user.primaryInstitutionCoreId\"\n" +
    "                            ng-required=\"true\"\n" +
    "                            on-select=\"InstitutionsController.handlePrimaryInstitutionChanges()\"\n" +
    "                            theme=\"bootstrap\"\n" +
    "                            >\n" +
    "                            <ui-select-match placeholder=\"Select an Option\">{{$select.selected.name}}</ui-select-match>\n" +
    "                            <ui-select-choices \n" +
    "                                refresh-delay=\"1000\"\n" +
    "                                repeat=\"option.coreId as option in userInstitutions.assigned | filter:$select.search\">\n" +
    "                                <div ng-bind-html=\"option.name | highlight: $select.search\"></div>\n" +
    "                            </ui-select-choices>\n" +
    "                            <ui-select-no-choice>\n" +
    "                                Not found\n" +
    "                            </ui-select-no-choice>\n" +
    "                        </ui-select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-lg-6\"></div>\n" +
    "        <div class=\"col-lg-6\">\n" +
    "            <a class=\"btn btn-primary btn-sm btn-block\"\n" +
    "               ng-class=\"{'disabled': InstitutionsController.disallowSubmit() || !UsersList.hasWriteAccess}\"\n" +
    "               ng-click=\"InstitutionsController.handleInstitutionSubmit()\">Update</a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/users/list/institutions/institutionsUsersListView.html',
    "<div class=\"wrapper wrapper-content animated fadeInRight page-institutions-users-list\" ng-controller=\"InstitutionsUsersListController as UsersList\">\n" +
    "\n" +
    "    <p>\n" +
    "        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"UsersList.handleAddInstitutionsUserClick()\">\n" +
    "            <i class=\"fa fa-user-plus\"></i>\n" +
    "            Add User\n" +
    "        </button>\n" +
    "    </p>\n" +
    "    <div class=\"row\">\n" +
    "        <div id=\"schoolUsersTable\" ng-class=\"showInfoBlock ? 'col-sm-3 hide-ng-table-pager' : 'col-sm-12'\">\n" +
    "            <div class=\"ibox float-e-margins\">\n" +
    "                <div class=\"ibox-content table-responsive\">\n" +
    "                    <div wave-spinner class=\"wave-spinner\" ng-show=\"UsersList.isDatagridReloading || !UsersList.isDatagridRendered\"></div>\n" +
    "\n" +
    "                    <div class=\"full-width scroll-horizontal hide-vertical-overflow\" mouse-scroll-horizontal>\n" +
    "                        <div ng-if=\"UsersList.showDatagrid\" ng-class=\"{'modal-overlay-35': UsersList.isDatagridReloading}\">\n" +
    "                            <ui-grid-info ng-if=\"!showInfoBlock\"></ui-grid-info>\n" +
    "                            <div class=\"grid\"\n" +
    "                                 ui-grid=\"UsersList.grid.options\"\n" +
    "                                 ui-grid-pagination\n" +
    "                                 ui-grid-selection\n" +
    "                                 ui-grid-resize-columns\n" +
    "                                 ui-grid-auto-resize></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div fixed-element-while-scrolling=\"#schoolUsersTable\" ng-show=\"showInfoBlock\" class=\"col-sm-9 scroll-floating-element\">\n" +
    "            <div class=\"ibox block-user\">\n" +
    "                <div class=\"ibox-content\">\n" +
    "                    <div class=\"ibox-tools\">\n" +
    "                        <a class=\"close-link\" ng-click=\"UsersList.handleEditCloseClick()\">\n" +
    "                            <i class=\"fa fa-times\"></i>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"tab-content\">\n" +
    "                        <div class=\"tab-pane active\">\n" +
    "\n" +
    "                            <div class=\"row m-b-lg\" ng-show=\"user.id\">\n" +
    "                                <div class=\"col-lg-4 text-center\">\n" +
    "                                    <div class=\"m-b-sm\">\n" +
    "                                        <img alt=\"image\" class=\"img-circle\" gravatar-src=\"user.email\" gravatar-size=\"100\">\n" +
    "                                    </div>\n" +
    "                                    <div class=\"m-b-sm\">\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-lg-8\">\n" +
    "                                    <h2>\n" +
    "                                        {{user.fullname}}\n" +
    "                                    </h2>\n" +
    "                                    <a href=\"mailto:{{user.email}}\" class=\"btn btn-primary btn-sm\">\n" +
    "                                        <i class=\"fa fa-envelope\"></i> Send Email\n" +
    "                                    </a>\n" +
    "                                    <a ng-show=\"!user.active\" ng-click=\"handleActivateClick(user)\" class=\"btn btn-warning btn-sm\" ng-class=\"{'disabled':activateInProgress}\">\n" +
    "                                        <i class=\"fa fa-undo\"></i> Activate\n" +
    "                                    </a>\n" +
    "                                    <a ng-show=\"user.active\" ng-click=\"handleDeactivateClick(user)\" class=\"btn btn-danger btn-sm\" ng-class=\"{'disabled':deactivateInProgress}\">\n" +
    "                                        <i class=\"fa fa-ban\"></i> Deactivate\n" +
    "                                    </a>\n" +
    "                                    <!--\n" +
    "                                    <a class=\"btn btn-default btn-sm\" ng-click=\"handleResetClick(user)\">\n" +
    "                                        <i class=\"fa fa-refresh\"></i> Reset unsaved changes\n" +
    "                                    </a>-->\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"client-detail\">\n" +
    "                                <div class=\"full-height-scroll\">\n" +
    "                                    <div class=\"row\">\n" +
    "                                        <div class=\"col-lg-12\">\n" +
    "                                            <div class=\"tabs-container\">\n" +
    "                                                <uib-tabset active=\"activeTab\">\n" +
    "                                                    <uib-tab heading=\"Personal details\" disable=\"disabledInstitutionsUserListSubTabs['personalDetails']\">\n" +
    "                                                        <div ng-include src=\"'/scripts/components/users/list/institutions/personal-details/institutionsUsersListPersonalDetailsView.html'\"></div>\n" +
    "                                                    </uib-tab>\n" +
    "                                                    <uib-tab heading=\"Permissions\" disable=\"disabledInstitutionsUserListSubTabs['permissions']\">\n" +
    "                                                        <div ng-include src=\"'/scripts/components/users/list/institutions/permissions/institutionsUsersListPermissionsView.html'\"></div>\n" +
    "                                                    </uib-tab>\n" +
    "                                                    <uib-tab heading=\"Institutions\" disable=\"disabledInstitutionsUserListSubTabs['institutions']\">\n" +
    "                                                        <div ng-include src=\"'/scripts/components/users/list/institutions/institutions/institutionsUsersListInstitutionsView.html'\"></div>\n" +
    "                                                    </uib-tab>\n" +
    "                                                </uib-tabset>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <pre ng-show=\"UsersList.devMode\">{{user|json}}</pre>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/users/list/institutions/institutionsUsersView.html',
    "<div class=\"page-contacts\" ng-controller=\"InstitutionsUsersController as InstitutionsUsersController\">\n" +
    "    <div ng-include src=\"'/scripts/components/users/list/institutions/institutionsUsersListView.html'\"></div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/components/users/list/institutions/permissions/institutionsUsersListPermissionsView.html',
    "<div class=\"panel-body\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-lg-6 block-permissions\">\n" +
    "            <p>\n" +
    "                <strong>Departments / Roles</strong>\n" +
    "            </p>\n" +
    "            <div ng-repeat=\"(groupName, roles) in UsersList.rolesList | groupBy: 'groupName'\">\n" +
    "                <label>{{groupName}}</label>\n" +
    "                <div ng-repeat=\"role in roles\" class=\"permission-row\">\n" +
    "                    <switch ng-model=\"user.roles[role.roleHandle]\"\n" +
    "                            ng-disabled=\"role.roleHandle !== 'custom' && user.roles.custom\"\n" +
    "                            name=\"{{role.roleHandle}}\"\n" +
    "                            class=\"{{role.roleHandle=='custom' ? 'red': 'green'}}\"\n" +
    "                            ng-change=\"handleRoleClick(role)\"\n" +
    "                    ></switch>{{role.roleName}}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-lg-6\">\n" +
    "            <h3 ng-show=\"user.globalAdmin\" class=\"btn-sm badge-info\">\n" +
    "                Full Access\n" +
    "            </h3>\n" +
    "            <div ng-class=\"{'modal-overlay': user.globalAdmin}\">\n" +
    "                <p>\n" +
    "                    <strong>Assign Pages</strong>\n" +
    "                </p>\n" +
    "                <div class=\"table-responsive\">\n" +
    "                    <table class=\"table table-striped\">\n" +
    "                        <thead>\n" +
    "                        <tr>\n" +
    "                            <th>Section</th>\n" +
    "                            <th>Page</th>\n" +
    "                            <th>Assign</th>\n" +
    "                        </tr>\n" +
    "                        </thead>\n" +
    "                        <tbody>\n" +
    "                        <tr ng-repeat=\"(key, page) in UsersList.sectionsList\">\n" +
    "                            <td>{{page.sectionName}}</td>\n" +
    "                            <td>{{page.pageName}}</td>\n" +
    "                            <td>\n" +
    "                                <input i-checkbox type=\"checkbox\" name=\"{{page.pageHandle}}\" ng-model=\"user.accessTo[page.pageHandle]\" ng-change=\"activateCustomRole()\"  />\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        </tbody>\n" +
    "                    </table>\n" +
    "                    <a class=\"btn btn-primary btn-sm btn-block\"\n" +
    "                       ng-class=\"{'disabled':permissionsSubmitInProgress || !UsersList.hasWriteAccess}\"\n" +
    "                       ng-click=\"handlePermissionsSubmit()\">Update</a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/users/list/institutions/personal-details/institutionsUsersListPersonalDetailsView.html',
    "<div class=\"panel-body\">\n" +
    "    <div class=\"row\">\n" +
    "        <form name=\"forms.personalDetailsForm\" class=\"clearfix\" novalidate>\n" +
    "            <div class=\"col-lg-6 block-personal-details\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label>User type *</label>\n" +
    "                    <ui-select\n" +
    "                        name=\"typeId\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        ng-disabled=\"true\"\n" +
    "                        ng-model=\"selectedItem.selectedOptionType\"\n" +
    "                        theme=\"bootstrap\">\n" +
    "                        <ui-select-match placeholder=\"Select an Option\">{{$select.selected.name}}</ui-select-match>\n" +
    "                        <ui-select-choices \n" +
    "                            refresh-delay=\"1000\"\n" +
    "                            repeat=\"option in UsersList.userTypes | filter:$select.search\">\n" +
    "                            <div ng-bind-html=\"option.name | highlight: $select.search\"></div>\n" +
    "                        </ui-select-choices>\n" +
    "                        <ui-select-no-choice>\n" +
    "                            Not found\n" +
    "                        </ui-select-no-choice>\n" +
    "                    </ui-select>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label>Title</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"user.title\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\" ng-class=\"{'has-errors': !UsersList.isValidFirstName()}\">\n" +
    "                    <label>First (Given) Name *</label>\n" +
    "                    <input name=\"firstname\"\n" +
    "                        type=\"text\"\n" +
    "                        class=\"form-control\"\n" +
    "                        ng-model=\"user.firstname\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        ng-focus=\"UsersList.setValid('firstname')\"\n" +
    "                        custom-popover\n" +
    "                        popover-html=\"Add a first (given) name\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{!UsersList.isValidFirstName()}}\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\" ng-class=\"{'has-errors': !UsersList.isValidLastName()}\">\n" +
    "                    <label>Last (Family Name) *</label>\n" +
    "                    <input name=\"lastname\"\n" +
    "                        type=\"text\"\n" +
    "                        class=\"form-control\"\n" +
    "                        ng-model=\"user.lastname\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        ng-focus=\"UsersList.setValid('lastname')\"\n" +
    "                        custom-popover\n" +
    "                        popover-html=\"Add a last (family) name\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{!UsersList.isValidLastName()}}\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\" ng-class=\"{'has-errors': !UsersList.isValidEmail()}\">\n" +
    "                    <label>Email *</label>\n" +
    "                    <input name=\"email\"\n" +
    "                        type=\"email\"\n" +
    "                        class=\"form-control\"\n" +
    "                        ng-model=\"user.email\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        ng-focus=\"UsersList.setValid('email')\"\n" +
    "                        custom-popover\n" +
    "                        popover-html=\"Add an email\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{!UsersList.isValidEmail()}}\">\n" +
    "                </div>\n" +
    "\n" +
    "                <user-password user=\"user\"></user-password>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label>Position</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"user.position\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label>Phone</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"user.phone\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label>Primary Institution</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"user.primaryInstitutionName\" disabled=\"disabled\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-lg-6 block-contact-types\">\n" +
    "                <table class=\"table table-striped\">\n" +
    "                    <thead>\n" +
    "                    <tr>\n" +
    "                        <th>Contact Type</th>\n" +
    "                        <th>Assign</th>\n" +
    "                        <th>Primary</th>\n" +
    "                    </tr>\n" +
    "                    </thead>\n" +
    "                    <tbody>\n" +
    "                    <tr ng-repeat=\"types in UsersList.contactTypes\">\n" +
    "                        <td>\n" +
    "                            {{types.name}}\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <input ng-model=\"user.contactTypes[types.handle].assigned\" ng-change=\"handleContactTypeClick(types.handle)\" i-checkbox=\"{{types.assign}}\" type=\"checkbox\" />\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <input ng-model=\"user.contactTypes[types.handle].primary\" ng-change=\"handlePrimaryContactTypeClick(types.handle)\" i-checkbox=\"{{types.primary}}\" type=\"checkbox\" />\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "\n" +
    "                <a class=\"btn btn-primary btn-sm btn-block\"\n" +
    "                   ng-class=\"{'disabled':personalDetailsSubmitInProgress || !UsersList.hasWriteAccess}\"\n" +
    "                   ng-click=\"handlePersonalDetailsSubmit()\">{{user.id ? 'Update' : 'Save'}}</a>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/users/list/qs/partial/permissions.html',
    "<div class=\"panel-body\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-lg-6 block-permissions\">\n" +
    "            <p>\n" +
    "                <strong>Departments / Roles</strong>\n" +
    "            </p>\n" +
    "            <div ng-repeat=\"(groupName, roles) in UsersList.rolesList | groupBy: 'groupName'\">\n" +
    "                <label>{{groupName}}</label>\n" +
    "                <div ng-repeat=\"role in roles\" class=\"permission-row\">\n" +
    "                    <switch ng-model=\"user.roles[role.roleHandle]\"\n" +
    "                            ng-disabled=\"role.roleHandle !== 'custom' && user.roles.custom\"\n" +
    "                            name=\"{{role.roleHandle}}\"\n" +
    "                            class=\"{{role.roleHandle=='custom' ? 'red': 'green'}}\"\n" +
    "                            ng-change=\"handleRoleClick(role)\"\n" +
    "                    ></switch>{{role.roleName}}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-lg-6\">\n" +
    "            <div>\n" +
    "                <p>\n" +
    "                    <strong>Assign Pages</strong>\n" +
    "                </p>\n" +
    "\n" +
    "                <div class=\"table-responsive panel\">\n" +
    "                    <div class=\"clickable panel-heading panel-primary-light\" ng-click=\"toggleClientSections()\">\n" +
    "                        Clients <i class=\"pull-right glyphicon\" ng-class=\"{'glyphicon-chevron-down': showClientSections, 'glyphicon-chevron-right': !showClientSections}\"></i>\n" +
    "                    </div>\n" +
    "                    <table ng-show=\"showClientSections\" class=\"table table-striped\">\n" +
    "                        <thead>\n" +
    "                        <tr>\n" +
    "                            <th>Section</th>\n" +
    "                            <th>Page</th>\n" +
    "                            <th>Assign</th>\n" +
    "                        </tr>\n" +
    "                        </thead>\n" +
    "                        <tbody>\n" +
    "                        <tr ng-repeat=\"(key, page) in UsersList.clientSectionsList\">\n" +
    "                            <td>{{page.sectionName}}</td>\n" +
    "                            <td>{{page.pageName}}</td>\n" +
    "                            <td>\n" +
    "                                <input i-checkbox type=\"checkbox\" name=\"{{page.pageHandle}}\" ng-model=\"user.accessTo[page.pageHandle]\" ng-change=\"activateCustomRole()\" />\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        </tbody>\n" +
    "                    </table>\n" +
    "\n" +
    "                    <div class=\"clickable panel-heading panel-primary-light\" ng-click=\"toggleQsSections()\">\n" +
    "                        QS Staff <i class=\"pull-right glyphicon\" ng-class=\"{'glyphicon-chevron-down': showQsSections, 'glyphicon-chevron-right': !showQsSections}\"></i>\n" +
    "                    </div>\n" +
    "                    <table ng-show=\"showQsSections\" class=\"table table-striped\">\n" +
    "                        <thead>\n" +
    "                        <tr>\n" +
    "                            <th>Section</th>\n" +
    "                            <th>Page</th>\n" +
    "                            <th>Assign</th>\n" +
    "                        </tr>\n" +
    "                        </thead>\n" +
    "                        <tbody>\n" +
    "                        <tr ng-repeat=\"(key, page) in UsersList.qsSectionsList\">\n" +
    "                            <td>{{page.sectionName}}</td>\n" +
    "                            <td>{{page.pageName}}</td>\n" +
    "                            <td>\n" +
    "                                <input i-checkbox type=\"checkbox\" name=\"{{page.pageHandle}}\"\n" +
    "                                       ng-model=\"user.accessTo[page.pageHandle]\"\n" +
    "                                       ng-change=\"activateCustomRole()\"\n" +
    "                                       ng-disabled=\"{{page.disabled}}\"/>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        </tbody>\n" +
    "                    </table>\n" +
    "                </div>\n" +
    "                <a class=\"btn btn-primary btn-sm btn-block\" ng-class=\"{'disabled':permissionsSubmitInProgress}\" ng-click=\"handlePermissionsSubmit()\">Update</a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/users/list/qs/partial/personalDetails.html',
    "<div class=\"panel-body\">\n" +
    "    <div class=\"row\">\n" +
    "        <form name=\"forms.personalDetailsForm\" class=\"form-horizontal clearfix\" novalidate>\n" +
    "            <div class=\"col-lg-6 block-personal-details\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label>Title</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"user.title\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\" ng-class=\"{'has-errors': !UsersList.isValidFirstName()}\">\n" +
    "                    <label>First (Given) Name *</label>\n" +
    "                    <input name=\"firstname\"\n" +
    "                        type=\"text\"\n" +
    "                        class=\"form-control\"\n" +
    "                        ng-model=\"user.firstname\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        ng-focus=\"UsersList.setValid('firstname')\"\n" +
    "                        custom-popover\n" +
    "                        popover-html=\"Add a first (given) name\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{!UsersList.isValidFirstName()}}\">\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\" ng-class=\"{'has-errors': !UsersList.isValidLastName()}\">\n" +
    "                    <label>Last (Family Name) *</label>\n" +
    "                    <input name=\"lastname\"\n" +
    "                        type=\"text\"\n" +
    "                        class=\"form-control\"\n" +
    "                        ng-model=\"user.lastname\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        ng-focus=\"UsersList.setValid('lastname')\"\n" +
    "                        custom-popover\n" +
    "                        popover-html=\"Add a last (family) name\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{!UsersList.isValidLastName()}}\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label>Position</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"user.position\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\" ng-class=\"{'has-errors': !UsersList.isValidEmail()}\">\n" +
    "                    <label>Email *</label>\n" +
    "                    <input name=\"email\"\n" +
    "                        type=\"email\"\n" +
    "                        class=\"form-control\"\n" +
    "                        ng-model=\"user.email\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        ng-focus=\"UsersList.setValid('email')\"\n" +
    "                        custom-popover\n" +
    "                        popover-html=\"Add an email\"\n" +
    "                        popover-placement=\"left\"\n" +
    "                        popover-trigger=\"manual\"\n" +
    "                        popover-visibility=\"{{!UsersList.isValidEmail()}}\">\n" +
    "                </div>\n" +
    "\n" +
    "                <user-password user=\"user\"></user-password>\n" +
    "            </div>\n" +
    "            <div class=\"col-lg-6 block-contact-types\">\n" +
    "                <table class=\"table table-striped\">\n" +
    "                    <thead>\n" +
    "                    <tr>\n" +
    "                        <th>Contact Type</th>\n" +
    "                        <th>Assign</th>\n" +
    "                        <th>Primary</th>\n" +
    "                    </tr>\n" +
    "                    </thead>\n" +
    "                    <tbody>\n" +
    "                    <tr ng-repeat=\"types in UsersList.contactTypes\">\n" +
    "                        <td>\n" +
    "                            {{types.name}}\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <input ng-model=\"user.contactTypes[types.handle].assigned\" i-checkbox=\"{{types.assign}}\" type=\"checkbox\" />\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <input ng-model=\"user.contactTypes[types.handle].primary\" ng-change=\"handlePrimaryContactTypeClick(types.handle)\" i-checkbox=\"{{types.primary}}\" type=\"checkbox\" />\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "                <a class=\"btn btn-primary btn-sm btn-block\" ng-class=\"{'disabled':personalDetailsSubmitInProgress}\" ng-click=\"handlePersonalDetailsSubmit()\">{{user.id ? 'Update' : 'Save'}}</a>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/users/list/qs/qsUsersListView.html',
    "<div class=\"wrapper wrapper-content animated fadeInRight page-qs-users-list\" ng-controller=\"QsUsersListController as UsersList\">\n" +
    "    <p>\n" +
    "        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"UsersList.handleAddQsUserClick()\">\n" +
    "            <i class=\"fa fa-user-plus\"></i>\n" +
    "            Add User\n" +
    "        </button>\n" +
    "    </p>\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div id=\"usersTable\" ng-class=\"showInfoBlock ? 'col-sm-3 hide-ng-table-pager' : 'col-sm-12'\">\n" +
    "            <div class=\"ibox float-e-margins\">\n" +
    "                <div class=\"ibox-content table-responsive\">\n" +
    "                    <div wave-spinner class=\"wave-spinner\" ng-show=\"isDatagridReloading || !isDatagridRendered\"></div>\n" +
    "\n" +
    "                    <div class=\"full-width scroll-horizontal hide-vertical-overflow\" mouse-scroll-horizontal>\n" +
    "                        <div ng-if=\"UsersList.grid.options\" ng-class=\"{'modal-overlay-35': isDatagridReloading}\">\n" +
    "                            <ui-grid-info ng-if=\"!showInfoBlock\"></ui-grid-info>\n" +
    "                            <div class=\"grid\"\n" +
    "                                 ui-grid=\"UsersList.grid.options\"\n" +
    "                                 ui-grid-pagination\n" +
    "                                 ui-grid-selection\n" +
    "                                 ui-grid-resize-columns\n" +
    "                                 ui-grid-auto-resize></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div fixed-element-while-scrolling=\"#usersTable\" ng-show=\"showInfoBlock\" class=\"col-sm-9 scroll-floating-element\">\n" +
    "            <div class=\"ibox block-user\">\n" +
    "                <div class=\"ibox-content\">\n" +
    "                    <div class=\"ibox-tools\">\n" +
    "                        <a class=\"close-link\" ng-click=\"UsersList.handleEditCloseClick()\">\n" +
    "                            <i class=\"fa fa-times\"></i>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"tab-content\">\n" +
    "                        <div class=\"tab-pane active\">\n" +
    "                            <div class=\"row m-b-lg\" ng-show=\"user.id\">\n" +
    "                                <div class=\"col-lg-4 text-center\">\n" +
    "                                    <div class=\"m-b-sm\">\n" +
    "                                        <img alt=\"image\" class=\"img-circle\" gravatar-src=\"user.email\" gravatar-size=\"100\">\n" +
    "                                    </div>\n" +
    "\n" +
    "                                    <div class=\"m-b-sm\">\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-lg-8\">\n" +
    "                                    <h2>\n" +
    "                                        {{user.fullname}}\n" +
    "                                    </h2>\n" +
    "\n" +
    "                                    <a href=\"mailto:{{user.email}}\" class=\"btn btn-primary btn-sm\">\n" +
    "                                        <i class=\"fa fa-envelope\"></i> Send Email\n" +
    "                                    </a>\n" +
    "\n" +
    "                                    <a ng-show=\"!user.active\" ng-click=\"handleActivateClick(user)\" class=\"btn btn-warning btn-sm\" ng-class=\"{'disabled':activateInProgress}\">\n" +
    "                                        <i class=\"fa fa-undo\"></i> Activate\n" +
    "                                    </a>\n" +
    "\n" +
    "                                    <a ng-show=\"user.active\" ng-click=\"handleDeactivateClick(user)\" class=\"btn btn-danger btn-sm\" ng-class=\"{'disabled':deactivateInProgress}\">\n" +
    "                                        <i class=\"fa fa-ban\"></i> Deactivate\n" +
    "                                    </a>\n" +
    "\n" +
    "                                    <a class=\"btn btn-default btn-sm\" ng-click=\"handleResetClick(user)\">\n" +
    "                                        <i class=\"fa fa-refresh\"></i> Reset unsaved changes\n" +
    "                                    </a>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"client-detail\">\n" +
    "                                <div class=\"full-height-scroll scroll-floating-element\" full-scroll>\n" +
    "                                    <div class=\"row\">\n" +
    "                                        <div class=\"col-lg-12\">\n" +
    "                                            <div class=\"tabs-container\">\n" +
    "                                                <uib-tabset active=\"activeQsUserListSubTabs\">\n" +
    "                                                    <uib-tab heading=\"Personal details\" disable=\"disabledQsUserListSubTabs['personalDetails']\">\n" +
    "                                                        <div ng-include src=\"'/scripts/components/users/list/qs/partial/personalDetails.html'\"></div>\n" +
    "                                                    </uib-tab>\n" +
    "                                                    <uib-tab heading=\"Permissions\" disable=\"disabledQsUserListSubTabs['permissions']\">\n" +
    "                                                        <div ng-include src=\"'/scripts/components/users/list/qs/partial/permissions.html'\"></div>\n" +
    "                                                    </uib-tab>\n" +
    "                                                </uib-tabset>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <pre ng-show=\"UsersList.devMode\">{{user|json}}</pre>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/components/users/shared/password/passwordView.html',
    "<div class=\"password-box\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-lg-7 col-md-12 col-sm-12 col-xs-12\">\n" +
    "            <div ng-class=\"$ctrl.cnf.blockClass\">\n" +
    "                <div class=\"label-container col-lg-5 col-md-12 col-sm-12 col-xs-12\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label ng-class=\"$ctrl.cnf.labelClass\">\n" +
    "                            {{$ctrl.cnf.label || 'Password'}} <span ng-show=\"$ctrl.isRequired()\">*</span>\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-lg-7 col-md-12 col-sm-12 col-xs-12\">\n" +
    "                    <div class=\"form-group\" ng-class=\"{'has-errors': !$ctrl.isPassLen}\">\n" +
    "                        <input ng-class=\"$ctrl.isValid() ? 'valid' : 'invalid'\"\n" +
    "                            type=\"password\"\n" +
    "                            name=\"password\"\n" +
    "                            class=\"form-control\"\n" +
    "                            placeholder=\"{{$ctrl.isRequired() ? 'Enter password' : ' New password'}}\"\n" +
    "                            ng-model=\"$ctrl.user.password\"\n" +
    "                            ng-change=\"$ctrl.handleChanges()\"\n" +
    "                            autocomplete=\"new-password\"\n" +
    "                            ng-focus=\"$ctrl.data\"\n" +
    "                            custom-popover\n" +
    "                            popover-html=\"Add a password\"\n" +
    "                            popover-placement=\"left\"\n" +
    "                            popover-trigger=\"manual\"\n" +
    "                            popover-visibility=\"{{!$ctrl.isPassLen}}\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-class=\"$ctrl.cnf.blockClass\" ng-if=\"$ctrl.cnf.resetOnLogin\">\n" +
    "                <div class=\"col-lg-12\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input ng-class=\"reset-on-login\" ng-model=\"$ctrl.user.passwordReset\" type=\"checkbox\" />\n" +
    "                        reset password on login\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-lg-5 col-md-12 col-sm-12 col-xs-12\">\n" +
    "            <div ng-class=\"$ctrl.cnf.blockClass\">\n" +
    "                <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12 text-left\">\n" +
    "                    <div class=\"form-group\" ng-if=\"$ctrl.user.password || $ctrl.isRequired()\">\n" +
    "                        <div class=\"validation-items\">\n" +
    "                            <div class=\"validation-item\" ng-repeat=\"item in $ctrl.validators\">\n" +
    "                                <i class=\"fa fa-circle\" ng-class=\"item.status ? 'text-navy' : 'text-danger'\"></i> {{item.name}}\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/shared/appUpdateMessage/appUpdateMessageView.html',
    "<div id=\"info-msg\" ng-if=\"$ctrl.isVisible()\">\n" +
    "    New version of QS Hub is available. Please reload the page.\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/shared/banners/tmProfileView.html',
    "<div class=\"alert alert-warning ng-scope col-lg-12 \">\n" +
    "    <i class=\"fa fa-star\"></i> You are not subscribed currently for <strong>{{profileDisableName}}</strong> profile. If you like to do so, please contact:<strong> tusupportqs.com </strong>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/shared/banners/ugPgProfileDisable.html',
    "<div class=\"alert alert-warning ng-scope col-lg-12 \">\n" +
    "    <i class=\"fa fa-star\"></i> You are not subscribed currently for <strong>{{profileDisableName}}</strong> profile. If you like to do so, please contact:<strong> tusupport@qs.com </strong>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/shared/breadcrumbs/breadcrumbsView.html',
    "<div class=\"page-heading row\" >\n" +
    "    <div class=\"col-lg-12\">\n" +
    "        <h2>{{$state.current.data.label}}</h2>\n" +
    "        <ol class=\"breadcrumb\">\n" +
    "            <li ng-if=\"$state.$current.parent.data.label\">\n" +
    "                <span>{{$state.$current.parent.data.label}}</span>\n" +
    "            </li>\n" +
    "            <li class=\"active\">\n" +
    "                <strong>{{$state.current.data.label}}</strong>\n" +
    "            </li>\n" +
    "        </ol>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/shared/disabledInstitution/disabledInstitutionView.html',
    "<div class=\"widget red-bg p-lg text-center disabled-institution col-lg-4\">\n" +
    "    <div class=\"m-b-md\">\n" +
    "        <i class=\"fa fa-warning fa-4x\"></i>\n" +
    "        <h1 class=\"m-xs\">Institution is disabled</h1>\n" +
    "        <span class=\"font-bold no-margins\">\n" +
    "            Please contact <a href=\"mailto:tuonlinesupport@qs.com\"><strong>tuonlinesupport@qs.com</strong></a>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/shared/displayFiltering/displayFilteringView.html',
    "<div class=\"ibox-tools dropdown\" uib-dropdown>\n" +
    "    <a aria-expanded=\"false\" aria-haspopup=\"true\" class=\"dropdown-toggle\" href=\"#\" uib-dropdown-toggle=\"\" ng-show=\"active\">\n" +
    "        <i class=\"fa fa-wrench\"></i>\n" +
    "    </a>\n" +
    "    <ul class=\"dropdown-menu dropdown-filter\" uib-dropdown-menu>\n" +
    "        <li class=\"hidden-column\" ng-repeat=\"column in columns\">\n" +
    "            <label><input type=\"checkbox\" ng-model-options=\"{getterSetter: true}\" ng-model=\"column.show\" ng-click=\"callback()\" />{{column.title}}</label>\n" +
    "        </li>\n" +
    "        <li class=\"display-filtering-buttons\" ng-if=\"columns.length > 0\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-lg-4\">\n" +
    "                    <a class=\"btn btn-sm btn-primary\" ng-click=\"displayFilteringSelectAll()\">Select All</a>\n" +
    "                </div>\n" +
    "                <div class=\"col-lg-4 col-lg-offset-2\">\n" +
    "                    <a class=\"btn btn-sm btn-danger\" ng-click=\"closeDisplayFiltering($event)\">Close</a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/shared/footer/footerView.html',
    "<p>\n" +
    "    <span>\n" +
    "    	<strong>Copyright</strong>\n" +
    "    	QS Quacquarelli Symonds Ltd &copy;\n" +
    "    	<span current-date=\"yyyy\"></span>\n" +
    "    </span>\n" +
    "    <span class=\"pull-right\">\n" +
    "    	Version <strong>{{version}}</strong>\n" +
    "    </span>\n" +
    "</p>\n"
  );


  $templateCache.put('/scripts/shared/modal/modalTemplate.html',
    "<div class=modal-body ng-swipe-left=Lightbox.nextImage() ng-swipe-right=Lightbox.prevImage()>\n" +
    "    <div class=lightbox-nav><button class=close aria-hidden=true ng-click=$dismiss()>×</button>\n" +
    "        <div class=btn-group ng-if=\"Lightbox.images.length > 1\">\n" +
    "            <a class=\"btn btn-xs btn-default previous\" ng-click=Lightbox.prevImage()>‹</a>\n" +
    "            <a class=\"btn btn-xs btn-default next\" ng-click=Lightbox.nextImage()>›</a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=lightbox-image-container>\n" +
    "        <div class=lightbox-image-caption><span>{{Lightbox.imageCaption}}</span></div>\n" +
    "        <img ng-if=!Lightbox.isVideo(Lightbox.image) lightbox-src={{Lightbox.imageUrl}}>\n" +
    "        <div ng-if=Lightbox.isVideo(Lightbox.image) class=\"embed-responsive embed-responsive-16by9\">\n" +
    "            <video ng-if=!Lightbox.isSharedVideo(Lightbox.image) lightbox-src={{Lightbox.imageUrl}} controls autoplay></video>\n" +
    "            <embed-video ng-if=Lightbox.isSharedVideo(Lightbox.image) lightbox-src={{Lightbox.imageUrl}} ng-href={{Lightbox.imageUrl}} iframe-id=lightbox-video class=embed-responsive-item>\n" +
    "                <a ng-href={{Lightbox.imageUrl}}>Watch video</a>\n" +
    "            </embed-video>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "  "
  );


  $templateCache.put('/scripts/shared/modal/modalView.html',
    "<div class=\"modal-header\">\n" +
    "    <h3>{{modalOptions.headerText}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <p>{{modalOptions.bodyText}}</p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" data-ng-click=\"modalOptions.close()\">\n" +
    "        {{modalOptions.closeButtonText}}\n" +
    "    </button>\n" +
    "    <button class=\"btn btn-{{modalOptions.actionButtonClass}}\" data-ng-click=\"modalOptions.ok();\">\n" +
    "        {{modalOptions.actionButtonText}}\n" +
    "    </button>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/shared/ng-table/filters/dateRangeFilter.html',
    "<input\n" +
    "    date-range-picker\n" +
    "    class=\"form-control date-picker filter\"\n" +
    "    type=\"text\"\n" +
    "    ng-model=\"params.filter()[name]\"\n" +
    "    clearable=\"true\"\n" +
    "    options=\"{locale: {format: 'D MMMM, YYYY'}}\"\n" +
    "    readonly />"
  );


  $templateCache.put('/scripts/shared/noAccess/noAccessView.html',
    "<div class=\"widget red-bg p-lg text-center no-access-institution col-lg-4\">\n" +
    "    <div class=\"m-b-md\">\n" +
    "        <i class=\"fa fa-warning fa-4x\"></i>\n" +
    "        <h1 class=\"m-xs\">No access to this section</h1>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/shared/progressCircle/progressCircleView.html',
    "<div class=\"c100 p{{percent}} {{colour}}\">\n" +
    "    <span class=\"text-label\">{{text}}</span>\n" +
    "    <div class=\"slice\">\n" +
    "        <div class=\"bar\"></div>\n" +
    "        <div class=\"fill\"></div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/scripts/shared/sidebar/sidebarView.html',
    "<nav class=\"navbar-default navbar-static-side\" role=\"navigation\" ng-controller=\"SidebarController as SidebarController\">\n" +
    "    <div class=\"sidebar-collapse\">\n" +
    "        <ul id=\"side-menu\" class=\"nav vnav media\" side-navigation=\"\">\n" +
    "            <li class=\"nav-header\">\n" +
    "                <div class=\"profile-element\">\n" +
    "                    <img src=\"/images/logo-white.svg\" alt=\"Logo\" />\n" +
    "                </div>\n" +
    "                <div class=\"logo-element\">\n" +
    "                    <img src=\"/images/logo-small.svg\" alt=\"Logo\" />\n" +
    "                </div>\n" +
    "            </li>\n" +
    "            <li ui-sref-active=\"{'active':'clients'}\" >\n" +
    "                <a>\n" +
    "                    <span class=\"icon\"><i class=\"fa fa-user\"></i></span>\n" +
    "                    <span class=\"text\">Institutions</span>\n" +
    "                    <span class=\"fa arrow\"></span>\n" +
    "                </a>\n" +
    "                <ul class=\"nav nav-second-level collapse\">\n" +
    "                    <li ui-sref-active=\"{'active':'clients.profiles'}\">\n" +
    "                        <a ui-sref=\"clients.profiles\">\n" +
    "                            <span class=\"icon\"><i class=\"fa fa-book\"></i></span>\n" +
    "                            <span class=\"text\">Profiles</span>\n" +
    "                            <span class=\"fa arrow\"></span>\n" +
    "                        </a>\n" +
    "                        <ul class=\"nav nav-third-level\">\n" +
    "                            <li ui-sref-active=\"{'active':'clients.profiles.shared'}\">\n" +
    "                                <a ui-sref=\"clients.profiles.shared\" ng-show=\"MainController.userHasAccessTo(MainController.handles['clients.profiles.shared'])\">\n" +
    "                                    <span class=\"icon\"><i class=\"fa fa-info\"></i></span>\n" +
    "                                    <span class=\"text\">Institution Details</span>\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li ui-sref-active=\"{'active':'clients.profiles.tu'}\" ng-show=\"isTuEnabled\">\n" +
    "                                <a ui-sref=\"clients.profiles.tu\" ng-show=\"MainController.userHasAccessTo(MainController.handles['clients.profiles.tu'])\">\n" +
    "                                    <span class=\"icon\"><i class=\"fa fa-graduation-cap\"></i></span>\n" +
    "                                    <span class=\"text\">Undergraduate / Postgraduate</span>\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li ui-sref-active=\"{'active':'clients.profiles.tm'}\" ng-show=\"isTmEnabled\">\n" +
    "                                <a ui-sref=\"clients.profiles.tm\" ng-show=\"MainController.userHasAccessTo(MainController.handles['clients.profiles.tm'])\">\n" +
    "                                    <span class=\"icon\"><i class=\"fa fa-suitcase\"></i></span>\n" +
    "                                    <span class=\"text\">MBA</span>\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                    <li ui-sref-active=\"{'active':'clients.statistics'}\" ng-show=\"MainController.userHasAccessTo(MainController.handles['clients.statistics'])\">\n" +
    "                        <a href=\"{{SidebarController.coreUrl}}/{{SidebarController.getCoreFlag()}}statistics\">\n" +
    "                            <span class=\"icon\"><i class=\"fa fa-bar-chart\"></i></span>&nbsp;\n" +
    "                            <span class=\"text\">Statistics</span>&nbsp;\n" +
    "                            <i class=\"fa fa-external-link\"></i>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li ng-if=\"!isClient\" class=\"custom-popover\" ui-sref-active=\"{'active':'clients.contacts'}\">\n" +
    "                        <a ui-sref=\"clients.contacts\">\n" +
    "                            <span class=\"icon\"><i class=\"fa fa-users\"></i></span>\n" +
    "                            <span class=\"text\">Contacts</span>\n" +
    "                            <i class=\"fa fa-lock\" aria-hidden=\"true\"></i>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </li>\n" +
    "            <li ng-show=\"!isClient\" ui-sref-active=\"{'active':'staff'}\">\n" +
    "                <a>\n" +
    "                    <span class=\"icon\"><i class=\"fa fa-star\"></i></span>\n" +
    "                    <span class=\"text\">QS Staff</span>\n" +
    "                    <span class=\"fa arrow\"></span>\n" +
    "                </a>\n" +
    "                <ul class=\"nav nav-second-level collapse\">\n" +
    "                    <li ui-sref-active=\"{'active':'staff.dashboard'}\">\n" +
    "                        <a ui-sref=\"staff.dashboard\">\n" +
    "                            <span class=\"icon\"><i class=\"fa fa-th-large\"></i></span>\n" +
    "                            <span class=\"text\">Dashboard</span>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li ui-sref-active=\"{'active':'staff.users'}\">\n" +
    "                        <a ui-sref=\"staff.users\">\n" +
    "                            <span class=\"icon\"><i class=\"fa fa-users\"></i></span>\n" +
    "                            <span class=\"text\">Users &amp; Permissions</span>\n" +
    "                            <span class=\"fa arrow\"></span>\n" +
    "                        </a>\n" +
    "                        <ul class=\"nav nav-third-level\">\n" +
    "                            <li ui-sref-active=\"{'active':'staff.users.qs'}\">\n" +
    "                                <a ui-sref=\"staff.users.qs\" ng-show=\"MainController.userHasAccessTo(MainController.handles['staff.users.qs'])\">\n" +
    "                                    <span class=\"icon\"><i class=\"fa fa-user-secret\"></i></span>\n" +
    "                                    <span class=\"text\">QS Users</span>\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li ui-sref-active=\"{'active':'staff.users.institutions'}\">\n" +
    "                                <a ui-sref=\"staff.users.institutions\" ng-show=\"MainController.userHasAccessTo(MainController.handles['staff.users.institutions'])\">\n" +
    "                                    <span class=\"icon\"><i class=\"fa fa-graduation-cap\"></i></span>\n" +
    "                                    <span class=\"text\">Institutions Users</span>\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                    <li ui-sref-active=\"{'active':'staff.institutions'}\">\n" +
    "                        <a ui-sref=\"staff.institutions\">\n" +
    "                            <span class=\"icon\"><i class=\"fa fa-bank\"></i></span>\n" +
    "                            <span class=\"text\">Institutions</span>\n" +
    "                            <span class=\"fa arrow\"></span>\n" +
    "                        </a>\n" +
    "                        <ul class=\"nav nav-third-level\">\n" +
    "                            <li ui-sref-active=\"{'active':'staff.institutions.list'}\">\n" +
    "                                <a ui-sref=\"staff.institutions.list\" ng-show=\"MainController.userHasAccessTo(MainController.handles['staff.institutions.list'])\">\n" +
    "                                    <span class=\"icon\"><i class=\"fa fa-bars\"></i></span>\n" +
    "                                    <span class=\"text\">List</span>\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li ui-sref-active=\"{'active':'staff.institutions.department'}\" ng-if=\"SidebarController.hasDepartmentsOverviewAccess()\">\n" +
    "                                <a ui-sref=\"staff.institutions.department\">\n" +
    "                                    <span class=\"icon\"><i class=\"fa fa-tasks\"></i>\n" +
    "                                    </span><span class=\"text\">Department Overview</span>\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li ui-sref-active=\"{'active':'staff.institutions.tu-programs'}\" ng-if=\"SidebarController.hasTuProgramsOverviewAccess()\">\n" +
    "                                <a ui-sref=\"staff.institutions.tu-programs\">\n" +
    "                                    <span class=\"icon\"><i class=\"fa fa-server\"></i>\n" +
    "                                    </span><span class=\"text\">TU Programs Overview</span>\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                    <li ui-sref-active=\"{'active':'staff.tm-directory'}\"\n" +
    "                        ng-show=\"MainController.userHasAccessTo(MainController.handles['staff.tm-directory'])\">\n" +
    "                        <a ui-sref=\"staff.tm-directory\">\n" +
    "                            <span class=\"icon\"><i class=\"fa fa-tumblr\"></i></span>\n" +
    "                            <span class=\"text\">TM Directory</span>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li ui-sref-active=\"{'active':'staff.master-password'}\"\n" +
    "                        ng-show=\"MainController.userHasAccessTo(MainController.handles['staff.master-password'])\">\n" +
    "                        <a ui-sref=\"staff.master-password\">\n" +
    "                            <span class=\"icon\"><i class=\"fa fa-key\"></i></span>\n" +
    "                            <span class=\"text\">Master Password</span>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a href=\"{{SidebarController.coreUrl}}/{{SidebarController.getCoreFlag()}}admin/dashboard\">\n" +
    "                            <span class=\"icon\"><i class=\"fa fa-external-link\"></i></span>\n" +
    "                            <span class=\"text\">Return to Core</span>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</nav>\n"
  );


  $templateCache.put('/scripts/shared/topNavigationBar/topNavigationBarView.html',
    "<nav class=\"navbar navbar-static-top\" role=\"navigation\">\n" +
    "\n" +
    "    <!-- START NAVBAR HEADFER -->\n" +
    "    <div class=\"navbar-header\">\n" +
    "        <span minimaliza-sidebar=\"\"></span>\n" +
    "    </div><!-- END NAVBAR HEADFER -->\n" +
    "\n" +
    "    <!-- START USER ACCOUNT/PROFILE -->\n" +
    "    <div class=\"user-profile\" uib-dropdown>\n" +
    "        <a class=\"truncate\" href=\"#\" uib-dropdown-toggle>\n" +
    "            <span class=\"user-dp\">\n" +
    "                <img class=\"img-circle\" ng-hide=\"MainController.profileLogo()\" alt=\"image\" gravatar-src=\"email\" gravatar-size=\"30\">\n" +
    "                <img class=\"img-circle\" ng-show=\"MainController.profileLogo()\" ng-src=\"{{MainController.profileLogo()}}\" alt=\"image\" style=\"width: 30px; height: 30px;\">\n" +
    "            </span>\n" +
    "            <span class=\"option\" ng-bind=\"MainController.fullName\"></span>\n" +
    "            <i class=\"fa fa-angle-down\"></i>\n" +
    "        </a>\n" +
    "        <ul class=\"dropdown-menu\">\n" +
    "            <li>\n" +
    "                <a ui-sref=\"user.my-profile\">\n" +
    "                    <i class=\"fa fa-user\"></i>\n" +
    "                    <span>My Profile</span>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <a ui-sref=\"logout\">\n" +
    "                  <i class=\"fa fa-sign-out\"></i>\n" +
    "                  <span>Log out</span>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div><!-- END USER ACCOUNT/PROFILE -->\n" +
    "\n" +
    "    <!-- START SEARCH HELP -->\n" +
    "    <div class=\"user-help\">\n" +
    "        <a href=\"javascript:void(0)\" ng-click=\"helpIcon('md')\" title=\"Help\">\n" +
    "          <span>Help</span>\n" +
    "          <i class=\"fa fa-question-circle-o\"></i>\n" +
    "        </a>\n" +
    "    </div><!-- END SEARCH HELP -->\n" +
    "\n" +
    "    <!-- START SEARCHBAR -->\n" +
    "    <div class=\"search-dropdown\">\n" +
    "        <!-- Institution switch for QS users -->\n" +
    "        <ui-select\n" +
    "          theme=\"bootstrap\"\n" +
    "          ng-if=\"!isClient\"\n" +
    "          ng-model=\"institution.selected\"\n" +
    "          ng-change=\"handleSearchInstitutionClick(institution.selected)\">\n" +
    "\n" +
    "            <ui-select-match placeholder=\"Institution search...\">\n" +
    "                <i class=\"fa fa-building\" aria-hidden=\"true\"></i>\n" +
    "                {{$select.selected.name}}\n" +
    "            </ui-select-match>\n" +
    "\n" +
    "            <ui-select-choices\n" +
    "              refresh-delay=\"500\"\n" +
    "              refresh=\"searchInstitutions($select.search)\"\n" +
    "              position=\"down\"\n" +
    "              repeat=\"option in institutionsDropdownList | filter: $select.search\">\n" +
    "              <span class=\"option\" ng-bind-html=\"option.name | highlight: $select.search\"></span>\n" +
    "            </ui-select-choices>\n" +
    "\n" +
    "        </ui-select>\n" +
    "\n" +
    "        <!-- Institution switch for Clients -->\n" +
    "        <ui-select\n" +
    "          theme=\"bootstrap\"\n" +
    "          ng-if=\"isClient\"\n" +
    "          ng-model=\"institution.selected\"\n" +
    "          on-select=\"handleSearchInstitutionClick(institution.selected)\">\n" +
    "\n" +
    "            <ui-select-match placeholder=\"Institution search...\">\n" +
    "                <i class=\"fa fa-building\" aria-hidden=\"true\"></i>\n" +
    "                {{$select.selected.name}}\n" +
    "            </ui-select-match>\n" +
    "\n" +
    "            <ui-select-choices class=\"search-dropdown-results\"\n" +
    "              repeat=\"option in institutionsDropdownList | filter: $select.search\"\n" +
    "              position=\"down\">\n" +
    "              <span class=\"option\" ng-bind-html=\"option.name | highlight: $select.search\"></span>\n" +
    "            </ui-select-choices>\n" +
    "\n" +
    "        </ui-select>\n" +
    "        <div class=\"spinner\" ng-show=\"searchInProgress\" wave-spinner=\"\"></div>\n" +
    "    </div><!-- END SEARCHBAR -->\n" +
    "\n" +
    "    <!-- START GO BACK BUTTON -->\n" +
    "    \n" +
    "    <div class=\"go-back\" ng-if=\"MainController.allowParent()\">\n" +
    "      <button type=\"button\" class=\"btn btn-warning\" ng-click=\"handleGoToParentInstitution()\">\n" +
    "          <i class=\"glyphicon glyphicon-upload\"></i>\n" +
    "          <span>Go to Parent Institution</span>\n" +
    "      </button>\n" +
    "    </div><!-- END GO BACK BUTTON -->\n" +
    "</nav>"
  );


  $templateCache.put('/scripts/shared/ui-grid/templates/dateCellTemplate.html',
    "<div class=\"ui-grid-cell-contents\">{{COL_FIELD CUSTOM_FILTERS | date:\"medium\"}}</div>\n"
  );


  $templateCache.put('/scripts/shared/ui-grid/templates/selectCellTemplate.html',
    "<div class=\"ui-grid-cell-contents\">{{COL_FIELD CUSTOM_FILTERS | boolToText:col.filter.selectOptions}}</div>\n"
  );


  $templateCache.put('/scripts/shared/ui-grid/templates/selectFilterHeaderTemplate.html',
    "<div class=\"ui-grid-filter-container\"\n" +
    "     ng-repeat=\"colFilter in col.filters\"\n" +
    "     ng-class=\"{'ui-grid-filter-cancel-button-hidden' : colFilter.disableCancelFilterButton === true }\">\n" +
    "\n" +
    "    <ui-select class=\"ui-grid-filter-select ui-grid-filter-input-{{$index}} select-{{col.field}}\"\n" +
    "        ng-model=\"colFilter.term\"\n" +
    "        theme=\"bootstrap\"\n" +
    "        search-enabled=\"{{colFilter.searchEnabled || false}}\"\n" +
    "        append-to-body=\"true\">\n" +
    "        <ui-select-match placeholder=\"{{colFilter.placeholder}}\">\n" +
    "            {{$select | uiGridSelectedLabel}}\n" +
    "        </ui-select-match>\n" +
    "        <ui-select-choices repeat=\"item in (colFilter.selectOptions | filter: $select.search) track by item.value\">\n" +
    "            <div ng-bind=\"item.label\"></div>\n" +
    "        </ui-select-choices>\n" +
    "    </ui-select>\n" +
    "\n" +
    "    <div role=\"button\" class=\"ui-grid-filter-button-select\"\n" +
    "         ng-click=\"removeFilter(colFilter, $index)\"\n" +
    "         ng-if=\"!colFilter.disableCancelFilterButton\"\n" +
    "         ng-disabled=\"colFilter.term === undefined || colFilter.term === null || colFilter.term === ''\"\n" +
    "         ng-show=\"colFilter.term !== undefined && colFilter.term != null\">\n" +
    "        <i class=\"ui-grid-icon-cancel\" ui-grid-one-bind-aria-label=\"aria.removeFilter\">&nbsp;</i>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/scripts/shared/ui-grid/uiGridInfo/uiGridInfoPopupView.html',
    "<h5>\n" +
    "    Special search characters\n" +
    "</h5>\n" +
    "<table class=\"table table-striped no-margins\">\n" +
    "    <thead>\n" +
    "        <tr>\n" +
    "            <th>Character</th>\n" +
    "            <th>Explanation</th>\n" +
    "            <th>Example</th>\n" +
    "        </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "        <tr>\n" +
    "            <td>=</td>\n" +
    "            <td>search for exact result</td>\n" +
    "            <td>=John Smith</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>%</td>\n" +
    "            <td>search using word pattern matching</td>\n" +
    "            <td>Test Univ%sity</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>,</td>\n" +
    "            <td>search for one or more</td>\n" +
    "            <td>John,Tom,Olga</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>&amp;</td>\n" +
    "            <td>search for combination of</td>\n" +
    "            <td>London&University</td>\n" +
    "        </tr>\n" +
    "    </tbody>\n" +
    "</table>\n"
  );


  $templateCache.put('/scripts/shared/ui-grid/uiGridInfo/uiGridInfoView.html',
    "<span class=\"info pull-right clickable\"\n" +
    "      popover-placement=\"left-top\"\n" +
    "      popover-append-to-body=\"true\"\n" +
    "      popover-class=\"ui-grid-info\"\n" +
    "      uib-popover-template=\"'/scripts/shared/ui-grid/uiGridInfo/uiGridInfoPopupView.html'\">\n" +
    "    <i class=\"fa fa-info-circle\"></i>\n" +
    "</span>"
  );

}]);
}(window.angular));