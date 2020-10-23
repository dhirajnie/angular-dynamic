
import {catchError} from 'rxjs/operators';
import { HeaderConstants } from './../../constants/header-constants';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient } from '@angular/common/http';
import { AppContextService } from "../context/app-context.service";
import { PathConstats } from "../../constants/path-constants";
import { WindowRefService } from "../utilities/util_winRef/window-ref.service";
import { DocumentRefService } from "../utilities/util_docRef/document-ref.service";
import { CookiesService } from "../utilities/util_cookies/cookies.service";
import { VariableService } from '../../../shared/services/utilities/util_variable/variable.service';
import { LogoutService } from '../../../shared/services/logout/logout.service';
import {of as observableOf,  Observable } from 'rxjs';
import {delay, map} from 'rxjs/operators';

type finishedLoginCallbackType = (Request, RequestOptionsArgs) => any;
type finishedChangePasswordCallbackType = (Request, RequestOptionsArgs) => any;
type loginFrameAddedCallbackType = () => any;
type changePasswordFrameAddedCallbackType = () => any;

@Injectable({
  providedIn: 'root'
})
export class AppAuthenticationService {

  finishedLoginCallback: finishedLoginCallbackType;
  finishedChangePasswordCallback: finishedChangePasswordCallbackType;
  changePasswordFrameAddedCallback: changePasswordFrameAddedCallbackType;
  loginFrameAddedCallback: loginFrameAddedCallbackType;
  replayRequestURL: string | Request;
  authenticationInProgress: boolean;
  changePasswordInProgress: boolean;
  authInvalidResponse: boolean = false;
  changePasswordUrl: string;

  failedRequestFinishedLoginCallbacks: finishedLoginCallbackType[] = [];
  failedRequestFinishedLoginCallbacksParameter1: (string | Request)[] = [];

  cachedRequests: Array<HttpRequest<any>> = [];

  constructor(private appContext: AppContextService,
    private windowRefService: WindowRefService,
    private documentRefService: DocumentRefService,
    private cookies: CookiesService,
    private variableService: VariableService,
    private http: HttpClient,
    private logoutService: LogoutService) {
  }

  getContext() {
    return this.appContext.getAppContext().context;
  }

  getAuthServerAuthorizeUrl() {
    return this.appContext.getAppContext().authorize;
  }

  getAuthserverLogoutUrl() {
    return this.appContext.getAppContext().logout;
  }

  getRRAClientId() {
    return this.appContext.getAppContext().rraClientId;
  }

  getRRARedirectUrl() {
    return this.appContext.getAppContext().rraRedirectUrl;
  }

  getResponseType() {
    return 'code';
  }

  getRestAccessURL() {
    this.appContext.getAppContext().context + PathConstats.restAccess;
  }

  getRestCatalogURL() {
    this.appContext.getAppContext().context + PathConstats.restCatalog;
  }

  getAuthUrl() {
    return this.getAuthServerAuthorizeUrl() + "?redirect_uri=" + this.getRRARedirectUrl() + "&client_id=" + this.getRRAClientId() + "&response_type=" + this.getResponseType();
  }

  getRefreshTokenUrl() {
    return PathConstats.refreshTokenAPI;
  }

  getExtendSessionUrl() {
    return this.appContext.getAppContext().extendSession;
  }

  getSSPRChangePasswordUrl() {
    this.changePasswordUrl = this.appContext.getAppContext().ssprRedirectUrl;
    this.changePasswordUrl = this.changePasswordUrl.substring(0, this.changePasswordUrl.indexOf('sspr')) + "sspr/private/changepassword";
    return this.changePasswordUrl;
  }

  getNewToken() {
    const authURL = this.getAuthUrl();
    this.windowRefService.nativeWindow.location.href = authURL;
  }

  public collectFailedRequest(request): void {
    this.cachedRequests.push(request);
  }

  // public retryFailedRequests(): void {
  //    retry the requests. this method can
  //    be called after the token is refreshed
  // }

  refreshToken(): Observable<any> {
    const refreshTokenURL = this.getRefreshTokenUrl();
    return this.http.get(refreshTokenURL).pipe(
      catchError((error: any): any => {
        /*
          If the refresh token call results in exception, then 'MFSSO_Admin_Spiffy_Session' 
          and 'Refresh_Token' are removed from cookie, so that subsequent api calls
          resulting 401 will redirect to login page
        */
        console.error(error);
        if (error.status === HeaderConstants.refreshTokenErrorResponse) {
          this.getNewToken();
        } else {
          this.logoutService.logout();
        }
      }),
      map( response => {
        if (!this.variableService.isEmptyString(response) && Object.keys(response).length !== 0) {
          return response;
        }
      })
      );
      //return observableOf(this.authTokenNew).pipe(delay(200));
  }

