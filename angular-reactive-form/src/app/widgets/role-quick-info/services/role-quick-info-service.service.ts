
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { PathConstats } from '../../../shared/constants/path-constants';
import { AppContextService } from '../../../shared/services/context/app-context.service';
import { handleErrorReason } from '../../../shared/factories/handle-error.factory';

@Injectable()
export class RoleQuickInfoServiceService {
  appContext: any;
  constructor(private http: HttpClient, private appContextService: AppContextService) { 
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  getRoleInfo(entityId): Observable<any> {
    let params = new HttpParams()
        .set('entityType', 'ROLE')
        .set('entityId', entityId);
  
    const requestOptions = {
      params: params
    };
    return this.http.get(this.appContext.context + PathConstats.userQuickInfo, requestOptions).pipe(
      map(this.extractData),
      catchError(handleErrorReason),);
  }

}
