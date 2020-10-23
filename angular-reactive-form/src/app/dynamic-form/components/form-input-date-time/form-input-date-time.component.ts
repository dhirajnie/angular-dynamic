import { Component, OnInit } from '@angular/core';
import { DatePickerOptionsAllDates } from '../../../shared/schemas/date-picker-options';
import { Field } from "../../models/field.schema";
import { FieldConfig } from "../../models/field-config.schema";
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'idm-form-input-date-time',
  templateUrl: './form-input-date-time.component.html',
  styleUrls: ['./form-input-date-time.component.css']
})
export class FormInputDateTimeComponent extends Field implements OnInit {

  datePickerOptions: DatePickerOptionsAllDates;
  selDate: string;
  config: FieldConfig;
  group: FormGroup;
  dateTouched= false;
  dateFoucsedout= false;

  constructor() { 
    super();
  }

  ngOnInit() { }

  effectiveDateUpdate(event){
      this.group.controls[this.config.key].setValue(event.date);
  }
}
// 