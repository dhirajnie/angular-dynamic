export class OrgChartEntityInfoNode {
    entityKey: string;
    entityDefinitionKey: string;
    primaryAttributes: AttributeValue[];
    primaryAttrsDisplayValue: string;
    secondaryAttributes: AttributeValue[];
    secondaryAttrsDisplayValue: string;
    targets: OrganizationChartNode[];
    photoAttribute: string;
    emailAttribute: string;
    showMoreInfoIcon: boolean; //used only for root 
    showLevelupIcon: boolean;
    setDnAsDisplayAttr: boolean;
    level: number;
    directReportsCount: number;
    showDirectReportsCount: boolean;
}

export class OrganizationChartNode {
    relationshipKey: string;
    relationshipDisplayName: string;
    orgChartEntityNodes: OrgChartEntityInfoNode[];
    isRecursiveRelationship: boolean;
    showRelationship: boolean;
    showMoreInfoIcon: boolean;
    hasRelationships: boolean;
    nextIndex: number;
    total: number;
    hasMore: boolean;
}

export class AttributeValue {
    key: string;
    value: string;
}


