import { Component, OnInit, OnChanges } from '@angular/core';
import { FieldConfig } from '../../models/field-config.schema';
import { FormGroup } from '@angular/forms';
import { Field } from '../../models/field.schema';
import { VariableService } from 'src/app/shared/services/utilities/util_variable/variable.service';
import { EmitterService } from 'src/app/shared/services/emitter/emitter.service';

@Component({
  selector: 'app-form-input-list',
  templateUrl: './form-input-list.component.html',
  styleUrls: ['./form-input-list.component.sass']
})
export class FormInputListComponent extends Field implements OnInit, OnChanges {

  hideSelectionIfDropDownTab: boolean = false;
  selectedListItems: any[] = [];
  inputListTouched = false;

  constructor(private variableService: VariableService,private emitterService: EmitterService) { 
    super();
  }

  ngOnInit(){
    if(!this.variableService.isEmptyArray(this.config.attributeValues)){
      this.setFinalValues(this.config.attributeValues);
    }
    this.emitterService.get(this.config.selectionWidgetInitSchema.widgetId).subscribe((data) => {
        this.setFinalValues(data);
    });
  }

  touchedChange(val){
    this.inputListTouched = val;
  }

  ngOnChanges() {
    if(this.variableService.isUndefinedOrNull(this.config.attributeValues) ||
        (!this.variableService.isUndefinedOrNull(this.config.attributeValues) && 
          (this.variableService.isUndefinedOrNull(this.config.attributeValues[0]) && 
           this.variableService.isEmptyString(this.config.attributeValues[0])))) {
      this.config.attributeValues = [];
    }
  }

  setFinalValues(res){
    let finalResult = [];
    res.forEach((element) => {
      finalResult.push(element.key);
    });
    this.group.controls[this.config.key].setValue(finalResult);
  }

}
