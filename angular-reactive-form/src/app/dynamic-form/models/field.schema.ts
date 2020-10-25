import { FormGroup } from '@angular/forms';
import { FieldConfig } from "./field-config.schema";
import { EventEmitter } from "@angular/core";

export class Field {
  config: FieldConfig;
  group: FormGroup;
  childConfig: FieldConfig[];
  fieldChanged: EventEmitter<any>;
  isMultiAssignable: Boolean;
}
