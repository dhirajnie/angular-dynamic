import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from '../table';
import { PaginationComponent } from '../pagination/pagination.component';
import { LocalizationService } from 'src/app/shared/services/localization/localization.service';
import { CustomLoader } from 'src/app/app.translate';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { LoadingModule } from '../../loading/loading/loading.module';
import { UIDispalyModule } from '../ui-display/uidispaly/uidispaly.module';

@NgModule({
  imports: [
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useClass: CustomLoader,
        deps: [HttpClientModule, LocalizationService]
      }
    }),
    CommonModule,
    FormsModule,
    MomentModule,
    FormsModule,
    LoadingModule,
    ReactiveFormsModule,
    UIDispalyModule

  ],
  declarations: [Table, PaginationComponent],
  exports: [Table, PaginationComponent]
})
export class TableModule { }
