
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Context } from "../../schemas/app-context-schema";
import { AppContextService } from "../context/app-context.service";
import { HttpClient, HttpResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { VariableService } from "../utilities/util_variable/variable.service";
import { PathConstats } from "../../constants/path-constants";
import { handleError, handleErrorReason } from "../../factories/handle-error.factory";
import { SoDs } from "../../schemas/sod-schema";

@Injectable()
export class SodCrudService {

  appContext: Context;

  constructor(private http: HttpClient, private appContextService: AppContextService,
    private variableService: VariableService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  private extractSodData(res: any) {
    let body = res;
    let sods = new SoDs();
    sods.sods = [];
    if (body != undefined && body != null) {
      if (body.sods != undefined && body.sods != null) {
        for (let i = 0; i < body.sods.length; i++) {
          let sod = body.sods[i];

          //initialize localizedNames
          let names = [];
          for (let j = 0; j < sod.localizedNames.length; j++) {
            switch (sod.localizedNames[j].locale) {
              case "zh-CN":
                names["zh_CN"] = sod.localizedNames[j].name;
                break;
              case "zh-TW":
                names["zh_TW"] = sod.localizedNames[j].name;
                break;
              case "he":
                names["iw"] = sod.localizedNames[j].name;
                break;
              default:
                 names[sod.localizedNames[j].locale] = sod.localizedNames[j].name;
            }
          }
          sod.localizedNames = names;

          //initialize localizedDescriptions
          let descriptions = [];
          for (let j = 0; j < sod.localizedDescriptions.length; j++) {
            switch (sod.localizedDescriptions[j].locale) {
              case "zh-CN":
                descriptions["zh_CN"] = sod.localizedDescriptions[j].desc;
                break;
              case "zh-TW":
                descriptions["zh_TW"] = sod.localizedDescriptions[j].desc;
              case "he":
                descriptions["iw"] = sod.localizedDescriptions[j].desc;
                break;
              default:
                descriptions[sod.localizedDescriptions[j].locale] = sod.localizedDescriptions[j].desc;
            }
          }
          sod.localizedDescriptions = descriptions;

          // initialize conflicting roles
          if (sod.roles != undefined && sod.roles != null) {
            for (let j = 0; j < sod.roles.length; j++) {
              sod.roles[j].type = "role";
            }
          } else {
            sod.roles = [];
          }

          sods.sods.push(sod);
        }
      }
    }
    return sods || {};
  }

  deleteSods(sods) {
    let sodDeletePayload = { "sods": [] };
    if (!this.variableService.isEmptyArray(sods)) {
      sodDeletePayload.sods = sods;
    }
    return this.http.request('delete',this.appContext.context + PathConstats.sod, { body: sodDeletePayload }).pipe(
          map(this.extractData),
          catchError(handleError),);
  }

  sodDefaultApproval() {
    return this.http.get(this.appContext.context + PathConstats.sodDefaultApproval).pipe(
          map(this.extractData),
          catchError(handleError),);
  }

  createSod(sod) {
    return this.http.post(this.appContext.context + PathConstats.sodsList, sod).pipe(
          map(this.extractData),
          catchError(handleErrorReason),);
  }

  modifySod(sod) {
    return this.http.put(this.appContext.context + PathConstats.sod, sod).pipe(
          map(this.extractData),
          catchError(handleError),);
  }

  getSodDetails(sod) {
    let sodDetailPayload = { "sods": sod};
    return this.http.post(this.appContext.context + PathConstats.sod, sodDetailPayload).pipe(
      map(this.extractSodData),
      catchError(handleError),);
  }
}
