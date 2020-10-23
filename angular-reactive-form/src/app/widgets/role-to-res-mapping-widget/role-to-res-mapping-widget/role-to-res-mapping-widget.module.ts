import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleToResMappingWidgetComponent } from '../role-to-res-mapping-widget.component';
import { SelectEntitiesWidgetModuleModule } from '../../select-entities-widget-module/select-entities-widget-module.module';
import { LoadingModule } from '../../loading/loading/loading.module';
// import { MapEntitlementToRoleComponent } from 'src/app/map-entitlement-to-role/map-entitlement-to-role.component';
import { ConfirmationWidgetModule } from '../../confirmation-widget/confirmation-widget/confirmation-widget.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomLoader } from 'src/app/app.translate';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LocalizationService } from 'src/app/shared/services/localization/localization.service';
import { UIDispalyModule } from '../../table/ui-display/uidispaly/uidispaly.module';
import { DragulaModule } from 'ng2-dragula';
// import { MapResourceWithFormToRoleModule } from 'src/app/roles/map-resource-with-form-to-role/map-resource-with-form-to-role/map-resource-with-form-to-role.module';
// import { MapEntitlementToRoleModule } from 'src/app/map-entitlement-to-role/map-entitlement-to-role/map-entitlement-to-role.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from 'src/app/shared/services/translate/translate.service';
import { TranslateService as angularTranslateService } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useClass: CustomLoader,
        deps: [HttpClientModule, LocalizationService]
      }
    }),
    ReactiveFormsModule,
    DragulaModule,
    SelectEntitiesWidgetModuleModule,
    LoadingModule,
    ConfirmationWidgetModule,
    UIDispalyModule,
    // MapResourceWithFormToRoleModule,
    // MapEntitlementToRoleModule

  ],
  declarations: [RoleToResMappingWidgetComponent],
  exports: [RoleToResMappingWidgetComponent]
})
export class RoleToREsMappingWidgetModule {
  constructor(private translate: TranslateService, private translateService: angularTranslateService) {
    this.translateService.use(this.translate.getUserCurrentLocale());
  }
}
