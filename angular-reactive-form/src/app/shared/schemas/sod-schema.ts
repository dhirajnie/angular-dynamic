import { AttributeModifiedValue } from "./attribute-modified-value-schema";
export class SoDApproval {
    id: string;
    approvers: any[];
    approvalRequestDef: string;
    approvalQuorum: string;
}

export class SoDs {
    arraySize: number;
    nextIndex: number;
    hasMore: boolean;
    sods: SoD[] = [];
}

export class SoD {
    id: string;
    name: string;
    description: string;
    localizedNames: any[];
    localizedDescriptions: any[];
    approvalRequired: boolean;
    isDefaultApproversUsed: boolean;
    approvalApprovers: any;
    approvalQuorum: string;
    sodApprovalType: string;
    approvalRequestDefName: string;
    revokeRequired: boolean;
    approvers: any[];
    roles: any[];
    roleLevel: string;
}
