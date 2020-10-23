import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateRangePickerComponent } from './components/date-range-picker.component';
// declare var $ :any
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DateRangePickerComponent
  ],
  exports:[DateRangePickerComponent]
})
export class DateRangePickerModule { }
