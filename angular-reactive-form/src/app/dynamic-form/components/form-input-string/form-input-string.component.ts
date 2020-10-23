import { Component, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from "../../models/field.schema";
import { FieldConfig } from "../../models/field-config.schema";

@Component({
  selector: 'form-input-string',
  styleUrls: ['form-input-string.component.css'],
  templateUrl: 'form-input-string.component.html'
})
export class FormInputStringComponent extends Field {
  // config: FieldConfig;
  // group: FormGroup;
  constructor(){
    super()
  }
  }
