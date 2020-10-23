export class EntityAttributeSchema {
    $: any;
    "@type": any;
}
export class EntityCreateAttributeSchema {
    key: string;
    dataType: string;
    attributeValues: EntityAttributeSchema[];
}

export class EntityCreationSchema {
    key: string;
    dn?:String;
    attributes: EntityCreateAttributeSchema[];
}