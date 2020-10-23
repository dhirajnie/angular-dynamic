import {Menu} from "./menu-schema";

export class MenuItem {
  menuName: string;
  mapName: string;
  context: string;
  menuOrder: string;
  subMenuList: MenuItem[];
  
}
