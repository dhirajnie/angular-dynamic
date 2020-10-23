import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributeValuesModule } from '../../attribute-values/attribute-values/attribute-values.module';
import { LoadingModule } from '../../loading/loading/loading.module';
import { TranslateService } from 'src/app/shared/services/translate/translate.service';
import { TranslateService as angularTranslateService, TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { UserQuickInfoComponent } from '../user-quick-info.component';
import { HttpClient, } from '@angular/common/http';
import { CustomLoader } from 'src/app/app.translate';
import { LocalizationService } from 'src/app/shared/services/localization/localization.service';

@NgModule({
  imports: [
    CommonModule,
    LoadingModule,
    AttributeValuesModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useClass: CustomLoader,
        deps: [HttpClient, LocalizationService]
      }
    }),
  ],
  providers:[
    
    ],
  declarations: [UserQuickInfoComponent],
  exports:[UserQuickInfoComponent]
})
export class UserQuickInfoModule { 
  constructor(private translate: TranslateService, private translateService: angularTranslateService) {
    this.translateService.use(this.translate.getUserCurrentLocale());
  }
}
