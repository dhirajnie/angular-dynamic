
import {of as observableOf,  Observable ,  Subject } from 'rxjs';

import {mergeMap, takeUntil, debounceTime} from 'rxjs/operators';
///<reference path="../../shared/constants/ui-constants.ts"/>
import { Component, OnInit, ChangeDetectorRef, Input, ElementRef, ViewChild } from '@angular/core';
import { SelectionWidgetInitSchema } from "../../shared/schemas/selection-widget-init-schema";
import { DragulaService } from "ng2-dragula";
import { RoleResourceAssociation } from "../../shared/schemas/role-resource-association-schema";
import { RoleCrudService } from "../../shared/services/role/role-crud/role-crud.service";
import { FeedBackService } from "../../shared/services/feed-back/feed-back.service";
import { EntitlementResourceList } from "../../shared/schemas/entitlement-resource-list-schema";
import { Resource } from "../../shared/schemas/resource-schema";
import { VariableService } from "../../shared/services/utilities/util_variable/variable.service";
import { EmitterService } from "../../shared/services/emitter/emitter.service";
import { DriversService } from "../../shared/services/selection-widget/driver/drivers.service";
import { SelectionType, Tabs } from "../select-entities-widget-module/components/select-entities-widget/select-entities-widget.component";
import { RoleListService } from "../../shared/services/role/role-list/role-list.service";
import { ResourceListService } from "../../shared/services/resource/resource-list/resource-list.service";
import { EntitlementList, EntitlementValueList } from "../../shared/schemas/entitlement-list-schema";
import { Entitlement } from "../../shared/schemas/entitlement-schema";
import { FormGroup, FormArray, FormControl } from "@angular/forms";
import { ValidationService } from "../../shared/services/utilities/util_validation/validation.service";
import { UIConstants } from "../../shared/constants/ui-constants";
import { AppLoadingService } from "../../shared/services/loading/app-loading.service";
import { TranslateService } from '../../shared/services/translate/translate.service';
import { GlobalService } from '../../shared/services/global/global.service';

declare var $: any;

@Component({
  selector: 'idm-role-to-res-mapping-widget',
  templateUrl: './role-to-res-mapping-widget.component.html',
  styleUrls: ['./role-to-res-mapping-widget.component.css']
})
export class RoleToResMappingWidgetComponent implements OnInit {
  //@Input("selectedRole") selectedRole:any;
  selectedRole: any;

  @Input("selectedRoles")
  public set selectedRoles(val) {
    if (!this.vutils.isUndefinedOrNull(val)) {
      this.selectedRole = val;
      this.resetAll();
      this.resetPagination();
      this.resetResourcePagination();
      this.resetDriverResPagination();
      this.resetDriverEntPagination();
      this.driverFilter = '';
      this.getMappedResources("");
      this.getResourcesList();
    }
  }
  private destroy$ = new Subject();
  crDriverOrEntitlement: any[] = [];
  driverOrEntitlementDetails: any;
  driverOrEntitlementDetailsLoaded: boolean = false;
  logicalSystemsDropDownList: any[] = [];
  mapEntitlementValue: boolean = false;
  logicalSystems: any[] = [];
  mappedResources: any[];
  BackupmappedResources: any[];
  selectedMappedResources: any[];
  entitlementValues: EntitlementValueList;
  ResourceList: any[] = [];
  entitlementValuesPayload: any;
  mapEntitlementModal: boolean = false;
  mapResourceWithFormModal: boolean = false;
  resourceWithForm: Resource;
  entitlement: EntitlementResourceList;
  showEntitlementList: boolean;
  showResourceList: boolean;
  roleDetailsLoading: boolean;
  resourceLoading: boolean;
  driverListLoading: boolean;
  showResourceOfDriverList: boolean;
  deleteMappedResourceMessage: string;
  showDeleteConfirmModaal: boolean;
  DriversList: any[];
  additionalInfoForm: FormGroup;
  dynamicResEnt: FormControl;
  entitlements: FormArray;
  mapDynamicResources: Resource[] = [];
  dynamicResourceEntValue: any = [];
  entitlementValuesTouched: boolean = false;
  entitlementValuesFocusedout: boolean = false;
  dynamicResourceEntValuesPayload: any;
  recentlyMappedlist: any = [];
  nextIndex: number;
  prevIndex: number;
  resourceNextIndex: number;
  resourcePrevIndex: number;
  driverResNextIndex: number;
  driverResPrevIndex: number;
  entitlementPrevIndex: number;
  entitlementNextIndex: number;
  size: number;
  arraySize: number;
  resourceArraySize: number;
  resDriverArraySize: number;
  entitlementArraySize: number;
  queryChangedSubject: Subject<string> = new Subject<string>();
  resQueryChangedSubject: Subject<string> = new Subject<string>();
  resDriverQuerySubject: Subject<string> = new Subject<string>();
  entQuerySubject: Subject<string> = new Subject<string>();
  searchQuery: string;
  MappedREsourcesQuery: string;
  searchResQuery: string;
  searchDriverResQuery: string;
  searchEntQuery: string;
  resQuery: string;
  driverResQuery: string;
  entQuery: string;
  driverFilter: any = '';
  driverId: any;
  selectedTab: string = "res";

  crDriverOrEntitlementWidget: SelectionWidgetInitSchema = {
    widgetId: "crDriverOrEntitlement",
    activeTab: Tabs.driverOrEntitlement,
    selectionType: SelectionType.single,
    draggable: false,
    driverOrEntitlement: {
      selectionType: SelectionType.single
    }
  };
  logicalSystemConfig: SelectionWidgetInitSchema = {
    widgetId: "logicalSystem",
    activeTab: Tabs.dropdown,
    selectionType: SelectionType.dropdown,
    draggable: false,
    dropdown: {
      defaultLabel: "Select Logical System",
      autoSelectFirst: true
    },
    clearSelectionVisible: false
  };
  entitlementValuesConfig: SelectionWidgetInitSchema = {
    widgetId: "entitlementValues",
    activeTab: Tabs.entitlementValues,
    selectionType: SelectionType.multi,
    draggable: false,
    entitlementValues: {
    }
  };

