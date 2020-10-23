
import {throwError as observableThrowError,  Observable ,  forkJoin } from 'rxjs';

import {catchError, mergeMap, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Context } from "../../schemas/app-context-schema";
import { ServerContext } from "../../schemas/server-context-schema";
import { LocalizationService } from "../localization/localization.service";
import { TranslateService } from "../translate/translate.service";
import { PathConstats } from "../../../shared/constants/path-constants";
import { GlobalService } from '../global/global.service';
import { WindowRefService } from '../utilities/util_winRef/window-ref.service';
import { DocumentRefService } from '../utilities/util_docRef/document-ref.service';

@Injectable({
  providedIn: 'root'
})
export class AppContextService {

  private appContext: Context;
  private rtlLangs: any[];
  private stylesPath: string;

  constructor(private http: HttpClient, private LocalizationService: LocalizationService, private TranslateService: TranslateService, private globalService: GlobalService, private windowRefService: WindowRefService, private documentRefService: DocumentRefService) {
    this.appContext = new Context();
    this.rtlLangs = ['ar','arc','dv','fa','ha','he','iw','khw','ks','ku','ps','ur','yi'];
    this.stylesPath = 'ltr-styles.css';
  }

  public getAppContext(): Context {
    return this.appContext;
  }


  public load() {
    return new Promise((resolve, reject) => {
      this.http.get('context/LoadContextConfigServlet').pipe(catchError((error: any): any => {
        reject(false);
        return observableThrowError(error.error || 'Server error');
      }),mergeMap((data) => {
        data = (<ServerContext>data);
        if ((<ServerContext>data)) {
          this.setData(data);
        }
        return this.getUserLocaleUncached_getAppDefaultLocale(data);
      }),).subscribe(res => {
        this.LocalizationService.userLocale = res.locale;
        let filepath = './assets/i18n/AdminStringsRsrc_' + this.LocalizationService.userLocale + '.json';
        this.setHTMLdir(this.LocalizationService.userLocale);
        forkJoin(this.getFilePath(filepath), this.getGlobalSettings()).subscribe(results => {
          this.LocalizationService.localjson = results[0];
          this.LocalizationService.load();
          this.globalService.setGlobalSettings(results[1]);
          resolve(true);
        });
      });
    });
  }

  private setHTMLdir(locale) {

    if(this.rtlLangs.indexOf(locale) != -1) {
      this.documentRefService.nativeDocument.dir = 'rtl';
      this.stylesPath = 'rtl-styles.css';
      const links = this.documentRefService.nativeDocument.getElementsByTagName("link");
      for (var link of links) {
        if(link.rel == 'stylesheet' && link.href.indexOf('main') != -1){
          link.setAttribute('href',this.stylesPath);
        }
      }
    }
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  getFilePath(filepath): Observable<any> {
    return this.http.get(filepath).pipe(map(this.extractData));
  }

  getGlobalSettings(): Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.provisioningUIdisplayGeneralApi).pipe(
      map(this.extractData));
  }


  getUserLocaleUncached_getAppDefaultLocale(appContext): Observable<any> {
    return this.http.get(appContext.context + '/rest/access/supportedlocales/defaultlocale', {}).pipe(mergeMap(res => {
      this.LocalizationService.defaultLocale = res['locale'];
      return this.http.get(appContext.context + '/rest/access/supportedlocales/userlocale', {});
    }))
  }

  setData(data) {
    data = (<ServerContext>data);
    if ((<ServerContext>data)) {
      if ((<ServerContext>data).context) this.appContext.context = (<ServerContext>data).context;
      if ((<ServerContext>data).Authorize) this.appContext.authorize = (<ServerContext>data).Authorize;
      if ((<ServerContext>data).Logout) this.appContext.logout = (<ServerContext>data).Logout;
      if ((<ServerContext>data).RRAClientID) this.appContext.rraClientId = (<ServerContext>data).RRAClientID;
      if ((<ServerContext>data).RRARedirectUrl) this.appContext.rraRedirectUrl = (<ServerContext>data).RRARedirectUrl;
      if ((<ServerContext>data).ProvisionRoot) this.appContext.provisionRoot = (<ServerContext>data).ProvisionRoot;
      if ((<ServerContext>data).SSPRRedirectUrl) this.appContext.ssprRedirectUrl = (<ServerContext>data).SSPRRedirectUrl;
      if ((<ServerContext>data).sessionTimeOut) this.appContext.sessionTimeOut = (<ServerContext>data).sessionTimeOut;
      if ((<ServerContext>data).extendSession) this.appContext.extendSession = (<ServerContext>data).extendSession;
      if ((<ServerContext>data).applicationDomain) this.appContext.applicationDomain = (<ServerContext>data).applicationDomain;
      if (this.appContext.applicationDomain) {
        this.windowRefService.nativeWindow.localStorage.setItem('app-domain', this.appContext.applicationDomain);
      }
    }

  }

}