  onSuccessOfRefreshToken(response){
    const domain = this.windowRefService.nativeWindow.localStorage.getItem('app-domain');
    let cookieSecure = false;
    if (this.windowRefService.nativeWindow.location.protocol.includes('https')) {
      cookieSecure = true;
    }
    if (!this.variableService.isEmptyString(response) && Object.keys(response).length !== 0) {
      if (!this.variableService.isEmptyString(domain)) {
        this.cookies.setCookie('MFSSO_Admin_Spiffy_Session', response.token_type + ',' + response.access_token, '/', cookieSecure, domain);
      } else {
        this.cookies.setCookie('MFSSO_Admin_Spiffy_Session', response.token_type + ',' + response.access_token, '/', cookieSecure);
      }

      const extendSessionUrl = this.getExtendSessionUrl();
      if (extendSessionUrl) {
        this.http.get(extendSessionUrl, { withCredentials: true, responseType: 'text' }).subscribe();
      }

      this.windowRefService.nativeWindow.localStorage.setItem('last-access', Date.now());

    } else {
      if (response.status === HeaderConstants.refreshTokenErrorResponse) {
        this.getNewToken();
      } else {
         /*
      Problem while fetching the token information using refresh token, hence redirect to login page
      */
      this.logoutService.logout();
      }
    }
  }

  logout(){
    this.logoutService.logout();
  }

  // startAuthentication(finishedLoginCallback: finishedLoginCallbackType, loginFrameAddedCallback: loginFrameAddedCallbackType, authenticationInProgress, replayRequestURL, replayRequestOptionsArgs) {
  //   this.finishedLoginCallback = finishedLoginCallback;
  //   this.replayRequestURL = replayRequestURL;
  //   this.replayRequestOptionsArgs = replayRequestOptionsArgs;
  //   this.authenticationInProgress = authenticationInProgress;
  //   if (!this.authenticationInProgress || this.authInvalidResponse) {
  //     if (!this.authInvalidResponse) {
  //       this.failedRequestFinishedLoginCallbacks.length = 0;
  //       this.failedRequestFinishedLoginCallbacksParameter1.length = 0;
  //       this.failedRequestFinishedLoginCallbacksParameter2.length = 0;
  //     }
  //     this.loginFrameAddedCallback = loginFrameAddedCallback;
  //     let cookieSecure = false;
  //     if (this.windowRefService.nativeWindow.location.protocol.includes('https')) {
  //       cookieSecure = true;
  //     }
  //     const domain = this.windowRefService.nativeWindow.localStorage.getItem('app-domain');
  //     /*
  //       'MFSSO_Admin_Spiffy_Session' cookie is used distinguish between new token and refresh token
  //       If cookie is not found then redirecting to OSP, OSP with code redirects to OAuthServlet.
  //       OAuthServlet sets 'MFSSO_Admin_Spiffy_Session', 'Refresh_Token' and redirects to location 'idmdash'
  //     */
  //     const spiffyCookie = this.cookies.getCookie('MFSSO_Admin_Spiffy_Session');
  //     /*
	// 			Perform new token/refresh token calls only if the user is logged in 
	// 		*/
  //     this.windowRefService.nativeWindow.localStorage.setItem('callingAdminPage', this.windowRefService.nativeWindow.location.href);
  //     /*
  //       Perform new token/refresh token calls only if the user is logged in 
  //     */
  //     if (this.variableService.isUndefinedOrNull(spiffyCookie) || spiffyCookie.includes('undefined')) {
  //       /*
  //         Calling OSP for new token
  //       */
  //       this.getNewToken();
  //     } else {
  //       /*
  //         With refresh token(will be stored in session object) get a new access token and/or refresh token ,
  //         new refresh token may or may not returned.
  //         Set the access token and refresh token obtained into cookie
  //       */
  //       const refreshTokenURL = this.getRefreshTokenUrl();
  //       this.http.get(refreshTokenURL).pipe(
  //         catchError((error: any): any => {
  //           /*
  //             If the refresh token call results in exception, then 'MFSSO_Admin_Spiffy_Session' 
  //             and 'Refresh_Token' are removed from cookie, so that subsequent api calls
  //             resulting 401 will redirect to login page
  //           */
  //           console.error(error);
  //           if (error.status === HeaderConstants.refreshTokenErrorResponse) {
  //             this.getNewToken();
  //           } else {
  //             this.logoutService.logout();
  //           }
  //         }))
  //         .subscribe(response => {
  //           if (!this.variableService.isEmptyString(response) && Object.keys(response).length !== 0) {
  //             if (!this.variableService.isEmptyString(domain)) {
  //               this.cookies.setCookie('MFSSO_Admin_Spiffy_Session', response.token_type + ',' + response.access_token, '/', cookieSecure, domain);
  //             } else {
  //               this.cookies.setCookie('MFSSO_Admin_Spiffy_Session', response.token_type + ',' + response.access_token, '/', cookieSecure);
  //             }

