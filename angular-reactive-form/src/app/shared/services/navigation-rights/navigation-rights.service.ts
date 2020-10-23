
import {map, catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {PathConstats} from "../../constants/path-constants";
import {AppContextService} from "../context/app-context.service";
import {Context} from "../../schemas/app-context-schema";
import {handleError} from "../../factories/handle-error.factory";
import {VariableService} from "../utilities/util_variable/variable.service";

@Injectable({
  providedIn: 'root'
})
export class NavigationRightsService {

  appContext: Context;
  private dataSubject = new ReplaySubject<any>(1);
  data$: Observable<any> = this.dataSubject.asObservable();


  constructor(private http: HttpClient, private appContextService: AppContextService,private vutils:VariableService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res) {
    let body = res;
    return body || {};
  }

  getNavRights(): Observable<any> {
     return this.data$;
  }

  takeUpdate() {
    return this.http.post(this.appContext.context+PathConstats.navigationRightsApi,{}).pipe(
      map(this.extractData),
      catchError(handleError),)
      .subscribe(res => this.dataSubject.next(res));
  }

  checkAccess(page: any): Observable<any> {
    if (!this.vutils.isUndefinedOrNull(page)) {
      return this.http.post(this.appContext.context + PathConstats.navigationRightsApi, page).pipe(
        map(this.extractData),
        catchError(handleError),);
    }

  }
  checkAccessDelegatedAdmin(params: any): Observable<any> {
    if (!this.vutils.isUndefinedOrNull(params )) {

      return this.http.get(this.appContext.context + PathConstats.delegatedAdminRightsApi+'?objectType='+params ).pipe(
        map(this.extractData),
        catchError(handleError),);
    }

  }
}
