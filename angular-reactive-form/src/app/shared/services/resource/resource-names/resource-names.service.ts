
import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import { HttpClient, HttpResponse, HttpRequest, HttpParams } from "@angular/common/http";
import {PathConstats} from "../../../constants/path-constants";
import {AppContextService} from "../../context/app-context.service";
import {Context} from "../../../schemas/app-context-schema";
import {handleError} from "../../../factories/handle-error.factory";
import { VariableService } from "../../utilities/util_variable/variable.service";

@Injectable()
export class ResourceNamesService {

  appContext: Context;

  constructor(private http: HttpClient, private appContextService: AppContextService, variableService: VariableService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res) {
    let body = res;
    return body || {};
  }

  validateResourceNames(data): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.validateResourceNames, data).pipe(
      map(this.extractData),
      catchError(handleError),);
  }

}
