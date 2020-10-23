import { Injectable } from '@angular/core';
import { StringConstants } from "../../constants/string-constants";
import { TranslateService } from "../translate/translate.service";
import * as moment from 'moment';
import { VariableService } from "../utilities/util_variable/variable.service";

@Injectable()
export class GlobalService {

  navigationRights: any;
  defaultRowsPerPage: any;
  optionsRowsPerPage: any;
  sessionTimeOutWarnModel = false;
  loggedInUserDetails: any;

  /** to get granular acces of the current route use this data member **/
  private globalSettings: any;
  get currentRouteGranularRights(): any {
    return this._currentRouteGranularRights;
  }
  set currentRouteGranularRights(rawData: any) {
    this._currentRouteGranularRights = new Map();
    rawData.forEach((element: any) => {
      if (element) {
        let pageName = element.key;
        this._currentRouteGranularRights.set(element.key, element.value);
      }
    })
  }
  private _currentRouteGranularRights:any;

  constructor(private translate: TranslateService,
              private vutils: VariableService,
              private stringConstants: StringConstants,
            ) {
  }

  dateFormatterWithFormat(dateString, format) {
    if (!this.vutils.isEmptyString(dateString) && !this.vutils.isEmptyString(format)) {
      let date: Date = new Date(+dateString);
      let currentLocale = this.translate.getUserCurrentLocale();
      if( currentLocale == this.stringConstants.hebrewLanguageCode){
        //if it is hebrew then assign new language code to make it work for moment library
        currentLocale = this.stringConstants.hebrewLanguageNewCode;
      }
      return moment(date).locale(currentLocale).format(format);
    } else {
      return "";
    }
  };

  dateFormatter(dateString) {
    return this.dateFormatterWithFormat(dateString, this.stringConstants.dateFormat);
  };

  dateFormatterDateOnly(dateString) {
    return this.dateFormatterWithFormat(dateString, this.stringConstants.dateFormatDateOnly);
  };

  checkAccess(pageKey) {
    let hasAccess: boolean = true;
    if (!this.vutils.isUndefinedOrNull(this.navigationRights) && !this.vutils.isEmptyArray(this.navigationRights.navPageRights)) {
      for (let i = 0; i < this.navigationRights.navPageRights.length; ++i) {
        if (this.navigationRights.navPageRights[i].key == pageKey) {
          hasAccess = (this.navigationRights.navPageRights[i].value == "true");
          if (hasAccess) break;
        }
      }
    }
    return hasAccess;
  }

  setGlobalSettings(data){
    this.globalSettings = data;
    this.defaultRowsPerPage = +(data.defaultRowsPerPage);
    this.optionsRowsPerPage = data.optionsRowsPerPage.split(",").map(Number);
  }

  getGlobalSettings(){
    return this.globalSettings;
  }

  isSessionTimeOutWarnModelOpen() {
    return this.sessionTimeOutWarnModel;
  }

  setSessionTimeOutWarnModel(sessionTimeOutWarnModel: boolean) {
    this.sessionTimeOutWarnModel = sessionTimeOutWarnModel;
  }

}
