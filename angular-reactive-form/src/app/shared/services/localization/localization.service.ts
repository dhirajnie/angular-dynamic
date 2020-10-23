import {of as observableOf, ReplaySubject,  Observable } from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class LocalizationService {
  filepath: any;
  public _localjson = {};
  private _userLocale: string;
  private _defaultLocale: string;
  public project = new ReplaySubject(1);

  constructor(private http: HttpClient) {
  }

  public load() {
    this.project.next(this.userLocale);
  }

  getLocalJson() {
    return this.localjson;
  }

  public getLocalJsonOb(): Observable<any> {
    return observableOf(this.localjson);
  }

  get userLocale(): string {
    return this._userLocale;
  }

  set userLocale(value: string) {
    this._userLocale = value;
    //to use in translation framework
    localStorage.setItem('userCurrentLocale', value);
  }

 get localjson(): any {
    return this._localjson;
  }

  set localjson(value: any) {
    this._localjson = value;
  }

  get defaultLocale(): string {
    return this._defaultLocale;
  }

  set defaultLocale(value: string) {
    this._defaultLocale = value;
  }


}
