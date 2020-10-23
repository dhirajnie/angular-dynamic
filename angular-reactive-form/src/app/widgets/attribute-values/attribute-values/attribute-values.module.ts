import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributeValuesComponent } from '../attribute-values.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AttributeValuesComponent],
  exports:[AttributeValuesComponent]
})
export class AttributeValuesModule { }
