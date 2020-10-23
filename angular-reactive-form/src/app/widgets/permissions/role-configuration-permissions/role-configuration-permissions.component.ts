import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { VariableService } from '../../../shared/services/utilities/util_variable/variable.service';
import { EmitterService } from '../../../shared/services/emitter/emitter.service';
import { PermissionsService } from '../services/permissions.service';
import { RootContainerService } from '../services/root-container.service';



@Component({
  selector: 'idm-role-configuration-permissions',
  templateUrl: './role-configuration-permissions.component.html',
  styleUrls: ['./role-configuration-permissions.component.css']
})

export class RoleConfigurationPermissionsComponent implements OnInit {

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

  permissions: any;
  permissionsFormArray: FormArray;
  permissionsForm: FormGroup;
  rootContainerDn: string;

  constructor(
    private permissionsService: PermissionsService,
    private vutils: VariableService,
    private emitterService: EmitterService,
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
      this.rootContainerDn = this.rootContainerService.getRootContainerDnByKey("configuration", data);
    })
    this.createForm();
    this.permissionsForm.valueChanges.subscribe(form => {
      this.setSelectedPermisionsList();
    });
  }

  ngOnInit() {
    // It's important to keep this in ngOnInit instead of constructor as the two way binding for this.selectedPermList won't work because parent was calling set after children.
    this.setSelectedPermisionsList();
  }

  createFormControls() {
    this.permissionsFormArray = new FormArray([]);
  }

  createForm() {
    this.permissionsForm = new FormGroup({
      permissionsFormArray: this.permissionsFormArray
    });
  }

  convertToAppFormat(data) {
    let filteredPermissions = [];
    if (!this.vutils.isUndefinedOrNull(data) && !this.vutils.isEmptyArray(data.authObjects)) {
      for (let i = 0; i < data.authObjects.length; ++i) {
        if (data.authObjects[i].objectType == "Configuration") {
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

  setSelectedPermisionsList() {
    this.selectedPermList = [];
    let checkedPermissions = [];
    for (let i = 0; i < this.permissionsFormArray.controls.length; ++i) {
      if (this.permissionsFormArray.controls[i].value) {
        checkedPermissions.push(this.permissions[i]);
      }
    }
    if (!this.vutils.isEmptyArray(checkedPermissions)) {
      for (let j = 0; j < checkedPermissions.length; ++j) {
        let obj: any = {};
        Object.assign(obj, checkedPermissions[j]);
        obj.dn = this.rootContainerDn;
        this.selectedPermList.push(obj);
      }
    }
  }

}