
import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {handleError} from "../../factories/handle-error.factory";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AboutService {

  constructor(private http: HttpClient) {
  }

  // private extractData(res: Response) {
  //   let body = res;
  //   return body || {};
  // }

  getAboutDetails(): Observable<any> {
    return this.http.get("build-info.json").pipe(
      catchError(handleError));
  }

}
