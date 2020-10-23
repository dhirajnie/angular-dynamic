
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
export class EntityService {
  appContext: Context;
  private selectedEntity: any;
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

  getEntity(tableConfigObject: TableConfigObject, entityType: string, advSearchString: string, customPageSize?: string): Observable<any> {
    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('nextIndex', tableConfigObject.tableData.nextIndex.toString());
    if (this.vutils.isEmptyString(tableConfigObject.tableData.query)) {
      tableConfigObject.tableData.query = '*';
    }
    myParams = myParams.append('q', tableConfigObject.tableData.query);
    myParams = myParams.append('sortOrder', tableConfigObject.tableData.sortOrder);
    if(!this.vutils.isUndefinedOrNull(tableConfigObject.tableData.sortBy)){
      myParams = myParams.append('sortBy', tableConfigObject.tableData.sortBy);
    }
    let options;
    let size = this.globalService.defaultRowsPerPage;
    let pageSizeParams: HttpParams = new HttpParams();
    pageSizeParams = pageSizeParams.append('attribute', entityType + UIConstants.EntityPageSizeAttribute);
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
              myParams = myParams.append('entityKey', entityType);
              if (!this.vutils.isUndefinedOrNull(advSearchString) && !this.vutils.isEmptyString(advSearchString)) {
                myParams = myParams.append('advSearch', advSearchString);
              }
              options = { params: myParams };
              return this.http.get(this.appContext.context + PathConstats.EntityDefListApi, options).pipe(
                map((res: any) => {
                  let body = res;
                  body.pageSize = parseInt(size);
                  return body || {};
                }))
            }),)
        }),
        catchError(handleErrorReason),);
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
          if (!this.vutils.isUndefinedOrNull(customPageSize)) {
            myParams = myParams.append('size', customPageSize);

          }
          else {
            myParams = myParams.append('size', size);
          }
          myParams = myParams.append('entityKey', entityType);
          if (!this.vutils.isUndefinedOrNull(advSearchString) && !this.vutils.isEmptyString(advSearchString)) {
            myParams = myParams.append('advSearch', advSearchString);
          }
          options = { params: myParams };
          return this.http.get(this.appContext.context + PathConstats.EntityDefListApi, options).pipe(
            map((res: any) => {
              let body = res;
              body.pageSize = parseInt(size);
              return body || {};
            }))
        }),
        catchError(handleErrorReason),);
    }
  }

  getEntitiesListForSelectEntitiesWidget(query, nextIndex, paginationSize, entityKey, entityLookupAttributes, isOrgchart, displayAttributes): Observable<any> {
    if (this.vutils.isEmptyString(query)) {
      query = "*";
    }

    if (this.vutils.isUndefinedOrNull(nextIndex) || nextIndex < 1) {
      nextIndex = 1;
    }
    if (this.vutils.isUndefinedOrNull(paginationSize) || paginationSize <= 0) {
      paginationSize = 10;
    }
    let params: HttpParams = new HttpParams();
    params = params.set('q', query);
    params = params.set('size', paginationSize);
    params = params.set('nextIndex', nextIndex);
    params = params.set('entityKey',entityKey);

    if(isOrgchart){
      params = params.set('isOrgChart', isOrgchart.toString());
    }else {
      params = params.set('searchKeys',entityLookupAttributes);
    }

    let requestOptions = {
      params: params
    };
    return this.http.get(this.appContext.context + PathConstats.EntityDefListApi, requestOptions).pipe(
      map((res) =>{
        return this.extractDataForSelectEntitiesWidget(res,this.vutils, displayAttributes)
      }),
      catchError(handleError),);
  }

  private extractDataForSelectEntitiesWidget(res: any,vutils:any, displayAttributes) {
    let body = res;
    let finalResult = [];
    if(!vutils.isUndefinedOrNull(body) && !vutils.isEmptyArray(body.entityList)) {
      let list = body.entityList;
      list.forEach((element) => {
        let item = {};
        item['dn'] = element.dn;
        item['showCN'] = false;
       
        if(element.hasOwnProperty('attributes')){
          for(let i=0; i < element.attributes.length; i++){
            let attr = element.attributes[i];
            if(displayAttributes.indexOf(attr.key) == -1) {
              continue;
            }
            var entityAttributeValuesList = [];
            if (!vutils.isUndefinedOrNull(attr.attributeValues)) {
              attr.attributeValues.forEach((value) => {
                if(value['@type'] == "entityInfoNode"){
                  entityAttributeValuesList.push(value.name);
                } else if (value['@type'] == "jaxBMapNode") {
                    entityAttributeValuesList.push(value.value);
                } else {
                    entityAttributeValuesList.push(value.$);
                }
              });
              item[attr.key] = entityAttributeValuesList;
              item['type']  ='entity';
            }

          }
        }
        finalResult.push(item);
      });
    }

    finalResult.forEach((res) => {
      let entityOnSelectDisplayValue = "";
      displayAttributes.forEach((attr,i) => {
        if(!vutils.isEmptyArray(res[attr])){
          if(i > 0){
            entityOnSelectDisplayValue += " ";
          }
          entityOnSelectDisplayValue += res[attr];
        }
      });
      res['entityDisplayValue'] = entityOnSelectDisplayValue;
      if(vutils.isEmptyString(res['entityDisplayValue'])){
        res['showCN'] = true;
      }
    });

    body.entityList = finalResult;
    return body || {};
  }

  createGroup(payload) {
    return this.http.post(this.appContext.context + PathConstats.EntityDefApi, payload).pipe(
      map(this.extractData),
      catchError(handleErrorReason),);
  }

  updateGroup(payload) {
    return this.http.put(this.appContext.context + PathConstats.EntityDefApi, payload).pipe(
      map(this.extractData));
  }

  deleteEntity(payload) {

    return this.http.request('delete',this.appContext.context + PathConstats.EntityCreateApi, { body: payload }).pipe(
      map(this.extractData));
  }

  setData(data) {
    this.selectedEntity = data;
  }

  getData() {
    let temp = this.selectedEntity;
    this.clearData();
    return temp;
  }

  clearData() {
    this.selectedEntity = undefined;
  }

  getColumnCustomization(entityType?: string): Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.restAccess + PathConstats.entityColumnCustomization + '-' + entityType, {}).pipe(
      map(this.extractData),
      catchError(handleError),);
  }

  setColumnCustomization(selectedColumns, entityType): Observable<any> {
    selectedColumns=JSON.stringify(selectedColumns);
    return this.http.post(this.appContext.context + PathConstats.restAccess + PathConstats.entityColumnCustomization + '-' + entityType, selectedColumns).pipe(
      catchError(handleError));
  }

  restoreColumnCustomization(entityType): Observable<any> {
    return this.http.delete(this.appContext.context + PathConstats.restAccess + PathConstats.entityColumnCustomization + '-' + entityType).pipe(
      catchError(handleError));
  }

  getEntityDef(clientId: string, entityType?: string): Observable<any> {

    let url = `${this.appContext.context}${PathConstats.EntityDefApi}`
    let queryParams: HttpParams = new HttpParams();
    queryParams = queryParams.append('key', entityType);
    queryParams = queryParams.append('clientId', clientId);
    const options = { params: queryParams };
    return this.http.get(url, options).pipe(
      map((res: any) => {
        let body = res;
        return body || {};
      }), catchError(handleError));
  }

  getEntityDefFromDAL(key): Observable<any>{
    let url = `${this.appContext.context}${PathConstats.EntityDefApi}`;
    let queryParams: HttpParams = new HttpParams();
    queryParams = queryParams.append('key', key);
    const options = { params: queryParams };
    return this.http.get(url, options).pipe(
      map((res: Response) => {
        let body = res;
        return body || {};
      }))
  }

  CreateEntity(payload) {
    return this.http.post(this.appContext.context + PathConstats.EntityCreateApi, payload).pipe(
      map(this.extractData),
      catchError(handleErrorReason),);
  }
  
  EditEntity(payload) {
    return this.http.put(this.appContext.context + PathConstats.EntityCreateApi, payload).pipe(
      map(this.extractData),
      catchError(handleErrorReason),);
  }

}
