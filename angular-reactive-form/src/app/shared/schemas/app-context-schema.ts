import {PathConstats} from "../constants/path-constants";

export class Context {
  context: string;
  authorize: string = "";
  logout: string = "";
  rraClientId: string = "";
  rraRedirectUrl: string = "";
  provisionRoot: string = "";
  ssprRedirectUrl: string = "";
  sessionTimeOut: string = "";
  extendSession: string = "";
  applicationDomain: string = "";
}
