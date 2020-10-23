import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from "../../models/field.schema";
import { FieldConfig } from "../../models/field-config.schema";

@Component({
  selector: 'form-input-textarea',
  templateUrl: './form-input-textarea.component.html',
  styleUrls: ['./form-input-textarea.component.css']
})
export class FormInputTextareaComponent extends Field {
  config: FieldConfig;
  group: FormGroup;
  constructor() { 
    super()
    
  }

}
