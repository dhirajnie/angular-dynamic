import { Component, ViewContainerRef, OnChanges, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from "../../models/field.schema";
import { FieldConfig } from "../../models/field-config.schema";
import { VariableService } from "../../../shared/services/utilities/util_variable/variable.service";
import { EmitterService } from '../../../shared/services/emitter/emitter.service';


@Component({
  selector: 'form-dn',
  styleUrls: ['form-dn.component.css'],
  templateUrl: 'form-dn.component.html'
})
export class FormDNComponent extends Field implements OnChanges, OnInit {
  config: FieldConfig;
  group: FormGroup;
  touched: boolean = false;
  constructor(private variableService: VariableService, private emitterService: EmitterService) {
    super();
  }

  ngOnInit() {
    if (this.variableService.isUndefinedOrNull(this.config.attributeValues) ||
        (!this.variableService.isUndefinedOrNull(this.config.attributeValues) && 
          (this.variableService.isUndefinedOrNull(this.config.attributeValues[0]) || 
          this.variableService.isEmptyString(this.config.attributeValues[0])))){
      this.config.attributeValues = [];
    }
    this.emitterService.get(this.config.selectionWidgetInitSchema.widgetId).subscribe(data => {
      this.group.controls[this.config.key].patchValue(data);
    });
  }

  ngOnChanges() {
    if(this.variableService.isUndefinedOrNull(this.config.attributeValues) ||
        (!this.variableService.isUndefinedOrNull(this.config.attributeValues) && 
          (this.variableService.isUndefinedOrNull(this.config.attributeValues[0]) && 
           this.variableService.isEmptyString(this.config.attributeValues[0])))) {
      this.config.attributeValues = [];
    }
  }

  touchedChange(val){
    this.touched = val;
   }
}
