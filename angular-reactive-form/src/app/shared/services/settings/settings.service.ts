
import {catchError, map} from 'rxjs/operators';
import { ClientSettings, ClientSettingsV3 } from './../../schemas/client-settings-schema';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Context } from "../../schemas/app-context-schema";
import { AppContextService } from "../context/app-context.service";
import { UserRightsService } from "../user-rights/user-rights.service";
import { PathConstats } from "../../constants/path-constants";
import { handleError, handleErrorReason } from "../../factories/handle-error.factory";
import { Client } from "../../schemas/client-schema";
import { UserRights } from "../../schemas/user-rights-schema";
import { ClientSettingsV2 } from "../../schemas/client-settings-schema";
import { ClientSettingsObject } from "../../schemas/client-settings-object";


@Injectable()
export class SettingsService {

  appContext: Context;
  errorMessage: string;
  loggedInUserRights: UserRights;
  private _clientSettigs: any;
  private _mappedClientSettigs: ClientSettingsV2;
  private _uniqueMappedClientSettigs: ClientSettingsV3;

  private dataSubject = new ReplaySubject<Client>(1);
  data$: Observable<Client> = this.dataSubject.asObservable();

  constructor(private http: HttpClient, private appContextService: AppContextService, private userRightsService: UserRightsService) {
    this.appContext = this.appContextService.getAppContext();
    this._mappedClientSettigs = new ClientSettingsV2();
    this._mappedClientSettigs.access = {};
    this._mappedClientSettigs.branding = {};
    this._mappedClientSettigs.customization = {};
    this._mappedClientSettigs.helpdesk = {};
    this._mappedClientSettigs.dashboardAccess = {};
    this._uniqueMappedClientSettigs = new ClientSettingsV3();
    this._uniqueMappedClientSettigs.access = [];
    this._uniqueMappedClientSettigs.branding = [];
    this._uniqueMappedClientSettigs.customization = [];
    this._uniqueMappedClientSettigs.helpdesk = [];
    this._uniqueMappedClientSettigs.dashboardAccess = [];

  }

  private extractData(res: any) {
    let body = res;
    body.config = JSON.parse(body.config);
    return body || {};
  }

  private extractFeedbackMessage(res: Response) {
    let body = res;
    return body || {};
  }

  getSettings(): Observable<Client> {
    return this.data$;
  }

  mapSettings() {
    Object.keys(this._clientSettigs.config).forEach(configkey => {
      for (let value of this._clientSettigs.config[configkey]) {
        let valueKey = value.key;
        this._mappedClientSettigs[configkey][valueKey] = value;
        this._uniqueMappedClientSettigs[configkey].push(value);
      }
    });
  }

  getSettingsByKey(settings: string, key: string): Observable<ClientSettingsObject> {
    return this.getSettings().pipe(map(res => {
      if (this._mappedClientSettigs.hasOwnProperty(settings)) {
        if (this._mappedClientSettigs[settings].hasOwnProperty(key)) {
          return this._mappedClientSettigs[settings][key];
        } else {
          return null;
        }
      } else {
        return null;
      }
    }));

  }

  getEntitySettingsByKey(settings: string, entity: string, key: string): Observable<ClientSettingsObject> {
    return this.getSettings().pipe(map(res => {
      if (this._uniqueMappedClientSettigs.hasOwnProperty(settings)) {
        for (let index = 0; index < this._uniqueMappedClientSettigs[settings].length; index++) {
          const element = this._uniqueMappedClientSettigs[settings][index];
          if (element.sectionKey == entity && element.key == key) {
            return element;
          }
        }
      } else {
        return null;
      }
    }));
  }

  updateRoleResourceSettings(roleResourceSetting: any, settingsType): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.updateRoleResourceSettingsApi + settingsType, roleResourceSetting).pipe(
      map(this.extractFeedbackMessage),
      catchError(handleErrorReason),);
  }

  takeUpdate(loggedInUserRights: UserRights) {
    this.http.get(this.appContext.context + PathConstats.settingsApi + loggedInUserRights.clientId, {}).pipe(
      map(this.extractData),
      catchError(handleError),)
      .subscribe(res => {
        this._clientSettigs = res;
        this.mapSettings();
        return this.dataSubject.next(res);
      }
      );
  }
}
