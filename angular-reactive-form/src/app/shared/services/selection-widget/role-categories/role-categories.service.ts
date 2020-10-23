
import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import { HttpClient, HttpResponse, HttpParams, HttpRequest } from "@angular/common/http";
import {PathConstats} from "../../../constants/path-constants";
import {AppContextService} from "../../context/app-context.service";
import {Context} from "../../../schemas/app-context-schema";
import {handleError} from "../../../factories/handle-error.factory";

@Injectable()
export class RoleCategoriesService {

  appContext: Context;

  constructor(private http: HttpClient, private appContextService: AppContextService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res) {
    let body = res;
    if (body != undefined && body != null && body.categories != undefined && body.categories != null) {
      for (let i = 0; i < body.categories.length; ++i) {
        body.categories[i].type = "category";
      }
    }
    return body || {};
  }

  getRoleCategoriesList(query: string, nextIndex: number, paginationSize: number): Observable<any> {
    if (query == undefined || query == null || query == "") {
      query = "*"
    };
    if (nextIndex == undefined || nextIndex == null || nextIndex < 1) {
      nextIndex = 1;
    }
    if (paginationSize == undefined || paginationSize == null || paginationSize <= 0 || paginationSize > 300) {
      paginationSize = 10;
    }
    let params: HttpParams = new HttpParams();
    params = params.set('q', query);
    params = params.set('size', paginationSize.toString());
    params = params.set('nextIndex', nextIndex.toString());
    const requestOptions = {
      params: params
    }
    return this.http.get(this.appContext.context + PathConstats.roleCategoriesApi, requestOptions).pipe(
      map(this.extractData),
      catchError(handleError),);
  }

}
