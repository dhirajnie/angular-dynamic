import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../dynamic-form/models/field-config.schema';

@Component({
  selector: 'app-password-input-field',
  templateUrl: './password-input-field.component.html',
  styleUrls: ['./password-input-field.component.css']
})
export class PasswordInputFieldComponent implements OnInit {

  config: FieldConfig;
  group: FormGroup;
  
  constructor() { }

  ngOnInit() {
  }

}
