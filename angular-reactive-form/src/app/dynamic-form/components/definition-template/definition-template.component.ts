import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/utilities/util_validation/validation.service';
import { VariableService } from 'src/app/shared/services/utilities/util_variable/variable.service';
import { FieldConfig } from '../../models/field-config.schema';

@Component({
  selector: 'app-definition-template',
  templateUrl: './definition-template.component.html',
  styleUrls: ['./definition-template.component.css']
})
export class DefinitionTemplateComponent implements OnInit {

  @Input()
  fieldInstanceGroup: FieldConfig[];
  @Input()
  group: FormGroup;

  constructor(private fb: FormBuilder, private variableService: VariableService) { }
  get controls() { return this.fieldInstanceGroup.filter(({ dataType }) => dataType !== 'button'); }
  ngOnInit() {

    this.group = this.createGroup();
  }
  createGroup() {
    this.controls.forEach((control) => {
      this.group.addControl(control.key, this.createControl(control));
      if (control.dataType == 'DN') {
        let attributeValues: any = [];
        if (!this.variableService.isUndefinedOrNull(control.attributeValues)) {
          if (!this.variableService.isArray(control.attributeValues) && !this.variableService.isEmptyString(control.attributeValues)) {

            attributeValues.push(control.attributeValues);
            control.attributeValues = attributeValues;
          }
          this.group.controls[control.key].setValue(control.attributeValues);
        } else {
          this.group.controls[control.key].setValue(attributeValues);
        }
      } else {
        if (!this.variableService.isUndefinedOrNull(control.attributeValues) && control.attributeValues != "") {
          if (control.dataType == 'Boolean') {
            if (!this.variableService.isUndefinedOrNull(control.attributeValues.$)) {
              this.group.controls[control.key].setValue(JSON.parse(control.attributeValues.$));
            }
            else {
              this.group.controls[control.key].setValue(control.attributeValues);

            }
          } else {
            if (!this.variableService.isUndefinedOrNull(control.attributeValues.$)) {
              this.group.controls[control.key].setValue(control.attributeValues.$);
            }
            else {

              this.group.controls[control.key].setValue(control.attributeValues);
            }
          }
        } else {
          if (!this.variableService.isUndefinedOrNull(control['type'])
            && control['type'].toLowerCase() === 'boolean') {
            this.group.controls[control.key].setValue(false);
          } else {
            this.group.controls[control.key].setValue('');
          }
        }
      }
    });
    return this.group;
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
        if (!this.variableService.isUndefinedOrNull(config.controlType) && this.variableService.isArray(config.choiceList)) {
          if (!this.variableService.isEmptyArray(config.attributeValues) && config.attributeValues.length > 1) {
            config.attributeValues.splice(1);
          }
          validation = [];
          validation.push(ValidationService.nonemptyArrayValidator);
        } else {
          if (this.variableService.isArray(config.attributeValues) && !this.variableService.isEmptyArray(config.attributeValues)) {
            config.attributeValues = config.attributeValues[0];
          }
          validation = [];
          validation.push(ValidationService.nonemptyString)
        }

      }
      if (config.isMultivalued === 'true') {
        if (this.variableService.isArray(config.attributeValues)) {
          validation = [];
          validation.push(ValidationService.nonemptyArrayValidator);
        } else {
          validation = [];
          validation.push(ValidationService.nonemptyString);
        }
      }
    }
    return this.fb.control({ value: config.attributeValues, disabled: !config.isEditable }, validation);
  }

}
