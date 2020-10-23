
import { of as observableOf, Observable } from 'rxjs';

import { catchError, mergeMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TableConfigObject } from '../../../schemas/table-config-schema';
import { Context } from '../../../schemas/app-context-schema';
import { HttpClient, HttpResponse, HttpParams, HttpRequest } from '@angular/common/http';
import { AppContextService } from '../../context/app-context.service';
import { VariableService } from '../../utilities/util_variable/variable.service';

import { PathConstats } from '../../../constants/path-constants';
import { handleError, handleErrorReason } from "../../../factories/handle-error.factory";
import { UIConstants } from '../../../constants/ui-constants';
import { GlobalService } from './../../global/global.service';


@Injectable()
export class AdminAssignmentsService {
  appContext: Context;
  private selectedAssignment: any;
  constructor(
    private http: HttpClient,
    private appContextService: AppContextService,
    private vutils: VariableService,

    private globalService: GlobalService
  ) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  private extractElement(array, key): any {
    for (var index = 0; index < array.length; index++) {
      var element = array[index];
      if (element.key == key) {
        return element;
      }
      if (element.column == key) {
        return element;
      }

    }
    return false;
  }

  getColumnCustomization_AvalibleColumns() {
    //return Observable.forkJoin(this.getColumnCustomization(), this.getAvalibleColumns()).catch(handleError);
    let response = {};
    return this.http.get(this.appContext.context + PathConstats.adminAssignmentsColumnCustomizationApi, {}).pipe(
      map(this.extractData),
      mergeMap((userColumnsPreference: any) => {
        return this.http.get(this.appContext.context + PathConstats.adminAssignmentsAvailableColumns).pipe(
          map(this.extractData),
          mergeMap((availableColumns: any) => {
            let userSelectedColumns = [];
            if (!this.vutils.isUndefinedOrNull(userColumnsPreference.columns) && userColumnsPreference.isPreferenceAvailable == 'true') {
              response['preferenceAvailable'] = true;
              userColumnsPreference.columns.forEach(element => {
                let temp = this.extractElement(availableColumns.attributesList, element);
                // here the row data can be configured for clickable by changing the  **  isclickable:true ** property
                if (element == 'assignee' || element == 'domain' || element == 'adminType') {
                  userSelectedColumns.push({
                    column: element,
                    isclickable: true,
                    isSortable: true,
                    displayLabel: temp.displayLabel
                  });
                } else {
                  userSelectedColumns.push({
                    column: element,
                    isclickable: false,
                    isSortable: true,
                    displayLabel: temp.displayLabel
                  });
                }
              });
              response["customizedColumns"] = userSelectedColumns;
            } else {
              response['preferenceAvailable'] = false;
            }
            return observableOf(response);
          }), catchError(handleError));
      }), catchError(handleError));
  }

  getColumnCustomization(): Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.adminAssignmentsColumnCustomizationApi, {}).pipe(
      map(this.extractData),
      catchError(handleError));
  }

  getAvalibleColumns(): Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.adminAssignmentsAvailableColumns).pipe(
      map(this.extractData),
      catchError(handleError));
  }

  setColumnCustomization(selectedColumns): Observable<any> {
    selectedColumns = JSON.stringify(selectedColumns);
    return this.http.post(this.appContext.context + PathConstats.adminAssignmentsColumnCustomizationApi, selectedColumns).pipe(
      catchError(handleError));
  }

  restoreColumnCustomization(): Observable<any> {
    return this.http.delete(this.appContext.context + PathConstats.adminAssignmentsColumnCustomizationApi).pipe(
      catchError(handleError));
  }

  getAssignments(tableConfigObject: TableConfigObject, filters): Observable<any> {
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
    pageSizeParams = pageSizeParams.append('attribute', UIConstants.adminAssignmentsPageSizeAttribute);
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
              return this.http.get(this.appContext.context + PathConstats.adminAssignmentsListApi, options).pipe(
                map((res: any) => {
                  let body = res;
                  body.pageSize = parseInt(size);
                  return body || {};
                }))
            }))
        }),
        catchError(handleError));
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
          return this.http.get(this.appContext.context + PathConstats.adminAssignmentsListApi, options).pipe(
            map((res: any) => {
              let body = res;
              body.pageSize = parseInt(size);
              return body || {};
            }))
        }),
        catchError(handleError));
    }
  }

  createAssignments(payload) {
    let assignmentPayload = payload;
    let assigneeDetails = assignmentPayload.assignee[0];
    assignmentPayload.assignee = assigneeDetails["name"];
    assignmentPayload.assigneeDn = assigneeDetails["dn"];
    return this.http.post(this.appContext.context + PathConstats.adminAssignmentsCreateApi, assignmentPayload).pipe(
      map(this.extractData),
      catchError(handleErrorReason));
  }

  deleteAssignments(payload) {
    return this.http.request('delete', this.appContext.context + PathConstats.adminAssignmentsListApi, { body: payload }).pipe(
      map(this.extractData),
      catchError(handleErrorReason));
  }

  setData(data) {
    this.selectedAssignment = data;
  }

  getData() {
    let temp = this.selectedAssignment;
    this.clearData();
    return temp;
  }

  clearData() {
    this.selectedAssignment = undefined;
  }

  getPermissionsOfAssignment(tableConfigObject: TableConfigObject, filters): Observable<any> {
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
    pageSizeParams = pageSizeParams.append('attribute', UIConstants.adminPermissionsOfAssignmentPageSizeAttribute);
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
              return this.http.get(this.appContext.context + PathConstats.adminPermissionsListOfAssignmenttApi, options).pipe(
                map((res: any) => {
                  let body = res;
                  body.pageSize = parseInt(size);
                  return body || {};
                }))
            }))
        }),
        catchError(handleError));
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
          return this.http.get(this.appContext.context + PathConstats.adminPermissionsListOfAssignmenttApi, options).pipe(
            map((res: any) => {
              let body = res;
              body.pageSize = parseInt(size);
              return body || {};
            }))
        }),
        catchError(handleError));
    }
  }

  getAdminDomains(): Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.adminAssignmentsAvailableDomains).pipe(
      map(this.extractData),
      catchError(handleError));
  }


}

