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
  config: FieldConfig;
  group: FormGroup;
  ngOnInit(): void {
    console.log(this.config);
    // if (this.config.selectedElement === undefined) {
    //   this.config.selectedElement = this.config.choiceList[0];

    // }
    this.config.selectedElement = this.config.attributeValues;
    // throw new Error('Method not implemented.');
  }


  optionChanged(fieldDisplayNameSelected) {
    let selectedKey;
    console.log(this.group)
    // for (let i = 0; i < this.config.choiceList.length; i++) {
    //   if (this.config.choiceList[i].displayName === fieldDisplayNameSelected) {
    //     selectedKey = this.config.choiceList[i].key;
    //   }
    // }


    this.fieldChanged.emit(fieldDisplayNameSelected);
  }



  // definition.choiceList

}
