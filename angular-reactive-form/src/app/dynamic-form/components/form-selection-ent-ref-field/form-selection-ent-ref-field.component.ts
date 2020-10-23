import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../../models/field-config.schema';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'idm-form-selection-ent-ref-field',
  templateUrl: './form-selection-ent-ref-field.component.html',
  styleUrls: ['./form-selection-ent-ref-field.component.css']
})
export class FormSelectionEntRefFieldComponent implements OnInit {
  config: FieldConfig;
  group: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
