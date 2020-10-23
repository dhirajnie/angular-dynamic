import { Entitlement } from "./entitlement-schema";
import { Resource } from "./resource-schema";

export class EntitlementResourceList {
  entName: string;
  resources : Resource[] = [];
}
