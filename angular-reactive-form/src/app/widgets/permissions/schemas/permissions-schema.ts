export class PermissionRequestSchema{
  dn: string;
  permission: string;
  objType: string;
  objClass: string;
  domainType: string;
  constructor() {

  }
}
export class PermissionResponseSchema{
  permissionKey: any;
  permissionLabel: any;
  objectType: any;
  objectClass: string;
  objectTypeLabel : any;
}
export class PermissionIdSchema{
  permissionKey: any;
  id: any;
}
