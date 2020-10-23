import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FieldConfig } from "../../models/field-config.schema";
import { VariableService } from "../../../shared/services/utilities/util_variable/variable.service";
import { ValidationService } from '../../../shared/services/utilities/util_validation/validation.service';
// declare var jQuery :any

@Component({
  exportAs: 'dynamicForm',
  selector: 'dynamic-form',
  styleUrls: ['dynamic-form.component.css'],
  templateUrl: 'dynamic-form.component.html'
})
export class DynamicFormComponent implements OnChanges, OnInit {
  @Input()
  config: FieldConfig[] = [];

  @Input()
  isMultiAssignable: Boolean;

  @Input()
  parentForm: FormGroup;

  @Output() fieldChanges = new EventEmitter();

  get controls() { return this.config.filter(({ dataType }) => dataType !== 'button'); }

  constructor(private fb: FormBuilder, private variableService: VariableService) { }

  ngOnInit() {
    this.parentForm = this.createGroup();
  }

  ngOnChanges() {
    this.parentForm = this.createGroup();
  }

  createGroup() {
    this.controls.forEach((control) => {
      this.parentForm.addControl(control.key, this.createControl(control));
      if (control.dataType == 'DN') {
        let attributeValues: any = [];
        if (!this.variableService.isUndefinedOrNull(control.attributeValues)) {
          if (!this.variableService.isArray(control.attributeValues) && !this.variableService.isEmptyString(control.attributeValues)) {

            attributeValues.push(control.attributeValues);
            control.attributeValues = attributeValues;
          }
          this.parentForm.controls[control.key].setValue(control.attributeValues);
        } else {
          this.parentForm.controls[control.key].setValue(attributeValues);
        }
      } else {
        if (!this.variableService.isUndefinedOrNull(control.attributeValues) && control.attributeValues != "") {
          if (control.dataType == 'Boolean') {
            if (!this.variableService.isUndefinedOrNull(control.attributeValues.$)) {
              this.parentForm.controls[control.key].setValue(JSON.parse(control.attributeValues.$));
            }
            else {
              this.parentForm.controls[control.key].setValue(control.attributeValues);

            }
          } else {
            if (!this.variableService.isUndefinedOrNull(control.attributeValues.$)) {
              this.parentForm.controls[control.key].setValue(control.attributeValues.$);
            }
            else {
              
                this.parentForm.controls[control.key].setValue(control.attributeValues);
            }
          }
        } else {
          if (!this.variableService.isUndefinedOrNull(control['type'])
            && control['type'].toLowerCase() === 'boolean') {
            this.parentForm.controls[control.key].setValue(false);
          } else {
            this.parentForm.controls[control.key].setValue('');
          }
        }
      }
    });
    return this.parentForm;
  }

  createControl(config: FieldConfig) {
    let validation = config.validation;
    if (config.dataType === 'DN' && config.isRequired === 'true') {
      validation = [];
      validation.push(ValidationService.nonemptyArrayValidator);
    }
    else if (config.dataType === 'Binary' && config.isRequired === 'true') {
      validation = [];
      validation.push(ValidationService.nonemptyString);
    }
    if ((config.dataType === 'String' || config.dataType === 'Stream' || config.dataType === 'Integer' || config.dataType === 'Time') && config.isRequired === 'true') {
      if (config.isMultivalued === 'false') {
        if(!this.variableService.isUndefinedOrNull(config.controlType) && this.variableService.isArray(config.choiceList)){
          if(!this.variableService.isEmptyArray(config.attributeValues) && config.attributeValues.length > 1){
            config.attributeValues.splice(1);
          }
          validation = [];
          validation.push(ValidationService.nonemptyArrayValidator);
        }else {
          if (this.variableService.isArray(config.attributeValues) && !this.variableService.isEmptyArray(config.attributeValues)) {
            config.attributeValues = config.attributeValues[0];
          }
          validation = [];
          validation.push(ValidationService.nonemptyString)
        }
        
      }
      if(config.isMultivalued === 'true'){
        if(this.variableService.isArray(config.attributeValues)){
          validation = [];
          validation.push(ValidationService.nonemptyArrayValidator);
        }else{
          validation = [];
          validation.push(ValidationService.nonemptyString);
        }
      }
    }
    return this.fb.control({ value: config.attributeValues, disabled: !config.isEditable }, validation);
  }

  fieldChanged(view: any) {
    this.fieldChanges.emit(view);
  }
}
