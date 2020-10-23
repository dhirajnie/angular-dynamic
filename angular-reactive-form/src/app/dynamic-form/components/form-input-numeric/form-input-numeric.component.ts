import { Component, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from "../../models/field.schema";
import { FieldConfig } from "../../models/field-config.schema";

@Component({
  selector: 'form-input-numeric',
  styleUrls: ['form-input-numeric.component.css'],
  templateUrl: 'form-input-numeric.component.html'
})
export class FormInputNumericComponent extends Field {
  config: FieldConfig;
  group: FormGroup;
}
