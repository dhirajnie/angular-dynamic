
import {catchError, map, mergeMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import {Observable} from "rxjs";
import {PathConstats} from "../../../shared/constants/path-constants";
import {AppContextService} from "../../../shared/services/context/app-context.service";
import {UserRightsService} from "../../../shared/services/user-rights/user-rights.service";
import {handleError} from "../../../shared/factories/handle-error.factory";

@Injectable()
export class UserQuickInfoService {
  appContext:any;
  constructor(private http:HttpClient,private appContextService:AppContextService,private UserRightsService:UserRightsService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res: any) {
    let body = res;
    return body || {};
  }

  getUSerInfo(entityId): Observable<any>{
    let requestOptions: HttpParams = new HttpParams();
    requestOptions = requestOptions.set('entityType', 'USER');
    requestOptions = requestOptions.set('entityId', entityId);    
    let options;
    return  this.UserRightsService.getUserRights().pipe(
     mergeMap((res : any) => {
      requestOptions = requestOptions.set('clientId', res.clientId);
      options = { params: requestOptions};
       return this.http.get(this.appContext.context +PathConstats.userQuickInfo, options).pipe(
         map(this.extractData),
         catchError(handleError),)
      }))
  }
}

