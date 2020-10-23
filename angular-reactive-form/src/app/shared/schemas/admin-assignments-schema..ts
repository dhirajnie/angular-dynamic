export class AdminAssignmentsSchema {
    comment: string;
    domain: string;
    assignmentType: string;
    effectiveDate: string;
    expirationDate: string;
    allPermissions: boolean;
    assignee: any[];
    adminType: string;
}
