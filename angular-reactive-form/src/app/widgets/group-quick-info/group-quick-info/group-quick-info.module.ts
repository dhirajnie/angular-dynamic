import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingModule } from '../../loading/loading/loading.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomLoader } from 'src/app/app.translate';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LocalizationService } from 'src/app/shared/services/localization/localization.service';
import { TableModule } from '../../table/table/table.module';
import { GroupQuickInfoComponent } from '../group-quick-info.component';

@NgModule({
  imports: [

    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useClass: CustomLoader,
        deps: [HttpClientModule, LocalizationService]
      }
    }),
    LoadingModule,
    TableModule,
    LoadingModule
  ],
  declarations: [GroupQuickInfoComponent],
  exports: [GroupQuickInfoComponent]
})
export class GroupQuickInfoModule { }
