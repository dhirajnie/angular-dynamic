
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpResponse, HttpRequest, HttpParams } from "@angular/common/http";
import { PathConstats } from "../../../constants/path-constants";
import { AppContextService } from "../../context/app-context.service";
import { Context } from "../../../schemas/app-context-schema";
import { handleError, handleErrorReason } from "../../../factories/handle-error.factory";
import { VariableService } from "../../utilities/util_variable/variable.service";
import { Resource, ApprovalType } from "../../../schemas/resource-schema";
import { Resources } from "../../../schemas/resources-schema";

@Injectable()
export class ResourceCrudService {

  appContext: Context;

  constructor(private http: HttpClient, private appContextService: AppContextService, private variableService: VariableService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res) {
    let body = res;
    let resources = new Resources();
    resources.resources = [];
    if (body != undefined && body != null) {
      if (body.resources != undefined && body.resources != null) {
        for (let i = 0; i < body.resources.length; i++) {
          let resource = body.resources[i];
          // initialize category
          if (resource.categories != undefined && resource.categories != null) {
            for (let j = 0; j < resource.categories.length; j++) {
              resource.categories[j].type = "category";
            }
          } else {
            resource.categories = [];
          }

          // initialize owner
          if (resource.owners == undefined || resource.owners == null) {
            resource.owners = [];
          }

          //initialize localizedNames
          let names = [];
          for (let j = 0; j < resource.localizedNames.length; j++) {
            if(!this.variableService.isEmptyString(resource.localizedNames[j].name)) {
              resource.localizedNames[j].name =  resource.localizedNames[j].name.trim();
            } 
            switch (resource.localizedNames[j].locale) {
              case "zh-CN":
                names["zh_CN"] = resource.localizedNames[j].name;
                break;
              case "zh-TW":
                names["zh_TW"] = resource.localizedNames[j].name;
                break;
              case "he":
                names["iw"] = resource.localizedNames[j].name;
                break;
              default:
                names[resource.localizedNames[j].locale] = resource.localizedNames[j].name;
            }
          }
          resource.localizedNames = names;
          //initialize localizedDescriptions
          let descriptions = [];
          for (let j = 0; j < resource.localizedDescriptions.length; j++) {
            if(!this.variableService.isEmptyString(resource.localizedDescriptions[j].name)) {
              resource.localizedDescriptions[j].desc =  resource.localizedDescriptions[j].desc.trim();
            } 
            switch (resource.localizedDescriptions[j].locale) {
              case "zh-CN":
                descriptions["zh_CN"] = resource.localizedDescriptions[j].desc;
                break;
              case "zh-TW":
                descriptions["zh_TW"] = resource.localizedDescriptions[j].desc;
                break;
              case "he":
                descriptions["iw"] = resource.localizedDescriptions[j].desc;
                break;
              default:
                descriptions[resource.localizedDescriptions[j].locale] = resource.localizedDescriptions[j].desc;
            }
          }
          resource.localizedDescriptions = descriptions;
          //initialize localizedDisplayValues for resourceParameters
          if (!this.variableService.isEmptyArray(resource.resourceParameters)) {
            for (let i = 0; i < resource.resourceParameters.length; i++) {
              if (!this.variableService.isEmptyArray(resource.resourceParameters[i].localizedDisplayValues)) {
                for (let j = 0; j < resource.resourceParameters[i].localizedDisplayValues.length; ++j) {
                  switch (resource.resourceParameters[i].localizedDisplayValues[j].locale) {
                    case "zh-CN":
                    resource.resourceParameters[i].localizedDisplayValues[j].locale = "zh_CN";  
                      break;
                    case "zh-TW":
                    resource.resourceParameters[i].localizedDisplayValues[j].locale = "zh_TW";  
                      break;
                    default:
                  }
                }
              }
            }
          }

          // initialize grant approval
          resource.approvalType = ApprovalType["NONE"];
          if (resource.approvalRequired != undefined && resource.approvalRequired != null && resource.approvalRequired == true) {
            if (resource.approvalIsStandard != undefined && resource.approvalIsStandard != null && resource.approvalIsStandard == true) {
              if (resource.quorum != undefined && resource.quorum != null) {
                resource.approvalType = ApprovalType["QUORUM"];
                if (resource.quorum != undefined && resource.quorum != null && resource.quorum != '') {
                  var str = resource.quorum.split("%", 1);
                  resource.approvalQuorum = +str[0];
                }
              } else {
                resource.approvalType = ApprovalType["SERIAL"];
              }
              let approvers = [];
              let sortedApprovers = resource.approvers.sort(this.variableService.sortArrayByAttribute("sequence"));
              for (let index = 0; index < sortedApprovers.length; index++) {
                approvers[index] = sortedApprovers[index];
              }
              resource.approvalApprovers = approvers;
            } else {
              resource.approvalType = ApprovalType["CUSTOM"];
              resource.approvalRequestDefs = [];
              var approvalRequestDef: any = {};
              approvalRequestDef.id = resource.requestDef;
              approvalRequestDef.name = resource.requestDefName;
              approvalRequestDef.type = "prd";
              resource.approvalRequestDefs.push(approvalRequestDef);
            }
          }
          // initialize revoke approval
          resource.revokeApprovalType = ApprovalType["NONE"];
          if (resource.revokeEqualsGrant != undefined && resource.revokeEqualsGrant != null && resource.revokeEqualsGrant == true) {
            resource.revokeApprovalType = ApprovalType["Same as Grant Approval"];
          } else if (resource.revokeRequired != undefined && resource.revokeRequired != null && resource.revokeRequired == true) {
            if (resource.revokeApprovalIsStandard != undefined && resource.revokeApprovalIsStandard != null && resource.revokeApprovalIsStandard == true) {
              if (resource.revokeQuorum != undefined && resource.revokeQuorum != null && resource.revokeQuorum != '') {
                resource.revokeApprovalType = ApprovalType["QUORUM"];
                if (resource.revokeQuorum != undefined && resource.revokeQuorum != null) {
                  var str = resource.revokeQuorum.split("%", 1);
                  resource.revokeQuorum = +str[0];
                }
              } else {
                resource.revokeApprovalType = ApprovalType["SERIAL"];
              }
              let approvers = [];
              let sortedApprovers = resource.revokeApprovers.sort(this.variableService.sortArrayByAttribute("sequence"));
              for (let index = 0; index < sortedApprovers.length; index++) {
                approvers[index] = sortedApprovers[index];
              }
              resource.revokeApprovers = approvers;
            } else {
              resource.revokeApprovalType = ApprovalType["CUSTOM"];
              resource.revokeRequestDefs = [];
              var revokeRequestDef: any = {};
              revokeRequestDef.id = resource.revokeRequestDef;
              revokeRequestDef.name = resource.revokeRequestDefName;
              revokeRequestDef.type = "prd";
              resource.revokeRequestDefs.push(revokeRequestDef);
            }
          }

          resources.resources.push(resource);
        }
      }
    }
    return resources || {};
  }

