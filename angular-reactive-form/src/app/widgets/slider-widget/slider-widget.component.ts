import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'idm-slider-widget',
  templateUrl: './slider-widget.component.html',
  styleUrls: ['./slider-widget.component.css']
})
export class SliderWidgetComponent implements OnInit {

@ViewChild('inputSliderString') inputSliderString: ElementRef;
  @Input("value") value: number = 0;
  @Input("min") min: number = 0;
  @Input("max") max: number = 100;
  @Input("maxLength") maxLength: number = 2;
  @Output("valueChange") valueChange = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  onKeyUp($event) {
    let val = +$event.target.value;
    if ($event.target.value.length > this.maxLength && val != 100) {
      val = +$event.target.value.slice(0, $event.target.value.length - 1);
    } else if ($event.target.value.length < 0) {
      val = 0;
    }
    this.inputSliderString.nativeElement.value = val;
    this.value = val;
    this.valueChange.emit(this.value);
  }

  onInputChange($event) {
  }

  onMouseUp($event) {
    this.valueChange.emit(this.value);
  }

  onSliderChange($event) {
    this.value = $event.value;
    this.valueChange.emit(this.value);
  }

}
