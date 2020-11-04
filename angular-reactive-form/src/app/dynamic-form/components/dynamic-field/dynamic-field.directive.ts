import { FormInputTextareaComponent } from './../form-input-textarea/form-input-textarea.component';
import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, OnInit, Type, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormInputNumericComponent } from '../form-input-numeric/form-input-numeric.component';
import { FormSelectComponent } from '../form-select/form-select.component';
import { FormInputStringComponent } from "../form-input-string/form-input-string.component";
import { VariableService } from "../../../shared/services/utilities/util_variable/variable.service";
import { FormInputEmailComponent } from "../form-input-email/form-input-email.component";
import { FormCheckBoxComponent } from "../form-input-checkbox/form-input-checkbox.component";
import { FormDNComponent } from "../form-dn/form-dn.component";
import { SelectionWidgetInitSchema } from "../../../shared/schemas/selection-widget-init-schema";
import { Tabs, SelectionType, ContainerType } from "../../../widgets/select-entities-widget-module/components/select-entities-widget/select-entities-widget.component";
import { Field } from "../../models/field.schema";
import { FieldConfig } from "../../models/field-config.schema";
import { FormInputLabelComponent } from "../form-input-label/form-input-label.component";
import { FormSelectionFieldComponent } from "../form-selection-field/form-selection-field.component";
import { FormSelectionEntRefFieldComponent } from '../form-selection-ent-ref-field/form-selection-ent-ref-field.component';
import { ValidationService } from '../../../shared/services/utilities/util_validation/validation.service';
import { FormInputFileComponent } from '../form-input-file/form-input-file.component';
import { FormInputDateTimeComponent } from '../form-input-date-time/form-input-date-time.component';

import { DatePickerOptionsAllDates } from '../../../shared/schemas/date-picker-options';

import { FormInputListComponent } from './../form-input-list/form-input-list.component';
import { GroupContainerComponent } from '../group-container/group-container.component';
import { SubOrdinateInformation } from 'src/app/SubOrdinateInformation';
import { SubordinatesComponent } from '../subordinates/subordinates.component';
import { StructuredDefinitionComponent } from '../structured-definition/structured-definition.component';
import { PasswordInputFieldComponent } from 'src/app/password-input-field/password-input-field.component';


@Directive({
  selector: '[dynamicField]'
})
export class DynamicFieldDirective extends Field implements OnChanges, OnInit {
  @Input()
  config: FieldConfig;

  @Input()
  isMultiAssignable: Boolean;

  @Input()
  group: FormGroup;

  @Output() fieldChanged = new EventEmitter();
  component: ComponentRef<Field>;


