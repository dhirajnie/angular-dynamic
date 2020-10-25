import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../models/field-config.schema';

@Component({
  selector: 'app-subordinates',
  templateUrl: './subordinates.component.html',
  styleUrls: ['./subordinates.component.css']
})
export class SubordinatesComponent implements OnInit {
  config: FieldConfig;
  group: FormGroup;
  childConfig: FieldConfig[];
  constructor() { }

  ngOnInit() {
  }

}
