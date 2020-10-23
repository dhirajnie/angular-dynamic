import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiDisplayComponent } from '../ui-display.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [UiDisplayComponent],
  exports:[UiDisplayComponent]
})
export class UIDispalyModule { }
