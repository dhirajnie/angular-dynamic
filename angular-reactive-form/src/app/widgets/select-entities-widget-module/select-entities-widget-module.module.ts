import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectEntitiesWidgetComponent } from "./components/select-entities-widget/select-entities-widget.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { MomentModule } from "ngx-moment";
import { DragulaModule } from "ng2-dragula";
import { ContainerTreeComponent } from "./components/container-tree/container-tree.component";
import { DriverTreeComponent } from "./components/driver-tree/driver-tree.component";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { CustomLoader } from "../../app.translate";
import { LocalizationService } from "../../shared/services/localization/localization.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MomentModule,

    DragulaModule,
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
  declarations: [SelectEntitiesWidgetComponent, ContainerTreeComponent, DriverTreeComponent],
  bootstrap: [SelectEntitiesWidgetComponent],
  exports: [
    SelectEntitiesWidgetComponent
  ],
})
export class SelectEntitiesWidgetModuleModule { }
