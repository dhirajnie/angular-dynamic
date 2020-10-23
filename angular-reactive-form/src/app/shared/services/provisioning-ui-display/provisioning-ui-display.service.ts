
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { handleError, handleErrorReason } from "../../../shared/factories/handle-error.factory";
import { PathConstats } from '../../constants/path-constants';
import { Context } from '../../schemas/app-context-schema';
import { AppContextService } from '../context/app-context.service';
import { Observable } from 'rxjs';
import { GlobalService } from './../global/global.service';

@Injectable()
export class ProvisioningUiDisplayService {
  private appContext: Context;

  constructor(
    private http: HttpClient, 
    private appContextService: AppContextService,
    private globalService: GlobalService
  ) { 
    this.appContext = this.appContextService.getAppContext();
  }

  public getTaskSettingsData() {
    return this.http.get(this.appContext.context + PathConstats.provisioningUIdisplayApi + "/task").pipe(
    map((res: any) => {
        let body = res;
        return body || {};
      }));    
  }

  public saveTaskSettingsConfiguration(payload) : Observable<any> {
    return this.http.put(this.appContext.context + PathConstats.provisioningUIdisplayApi + "/task",payload).pipe(
      map((res: any) => {
        let body = res;
        return body || {};
      }),
    catchError(handleErrorReason),);
  }

  public getRequestSettingsData() {
    return this.http.get(this.appContext.context + PathConstats.provisioningUIdisplayApi + "/request").pipe(
    map((res: Response) => {
        let body = res;
        return body || {};
      }));    
  }

  public saveRequestSettingsConfiguration(payload) : Observable<any> {
    return this.http.put(this.appContext.context + PathConstats.provisioningUIdisplayApi + "/request",payload).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }),
      catchError(handleErrorReason ),);

  }

  public saveGeneralDisplaySettings(payload) : Observable<any>{
    return this.http.put(this.appContext.context + PathConstats.provisioningUIdisplayApi + "/general",JSON.stringify(payload)).pipe(
      map(this.extractData),
      catchError(handleErrorReason ),);
  }

  extractData(res: Response){
    let body = res
    return body || {}
  }
 
}
