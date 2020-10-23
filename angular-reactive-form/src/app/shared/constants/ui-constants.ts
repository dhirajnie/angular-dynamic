export class UIConstants {

  static get rolesPageSizeAttribute(): any {
    return this._rolesPageSizeAttribute;
  }

  static get resourcesPageSizeAttribute(): any {
    return this._resourcesPageSizeAttribute;
  }

  static get resourceAssignmentList(): any {
    return this._resourceAssignmentList;
  }

  static get rolesAssignmentList(): any {
    return this._rolesAssignmentList;
  }

  static get driverType(): any {
    return this._driverType;
  }

  static get entitlementType(): any {
    return this._entitlementType;
  }

  static get entitlementValueType(): any {
    return this._entitlementValueType;
  }

  static get resourcesAssignmentListPageSize(): any {
    return this._resourcesAssignmentListPageSize;
  }

  static get classNameToAdd(): any {
    return this._classNameToBeAdded;
  }

  static get allowedDataTypes(): any {
    return this._allowedDataTypes;
  }

  static get paramKeyPrefix(): any {
    return this._paramKeyPrefix;
  }

  static get sodsList(): string {
    return this._sodsList;
  }

  static get alwaysAllow(): any {
    return this._alwaysAllow;
  }

  static get allowWithWorkflow(): any {
    return this._allowWithWorkflow;
  }


  static get roleRequestList(): any {
    return this._roleRequestList;
  }

  static get resourceRequestListArributesList(): any {
    return this._resourceRequestListArributesList;
  }

  static get resourceRequestList(): any {
    return this._resourceRequestList;
  }

  static get cprsAssignmentList(): any {
    return this._cprsAssignmentList;
  }

  static get entitlementParamKey(): any {
    return this._entitlementParamKey;
  }

  static get cprsSettingsList(): any {
    return this._cprsSettingsList;
  }

  static get cprsProcessStatusList(): any {
    return this._cprsProcessStatusList;
  }

  private static _dbounceTime: any = 1000;
  private static _rrDbounceTime: any = 2000;


  static get dbounceTime(): any {
    return this._dbounceTime;
  }

  static get rrDbounceTime(): any {
    return this._rrDbounceTime;
  }

  static get adminAssignmentsPageSizeAttribute(): any {
    return this._adminAssignmentsPageSizeAttribute;
  }

  static get groupsPageSizeAttribute(): any {
    return this._groupsPageSizeAttribute;
  }
  static get EntityPageSizeAttribute(): any {
    return this._dynamicEntityPageSize;
  }

  static get groupMembersPageSizeAttribute(): any {
    return this._groupMembersPageSizeAttribute;
  }

  static get adminPermissionsOfAssignmentPageSizeAttribute(): any {
    return this._adminPermissionsOfAssignmentPageSizeAttribute;
  }

  static get prdDomain(): string {
    return this._prdDomain;
  }

  static get roleDomain(): string {
    return this._roleDomain;
  }

  static get resourceDomain(): string {
    return this._resourceDomain;
  }

  static get defaultPage(): string {
    return this._defaultPage;
  }

  static get rolePage(): string {
    return this._rolePage;
  }
  static get entityPage(): string {
    return this._entityPage;
  }
  static get delegationPage(): string {
    return this._delegationPage;
  }

  static get createdelegationPage(): string {
    return this._createdelegationPage;
  }

  static get mapResourcesPage(): string {
    return this._mapResourcesPage;
  }

  static get resourcePage(): string {
    return this._resourcePage;
  }

  static get sodPage(): string {
    return this._sodPage;
  }
  static get createRolePage(): string {
    return this._createRolePage;
  }

  static get createResourcePage(): string {
    return this._createResourcePage;
  }

  static get createSodPage(): string {
    return this._createSodPage;
  }
  static get defaultImageSize(): number {
    return this._defaultImageSize;
  }

  static get self(): string {
    return this._self;
  }

  static get others(): string {
    return this._others;
  }

  static get selective(): string {
    return this._selective;
  }

  static get approvalSteps(): any {
    return this._approvalSteps;
  }

  static get approvalTypes(): any {
    return this._approvalTypes;
  }

  static get userDefKey(): string {
    return this._user_def_key;
  }

  static get userPageKey(): string {
    return this._user_page_key;
  }

  static get entitiesPageKey(): string {
    return this._entities_page_key;
  }

  static get orgchartPageKey(): string {
    return this._orgchart_page_key;
  }

  static get entityOrgchartKey(): string {
    return this._entities_orgchart_key;
  }

  private static _rolesPageSizeAttribute: String = 'rolesPageSize';
  private static _resourceAssignmentList: String = 'resourceAssignmentList';
  private static _rolesAssignmentList: String = 'rolesAssignmentList';
  private static _resourcesPageSizeAttribute: String = 'resourcesPageSize';
  private static _resourcesAssignmentListPageSize: String = 'resourceAssignmentList';
  private static _driverType: String = 'driver';
  private static _entitlementType: String = 'entitlement';
  private static _entitlementValueType: String = 'entitlementValues';
  private static _classNameToBeAdded: string = 'res_dyn_or_with_form';
  private static _allowedDataTypes: any = ["Integer", "Boolean", "List", "String"];
  private static _paramKeyPrefix: string = 'param';
  private static _sodsList = "sodsList";
  private static _alwaysAllow = "alwaysAllow";
  private static _allowWithWorkflow = "allowWithWorkflow";
  private static _roleRequestList: String = 'roleRequestList';
  private static _resourceRequestList: String = 'resourceRequestList';
  private static _cprsAssignmentList: String = 'cprsAssignmentList';
  private static _cprsSettingsList: String = 'cprsSettingsList';
  private static _cprsProcessStatusList: String = 'cprsProcessStatusList';
  private static _entitlementParamKey: String = '%EntitlementParamKey%';
  private static _adminAssignmentsPageSizeAttribute: String = 'adminAssignmentsPageSize';
  private static _groupsPageSizeAttribute: string = 'groupsPageSizeAttribute';
  private static _dynamicEntityPageSize: string = '-entityPageSize';
  private static _groupMembersPageSizeAttribute: string = 'groupMembersPageSizeAttribute';
  private static _adminPermissionsOfAssignmentPageSizeAttribute: string = 'adminPermissionsofAssignmentPageSize';
  private static _roleDomain: string = "ROLES";
  private static _resourceDomain: string = "RESOURCES";
  private static _prdDomain: string = "PROVISIONING";
  private static _defaultPage: string = "dashboard";
  private static _rolePage: string = "role";
  private static _entityPage: string = "entities";
  private static _resourcePage: string = "resource";
  private static _sodPage: string = "sod";
  private static _createRolePage: string = "create Role";
  private static _createResourcePage: string = "create Resource";
  private static _createSodPage: string = "create Sod";
  private static _delegationPage: string = "delegation";
  private static _createdelegationPage: string = "createDelegation";
  private static _mapResourcesPage: string = "mapresources";
  private static _defaultImageSize: number = 59;
  private static _self: string = "self";
  private static _others: string = "others";
  private static _selective: string = "SELECTIVE";
  private static _user_def_key = 'user';
  private static _user_page_key = 'users';
  private static _entities_page_key = 'entities';
  private static _orgchart_page_key = 'orgChart';
  private static _entities_orgchart_key = 'entityOrgChart';
  // private static _editPage: string = "edit";

  private static _approvalSteps = [
    { 'name': 'No Approval', 'steps': 0, 'type': "NoApproval" },
    { 'name': 'Single', 'steps': 1, 'type': "SingleStepApproval" },
    { 'name': 'Single With Quorum', 'steps': 1, "type": "QuorumApproval" },
    { 'name': 'Two', 'steps': 2 },
    { 'name': 'Three', 'steps': 3 },
    { 'name': 'Four', 'steps': 4 }
  ];

  private static _approvalTypes = ['Serial', 'Parallel'];

  private static _resourceRequestListArributesList = {
    "attributesList": [
      {
        "key": "recipientName",
        "displayLabel": "Recipient",
        "isSortable": true,
        "isSearchable": true
      },
      {
        "key": "requesterName",
        "displayLabel": "Requester",
        "isSortable": true
      },
      {
        "key": "status",
        "displayLabel": "Status",
        "isSortable": false
      },
      {
        "key": "requestDate",
        "displayLabel": "Request Date",
        "isSearchable": true,
        "isSortable": true
      },
      {
        "key": "action",
        "displayLabel": "Request Action",
        "isSortable": true
      },
      {
        "key": "reason",
        "displayLabel": "Initial Request Description",
        "isSortable": true,
        "isSearchable": true
      }
    ]
  };
}
