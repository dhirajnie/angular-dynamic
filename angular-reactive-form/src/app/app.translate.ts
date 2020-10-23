import { TranslateLoader,MissingTranslationHandler, MissingTranslationHandlerParams } from "@ngx-translate/core";
import { Observable } from "rxjs/Observable";
import { Http } from "@angular/http";
import {LocalizationService} from "./shared/services/localization/localization.service";


export class CustomLoader implements TranslateLoader {
     localeJson: any;
    constructor(private http: Http, private LocalizationService: LocalizationService) {
    }
    public getTranslation(lang: string): Observable<any> {
      return this.LocalizationService.getLocalJsonOb();
    }

}

