import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntitlementPermissionsComponent } from '../entitlement-permissions/entitlement-permissions.component';
import { PrdPermissionsComponent } from '../prd-permissions/prd-permissions.component';
import { PrdUserAppDriverPermissionsComponent } from '../prd-user-app-driver-permissions/prd-user-app-driver-permissions.component';
import { ResourceConfigurationPermissionsComponent } from '../resource-configuration-permissions/resource-configuration-permissions.component';
import { ResourcePermissionsComponent } from '../resource-permissions/resource-permissions.component';
import { RolePermissionsComponent } from '../role-permissions/role-permissions.component';
import { SodPermissionsComponent } from '../sod-permissions/sod-permissions.component';
import { SelectEntitiesWidgetModuleModule } from '../../select-entities-widget-module/select-entities-widget-module.module';
import { RoleConfigurationPermissionsComponent } from '../role-configuration-permissions/role-configuration-permissions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '../../../shared/services/translate/translate.service';
import { TranslateService as angularTranslateService, TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { CustomLoader } from '../../../app.translate';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LocalizationService } from '../../../shared/services/localization/localization.service';

@NgModule({
  imports: [
    CommonModule,
    SelectEntitiesWidgetModuleModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useClass: CustomLoader,
        deps: [HttpClientModule, LocalizationService]
      }
    }),
  ],
  declarations: [EntitlementPermissionsComponent,
    PrdPermissionsComponent,
    PrdUserAppDriverPermissionsComponent,
    ResourceConfigurationPermissionsComponent,
    ResourceConfigurationPermissionsComponent,
    ResourcePermissionsComponent,
    RolePermissionsComponent,
    SodPermissionsComponent,
    RoleConfigurationPermissionsComponent
  ],
  exports: [EntitlementPermissionsComponent,
    PrdPermissionsComponent,
    PrdUserAppDriverPermissionsComponent,
    ResourceConfigurationPermissionsComponent,
    ResourceConfigurationPermissionsComponent,
    ResourcePermissionsComponent,
    RolePermissionsComponent,
    SodPermissionsComponent,
    RoleConfigurationPermissionsComponent
  ]
})
export class PermissionsWidgetsModule {
  constructor(private translate: TranslateService, private translateService: angularTranslateService) {
    this.translateService.use(this.translate.getUserCurrentLocale());
  }
}
