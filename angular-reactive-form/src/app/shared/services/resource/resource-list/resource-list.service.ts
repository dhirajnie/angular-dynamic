
import {of as observableOf, forkJoin as observableForkJoin,  Observable } from 'rxjs';

import {map, catchError, mergeMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppContextService } from "../../context/app-context.service";
import { HttpClient, HttpResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Context } from "../../../schemas/app-context-schema";
import { PathConstats } from "../../../constants/path-constants";
import { TableConfigObject } from "../../../schemas/table-config-schema";
import { UIConstants } from "../../../constants/ui-constants";
import { VariableService } from "../../utilities/util_variable/variable.service";
import { handleError, handleErrorReason } from "../../../factories/handle-error.factory";
import { TranslateService } from '../../translate/translate.service';
import { GlobalService } from '../../global/global.service';

@Injectable()
export class ResourceListService {
  appContext: Context;

  constructor(private http: HttpClient, private appContextService: AppContextService,
    private variableService: VariableService,
    private translate:TranslateService,
    private globalService: GlobalService
  ) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res) {
    let body = res;
    return body || {};
  }

  /**
   *
   *
   * @param {TableConfigObject} tableConfigObject
   * @returns {Observable <any>}
   *
   * @memberOf ResourceListService
   */

  getResources(tableConfigObject: TableConfigObject,filters:any[]): Observable<any> {
    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('nextIndex', tableConfigObject.tableData.nextIndex.toString());
    if (this.variableService.isEmptyString(tableConfigObject.tableData.query)) {
      tableConfigObject.tableData.query = '*';
    }
    myParams = myParams.append('q', tableConfigObject.tableData.query);
    myParams = myParams.append('sortOrder', tableConfigObject.tableData.sortOrder);
    myParams = myParams.append('sortBy', tableConfigObject.tableData.sortBy);

    if(!this.variableService.isUndefinedOrNull(tableConfigObject.columns) && !this.variableService.isEmptyArray(tableConfigObject.columns)) {
      for (let column of tableConfigObject.columns) {
        myParams = myParams.append('column',column);
      }
    }
    if (filters) {
      filters.forEach(element => {
        if (element.type == 'category') {
          myParams = myParams.append('categoryKeys', element.id);
        }
        if(element.type =='name' || element.type == 'desc') {
          myParams = myParams.append(element.type, element.value);
        }
      });
    }
    //myParams.append('column','entitlements');
    let options;
    let size =this.globalService.defaultRowsPerPage;
    let pageSizeParams: HttpParams = new HttpParams();
    pageSizeParams = pageSizeParams.append('attribute', UIConstants.resourcesPageSizeAttribute);
    let pageSizeOptions = { params: pageSizeParams };
    let pageSizeObj = {
      "columns" : []
    };
    pageSizeObj.columns[0] = tableConfigObject.tableData.pageSize.toString();
    if(tableConfigObject.tableData.setPageSize) {
      return this.http.post(this.appContext.context +PathConstats.restAccess + PathConstats.userColumnPreferenceApi, pageSizeObj,  pageSizeOptions).pipe(
      mergeMap(() => {
         return this.http.get(this.appContext.context +PathConstats.restAccess + PathConstats.userColumnPreferenceApi, pageSizeOptions).pipe(
            map(this.extractData),
            mergeMap((pageSize : any) => {
              if(pageSize.isPreferenceAvailable == "true") {
                let preferenceSize = +(pageSize.columns[0]);
                if(this.globalService.optionsRowsPerPage.indexOf(preferenceSize) >= 0){
                  size = preferenceSize.toString();
                }
              }
              myParams = myParams.append('size',size);
              options = {params: myParams };
              return this.http.get(this.appContext.context + PathConstats.resourcesList, options).pipe(
                map((res: any) => {
                  let body = res;
                  body.pageSize = parseInt(size);
                  return body || {};
                }))
            }),)
    }),
    catchError(handleError),);
    } else {
      return this.http.get(this.appContext.context +PathConstats.restAccess + PathConstats.userColumnPreferenceApi, pageSizeOptions).pipe(
      map(this.extractData),
      mergeMap((pageSize : any) => {
        if(pageSize.isPreferenceAvailable == "true") {
          let preferenceSize = +(pageSize.columns[0]);
          if(this.globalService.optionsRowsPerPage.indexOf(preferenceSize) >= 0){
            size = preferenceSize.toString();
          }
        }
        myParams = myParams.append('size',size);
        //console.log(myParams);
        options = { params: myParams };
        return this.http.get(this.appContext.context + PathConstats.resourcesList, options).pipe(
          map((res: any) => {
            let body = res;
            body.pageSize = parseInt(size);
            return body || {};
          }))
      }),
      catchError(handleError),);
    }
  }

  getColumnCustomization():  Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.restAccess + PathConstats.columnCustomizationresourcesApi, {}).pipe(
      map(this.extractData),
      catchError(handleError),);
  }
  restoreColumnCustomization():  Observable<any> {
    return this.http.delete(this.appContext.context + PathConstats.restAccess + PathConstats.columnCustomizationresourcesApi).pipe(
      catchError(handleError));
  }
  getColumnCustomization_AvalibleColumns() :Observable<any>{
     return observableForkJoin(this.getColumnCustomization(),this.getAvalibleColumns());
  }
  setColumnCustomization(selectedColumns):  Observable<any> {
    selectedColumns=JSON.stringify(selectedColumns);
    return this.http.post(this.appContext.context + PathConstats.restAccess + PathConstats.columnCustomizationresourcesApi,selectedColumns).pipe(
      catchError(handleError));
  }
  getAvalibleColumns():  Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.sysNrfResources).pipe(
      map(this.extractData),
      catchError(handleError),);
  }

  // Resource Assingnment

  getAvalibleColumnsResourceAssingments(resourceDn:any):  Observable<any> {

    return this.http.post(this.appContext.context + PathConstats.resourceAssignmentColumns, {dn:resourceDn}).pipe(
      map(this.extractData),
      catchError(handleError),);

  }
  getResourceAssingmentsColumnCustomization():  Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.restAccess + PathConstats.resourceAssingmentsListColumnCustomization, {}).pipe(
      map(this.extractData),
      catchError(handleError),);
  }
  restoreResourceAssingmentsColumnCustomization():  Observable<any> {
    return this.http.delete(this.appContext.context + PathConstats.restAccess + PathConstats.resourceAssingmentsListColumnCustomization).pipe(
      catchError(handleError));
  }
  getResourceAssingmentsColumnCustomization_AvalibleColumns(resourceDn) :Observable<any>{
    return observableForkJoin(this.getResourceAssingmentsColumnCustomization(),this.getAvalibleColumnsResourceAssingments(resourceDn));
  }
  setResourceAssingmentsColumnCustomization(selectedColumns):  Observable<any> {
    selectedColumns=JSON.stringify(selectedColumns);
    return this.http.post(this.appContext.context + PathConstats.restAccess + PathConstats.resourceAssingmentsListColumnCustomization,selectedColumns).pipe(
      catchError(handleError));
  }

  getPermResources(query='*', pageSize=10, nextIndex=1, fetchResourceParams=false, fetchEntitlements=false): Observable<any> {
    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('nextIndex', nextIndex.toString());
    myParams = myParams.append('q', query);
    myParams = myParams.append('sortOrder', 'ASC');
    myParams = myParams.append('sortBy', 'name');
    myParams = myParams.append('column','name');
    myParams = myParams.append('size',pageSize.toString());
    myParams = myParams.append('fetchResourceParams',fetchResourceParams.toString());
    myParams = myParams.append('fetchEntitlements', fetchEntitlements.toString());
    const options = {params: myParams };
    return this.http.get(this.appContext.context + PathConstats.resourcesListV2, options).pipe(
    map((res: any) => {
      let body = res;
      //body.pageSize = parseInt(arraySize);
      if (body != undefined && body != null && body.resources != undefined && body.resources != null) {
        for (let i = 0; i < body.resources.length; ++i) {
          body.resources[i].type = "resource";
        }
      }
      return body || {};
    }),
    catchError(handleError),);
  }

  getdriverResources(driverID, query='*', pageSize=10, nextIndex=1): Observable<any> {
    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('nextIndex', nextIndex.toString());
    myParams = myParams.append('q', query);
    myParams = myParams.append('sortOrder', 'ASC');
    myParams = myParams.append('sortBy', 'name');
    myParams = myParams.append('column','name');
    myParams = myParams.append('size',pageSize.toString());
    const options = { params: myParams };
    return this.http.post(this.appContext.context + PathConstats.driverResources,driverID, options).pipe(
    map((res: any) => {
      let body = res;
      //body.pageSize = parseInt(arraySize);
      return body || {};
    }))
  }

  getResourceAssingmentsGivenDN(resourceDn: string): Observable<any> {
    const selectedResource = {};
    selectedResource['dn'] = resourceDn;
    // const myParams = new URLSearchParams();
    let myParams: HttpParams = new HttpParams();
    let options;
    let size = this.globalService.defaultRowsPerPage;
    // const pageSizeParams = new URLSearchParams();
    let pageSizeParams: HttpParams = new HttpParams();
    pageSizeParams = pageSizeParams.append('attribute', UIConstants.resourceAssignmentList);
    const pageSizeOptions = { params: pageSizeParams };

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

        return this.http.post(this.appContext.context + PathConstats.resourcesAssignments, selectedResource, options).pipe(
          map((res: any) => {
            let body = res || {};
            body.pageSize = parseInt(size);
            return body;
          }))
      }),
      catchError(handleError)
      );
  }

  getResourceAssingments(tableConfigObject: TableConfigObject,selectedResource:any, filter:any):  Observable<any> {
    let filters:any[]=null;
    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('nextIndex', tableConfigObject.tableData.nextIndex.toString());
    myParams = myParams.append('q',tableConfigObject.tableData.query);
    myParams = myParams.append('sortOrder', tableConfigObject.tableData.sortOrder);
    myParams = myParams.append('sortBy', tableConfigObject.tableData.sortBy);
    let options;
    let size =this.globalService.defaultRowsPerPage;
    let pageSizeParams: HttpParams = new HttpParams();
    pageSizeParams = pageSizeParams.append('attribute', UIConstants.resourceAssignmentList);
    let pageSizeOptions = {  params: pageSizeParams };
    let pageSizeObj = {
      "columns" : []
    };
    if(this.variableService.isUndefinedOrNull(filter)){
      selectedResource={"dn": selectedResource.id};
    }
    else{
      if(!this.variableService.isUndefinedOrNull(filter.tempFilter)){
        selectedResource={"dn": selectedResource.id,"dynamicParams":filter.dynamicParams,"recipientDns": filter.tempFilter.recipientDns, "recipientType": filter.tempFilter.recipientType};
      }
      else if (!this.variableService.isUndefinedOrNull(filter.dynamicParams)){
        selectedResource={"dn": selectedResource.id,"dynamicParams":filter.dynamicParams};
      }
    }
    selectedResource=JSON.stringify(selectedResource);
    pageSizeObj.columns[0] = tableConfigObject.tableData.pageSize.toString();
    if(tableConfigObject.tableData.setPageSize) {
      return this.http.post(this.appContext.context +PathConstats.restAccess + PathConstats.userColumnPreferenceApi, pageSizeObj,  pageSizeOptions).pipe(
      mergeMap(() => {
         return this.http.get(this.appContext.context +PathConstats.restAccess + PathConstats.userColumnPreferenceApi, pageSizeOptions).pipe(
            map(this.extractData),
            mergeMap((pageSize : any) => {
              if(pageSize.isPreferenceAvailable == "true") {
                let preferenceSize = +(pageSize.columns[0]);
                if(this.globalService.optionsRowsPerPage.indexOf(preferenceSize) >= 0){
                  size = preferenceSize.toString();
                }
              }
              myParams = myParams.append('size',size);
              options = { params: myParams };
              return this.http.post(this.appContext.context + PathConstats.resourcesAssignments,selectedResource,options).pipe(
              map((res: any) => {
                  let body = res;
                  body.pageSize = parseInt(size);
                  return body || {};
                }))
            }),)
    }),
    catchError(handleError),);
    } else {
      return this.http.get(this.appContext.context +PathConstats.restAccess + PathConstats.userColumnPreferenceApi, pageSizeOptions).pipe(
      map(this.extractData),
      mergeMap((pageSize : any) => {
        if(pageSize.isPreferenceAvailable == "true") {
          let preferenceSize = +(pageSize.columns[0]);
          if(this.globalService.optionsRowsPerPage.indexOf(preferenceSize) >= 0){
            size = preferenceSize.toString();
          }
        }
        myParams = myParams.append('size',size);
        options = {  params: myParams };

        return this.http.post(this.appContext.context + PathConstats.resourcesAssignments,selectedResource,options).pipe(
          map((res: any) => {
            let body = res;
            body.pageSize = parseInt(size);
            return body || {};
          }))
      }),
      catchError(handleError),);
    }
  }

  getValues(resources: any): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.entitlementValues, resources).pipe(
      map(this.extractData),
      catchError(handleErrorReason),);
  }

  getViews(): Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.views).pipe(
      map(this.extractData),
      catchError(handleErrorReason),);
  }

  expiryDuration() {
    let duration = [
      {
        key: 'D',
        value: this.translate.get('DAYS')
      },
      {
        key: 'M',
        value: this.translate.get('MONTHS')
      },
      {
        key: 'Y',
        value: this.translate.get('YEARS')
      }
    ];
    return duration;
  }

  getAvalibleColumnsResourceRequestsStatus():  Observable<any> {
      let value = {
      "attributesList": [
        {
          "key": "recipientName",
          "displayLabel":this.translate.get( "Recipient"),
          "isSortable": true,
          "isSearchable": true,
        },
        {
          "key": "requesterName",
          "displayLabel":this.translate.get( "Requester"),
          "isSortable": true,
          "isSearchable": true,
        },
        {
          "key": "status",
          "displayLabel":this.translate.get( "Status"),
          "isSortable": false,
        },
        {
          "key": "requestDate",
          "displayLabel":this.translate.get( "Request Date"),
          "isSortable": true,
        },
        {
          "key": "action",
          "displayLabel":this.translate.get( "Request Action"),
          "isSearchable": true,
          "isSortable": true,
        },
        {
          "key": "reason",
          "displayLabel":this.translate.get( "Initial Request Description"),
          "isSearchable": true,
          "isSortable": true,
        }
      ]
    };
    return observableOf(value);
  }

  getResourceRequestsStatusColumnCustomization():  Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.restAccess + PathConstats.resourceRequestStatusColumnCustomization, {}).pipe(
      map(this.extractData),
      catchError(handleError),);
  }
  restoreResourceRequestsStatusColumnCustomization():  Observable<any> {
    return this.http.delete(this.appContext.context + PathConstats.restAccess + PathConstats.resourceRequestStatusColumnCustomization).pipe(
      catchError(handleError));
  }
  getResourceRequestsStatusColumnCustomization_AvalibleColumns() :Observable<any>{
    return observableForkJoin(this.getResourceRequestsStatusColumnCustomization(),this.getAvalibleColumnsResourceRequestsStatus());
  }
  setResourceRequestsStatusColumnCustomization(selectedColumns):  Observable<any> {
    selectedColumns=JSON.stringify(selectedColumns);
    return this.http.post(this.appContext.context + PathConstats.restAccess + PathConstats.resourceRequestStatusColumnCustomization,selectedColumns).pipe(
      catchError(handleError));
  }

  resourceRequestListArributesList() {
    let value = {
      "attributesList": [
        {
          "key": "recipientName",
          "displayLabel": this.translate.get("Recipient"),
          "isSortable": true,
          "isSearchable": true
        },
        {
          "key": "requesterName",
          "displayLabel": this.translate.get("Requester"),
          "isSortable": true
        },
        {
          "key": "status",
          "displayLabel": this.translate.get("Status"),
          "isSortable": false
        },
        {
          "key": "requestDate",
          "displayLabel": this.translate.get("Request Date"),
          "isSearchable": true,
          "isSortable": true
        },
        {
          "key": "action",
          "displayLabel": this.translate.get("Request Action"),
          "isSortable": true
        },
        {
          "key": "reason",
          "displayLabel": this.translate.get("Initial Request Description"),
          "isSearchable": true,
          "isSortable": true
        }
      ]
    };
    return value;
  }
  saveFilters(filter): Observable<any> {
    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('attribute', 'com.novell.idm.admin.resourceList-filters')
    let options = { params : myParams};
    return this.http.post(this.appContext.context + PathConstats.restAccess +  PathConstats.userColumnPreferenceApi, filter, options);
  }

  getFilters() : Observable<any> {
    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('attribute', 'com.novell.idm.admin.resourceList-filters')
    let options = { params : myParams};
    return this.http.get(this.appContext.context + PathConstats.restAccess + PathConstats.userColumnPreferenceApi, options).pipe(map(this.extractData));
  }
}
