
import {map, catchError, mergeMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppContextService } from '../context/app-context.service';
import { VariableService } from '../utilities/util_variable/variable.service';
import { TranslateService } from '../translate/translate.service';
import { GlobalService } from '../global/global.service';
import { TableConfigObject } from '../../schemas/table-config-schema';
import { Observable } from 'rxjs';
import { UIConstants } from '../../constants/ui-constants';
import { Context } from '../../schemas/app-context-schema';
import { PathConstats } from '../../constants/path-constants';
import { handleError, handleErrorReason } from '../../factories/handle-error.factory';

@Injectable()
export class GroupsService {
  appContext: Context;
  private selectedGroup: any;
  constructor(
    private http: HttpClient,
    private appContextService: AppContextService,
    private vutils: VariableService,
    private translate: TranslateService,
    private globalService: GlobalService
  ) {
    this.appContext = this.appContextService.getAppContext();
   }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  getGroups(tableConfigObject: TableConfigObject, filters): Observable<any> {
    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('nextIndex', tableConfigObject.tableData.nextIndex.toString());
    if (this.vutils.isEmptyString(tableConfigObject.tableData.query)) {
      tableConfigObject.tableData.query = '*';
    }
    myParams = myParams.append('q', tableConfigObject.tableData.query);
    myParams = myParams.append('sortOrder', tableConfigObject.tableData.sortOrder);
    myParams = myParams.append('sortColumn', tableConfigObject.tableData.sortBy);
    if (!this.vutils.isUndefinedOrNull(filters)) {
      filters.forEach(element => {
        myParams = myParams.append(element.filterKey, element.filterValue);
      });
    }
    let options;
    let size = this.globalService.defaultRowsPerPage;
    let pageSizeParams: HttpParams = new HttpParams();
    pageSizeParams = pageSizeParams.append('attribute', UIConstants.groupsPageSizeAttribute);
    let pageSizeOptions = { params: pageSizeParams };
    let pageSizeObj = {
      "columns": []
    };
    pageSizeObj.columns[0] = tableConfigObject.tableData.pageSize.toString();
    if (tableConfigObject.tableData.setPageSize) {
      return this.http.post(this.appContext.context + PathConstats.restAccess + PathConstats.userColumnPreferenceApi, pageSizeObj, pageSizeOptions).pipe(
        mergeMap(() => {
          return this.http.get(this.appContext.context + PathConstats.restAccess + PathConstats.userColumnPreferenceApi, pageSizeOptions).pipe(
            map(this.extractData),
            mergeMap((pageSize: any) => {
              if (pageSize.isPreferenceAvailable == "true") {
                let preferenceSize = +(pageSize.columns[0]);
                if (this.globalService.optionsRowsPerPage.indexOf(preferenceSize) >= 0) {
                  size = preferenceSize.toString();
                }
              }
              myParams = myParams.append('size', size);
              options = { params: myParams };
              return this.http.get(this.appContext.context + PathConstats.groupsApi, options).pipe(
                map((res: any) => {
                  let body = res;
                  body.pageSize = parseInt(size);
                  return body || {};
                }))
            }),)
        }),
        catchError(handleError),);
    } else {
      return this.http.get(this.appContext.context + PathConstats.restAccess + PathConstats.userColumnPreferenceApi, pageSizeOptions).pipe(
        map(this.extractData),
        mergeMap((pageSize: any) => {
          if (pageSize.isPreferenceAvailable == "true") {
            let preferenceSize = +(pageSize.columns[0]);
            if (this.globalService.optionsRowsPerPage.indexOf(preferenceSize) >= 0) {
              size = preferenceSize.toString();
            }
          }
          myParams = myParams.append('size', size);
          options = { params: myParams };
          return this.http.get(this.appContext.context + PathConstats.groupsApi, options).pipe(
            map((res: any) => {
              let body = res;
              body.pageSize = parseInt(size);
              return body || {};
            }))
        }),
        catchError(handleError),);
    }
  }

  createGroup(payload){
    return this.http.post(this.appContext.context + PathConstats.groupsApi, payload).pipe(
      map(this.extractData),
      catchError(handleErrorReason),);
  }

