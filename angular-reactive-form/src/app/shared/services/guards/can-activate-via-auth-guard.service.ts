import { Injectable } from '@angular/core';
import { CanActivate } from "@angular/router/router";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { NavigationRightsService } from "../navigation-rights/navigation-rights.service";
import { EmitterService } from "../emitter/emitter.service";
import { VariableService } from "../utilities/util_variable/variable.service";
import { NavigationMenuService } from "../navigation-menu/navigation-menu.service";
import { UIConstants } from "../../constants/ui-constants";
import { GlobalService } from "../global/global.service";

@Injectable()
export class AuthGuardService implements CanActivate {
  get defaultArea(): any {
    return this._defaultArea;
  }

  set defaultArea(value: any) {
    this.defaultArea = this.vutils.isUndefinedOrNull(value) ? UIConstants.defaultPage : value;
    this._defaultArea = value;
  }

  private _activateUnauthorizeMessage: boolean = false;
  private _authorizeAccess: any;
  private _defaultArea: any;

  get activateUnauthorizeMessage(): boolean {
    return this._activateUnauthorizeMessage;
  }

  set activateUnauthorizeMessage(value: boolean) {
    this._activateUnauthorizeMessage = value;
  }

  constructor(private navigationRightsService: NavigationRightsService,
    private EmitterService: EmitterService,
    private router: Router,
    private vutils: VariableService,
    private navigationMenuService: NavigationMenuService,
    private GlobalService: GlobalService) {
    this._authorizeAccess = this.EmitterService.get("authorizeAccess");

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, ): Promise<boolean> {

    let childRoute: any;
    let parentRoute = '';
    let currentRoute = '';
    let allchild
    if (route.url[0]) {
      currentRoute = route.url[0].path;
    }
    if (route.parent.url[0]) {
      if (route.parent.url[0].path == UIConstants.entityPage) {
        childRoute = route.url[route.url.length - 1].path;
        currentRoute = childRoute;
        parentRoute = route.parent.url[0].path;
      }
      else {
        childRoute = parentRoute;
        parentRoute = route.parent.url[0].path;
      }

    }
    let page = { "navPageRights": [] };
    let temp = [];
    if (route.parent.url.length > 0)
      route.parent.url.forEach((val) => {
        temp.push({ "key": val.path });
      });
    if (route.url.length > 0)
      route.url.forEach((val) => {
        if(val.path.toLowerCase() == UIConstants.orgchartPageKey.toLowerCase()){
          temp.push({ "key": UIConstants.orgchartPageKey }); 
        }else{
          temp.push({ "key": val.path });
        }
      });

    page.navPageRights = temp;

    return new Promise((resolve) => {

      this.navigationRightsService.checkAccess(page)
        .subscribe((data: any) => {
          this.GlobalService.currentRouteGranularRights = data.navPageRights;
          if (this.GlobalService.currentRouteGranularRights.get(parentRoute) != 'false') {
            if ((parentRoute == UIConstants.rolePage || parentRoute == UIConstants.resourcePage || parentRoute == UIConstants.sodPage) && (currentRoute == 'create' || currentRoute == 'detail' || currentRoute == 'mapresources')) {
              resolve(true);
            }
            else if ((parentRoute == UIConstants.delegationPage) && (currentRoute == UIConstants.createdelegationPage || currentRoute == 'edit')) {
              if (this.GlobalService.currentRouteGranularRights.get(UIConstants.createdelegationPage) == 'true')
                resolve(true);
            } else if(currentRoute.toLowerCase() == UIConstants.orgchartPageKey.toLowerCase() && this.GlobalService.currentRouteGranularRights.get(UIConstants.orgchartPageKey) == 'true'){
              resolve(true);
            } else if ((currentRoute === '') || this.GlobalService.currentRouteGranularRights.get(currentRoute) == 'true') {
              // this.redirectTo({"hitPage": currentRoute, "redirect": data.areaDefault});
              resolve(true);

            } else if ((currentRoute != '') || this.GlobalService.currentRouteGranularRights.get(currentRoute) == 'false') {
              this.redirectTo({ "hitPage": currentRoute, "redirect": data.areaDefault, 'displayName': data.areaDefaultDisplayName });
              resolve(false);
            }
            else {
              this.redirectTo({ "hitPage": currentRoute, "redirect": data.areaDefault, 'displayName': data.areaDefaultDisplayName });
              resolve(false);
            }
          }
          else {
            this.redirectTo({ "hitPage": currentRoute, "redirect": data.areaDefault, 'displayName': data.areaDefaultDisplayName });
            resolve(false);
          }

        }),
        err => {
          resolve(false);
        };
      // }

    })

  }

  redirectTo(state) {
    this._activateUnauthorizeMessage = false;
    this._authorizeAccess.emit(state);
  }

}
