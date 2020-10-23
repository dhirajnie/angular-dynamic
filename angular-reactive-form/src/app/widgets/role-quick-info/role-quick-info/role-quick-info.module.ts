import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleQuickInfoComponent } from '../role-quick-info.component';
import { AttributeValuesModule } from '../../attribute-values/attribute-values/attribute-values.module';
import { LoadingModule } from '../../loading/loading/loading.module';

@NgModule({
  imports: [
    CommonModule,
    AttributeValuesModule,
    LoadingModule
  ],
  declarations: [RoleQuickInfoComponent],
  exports:[RoleQuickInfoComponent]
})
export class RoleQuickInfoModule { }
