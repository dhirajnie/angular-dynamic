import { VariableService } from './../utilities/util_variable/variable.service';
import {Injectable, OnInit} from '@angular/core';
import {LocalizationService} from "../localization/localization.service";
import { TranslateService as angularTranslateService } from "@ngx-translate/core";

@Injectable()
export class TranslateService implements OnInit{
  localeJson:any;
  constructor(private LocalizationService:LocalizationService,private vutils :VariableService, private angularTranslateService: angularTranslateService) {
   this.setLanguage();
  }

  get(key){
    // this.setLanguage();
    this.localeJson=this.LocalizationService.getLocalJson();
    if(!this.vutils.isUndefinedOrNull(this.localeJson) && this.localeJson.hasOwnProperty(key)){
      return this.localeJson[key];
    }
    else{
      return key;
    }
    
  }

  setLanguage(){
    this.LocalizationService.project.subscribe(res =>{
      this.angularTranslateService.use(res.toString());
    });
  }

  ngOnInit(){
    this.setLanguage();
  }

  getUserCurrentLocale():string{
    return this.LocalizationService.userLocale;
  }

  getDefaultLang():string{
    return this.LocalizationService.defaultLocale;
  }

}
