import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";
import { ValidationService } from "../../../shared/services/utilities/util_validation/validation.service";
import { EmitterService } from "../../../shared/services/emitter/emitter.service";
import { PermissionResponseSchema, PermissionIdSchema } from '../schemas/permissions-schema';
import { SelectionWidgetInitSchema } from "../../../shared/schemas/selection-widget-init-schema";
import { Tabs, SelectionType, CategoryType, ContainerType } from "../../select-entities-widget-module/components/select-entities-widget/select-entities-widget.component";
import { PermissionsService } from '../services/permissions.service';
import { RootContainerService } from '../services/root-container.service';

@Component({
  selector: 'idm-resource-permissions',
  templateUrl: './resource-permissions.component.html',
  styleUrls: ['./resource-permissions.component.css']
})
export class ResourcePermissionsComponent implements OnInit {

   AddResourcePermissionForm: FormGroup;
   selectAllOrSubOrResource: any;
   selectedResourceSubcontainer: FormControl;
   selectedResourceSubcontainerTouched: boolean = false;
   selectedResourceSubcontainerFocusedout: boolean = false;
   selectedResource: FormControl;
   selectedResourceFocusedout: boolean = false;
   selectedResourceTouched: boolean = false;
   resourcePermissions: PermissionResponseSchema[];
   dataPermissions: PermissionResponseSchema[];
   selectedResourcePermissions: any;
   resourceContainerCn: any;
   rootContainerDn: string;
  //  resourcePermissionIdArray: any[];

  resourcePermissionIdArray: any;
  @Input("selectResourcesId") selectResourcesId: string;
  @Input("resourceSubcontainerId") resourceSubcontainerId: string;

  @Input("selectedPermList")
  public get selectedPermList() {
    return this.resourcePermissionIdArray;
  }
  public set selectedPermList(val) {
    this.resourcePermissionIdArray = val;
    this.selectedPermListChange.emit(this.resourcePermissionIdArray
    );
  }
  @Output("selectedPermListChange") selectedPermListChange = new EventEmitter<any[]>();


  constructor(
    private emitterService: EmitterService,
    private permissionsService: PermissionsService,
    private rootContainerService: RootContainerService
  ) {
  }

  ngOnInit() {
    this.createAddResourcePermissionFormControls();
    this.createAddResourcePermissionForm();
    this.selectedResourceSubcontainer.disable();
    this.selectedResource.disable();
    this.resourcePermissions = new Array<PermissionResponseSchema>();
    this.selectedPermList = new Array<PermissionIdSchema>();
    this.permissionsService.getPermissionsResourceDomain().subscribe(data => {
      this.dataPermissions = data.authObjects;
      this.filterPermissions(this.dataPermissions);
    });
    this.rootContainerService.getRootContainersResourceDomain().subscribe(data => {
      this.rootContainerDn = this.rootContainerService.getRootContainerDnByKey("ResourceDefs", data);
    })
    this.emitterService.get(this.resourceSubcontainerId).subscribe((data) => {
      this.selectedResourceSubcontainer.patchValue(data);
      this.createPermissionIdArray();
    });
    this.emitterService.get(this.selectResourcesId).subscribe((data) => {
      this.selectedResource.patchValue(data);
      this.createPermissionIdArray();
    });
  }

  initSubcontainerWidget: SelectionWidgetInitSchema = {
    widgetId: this.resourceSubcontainerId,
    activeTab: Tabs.container,
    selectionType: SelectionType.single,
    draggable: false,
    container: {
      selectionType: SelectionType.multi,
      containerType: ContainerType.resource,
      containerRootSelectable: false
    }
  }

  initselectResourceWidget: SelectionWidgetInitSchema = {
    widgetId: this.selectResourcesId,
    activeTab: Tabs.resource,
    draggable: false,
    selectionType: SelectionType.multi,
    resource: {
      selectionType: SelectionType.multi
    }
  };

  filterPermissions(data) {
    this.resourcePermissions = [];
    let k;
    if (this.selectAllOrSubOrResource.value != "resourceSelected") {
      k = 0;
    } else {
      k = 1;
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].objectType == "Resource") {
        this.resourcePermissions = data[i].permissions.slice(k);
        for (let h = 0; h < this.resourcePermissions.length; ++h) {
          this.resourcePermissions[h].objectClass = data[i].objectClass;
          this.resourcePermissions[h].objectType = data[i].objectType;
        }
        break;
      }
    }
  }

  createAddResourcePermissionForm() {
    this.AddResourcePermissionForm = new FormGroup({
      selectAllOrSubOrResource: this.selectAllOrSubOrResource,
      selectedResourceSubcontainer: this.selectedResourceSubcontainer,
      selectedResource: this.selectedResource
    });
  }
  createAddResourcePermissionFormControls() {
    this.selectAllOrSubOrResource = new FormControl('allResources', []);
    this.selectedResourceSubcontainer = new FormControl('', [ValidationService.nonemptyArrayValidator]);
    this.selectedResource = new FormControl('', [ValidationService.nonemptyArrayValidator]);
    this.selectedResourcePermissions = new FormArray([]);
    this.selectedResourcePermissions.setValidators([ValidationService.nonemptyArrayValidator]);
  }

  onChange(resource: any, isChecked: boolean) {
    if (isChecked) {
      this.selectedResourcePermissions.push(new FormControl(resource));
    } else {
      let index = this.selectedResourcePermissions.controls.findIndex(x => x.value.permissionKey == resource.permissionKey)
      this.selectedResourcePermissions.removeAt(index);
    }
    this.createPermissionIdArray();
  }

  radioTypeChanged() {
    this.filterPermissions(this.dataPermissions);
    if (this.selectAllOrSubOrResource.value == "subContainer") {
      this.selectedResourceSubcontainer.enable();
    }
    else {
      this.selectedResourceSubcontainer.disable();
    }
    if (this.selectAllOrSubOrResource.value == "resourceSelected") {
      let index = this.selectedResourcePermissions.controls.findIndex(x => x.value == "nrfCreateRole")
      if (index != -1) {
        this.selectedResourcePermissions.removeAt(index);
      }
      this.selectedResource.enable();
    } else {
      this.selectedResource.disable();
    }
    this.createPermissionIdArray();
  }
  createPermissionIdArray() {
    this.selectedPermList = [];
    this.resourceContainerCn = "";
    if (this.selectAllOrSubOrResource.value == "resourceSelected") {
      for (var i = 0; i < this.selectedResource.value.length; i++) {
        for (var j = 0; j < this.selectedResourcePermissions.value.length; j++) {
          let permissionIdObj: any = {};
          Object.assign(permissionIdObj, this.selectedResourcePermissions.value[j]);
          permissionIdObj.dn = this.selectedResource.value[i].id;
          this.selectedPermList.push(permissionIdObj);
        }
      }

    } else {
      if (this.selectAllOrSubOrResource.value == "allResources") {
        this.resourceContainerCn = this.rootContainerDn;
      } else {
        if (this.selectedResourceSubcontainer.value != undefined && this.selectedResourceSubcontainer.value != "") {
          this.resourceContainerCn = this.selectedResourceSubcontainer.value[0].id;
        } else {
          this.resourceContainerCn = "";
        }
      }
      if (this.resourceContainerCn != "") {
        for (var i = 0; i < this.selectedResourcePermissions.value.length; i++) {
          let permissionIdObj: any = {};
          Object.assign(permissionIdObj, this.selectedResourcePermissions.value[i]);
          permissionIdObj.dn = this.resourceContainerCn;
          this.selectedPermList.push(permissionIdObj);
        }
      }
    }
  }
}
