import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DynamicFieldDirective } from './components/dynamic-field/dynamic-field.directive';
import { DynamicFormComponent } from './containers/dynamic-form/dynamic-form.component';
import { FormInputNumericComponent } from './components/form-input-numeric/form-input-numeric.component';
import { FormSelectComponent } from './components/form-select/form-select.component';
import { FormInputStringComponent } from "./components/form-input-string/form-input-string.component";
import { FormInputEmailComponent } from "./components/form-input-email/form-input-email.component";
import { FormCheckBoxComponent } from "./components/form-input-checkbox/form-input-checkbox.component";
import { FormDNComponent } from "./components/form-dn/form-dn.component";
import { SelectEntitiesWidgetModuleModule } from "../widgets/select-entities-widget-module/select-entities-widget-module.module";
import { FormInputLabelComponent } from './components/form-input-label/form-input-label.component';
import { FormSelectionFieldComponent } from './components/form-selection-field/form-selection-field.component';
import { FormSelectionEntRefFieldComponent } from './components/form-selection-ent-ref-field/form-selection-ent-ref-field.component';




import { FormInputTextareaComponent } from './components/form-input-textarea/form-input-textarea.component';
import { FormInputFileComponent } from './components/form-input-file/form-input-file.component';
import { FormInputDateTimeComponent } from './components/form-input-date-time/form-input-date-time.component';


import { FormInputListComponent } from './components/form-input-list/form-input-list.component';
import { DateRangePickerModule } from '../widgets/date-range-picker/date-range-picker.module';
// declare var jQuery :any


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SelectEntitiesWidgetModuleModule,
    DateRangePickerModule
  ],
  declarations: [
    DynamicFieldDirective,
    DynamicFormComponent,
    FormInputNumericComponent,
    FormSelectComponent,
    FormInputStringComponent,
    FormInputTextareaComponent,
    FormInputEmailComponent,
    FormCheckBoxComponent,
    FormDNComponent,
    FormInputLabelComponent,
    FormSelectionFieldComponent,
    FormSelectionEntRefFieldComponent,
    FormInputTextareaComponent,
    FormInputFileComponent,
    FormInputDateTimeComponent,
    FormInputListComponent,
  ],
  exports: [
    DynamicFormComponent
  ],
  entryComponents: [
    FormInputNumericComponent,
    FormSelectComponent,
    FormInputStringComponent,
    FormInputTextareaComponent,
    FormInputEmailComponent,
    FormCheckBoxComponent,
    FormDNComponent,
    FormInputLabelComponent,
    FormSelectionFieldComponent,
    FormSelectionEntRefFieldComponent,
    FormInputFileComponent,
    FormInputDateTimeComponent,
    FormInputListComponent
  ]
})
export class DynamicFormModule { }
