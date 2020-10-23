
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppContextService } from "../../context/app-context.service";
import { HttpClient, HttpResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from "rxjs";
import { PathConstats } from "../../../constants/path-constants";
import { TableConfigObject } from "../../../schemas/table-config-schema";
import { Context } from "../../../schemas/app-context-schema";

import { VariableService } from './../../utilities/util_variable/variable.service';
import { handleErrorReason } from 'src/app/shared/factories/handle-error.factory';

@Injectable()
export class AvailabilityListService {
  appContext: Context;
  constructor(private http: HttpClient,
    private appContextService: AppContextService,

    private variableService: VariableService) {
    this.appContext = this.appContextService.getAppContext();
  }

  getAvailabilities(): Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.availabilityListApi, {}).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }), catchError(handleErrorReason));
  }

  getUserAvailabilities(userDN: any): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.userAvailabilityListApi, userDN, {}).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }), catchError(handleErrorReason));
  }

  getPrdsForCreation(userDn): Observable<any> {
    let myParams: HttpParams = new HttpParams();
    let options;

    if (!this.variableService.isEmptyString(userDn)) {
      myParams = myParams.append('userDn', userDn);
      options = { params: myParams };
    } else {
      options = {};
    }
    return this.http.get(this.appContext.context + PathConstats.availabilityPrdsForCreateApi, options).pipe(catchError(handleErrorReason));
  }
}