  dynamicEntValuesConfig: SelectionWidgetInitSchema = {
    widgetId: "dynamicResourceEntValue",
    activeTab: Tabs.entitlementValues,
    selectionType: SelectionType.single,
    draggable: false,
    entitlementValues: {
    }
  };

  formValidation: any = {
    entitlementOrDriver: false,
    logicalSystem: false,
    selectedValue: false
  };
  selectDrivers: SelectionWidgetInitSchema = {
    widgetId: "selectDriversRR",
    activeTab: Tabs.dropdown,
    selectionType: SelectionType.dropdown,
    draggable: false,
    dropdown: {
      defaultLabel: this.translate.get("Select driver"),
      autoSelectFirst: false,
      tabLabel: this.translate.get("driver")
    }
  };

  selectedParent: any;
  crDriverOrEntitlementTouched: boolean = false;
  resOrEntToBeMapped: Resource[];
  resAlreadyBeMapped: Resource[];
  mappingDescription: string = "";
  @ViewChild('selectedResContainer') selectedResContainer: ElementRef;
  @ViewChild('selectedEntContainer') selectedEntContainer: ElementRef;

  constructor(
    private vutils: VariableService,
    private emitterService: EmitterService,
    private driversService: DriversService,
    private cd: ChangeDetectorRef,
    private RoleListService: RoleListService,
    private dragulaService: DragulaService,
    private roleCrudService: RoleCrudService,
    private feedbackService: FeedBackService,
    private ResourceListService: ResourceListService,
    private appLoadingService: AppLoadingService,
    private translate: TranslateService,
    private globalService: GlobalService
  ) {
    this.emitterService.get("crDriverOrEntitlement").pipe(mergeMap((data) => {
      this.driverOrEntitlementDetailsLoaded = false;
      if (data && data[0]) {
        this.formValidation.entitlementOrDriver = true;
        if (data[0].subType == "driver") {
          return this.driversService.getDetailsForDriver(data[0]);
        } else {
          return this.driversService.getDetailsForEntitlement(data[0])
        }
      } else {
        this.formValidation.entitlementOrDriver = false;
      }

      return observableOf(null);
    })).subscribe((data) => {
      this.driverOrEntitlementDetails = data;
      if (data) {
        this.selectedParent = data.parent;
        if (this.selectedParent == undefined) {
          this.selectedParent = data;
        }
      }
      this.setViews();
      this.setEntitlementValuesPayload(false);
      // if (this.logicalSystems[0] != undefined) {
      //   this.setEntitlementValuesPayload();
      // }
      this.driverOrEntitlementDetailsLoaded = true;
    });
    this.emitterService.get("logicalSystem")
      .subscribe((data) => {
        if (this.logicalSystems[0] != undefined)
          this.setEntitlementValuesPayload(true);
      });

    this.emitterService.get("selectDriversRR")
      .subscribe((data) => {
        if (this.vutils.isUndefinedOrNull(data) || this.vutils.isEmptyArray(data) || this.vutils.isUndefinedOrNull(data[0].id)) {
          this.resetResourcePagination();
          this.showResourceList = true;
          this.showResourceOfDriverList = false;
          this.showEntitlementList = false;
          this.driverId = "";
          this.getResourcesList();
        } else {
          this.driverId = { "id": data[0].id };
          this.resetDriverResPagination();
          if (this.selectedTab == "res") {
            this.showResourceList = false;
            this.showResourceOfDriverList = true;
          }
          this.getdriverResources({ "id": data[0].id });
        }
      });

    this.emitterService.get("dynamicResourceEntValue").subscribe((data) => {
      this.dynamicResourceEntValue = data;
    });

    this.mappedResources = [];
    this.selectedMappedResources = [];
    this.ResourceList = [];
    this.showEntitlementList = false;
    this.showResourceList = true;
    this.showResourceOfDriverList = false;
    this.entitlementValues = new EntitlementValueList();
    this.roleDetailsLoading = true;
    this.resourceLoading = true;
    this.driverListLoading = true;
    this.deleteMappedResourceMessage = this.translate.get("Are you sure you want to delete the selected Mapped Resource?");
    this.showDeleteConfirmModaal = false;
    this.resOrEntToBeMapped = [];
    this.resAlreadyBeMapped = [];
    this.mappingDescription = "";
    this.mapEntitlementModal = false;
    this.mapResourceWithFormModal = false;
    this.MappedREsourcesQuery = '*';
    this.searchResQuery = '*';
    this.searchEntQuery = '*';
    this.listernMappedREsourceSearch();
    this.listResSearch();
    this.listDriverResSearch();
    this.listEntitlementSearch();
  }

  listernMappedREsourceSearch() {
    this.queryChangedSubject.asObservable().pipe(
      debounceTime(1000))
      .subscribe(query => {
        this.MappedREsourcesQuery = query;
        if (this.vutils.isEmptyString(query)) {
          this.MappedREsourcesQuery = '*';
        }
        this.resetPagination();
        this.driverFilter = '';
        this.getMappedResources("");
      });
  }

  listResSearch() {
    this.resQueryChangedSubject.asObservable().pipe(
      debounceTime(1000))
      .subscribe(query => {
        this.searchResQuery = query;
        if (this.vutils.isEmptyString(query)) {
          this.searchResQuery = '*';
        }
        this.resourceNextIndex = 1;
        this.getResourcesList();
      });
  }

  listDriverResSearch() {
    this.resDriverQuerySubject.asObservable().pipe(
      debounceTime(1000))
      .subscribe(query => {
        this.searchDriverResQuery = query;
        if (this.vutils.isEmptyString(query)) {
          this.searchDriverResQuery = '*';
        }
        this.driverResNextIndex = 1;
        this.getdriverResources(this.driverId);
      });
  }

  listEntitlementSearch() {
    this.entQuerySubject.asObservable().pipe(
      debounceTime(1000))
      .subscribe(query => {
        this.searchEntQuery = query;
        if (this.vutils.isEmptyString(query)) {
          this.searchEntQuery = '*';
        }
        this.entitlementNextIndex = 1;
        this.fetchEntitlementValuesTabData();
      });
  }

  searchMappedResources(query) {
    this.queryChangedSubject.next(query);
  }
  resetPagination() {
    this.nextIndex = 1;
    this.prevIndex = 0;
    this.size = this.globalService.defaultRowsPerPage;
  }

