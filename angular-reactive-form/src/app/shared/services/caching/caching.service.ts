
import {catchError, map} from 'rxjs/operators';
import { FlushCache} from './../../schemas/caching-schema';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { PathConstats } from '../../constants/path-constants';
import { Context } from '../../schemas/app-context-schema';
import { Observable } from 'rxjs';
import { AppContextService } from '../context/app-context.service';
import { handleErrorReason } from "../../factories/handle-error.factory";


@Injectable()
export class CachingService {
  private appContext: Context;

  constructor(private http: HttpClient, private appContextService: AppContextService) {
    this.appContext = this.appContextService.getAppContext();
  }

  public getCacheConfiguration(): Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.cacheConfigurationApi + "/holders").pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }), catchError(handleErrorReason),);
  }

  public deleteCache(value){
    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('cacheHolderID',value);
    let options;
    options = {  params: myParams };
    return this.http.delete(this.appContext.context + PathConstats.cacheConfigurationApi + "/holder/items",
      options).pipe(catchError(handleErrorReason));
  }

  public getClusterandCacheConfiguration(): Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.cacheConfigurationApi + "/configuration").pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }), catchError(handleErrorReason),);
  }
  
  public sendClusterandCacheConfiguration(payload): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.cacheConfigurationApi + "/configuration",JSON.stringify(payload)).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }), catchError(handleErrorReason),);
  }
  /**
   * Update customized cache holders configurations
   * @param payload payload having custom cache config attributes to be updated
   */
  public updateCustomCacheConfiguration(payload): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.customizedCacheHoldersApi,
      JSON.stringify(payload)).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }), catchError(handleErrorReason),);
  }
  /**
   * get customized cache holder configuration
   */
  public getCustomizedCacheHolderConfiguration(): Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.customizedCacheHoldersApi).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }),catchError(handleErrorReason),);
  }
}
