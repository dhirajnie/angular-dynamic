import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Context } from "../../schemas/app-context-schema";
import { AppContextService } from "../context/app-context.service";
import { PathConstats } from "../../constants/path-constants";
import { handleErrorReason } from "../../factories/handle-error.factory";
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { StringConstants } from '../../constants/string-constants';
import { GlobalService } from '../global/global.service';
import { WindowRefService } from '../utilities/util_winRef/window-ref.service';
import { VariableService } from '../utilities/util_variable/variable.service';
import { OrgChartEntityInfoNode } from '../../schemas/orgchart-schema';
import { UIConstants } from '../../constants/ui-constants';

@Injectable({
  providedIn: 'root'
})
export class OrgChartService {

  appContext: Context;
  private eventFromChild = new BehaviorSubject<Event>(document.createEvent("Event"));
  private entityOfInterest = new BehaviorSubject<Object>({});
  private targetOfInterest = new BehaviorSubject<Object>({});
  private closedRelationship = new BehaviorSubject<Object>({});
  private isObjectPartOfRecursiveRelation = new BehaviorSubject<Object>({});

  constructor(private http: HttpClient, 
    private appContextService: AppContextService,
    private stringConstants: StringConstants,
    private windowRefService: WindowRefService,
    private globalService: GlobalService,
    private variableService: VariableService) { 
    this.appContext = this.appContextService.getAppContext();
  }
    
  latestEventFromChild = this.eventFromChild.asObservable();
  setLatestEventFromChild(event) {
    this.eventFromChild.next(event);
  }

  currentEntityOfInterest = this.entityOfInterest.asObservable();
  changeEntityOfInterest(obj){
    this.entityOfInterest.next(obj);
  }

  currentTargetOfInterest = this.targetOfInterest.asObservable();
  changeTargetOfInterest(obj){
    this.targetOfInterest.next(obj);
  }

  closedChildRelationship = this.closedRelationship.asObservable();
  sendChildRelationshipClosed(obj){
    this.closedRelationship.next(obj);
  }

  isPartOfRecursiveRelation = this.isObjectPartOfRecursiveRelation.asObservable();
  emitIsPartOfRecursiveRelation(obj){
    this.isObjectPartOfRecursiveRelation.next(obj);
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  getOrgchartRelationships(entity, clientId): Observable<any>{
    return this.http.get(this.appContext.context + PathConstats.orgchartRelationships + entity + '&clientId=' + clientId).pipe(
      map(this.extractData),
      catchError(handleErrorReason));
  }

  getOptionsForLevelUp(dn, relationshipkey, clientId): Observable<any>{
    let queryParams: HttpParams = new HttpParams();
    queryParams = queryParams.append('dn', dn);
    queryParams = queryParams.append('relationshipkey', relationshipkey);
    queryParams = queryParams.append('clientId', clientId);
    const options = { params: queryParams };
    return this.http.get(this.appContext.context + PathConstats.orgchartLevelupOptions, options).pipe(
      map(this.extractData),
      catchError(handleErrorReason)
    );
  }

  getOrgchart(relationshipkey, entityDN, entityDefKey, clientId, nextIndex, size): Observable<any>{
    let queryParams: HttpParams = new HttpParams();
    queryParams = queryParams.append('relationshipKeys', relationshipkey);
    queryParams = queryParams.append('entityDN',entityDN);
    queryParams = queryParams.append('entityDefKey',entityDefKey);
    queryParams = queryParams.append('clientId',clientId);
    queryParams = queryParams.append('nextIndex',nextIndex);
    queryParams = queryParams.append('size',size);
    const options = { params: queryParams };
    return this.http.get(this.appContext.context + PathConstats.orgChart, options).pipe(
      map(this.extractData),
      catchError(handleErrorReason)
    );
  }

  navigateToEntityInfo(orgChartEntityInfoNode: OrgChartEntityInfoNode) {
    const entityDetailLink = this.getEntityLink(orgChartEntityInfoNode);
    this.windowRefService.nativeWindow.location.href = entityDetailLink;
  }

  sendEmail(emailType,orgChartEntityInfoNode: OrgChartEntityInfoNode) {
    switch (emailType) {
      case 'new-email' : this.openMail(orgChartEntityInfoNode);
                         break;
      case 'email-info': this.sendSelectedEntityInfoMail(orgChartEntityInfoNode);
                         break;
      case 'email-team': this.sendMailToTargets(orgChartEntityInfoNode);
                         break;
      default          : break;
    }
  }

  /* */
  sendMailToTargets(orgChartEntityInfoNode: OrgChartEntityInfoNode) {
    // get the email attribute value of the targets
    let selectedEntityTargetEmail = '';
    const mailIDSeparator = '; ';
    let count = 0;
    for (const target of orgChartEntityInfoNode.targets[0].orgChartEntityNodes) {
      if(!this.variableService.isUndefinedOrNull(target.emailAttribute)){
        selectedEntityTargetEmail += target.emailAttribute;
      }
      count++;
      if (count < orgChartEntityInfoNode.targets[0].orgChartEntityNodes.length) {
        selectedEntityTargetEmail += mailIDSeparator;
      }
    }
    this.windowRefService.nativeWindow.location.href = 'mailto:' + selectedEntityTargetEmail;
  }

  sendSelectedEntityInfoMail(orgChartEntityInfoNode: OrgChartEntityInfoNode) {
    const newLine = escape('\n\n');
    const loggedInUserFullName = this.globalService.loggedInUserDetails.fullName;
    const entityDetailLink = this.getEntityLink(orgChartEntityInfoNode);
    const infoURL = this.windowRefService.nativeWindow.location.origin + entityDetailLink;
    const subject = this.stringConstants.informationAbout + orgChartEntityInfoNode.primaryAttrsDisplayValue;
    const message = this.stringConstants.greetings + newLine +
    this.stringConstants.mailBodyMessage + orgChartEntityInfoNode.primaryAttrsDisplayValue + ':' + newLine +
    infoURL + newLine + this.stringConstants.regards + newLine + loggedInUserFullName + '.';
    this.windowRefService.nativeWindow.location.href = 'mailto:?subject=' + subject + '&body=' + message;
  }

  /* Compose a mail with 'To' as selected entity email attribute value */
  openMail(orgChartEntityInfoNode: OrgChartEntityInfoNode) {
    // get the email attribute value
    let selectedEntityEmail;
    if(!this.variableService.isUndefinedOrNull(orgChartEntityInfoNode.emailAttribute)){
      selectedEntityEmail = orgChartEntityInfoNode.emailAttribute;
    }
    this.windowRefService.nativeWindow.location.href = 'mailto:' + selectedEntityEmail;
  }

  private getEntityLink(orgChartEntityInfoNode: OrgChartEntityInfoNode) {
    let entityDetailLink = '';
    if (orgChartEntityInfoNode.entityDefinitionKey.toLowerCase() === UIConstants.userDefKey) {
      entityDetailLink = PathConstats.userCatalogPath + this.windowRefService.nativeWindow.encodeURIComponent(orgChartEntityInfoNode.entityKey);
    } else {
      entityDetailLink = this.windowRefService.nativeWindow.location.pathname + PathConstats.entitiesCatalogPath + orgChartEntityInfoNode.entityDefinitionKey;
    }
    return entityDetailLink;
  }

}
