import { Component, OnInit, ElementRef, Input, EventEmitter, Output, ViewChild, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";
import { ValidationService } from "../../../shared/services/utilities/util_validation/validation.service";
import { EmitterService } from "../../../shared/services/emitter/emitter.service";
import { PermissionResponseSchema, PermissionIdSchema } from '../schemas/permissions-schema';
import { SelectionWidgetInitSchema } from "../../../shared/schemas/selection-widget-init-schema";
import { Tabs, SelectionType, CategoryType, ContainerType } from "../../select-entities-widget-module/components/select-entities-widget/select-entities-widget.component";
import { PermissionsService } from '../services/permissions.service';
import { RoleLevelService } from '.././../../shared/services/role/role-level/role-level.service';
import { RootContainerService } from '../services/root-container.service';


@Component({
  selector: 'idm-role-permissions',
  templateUrl: './role-permissions.component.html',
  styleUrls: ['./role-permissions.component.css']
})
export class RolePermissionsComponent implements OnInit {

   AddRolePermissionForm: FormGroup;
   level: FormControl;
   selectedRole: FormControl;
   selectedRoleTouched: boolean = false;
   selectedRoleFocused: boolean = false;
   rolePermissions: PermissionResponseSchema[];
   selectedRolePermissions: any;
   selectLevelOrRole: any;
   selectedRoleSubcontainer: FormControl;
  //  rolePermissionIdArray : PermissionIdSchema[];
   permissionIdObj: PermissionIdSchema;
   dataPermission: PermissionResponseSchema[];
   roleLevel: any;
   roleContainerCn: any;
   rootContainerDn: string;

  rolePermissionIdArray: any;

  @Input("selectedPermList")
  public get selectedPermList() {
    return this.rolePermissionIdArray;
  }
  public set selectedPermList(val) {
    this.rolePermissionIdArray = val;
    this.selectedPermListChange.emit(this.rolePermissionIdArray);
  }
  @Output("selectedPermListChange") selectedPermListChange = new EventEmitter<any[]>();

  @Input("selectorRoleId") selectorRoleId;
  @Input("selectorRoleSubContainerId") selectorRoleSubContainerId;

  constructor(
    private emitterService: EmitterService,
    private permissionsService: PermissionsService,
    private roleLevelService: RoleLevelService,
    private rootContainerService: RootContainerService
  ) {
  }

  ngOnInit() {
    this.createAddRolePermissionFormControls();
    this.createAddRolePermissionForm();
    this.rolePermissions = new Array<PermissionResponseSchema>();
    this.permissionsService.getPermissionsRoleDomain().subscribe(data => {
      this.dataPermission = data.authObjects;
      this.filterPermissions(this.dataPermission);
    });
    this.rootContainerService.getRootContainersRoleDomain().subscribe(data => {
      this.rootContainerDn = this.rootContainerService.getRootContainerDnByKey("RoleDefs", data);
    })
    this.selectedRole.disable();
    this.permissionIdObj = new PermissionIdSchema();
    this.selectedPermList = new Array<PermissionIdSchema>();
    this.roleLevelService.getRoleLevels().subscribe(data => {
      this.roleLevel = data;
    });
    this.emitterService.get(this.selectorRoleId).subscribe((data) => {
      this.selectedRole.patchValue(data);
      this.createPermissionIdArray();
    });
    // this.selectorRoleSubContainerId
    this.emitterService.get(this.selectorRoleSubContainerId).subscribe((data) => {
      this.selectedRoleSubcontainer.patchValue(data);
      this.createPermissionIdArray();
    });

  }
  initRoleSubcontainerWidget: SelectionWidgetInitSchema = {
    widgetId: this.selectorRoleSubContainerId,
    activeTab: Tabs.container,
    selectionType: SelectionType.single,
    draggable: false,
    container: {
      selectionType: SelectionType.multi,
      containerType: ContainerType.role,
      containerRootSelectable: false
    }
  }

  initselectRoleWidget: SelectionWidgetInitSchema = {
    widgetId: this.selectorRoleId,
    activeTab: Tabs.role,
    draggable: false,
    selectionType: SelectionType.multi,
    role: {
      selectionType: SelectionType.multi,
      needColumnLevel: true
    }
  };

  createAddRolePermissionForm() {
    this.AddRolePermissionForm = new FormGroup({
      level: this.level,
      selectedRole: this.selectedRole,
      selectedRolePermissions: this.selectedRolePermissions,
      selectLevelOrRole: this.selectLevelOrRole,
      selectedRoleSubcontainer: this.selectedRoleSubcontainer
    });
  }
  createAddRolePermissionFormControls() {
    this.level = new FormControl('', []);
    this.level.setValue("0");
    this.selectedRole = new FormControl([], [ValidationService.nonemptyArrayValidator]);
    this.selectedRoleSubcontainer = new FormControl([]);
    this.selectedRolePermissions = new FormArray([]);
    this.selectedRolePermissions.setValidators([ValidationService.nonemptyArrayValidator]);
    this.selectLevelOrRole = new FormControl('levelSelected', []);
  }

  onChange(role: any, isChecked: boolean) {
    if (isChecked) {
      this.selectedRolePermissions.push(new FormControl(role));
    } else {
      let index = this.selectedRolePermissions.controls.findIndex(x => x.value.permissionKey == role.permissionKey)
      this.selectedRolePermissions.removeAt(index);
    }
    this.createPermissionIdArray();
  }

  typeChanged() {
    this.filterPermissions(this.dataPermission);
    if (this.selectLevelOrRole.value == "roleSelected") {
      let index = this.selectedRolePermissions.controls.findIndex(x => x.value == "nrfCreateRole")
      if (index != -1) {
        this.selectedRolePermissions.removeAt(index);
      }
      this.selectedRole.enable();
      this.createPermissionIdArray();
    } else {
      this.selectedRole.disable();
      this.createPermissionIdArray();
    }
  }
  filterPermissions(data) {
    this.rolePermissions = [];
    let k;
    if (this.selectLevelOrRole.value == "levelSelected") {
      k = 0;
    } else {
      k = 1;
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].objectType == "Role") {
        this.rolePermissions = data[i].permissions.slice(k);
        for (let h = 0; h < this.rolePermissions.length; ++h) {
          this.rolePermissions[h].objectClass = data[i].objectClass;
          this.rolePermissions[h].objectType = data[i].objectType;
        }
        break;
      }
    }
  }
  createPermissionIdArray() {
    this.selectedPermList = [];
    this.roleContainerCn = "";
    if (this.selectLevelOrRole.value == "roleSelected") {
      for (var i = 0; i < this.selectedRole.value.length; i++) {
        for (var j = 0; j < this.selectedRolePermissions.value.length; j++) {
          let permissionIdObj: any = {};
          Object.assign(permissionIdObj, this.selectedRolePermissions.value[j]);
          permissionIdObj.dn = this.selectedRole.value[i].id;
          this.selectedPermList.push(permissionIdObj);
        }
      }
    } else {
      if (this.selectedRoleSubcontainer.value == undefined || this.selectedRoleSubcontainer.value == "") {
        if (this.level.value == 0) {
          this.roleContainerCn = this.rootContainerDn
        } else {
          this.roleContainerCn = this.roleLevel.roleLevels.find(x => x.level == this.level.value);
          this.roleContainerCn = this.roleContainerCn.cn;
        }

      } else {
        this.roleContainerCn = this.selectedRoleSubcontainer.value[0].id;
      }
      for (var i = 0; i < this.selectedRolePermissions.value.length; i++) {
        let permissionIdObj: any = {};
        Object.assign(permissionIdObj, this.selectedRolePermissions.value[i]);
        permissionIdObj.dn = this.roleContainerCn;
        this.selectedPermList.push(permissionIdObj);
      }
    }

  }

}
