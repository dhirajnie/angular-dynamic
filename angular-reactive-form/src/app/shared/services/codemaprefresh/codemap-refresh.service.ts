
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { PathConstats } from "../../constants/path-constants";
import { AppContextService } from "../context/app-context.service";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { handleError, handleErrorReason} from "../../factories/handle-error.factory";
import { Context } from "../../schemas/app-context-schema";

@Injectable({
  providedIn: 'root'
})
export class CodemapRefreshService {

  appContext: Context;

  constructor(
    private appContextService: AppContextService,
    private http: HttpClient
  ) { 
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  refreshDriver(drivers: any): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.codemapRefreshDriverApi, drivers).pipe(
      map(this.extractData),
      catchError(handleErrorReason),);
  }

  refreshEntitlement(entitlements: any): Observable<any> {
    console.log(entitlements);
    return this.http.post(this.appContext.context + PathConstats.codemapRefreshEntitlementApi, entitlements).pipe(
      map(this.extractData),
      catchError(handleErrorReason),);
  }

}
