
import {of as observableOf, forkJoin as observableForkJoin,  Observable } from 'rxjs';

import {catchError, map, mergeMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppContextService } from "../context/app-context.service";
import { HttpClient, HttpResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { PathConstats } from "../../constants/path-constants";
import { TableConfigObject } from "../../schemas/table-config-schema";
import { UIConstants } from "../../constants/ui-constants";
import { VariableService } from "../utilities/util_variable/variable.service";
import { handleError, handleErrorReason } from "../../factories/handle-error.factory";
import { Context } from "../../schemas/app-context-schema";
import { TranslateService } from "../translate/translate.service";
import { GlobalService } from '../../services/global/global.service';


@Injectable()
export class SodsListService {

  appContext: Context;

  constructor(private http: HttpClient, private appContextService: AppContextService,
    private variableService: VariableService, private translate: TranslateService,
    private globalService: GlobalService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  private extractDataForSelectEntitiesWidget(res: any) {
    let body = res;
    if(body != undefined && body.sods != undefined && body.sods.length != 0) {
      for( let i=0;i<body.sods.length;++i) {
        body.sods[i].type = "sod";
      }
    }
    return body || {};
  }

  getSodsList(tableConfigObject: TableConfigObject, selectedRole: any = null): Observable<any> {
    let filters: any[] = null;

    let myParams: HttpParams = new HttpParams()
    myParams = myParams.set('nextIndex', tableConfigObject.tableData.nextIndex.toString());
    myParams = myParams.set('q', tableConfigObject.tableData.query);
    myParams = myParams.set('sortOrder', tableConfigObject.tableData.sortOrder);
    myParams = myParams.set('sortBy', tableConfigObject.tableData.sortBy);

    let options;
    let size = this.globalService.defaultRowsPerPage;

    let pageSizeParams: HttpParams = new HttpParams();
    pageSizeParams = pageSizeParams.append('attribute', UIConstants.sodsList);
    const pageSizeOptions = { 
       params: pageSizeParams 
    };

    let pageSizeObj = {
      "columns": []
    };
    if (selectedRole != undefined || selectedRole != null) {
      selectedRole = { "id": selectedRole.id };
      selectedRole = {roles : [selectedRole]};
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
              myParams = myParams.set('size', size);
              options = { params: myParams };
              if (selectedRole != null) {
                return this.http.post(this.appContext.context + PathConstats.roleSodsList, selectedRole, options).pipe(
                  map((res: any) => {
                    let body = res;
                    body.pageSize = parseInt(size);
                    return body || {};
                  }))
              } else {
                return this.http.get(this.appContext.context + PathConstats.sodsList, options).pipe(
                  map((res: any) => {
                    let body = res;
                    body.pageSize = parseInt(size);
                    return body || {};
                  }))
              }
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
          myParams = myParams.set('size', size);
          options = { params: myParams };
          if (selectedRole != null) {
            return this.http.post(this.appContext.context + PathConstats.roleSodsList, selectedRole, options).pipe(
              map((res: any) => {
                let body = res;
                body.pageSize = parseInt(size);
                return body || {};
              }))
          } else {
            return this.http.get(this.appContext.context + PathConstats.sodsList, options).pipe(
              map((res: any) => {
                let body = res;
                body.pageSize = parseInt(size);
                return body || {};
              }))
          }
        }),
        catchError(handleError),);
    }
  }

  getSodsListNormal(query, nextIndex, paginationSize): Observable<any> {
    if (query == undefined || query == null || query == "") {
      query = "*";
    }

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
    params = params.set('column', 'name');
    const requestOptions = {
      params: params
    };
    return this.http.get(this.appContext.context + PathConstats.sodsList, requestOptions).pipe(
      map(this.extractDataForSelectEntitiesWidget),
      catchError(handleError),);
  }

  getSodsListColumnCustomization(): Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.restAccess + PathConstats.sodsListColumnCustomization, {}).pipe(
      map(this.extractData),
      catchError(handleError),);
  }
  restoreSodsListColumnCustomization(): Observable<any> {
    return this.http.delete(this.appContext.context + PathConstats.restAccess + PathConstats.sodsListColumnCustomization).pipe(
      map(this.extractData),
      catchError(handleError),);
  }
  getSodsListColumnCustomization_AvalibleColumns(): Observable<any> {
    return observableForkJoin(this.getSodsListColumnCustomization(), this.getAvalibleColumnsSodsList());
  }
  setSodsListColumnCustomization(selectedColumns): Observable<any> {
    selectedColumns = JSON.stringify(selectedColumns);
    return this.http.post(this.appContext.context + PathConstats.restAccess + PathConstats.sodsListColumnCustomization, selectedColumns).pipe(
      catchError(handleError));
  }

  // Sods List - Column Customization
  getAvalibleColumnsSodsList() :  Observable<any> {
    let value = {
      "attributesList": [
        {
          "key": "name",
          "displayLabel": this.translate.get("Name"),
          "dataType": "LocalizedString",
          "isClickable": true,
          "isSortable": true,
        },
        {
          "key": "roles",
          "displayLabel": this.translate.get("Conflicting Roles"),
          "dataType": "LocalizedString",
          "isClickable": false,
          "isSortable": false,
        },
        {
          "key": "roleLevel",
          "displayLabel": this.translate.get("Role Level"),
          "dataType": "LocalizedString",
          "isSortable": true,
          "isClickable": false,
        },
        {
          "key": "description",
          "displayLabel": this.translate.get("Description"),
          "dataType": "LocalizedString",
          "isSortable": true,
          "isClickable": false,
        }
      ]
    };
    return observableOf(value);;
  }
}
