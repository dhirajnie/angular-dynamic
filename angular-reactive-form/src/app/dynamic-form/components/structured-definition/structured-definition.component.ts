import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/utilities/util_validation/validation.service';
import { FieldConfig } from '../../models/field-config.schema';

@Component({
  selector: 'app-structured-definition',
  templateUrl: './structured-definition.component.html',
  styleUrls: ['./structured-definition.component.css']
})
export class StructuredDefinitionComponent implements OnInit {

  config: FieldConfig;
  group: FormGroup;
  childConfig: FieldConfig[];
  key: number = 1000;
  defInstanceArray: FieldConfig[] = [];
  variableService: any;


  constructor() { }

  ngOnInit() {
    this.createInstance();
  }

  createInstance() {
    console.log(this.config)

  }

}
