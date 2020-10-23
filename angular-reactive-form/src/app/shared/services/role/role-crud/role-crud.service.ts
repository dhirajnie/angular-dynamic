
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { PathConstats } from "../../../constants/path-constants";
import { AppContextService } from "../../context/app-context.service";
import { Context } from "../../../schemas/app-context-schema";
import { handleError, handleErrorReason } from "../../../factories/handle-error.factory";
import { VariableService } from "../../utilities/util_variable/variable.service";
import { Role, ApprovalType } from "../../../schemas/role-schema";
import { Roles } from "../../../schemas/roles-schema";
import { FeedBackService } from "../../feed-back/feed-back.service";

@Injectable()
export class RoleCrudService {

  appContext: Context;

  constructor(private http: HttpClient, private appContextService: AppContextService, private variableService: VariableService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res) {
    let body = res;
    let roles = new Roles();
    roles.roles = [];
    if (body != undefined && body != null) {
      if (body.roles != undefined && body.roles != null) {
        for (let i = 0; i < body.roles.length; i++) {
          let role = body.roles[i];
          // initialize category
          if (role.categories != undefined && role.categories != null) {
            for (let j = 0; j < role.categories.length; j++) {
              role.categories[j].type = "category";
            }
          } else {
            role.categories = [];
          }

          // initialize owner
          if (role.owners == undefined || role.owners == null) {
            role.owners = [];
          }

          //initialize localizedNames
          let names = [];
          for (let j = 0; j < role.localizedNames.length; j++) {
            switch (role.localizedNames[j].locale) {
              case "zh-CN":
                names["zh_CN"] = role.localizedNames[j].name;
                break;
              case "zh-TW":
                names["zh_TW"] = role.localizedNames[j].name;
                break;
              case "he":
                names["iw"] = role.localizedNames[j].name;
                break;
              default:
                names[role.localizedNames[j].locale] = role.localizedNames[j].name;
            }
          }
          role.localizedNames = names;

          //initialize localizedDescriptions
          let descriptions = [];
          for (let j = 0; j < role.localizedDescriptions.length; j++) {
            switch (role.localizedDescriptions[j].locale) {
              case "zh-CN":
                descriptions["zh_CN"] = role.localizedDescriptions[j].desc;
                break;
              case "zh-TW":
                descriptions["zh_TW"] = role.localizedDescriptions[j].desc;
                break;
              case "he":
                descriptions["iw"] = role.localizedDescriptions[j].desc;
                break;
              default:
                descriptions[role.localizedDescriptions[j].locale] = role.localizedDescriptions[j].desc;
            }
          }
          role.localizedDescriptions = descriptions;

          // initialize approvals
          role.approvalType = ApprovalType["NONE"];
          if (role.approvalRequired != undefined && role.approvalRequired != null && role.approvalRequired == true) {
            if (role.approvalIsStandard != undefined && role.approvalIsStandard != null && role.approvalIsStandard == true) {
              if (role.approvalQuorum != undefined && role.approvalQuorum != null) {
                role.approvalType = ApprovalType["QUORUM"];
                if (role.approvalQuorum != undefined && role.approvalQuorum != null) {
                  var str = role.approvalQuorum.split("%", 1);
                  role.approvalQuorum = +str[0];
                }
              } else {
                role.approvalType = ApprovalType["SERIAL"];
              }
              let approvers = [];
              if (
                role.approvalApprovers != undefined && 
                role.approvalApprovers != null && 
                role.approvalApprovers.constructor != undefined && 
                role.approvalApprovers.constructor == Array
              ) {
                let sortedApprovers = role.approvalApprovers.sort(this.variableService.sortArrayByAttribute("sequence"));
                for (let index = 0; index < sortedApprovers.length; index++) {
                  approvers[index] = sortedApprovers[index];
                }
              }
              role.approvalApprovers = approvers;
            } else {
              role.approvalType = ApprovalType["CUSTOM"];
              role.approvalRequestDefs = [];
              var approvalRequestDef: any = {};
              approvalRequestDef.id = role.approvalRequestDef;
              approvalRequestDef.name = role.approvalRequestDefName;
              approvalRequestDef.type = "prd";
              role.approvalRequestDefs.push(approvalRequestDef);
            }
          }

          roles.roles.push(role);
        }
      }
    }
    return roles || {};
  }

  private extractCreateRoleData(res: Response) {
    //res. = "Successfuly created Role";
    return res || {};
  }

  private extractFeedbackMessage(res: Response) {
    let body = res || {};
    return body;

  }

  getRoleDetails(roles): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.roleDetailsApi, roles).pipe(
      map(this.extractData.bind(this)),
      catchError(handleError),);
  }

  createRole(role): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.roleCreateApi, role).pipe(
      map(this.extractFeedbackMessage),
      catchError(handleErrorReason),);
  }

  deleteRoles(roleList: any): Observable<any> {
    roleList = JSON.stringify(roleList);
    return this.http.request('delete',this.appContext.context + PathConstats.deleteRoles, { body: roleList }).pipe(
      map(this.extractFeedbackMessage));
  }

  modifyRoles(roles: any): Observable<any> {
    return this.http.put(this.appContext.context + PathConstats.modifyRolesApi, roles).pipe(
      map(this.extractFeedbackMessage),
      catchError(handleErrorReason),);
  }

  mapResources(mappedresources: any): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.mapResourcesApi, mappedresources).pipe(
      map(this.extractFeedbackMessage),
      catchError(handleErrorReason),);
  }

  createTemporaryResource(resource: any): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.createTemporaryResourceApi, resource).pipe(
      map(this.extractFeedbackMessage),
      catchError(handleErrorReason),);
  }

  getResourcefromEntitlement(entitlement: any): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.getResourcefromEntitlement, entitlement).pipe(
      map(this.extractFeedbackMessage),
      catchError(handleErrorReason),);
  }

  assignRole(assignment: any): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.assignRoleApi, assignment).pipe(
      map(this.extractFeedbackMessage),
      catchError(handleErrorReason),);
  }

  mapParentRoles(payload: any): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.parentRolesMap, payload).pipe(
      map(this.extractFeedbackMessage),
      catchError(handleErrorReason),);
  }

  mapChildRoles(payload: any): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.childRolesMap, payload).pipe(
      map(this.extractFeedbackMessage),
      catchError(handleErrorReason),);
  }

  deleteChildRoles(payload: any): Observable<any> {
    return this.http.request('delete',this.appContext.context + PathConstats.childRolesMap, { body: payload }).pipe(
      map(this.extractFeedbackMessage),
      catchError(handleErrorReason),);
  }

  deleteParentRoles(payload: any): Observable<any> {
    return this.http.request('delete',this.appContext.context + PathConstats.parentRolesMap, { body: payload }).pipe(
      map(this.extractFeedbackMessage),
      catchError(handleErrorReason),);
  }

  deleteRoleAssignments(assignments: any): Observable<any> {
    assignments = JSON.stringify(assignments);
    return this.http.request('delete',this.appContext.context + PathConstats.assignementsAPI, { body: assignments }).pipe(
      map(this.extractFeedbackMessage),
      catchError(handleErrorReason),);
  }

}
