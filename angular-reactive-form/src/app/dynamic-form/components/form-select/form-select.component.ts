import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from "../../models/field.schema";
import { FieldConfig } from "../../models/field-config.schema";

@Component({
  selector: 'form-select',
  styleUrls: ['form-select.component.css'],
  templateUrl: 'form-select.component.html' 
})
export class FormSelectComponent extends Field {
  config: FieldConfig;
  group: FormGroup;
}
