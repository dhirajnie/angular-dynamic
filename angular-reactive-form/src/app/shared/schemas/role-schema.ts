import { AttributeModifiedValue } from "./attribute-modified-value-schema";

export class Category {
    id: string;
    name: string;
    type: string;
}

export class RoleLevel {
    name: string;
    level: number;
    cn: string;
}

export enum ApprovalType {
    "NONE" = 0,
    "CUSTOM" = 1,
    "SERIAL" = 2,
    "QUORUM" = 3,
    "Same as Grant Approval" = 4,
    "Retain Existing Approval Process" = 5
}

export enum Status {
    "Created" = 50,
    "Pending Delete" = 15
}


export class Role {
    id: string;
    name: string;
    description: string;
    categories: Category[];
    owners: any;
    level: number;
    roleLevel: RoleLevel;
    subContainer: string;
    status: number;
    localizedNames: any[];
    localizedDescriptions: any[];
    approvalRequired: boolean;
    approvalIsStandard: boolean;
    approvalApprovers: any;
    approvalQuorum: number;
    approvalRequestDef: string;
    approvalRequestDefName: string;
    revokeRequired: boolean;
    approvalRequestDefs: any[];
    approvalType: ApprovalType;
    otherAttributes: any;
    otherModifiedAttributes : AttributeModifiedValue[];
}
