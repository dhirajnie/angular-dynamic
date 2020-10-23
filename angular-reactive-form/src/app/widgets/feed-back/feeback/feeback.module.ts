import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedBackComponent, FeedBackComponentChild } from '../feed-back.component';
import { CNFromDN } from 'src/app/shared/pipes/cn-to-name/cnToName';
import { CnToNameModule } from 'src/app/shared/pipes/cn-to-name/cn-to-name.module';
import { TranslateService } from 'src/app/shared/services/translate/translate.service';
import { TranslateService as angularTranslateService } from "@ngx-translate/core";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomLoader } from '../../../app.translate';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LocalizationService } from '../../../shared/services/localization/localization.service';


@NgModule({
  imports: [
    CommonModule,
    CnToNameModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useClass: CustomLoader,
        deps: [HttpClientModule, LocalizationService]
      }
    })
  ],
  declarations: [FeedBackComponent, FeedBackComponentChild],
  exports: [FeedBackComponent, FeedBackComponentChild]
})
export class FeebackModule {
  constructor(private translate: TranslateService, private translateService: angularTranslateService) {
    this.translateService.use(this.translate.getUserCurrentLocale());
  }
}