  searchResources(query) {
    this.resQueryChangedSubject.next(query);
  }

  searchDriverResources(query) {
    this.resDriverQuerySubject.next(query);
  }

  searchEntitlements(query) {
    this.entQuerySubject.next(query);
  }

  resetResourcePagination() {
    this.resourceNextIndex = 1;
    this.resourcePrevIndex = 0;
    this.size = this.globalService.defaultRowsPerPage;
  }

  resetDriverResPagination() {
    this.driverResNextIndex = 1;
    this.driverResPrevIndex = 0;
    this.size = this.globalService.defaultRowsPerPage;
  }

  resetDriverEntPagination() {
    this.entitlementNextIndex = 1;
    this.entitlementPrevIndex = 0;
    this.size = this.globalService.defaultRowsPerPage;
  }

  getSeletedItemType(args: any): string {
    let [e, el] = args;
    let type = "entitlement";
    if (e.className.includes("resource")) {
      type = "resource";
    }
    return type;
  }

  addDynamicResource() {
    if (!this.vutils.isEmptyArray(this.mapDynamicResources)) {
      let resource: Resource = new Resource();
      resource.id = this.mapDynamicResources[0].id;
      resource.name = this.mapDynamicResources[0].name;
      resource.mappingDescription = this.mapDynamicResources[0].mappingDescription;
      resource.entitlementValues = this.mapDynamicResources[0].entitlementValues;
      if (!this.dynamicResourceAlreadyMapped(resource)) {
        resource.entitlementValues[0].value = this.dynamicResourceEntValue[0].value;
        this.resOrEntToBeMapped.push(resource);
        this.mappedResources.push(resource);
      } else {
        this.feedbackService.feedBackError(this.translate.get("Mapping already exists"));
      }
      $("#additionalInfo").modal("hide");
    }
  }

  addResourcesToMap(args: any) {
    let resource = this.getSelectedResourceItem(args);
    if (!this.vutils.isUndefinedOrNull(resource)) {
      if (this.isDynamicResource(resource)
        && this.vutils.isEmptyString(resource.resourceParameters)) {
        this.mapDynamicResources = [];
        this.dynamicResourceEntValue = [];
        this.mapDynamicResources.push(resource);
        this.dynamicResourceEntValuesPayload = this.getDynamicResourceEntValuesPayload(resource);
        // this.additionalInfoForm.reset();
        $("#additionalInfo").modal("show");
      } else if (!this.vutils.isUndefinedOrNull(resource.resourceParameters)
        && !this.vutils.isEmptyArray(resource.resourceParameters)) {
        this.resourceWithForm = new Resource();
        this.resourceWithForm.resourceParameters = [];
        this.resourceWithForm = resource;
        let parameters = [];
        for (let parameter of resource.resourceParameters) {
          if (parameter.type === 'EntitlementRef') {
            parameter.key = parameter.entitlementDn;
            parameter.attributeValues = [];
          } else {
            parameter.key = parameter.id;
          }
          parameter.displayLabel = parameter.displayValue;
          parameter.isMultivalued = parameter.multiValue;
          parameter.dataType = parameter.type;
          parameter.isEditable = true;
          parameter.isentVal = true;
          if (!parameter.hide && this.vutils.isEmptyString(parameter.staticValue)) {
            parameter['isRequired'] = 'true';
          }
          parameter.parentType = "resource";
          parameters.push(parameter);
        }
        this.resourceWithForm.resourceParameters = parameters;
        this.mapResourceWithFormModal = true;
      } else {
        //validation isexists
        this.resAlreadyBeMapped = [];
        if (!this.isPresent(resource)) {
          this.resOrEntToBeMapped.push(resource);
          for (let element of this.resOrEntToBeMapped) {
            let indices: number[] = this.getIndices(this.resOrEntToBeMapped, 'id', element.id);
            if (!this.vutils.isEmptyArray(indices) && indices.length > 1) {
              for (let i = 1; i <= indices.length; i++) {
                this.resOrEntToBeMapped.splice(indices[i], 1);
              }
            }
          }
          for (let resource of this.resOrEntToBeMapped) {
            this.mappedResources.push(resource);
          }
        } else {
          this.resAlreadyBeMapped.push(resource);
          this.feedbackService.feedBackError(this.translate.get("Mapping already exists"));
        }
      }
    }
  }

  mapResourceWithFormEvent(resource: Resource) {
    if (!this.vutils.isUndefinedOrNull(resource)) {
      resource.isentVal = true;
      let tempResource = this.vutils.stringify(resource);
      this.mappedResources.push(JSON.parse(tempResource));
      this.resOrEntToBeMapped.push(JSON.parse(tempResource));
    }
    this.mapResourceWithFormModal = false;
  }

  getEntitlementDetails(args: any) {
    let entitlement = this.getSelectedEntitlementItem(args);
    if (!this.vutils.isUndefinedOrNull(entitlement)) {
      let requestPayload = new EntitlementList();
      requestPayload.entitlements.push(this.preProcess(entitlement));
      this.roleCrudService.getResourcefromEntitlement(requestPayload).subscribe(data => {
        if (!this.vutils.isUndefinedOrNull(data) && this.vutils.isArray(data.entResourcesList)) {
          this.entitlement = new EntitlementResourceList();
          this.entitlement.entName = data.entResourcesList[0].entName;
          this.entitlement.resources = data.entResourcesList[0].resources;
          this.entitlement.resources.push(this.getDefaultResource(requestPayload));
          // in case of entitlements we need to show a form we can use this to invoke a modal pop-up here
          this.mapEntitlementModal = true;
        }
      }, error => {
        this.feedbackService.feedBackError(error);
      });
    }
  }

  preProcess(entitlement: Entitlement) {
    let processedEntitlement = new Entitlement();

    processedEntitlement.displayName = entitlement.entitlementName;
    processedEntitlement.driverName = entitlement.driverName;
    processedEntitlement.id = entitlement.id;
    processedEntitlement.parameterName = entitlement.name;
    processedEntitlement.name = entitlement.entitlementName;
    processedEntitlement.parameterValue = entitlement.value;

    return processedEntitlement;
  }

