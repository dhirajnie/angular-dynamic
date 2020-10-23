import { Injectable } from '@angular/core';

@Injectable()
export class AppLoadingService {
   get appLoading(): boolean {
    return this._appLoading;
  }

   set appLoading(value: boolean) {
    this._appLoading = value;
  }

   get TableDataLoading(): boolean {
    return this._TableDataLoading;
  }

  get ComponentLoading(): boolean {
    return this._ComponentLoading;
  }

  set TableDataLoading(value: boolean) {
    this._TableDataLoading = value;
  }
  set ComponentLoading(value: boolean) {
    this._ComponentLoading = value;
  }

  private _appLoading: boolean = true;
  private _TableDataLoading: boolean = false;
  private _ComponentLoading: boolean = false;

  constructor() { }

}
