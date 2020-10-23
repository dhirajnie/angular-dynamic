
import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import { HttpClient, HttpResponse, HttpParams, HttpRequest } from "@angular/common/http";
import {PathConstats} from "../../../constants/path-constants";
import {AppContextService} from "../../context/app-context.service";
import {Context} from "../../../schemas/app-context-schema";
import {handleError} from "../../../factories/handle-error.factory";
import { VariableService } from "../../utilities/util_variable/variable.service";

@Injectable()
export class RolesPermListService {

  appContext: Context;

  constructor(private http: HttpClient, private appContextService: AppContextService, private variableService : VariableService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res: any) {
    let body = res;
    if (body != undefined && body != null && body.roles != undefined && body.roles != null) {
      for (let i = 0; i < body.roles.length; ++i) {
        body.roles[i].type = "role";
      }
    }
    return body || {};
  }

  getRolesList(query: string, nextIndex: number, paginationSize: number,filters?:any): Observable<any> {
    return this.getRolesListWithLevel(query, nextIndex, paginationSize, null, false, null,filters);
  }

  getRolesListWithLevel(query: string, nextIndex: number, paginationSize: number, queryLevel: any, needColumnLevel: boolean, roleLevelList: any,filters?:any): Observable<any> {
    let finalQuery = "";
    
    if (query == undefined || query == null || query == "") {
      finalQuery = "*";
    } else {
      finalQuery = query;
    }

    if (nextIndex == undefined || nextIndex == null || nextIndex < 1) {
      nextIndex = 1;
    }
    if (paginationSize == undefined || paginationSize == null || paginationSize <= 0 || paginationSize > 300) {
      paginationSize = 10;
    }
    let params: HttpParams = new HttpParams();
    params = params.set('q', finalQuery);
    params = params.set('size', paginationSize.toString());
    params = params.set('nextIndex', nextIndex.toString());
    params = params.set('column', 'name');
    params = params.append('column', 'description');
    if (needColumnLevel == true) {
      params = params.append('column', "levelCode");
    }
    
    if (this.variableService.isDefinedPositiveNumber(queryLevel)) {
      params = params.append('roleLevel', queryLevel);
    }

    if(!this.variableService.isEmptyArray(roleLevelList)) {
      params = params.append('column', "roleLevel");
      for(let i =0;i<roleLevelList.length;++i) {
        params = params.append('roleLevel', roleLevelList[i].toString());
      }
    }
    if (!this.variableService.isUndefinedOrNull(filters)) {
      filters.forEach(element => {
        if(element.type=='category'){
          params = params.append('categoryKeys',element.id);
          params = params.append('column', 'categories');
        }
        if(element.type=='level'){
          params = params.append('roleLevel',element.id);
          params = params.append('column', 'roleLevel');

        }

      });
    }
    const requestOptions = {
      params: params
    };
    return this.http.get(this.appContext.context + PathConstats.rolesListApi, requestOptions).pipe(
      map(this.extractData),
      catchError(handleError),);
  }

}

