
import {forkJoin as observableForkJoin, of as observableOf,  Observable } from 'rxjs';

import {map, catchError, mergeMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppContextService } from "../../context/app-context.service";
import { HttpClient, HttpResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Context } from "../../../schemas/app-context-schema";
import { PathConstats } from "../../../constants/path-constants";
import { handleError } from "../../../factories/handle-error.factory";
import { TableConfigObject } from "../../../schemas/table-config-schema";
import { UIConstants } from "../../../constants/ui-constants";
import {VariableService} from "../../utilities/util_variable/variable.service";
import { TranslateService } from '../../translate/translate.service';
import { GlobalService } from '../../global/global.service';


@Injectable()
export class RoleListService {
  appContext: Context;

  constructor(private http: HttpClient,
              private appContextService: AppContextService,
              private vutils:VariableService,
              private translate:TranslateService,
              private globalService: GlobalService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res: Response) {
    let body = res;

    return body || {};
  }

  /**
   *
   *
   * @param {TableConfigObject} tableConfigObject
   * @returns {Observable <any>}
   *
   * @memberOf RoleListService
   */

  getRoles(tableConfigObject: TableConfigObject,filters:any[]):  Observable<any> {

    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('nextIndex', tableConfigObject.tableData.nextIndex.toString());
    if (this.vutils.isEmptyString(tableConfigObject.tableData.query)) {
      tableConfigObject.tableData.query = '*';
    }
    myParams = myParams.append('q',tableConfigObject.tableData.query);
    myParams = myParams.append('sortOrder', tableConfigObject.tableData.sortOrder);
    myParams = myParams.append('sortBy', tableConfigObject.tableData.sortBy);
    if (filters) {
      filters.forEach(element => {
        if(element.type=='category'){
          myParams = myParams.append('categoryKeys',element.id);
        }
        if(element.type=='level'){
          myParams = myParams.append('roleLevel',element.id);
        }
        if(element.type =='name' || element.type == 'desc') {
          myParams = myParams.append(element.type, element.value);
        }

    });
    }
    let options;
    let size = this.globalService.defaultRowsPerPage;
    let pageSizeParams: HttpParams = new HttpParams();
    pageSizeParams = pageSizeParams.append('attribute', UIConstants.rolesPageSizeAttribute);
    const pageSizeOptions = { 
       params: pageSizeParams 
    };
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
              if(pageSize.isPreferenceAvailable == "true" ) {
                let preferenceSize = +(pageSize.columns[0]);
                if(this.globalService.optionsRowsPerPage.indexOf(preferenceSize) >= 0){
                  size = preferenceSize.toString();
                }
              }
              myParams = myParams.append('size',size);
              options = { params: myParams };
              return this.http.get(this.appContext.context + PathConstats.rolesList, options).pipe(
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
        return this.http.get(this.appContext.context + PathConstats.rolesList, options).pipe(
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
    return this.http.get(this.appContext.context + PathConstats.restAccess + PathConstats.columnCustomizationApi, {}).pipe(
      map(this.extractData),
      catchError(handleError),);
  }

  restoreColumnCustomization():  Observable<any> {
    return this.http.delete(this.appContext.context + PathConstats.restAccess + PathConstats.columnCustomizationApi).pipe(
      catchError(handleError));
  }

  getColumnCustomization_AvalibleColumns() { 
    var result = [];
     return new Promise((resolve,reject)=>{
      this.getColumnCustomization().subscribe((data)=>{
        result.push(data);
        this.getAvalibleColumns().subscribe((data)=>{
          result.push(data);
          resolve(result);
        },(error)=>{
          reject(error);
        })
      },(error)=>{
        reject(error);
      })
     });
  }

  setColumnCustomization(selectedColumns):  Observable<any> {
    selectedColumns=JSON.stringify(selectedColumns);
    return this.http.post(this.appContext.context + PathConstats.restAccess + PathConstats.columnCustomizationApi,selectedColumns).pipe(
      catchError(handleError));
  }

  getAvalibleColumns():  Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.sysNrfRoles).pipe(
      map(this.extractData),
      catchError(handleError),);
  }

