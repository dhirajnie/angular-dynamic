export class RoleLevel {
    name: string;
    level: number;
    localizedNames: any[];
    cn: string;
}

export class RoleResourceSettings {
  public roleContainer: string;
  public roleRequestContainer: string;
  public defaultRoleRequestDef: string;
  public roleAssignmentGracePeriod: number;
  public roleLevels: RoleLevel[];
  public roleLevel30: RoleLevel;
  public roleLevel20: RoleLevel;
  public roleLevel10: RoleLevel;
  public resourceContainer: string;
  public resourceRequestContainer: string;
  public defaultResourceGrantRequestDef: string
  public defaultResourceRevokeRequestDef: string;
  public queryTimeout: number;
  public queryRefreshRate: number;
  public concatDisplayElements: boolean;
  public sodContainer: string;
  public defaultSODRequestDef: string;
  public defaultSODRequestDefName: string;
  public sodQuorum: number;
  public sodApprovers: any;
  public reportContainer: string;
}
