
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppContextService } from '../../context/app-context.service';
import { PathConstats } from '../../../constants/path-constants';
import { handleError } from '../../../factories/handle-error.factory';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Context } from '../../../schemas/app-context-schema';

@Injectable()
export class DirXmlDriversListService {

  appContext: Context;

  constructor(private appContextService: AppContextService, private http: HttpClient) {
    this.appContext = this.appContextService.getAppContext();
  }

  getDirXmlDriversList(query, nextIndex, paginationSize): Observable<any> {
    if (query == undefined || query == null || query == "") {
      query = "*";
    }
    if (nextIndex == undefined || nextIndex == null || nextIndex < 1) {
      nextIndex = 1;
    }
    if (paginationSize == undefined || paginationSize == null || paginationSize <= 0 || paginationSize > 300) {
      paginationSize = 10;
    }
    return this.http.get(this.appContext.context + PathConstats.dirxmlDriversApi).pipe(
      map(this.extractData),
      catchError(handleError),);
  }

  private extractData(res) {
    let body = res;
    if(body != undefined && body.drivers != undefined && body.drivers.length != 0) {
      for( let i=0;i<body.drivers.length;++i) {
        body.drivers[i].type = "dirxmldriver";
      }
    }
    return body || {};
  }

}
