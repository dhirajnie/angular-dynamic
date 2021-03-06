import { Component, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from "../../models/field.schema";
import { FieldConfig } from "../../models/field-config.schema";

@Component({
  selector: 'form-input-checkbox',
  styleUrls: ['form-input-checkbox.component.css'],
  templateUrl: 'form-input-checkbox.component.html'
})
export class FormCheckBoxComponent extends Field {
  config: FieldConfig;
  group: FormGroup;
}
