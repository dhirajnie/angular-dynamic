import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Field } from "../../models/field.schema";
import { FieldConfig } from "../../models/field-config.schema";
import { FormGroup } from "@angular/forms";
import { ResourceListService } from "../../../shared/services/resource/resource-list/resource-list.service";
import { FeedBackService } from "../../../shared/services/feed-back/feed-back.service";
import { EntitlementViewValueRequest, EntitlementValue } from "../../../shared/schemas/entitlement-schema";
import { VariableService } from "../../../shared/services/utilities/util_variable/variable.service";


@Component({
  selector: 'idm-form-selection-field',
  templateUrl: './form-selection-field.component.html',
  styleUrls: ['./form-selection-field.component.css']
})

export class FormSelectionFieldComponent extends Field implements OnInit {
  config: FieldConfig;
  group: FormGroup;
  values: EntitlementValue[];
  isValueEmpty: boolean = false;

  @Output() fieldChanged = new EventEmitter();

  constructor(private resourcesService: ResourceListService,
    private feedBackService: FeedBackService,
    private variableService: VariableService,
  ) {
    super();
    this.isValueEmpty = false;
    // this.translate.get('select an option');
  }

  ngOnInit() {
    this.isValueEmpty = false;
    this.getValues();
    if (!this.variableService.isEmptyString(this.group.controls[this.config.key])) {
      this.group.controls[this.config.key].valueChanges.subscribe(view => {
        if (this.config.isRequired === 'true' && this.variableService.isEmptyString(view)) {
          this.isValueEmpty = true;
        } else {
          this.isValueEmpty = false;
        }
        this.fieldChanged.emit(view);
      });
    }
  }

  getValues() {
    this.values = [];
    if (!this.variableService.isEmptyString(this.config.codeMapKey) && this.variableService.isEmptyString(this.config.selectedCMK)) {
      let entitlementViewValueRequest = new EntitlementViewValueRequest();
      entitlementViewValueRequest.viewID = this.config.codeMapKey;
      entitlementViewValueRequest.type = null;
      this.resourcesService.getValues(entitlementViewValueRequest).subscribe(result => {
        if (!this.variableService.isUndefinedOrNull(result)
          && !this.variableService.isUndefinedOrNull(result.entitlementValues)
          && !this.variableService.isEmptyArray(result.entitlementValues)) {
          this.values = result.entitlementValues;
          // this.group.controls[this.config.key].setValue(this.values[0], {onlySelf: true});
        }
      }, error => {
        this.feedBackService.feedBackError(error);
      });
    } else {
      this.resourcesService.getViews().subscribe(result => {
        if (!this.variableService.isUndefinedOrNull(result)
          && !this.variableService.isUndefinedOrNull(result.views)
          && !this.variableService.isEmptyArray(result.views)) {
          this.values = result.views;
          if (!this.variableService.isEmptyString(this.config.selectedCMK)) {
            for (let val of this.values) {
              if (!this.variableService.isEmptyString(this.config.codeMapKey)
                && val['viewID'] == this.config.selectedCMK) {
                this.group.controls[this.config.key].setValue(val, { onlySelf: true });
                break;
              }
            }
          }
        }
      }, error => {
        this.feedBackService.feedBackError(error);
      });
    }
  }
}
