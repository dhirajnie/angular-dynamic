import { Injectable } from '@angular/core';
import {DocumentRefService} from "../util_docRef/document-ref.service";

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  constructor(private documentRef: DocumentRefService) { }

  getCookie(name: string): string {
    const nameLenPlus = (name.length + 1);
    return this.documentRef.nativeDocument.cookie
        .split(';')
        .map(c => c.trim())
        .filter(cookie => {
          return cookie.substring(0, nameLenPlus) === `${name}=`;
        })
        .map(cookie => {
          return decodeURIComponent(cookie.substring(nameLenPlus));
        })[0] || null;
  }

  setCookie(name: string, value: string , path: string = '', cookieSecure: boolean = false, domain: string = '', expireDays?: number) {
    let d:Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    let expires:string = `expires=${d.toUTCString()}`;
    let cpath:string = path ? `; path=${path}` : '';
    let cDomain:string = domain ? `; domain=${domain}` : '';
    let cSecure:string = cookieSecure ? `; secure=${cookieSecure}` : '';

    this.documentRef.nativeDocument.cookie = `${name}=${value}; ${expires}${cpath}${cSecure}${cDomain}`;
  }

  deleteCookie(name: string, cookieSecure: boolean = false, path: string = '/', domain = '') {
    this.setCookie(name, "", path, cookieSecure, domain, -1);
  }

  clearAllCookies(applicationDomain,cookieSecure) {
    const cookieList = this.documentRef.nativeDocument.cookie.split(';');
    // todo : should we read domain used by IG and other components and pass it while deleting the cookie
    for (let i = 0; i < cookieList.length; i++) {
      let cookieName = cookieList[i].trim();
      const eqOffset = cookieName.indexOf('=');
      if (eqOffset >= 0) {
        cookieName = cookieName.substring(0, eqOffset);
      }
      
      if (cookieName.indexOf('MFSSO_') === 0) {
        if (applicationDomain && applicationDomain != null && applicationDomain != 'undefined' && applicationDomain != "") {
           this.deleteCookie(cookieName, cookieSecure, '/', applicationDomain);
        } else {
          this.deleteCookie(cookieName, cookieSecure, '/');
        }
      }
    }
  }

}
