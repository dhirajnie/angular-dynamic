
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Context } from "../../schemas/app-context-schema";
import { AppContextService } from "../context/app-context.service";
import { PathConstats } from "../../constants/path-constants";
import { handleError } from "../../factories/handle-error.factory";
import { Locale, Locales } from "../../schemas/locale-schema";

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  appContext: Context;
  private supportedLocalesSubject = new ReplaySubject<Locales>(1);
  supportedLocales$: Observable<Locales> = this.supportedLocalesSubject.asObservable();

  private userLocaleSubject = new ReplaySubject<string[]>(1);
  userLocale$: Observable<String[]> = this.userLocaleSubject.asObservable();

  private defaultLocaleSubject = new ReplaySubject<string[]>(1);
  defaultLocale$: Observable<String[]> = this.defaultLocaleSubject.asObservable();

  constructor(private http: HttpClient, private appContextService: AppContextService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res) {
    let body = res;
    return body || {};
  }

  getSupportedLocales(): Observable<Locales> {
    return this.supportedLocales$;
  }

  getUserLocale(): Observable<any> {
    return this.userLocale$;
  }

  getDefaultLocale(): Observable<any> {
    return this.defaultLocale$;
  }

  getUserLocaleUncached(appContext): Observable<any> {
    return this.http.get(appContext.context  +'/supportedlocales/userlocale', {}).pipe(
    map((res)=>res));
  }

  takeUpdate() {
    this.http.get(this.appContext.context + PathConstats.supportedLocalesApi, {}).pipe(
      map(this.extractData),
      catchError(handleError),)
      .subscribe(res => this.supportedLocalesSubject.next(res));

  }
  load(){
    this.takeUpdate();
  }

}
