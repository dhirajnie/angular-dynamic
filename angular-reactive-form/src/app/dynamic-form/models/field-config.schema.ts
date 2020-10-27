import { ValidatorFn } from '@angular/forms';
import { SelectionWidgetInitSchema } from "../../shared/schemas/selection-widget-init-schema";
import { DatePickerOptions, DatePickerOptionsAllDates } from '../../shared/schemas/date-picker-options';

export class FieldConfig {
  displayLabel?: string;
  name: string;
  placeholder?: string;
  dataType: string;
  validation?: ValidatorFn[];
  attributeValues?: any;
  key: string;
  isSearchable: string;
  isRequired: string;
  isEditable: string;
  isMultivalued: string;
  formatType: string;
  hide: boolean;
  staticValue: string;
  selectionWidgetInitSchema: SelectionWidgetInitSchema;
  parentType: string;
  codeMapKey: string;
  selectedCMK: string;
  selectedElement: any;
  touched: boolean;
  focusedout: boolean;
  datePickerOptions: DatePickerOptionsAllDates;
  lookupEntity: string;
  lookupAttributes: any;
  clientId: string;
  controlType?: string;
  choiceList?: any;
  children: FieldConfig[];
  constructor() {
    this.children = [];
  }
  subOridinateActiveValue: string;

}
