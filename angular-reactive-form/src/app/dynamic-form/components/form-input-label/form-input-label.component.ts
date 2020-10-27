import { Component, OnInit } from '@angular/core';
import { Field } from "../../models/field.schema";
import { FieldConfig } from "../../models/field-config.schema";
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'idm-form-input-label',
  templateUrl: './form-input-label.component.html',
  styleUrls: ['./form-input-label.component.css']
})

export class FormInputLabelComponent extends Field implements OnInit {
  ngOnInit(): void {
    console.log('init done ');
  }
  config: FieldConfig;
  group: FormGroup;


  onInit() {

  }



}
