
import {throwError as observableThrowError, Observable,  BehaviorSubject} from 'rxjs';

import {mergeMap, catchError, switchMap, take, filter, finalize, flatMap} from 'rxjs/operators';
import {Injectable, Injector} from "@angular/core";
import {HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse} from "@angular/common/http";
import {AppAuthenticationService} from "../services/authentication/app-authentication.service";
import {HeaderConstants} from "../constants/header-constants";
import {CookiesService} from "../services/utilities/util_cookies/cookies.service";
import { VariableService } from '../services/utilities/util_variable/variable.service';
import { WindowRefService } from '../services/utilities/util_winRef/window-ref.service';

@Injectable()
export class InterceptedHttp implements HttpInterceptor {

  replayRequestURL: string | Request;
  authenticationInProgress: boolean = false;
  changePasswordInProgress: boolean  = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private injector: Injector, private cookiesService: CookiesService, private variableService: VariableService, private windowRefService: WindowRefService) {
    
  }

  addToken(req: HttpRequest<any>): HttpRequest<any> {
    let spiffyCookie = this.cookiesService.getCookie('MFSSO_Admin_Spiffy_Session');
    if (spiffyCookie != undefined && !spiffyCookie.includes("undefined")) {
      let spiffyComponents = spiffyCookie.split(',');
      return req.clone({ setHeaders: { 
          Authorization: spiffyComponents[0] + ' ' + spiffyComponents[1],
          'Content-Type': HeaderConstants.applicationJson,
          'Cache-Control': HeaderConstants.noCacheNoStoreMustRevalidate,
          'pragma': HeaderConstants.noCache,
          'expires': HeaderConstants.zero,
          'refresh': HeaderConstants.daySeconds,
          'netiq_idm_rbpm_acsrf': this.cookiesService.getCookie(HeaderConstants.headerName)?this.cookiesService.getCookie(HeaderConstants.headerName):''
        }
      });
    }
    return req;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    
    return next.handle(this.addToken(req)).pipe(
        catchError(error => {
            if (error instanceof HttpErrorResponse) {
                switch ((<HttpErrorResponse>error).status) {
                    case 400:
                        return this.handle400Error(error);
                    case HeaderConstants.unauthorizedResponse:
                        return this.handle401Error(req, next);
                    case HeaderConstants.changePWDResponse:
                      return this.handleRedirectToSSPRChangePassword(req, next);
                    default:
                        return observableThrowError(error);
                }
            } else {
                return observableThrowError(error);
            }
        }));
   }

    handle400Error(error) {
        if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
            // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
            return this.logoutUser();
        }
        return observableThrowError(error);
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler) {
      const spiffyCookie = this.cookiesService.getCookie('MFSSO_Admin_Spiffy_Session');
      const authService = this.injector.get(AppAuthenticationService);
      this.windowRefService.nativeWindow.localStorage.setItem('callingAdminPage', this.windowRefService.nativeWindow.location.href);

      if (this.variableService.isUndefinedOrNull(spiffyCookie) || spiffyCookie.includes('undefined')) {
        authService.getNewToken();
      } else if(!this.authenticationInProgress) {
          this.authenticationInProgress = true;
          // Reset here so that the following requests wait until the token
          // comes back from the refreshToken call.
          this.tokenSubject.next(null);
          
          return authService.refreshToken().pipe(
              switchMap((tokenResponse: any) => {
                  if (tokenResponse) {
                    authService.onSuccessOfRefreshToken(tokenResponse);
                    this.tokenSubject.next(tokenResponse.access_token);
                    return next.handle(this.addToken(req));
                  }

                  // If we don't get a new token, we are in trouble so logout.
                  return this.logoutUser();
              }),
              catchError(error => {
                  // If there is an exception calling 'refreshToken', bad news so logout.
                  return this.logoutUser();
              }),
              finalize(() => {
                  this.authenticationInProgress = false;
              }),);
      } else {
        authService.collectFailedRequest(req);
        return this.tokenSubject.pipe(
          filter(token => token != null),
          take(1),
          switchMap(token => {
              return next.handle(this.addToken(req));
          }),);
      }
    }

    logoutUser() {
        const authService = this.injector.get(AppAuthenticationService);
        // Route to the login page
        authService.logout();
        return observableThrowError("");
    }

  handleRedirectToSSPRChangePassword(req: HttpRequest<any>, next: HttpHandler) {
    let emitter;
    let changePasswordFinishedObservable: Observable<number> = new Observable(e => {
      emitter = e;
    });
    let changePasswordFinishedCallback = (url, options) => {
      this.replayRequestURL = url;
      this.changePasswordInProgress = false;
      emitter.next();
    };
    let changePasswordFrameAddedCallback = () => {
      this.changePasswordInProgress = true;
    };
    this.injector.get(AppAuthenticationService).changePassword(changePasswordFinishedCallback, changePasswordFrameAddedCallback, this.changePasswordInProgress);
    return changePasswordFinishedObservable.pipe(switchMap(() => {
      return next.handle(this.addToken(req));
    }));
  }

}
