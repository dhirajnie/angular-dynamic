
import {map, catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AppContextService} from "../context/app-context.service";
import { HttpClient, HttpResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import {Context} from "../../schemas/app-context-schema";
import {Observable} from "rxjs";
import {PathConstats} from "../../constants/path-constants";
import {handleError} from "../../factories/handle-error.factory";
import { TableConfigObject } from "../../schemas/table-config-schema";



@Injectable()
export class GetTaskDetails {
  appContext: Context;

  constructor(private http: HttpClient, private appContextService: AppContextService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res: Response) {
    let body = res;

    return body || {};
  }

  getTasks(tableConfigObject:TableConfigObject): Observable <any> {

    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('fromIndex',tableConfigObject.tableData.nextIndex.toString());
    myParams = myParams.append('size',tableConfigObject.tableData.pageSize.toString());
    myParams = myParams.append('q','*');
    myParams = myParams.append('sortOrder',tableConfigObject.tableData.sortOrder);
    myParams = myParams.append('sortBy',tableConfigObject.tableData.sortBy);
    myParams = myParams.append('assignedTo','assignedTo');
    myParams = myParams.append('recipient','recipientAsMe');
    myParams = myParams.append('expireUnit','weeks');
    myParams = myParams.append('expireWithin','');
    myParams = myParams.append('proxyUser','');
    myParams = myParams.append('status','');
    let options = {  params: myParams };
    return this.http.get(this.appContext.context +PathConstats.restAccess + PathConstats.taskListApi, options).pipe(
      catchError(handleError));
  }

  getColumnCustomization(columnCustomizationApi): Observable <any> {
    return this.http.get(this.appContext.context +PathConstats.restAccess+columnCustomizationApi, {}).pipe(
      map(this.extractData),
      catchError(handleError),);
  }




}