  datePickerOptions: DatePickerOptionsAllDates;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef,
    private variableService: VariableService,
    // private translate: TranslateService
  ) {
    super();
  }

  ngOnChanges() {
    if (this.component) {
      this.component.instance.config = this.config;
      this.component.instance.group = this.group;
      this.component.instance.isMultiAssignable = this.isMultiAssignable;
      this.component.instance.fieldChanged = this.fieldChanged;
    }
  }

  ngOnInit() {
    const component = this.resolver.resolveComponentFactory<Field>(this.getComponent(this.config, this.isMultiAssignable));
    this.component = this.container.createComponent(component);
    this.component.instance.config = this.config;
    this.component.instance.group = this.group;
    this.component.instance.isMultiAssignable = this.isMultiAssignable;
    this.component.instance.childConfig = this.config.children;
    if (!this.variableService.isEmptyString(this.component.instance.fieldChanged)) {
      this.component.instance.fieldChanged.subscribe(
        evt => this.fieldChanged.emit(evt)
      );
    }
  }

  getComponent(field: FieldConfig, isMultiAssignable: Boolean): Type<Field> {
    let component;
    switch (field.dataType) {
      case 'String':
        if (!this.variableService.isUndefinedOrNull(field.controlType) && this.variableService.isArray(field.choiceList)) {
          this.preProcessListData(field);
          component = FormInputListComponent;
        } else if (!this.variableService.isArray(field.attributeValues)) {
          if ((!this.variableService.isUndefinedOrNull(field.formatType) && field.formatType.toLocaleLowerCase().includes('email')) || field.key.toLocaleLowerCase().includes("Email")) {
            component = FormInputEmailComponent;
          } else {
            if (!this.variableService.isUndefinedOrNull(field.staticValue)) {
              component = FormInputLabelComponent;
            } else {
              component = FormInputStringComponent;
            }
          }
        } else {
          component = FormSelectComponent;
        }
        break;
      case 'Stream':
        if (!this.variableService.isArray(field.attributeValues)) {
          component = FormInputTextareaComponent;
        } else {
          component = FormSelectComponent;
        }
        break;
      case 'Binary':
        if (!this.variableService.isArray(field.attributeValues)) {
          component = FormInputFileComponent;
        } else {
          component = FormSelectComponent;
        }
        break;
      case 'Time':
        component = FormInputDateTimeComponent;
        this.setDateTimeOptionFields(field);
        break;
      case 'DN':
        component = FormDNComponent;
        this.preProcessData(field);
        break;
      case 'List':
        if (!this.variableService.isUndefinedOrNull(field.staticValue)) {
          component = FormInputLabelComponent;
        } else if (!this.variableService.isUndefinedOrNull(field.parentType)
          && field.parentType === 'resource') {
          component = FormSelectionFieldComponent;
        } else {
          component = FormSelectComponent;
        }
        break;
      case 'EntitlementRef':
        if (this.variableService.isUndefinedOrNull(field.codeMapKey)) {
          field.isRequired = 'true';
          component = FormInputStringComponent;
        } else {
          component = FormSelectionEntRefFieldComponent;
          this.preProcessEntRefData(field, isMultiAssignable);
        }
        break;
      case 'Integer':
        if (!this.variableService.isUndefinedOrNull(field.staticValue)) {
          component = FormInputLabelComponent;
        } else {
          component = FormInputNumericComponent;
        }
        break;
      case 'Boolean':
        if (!this.variableService.isUndefinedOrNull(field.staticValue)) {
          component = FormInputLabelComponent;
        } else {
          component = FormCheckBoxComponent;
        }
        break;
      case 'Time': {
        component = FormInputStringComponent
        break;
      }
      case 'Group': {
        component = GroupContainerComponent;
        break;
      }
      case 'Subordinates': {
        component = SubordinatesComponent;
        break;
      }
      case 'StructuredDefinition': {
        component = StructuredDefinitionComponent;
        break;
      }
      case 'Password': {
        component = PasswordInputFieldComponent;
        break;
      }
      default:
        component = FormInputStringComponent;
        break;

    }
    if (field.isRequired === 'true') {
      field.validation = [
        Validators.required
      ];
      if ((!this.variableService.isUndefinedOrNull(field.formatType)
        && field.formatType.toLocaleLowerCase().includes('email'))
        || field.key.toLocaleLowerCase().includes('Email')) {
        field.validation.push(Validators.email);
      }
      if (field.dataType.toLowerCase().includes('EntitlementRef'.toLowerCase())) {
        if (!this.variableService.isUndefinedOrNull(field.codeMapKey)) {
          field.validation.push(ValidationService.nonemptyArrayValidator);
        }
      }
    }
    return component;
  }

  private preProcessListData(field: FieldConfig) {
    let newList = [];
    field.choiceList.forEach((element) => {
      let item = { "key": element.key, "displayName": element.value, "type": "dropdown" }
      newList.push(item);
    });
    field.choiceList = newList;

    let selectionType = SelectionType.single;
    if (field.isMultivalued.toString() === 'true') {
      selectionType = SelectionType.multi;
    }

    let inputListWidgetConfig: SelectionWidgetInitSchema = {
      widgetId: "inputListWidget" + field.key,
      activeTab: Tabs.dropdown,
      selectionType: selectionType,
      draggable: false,
      dropdown: {
        defaultLabel: "Select " + field.key,
        autoSelectFirst: false
      }
    };

    field.selectionWidgetInitSchema = inputListWidgetConfig;
  }
  private setDateTimeOptionFields(field: FieldConfig) {
    this.datePickerOptions = new DatePickerOptionsAllDates();
    this.datePickerOptions.autoApply = true;
    this.datePickerOptions.timePicker = true;
    this.datePickerOptions.autoUpdateInput = false;
    this.datePickerOptions.drops = "up";
    this.datePickerOptions.singleDatePicker = true;
    this.datePickerOptions.showDropdowns = true;
    field.datePickerOptions = this.datePickerOptions;
  }

  private preProcessData(field: FieldConfig) {
    let selectionType = SelectionType.single;
    if (field.isMultivalued.toString() === 'true') {
      selectionType = SelectionType.multi;
    }
    let selectionWidgetInitSchema: SelectionWidgetInitSchema = {
      widgetId: 'other-attribute' + field.key,
      activeTab: Tabs.user,
      selectionType: selectionType,
      draggable: false,
    };
    if (!this.variableService.isUndefinedOrNull(field['lookupEntity']) && !this.variableService.isUndefinedOrNull(field['lookupAttributes'])) {
      selectionWidgetInitSchema['entity'] = {
        selectionType: selectionType,
        lookupEntity: field.lookupEntity,
        lookupAttributes: field.lookupAttributes,
        clientId: field.clientId
      };
      selectionWidgetInitSchema['activeTab'] = Tabs.entity;
    } else {
      selectionWidgetInitSchema['user'] = {
        selectionType: selectionType
      };
      selectionWidgetInitSchema['group'] = {
        selectionType: selectionType
      };
      selectionWidgetInitSchema['container'] = {
        selectionType: selectionType,
        containerType: ContainerType.user,
        containerRootSelectable: true
      }
    };
    field.selectionWidgetInitSchema = selectionWidgetInitSchema;
    let attributeValues = [];
    if (!this.variableService.isArray(field.attributeValues)) {
      attributeValues.push(field.attributeValues);
      field.attributeValues = attributeValues;
    }
  }

  private preProcessEntRefData(field: FieldConfig, isMultiAssignable: Boolean) {
    let selectionType = SelectionType.single;
    if (isMultiAssignable) {
      selectionType = SelectionType.multi;
    }
    let dynamicEntValuesConfig: SelectionWidgetInitSchema = {
      widgetId: 'dynamicResourceEntValue' + field.key,
      activeTab: Tabs.entitlementValues,
      selectionType: selectionType,
      draggable: false,
      entitlementValues: {
      }
    };
    field.selectionWidgetInitSchema = dynamicEntValuesConfig;
    let attributeValues = [];
    field.attributeValues = attributeValues;
    field.selectedElement = this.getPayload(field);
    field.touched = false;
    field.focusedout = false;
  }

  private getPayload(field: FieldConfig) {
    let payload: any = {};
    payload.id = field.key;
    payload.hasLogicalSystem = false;
    return payload;
  }
}
