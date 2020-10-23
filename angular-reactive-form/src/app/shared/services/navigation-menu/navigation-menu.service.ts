
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { PathConstats } from "../../constants/path-constants";
import { AppContextService } from "../context/app-context.service";
import { Context } from "../../schemas/app-context-schema";
import { handleError } from "../../factories/handle-error.factory";

@Injectable({
  providedIn: 'root'
})
export class NavigationMenuService {

  appContext: Context;
  private dataSubject = new ReplaySubject<any>(1);
  data$: Observable<any> = this.dataSubject.asObservable();

  constructor(private http: HttpClient, private appContextService: AppContextService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res) {
    let body = res;

    return body || {};
  }

  getNavRights(): Observable<any> {
    return this.data$;
  }

  takeUpdate() {
    return this.http.post(this.appContext.context + PathConstats.navigationMenuApi, {}).pipe(
      map(this.extractData),
      catchError(handleError),)
      .subscribe(res => this.dataSubject.next(res));
  }
}
