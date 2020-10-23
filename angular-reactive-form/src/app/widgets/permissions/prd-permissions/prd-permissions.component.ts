import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormGroup, FormArray, ValidatorFn } from '@angular/forms';
import { VariableService } from '../../../shared/services/utilities/util_variable/variable.service';
import { SelectionWidgetInitSchema } from '../../../shared/schemas/selection-widget-init-schema';
import { Tabs, SelectionType, PrdType } from '../../../widgets/select-entities-widget-module/components/select-entities-widget/select-entities-widget.component';
import { ValidationService } from '../../../shared/services/utilities/util_validation/validation.service';
import { EmitterService } from '../../../shared/services/emitter/emitter.service';
import { PermissionsService } from '../services/permissions.service';
import { TranslateService } from '@ngx-translate/core';
import { RootContainerService } from '../services/root-container.service';

@Component({
  selector: 'idm-prd-permissions',
  templateUrl: './prd-permissions.component.html',
  styleUrls: ['./prd-permissions.component.css']
})

export class PrdPermissionsComponent implements OnInit {

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

  @Input("prdSelectorID") prdSelectorID: string;
  permissions: any;
  permissionsFormArray: FormArray;
  permissionsForm: FormGroup;
  radioOptions: any = [
    {
      key: "allPrds",
      label: ""
    },
    {
      key: "selectedPrds",
      label: ""
    }
  ];
  rootContainerDn: string;
  radioSelection: FormControl;
  selectedPrds: FormControl;
  selectedPrdsTouched: boolean = false;
  selectedPrdsFocusedout: boolean = false;
  selectedPrdsConfig: SelectionWidgetInitSchema = {
    widgetId: this.prdSelectorID,
    activeTab: Tabs.prd,
    draggable: false,
    selectionType: SelectionType.multi,
    prd: {
      selectionType: SelectionType.multi,
      prdType: PrdType.all
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
    this.permissionsService.getPermissionsPrdDomain().subscribe(data => {
      this.permissions = this.convertToAppFormat(data);
      for (let i = 0; i < this.permissions.length; ++i) {
        let formField = new FormControl(false);
        this.permissionsFormArray.push(formField);
      }
    })
    this.rootContainerService.getRootContainersPrdDomain().subscribe(data => {
      this.rootContainerDn = this.rootContainerService.getRootContainerDnByKey("RequestDefs", data);
    })
    this.createForm();
    this.permissionsForm.valueChanges.subscribe(form => {
      this.setSelectedPermisionsList();
    });
    this.selectedPrds.disable();
    this.radioSelection.valueChanges.subscribe(data => {
      if (!this.isSelectAll()) {
        this.selectedPrds.enable();
      } else {
        this.selectedPrds.reset();
        this.selectedPrds.disable();
      }
    });
    this.selectedPrdsTouched = true;
    this.selectedPrdsFocusedout = true;
    this.translateService.get("All Provisioning Request Definitions").subscribe(data =>{
      this.radioOptions[0].label = data;
    });
    this.translateService.get("Select Provisioning Request Definition").subscribe(data =>{
      this.radioOptions[1].label = data;
    });
  }

  ngOnInit() {
    // It's important to keep this in ngOnInit instead of constructor as the two way binding for this.selectedPermList won't work because parent was calling set after children.
    this.setSelectedPermisionsList();
    this.emitterService.get(this.prdSelectorID).subscribe((data) => {
      this.selectedPrds.patchValue(data);
    });
  }

  createFormControls() {
    this.radioSelection = new FormControl(this.radioOptions[0].key);
    this.permissionsFormArray = new FormArray([]);
    this.selectedPrds = new FormControl([], [ValidationService.nonemptyArrayValidator]);
  }

  createForm() {
    this.permissionsForm = new FormGroup({
      selectedPrds: this.selectedPrds,
      permissionsFormArray: this.permissionsFormArray,
      radioSelection: this.radioSelection
    });
  }

  convertToAppFormat(data) {
    let filteredPermissions = [];
    if (!this.vutils.isUndefinedOrNull(data) && !this.vutils.isEmptyArray(data.authObjects)) {
      for (let i = 0; i < data.authObjects.length; ++i) {
        if (data.authObjects[i].objectType == "PRD") {
          filteredPermissions = data.authObjects[i].permissions;
          if (!this.vutils.isArray(filteredPermissions)) {
            filteredPermissions = [filteredPermissions];
          }
          for (let k = 0; k < filteredPermissions.length; k++) {
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
    for (let i = 0; i < this.permissionsFormArray.controls.length; ++i) {
      if (this.permissionsFormArray.controls[i].value) {
        checkedPermissions.push(this.permissions[i]);
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
      if (!this.vutils.isEmptyArray(this.selectedPrds.value) && !this.vutils.isEmptyArray(checkedPermissions)) {
        for (let i = 0; i < this.selectedPrds.value.length; i++) {
          for (let j = 0; j < checkedPermissions.length; j++) {
            let obj: any = {};
            Object.assign(obj, checkedPermissions[j]);
            obj.dn = this.selectedPrds.value[i].id;
            this.selectedPermList.push(obj);
          }
        }
      }
    }
  }

}