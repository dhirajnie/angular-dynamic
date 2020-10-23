export class Entitlement {
  parameterValue: string;
  parameterName: string;
  displayName: string;
  id: string;
  name?: string;
  driverName?: string;
  resourceName: string;
  resourceDescription: string;
  description?: string; // Used in case of dynamic resource (map entitlements)
  action: any;
  correlationId: string;
  type: string;
  entitlementName: string;
  value: string;
  resourceCN?: string;
}
export class EntitlementValue {

  id: string;
  name?: string;
  driverName?: string;
  driverID?: string;
  type: string;
  value?: string;
  description?: string;
  param?: string;
  entitlementName? : string;
  resourceName? : string;
  resourceDescription? : string;
  paramType?: string;
  entitlementType?: string;
}

export class EntitlementViewValueRequest {
  viewID: string;
  type: string;
}
