
import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from "rxjs";
import { HttpClient, HttpResponse, HttpHeaders, HttpParams, HttpRequest } from "@angular/common/http";
import { PathConstats } from "../../../shared/constants/path-constants";
import { AppContextService } from "../../../shared/services/context/app-context.service";
import { Context } from "../../../shared/schemas/app-context-schema";
import { handleError } from "../../../shared/factories/handle-error.factory";
import { VariableService } from '../../../shared/services/utilities/util_variable/variable.service';

@Injectable()
export class RootContainerService {

  appContext: Context;
  private dataSubjectRoleDomain = new ReplaySubject<any>(1);
  private dataSubjectResourceDomain = new ReplaySubject<any>(1);
  private dataSubjectPrdDomain = new ReplaySubject<any>(1);
  dataRoleDomain$: Observable<any> = this.dataSubjectRoleDomain.asObservable();
  dataResourceDomain$: Observable<any> = this.dataSubjectResourceDomain.asObservable();
  dataPrdDomain$: Observable<any> = this.dataSubjectPrdDomain.asObservable();

  constructor(private http: HttpClient, private appContextService: AppContextService, private vutils: VariableService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  getRootContainersRoleDomain(): Observable<any> {
    return this.dataRoleDomain$;
  }

  getRootContainersResourceDomain(): Observable<any> {
    return this.dataResourceDomain$;
  }

  getRootContainersPrdDomain(): Observable<any> {
    return this.dataPrdDomain$;
  }

  takeUpdateRoleRootContainers() {
    let params = new HttpParams().set('domain', 'ROLES');
    const requestOptions = {
      params: params
    };
    return this.http.get(this.appContext.context + PathConstats.rootContainersApi, requestOptions).pipe(
      map(this.extractData),
      catchError(handleError),)
      .subscribe(res => this.dataSubjectRoleDomain.next(res));
  }

  takeUpdateResourceRootContainers() {
    let params = new HttpParams().set('domain', 'RESOURCES');
    const requestOptions = {
      params: params
    };
    return this.http.get(this.appContext.context + PathConstats.rootContainersApi, requestOptions).pipe(
      map(this.extractData),
      catchError(handleError),)
      .subscribe(res => this.dataSubjectResourceDomain.next(res));
  }

  takeUpdatePrdRootContainers() {
    let params = new HttpParams().set('domain', 'PROVISIONING');
    const requestOptions = {
      params: params
    };
    return this.http.get(this.appContext.context + PathConstats.rootContainersApi, requestOptions).pipe(
      map(this.extractData),
      catchError(handleError),)
      .subscribe(res => this.dataSubjectPrdDomain.next(res));
  }

  getRootContainerDnByKey(key, data) {
    if(!this.vutils.isUndefinedOrNull(data) && !this.vutils.isEmptyArray(data.mapList)) {
      for(let i=0; i< data.mapList.length;++i) {
        if(data.mapList[i].key==key) {
          return data.mapList[i].value;
        }
      }
    }
    return null; 
  }
}
