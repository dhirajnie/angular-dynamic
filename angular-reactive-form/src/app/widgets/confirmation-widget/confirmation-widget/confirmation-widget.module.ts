import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationWidgetComponent } from '../confirmation-widget.component';





@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [ConfirmationWidgetComponent],
  exports: [ConfirmationWidgetComponent]
})
export class ConfirmationWidgetModule {
  constructor() {
    // this.translateService.use(this.translate.getUserCurrentLocale());
  }
}
