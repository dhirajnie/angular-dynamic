import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormGroup, FormArray, ValidatorFn } from '@angular/forms';
import { VariableService } from '../../../shared/services/utilities/util_variable/variable.service';
import { SelectionWidgetInitSchema } from '../../../shared/schemas/selection-widget-init-schema';
import { Tabs, SelectionType } from '../../select-entities-widget-module/components/select-entities-widget/select-entities-widget.component';
import { ValidationService } from '../../../shared/services/utilities/util_validation/validation.service';
import { EmitterService } from '../../../shared/services/emitter/emitter.service';
import { PermissionsService } from '../services/permissions.service';
import { TranslateService } from '../../../shared/services/translate/translate.service';
import { RootContainerService } from '../services/root-container.service';

@Component({
  selector: 'idm-sod-permissions',
  templateUrl: './sod-permissions.component.html',
  styleUrls: ['./sod-permissions.component.css']
})
export class SodPermissionsComponent implements OnInit {

  selectedPermListValue: any;
  @Input("selectedPermList")
  public get selectedPermList() {
    return this.selectedPermListValue;
  }
  public set selectedPermList(val) {
    this.selectedPermListValue = val;
    this.selectedPermListChange.emit(this.selectedPermList);
  }
  @Output("selectedPermListChange") selectedPermListChange = new EventEmitter<any[]>();

  @Input("sodSelectorID") sodSelectorID: string;
  permissions: any;
  permissionsFormArray: FormArray;
  permissionsForm: FormGroup;
  radioOptions: any = [
    {
      key: "allSods",
      label: this.translateService.get("All Seperation of Duties Constraints")
    },
    {
      key: "selectedSods",
      label: this.translateService.get("Select Seperation of Duties Constraint")
    }
  ];
  rootContainerDn: string;

  radioSelection: FormControl;
  selectedSods: FormControl;
  selectedSodsTouched: boolean = false;
  selectedSodsFocusedout: boolean = false;
  selectedSodsConfig: SelectionWidgetInitSchema = {
    widgetId: this.sodSelectorID,
    activeTab: Tabs.sod,
    draggable: false,
    selectionType: SelectionType.multi,
    sod: {
      selectionType: SelectionType.multi,
    }
  };

  constructor(
    private permissionsService: PermissionsService,
    private vutils: VariableService,
    private emitterService: EmitterService,
    private translateService: TranslateService,
    private rootContainerService: RootContainerService
  ) {
    this.createFormControls();
    this.permissionsService.getPermissionsRoleDomain().subscribe(data => {
      this.permissions = this.convertToAppFormat(data);
      for (let i = 0; i < this.permissions.length; ++i) {
        let formField = new FormControl(false);
        this.permissionsFormArray.push(formField);
      }
    })
    this.rootContainerService.getRootContainersRoleDomain().subscribe(data => {
      this.rootContainerDn = this.rootContainerService.getRootContainerDnByKey("SoDDefs", data);
    })
    this.createForm();
    this.permissionsForm.valueChanges.subscribe(form => {
      this.setSelectedPermisionsList();
    });
    this.selectedSods.disable();
    this.radioSelection.valueChanges.subscribe(data => {
      if (!this.isSelectAll()) {
        this.selectedSods.enable();
        this.permissionsFormArray.controls[0].disable();
      } else {
        this.selectedSods.reset();
        this.selectedSods.disable();
        this.permissionsFormArray.controls[0].enable();
      }
    });
  }

  ngOnInit() {
    // It's important to keep this in ngOnInit instead of constructor as the two way binding for this.selectedPermList won't work because parent was calling set after children.
    this.setSelectedPermisionsList();
    this.emitterService.get(this.sodSelectorID).subscribe((data) => {
      this.selectedSods.patchValue(data);
    });
  }

  createFormControls() {
    this.radioSelection = new FormControl(this.radioOptions[0].key);
    this.permissionsFormArray = new FormArray([]);
    this.selectedSods = new FormControl([], [ValidationService.nonemptyArrayValidator]);
  }

  createForm() {
    this.permissionsForm = new FormGroup({
      selectedSods: this.selectedSods,
      permissionsFormArray: this.permissionsFormArray,
      radioSelection: this.radioSelection
    });
  }

  convertToAppFormat(data) {
    let filteredPermissions = [];
    if (!this.vutils.isUndefinedOrNull(data) && !this.vutils.isEmptyArray(data.authObjects)) {
      for (let i = 0; i < data.authObjects.length; ++i) {
        if (data.authObjects[i].objectType == "SOD") {
          filteredPermissions = data.authObjects[i].permissions;
          if (!this.vutils.isArray(filteredPermissions)) {
            filteredPermissions = [filteredPermissions];
          }
          for (let k = 0; k < filteredPermissions.length; ++k) {
            filteredPermissions[k].objectClass = data.authObjects[i].objectClass;
            filteredPermissions[k].objectType = data.authObjects[i].objectType;
          }
          break;
        }
      }
    }
    return filteredPermissions;
  }

  isSelectAll() {
    return (this.radioSelection.value == this.radioOptions[0].key);
  }

  setSelectedPermisionsList() {
    this.selectedPermList = [];
    let checkedPermissions = [];
    if (this.isSelectAll()) {
      for (let i = 0; i < this.permissionsFormArray.controls.length; ++i) {
        if (this.permissionsFormArray.controls[i].value) {
          checkedPermissions.push(this.permissions[i]);
        }
      }
    } else {
      for (let i = 1; i < this.permissionsFormArray.controls.length; ++i) {
        if (this.permissionsFormArray.controls[i].value) {
          checkedPermissions.push(this.permissions[i]); // skip create permission
        }
      }
    }
    if (this.isSelectAll()) {
      for (let i = 0; i < checkedPermissions.length; ++i) {
        let obj: any = {};
        Object.assign(obj, checkedPermissions[i]);
        obj.dn = this.rootContainerDn;
        this.selectedPermList.push(obj);
      }
    } else {
      if (!this.vutils.isEmptyArray(this.selectedSods.value) && !this.vutils.isEmptyArray(checkedPermissions)) {
        for (let i = 0; i < this.selectedSods.value.length; ++i) {
          for (let j = 0; j < checkedPermissions.length; ++j) {
            let obj: any = {};
            Object.assign(obj, checkedPermissions[j]);
            obj.dn = this.selectedSods.value[i].id;
            this.selectedPermList.push(obj);
          }
        }
      }
    }
  }

  isPermissionVisible(permission) {
    if (!this.isSelectAll() && permission.permissionKey == "nrfAccessCreateSoD") return false;
    return true;
  }

}