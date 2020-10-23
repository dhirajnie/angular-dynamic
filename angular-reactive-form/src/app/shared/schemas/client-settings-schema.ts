import {ClientSettingsObject} from "./client-settings-object";

interface dyamicType {
    [key: string]: ClientSettingsObject;
}

export class ClientSettings {
  branding:ClientSettingsObject[];
  access : ClientSettingsObject[];
  customization :ClientSettingsObject[];
}
export class ClientSettingsV2 {
  branding:dyamicType;
  access :dyamicType;
  customization :dyamicType;
  helpdesk:dyamicType;
  dashboardAccess:dyamicType;
}
export class ClientSettingsV3 {
  branding:any[];
  access :any[];
  customization :any[];
  helpdesk:any[];
  dashboardAccess:any[];
}
