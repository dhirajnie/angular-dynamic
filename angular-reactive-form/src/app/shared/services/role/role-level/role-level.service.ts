
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Context } from "../../../schemas/app-context-schema";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { AppContextService } from "../../context/app-context.service";
import { handleError } from "../../../factories/handle-error.factory";
import { PathConstats } from "../../../constants/path-constants";

@Injectable()
export class RoleLevelService {

  appContext: Context;

  constructor(private http: HttpClient, private appContextService: AppContextService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res) {
    let body = res;
    return body || {};
  }

  getRoleLevels() {
    return this.http.get(this.appContext.context + PathConstats.roleLevelsApi).pipe(
      map(this.extractData),
      catchError(handleError),);
  }

}
