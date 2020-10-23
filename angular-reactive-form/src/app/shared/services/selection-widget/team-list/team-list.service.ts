
import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import { HttpClient, HttpResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import {PathConstats} from "../../../constants/path-constants";
import {AppContextService} from "../../context/app-context.service";
import {Context} from "../../../schemas/app-context-schema";
import {handleError} from "../../../factories/handle-error.factory";

@Injectable()
export class TeamListService {

  appContext: Context;

  constructor(private http: HttpClient, private appContextService: AppContextService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res: any) {
    let body = res;
    if (body != undefined && body != null && body.teams != undefined && body.teams != null) {
      for (let i = 0; i < body.teams.length; ++i) {
        body.teams[i].type = "team";
      }
    }
    return body || {};
  }

  private extractTeamMembersData(res: any) {
    let body = res;
    if (body != undefined && body != null && body.recipients != undefined && body.recipients != null) {
      for (let i = 0; i < body.recipients.length; ++i) {
        body.recipients[i].type = "user";
      }
    }
    return body || {};
  }

  getTeamList(query: string, nextIndex: number, paginationSize: number, teamType: String): Observable<any> {
    if (query == undefined || query == null || query == "") {
      query = "*"
    };
    if (nextIndex == undefined || nextIndex == null || nextIndex < 1) {
      nextIndex = 1;
    }
    if (paginationSize == undefined || paginationSize == null || paginationSize <= 0 || paginationSize > 300) {
      paginationSize = 10;
    }
    if (teamType == undefined || teamType == null || teamType == "") {
        teamType = "A"
    };

    let params: HttpParams = new HttpParams();
    params = params.set('q', query);
    params = params.set('size', paginationSize.toString());
    params = params.set('nextIndex', nextIndex.toString());
    params = params.set('type', teamType.toString());
    const requestOptions = {
      params: params
    };
    return this.http.get(this.appContext.context + PathConstats.teamsListApi, requestOptions).pipe(
      map(this.extractData),
      catchError(handleError),);
  }

  getTeamMembersList(query: string, nextIndex: number, paginationSize: number, teamDN: any): Observable<any> {
    if (query == undefined || query == null || query == "") {
      query = "*"
    };
    if (nextIndex == undefined || nextIndex == null || nextIndex < 1) {
      nextIndex = 1;
    }
    if (paginationSize == undefined || paginationSize == null || paginationSize <= 0 || paginationSize > 300) {
      paginationSize = 10;
    }

    let myParams: HttpParams = new HttpParams();
    myParams = myParams.set('q', query);
    myParams = myParams.set('size', paginationSize.toString());
    myParams = myParams.set('nextIndex', nextIndex.toString());
    const requestOptions = {
      params: myParams
    };
    let teamsObj = {
      "teams": [
        {
          "dn": teamDN
        }
      ]
    }
    return this.http.post(this.appContext.context + PathConstats.teamMembersListApi, teamsObj, requestOptions).pipe(
      map(this.extractTeamMembersData),
      catchError(handleError),);
  }

}
