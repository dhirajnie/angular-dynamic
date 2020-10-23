
import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Context } from "../../schemas/app-context-schema";
import { AppContextService } from "../context/app-context.service";
import { PathConstats } from "../../constants/path-constants";
import { handleError } from "../../factories/handle-error.factory";
import { UserRights } from "../../schemas/user-rights-schema";

@Injectable()
export class UserRightsService {

  appContext: Context;
  private dataSubject = new ReplaySubject<UserRights>(1);
  data$: Observable<UserRights> = this.dataSubject.asObservable();

  constructor(private http: HttpClient, private appContextService: AppContextService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  getUserRights(): Observable<UserRights> {
    return this.data$;
  }

  takeUpdate() {
    this.http.get(this.appContext.context + PathConstats.userRightsApi, {}).pipe(
      catchError(handleError))
      .subscribe((res: UserRights) => this.dataSubject.next(res));
  }

}