// import {Injectable} from '@angular/core';
// import {HttpRequest} from "@angular/common/http";
// import {HeaderConstants} from "../../../constants/header-constants";
// import {CookiesService} from "../util_cookies/cookies.service";

// @Injectable()
// export class DefaultRequestOptionsService extends HttpRequest {

//   constructor(private cookieService: CookiesService) {
//     super();
//   }

//   merge(options) {
//     var newOptions = super.merge(options);
//     newOptions.headers.set('Content-Type', 'application/json');
//     newOptions.headers.set(HeaderConstants.cacheControl, HeaderConstants.noCacheNoStoreMustRevalidate);
//     newOptions.headers.set(HeaderConstants.pragma, HeaderConstants.noCache);
//     newOptions.headers.set(HeaderConstants.expires, HeaderConstants.zero);
//     newOptions.headers.set(HeaderConstants.refresh, HeaderConstants.daySeconds);
//     newOptions.headers.set("sample", "sample");

//     let headerValue = this.cookieService.getCookie(HeaderConstants.headerName);
//     if (headerValue != null) {
//       newOptions.headers.set(HeaderConstants.headerName, headerValue);
//     }
//     let spiffyCookie = this.cookieService.getCookie('MFSSO_Admin_Spiffy_Session');
//     if (spiffyCookie != undefined) {
//       let spiffyComponents = spiffyCookie.split(',');
//       newOptions.headers.set(HeaderConstants.authorization, spiffyComponents[0] + ' ' + spiffyComponents[1]);
//     }
//     return newOptions;
//   }
// }
