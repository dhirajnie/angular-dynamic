
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Context } from "../../../schemas/app-context-schema";
import { HttpClient, HttpResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { AppContextService } from "../../context/app-context.service";
import { PathConstats } from "../../../constants/path-constants";
import { handleError, handleErrorReason } from "../../../factories/handle-error.factory";

@Injectable()
export class DelegationCrudService {

  appContext: Context;

  constructor(private http: HttpClient, private appContextService: AppContextService) {
    this.appContext = this.appContextService.getAppContext();
   }

   private extractData(res: Response) {
    let body = res;

    return body || {};
  }

  getRequestCategoryOptions(){

    return this.http.get(this.appContext.context + PathConstats.delegationRequestCategoriesApi).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }),

      catchError(handleErrorReason),);
  }

  getRequestsForCategory(selectedCategory){

    return this.http.get(this.appContext.context + PathConstats.delegationgetRequestsForCategoryApi + '?category=' +selectedCategory).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }),

      catchError(handleErrorReason),);
  }

  getRelationships(){

    return this.http.get(this.appContext.context + PathConstats.delegationRelationshipsApi).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }),

      catchError(handleErrorReason),);
  }

  deleteDelegations(delegationsList: any){

    return this.http.request('delete',this.appContext.context + PathConstats.delegationListApi, { body: delegationsList }).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }),

      catchError(handleErrorReason),);
  }

  createDelegation(delegation){

    return this.http.post(this.appContext.context + PathConstats.delegationListApi, delegation).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }),

      catchError(handleErrorReason),);
  }

  updateDelegation(delegation){

    return this.http.put(this.appContext.context + PathConstats.delegationListApi, delegation).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }),

      catchError(handleErrorReason),);
  }

}
