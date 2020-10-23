
import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Context } from "../../../schemas/app-context-schema";
import { HttpClient, HttpResponse, HttpRequest, HttpParams } from '@angular/common/http';
import { AppContextService } from "../../context/app-context.service";
import { PathConstats } from "../../../constants/path-constants";
import { handleErrorReason } from "../../../factories/handle-error.factory";
import { Observable } from 'rxjs';
import { VariableService } from 'src/app/shared/services/utilities/util_variable/variable.service';

@Injectable()
export class AvailabilityCrudService {

  appContext: Context;

  constructor(private http: HttpClient, 
    private appContextService: AppContextService,
    private variableService: VariableService
    ) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  createAvailability(newAvailability: any) {
    return this.http.post(this.appContext.context + PathConstats.availabilityListApi,newAvailability).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }),
      catchError(handleErrorReason),);
  }

  updateAvailability(newAvailability: any) {
    return this.http.put(this.appContext.context + PathConstats.availabilityListApi,newAvailability).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }),
      catchError(handleErrorReason),);
  }

  deleteAvailabilities(availabilityList: any) {
    return this.http.request('delete',this.appContext.context + PathConstats.availabilityListApi, { body: availabilityList }).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }),
      catchError(handleErrorReason),);
  }

  updateStatusChange(status,userDn): Observable<any>{
    var payload = {};
    if(!this.variableService.isEmptyString(userDn)){
      payload["dn"] = userDn;
    }
    payload["status"] = status;
    return this.http.post(this.appContext.context + PathConstats.availabilityStatusApi,payload).pipe(
    map((res: Response) => {
      let body = res;
      return body || {};
    }))
  }
}
