
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { WindowRefService } from '../../services/utilities/util_winRef/window-ref.service';
import { Context } from "../../schemas/app-context-schema";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AppContextService } from "../context/app-context.service";
import { PathConstats } from "../../constants/path-constants";
import { handleError, handleErrorReason } from "../../factories/handle-error.factory";
import { TranslateService } from '../translate/translate.service';
import { VariableService } from '../utilities/util_variable/variable.service';
@Injectable({
  providedIn: 'root'
})
export class CreateWorkflowService {
  formsContext: string;
  wizardFormId: string;
  appContext: Context;
  FORM_RENDERER_PAGE_SLUG: string = '#/form/details';
  workflowFormId: string;
  constructor(
    private windowRefService: WindowRefService,
    private http: HttpClient,
    private appContextService: AppContextService,
    private translate: TranslateService,
    private vutils: VariableService
    ) {
      this.appContext = this.appContextService.getAppContext();
     }

  redirectToWorkflow(permissionDn, permissionType, permissionName, approvalType, selectedApprovalStep, optCustomTemplate, customTemplate){
    let formRendererURL = this.formsContext + this.FORM_RENDERER_PAGE_SLUG;
    let userLocale = this.translate.getUserCurrentLocale();
    let tid = "";
    let templateParams = "";
    if (optCustomTemplate) {
      tid = customTemplate;
      templateParams = "&isCustomTemplate=true";
    } else {
      if (selectedApprovalStep.steps == 1 && selectedApprovalStep.type == "QuorumApproval") {
        approvalType = "Quorum";
      }
      let templateCn = this.getTemplateName(approvalType,selectedApprovalStep);
      let templateRelativeDN = ",cn=RequestDefs,cn=AppConfig,cn=User Application Driver,cn=driverset1,o=system";
      if (!this.vutils.isUndefinedOrNull(permissionDn)) {
        let myRegexp = /cn=roleconfig,cn=appconfig,(.*)/i;
        let match = myRegexp.exec(permissionDn);
        if (this.vutils.isArray(match) && match.length > 1) {
          templateRelativeDN = ",cn=RequestDefs,cn=AppConfig," + match[1];
        }
      }
      tid = "cn=" + templateCn + templateRelativeDN; //To-do: Need to prepare dn based listTemplates API response and created bug for the same
      templateParams = "&atype=" +approvalType+ "&asteps=" +selectedApprovalStep.steps+"&isCustomTemplate=false";
    }
    let GET_FORM_DETAILS_API = "/rest/access/forms";
    var openURL = formRendererURL + "?id=null&pid="+encodeURI(tid)+"&pdn="+encodeURI(permissionDn)+"&sid=IDM&uri="+GET_FORM_DETAILS_API+"&ptype="+permissionType+"&formContainer=TemplateForms" + "&pname=" + permissionName + templateParams + "&locale=" + userLocale;
    var rendererWindow = this.windowRefService.nativeWindow.open(openURL, '_blank');
    rendererWindow.focus();
  }

  getSystemTemplatePrds(){
    return this.http.get(this.appContext.context + PathConstats.templatePrdsApi).pipe(
      map((res: any) => {
        let body = res;
        return body || {};
      }),
      catchError(handleErrorReason),);
  }

  getCustomTemplatePrds(){
    return this.http.get(this.appContext.context + PathConstats.templatePrdsApi +"?isCustom=true").pipe(
      map((res: any) => {
        let body = res;
        return body || {};
      }),
      catchError(handleErrorReason),);
  }

  getTemplateForms(){
    return this.http.get(this.appContext.context + PathConstats.templateFormsApi).pipe(
      map((res: any) => {
        let body = res;
        return body || {};
      }),
      catchError(handleErrorReason),);
  }

  getFormsContext(){
    let payload = {"keys": ['com.netiq.idm.forms.url.host','com.netiq.idm.forms.url.context']};
    return this.http.post(this.appContext.context + PathConstats.ismPropertiesApi, payload).pipe(
      map((res: any) => {
        let body = res;
        return body || {};
      }),

      catchError(handleErrorReason),);
  }

  getTemplateName(approvalType, selectedApprovalStep){
        let numberOfApprovalSection = selectedApprovalStep.steps;
        let templateName = null;
        if(numberOfApprovalSection == 0){
          templateName = "NoApproval";
        } else if (approvalType != null) {
            if (approvalType == "Quorum") {
                templateName = "QuorumApproval";
            } else if (numberOfApprovalSection == 1) {
                templateName = "SingleStepApproval";
            } else if (approvalType == "Serial") {
                if (numberOfApprovalSection == 2) {
                    templateName = "TwoStepSerialApproval";
                } else if (numberOfApprovalSection == 3) {
                    templateName = "ThreeStepSerialApproval";
                } else if (numberOfApprovalSection == 4) {
                    templateName = "FourStepSerialApproval";
                }
            } else if (approvalType == "Parallel") {
                if (numberOfApprovalSection == 2) {
                    templateName = "TwoStepParallelApproval";
                } else if (numberOfApprovalSection == 3) {
                    templateName = "ThreeStepParallelApproval";
                } else if (numberOfApprovalSection == 4) {
                    templateName = "FourStepParallelApproval";
                }
            }
        }
        return templateName;
    }

    approvalSteps(){
      let _approvalSteps = [
        { 'name': this.translate.get("No Approval"), 'steps': 0, 'type': "NoApproval" },
        { 'name': this.translate.get("Single"), 'steps': 1, 'type': "SingleStepApproval" },
        { 'name': this.translate.get("Single With Quorum"), 'steps': 1, "type": "QuorumApproval" },
        { 'name': this.translate.get("Two"), 'steps': 2 },
        { 'name': this.translate.get("Three"), 'steps': 3 },
        { 'name': this.translate.get("Four"), 'steps': 4 }
      ];
      return _approvalSteps;
    }
  
    approvalTypes(){
      let _approvalTypes = [
        { 'name': this.translate.get("Serial"), 'type':'Serial' },
        { 'name': this.translate.get("Parallel"), 'type': 'Parallel'}
      ];
      return _approvalTypes;
    }
  
}