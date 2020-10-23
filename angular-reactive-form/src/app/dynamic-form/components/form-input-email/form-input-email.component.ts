import { Component, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from "../../models/field.schema";
import { FieldConfig } from "../../models/field-config.schema";

@Component({
  selector: 'form-input-email',
  styleUrls: ['form-input-email.component.css'],
  templateUrl: 'form-input-email.component.html'
})
export class FormInputEmailComponent extends Field {
  config: FieldConfig;
  group: FormGroup;
}
