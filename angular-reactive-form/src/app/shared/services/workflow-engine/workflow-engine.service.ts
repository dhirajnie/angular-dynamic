
import {map, catchError} from 'rxjs/operators';
import { WorkflowEngineConfiguration } from './../../schemas/workflow-engine-schema';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { PathConstats } from '../../constants/path-constants';
import { Context } from '../../schemas/app-context-schema';
import { Observable } from 'rxjs';
import { AppContextService } from '../context/app-context.service';
import { handleErrorReason }
 from '../../factories/handle-error.factory';

@Injectable()
export class WorkflowEngineService {
  private appContext: Context;
  constructor(private http: HttpClient, private appContextService: AppContextService) {
    this.appContext = this.appContextService.getAppContext();
  }
/**
 * list workflow engines with their states(e.g. running, shutdown)
 */
  public getWorkflowEnginesState(): Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.workFlowEnigneAPI).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }),catchError(handleErrorReason),);
  }

/**
 * Get current workflow engine configuration
 */
public getWorkflowEngineConfiguration(): Observable<any> {
  return this.http.get(this.appContext.context + PathConstats.workFlowEnigneConfigAPI).pipe(
    map((res: Response) => {
      let body = res;
      return body || {};
    }),catchError(handleErrorReason),);
}
  /**
   * Update current workflow engine configurations
   * @param payload payload having engine config attributes to be updated
   */
  public updateWorkflowEngineConfiguration(payload: WorkflowEngineConfiguration): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.workFlowEnigneConfigAPI,
      JSON.stringify(payload)).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }),
      catchError(handleErrorReason),);
  }
}
