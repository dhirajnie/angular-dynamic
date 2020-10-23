
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpResponse, HttpParams, HttpRequest } from "@angular/common/http";
import { PathConstats } from "../../../constants/path-constants";
import { AppContextService } from "../../context/app-context.service";
import { Context } from "../../../schemas/app-context-schema";
import { handleError } from "../../../factories/handle-error.factory";

@Injectable()
export class DriversService {

  appContext: Context;

  constructor(private http: HttpClient, private appContextService: AppContextService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractDataDrivers(res) {
    let body = res;
    if (body != undefined && body != null && body.drivers != undefined && body.drivers != null) {
      for (let i = 0; i < body.drivers.length; ++i) {
        body.drivers[i].type = "driverOrEntitlement";
        body.drivers[i].subType = "driver";
      }
    }
    return body || {};
  }
  private extractDataEntitlements(res, subType: string = "driver") {
    let body = res;
    if (body != undefined && body != null) {
      body.type = "driverOrEntitlement";
      body.subType = subType;
      body.views = [];
      let driverViewsQueryKeysSet = new Set();
      if (body.entitlements != undefined && body.entitlements != null) {
        for (let i = 0; i < body.entitlements.length; ++i) {
          body.entitlements[i].type = "driverOrEntitlement";
          body.entitlements[i].subType = "entitlement";
          // body.entitlements[i].pathName = body.name;
          let entitlementHasViews = false;
          if (body.entitlements[i].views != undefined && body.entitlements[i].views.length > 1) {
            for (let j = 0; j < body.entitlements[i].views.length; ++j) {
              body.entitlements[i].views[j].type = "dropdown";
              let customViewObject = {
                queryKey: body.entitlements[i].views[j].queryKey,
                displayName: "",
                type: "dropdown",
                viewID: ""
              };
              if (body.subType == "driver") {
                customViewObject.displayName = body.entitlements[i].views[j].queryKey;
              }
              else {
                customViewObject.displayName = body.entitlements[i].views[j].displayName
              }
              if(body.entitlements[i].views[j].viewID != undefined) {
                customViewObject.viewID = body.entitlements[i].views[j].viewID;
              }
              if (body.entitlements[i].views[j].queryKey != undefined && body.entitlements[i].views[j].queryKey != "" && !driverViewsQueryKeysSet.has(body.entitlements[i].views[j].queryKey)) {
                entitlementHasViews = true;
                driverViewsQueryKeysSet.add(body.entitlements[i].views[j].queryKey);
                body.views.push(customViewObject);
              }
            }
            body.entitlements[i].hasLogicalSystem = entitlementHasViews;
          } else {
            body.entitlements[i].hasLogicalSystem = entitlementHasViews;
          }
        }
      }
      if (body.views.length > 1) {
        body.hasLogicalSystem = true;
      } else {
        body.hasLogicalSystem = false;
      }
    }
    return body || {};
  }

  getDriversList(cprsSupported?: boolean): Observable<any> {
    if (cprsSupported != undefined && cprsSupported) {
      let params: HttpParams = new HttpParams();   
      params = params.set('type', '4');
      const requestOptions = {
        params: params
      };

    return this.http.get(this.appContext.context + PathConstats.driversApi,requestOptions).pipe(
      map(this.extractDataDrivers),
      catchError(handleError),);
    } else {
      return this.http.get(this.appContext.context + PathConstats.driversApi).pipe(
      map(this.extractDataDrivers),
      catchError(handleError),);
    }
      
  }

  getEntitlementsList(driver: any, cprsSupported?: boolean): Observable<any> {
    if (cprsSupported != undefined && cprsSupported) {
    let params: HttpParams = new HttpParams();
    params = params.set('cprsSupported', 'true');
    const requestOptions = {
      params: params
    };

    return this.http.post(this.appContext.context + PathConstats.driverEntitlementsApi, { "id": driver.id },requestOptions).pipe(
      map((data) => this.extractDataEntitlements(data)),
      catchError(handleError),);
    } else {
      return this.http.post(this.appContext.context + PathConstats.driverEntitlementsApi, { "id": driver.id }).pipe(
      map((data) => this.extractDataEntitlements(data)),
      catchError(handleError),);
    }
  }

  getDetailsForDriver(driver: any, cprsSupported?: boolean): Observable<any> {
    if (cprsSupported != undefined && cprsSupported) {
    let params: HttpParams = new HttpParams();
    params = params.set('cprsSupported', 'true');
    const requestOptions = {
      params: params
    };

    return this.http.post(this.appContext.context + PathConstats.driverEntitlementsApi, { "id": driver.id }, requestOptions).pipe(
      map((data: Response) => this.extractDataEntitlements(data, "driver")),
      catchError(handleError),);
    } else {
      return this.http.post(this.appContext.context + PathConstats.driverEntitlementsApi, { "id": driver.id }).pipe(
      map((data: Response) => this.extractDataEntitlements(data, "driver")),
      catchError(handleError),);
    }
  }

  getDetailsForEntitlement(driver: any, cprsSupported?: boolean): Observable<any> {
    if (cprsSupported != undefined && cprsSupported) {
    let params: HttpParams = new HttpParams();
    params = params.set('cprsSupported', 'true');
    let requestOptions = {
      params: params
    };

    return this.http.post(this.appContext.context + PathConstats.driverEntitlementsApi, { "id": driver.id },requestOptions).pipe(
      map((data) => this.extractDataEntitlements(data, "entitlement")),
      catchError(handleError),);
    } else {
      return this.http.post(this.appContext.context + PathConstats.driverEntitlementsApi, { "id": driver.id }).pipe(
      map((data) => this.extractDataEntitlements(data, "entitlement")),
      catchError(handleError),);
    }
  }

  getEntitlementValuesWithoutLogicalID(query: string, nextIndex: number, paginationSize: number, entitlement): Observable<any> {
    if (query == undefined || query == null || query == "") {
      query = "*"
    };
    if (nextIndex == undefined || nextIndex == null || nextIndex < 1) {
      nextIndex = 1;
    }
    if (paginationSize == undefined || paginationSize == null || paginationSize <= 0 || paginationSize > 300) {
      paginationSize = 10;
    }

    let params: HttpParams = new HttpParams();
    params = params.set('query', query);
    params = params.set('pageSize', paginationSize.toString());
    params = params.set('nextIndex', nextIndex.toString());
    const requestOptions = {
      params: params
    };

    return this.http.post(this.appContext.context + PathConstats.entitlementValuesWithoutLogicalId, entitlement, requestOptions).pipe(
      map(this.extractDataEntitlementValues),
      catchError(handleError),);
  }

  getEntitlementValuesWithLogicalID(query: string, nextIndex: number, paginationSize: number, entitlement): Observable<any> {
    if (query == undefined || query == null || query == "") {
      query = "*"
    };
    if (nextIndex == undefined || nextIndex == null || nextIndex < 1) {
      nextIndex = 1;
    }
    if (paginationSize == undefined || paginationSize == null || paginationSize <= 0 || paginationSize > 300) {
      paginationSize = 10;
    }

    let params: HttpParams = new HttpParams();
    params = params.set('query', query);
    params = params.set('pageSize', paginationSize.toString());
    params = params.set('nextIndex', nextIndex.toString());
    const requestOptions = {
      params: params
    };

    return this.http.post(this.appContext.context + PathConstats.entitlementValuesWithLogicalId, entitlement, requestOptions).pipe(
      map(this.extractDataEntitlementValues),
      catchError(handleError),);
  }

  extractDataEntitlementValues(res) {
    let body = res;
    if (body != undefined && body != null && body.entitlementValues != undefined && body.entitlementValues != null) {
      for (let i = 0; i < body.entitlementValues.length; ++i) {
        body.entitlementValues[i].type = "entitlementValues";
      }
    }
    return body || {};
  }


}
