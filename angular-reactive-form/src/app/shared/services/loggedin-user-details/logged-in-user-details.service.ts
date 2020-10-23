
import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {PathConstats} from "../../constants/path-constants";
import {AppContextService} from "../context/app-context.service";
import {Context} from "../../schemas/app-context-schema";
import {handleError} from "../../factories/handle-error.factory";

@Injectable({
  providedIn: 'root'
})
export class LoggedInUserDetailsService {

  appContext: Context;
  constructor(private http: HttpClient, private appContextService: AppContextService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res) {
    let body = res;
    return body || {};
  }

  getDetails(): Observable<any> {
    return this.http.get(this.appContext.context+PathConstats.loggedInUserDetailsApi).pipe(
      map(this.extractData),
      catchError(handleError),);
  }

}