  getDefaultResource(entitlements: EntitlementList) {
    let defaultResource = new Resource();
    defaultResource.id = "createResource";
    defaultResource.name = "--create New Resource--";
    defaultResource.entitlements = entitlements.entitlements;
    return defaultResource;
  }

  getSelectedEntitlementItem(args: any) {
    let [e, el] = args; //element, elementList
    let item;
    let foundAt = 0;
    for (let i in el.children) {
      if (el.children[foundAt].id == e.id) {
        if (!this.vutils.isUndefinedOrNull(this.entitlementValues.entitlements)) {
          item = this.entitlementValues.entitlements[foundAt];
          return item;
        }
      }
      ++foundAt;
    }
  }

  getSelectedResourceItem(args: any) {
    let [e, el] = args; //element, elementList
    let item;
    let foundAt = 0;
    for (let i in el.children) {
      if (el.children[foundAt].id == e.id) {
        item = this.ResourceList[foundAt];
        return item;
      }
      ++foundAt;
    }
  }

  getSelectedResourceItemGivenParent(element: any, parent: any) {
    let item;
    for (let i in parent.children) {
      if (parent.children[i].id == element.id) {
        item = this.ResourceList[+i];
        return item;
      }
    }
  }

  getSelectedEntitlementItemGivenParent(element: any, parent: any) {
    let item;
    for (let i in parent.children) {
      if (parent.children[i].id == element.id) {
        item = this.entitlementValues.entitlements[+i];
        return item;
      }
    }
  }

  getUniqueResourceIds(mappedResources: any, resource: any) {
    let uniqueIds = [];
    let tempID;
    let found = false;
    for (let res of mappedResources) {
      if (res.driverName.toLocaleLowerCase().includes(res.driver.toLocaleLowerCase())
        || res.driver.toLocaleLowerCase().includes(res.driver.toLocaleLowerCase())
      ) {
        tempID = res.id;
        found = true;
        break;
      }
    }
  }

