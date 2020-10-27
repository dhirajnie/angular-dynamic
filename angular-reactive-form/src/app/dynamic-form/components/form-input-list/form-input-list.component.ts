import { Component, OnInit, OnChanges, EventEmitter, Output } from '@angular/core';
import { FieldConfig } from '../../models/field-config.schema';
import { FormGroup } from '@angular/forms';
import { Field } from '../../models/field.schema';
import { VariableService } from 'src/app/shared/services/utilities/util_variable/variable.service';




@Component({
  selector: 'app-form-input-list',
  templateUrl: './form-input-list.component.html',
  styleUrls: ['./form-input-list.component.sass']
})
export class FormInputListComponent extends Field implements OnInit {

  @Output() fieldChanged = new EventEmitter<any>();
  selectedValue: any;
  ngOnInit(): void {
    console.log(this.config);
    if (this.config.selectedElement === undefined) {
      this.config.selectedElement = this.config.choiceList[0];

    }
    // throw new Error('Method not implemented.');
  }
  // selectedValue: string;
  config: FieldConfig;
  group: FormGroup;
  optionChanged(fieldSelected) {
    console.log('option changes' + this.fieldChanged)

    this.fieldChanged.emit(fieldSelected.target.value);
  }



  // definition.choiceList

}
