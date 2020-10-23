
import {of as observableOf, forkJoin as observableForkJoin,  Observable } from 'rxjs';

import {map, catchError, mergeMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest, HttpParams } from "@angular/common/http";
import { PathConstats } from "../../../constants/path-constants";
import { AppContextService } from "../../context/app-context.service";
import { Context } from "../../../schemas/app-context-schema";
import { handleError } from "../../../factories/handle-error.factory";
import { Resource } from "../../../schemas/resource-schema";
import { Cprs } from '../../../schemas/cprs-schema';
import { UIConstants } from "../../../constants/ui-constants";
import {VariableService} from "../../utilities/util_variable/variable.service";
import { TableConfigObject } from "../../../schemas/table-config-schema";
import { TranslateService } from '../../translate/translate.service';
import { GlobalService } from '../../global/global.service';

@Injectable()
export class CprsResourcesService {

  appContext: Context;
  selectedEntitlementValueIds: any = [];
  size: any;

  constructor(
    private http: HttpClient,
    private appContextService: AppContextService,
    private vutils:VariableService,
    private translate:TranslateService,
    private globalService: GlobalService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractdriverResourcesData(res: any) {
    let body = res;
    if (body != undefined && body != null && body.resources != undefined && body.resources != null && body.resources.length != undefined) {
        for (let i = 0; i < body.resources.length; ++i) {
          if (body.resources[i] != undefined) {
            body.resources[i].type = "resource";
          }
        }
    }
    return body || {};
  }

  private extractData(res: Response) {
    let body = res;

    return body || {};
  }

  getDriverResourceList(resource: Resource, query: string, nextIndex: number, paginationSize: number, resType: boolean, entlmntId: string, logicalId: string, managedBy?: boolean): Observable<any> {

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
        if (entlmntId != undefined && entlmntId != null && entlmntId != "") {
          params = params.set('entitlementId', entlmntId);
        };
        if (resType != undefined && resType) {
          params = params.set('resourceType', 'dynamic');
        };
        if (resType != undefined && !resType) {
          params = params.set('resourceType', 'static');
        };
        if (logicalId != undefined && logicalId != null && logicalId != "") {
          params = params.set('logicalSystem', logicalId);
        };
        if (managedBy != undefined && managedBy) {
          params = params.set('managedBy', 'true');
        }
        let requestOptions = {
          params: params
        };
        return this.http.post(this.appContext.context + PathConstats.driverResourcesListApi, resource, requestOptions).pipe(
          map(this.extractdriverResourcesData),
          catchError(handleError));
      }

  getCprsAssignmentsList(tableConfigObject: TableConfigObject,cprs: Cprs,filter:any,src:string):  Observable<any> {
    let filters:any[]=null;
    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('nextIndex', tableConfigObject.tableData.nextIndex.toString());
    myParams = myParams.append('q',tableConfigObject.tableData.query);
    myParams = myParams.append('sortOrder', tableConfigObject.tableData.sortOrder);
    myParams = myParams.append('sortBy', tableConfigObject.tableData.sortBy);
    myParams = myParams.append('source', src);
    let options;
    let size = this.globalService.defaultRowsPerPage;
    let pageSizeParams: HttpParams = new HttpParams();
    pageSizeParams = pageSizeParams.append('attribute', UIConstants.cprsAssignmentList);
    let pageSizeOptions = {  params: pageSizeParams };
    let pageSizeObj = {
      "columns" : []
    };
    if(!this.vutils.isUndefinedOrNull(filter) && !this.vutils.isUndefinedOrNull(cprs)){
      cprs.entitlementValues = this.extractEntitlementValues(filter);
    }

    pageSizeObj.columns[0] = tableConfigObject.tableData.pageSize.toString();
    if(tableConfigObject.tableData.setPageSize) {
      return this.http.post(this.appContext.context +PathConstats.restAccess + PathConstats.userColumnPreferenceApi, pageSizeObj,  pageSizeOptions).pipe(
        mergeMap(() => {
          return this.http.get(this.appContext.context +PathConstats.restAccess + PathConstats.userColumnPreferenceApi, pageSizeOptions).pipe(
            mergeMap((pageSize : any) => {
              if(pageSize.isPreferenceAvailable == "true") {
                let preferenceSize = +(pageSize.columns[0]);
                if(this.globalService.optionsRowsPerPage.indexOf(preferenceSize) >= 0){
                  size = preferenceSize.toString();
                }
              }
              myParams = myParams.append('size',size);
              options = {  params: myParams };
              return this.http.post(this.appContext.context + PathConstats.cprsAssignments,cprs,options).pipe(
              map((res: any) => {
                let body = res;
                body.pageSize = parseInt(size);
                return body || {};
              }))
            }))
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

          return this.http.post(this.appContext.context + PathConstats.cprsAssignments,cprs,options).pipe(
          map((res: any) => {
            let body = res;
            body.pageSize = parseInt(size);
            return body || {};
          }))
        }),
        catchError(handleError),);
    }
  }

  private extractEntitlementValues(filterData:any) {
    this.selectedEntitlementValueIds = [];
    for (let i = 0; i < filterData.length; i++) {
      this.selectedEntitlementValueIds.push({ id: filterData[i].value });
    }
    return this.selectedEntitlementValueIds;
  }

  getCPRSAssingmentsColumnCustomization_AvalibleColumns() :Observable<any>{
    return observableForkJoin(this.getCPRSAssingmentsColumnCustomization(),this.getAvalibleColumnsCPRSAssingments());
  }

  restoreCPRSAssingmentsColumnCustomization():  Observable<any> {
    return this.http.delete(this.appContext.context + PathConstats.restAccess + PathConstats.cprsAssingmentsListColumnCustomization).pipe(
      map(this.extractData),
      catchError(handleError),);
  }

  getCPRSAssingmentsColumnCustomization():  Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.restAccess + PathConstats.cprsAssingmentsListColumnCustomization, {}).pipe(
      map(this.extractData),
      catchError(handleError),);
  }

  setCPRSAssingmentsColumnCustomization(selectedColumns):  Observable<any> {
    selectedColumns=JSON.stringify(selectedColumns);
    return this.http.post(this.appContext.context + PathConstats.restAccess + PathConstats.cprsAssingmentsListColumnCustomization,selectedColumns).pipe(
      catchError(handleError));
  }

    // CPRS Assingnment

    getAvalibleColumnsCPRSAssingments():  Observable<any> {
      let value={
        "attributesList": [
          {
            "key": "firstName",
            "displayLabel": this.translate.get("First Name"),
            "dataType": "LocalizedString",
            "isSearchable": true,
            "isSortable": true,
            "isRequired": false,
            "isEditable": true,
            "isMultivalued": true,
            "formatType": " "
          },
          {
            "key": "lastName",
            "displayLabel": this.translate.get("Last Name"),
            "dataType": "LocalizedString",
            "isSearchable": true,
            "isSortable": true,
            "isRequired": false,
            "isEditable": true,
            "isMultivalued": true,
            "formatType": " "
          },
          {
            "key": "entName",
            "displayLabel":this.translate.get( "Entitlement"),
            "dataType": "LocalizedString",
            "isSearchable": true,
            "isSortable": true,
            "isRequired": false,
            "isEditable": true,
            "isMultivalued": false,
            "formatType": " "
          },
          {
            "key": "entVal",
            "displayLabel":this.translate.get( "Permission"),
            "dataType": "LocalizedString",
            "isSearchable": true,
            "isSortable": false,
            "isRequired": false,
            "isEditable": true,
            "isMultivalued": false,
            "formatType": " "
          },
          {
            "key": "type",
            "displayLabel":this.translate.get( "Type"),
            "dataType": "LocalizedString",
            "isSearchable": true,
            "isSortable": true,
            "isRequired": false,
            "isEditable": true,
            "isMultivalued": false,
            "formatType": " "
          }
        ]
      };
      return observableOf(value);
    }

    getCprsSettingsList(tableConfigObject: TableConfigObject):  Observable<any> {
      let filters:any[]=null;
      let myParams: HttpParams = new HttpParams();
      myParams = myParams.append('nextIndex', tableConfigObject.tableData.nextIndex.toString());
      myParams = myParams.append('q',tableConfigObject.tableData.query);
      myParams = myParams.append('sortOrder', tableConfigObject.tableData.sortOrder);
      myParams = myParams.append('sortBy', tableConfigObject.tableData.sortBy);
      let options;
      let size = this.globalService.defaultRowsPerPage;
      let pageSizeParams: HttpParams = new HttpParams();
      pageSizeParams = pageSizeParams.append('attribute', UIConstants.cprsSettingsList);
      let pageSizeOptions = {  params: pageSizeParams };
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
                return this.http.get(this.appContext.context + PathConstats.cprsSettings,options).pipe(
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
            options = { params: myParams };

            return this.http.get(this.appContext.context + PathConstats.cprsSettings,options).pipe(
            map((res: any) => {
              let body = res;
              body.pageSize = parseInt(size);
              return body || {};
            }))
          }),
          catchError(handleError),);
      }
    }

    getCPRSSettingsColumnCustomization_AvalibleColumns() :Observable<any>{
      return observableForkJoin(this.getCPRSSettingsColumnCustomization(),this.getAvalibleColumnsCPRSSettings());
    }

    restoreCPRSSettingsColumnCustomization():  Observable<any> {
      return this.http.delete(this.appContext.context + PathConstats.restAccess + PathConstats.cprsSettingsListColumnCustomization).pipe(
        map(this.extractData),
        catchError(handleError),);
    }

    getCPRSSettingsColumnCustomization():  Observable<any> {
      return this.http.get(this.appContext.context + PathConstats.restAccess + PathConstats.cprsSettingsListColumnCustomization, {}).pipe(
        map(this.extractData),
        catchError(handleError),);
    }

    setCPRSSettingsColumnCustomization(selectedColumns):  Observable<any> {
      selectedColumns=JSON.stringify(selectedColumns);
      return this.http.post(this.appContext.context + PathConstats.restAccess + PathConstats.cprsSettingsListColumnCustomization,selectedColumns).pipe(
        catchError(handleError));
    }

      // CPRS Assingnment

      getAvalibleColumnsCPRSSettings():  Observable<any> {
        let value={
          "attributesList": [
            {
              "key": "drivername",
              "displayLabel": this.translate.get("Driver Name"),
              "dataType": "LocalizedString",
              "isSearchable": true,
              "isSortable": true,
              "isRequired": false,
              "isEditable": true,
              "isMultivalued": true,
              "formatType": " "
            },
            {
              "key": "logicalsystem",
              "displayLabel":this.translate.get( "Logical System"),
              "dataType": "LocalizedString",
              "isSearchable": true,
              "isSortable": true,
              "isRequired": false,
              "isEditable": true,
              "isMultivalued": false,
              "formatType": " "
            },
            {
              "key": "entitlement",
              "displayLabel":this.translate.get( "Entitlement"),
              "dataType": "LocalizedString",
              "isSearchable": true,
              "isSortable": true,
              "isRequired": false,
              "isEditable": true,
              "isMultivalued": false,
              "formatType": " "
            },
            {
              "key": "entitlementvalue",
              "displayLabel":this.translate.get( "Permission"),
              "dataType": "LocalizedString",
              "isSearchable": true,
              "isSortable": false,
              "isRequired": false,
              "isEditable": true,
              "isMultivalued": false,
              "formatType": " "
            },
            {
              "key": "resource",
              "displayLabel":this.translate.get( "Resource Name"),
              "dataType": "LocalizedString",
              "isSearchable": true,
              "isSortable": true,
              "isRequired": false,
              "isEditable": true,
              "isMultivalued": false,
              "formatType": " "
            }
          ]
        };
        return observableOf(value);
      }


      getCprsProcessStatusList(tableConfigObject: TableConfigObject,cprs: Cprs):  Observable<any> {
        let filters:any[]=null;
        let myParams = new HttpParams();
        myParams = myParams.append('nextIndex', tableConfigObject.tableData.nextIndex.toString());
        //myParams.append('q',tableConfigObject.tableData.query);
        myParams = myParams.append('sortOrder', tableConfigObject.tableData.sortOrder);
        myParams = myParams.append('sortBy', tableConfigObject.tableData.sortBy);
        let options;
        let size = this.globalService.defaultRowsPerPage;
        let pageSizeParams: HttpParams = new HttpParams();
        pageSizeParams = pageSizeParams.append('attribute', UIConstants.cprsProcessStatusList);
        let pageSizeOptions = {  params: pageSizeParams };
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
                  options = {  params: myParams };
                  return this.http.post(this.appContext.context + PathConstats.cprsProcessStatusList,cprs,options).pipe(
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
              options = { params: myParams };

              return this.http.post(this.appContext.context + PathConstats.cprsProcessStatusList,cprs,options).pipe(
              map((res: any) => {
                let body = res;
                body.pageSize = parseInt(size);
                return body || {};
              }))
            }),
            catchError(handleError),);
        }
      }

      getCPRSProcessStatusColumnCustomization_AvalibleColumns() :Observable<any>{
        return observableForkJoin(this.getCPRSProcessStatusColumnCustomization(),this.getAvalibleColumnsCPRSProcessStatus());
      }

      restoreCPRSProcessStatusColumnCustomization():  Observable<any> {
        return this.http.delete(this.appContext.context + PathConstats.restAccess + PathConstats.cprsProcessStatusListColumnCustomization).pipe(
          map(this.extractData),
          catchError(handleError),);
      }

      getCPRSProcessStatusColumnCustomization():  Observable<any> {
        return this.http.get(this.appContext.context + PathConstats.restAccess + PathConstats.cprsProcessStatusListColumnCustomization, {}).pipe(
          map(this.extractData),
          catchError(handleError),);
      }

      setCPRSProcessStatusColumnCustomization(selectedColumns):  Observable<any> {
        selectedColumns=JSON.stringify(selectedColumns);
        return this.http.post(this.appContext.context + PathConstats.restAccess + PathConstats.cprsProcessStatusListColumnCustomization,selectedColumns).pipe(
          catchError(handleError));
      }

        // CPRS Assingnment

        getAvalibleColumnsCPRSProcessStatus():  Observable<any> {
          let value={
            "attributesList": [
              {
                "key": "opType",
                "displayLabel": this.translate.get("Process Type"),
                "dataType": "LocalizedString",
                "isSearchable": true,
                "isSortable": true,
                "isRequired": false,
                "isEditable": true,
                "isMultivalued": false,
                "formatType": " "
              },
              {
                "key": "requestStartTime",
                "displayLabel":this.translate.get( "Start Time"),
                "dataType": "LocalizedString",
                "isSearchable": true,
                "isSortable": true,
                "isRequired": false,
                "isEditable": true,
                "isMultivalued": false,
                "formatType": " "
              },
              {
                "key": "requestCompletionTime",
                "displayLabel":this.translate.get( "Completion Time"),
                "dataType": "LocalizedString",
                "isSearchable": true,
                "isSortable": true,
                "isRequired": false,
                "isEditable": true,
                "isMultivalued": false,
                "formatType": " "
              },
              {
                "key": "opStatus",
                "displayLabel":this.translate.get( "Status"),
                "dataType": "LocalizedString",
                "isSearchable": true,
                "isSortable": true,
                "isRequired": false,
                "isEditable": true,
                "isMultivalued": false,
                "formatType": " "
              },
              {
                "key": "statusMessage",
                "displayLabel": this.translate.get("Message"),
                "dataType": "LocalizedString",
                "isSearchable": true,
                "isSortable": true,
                "isRequired": false,
                "isEditable": true,
                "isMultivalued": false,
                "formatType": " "
              }
            ]
          };
          return observableOf(value);
        }

}
