import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderWidgetComponent } from '../slider-widget.component';
import { MatSliderModule, MatInputModule  } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatSliderModule,
    FormsModule,
    MatInputModule 
  ],
  declarations: [SliderWidgetComponent],
  exports:[SliderWidgetComponent]
})
export class SliderWidgetModule { }
