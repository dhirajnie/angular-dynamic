import { Injectable } from '@angular/core';
import {LocationStrategy} from '@angular/common';

import {AppContextService} from "../context/app-context.service";
import {WindowRefService} from "../utilities/util_winRef/window-ref.service";
import {CookiesService} from "../utilities/util_cookies/cookies.service";
import { VariableService } from '../utilities/util_variable/variable.service';


@Injectable()
export class LogoutService {

  constructor(private location:LocationStrategy, private appContext: AppContextService, private winRef: WindowRefService, private cookieService: CookiesService, 
    private variableService: VariableService) {}

  logout() {
    let url = this.appContext.getAppContext().logout + "?target=" + (<any>this.location)._platformLocation.location.href;
    let cookieSecure = false;
    let protocol = this.winRef.nativeWindow.location.protocol;      
    if (protocol == 'https' || protocol == 'https:') {
      cookieSecure = true;
    }

    const applicationDomain = this.winRef.nativeWindow.localStorage.getItem('app-domain');
    //For RPT 6.5
    this.cookieService.deleteCookie('Spiffy_Session', cookieSecure, '/');
    this.winRef.nativeWindow.localStorage.removeItem('last-access');
    //clear all other cookies which are under MFSSO_
    this.cookieService.clearAllCookies(applicationDomain,cookieSecure);
    this.cookieService.deleteCookie('netiq_idm_rbpm_acsrf');
    this.winRef.nativeWindow.location.href = url;
  }
}
