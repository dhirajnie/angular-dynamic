import { AttributeModifiedValue } from "./attribute-modified-value-schema";
import { Entitlement, EntitlementValue } from "./entitlement-schema";
import {isBoolean} from "util";

export class Category {
    id: string;
    name: string;
    type: string;  dataType: string;

}

export enum ApprovalType {
    "NONE" = 0,
    "CUSTOM" = 1,
    "SERIAL" = 2,
    "QUORUM" = 3,
    "Same as Grant Approval" = 4,
    "Retain Existing Approval Process" = 5
}
export class LocalizedDisplayValue {
    locale: string;
    name: string;
}

export class Resource {
    id: string;
    name: string;
    description: string;
    categories: Category[];
    owners: any;
    isExpirationRequired: boolean = false;
    expiresAfter: string = "";
    subContainer: string;
    status: number;
    localizedNames: any[];
    localizedDescriptions: any[];
    resourceWeightage : string;
    // grant approval
    approvalRequired: boolean;
    approvalIsStandard: boolean;
    approvers: any;
    approvalQuorum: number;
    approvalRequestDef: string;
    approvalRequestDefName: string;
    approvalRequestDefs: any[];
    approvalType: ApprovalType;
    approvalOverRide: boolean;
    requestDef: string;
    provisioningRequestDef : string;
    quorum: number;
    // revoke approval
    revokeRequired: boolean;
    revokeApprovalIsStandard: boolean;
    revokeApprovers: any;
    revokeQuorum: number;
    revokeRequestDef: string;
    revokeRequestDefName: string;
    revokeRequestDefs: any[];
    revokeApprovalType: ApprovalType;
    revokeEqualsGrant: boolean;
    otherAttributes: any;
    otherModifiedAttributes: AttributeModifiedValue[];
    entityKey?: string;
    isExisted: boolean = true;
    mappingDescription?: string;
    entitlements?: Entitlement[];
    entitlementValues?: EntitlementValue[]
    cprs: any;
    managedBy: number;
    driver?: any;
    driverName?: any;
    resourceParameters?: ResourceParameter[];
    allowMultiple?: boolean;
    // for drag drop restriction
    addClass? : string;
    isentVal?:boolean;
    hasAssignments?: boolean;
}

export class ResourceParameter {
    id: string = "EntitlementParamKey";
    entitlementDn: string;
    displayValue: string;
    codeMapKey: string;
    multiValue: boolean;
    scope: string = "user";
    type: string = "EntitlementRef";
    staticValue: string = ""
    binding: string = "dynamic";
    instance: boolean = true;
    hide: boolean = false;
    key: string;
    isMultivalued: boolean;
    localizedDisplayValues: any;
    dataType: string;
    displayLabel: string;
    attributeValues: any;
    isEditable: boolean;
    value: string;
    parentType: string = "resource";
    isentVal?:boolean;
}