  ngOnInit() {
    this.getDriverList();
    this.mapEntitlementModal = false;
    this.mapResourceWithFormModal = false;
    this.createFormControls();
    this.createForm();
    $("#additionalInfo").modal("hide");

    this.dragulaService.setOptions('selected-resource-bag', {
      moves: function (el, container, handle) {
        if (handle.className.includes('nodrag')) {
          return false;
        }
        return true;
      },
      accepts: function (el, target, source, sibling) {
        if (el.className.includes('entitlement')
          || el.className.includes(UIConstants.classNameToAdd)) {
          return false;
        }
        return true;
      },
      copy: true
    });

    this.dragulaService.dropModel.asObservable().pipe(
      takeUntil(this.destroy$)).subscribe((value: any) => {
        let [e, el] = value.slice(1);
        if (!e.className.includes('entitlement')
          && !e.className.includes(UIConstants.classNameToAdd)) {
          let tempMappedresources = [];
          for (let temp of this.mappedResources) {
            tempMappedresources.push(temp);
          }
          for (let mapRes of tempMappedresources) {
            let indices: number[] = this.getIndices(this.mappedResources, 'id', mapRes.id);
            if (!this.vutils.isEmptyArray(indices) && indices.length > 1) {
              for (let i = 1; i < indices.length; i++) {
                if (this.vutils.isUndefined(mapRes.saved)) {
                  this.mappedResources.splice(indices[i], 1);
                }
              }
            }
          }
        }
      });

    this.dragulaService.drag.asObservable().pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (this.vutils.isUndefinedOrNull(this.mappedResources)) {
        this.mappedResources = [];
      }
      let selectedItemType = this.getSeletedItemType(value.slice(1));
      if (selectedItemType == "resource") {
        this.addResourcesToMap(value.slice(1));
      } else {
        this.getEntitlementDetails(value.slice(1));
      }
    });
  }

  createFormControls() {
    this.entitlements = new FormArray([]);
    this.dynamicResEnt = new FormControl([], [ValidationService.nonemptyArrayValidator]);
  }

  createForm() {
    this.additionalInfoForm = new FormGroup({
      entitlements: this.entitlements,
      dynamicResEnt: this.dynamicResEnt
    });

    this.additionalInfoForm.controls["resourceName"] = new FormControl('');
    this.additionalInfoForm.controls["entName"] = new FormControl('');
  }
  getMappedResources(driverDN) {
    this.roleDetailsLoading = true;
    this.appLoadingService.ComponentLoading = true;
    this.prevIndex = this.nextIndex == 1 ? 0 : this.nextIndex;
    if (!this.vutils.isUndefinedOrNull(this.selectedRole)) {
      this.RoleListService.getMappedResources(this.selectedRole, this.MappedREsourcesQuery, this.size, this.nextIndex, driverDN).subscribe(res => {
        this.mappedResources = [];
        this.BackupmappedResources = []
        this.nextIndex = res.nextIndex;
        this.arraySize = res.arraySize;
        if (res.hasOwnProperty('resources')) {
          let tempEntVal: any = {};
          res.resources.forEach(element => {
            element.saved = true;
            tempEntVal = element;
            if (this.vutils.isUndefinedOrNull(element.entitlementValues)) {
              tempEntVal.isentVal = true;
            }
            this.mappedResources.push(tempEntVal);
          });
          // = res.resources;
          this.BackupmappedResources = Object.assign([], this.mappedResources);
        }
        this.roleDetailsLoading = false;
        this.selectedMappedResources = [];
        // this.mappedResources.prevIndex=;
        this.appLoadingService.ComponentLoading = false;
      });
    }

  }

  getResourcesList() {
    this.ResourceList = [];
    this.resourceLoading = true;
    this.resourcePrevIndex = this.resourceNextIndex == 1 ? 0 : this.resourceNextIndex;
    this.ResourceListService.getPermResources(this.searchResQuery, this.size, this.resourceNextIndex, true, true).subscribe(res => {
      if (!this.vutils.isUndefinedOrNull(res.resources)) {
        for (let resource of res.resources) {
          if (this.isDynamicResource(resource) || this.isResourceWithForm(resource)) {
            resource.addClass = UIConstants.classNameToAdd;
          } else {
            resource.addClass = "";
          }
          this.ResourceList.push(resource);
        }
      }

      this.resourceNextIndex = res.nextIndex;
      this.resourceArraySize = res.arraySize;
      if (this.selectedTab == "res") {
        this.showResourceList = true;
      } else {
        this.showResourceList = false;
      }
      this.resourceLoading = false;

    });

  }

  resourcePagination(type) {
    if (type === 'next') {
      if (this.resourceNextIndex > 0) {
        this.getResourcesList();
      }
    } else {
      if (this.resourcePrevIndex > 0) {
        this.resourceNextIndex = (this.resourcePrevIndex - this.size);
        this.getResourcesList();
      }
    }
  }

  resourcesStartingFrom() {
    let showIndex;
    if (this.resourcePrevIndex == 0) {
      showIndex = 1;
    } else {
      showIndex = this.resourcePrevIndex;
    }
    return showIndex;
  }

  resourcesEndingList() {
    return this.resourcesStartingFrom() + this.resourceArraySize - 1;
  }

  driverResPagination(type) {
    if (type === 'next') {
      if (this.driverResNextIndex > 0) {
        this.getdriverResources(this.driverId);
      }
    } else {
      if (this.driverResPrevIndex > 0) {
        this.driverResNextIndex = (this.driverResPrevIndex - this.size);
        this.getdriverResources(this.driverId);
      }
    }
  }

  driverResStartingFrom() {
    let showIndex;
    if (this.driverResPrevIndex == 0) {
      showIndex = 1;
    } else {
      showIndex = this.driverResPrevIndex;
    }
    return showIndex;
  }

  driverResEndingList() {
    return this.driverResStartingFrom() + this.resDriverArraySize - 1;
  }

  getdriverResources(DriverID) {
    this.ResourceList = [];
    this.resourceLoading = true;
    this.driverResPrevIndex = this.driverResNextIndex == 1 ? 0 : this.driverResNextIndex;
    this.ResourceListService.getdriverResources(DriverID, this.searchDriverResQuery, this.size, this.driverResNextIndex).subscribe(res => {
      this.ResourceList = res.resources;
      this.driverResNextIndex = res.nextIndex;
      this.resDriverArraySize = res.arraySize;
      if (this.selectedTab == "res") {
        this.showResourceOfDriverList = true;
      } else {
        this.showResourceOfDriverList = false;
      }
      this.showResourceList = false;
      this.resourceLoading = false;
    });

  }
  // Fix for ExpressionChangedAfterItHasBeenCheckedError for Logical System IDs

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }
  // Fix : end

  mapEntitlementValueChanged() {
    this.mapEntitlementValue = !this.mapEntitlementValue;
  }

  getSelectedDriverOrEntitlement() {
    if (this.vutils.isUndefinedOrNull(this.crDriverOrEntitlement)) {
      return null;
    } else {
      return this.crDriverOrEntitlement[0];
    }
  }

  isResourceWithForm(resource: Resource) {
    if (!this.vutils.isUndefinedOrNull(resource.resourceParameters)
      && !this.vutils.isEmptyArray(resource.resourceParameters)) {
      return true;
    }
    return false;
  }
  isDynamicResource(resource: Resource) {
    if (!this.vutils.isUndefinedOrNull(resource.entitlementValues)) {
      if (resource.entitlementValues.length > 1) {
        return false;
      } else if (resource.entitlementValues.length == 0) {
        return true;
      }
      let entitlementValue = resource.entitlementValues[0];
      if (!this.vutils.isUndefinedOrNull(entitlementValue.type) && entitlementValue.type == "NO_PARAMS") {
        return false;
      }
      if (!this.vutils.isUndefinedOrNull(entitlementValue.value) && entitlementValue.value == "%EntitlementParamKey%") {
        return true;
      }
    }
    return false;
  }

  getSelectedDriverOrEntitlementDetails() {
    return this.driverOrEntitlementDetails;
  }

  isEntitlementSelected() {
    let x = this.getSelectedDriverOrEntitlement();
    if (this.vutils.isUndefinedOrNull(x)) {
      return false;
    } else {
      if (x.subType == "entitlement") {
        return true;
      }
      return false;
    }
  }

  getViews() {
    if (!this.vutils.isUndefinedOrNull(this.driverOrEntitlementDetails)) {
      if (!this.vutils.isEmptyArray(this.driverOrEntitlementDetails.entitlements)) {
        return this.driverOrEntitlementDetails.views;
      }
    }
    return [];
  }

  setViews() {
    this.logicalSystemsDropDownList = this.getViews();
  }

  getDynamicResourceEntValuesPayload(resource: Resource) {
    let entValuesPayload: any = {};
    if (!this.vutils.isUndefinedOrNull(resource)
      && !this.vutils.isUndefinedOrNull(resource.entitlementValues)) {
      entValuesPayload.id = resource.entitlementValues[0].id;
      entValuesPayload.hasLogicalSystem = false;
    }
    return entValuesPayload;
  }

  setEntitlementValuesPayload(hasLogicalSystems: boolean) {
    this.resetDriverEntPagination();
    this.entitlementValuesPayload = {};
    if (!this.vutils.isEmptyString(this.driverOrEntitlementDetails)) {
      this.entitlementValuesPayload.id = this.driverOrEntitlementDetails.id;
      if (hasLogicalSystems) {
        this.entitlementValuesPayload.viewID = this.logicalSystems[0].queryKey;
        this.entitlementValuesPayload.entitlements = [];
        if (this.selectedParent.entitlements != undefined) {
          for (let i = 0; i < this.selectedParent.entitlements.length; ++i) {
            if (this.selectedParent.entitlements[i].views != undefined) {
              for (let j = 0; j < this.selectedParent.entitlements[i].views.length; ++j) {
                if (this.vutils.equals(this.selectedParent.entitlements[i].views[j].queryKey, this.logicalSystems[0].queryKey)) {
                  let customEntitlementObject: any = {};
                  customEntitlementObject.id = this.selectedParent.entitlements[i].id;
                  customEntitlementObject.displayName = this.selectedParent.entitlements[i].name || this.selectedParent.entitlements[i].displayName;
                  customEntitlementObject.paramLogicSystem = this.selectedParent.entitlements[i].views[j].viewID;
                  this.entitlementValuesPayload.entitlements.push(customEntitlementObject);
                }
              }
            }
          }
        }
        this.entitlementValuesPayload.hasLogicalSystem = true;
      } else {
        this.entitlementValuesPayload.hasLogicalSystem = false;
      }
      this.fetchEntitlementValuesTabData();
    }
  }

  fetchEntitlementValuesTabData() {
    // let nextIndex = this.config.paginationSize * this.config.tabs[Tabs.entitlementValues].currentPageIndex + 1;
    this.resourceLoading = true;
    this.entitlementPrevIndex = this.entitlementNextIndex == 1 ? 0 : this.entitlementNextIndex;
    this.appLoadingService.ComponentLoading = true;
    if (!this.vutils.isUndefinedOrNull(this.entitlementValuesPayload) && this.entitlementValuesPayload.hasLogicalSystem == true) {
      this.driversService.getEntitlementValuesWithLogicalID(this.searchEntQuery, this.entitlementNextIndex, this.size, this.entitlementValuesPayload)
        .subscribe(arg => {
          // this.entitlementValues=arg
          if (!this.vutils.isUndefinedOrNull(arg) && !this.vutils.isUndefinedOrNull(arg.entitlementValues)) {
            this.entitlementValues.entitlements = arg.entitlementValues;
            if (!this.vutils.isUndefinedOrNull(this.entitlementValues.entitlements)) {
              this.entitlementValues.entitlements.forEach(element => {
                element.driverID = this.driverOrEntitlementDetails.id;;
                element.driverName = this.driverOrEntitlementDetails.name;
              });
            }
          } else {
            this.entitlementValues.entitlements = [];
          }
          this.resourceLoading = false;
          this.showEntitlementList = true;
          this.entitlementArraySize = arg.arraySize;
          this.entitlementNextIndex = arg.nextIndex;
          // this.config.tabs[Tabs.entitlementValues].nextIndex = arg.nextIndex;
          //this.updateCommonVariablesOnSuccess();
          this.appLoadingService.ComponentLoading = false;
        }, error => {
          // this.resultsLoading = false;
          // this.errorMessage = this.config.tabs[Tabs.entitlementValues].errorMessage;
        });
    } else {
      this.driversService.getEntitlementValuesWithoutLogicalID(this.searchEntQuery, this.entitlementNextIndex, this.size, this.entitlementValuesPayload)
        .subscribe(arg => {
          this.appLoadingService.ComponentLoading = false;
          //   this.config.tabs[Tabs.entitlementValues].itemsList = arg.entitlementValues;
          //   this.config.tabs[Tabs.entitlementValues].nextIndex = arg.nextIndex;
          if (!this.vutils.isUndefinedOrNull(arg) && !this.vutils.isUndefinedOrNull(arg.entitlementValues)) {
            this.entitlementValues.entitlements = arg.entitlementValues;
            if (!this.vutils.isUndefinedOrNull(this.entitlementValues.entitlements)) {
              this.entitlementValues.entitlements.forEach(element => {
                element.driverID = this.driverOrEntitlementDetails.id;;
                element.driverName = this.driverOrEntitlementDetails.name;
              });
            }
          } else {
            this.entitlementValues.entitlements = [];
          }
          this.resourceLoading = false;
          this.showEntitlementList = true;
          this.entitlementArraySize = arg.arraySize;
          this.entitlementNextIndex = arg.nextIndex;
          //  // this.updateCommonVariablesOnSuccess();
        }, error => {
          // this.resultsLoading = false;
          // this.errorMessage = this.config.tabs[Tabs.entitlementValues].errorMessage;
        });
    }
  }

  entitlementPagination(type) {
    if (type === 'next') {
      if (this.entitlementNextIndex > 0) {
        this.fetchEntitlementValuesTabData();
      }
    } else {
      if (this.entitlementPrevIndex > 0) {
        this.entitlementNextIndex = (this.entitlementPrevIndex - this.size);
        this.fetchEntitlementValuesTabData();
      }
    }
  }

  entitlementsStartingFrom() {
    let showIndex;
    if (this.entitlementPrevIndex == 0) {
      showIndex = 1;
    } else {
      showIndex = this.entitlementPrevIndex;
    }
    return showIndex;
  }

  entitlementsEndingList() {
    return this.entitlementsStartingFrom() + this.entitlementArraySize - 1;
  }

  toggleTabs(tab) {
    this.resetResourcePagination();
    this.resetDriverResPagination();
    this.resetDriverEntPagination();
    this.selectedTab = tab;
    if (tab == 'res') {
      this.showResourceList = true;
      this.showResourceOfDriverList = false;
      this.showEntitlementList = false;
      this.driverId = "";
      this.getResourcesList();
    } else {
      this.showResourceList = false;
      this.showResourceOfDriverList = false;
      this.showEntitlementList = true;
      this.driverOrEntitlementDetails = null;
      this.crDriverOrEntitlement = [];
      this.driverOrEntitlementDetailsLoaded = false;
    }

  }

  toggleSelected(obj, event) {
    if (obj.hasOwnProperty('saved')) {
      if (event.ctrlKey) {
        this.deleteIfObjectPresentOrAdd(obj, this.selectedMappedResources);
      } else {
        this.selectedMappedResources = [];
        this.recentlyMappedlist = [];
        this.selectedMappedResources.push(obj);
      }
    }
    else {
      if (event.ctrlKey) {
        this.deleteIfObjectPresentOrAdd(obj, this.recentlyMappedlist);
      } else {
        this.recentlyMappedlist = [];
        this.selectedMappedResources = [];
        this.recentlyMappedlist.push(obj);
      }
    }
  }

  deleteIfObjectPresentOrAdd(obj, array) {
    for (let i = 0; i < array.length; ++i) {
      let element = array[i];
      if (element.id == obj.id) {
        array.splice(i, 1);
        return true;
      }
    }
    array.push(obj);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.dragulaService.destroy('selected-resource-bag');
    this.resetAll();
  }

  resetAll() {
    this.mappedResources = [];
    this.recentlyMappedlist = [];
    this.resAlreadyBeMapped = [];
    this.resOrEntToBeMapped = [];
  }

  mapResources() {
    if (!this.vutils.isUndefinedOrNull(this.resOrEntToBeMapped)
      && !this.vutils.isEmptyArray(this.resOrEntToBeMapped)) {
      let roleResourceAssociation = new RoleResourceAssociation();
      roleResourceAssociation.roleId = this.selectedRole.id;
      roleResourceAssociation.mappedResources = this.resOrEntToBeMapped;
      for (let count = 0; count < this.resOrEntToBeMapped.length; count++) {
        this.resOrEntToBeMapped[count].mappingDescription = this.mappingDescription;
      }
      this.roleCrudService.mapResources(roleResourceAssociation).subscribe(res => {
        this.resOrEntToBeMapped = [];
        this.resAlreadyBeMapped = [];
        let responseFeedback = {
          "succeeded": [],
          "failed": [],
          "success": false
        };
        if (!this.vutils.isUndefinedOrNull(res.succeeded)) {
          if (this.vutils.isArray(res.succeeded)) {
            responseFeedback.succeeded = res.succeeded;
          } else {
            responseFeedback.succeeded.push(res.succeeded);
          }
          responseFeedback.success = true;
        } else {
          delete responseFeedback['succeeded'];
        }
        if (!this.vutils.isUndefinedOrNull(res.failed)) {
          if (this.vutils.isArray(res.failed)) {
            responseFeedback.failed = res.failed;
          } else {
            responseFeedback.failed.push(res.failed);
          }
          responseFeedback.success = false;
        } else {
          delete responseFeedback['failed'];
        }
        this.mappingDescription = "";
        this.feedbackService.feedBack(responseFeedback);
        this.resetPagination();
        this.driverFilter = '';
        this.getMappedResources("");
      }, error => {
        this.mappingDescription = "";
        this.feedbackService.feedBack(error);
      });
    }
  }

  reset() {
    this.mappingDescription = "";
    for (let element of this.resOrEntToBeMapped) {
      let index: number = this.getIndex(this.mappedResources, 'id', element);
      if (!this.vutils.isUndefinedOrNull(index)) {
        this.mappedResources.splice(index, 1);
      }
    }
    this.resOrEntToBeMapped = [];
    this.resAlreadyBeMapped = [];
  }

  findIndexByKeyValue(arraytosearch, key, valuetosearch) {
    for (let i = 0; i < arraytosearch.length; i++) {
      if (arraytosearch[i][key].toLocaleLowerCase() === valuetosearch.toLocaleLowerCase()) {
        return i;
      }
    }
    return null;
  }

  getIndices(arraytosearch, key, valuetosearch) {
    let indices: number[] = [];
    for (let i = 0; i < arraytosearch.length; i++) {
      if (arraytosearch[i][key].toLocaleLowerCase() === valuetosearch.toLocaleLowerCase()) {
        indices.push(i);
      }
    }
    return indices;
  }

  getIndex(arraytosearch, key, item) {
    let index: number = null;
    if (!this.vutils.isEmptyArray(arraytosearch)) {
      let itemValue = '';
      if (!this.vutils.isUndefinedOrNull(item.entitlementValues)
        && !this.vutils.isUndefinedOrNull(item.resourceParameters)) {
        itemValue = item.resourceParameters[0].value.toString().trim();
      } else if (this.vutils.isUndefinedOrNull(item.entitlementValues)
        && !this.vutils.isUndefinedOrNull(item.resourceParameters)) {
        let resourceFormValue = {};
        for (let param of item.resourceParameters) {
          resourceFormValue[param.id.toString().trim()] = param.value.toString().trim();
        }
        itemValue = JSON.stringify(resourceFormValue);
      }
      for (let i = 0; i < arraytosearch.length; i++) {
        let iterItemValue = '';
        if (!this.vutils.isUndefinedOrNull(arraytosearch[i].entitlementValues)
          && !this.vutils.isUndefinedOrNull(arraytosearch[i].resourceParameters)) {
          iterItemValue = arraytosearch[i].resourceParameters[0].value;
        } else if (this.vutils.isUndefinedOrNull(arraytosearch[i].entitlementValues)
          && !this.vutils.isUndefinedOrNull(arraytosearch[i].resourceParameters)) {
          let resourceFormValue = {};
          for (let param of arraytosearch[i].resourceParameters) {
            resourceFormValue[param.id.toString().trim()] = param.value.toString().trim();
          }
          iterItemValue = JSON.stringify(resourceFormValue);
        }
        if (arraytosearch[i][key].toLocaleLowerCase() === item.id.toLocaleLowerCase()) {
          if (!this.vutils.isUndefinedOrNull(itemValue)
            && !this.vutils.isUndefinedOrNull(iterItemValue)
            && arraytosearch[i]['saved'] == item.saved && iterItemValue === itemValue) {
            index = i;
            break;
          }
        }
      }
    }
    return index;
  }

  mapEntitlementEvent(entitlementResourceList: EntitlementResourceList[]) {
    //validation isexists
    for (let entitlement of entitlementResourceList) {
      for (let resource of entitlement.resources) {
        if (!this.isPresent(resource)) {
          this.mappedResources.push(resource);
          this.resOrEntToBeMapped.push(resource);
        } else {
          this.feedbackService.feedBackError(this.translate.get("Mapping already exists"));
        }
      }
    }
    this.mapEntitlementModal = false;
  }

  isPresent(resourceToBeMapped: Resource): boolean {
    if (!this.vutils.isUndefinedOrNull(this.mappedResources)) {
      for (let resource of this.mappedResources) {
        if (resource.id.toLowerCase().includes(resourceToBeMapped.id.toLocaleLowerCase())) {
          return true;
        }
      }
    } /* else {
      this.mappedResources = [];
    } */
    return false;
  }

  dynamicResourceAlreadyMapped(resourceToBeMapped: Resource): boolean {
    if (!this.vutils.isUndefinedOrNull(this.mappedResources)) {
      for (let resource of this.mappedResources) {
        if (resource.id.toLowerCase().includes(resourceToBeMapped.id.toLocaleLowerCase())) {
          if (this.vutils.isEmptyArray(resource.enititlementValues) && this.vutils.isEmptyArray(resourceToBeMapped.entitlementValues)) {
            return true;
          } else if (!this.vutils.isEmptyArray(resource.enititlementValues)) {
            for (let val of resourceToBeMapped.entitlementValues) {
              if (resource.enititlementValues.some(x => x.value === val.value)) {
                return true;
              }
            }
          }
        }
      }
    }
    if (!this.vutils.isUndefinedOrNull(this.resOrEntToBeMapped)) {
      for (let resource of this.resOrEntToBeMapped) {
        if (resource.id.toLowerCase().includes(resourceToBeMapped.id.toLocaleLowerCase())) {
          if (this.vutils.isEmptyArray(resource.entitlementValues) && this.vutils.isEmptyArray(resourceToBeMapped.entitlementValues)) {
            return true;
          } else if (!this.vutils.isEmptyArray(resource.entitlementValues)) {
            for (let val of resourceToBeMapped.entitlementValues) {
              if (resource.entitlementValues.some(x => x.value === val.value)) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  isItemSelected(item) {
    if (this.vutils.isUndefined(item.saved)) {
      for (var index = 0; index < this.recentlyMappedlist.length; index++) {
        var element = this.recentlyMappedlist[index];
        if (element.id == item.id) {
          return true;
        }
      }
    }
    else {
      for (var index = 0; index < this.selectedMappedResources.length; index++) {
        var element = this.selectedMappedResources[index];
        if (element.id == item.id) {
          return true;
        }
      }
    }

    return false;
  }

  deleteResourceMapped(resource) {
    this.resetMappedItems(resource);
    if (resource.saved) {
      let payload = { mappedResources: [], roleId: '' };
      payload.mappedResources.push(resource);
      payload.roleId = this.selectedRole;
      this.roleDetailsLoading = true;
      this.RoleListService.deleteMappedResources(payload).subscribe((res) => {
        this.roleDetailsLoading = false;
        this.resetPagination();
        this.driverFilter = '';
        this.getMappedResources("");
      });
    }
  }

  resetMapped(resource) {
    let pos = this.mappedResources.map(function (e) { return e.id; }).indexOf(resource.id);
    this.mappedResources.splice(pos, 1);
    pos = this.resOrEntToBeMapped.map(function (e) { return e.id; }).indexOf(resource.id);
    this.resOrEntToBeMapped.splice(pos, 1);
    pos = this.recentlyMappedlist.map(function (e) { return e.id; }).indexOf(resource.id);
    this.recentlyMappedlist.splice(pos, 1);
  }

  removeFromArray(item, arrayList) {
    let index: number = this.getIndex(arrayList, 'id', item);
    if (!this.vutils.isUndefinedOrNull(index)) {
      arrayList.splice(index, 1);
      this.removeFromArray(item, arrayList);
    }
  }

  clearMappedResources(resource) {
    this.removeFromArray(resource, this.mappedResources);
  }

  clearResOrEntToBeMapped(resource) {
    this.removeFromArray(resource, this.resOrEntToBeMapped);
  }

  clearRecentlyMappedlist(resource) {
    this.removeFromArray(resource, this.recentlyMappedlist);
  }

  resetMappedItems(resource) {
    this.clearMappedResources(resource);
    this.clearResOrEntToBeMapped(resource);
    this.clearRecentlyMappedlist(resource);
  }

  deleteMappedREsource() {
    if (this.recentlyMappedlist.length > 0) {
      this.resetRecentlyMapped();
    }
    if (this.selectedMappedResources.length > 0) {
      let payload = { "mappedResources": [], "roleId": "" };
      // this.selectedMappedResources.forEach()
      payload.mappedResources = this.selectedMappedResources;
      payload.roleId = this.selectedRole;
      this.roleDetailsLoading = true;
      this.RoleListService.deleteMappedResources(payload).subscribe(res => {
        this.roleDetailsLoading = false;
        this.resetPagination();
        this.driverFilter = '';
        this.getMappedResources("");
      });
    }

  }

  resetRecentlyMapped() {
    for (let element of this.recentlyMappedlist) {
      let pos = this.mappedResources.map(function (e) { return e.id; }).indexOf(element.id);
      this.mappedResources.splice(pos, 1);
      pos = this.resOrEntToBeMapped.map(function (e) { return e.id; }).indexOf(element.id);
      this.resOrEntToBeMapped.splice(pos, 1);
    }
    this.recentlyMappedlist = [];
  }

  enableDelete() {
    return (this.selectedMappedResources.length > 0 || this.recentlyMappedlist.length > 0) ? true : false;
  }
  deleteConfirm() {
    this.showDeleteConfirmModaal = true;
  }
  clearSelection() {
    this.selectedMappedResources = [];
    this.recentlyMappedlist = [];
  }
  getDriverList() {
    this.driversService.getDriversList().subscribe(res => {
      this.DriversList = res.drivers;
    });
  }
  alreadyMapped(item) {
    for (let i = 0; i < this.resOrEntToBeMapped.length; ++i) {
      let element = this.resOrEntToBeMapped[i];
      if (element.id == item.id) {
        return false;
      }
    }
    return true;
  }
  pagination(type) {
    if (type === 'next') {
      if (this.nextIndex > 0) {
        this.getMappedResources(this.driverFilter);
      }
    }
    else {
      if (this.prevIndex > 0) {
        this.nextIndex = (this.prevIndex - this.size);
        this.getMappedResources(this.driverFilter);
      }
    }
  }
  startingFrom() {
    let showIndex;
    if (this.prevIndex == 0) {
      showIndex = 1;
    }
    else {
      showIndex = this.prevIndex;
    }
    return showIndex;
  }

  endingList() {
    return this.startingFrom() + this.arraySize - 1;
  }

  filterMappedResources(driverDN) {
    this.resetPagination();
    this.getMappedResources(driverDN);
  }

  clearMappedResourcesFilters() {
    this.driverFilter = '';
  }

  isValid() {
    let isValid = true;
    if (this.vutils.isEmptyString(this.mappingDescription)
      || this.vutils.isEmptyArray(this.resOrEntToBeMapped)) {
      isValid = false;
    }
    return isValid;
  }
  getEntValues(val): string {
    // console.log(val);
    let temp = [];
    if (this.vutils.isArray(val)) {
      val.forEach(element => {
        if (!this.vutils.isEmptyArray(element.attributeValues) && !this.vutils.isUndefinedOrNull(element.attributeValues[0].name)) {
          temp.push(element.attributeValues[0].name);
        } else if (!this.vutils.isUndefinedOrNull(element.value)) {
          temp.push(element.value);
        }
      });
      return temp.toString();
    }
    return '';
  }

}