  private extractCreateResourceData(res: Response) {
    return res || {};
  }

  extractdata(res: Response) {
    let body = res || {};
    return body;
  }

  extract(res: any) {
    return res;
  }

  getResourceDetails(resources): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.resourcesDetailsApi, resources).pipe(
      map(this.extractData.bind(this)),
      catchError(handleError),);
  }
  deleteResource(resourceList: any): Observable<any> {
    resourceList = JSON.stringify(resourceList);
    return this.http.request('delete',this.appContext.context + PathConstats.deleteResources, { body: resourceList }).pipe(
      map(this.extractdata));
  }
  getResourceEntitlementList(resource): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.getResourceEntitlementList, resource).pipe(
      map(this.extractdata),
      catchError(handleError),);;
  }
  createResource(resource, withEntitlement: boolean = false): Observable<any> {

    if(!this.variableService.isEmptyString(resource.name)) {
      resource.name =  resource.name.trim();
    }
    if(!this.variableService.isEmptyString(resource.description)) {
      resource.description =  resource.description.trim();
    }
    if(!this.variableService.isEmptyArray(resource.localizedNames)){ 
      for (let j = 0; j < resource.localizedNames.length; j++) {
        if(!this.variableService.isEmptyString(resource.localizedNames[j].name)) {
          resource.localizedNames[j].name =  resource.localizedNames[j].name.trim();
        }
      } 
    }
    if(!this.variableService.isEmptyArray(resource.localizedDescriptions)){ 
      for (let j = 0; j < resource.localizedDescriptions.length; j++) {
        if(!this.variableService.isEmptyString(resource.localizedDescriptions[j].desc)) {
          resource.localizedDescriptions[j].desc =  resource.localizedDescriptions[j].desc.trim();
        } 
      }
    }
    if (withEntitlement) {

      let params: HttpParams = new HttpParams();
      params = params.set('fromEntitlement', "true");
      let requestOptions = {
        params: params
      };
      if(!this.variableService.isEmptyArray(resource.entitlements)) {
        for (let j = 0; j < resource.entitlements.length; j++) {
          if(!this.variableService.isEmptyString(resource.entitlements[j].resourceName)) {
            resource.entitlements[j].resourceName =  resource.entitlements[j].resourceName.trim();
          }
          if(!this.variableService.isEmptyString(resource.entitlements[j].resourceDescription)) {
            resource.entitlements[j].resourceDescription =  resource.entitlements[j].resourceDescription.trim();
          }
        } 
      }
      return this.http.post(this.appContext.context + PathConstats.resourceCreateApi, resource, requestOptions).pipe(
        map(this.extractCreateResourceData),
        catchError(handleErrorReason),);
    }

    return this.http.post(this.appContext.context + PathConstats.resourceCreateApi, resource).pipe(
      map(this.extractCreateResourceData),
      catchError(handleErrorReason),);
  }

  updateResourceEntitlement(resource: any): Observable<any> {
    return this.http.put(this.appContext.context + PathConstats.updateEntitlementApi, resource, {responseType: 'text'}).pipe(
      map(this.extract),
      catchError(handleErrorReason),);
  }
  
  modifyResource(resources: any): Observable<any> {
    return this.http.put(this.appContext.context + PathConstats.modifyResourcesApi, resources).pipe(
      map(this.extractdata),
      catchError(handleErrorReason),);
  }

  assignResource(assignment: any): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.assignResourceApi, assignment).pipe(
    map(this.extractdata),
      catchError(handleErrorReason),);
  }

  deleteResourceAssignments(assignments: any): Observable<any> {
    assignments = JSON.stringify(assignments);
    return this.http.request('delete',this.appContext.context + PathConstats.assignementsAPI, { body: assignments }).pipe(
      map(this.extractdata),
      catchError(handleErrorReason),);
  }

}
