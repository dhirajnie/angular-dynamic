
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { PathConstats } from "../../../constants/path-constants";
import { AppContextService } from "../../context/app-context.service";
import { Context } from "../../../schemas/app-context-schema";
import { handleError, handleErrorReason } from "../../../factories/handle-error.factory";
import { VariableService } from "../../utilities/util_variable/variable.service";
import { Cprs } from "../../../schemas/cprs-schema";
import { Resource } from "../../../schemas/resource-schema";
import { Resources } from "../../../schemas/resources-schema";

@Injectable()
export class CprsPublishService {

  appContext: Context;

  constructor(private http: HttpClient, private appContextService: AppContextService, variableService: VariableService){
    this.appContext = this.appContextService.getAppContext();
  }
  private extractData(res: Response) {
    let body = res || {};
    return body;
  }
  publishAssignments(cprs: Cprs, all: boolean): Observable<any> {
    if(all){
    return this.http.post(this.appContext.context + PathConstats.cprsMigratePermissionsApi, cprs).pipe(
      map(this.extractData),
      catchError(handleErrorReason),);
    }else{
      return this.http.post(this.appContext.context + PathConstats.cprsPublishPermissionAssignmentsApi, cprs).pipe(
      map(this.extractData),
      catchError(handleErrorReason),);
    }
  }

  saveCprsSettinngs(resources: Resources): Observable<any> {
    return this.http.put(this.appContext.context + PathConstats.modifyResourcesApi, resources).pipe(
      map(this.extractData),
      catchError(handleErrorReason),);
  }
  
  refreshCprsAssignments(cprs: Cprs): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.refreshCprsAssignments, cprs).pipe(
      map(this.extractData),
      catchError(handleErrorReason),);
  }

}