  updateGroup(payload){
    return this.http.put(this.appContext.context + PathConstats.groupsApi, payload).pipe(
      map(this.extractData));
  }

  deleteGroups(payload) {
    // let myParams = new URLSearchParams();
    // myParams.append('dn', payload.dn);
    // let options = new RequestOptions({ params: myParams });
    return this.http.delete(this.appContext.context + PathConstats.groupsApi + '/' + payload.dn).pipe(
      map(this.extractData));
  }

  setData(data) {
    this.selectedGroup = data;
  }

  getData() {
    let temp = this.selectedGroup;
    this.clearData();
    return temp;
  }

  clearData() {
    this.selectedGroup = undefined;
  }

  getGroupMembers(tableConfigObject: TableConfigObject, filters, groupDn): Observable<any> {
    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('nextIndex', tableConfigObject.tableData.nextIndex.toString());
    if (this.vutils.isEmptyString(tableConfigObject.tableData.query)) {
      tableConfigObject.tableData.query = '*';
    }
    myParams = myParams.append('q', tableConfigObject.tableData.query);
    myParams = myParams.append('sortOrder', tableConfigObject.tableData.sortOrder);
    myParams = myParams.append('sortColumn', tableConfigObject.tableData.sortBy);
    if (!this.vutils.isUndefinedOrNull(filters)) {
      filters.forEach(element => {
        myParams = myParams.append(element.filterKey, element.filterValue);
      });
    }
    let options;
    let size = this.globalService.defaultRowsPerPage;
    let pageSizeParams: HttpParams = new HttpParams();
    pageSizeParams = pageSizeParams.append('attribute', UIConstants.groupMembersPageSizeAttribute);
    let pageSizeOptions = { params: pageSizeParams };
    let pageSizeObj = {
      "columns": []
    };
    pageSizeObj.columns[0] = tableConfigObject.tableData.pageSize.toString();
    if (tableConfigObject.tableData.setPageSize) {
      return this.http.post(this.appContext.context + PathConstats.restAccess + PathConstats.userColumnPreferenceApi, pageSizeObj, pageSizeOptions).pipe(
        mergeMap(() => {
          return this.http.get(this.appContext.context + PathConstats.restAccess + PathConstats.userColumnPreferenceApi, pageSizeOptions).pipe(
            mergeMap((pageSize: any) => {
              if (pageSize.isPreferenceAvailable == "true") {
                let preferenceSize = +(pageSize.columns[0]);
                if (this.globalService.optionsRowsPerPage.indexOf(preferenceSize) >= 0) {
                  size = preferenceSize.toString();
                }
              }
              myParams = myParams.append('size', size);
              options = { params: myParams };
              return this.http.post(this.appContext.context + PathConstats.groupMembersApi, groupDn, options).pipe(
                map((res: any) => {
                  let body = res;
                  body.pageSize = parseInt(size);
                  return body || {};
                }))
            }))
        }),
        catchError(handleError),);
    } else {
      return this.http.get(this.appContext.context + PathConstats.restAccess + PathConstats.userColumnPreferenceApi, pageSizeOptions).pipe(
        map(this.extractData),
        mergeMap((pageSize: any) => {
          if (pageSize.isPreferenceAvailable == "true") {
            let preferenceSize = +(pageSize.columns[0]);
            if (this.globalService.optionsRowsPerPage.indexOf(preferenceSize) >= 0) {
              size = preferenceSize.toString();
            }
          }
          myParams = myParams.append('size', size);
          options = { params: myParams };
          return this.http.post(this.appContext.context + PathConstats.groupMembersApi, groupDn, options).pipe(
            map((res: any) => {
              let body = res;
              body.pageSize = parseInt(size);
              return body || {};
            }))
        }),
        catchError(handleError),);
    }
  }

  getGroupsCount(): Observable<any> {
    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('searchCount', 'true');
    let options;  
    options = { params: myParams };
    return this.http.get(this.appContext.context + PathConstats.groupsApi, options).pipe(
            map((res: any) => {
              let body = res;
              return body || {};
            }))
      
    
  }

}
