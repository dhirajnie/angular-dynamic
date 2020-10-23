
import {catchError, map, mergeMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppContextService } from "../../context/app-context.service";
import { HttpClient, HttpResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from "rxjs";
import { PathConstats } from "../../../constants/path-constants";
import { handleError } from "../../../factories/handle-error.factory";
import { TableConfigObject } from "../../../schemas/table-config-schema";
import { UIConstants } from "../../../constants/ui-constants";
import { Context } from "../../../schemas/app-context-schema";
import { GlobalService } from '../../global/global.service';

@Injectable()
export class DelegationListService {
  appContext: Context;

  constructor(private http: HttpClient,
              private appContextService: AppContextService,
              private globalService: GlobalService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res: Response) {
    let body = res;

    return body || {};
  }

  getDelegations(tableConfigObject: TableConfigObject, filters: any[]): Observable<any> {

    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('nextIndex', tableConfigObject.tableData.nextIndex.toString());
    //  myParams.append('roleLevel', tableConfigObject.tableData.roleLevel.toString());
    myParams = myParams.append('q', tableConfigObject.tableData.query);
    myParams = myParams.append('sortOrder', tableConfigObject.tableData.sortOrder);
    myParams = myParams.append('sortBy', tableConfigObject.tableData.sortBy);
    let options;
    let size = this.globalService.defaultRowsPerPage;
    // if pagination disabled do not call prfrences apis
    if (tableConfigObject.tableData.disablePagination) {
      myParams = myParams.append('size', size);
      options = {  params: myParams };
      return this.http.get(this.appContext.context + PathConstats.delegationListApi, options).pipe(
        map((res: any) => {
          let body = res;
          body.pageSize = parseInt(size);
          return body || {};
        }))
    } else {
      let pageSizeParams: HttpParams = new HttpParams();
      pageSizeParams = pageSizeParams.append('attribute', UIConstants.rolesPageSizeAttribute);
      let pageSizeOptions = {  params: pageSizeParams };
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
                  if(this.globalService.optionsRowsPerPage.indexOf(preferenceSize) >= 0){
                    size = preferenceSize.toString();
                  }
                }
                myParams = myParams.append('size', size);
                options = {  params: myParams };
                return this.http.get(this.appContext.context + PathConstats.delegationListApi, options).pipe(
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
              if(this.globalService.optionsRowsPerPage.indexOf(preferenceSize) >= 0){
                size = preferenceSize.toString();
              }
            }
            myParams = myParams.append('size', size);
            options = {  params: myParams };
            return this.http.get(this.appContext.context + PathConstats.delegationListApi, options).pipe(
              map((res: any) => {
                let body = res;
                body.pageSize = parseInt(size);
                return body || {};
              }))
          }),
          catchError(handleError),);
      }
    }
  }


  getUserDelegations(tableConfigObject: TableConfigObject, filters: any[], userDN: any): Observable<any> {

    let myParams: HttpParams = new HttpParams();
    let options;
    let size = this.globalService.defaultRowsPerPage;
    // if pagination disabled do not call prfrences apis
    if (tableConfigObject.tableData.disablePagination) {
      myParams = myParams.append('size', size);
      options = { params:myParams};
      return this.http.post(this.appContext.context + PathConstats.userDelegationListApi, userDN, options).pipe(
        map((res: any) => {
          let body = res;
          body.pageSize = parseInt(size);
          return body || {};
        }))
    }
    else {
      let pageSizeParams: HttpParams = new HttpParams();
      pageSizeParams = pageSizeParams.append('attribute', UIConstants.rolesPageSizeAttribute);
      let pageSizeOptions = { params: pageSizeParams };
      let pageSizeObj = {
        "columns": []
      };
      if (tableConfigObject.tableData.pageSize == undefined || tableConfigObject.tableData.pageSize == null) {
        tableConfigObject.tableData.pageSize = this.globalService.defaultRowsPerPage;
      }
      pageSizeObj.columns[0] = tableConfigObject.tableData.pageSize.toString();
      if (tableConfigObject.tableData.setPageSize) {
        return this.http.post(this.appContext.context + PathConstats.restAccess + PathConstats.userColumnPreferenceApi, pageSizeObj, pageSizeOptions).pipe(
          mergeMap(() => {
            return this.http.get(this.appContext.context + PathConstats.restAccess + PathConstats.userColumnPreferenceApi, pageSizeOptions).pipe(
              map(this.extractData),
              mergeMap((pageSize: any) => {
                if (pageSize.isPreferenceAvailable == "true") {
                  let preferenceSize = +(pageSize.columns[0]);
                  if(this.globalService.optionsRowsPerPage.indexOf(preferenceSize) >= 0){
                    size = preferenceSize.toString();
                  }
                }
                myParams = myParams.append('size', size);
                options = {  params: myParams };
                return this.http.post(this.appContext.context + PathConstats.userDelegationListApi, userDN, options).pipe(
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
              if(this.globalService.optionsRowsPerPage.indexOf(preferenceSize) >= 0){
                size = preferenceSize.toString();
              }
            }
            myParams = myParams.append('size', size);
            options = { params: myParams };
            return this.http.post(this.appContext.context + PathConstats.userDelegationListApi, userDN, options).pipe(
              map((res: any) => {
                let body = res;
                body.pageSize = parseInt(size);
                return body || {};
              }))
          }),
          catchError(handleError),);
      }
    }
  }

}
