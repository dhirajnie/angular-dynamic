
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { PathConstats } from "../../../constants/path-constants";
import { AppContextService } from "../../context/app-context.service";
import { Context } from "../../../schemas/app-context-schema";
import { handleError } from "../../../factories/handle-error.factory";

@Injectable()
export class CatalogContainersService {

  appContext: Context;

  constructor(private http: HttpClient, private appContextService: AppContextService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res) {
    let body = res;
    if (body != undefined && body != null && body.subContainers != undefined && body.subContainers != null) {
      let dn = body.dn
      if (dn != undefined && dn != null){
        body.id = dn;
      }
      for (let i = 0; i < body.subContainers.length; ++i) {
        body.subContainers[i].type = "container";
        let sdn = body.subContainers[i].dn;
        if (sdn != undefined && sdn != null){
          body.subContainers[i].id = sdn;
        }
      }
    }
    return body || {};
  }

  getSubContainersList(container): Observable<any> {
    return this.http.post(this.appContext.context + PathConstats.roleContainersApi, container).pipe(
      map(this.extractData),
      catchError(handleError),);
  }

}