  getMappedResources(roleDn,Query='*',pageSize=10,nextIndex=1,driverDN) : Observable<any>{

    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('nextIndex',nextIndex.toString());
    myParams = myParams.append('size',pageSize.toString());
    myParams = myParams.append('q',Query);
    myParams = myParams.append('driverID', driverDN);
    const options = { params: myParams };
    return this.http.post(this.appContext.context+PathConstats.mappedResources,roleDn,options).pipe(
    map(this.extractData),
    catchError(handleError),);
  }

  deleteMappedResources(mappedResources) : Observable<any>{
    return this.http.request('delete',this.appContext.context+PathConstats.deleteMappedResources,{body:mappedResources}).pipe(
    map(this.extractData),
    catchError(handleError),);
  }

  getRolesAssingments(tableConfigObject: TableConfigObject,selectedRole:any,filter:any):  Observable<any> {
    let filters:any[]=null;
    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('nextIndex', tableConfigObject.tableData.nextIndex.toString());
    myParams = myParams.append('q',tableConfigObject.tableData.query);
    myParams = myParams.append('sortOrder', tableConfigObject.tableData.sortOrder);
    myParams = myParams.append('sortBy', tableConfigObject.tableData.sortBy);
    let options;
    let size = this.globalService.defaultRowsPerPage;
    let pageSizeParams: HttpParams = new HttpParams();
    pageSizeParams = pageSizeParams.append('attribute', UIConstants.rolesAssignmentList);
    let pageSizeOptions = {  params: pageSizeParams };
    let pageSizeObj = {
      "columns" : []
    };
    if(!this.vutils.isUndefinedOrNull(filter)){
      let temPayload:any;
      temPayload={"dn": selectedRole.id,"recipientList":filter.recipientDns,"recipientType":filter.recipientType};
      selectedRole=temPayload;
      selectedRole=JSON.stringify(selectedRole);
    }
    else {
      selectedRole={"dn": selectedRole.id};
      selectedRole=JSON.stringify(selectedRole);
    }

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
              return this.http.post(this.appContext.context + PathConstats.rolesAssignments,selectedRole,options).pipe(
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

          return this.http.post(this.appContext.context + PathConstats.rolesAssignments,selectedRole,options).pipe(
            map((res: any) => {
              let body = res;
              body.pageSize = parseInt(size);
              return body || {};
            }))
        }),
        catchError(handleError),);
    }
  }

  getAvalibleColumnsRoleAssingments():  Observable<any> {
    let value={
      "attributesList": [
        {
          "key": "recipientFullName",
          "displayLabel": this.translate.get("Assigned To"),
          "isSortable": true,
        },
        {
          "key": "description",
          "displayLabel":this.translate.get( "Initial Request Description"),
          "isSortable": true,
        },
        {
          "key": "statusDisplay",
          "displayLabel":this.translate.get( "Status"),
          "isSortable": true,
        },
        {
          "key": "recipientType",
          "displayLabel": this.translate.get("Type"),
          "isSortable": true,

        },
        {
          "key": "effectiveDate",
          "displayLabel":this.translate.get( "Effective Date"),
          "isSortable": true,
        },
        {
          "key": "expiryDate",
          "displayLabel":this.translate.get( "Expiry Date"),
          "isSortable": true,
        }
      ]
    };
    return observableOf(value);
  }

  getRoleAssingmentsColumnCustomization():  Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.restAccess + PathConstats.roleAssingmentsListColumnCustomization, {}).pipe(
      map(this.extractData),
      catchError(handleError),);
  }

  restoreRoleAssingmentsColumnCustomization():  Observable<any> {
    return this.http.delete(this.appContext.context + PathConstats.restAccess + PathConstats.roleAssingmentsListColumnCustomization).pipe(
      map(this.extractData),
      catchError(handleError),);
  }

  getRoleAssingmentsColumnCustomization_AvalibleColumns() :Observable<any>{
    return observableForkJoin(this.getRoleAssingmentsColumnCustomization(),this.getAvalibleColumnsRoleAssingments());
  }

  setRoleAssingmentsColumnCustomization(selectedColumns):  Observable<any> {
    selectedColumns=JSON.stringify(selectedColumns);
    return this.http.post(this.appContext.context + PathConstats.restAccess + PathConstats.roleAssingmentsListColumnCustomization,selectedColumns).pipe(
      catchError(handleError));
  }

  getChildRoles(role,query="*",pageSize=this.globalService.defaultRowsPerPage) :  Observable<any> {
    let Params: HttpParams = new HttpParams();
    Params = Params.append('size',pageSize);
    Params = Params.append('q',query);
    Params = Params.append('nextIndex','1');
    const options = {params: Params };
    return this.http.post(this.appContext.context+PathConstats.childRoles,role,options).pipe(
      map(this.extractData),
      catchError(handleError),);
  }

  getParentRoles(role,query="*",pageSize=this.globalService.defaultRowsPerPage) :  Observable<any> {
    let Params: HttpParams = new HttpParams();
    Params = Params.append('size',pageSize);
    Params = Params.append('q',query);
    Params = Params.append('nextIndex','1');
    const options = { params: Params };
    return this.http.post(this.appContext.context+PathConstats.parentRoles,role,options).pipe(
      map(this.extractData),
      catchError(handleError),);
  }

  getRequestsStatus(tableConfigObject: TableConfigObject, selectedPermission:any,filter:any, type:string):  Observable<any> {

    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('nextIndex', tableConfigObject.tableData.nextIndex.toString());
    myParams = myParams.append('q',tableConfigObject.tableData.query);
    myParams = myParams.append('sortOrder', tableConfigObject.tableData.sortOrder);
    myParams = myParams.append('sortBy', tableConfigObject.tableData.sortBy);
    let options;
    let size = this.globalService.defaultRowsPerPage;

    let temPayload: any = "";
    if (!this.vutils.isEmptyString(filter)) {
      temPayload = JSON.stringify(filter);
      if (!this.vutils.isEmptyString(filter.status)) {
        myParams = myParams.append('status', filter.status);
      }
    }
    else {
      temPayload = {};
      temPayload = JSON.stringify(temPayload);
    }

    let pageSizeParams: HttpParams = new HttpParams();
    pageSizeParams = pageSizeParams.append('attribute', (type == 'role' ? UIConstants.roleRequestList : UIConstants.resourceRequestList));
    let pageSizeOptions ={params: pageSizeParams };
    let pageSizeObj = {
      "columns" : []
    };

    pageSizeObj.columns[0] = tableConfigObject.tableData.pageSize.toString();
    if (tableConfigObject.tableData.setPageSize) {
      return this.http.post(this.appContext.context + PathConstats.restAccess + PathConstats.userColumnPreferenceApi, pageSizeObj,  pageSizeOptions).pipe(
        mergeMap(() => {
          return this.http.get(this.appContext.context + PathConstats.restAccess + PathConstats.userColumnPreferenceApi, pageSizeOptions).pipe(
            map(this.extractData),
            mergeMap((pageSize : any) => {
              if(pageSize.isPreferenceAvailable == "true") {
                let preferenceSize = +(pageSize.columns[0]);
                if(this.globalService.optionsRowsPerPage.indexOf(preferenceSize) >= 0){
                  size = preferenceSize.toString();
                }
              }
              myParams = myParams.append('size', size);
              myParams = myParams.append('item', selectedPermission.id);
              myParams = myParams.append('type', type);
              options = {  params: myParams };
              return this.http.post(this.appContext.context + PathConstats.getRequestsStatus, temPayload, options).pipe(
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
        mergeMap((pageSize : any) => {
          if(pageSize.isPreferenceAvailable == "true") {
            let preferenceSize = +(pageSize.columns[0]);
            if(this.globalService.optionsRowsPerPage.indexOf(preferenceSize) >= 0){
              size = preferenceSize.toString();
            }
          }
          myParams = myParams.append('size',size);
          myParams = myParams.append('item', selectedPermission.id);
          myParams = myParams.append('type', type);
          options = {  params: myParams };

          return this.http.post(this.appContext.context + PathConstats.getRequestsStatus, temPayload, options).pipe(
            map((res: any) => {
              let body = res;
              body.pageSize = parseInt(size);
              return body || {};
            }))
        }),
        catchError(handleError),);
    }
  }

  getAvalibleColumnsRoleRequestsStatus():  Observable<any> {
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
          "displayLabel": this.translate.get("Requester"),
          "isSortable": true,
          "isSearchable": true,
        },
        {
          "key": "status",
          "displayLabel": this.translate.get("Status"),
          "isSortable": false,
        },
        {
          "key": "requestDate",
          "displayLabel": this.translate.get("Request Date"),
          "isSortable": true,
        },
        {
          "key": "action",
          "displayLabel": this.translate.get("Request Action"),
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

  getRoleRequestsStatusColumnCustomization():  Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.restAccess + PathConstats.roleRequestStatusColumnCustomization, {}).pipe(
      map(this.extractData),
      catchError(handleError),);
  }

  restoreRoleRequestsStatusColumnCustomization():  Observable<any> {
    return this.http.delete(this.appContext.context + PathConstats.restAccess + PathConstats.roleRequestStatusColumnCustomization).pipe(
      catchError(handleError));
  }

  getRoleRequestsStatusColumnCustomization_AvalibleColumns() :Observable<any>{
    return observableForkJoin(this.getRoleRequestsStatusColumnCustomization(),this.getAvalibleColumnsRoleRequestsStatus());
  }

  setRoleRequestsStatusColumnCustomization(selectedColumns):  Observable<any> {
    selectedColumns = JSON.stringify(selectedColumns);
    return this.http.post(this.appContext.context + PathConstats.restAccess + PathConstats.roleRequestStatusColumnCustomization,selectedColumns).pipe(
      catchError(handleError));
  }

  retractRequests(requests:any):Observable<any>{
    requests=JSON.stringify(requests);
    return this.http.request('delete',this.appContext.context + PathConstats.requestsHistory,{ body: requests }).pipe(
    map(this.extractData));
  }

  roleRequestStatusList() {
    let roleStatus = [
      {
        id: "",
        label: ""
      },
      {
        id: "running",
        label: this.translate.get("Running")
      },
      {
        id: "pending",
        label: this.translate.get("Approval Pending")
      },
      {
        id: "approved",
        label: this.translate.get("Approved")
      },
      {
        id: "completed",
        label: this.translate.get("Completed")
      },
      {
        id: "denied",
        label: this.translate.get("Denied")
      },
      {
        id: "terminated",
        label: this.translate.get("Terminated")
      }
    ];
    return roleStatus;
  }

  roleRequestListArributesList() {
    let value = {
      "attributesList": [
        {
          "key": "recipientName",
          "displayLabel": this.translate.get("Recipient"),
          "isSortable": true,
          "isSearchable": true,
          "isclickable": true,
        },
        {
          "key": "requesterName",
          "displayLabel": this.translate.get("Requester"),
          "isSortable": true,
          "isclickable": true,
        },
        {
          "key": "status",
          "displayLabel": this.translate.get("Status"),
          "isSortable": false,
          "isclickable": false,
        },
        {
          "key": "requestDate",
          "displayLabel": this.translate.get("Request Date"),
          "isSearchable": true,
          "isSortable": true,
          "isclickable": false,
        },
        {
          "key": "action",
          "displayLabel": this.translate.get("Request Action"),
          "isSortable": true,
          "isclickable": false,
        },
        {
          "key": "reason",
          "displayLabel": this.translate.get("Initial Request Description"),
          "isSearchable": true,
          "isSortable": true,
          "isclickable": false,
        }
      ]
    };
    return value;
  }

  saveFilters(filter): Observable<any> {
    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('attribute', 'com.novell.idm.admin.roleList-filters')
    let options ={ params : myParams};
    return this.http.post(this.appContext.context + PathConstats.restAccess +  PathConstats.userColumnPreferenceApi, filter, options);
  }

  getFilters() : Observable<any> {
    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('attribute', 'com.novell.idm.admin.roleList-filters')
    let options = { params : myParams};
    return this.http.get(this.appContext.context + PathConstats.restAccess + PathConstats.userColumnPreferenceApi, options).pipe(map(this.extractData));
  }
}