  //             const extendSessionUrl = this.getExtendSessionUrl();
  //             if (extendSessionUrl) {
  //               this.http.get(extendSessionUrl, { withCredentials: true }).subscribe();
  //             }

  //             this.windowRefService.nativeWindow.localStorage.setItem('last-access', Date.now());

  //             this.authenticationComplete();
  //           } else {
  //             if (response.status === HeaderConstants.refreshTokenErrorResponse) {
  //               this.getNewToken();
  //             } else {
  //                /*
  //             Problem while fetching the token information using refresh token, hence redirect to login page
  //             */
  //             this.logoutService.logout();
  //             }
  //           }
  //         }, error => {
  //           /*
  //             If the refresh token call results in exception, then 'MFSSO_Admin_Spiffy_Session' 
  //             and 'Refresh_Token' are removed from cookie, so that subsequent api calls
  //             resulting 401 will redirect to login page
  //           */
  //           console.error(error);
  //           if (error.status === HeaderConstants.refreshTokenErrorResponse) {
  //             this.getNewToken();
  //           } else {
  //             this.logoutService.logout();
  //           }
  //         });
  //     }

  //     this.loginFrameAddedCallback();
  //   }
  //   this.failedRequestFinishedLoginCallbacks.push((a, b) => finishedLoginCallback(a, b));
  //   this.failedRequestFinishedLoginCallbacksParameter1.push(replayRequestURL);
  //   this.failedRequestFinishedLoginCallbacksParameter2.push(replayRequestOptionsArgs);
  // }

  // authenticationComplete() {
  //   for (let i = 0; i < this.failedRequestFinishedLoginCallbacks.length; ++i) {
  //     const param1 = this.failedRequestFinishedLoginCallbacksParameter1[i];
  //     const param2 = this.failedRequestFinishedLoginCallbacksParameter2[i];
  //     this.failedRequestFinishedLoginCallbacks[i](param1, param2);
  //   }
  //   this.authInvalidResponse = false;
  //   this.failedRequestFinishedLoginCallbacks.length = 0;
  //   this.failedRequestFinishedLoginCallbacksParameter1.length = 0;
  //   this.failedRequestFinishedLoginCallbacksParameter2.length = 0;
  // }

  changePassword(finishedChangePasswordCallback: finishedChangePasswordCallbackType, changePasswordFrameAddedCallback: changePasswordFrameAddedCallbackType, changePasswordInProgress) {
    this.finishedChangePasswordCallback = finishedChangePasswordCallback;
    // this.replayRequestURL = replayRequestURL;
    this.changePasswordInProgress = changePasswordInProgress;
    if (!this.changePasswordInProgress) {
      this.changePasswordFrameAddedCallback = changePasswordFrameAddedCallback;
      this.windowRefService.nativeWindow.addEventListener('message', this.changePasswordComplete, false);
      let changePasswordFrame = this.documentRefService.nativeDocument.createElement("IFRAME");
      changePasswordFrame.setAttribute('id', 'ssprframe');
      changePasswordFrame.setAttribute('seamless', 'true');
      changePasswordFrame.setAttribute('class', 'level-max');
      changePasswordFrame.setAttribute('src', this.getSSPRChangePasswordUrl());
      changePasswordFrame.setAttribute('style', 'position: fixed;left: 0px;top: 0px;width: 100%;height: 100%;z-index: 5000;');
      this.documentRefService.nativeDocument.body.appendChild(changePasswordFrame);
      this.changePasswordFrameAddedCallback();
    }
  }

  changePasswordComplete() {
    let oauthFrame = this.documentRefService.nativeDocument.getElementById("ssprframe");
    if (oauthFrame != null) {
      oauthFrame.parentNode.removeChild(oauthFrame);
    }
    this.changePasswordInProgress = false;
  }
}
