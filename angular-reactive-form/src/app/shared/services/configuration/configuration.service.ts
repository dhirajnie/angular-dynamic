import {catchError, map} from 'rxjs/operators';
import { Injectable, SkipSelf } from '@angular/core';
import { AppContextService } from '../context/app-context.service';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PathConstats } from '../../constants/path-constants';
import { handleError } from '../../factories/handle-error.factory';
import { UIConstants } from '../../constants/ui-constants';
import { Context } from '../../schemas/app-context-schema';
import { DelegationAdminConfig, ProxyAdminConfig, CleanupServiceConfig } from '../../schemas/delegation-admin-config';
import { CprsAdminConfig } from '../../schemas/cprs-admin-config';
import { LoggingConfig } from '../../schemas/logging-config';
import { GlobalService } from '../global/global.service';
import { IgConfig } from '../../schemas/ig-admin-config';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private appContext: Context;

  constructor(private http: HttpClient,
              private appContextService: AppContextService,
              private globalService: GlobalService) {
    this.appContext = this.appContextService.getAppContext();
  }

  public getEmailTemplates(searchString: string): Observable<any> {
    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('nextIndex', '1');
    if (searchString === undefined || searchString == null || searchString === '') {
      searchString = '*';
    }
    myParams = myParams.append('q', searchString);
    myParams = myParams.append('size', this.globalService.defaultRowsPerPage);
    let options;
    options = {  params: myParams };
    return this.http.get(this.appContext.context + PathConstats.emailTemplateListApi, options);
  }
  public getDelgationConfiguration(): Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.delegationConfigurationApi).pipe(
      map((res: any) => {
        let body = res;
        return body || {};
      }));
  }

  public getDriverStatusInformation(): Observable<any> {
        return this.http.get(this.appContext.context + PathConstats.driverStatusInformationApi).pipe(
          map((res: Response) => {
            let body = res;
            return body || {};
          }));
    }

  public getProxyConfiguration(): Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.proxyConfigurationApi).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }));
  }

  public getCleanupServiceConfiguration(): Observable<any> {
          return this.http.get(this.appContext.context + PathConstats.cleanupServiceConfigurationApi).pipe(
          map((res: Response) => {
            let body = res;
            return body || {};
          }));
      }

  public getRoleResourceSettings(): Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.roleResourceSettingsApi).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }));
  }

  public saveOrUpdateDelgationConfiguration(delegationConfig: DelegationAdminConfig) {

    return this.http.post(this.appContext.context + PathConstats.delegationConfigurationApi,
      delegationConfig).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }),

      catchError(handleError),);
  }

  public saveOrUpdateProxyConfiguration(proxyConfig: ProxyAdminConfig) {

    return this.http.post(this.appContext.context + PathConstats.proxyConfigurationApi,
      proxyConfig).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }),

      catchError(handleError),);
  }

  public saveOrUpdateProxyAndDelegationConfiguration(cleanupServiceConfig: CleanupServiceConfig) {
    
        return this.http.post(this.appContext.context + PathConstats.cleanupServiceConfigurationApi,
          cleanupServiceConfig).pipe(
          map((res: Response) => {
            let body = res;
            return body || {};
          }),
    
          catchError(handleError),);
      }

  public getCprsConfiguration(): Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.cprsConfigurationApi).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }));
  }

  public saveOrUpdateCprsConfiguration(cprsConfig: CprsAdminConfig) {

    return this.http.post(this.appContext.context + PathConstats.cprsConfigurationApi,
      cprsConfig).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }),

      catchError(handleError),);
  }

  public getLoggingConfiguration(query): Observable<any> {
    if(query == null || query == undefined)
      query ='*';
    return this.http.get(this.appContext.context + PathConstats.loggingConfigurationApi + '?q='+query).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }));
  }

  public getPackages(query): Observable<any> {
    if (query == null || query == undefined)
      query = '*';
    return this.http.get(this.appContext.context + PathConstats.loggingPcakagesApi + '?q=' + query).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }));
  }

  public saveOrUpdateLoggingConfiguration(loggingConfig: LoggingConfig) {

    return this.http.put(this.appContext.context + PathConstats.loggingConfigurationPostApi,
      loggingConfig).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }),

      catchError(handleError),);
  }

  public addNewLoggingConfiguration(loggingConfig: LoggingConfig) {

    return this.http.post(this.appContext.context + PathConstats.loggingConfigurationPostApi,
      loggingConfig).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }),

      catchError(handleError),);
  }

  public saveOrUpdateAuditingConfiguration(loggingConfig: LoggingConfig) {

    return this.http.post(this.appContext.context + PathConstats.auditingConfigurationPostApi,
      loggingConfig).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }),

      catchError(handleError),);
  }

  public getIgConfiguration(): Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.igConfigurationApi).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }));
  }

  public saveOrUpdateIgConfiguration(igConfig: IgConfig) {
    return this.http.post(this.appContext.context + PathConstats.igConfigurationApi,
      igConfig).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }),

      catchError(handleError),);
  }

  private extractData(res: Response) {
    let body = res;

    return body || {};
  }
}
