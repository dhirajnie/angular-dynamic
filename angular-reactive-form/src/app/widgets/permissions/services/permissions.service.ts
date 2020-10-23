
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from "rxjs";
import { HttpClient, HttpResponse, HttpHeaders, HttpParams, HttpRequest } from "@angular/common/http";
import { PathConstats } from "../../../shared/constants/path-constants";
import { AppContextService } from "../../../shared/services/context/app-context.service";
import { Context } from "../../../shared/schemas/app-context-schema";
import { handleError } from "../../../shared/factories/handle-error.factory";

@Injectable()
export class PermissionsService {

  appContext: Context;
  private dataSubjectRoleDomain = new ReplaySubject<any>(1);
  private dataSubjectResourceDomain = new ReplaySubject<any>(1);
  private dataSubjectPrdDomain = new ReplaySubject<any>(1);
  dataRoleDomain$: Observable<any> = this.dataSubjectRoleDomain.asObservable();
  dataResourceDomain$: Observable<any> = this.dataSubjectResourceDomain.asObservable();
  dataPrdDomain$: Observable<any> = this.dataSubjectPrdDomain.asObservable();

  constructor(private http: HttpClient, private appContextService: AppContextService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  getPermissionsRoleDomain(): Observable<any> {
    return this.dataRoleDomain$;
  }

  getPermissionsResourceDomain(): Observable<any> {
    return this.dataResourceDomain$;
  }

  getPermissionsPrdDomain(): Observable<any> {
    return this.dataPrdDomain$;
  }

  takeUpdateRolePermissions() {
    let params = new HttpParams().set('domain', 'ROLES');
    const requestOptions = {
      params: params
    };
    return this.http.get(this.appContext.context + PathConstats.permissionsApi, requestOptions).pipe(
      map(this.extractData),
      catchError(handleError),)
      .subscribe(res => this.dataSubjectRoleDomain.next(res));
  }

  takeUpdateResourcePermissions() {
    let params = new HttpParams().set('domain', 'RESOURCES');
    const requestOptions = {
      params: params
    };
    return this.http.get(this.appContext.context + PathConstats.permissionsApi, requestOptions).pipe(
      map(this.extractData),
      catchError(handleError),)
      .subscribe(res => this.dataSubjectResourceDomain.next(res));
  }

  takeUpdatePrdPermissions() {
    let params = new HttpParams().set('domain', 'PROVISIONING');
    const requestOptions = {
      params: params
    };
    return this.http.get(this.appContext.context + PathConstats.permissionsApi, requestOptions).pipe(
      map(this.extractData),
      catchError(handleError),)
      .subscribe(res => this.dataSubjectPrdDomain.next(res));
  }

  addPermission(payload) {
    return this.http.put(this.appContext.context + PathConstats.addPermissionApi, payload).pipe(
      map(this.extractData),
      catchError(handleError),)
  }

  deletePermissions(payload){
    return this.http.request('delete',this.appContext.context + PathConstats.addPermissionApi, { body: payload }).pipe(
      map(this.extractData),
      catchError(handleError),)
  }

}
