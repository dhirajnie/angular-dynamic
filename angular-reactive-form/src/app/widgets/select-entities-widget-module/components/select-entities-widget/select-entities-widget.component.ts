
import { debounceTime } from 'rxjs/operators';
import { Component, OnInit, ElementRef, Input, EventEmitter, Output, ViewChild, SimpleChanges } from '@angular/core';
import { PathConstats } from "../../../../shared/constants/path-constants";
import { UsersListService } from "../../../../shared/services/selection-widget/users-list/users-list.service";
import { GroupsListService } from "../../../../shared/services/selection-widget/groups-list/groups-list.service";
import { RolesPermListService } from "../../../../shared/services/selection-widget/roles-perm-list/roles-perm-list.service";
import { VariableService } from "../../../../shared/services/utilities/util_variable/variable.service";
import { ListService } from "../../../../shared/services/utilities/util_list/list.service";
import { EntityService } from "../../../../shared/services/entity/entity.service";
import { SelectionTabSchema } from "../../../../shared/schemas/selection-tab-schema";
import { SelectionTabConfigSchema } from "../../../../shared/schemas/selection-tab-config-schema";
import { SelectionWidgetInitSchema } from "../../../../shared/schemas/selection-widget-init-schema";
import { RoleCategoriesService } from "../../../../shared/services/selection-widget/role-categories/role-categories.service";
import { CatalogContainersService } from "../../../../shared/services/selection-widget/catalog-conatiners/catalog-containers.service";
import { Subject } from "rxjs";
import { DragulaService } from "ng2-dragula";
import * as autoScroll from "dom-autoscroller";
import { ResourceCategoriesService } from "../../../../shared/services/selection-widget/resource-categories/resource-categories.service";
import { EmitterService } from "../../../../shared/services/emitter/emitter.service";
import { PrdsListService } from "../../../../shared/services/selection-widget/prds-list/prds-list.service";
import { DriversService } from "../../../../shared/services/selection-widget/driver/drivers.service";
import { RoleLevelService } from "../../../../shared/services/role/role-level/role-level.service";
import { CprsResourcesService } from "../../../../shared/services/cprs/cprs-resources/cprs-resources.service";
import { Resource } from "../../../../shared/schemas/resource-schema";
import { TeamListService } from "../../../../shared/services/selection-widget/team-list/team-list.service";
import { UIConstants } from '../../../../shared/constants/ui-constants';
import { TranslateService } from '../../../../shared/services/translate/translate.service';
import { SettingsService } from '../../../../shared/services/settings/settings.service';
import { SodsListService } from '../../../../shared/services/sods/sods-list.service';
import { ResourceListService } from '../../../../shared/services/resource/resource-list/resource-list.service';
import { DirXmlDriversListService } from '../../../../shared/services/selection-widget/dirxml-drivers-list/dir-xml-drivers-list.service';

export enum Tabs {
  user, group, role, category, container, prd, driverOrEntitlement, dropdown, entitlementValues, resource, team, sod, dirxmldriver, entity, sodRecipient
}
export enum SelectionType {
  single, multi, dropdown
}

export enum ContainerType {
  role, user, resource
}

export enum CategoryType {
  role, resource
}

export enum PrdType {
  role, resource, sod, all
}

export enum TeamType {
  A, P, R, S, C
}

@Component({
  selector: 'idm-select-entities-widget',
  templateUrl: 'select-entities-widget.component.html',
  styleUrls: ['select-entities-widget.component.scss'],
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})

export class SelectEntitiesWidgetComponent implements OnInit {

  initSelectedItemsValue: any[] = [];
  excludeItemsValue: any[] = [];
  @Input("widgetId") widgetId: string;
  @Input("initWidgetConfig") initWidgetConfig: SelectionWidgetInitSchema;
  @Input("entityKey") entityKey: String;


  // Touched Status

  // Selected Items List Getter and Setter

  touchedValue: boolean = false;
  @Input("touched")
  public get touched() {
    return this.touchedValue;
  }
  public set touched(val) {
    this.touchedValue = val;
    // console.log("widget id : " + this.initWidgetConfig.widgetId + " and items : " + JSON.stringify(this.initSelectedItems));
    this.touchedChange.emit(this.touched);
    // this.selectedItemsChanged.emit(this.initSelectedItems);
  }

  @Input("clearSelection")
  public set clearSelection(val) {
    this.clearAllSelectedItems(true);
  }

  @Output("clearSelectionChange") clearSelectionChange = new EventEmitter<boolean>();

  @Output("touchedChange") touchedChange = new EventEmitter<boolean>();

  // focusedout

  focusedoutValue: boolean = false;
  @Input("focusedout")
  public get focusedout() {
    return this.focusedoutValue;
  }
  public set focusedout(val) {
    this.focusedoutValue = val;

    // console.log("widget id : " + this.initWidgetConfig.widgetId + " and items : " + JSON.stringify(this.initSelectedItems));
    this.focusedoutChange.emit(this.focusedout);
    // this.selectedItemsChanged.emit(this.initSelectedItems);
  }
  @Output("focusedoutChange") focusedoutChange = new EventEmitter<boolean>();

  // Selected Items List Getter and Setter

  @Input("initSelectedItems")
  public get initSelectedItems() {
    return this.initSelectedItemsValue;
  }
  public set initSelectedItems(val) {
    this.initSelectedItemsValue = val;

    // console.log("widget id : " + this.initWidgetConfig.widgetId + " and items : " + JSON.stringify(this.initSelectedItems));
    this.initSelectedItemsChange.emit(this.initSelectedItems);
    // this.selectedItemsChanged.emit(this.initSelectedItems);
  }
  @Output("initSelectedItemsChange") initSelectedItemsChange = new EventEmitter<any[]>();

  /**
   * To exclude any items from the resulted set
   */
  @Input("excludeItems")
  public get excludeItems() {
    return this.excludeItemsValue;
  }
  public set excludeItems(val) {
    this.excludeItemsValue = val;

    this.excludeItemsChange.emit(this.excludeItems);
  }
  @Output("excludeItemsChange") excludeItemsChange = new EventEmitter<any[]>();

  /* Custom event so that parent can subscribe to selected list changed event,
   * by using emitter service and passing widget id to it.
   * This is different from init initSelectedItemsChange as selectedItemsChanged will return only
   * functionality specific changes, whereas initSelectedItemsChange will return all changes to array.
  */
  @Output("selectedItemsChanged") selectedItemsChanged = new EventEmitter<any[]>();

  // Selected Role Level Getter and Setter - if set, shows selected role level container tree in container widget.

  selectedRoleLevelValue: any;
  @Input("selectedRoleLevel")
  public get selectedRoleLevel() {
    return this.selectedRoleLevelValue;
  }
  public set selectedRoleLevel(val) {
    this.selectedRoleLevelValue = val;
    if (this.widgetLoaded) {
      this.clearAllSelectedContainers(true);
    }
    this.selectedRoleLevelChange.emit(this.selectedRoleLevel);
  }
  @Output("selectedRoleLevelChange") selectedRoleLevelChange = new EventEmitter<any>();

  // For fetching roles based from multiple role levels. Added for map child / parent role section

  selectedRoleLevelListValue: any;
  @Input("selectedRoleLevelList")
  public get selectedRoleLevelList() {
    return this.selectedRoleLevelListValue;
  }
  public set selectedRoleLevelList(val) {
    this.selectedRoleLevelListValue = val;
    this.selectedRoleLevelListChange.emit(this.selectedRoleLevelList);
  }
  @Output("selectedRoleLevelListChange") selectedRoleLevelListChange = new EventEmitter<any>();


  // Selected Team Getter and Setter - if set, shows selected team.

  selectedTeamDNValue: string;
  @Input("selectedTeamDN")
  public get selectedTeamDN() {
    return this.selectedTeamDNValue;
  }
  public set selectedTeamDN(val) {
    this.selectedTeamDNValue = val;
    if (this.widgetLoaded) {
      this.clearAllSelectedContainers(true);
    }
    this.selectedTeamDNChange.emit(this.selectedTeamDN);
  }
  @Output("selectedTeamDNChange") selectedTeamDNChange = new EventEmitter<any>();

  // Dropdown List

  dropdownListValue: any[];
  @Input("dropDownList")
  public get dropDownList() {
    return this.dropdownListValue;
  }
  public set dropDownList(val) {
    this.dropdownListValue = val;
    // if (this.widgetLoaded) {
    //   this.clearAllSelectedItems(true);
    // }
    this.initDropDown();
    this.dropDownListChange.emit(this.dropDownList);
  }
  @Output("dropDownListChange") dropDownListChange = new EventEmitter<any>();

  // For Entitlement Values
  fromEntitlmentComponent: any;
  @Input("fromEntitlmentComp")
  public set fromEntitlmentComp(val) {
    this.fromEntitlmentComponent = val;
  }

  selectedEntitlementValue: any;
  @Input("selectedEntitlement")
  public get selectedEntitlement() {
    return this.selectedEntitlementValue;
  }
  public set selectedEntitlement(val) {
    this.selectedEntitlementValue = val;
    if (!this.fromEntitlmentComponent) {
      this.initSelectedItems = [];
    }
    this.selectedEntitlementChange.emit(this.selectedEntitlement);
  }
  @Output("selectedEntitlementChange") selectedEntitlementChange = new EventEmitter<any>();

  isDropDownTabItemSelected: boolean = false;

  // Resource type
  // Selected Resource type Getter and Setter

  resourceTypeSelected: boolean = false;
  @Input("resourceType")
  public get resourceType() {
    return this.resourceTypeSelected;
  }
  public set resourceType(val) {
    this.resourceTypeSelected = val;
    this.resourceTypeChange.emit(this.resourceType);
  }
  @Output("resourceTypeChange") resourceTypeChange = new EventEmitter<boolean>();

  // Selected Resource type Getter and Setter

  // For resources Values

  oldSelectedResourcesValues: any[] = [];
  @Input("oldSelectedResources")
  public get oldSelectedResources() {
    return this.oldSelectedResourcesValues;
  }
  public set oldSelectedResources(val) {
    this.oldSelectedResourcesValues = val;
    this.oldSelectedResourcesChange.emit(this.oldSelectedResources);
  }
  @Output("oldSelectedResourcesChange") oldSelectedResourcesChange = new EventEmitter<any>();

  // For resources Values

  // filter cprs supported driver/entitlement
  cprsSupport: boolean = false;
  @Input("cprsSupported")
  public get cprsSupported() {
    return this.cprsSupport;
  }
  public set cprsSupported(val) {
    this.cprsSupport = val;
    this.cprsSupportedChange.emit(this.cprsSupported);
  }
  @Output("cprsSupportedChange") cprsSupportedChange = new EventEmitter<any>();

  isDisabledWidget: boolean = false;
  @Input("disableWidget")
  public get disableWidget() {
    return this.isDisabledWidget;
  }
  public set disableWidget(val) {
    this.isDisabledWidget = val;
  }

  isReadOnly: boolean = false;
  @Input("readOnly")
  public get readOnly() {
    return this.isReadOnly;
  }
  public set readOnly(val) {
    this.isReadOnly = val;
  }

  hideSelectionIfDropDownTabActive: boolean = true;
  @Input("hideSelectionIfDropDownTab")
  public get hideSelectionIfDropDownTab() {
    return this.hideSelectionIfDropDownTabActive;
  }
  public set hideSelectionIfDropDownTab(val) {
    if (!this.vutils.isUndefinedOrNull(val)) {
      this.hideSelectionIfDropDownTabActive = val;
    }
  }
  // Selected Users list type Getter and Setter

  // Used For ng2-dragula

  @ViewChild('selectedTags') selectedTags: ElementRef;
  @ViewChild('selectedTagsContainer') selectedTagsContainer: ElementRef;

  query: string;
  teamType: string;
  resultsLoading: boolean = false;
  showDropDown: boolean = false;
  showTabBar: boolean;
  showDragNote: boolean = true;


  showDropDownToggle: boolean = true;
  errorMessage: string;
  selectText: string;
  onClickCloseWorkAround: boolean = false;
  widgetLoaded: boolean = false;
  queryChangedSubject: Subject<string> = new Subject<string>();
  focusInputGroup: boolean = false;
  singleTabWithoutSearchBar: boolean = false;
  private userSearchAttributes: string = "";
  entityDisplayAttributes = [];

  private selectAllDriversObject = {
    "id": "ALL DRIVERS",
    "displayName": this.translate.get("All Drivers"),
    "name": this.translate.get("All drivers"),
    "type": "driverOrEntitlement",
    "subType": "driver"
  }
  selectAllDriverOptionSelected: boolean = false;

  drake: any;

  config: SelectionTabConfigSchema = {
    activeTab: Tabs.user,
    paginationSize: 5,
    selectionType: SelectionType.single,
    draggable: true,
    clearSelectionVisible: true,
    tabs: [
      {
        tabId: Tabs.user,
        tabLabel: this.translate.get("Users"),
        searchPlaceHolder: this.translate.get("Search in users"),
        showTab: true,
        errorMessage: this.translate.get("Failed to fetch users list.")
      },
      {
        tabId: Tabs.group,
        tabLabel: this.translate.get("Groups"),
        searchPlaceHolder: this.translate.get("Search in groups"),
        showTab: true,
        errorMessage: this.translate.get("Failed to fetch groups list.")
      },
      {
        tabId: Tabs.role,
        tabLabel: this.translate.get("Roles"),
        searchPlaceHolder: this.translate.get("Search in roles"),
        showTab: true,
        errorMessage: this.translate.get("Failed to fetch roles list."),
        needColumnLevel: false
      },
      {
        tabId: Tabs.category,
        tabLabel: this.translate.get("Categories"),
        categoryType: CategoryType.role,
        searchPlaceHolder: this.translate.get("Search in categories"),
        showTab: true,
        errorMessage: this.translate.get("Failed to fetch categories list.")
      },
      {
        tabId: Tabs.container,
        tabLabel: this.translate.get("Containers"),
        containerType: ContainerType.role,
        containerRootSelectable: true,
        showTab: true,
        errorMessage: this.translate.get("Failed to fetch containers."),
      },
      {
        tabId: Tabs.prd,
        tabLabel: this.translate.get("Custom Approval"),
        searchPlaceHolder: this.translate.get("Search in Custom Approvals"),
        prdType: PrdType.role,
        showTab: true,
        errorMessage: this.translate.get("Failed to fetch custom approvals."),
      },
      {
        tabId: Tabs.driverOrEntitlement,
        tabLabel: this.translate.get("Driver/Entitlement"),
        showTab: true,
        errorMessage: this.translate.get("Failed to fetch entitlements or driver."),
        selectAllOption: false,
        autoSelectFirst: false,
        driverSelectionDisabled: false
      },
      {
        tabId: Tabs.dropdown,
        showTab: true,
        defaultLabel: this.translate.get("Select from dropdown"),
        autoSelectFirst: false
      },
      {
        tabId: Tabs.entitlementValues,
        tabLabel: this.translate.get("Entitlement Values"),
        searchPlaceHolder: this.translate.get("Search in Entitlement Values"),
        showTab: true,
        errorMessage: this.translate.get("Failed to fetch entitlement values.")
      },
      {
        tabId: Tabs.resource,
        tabLabel: this.translate.get("Resources"),
        searchPlaceHolder: this.translate.get('Search in resources'),
        showTab: true,
        errorMessage: this.translate.get("Failed to fetch resources list.")
      },
      {
        tabId: Tabs.team,
        tabLabel: this.translate.get("Teams"),
        teamType: TeamType.P,
        searchPlaceHolder: this.translate.get("Search in teams"),
        showTab: true,
        errorMessage: this.translate.get("Failed to fetch teams list.")
      },
      {
        tabId: Tabs.sod,
        tabLabel: this.translate.get("SoDs"),
        searchPlaceHolder: this.translate.get("Search in SoDs"),
        showTab: true,
        errorMessage: this.translate.get("Failed to fetch SoDs list.")
      },
      {
        tabId: Tabs.dirxmldriver,
        tabLabel: this.translate.get("Drivers"),
        searchPlaceHolder: this.translate.get("Search in Drivers"),
        showTab: true,
        errorMessage: this.translate.get("Failed to fetch Drivers list.")
      }, {
        tabId: Tabs.entity,
        tabLabel: this.translate.get("Entity"),
        searchPlaceHolder: this.translate.get("Search in entity"),
        showTab: true,
        errorMessage: this.translate.get("Failed to fetch entity list")
      },
      {
        tabId: Tabs.sodRecipient,
        tabLabel: this.translate.get("Recipients"),
        searchPlaceHolder: this.translate.get("Search in Recipients"),
        showTab: true,
        errorMessage: this.translate.get("Failed to fetch entity list")
      }

    ]
  };

  constructor(
    private _eref: ElementRef,
    private vutils: VariableService,
    private lutils: ListService,
    private usersListService: UsersListService,
    private groupsListService: GroupsListService,
    private rolesListService: RolesPermListService,
    private roleCategoriesService: RoleCategoriesService,
    private teamListService: TeamListService,
    private resourceCategoriesService: ResourceCategoriesService,
    private roleLevelsService: RoleLevelService,
    private catalogContainersService: CatalogContainersService,
    private prdsListService: PrdsListService,
    private driversService: DriversService,
    private dragulaService: DragulaService,
    private emitterService: EmitterService,
    private cprsResourcesService: CprsResourcesService,
    private translate: TranslateService,
    private SettingsService: SettingsService,
    private sodListService: SodsListService,
    private resourceListService: ResourceListService,
    private dirXmlDriversListService: DirXmlDriversListService,
    private entityService: EntityService
  ) {

    this.queryChangedSubject.asObservable().pipe(
      debounceTime(1000))
      .subscribe(query => {
        this.query = query;
        if (!this.vutils.isEmptyString(this.query)) {
          this.fetchActiveTabData(true);
          this.showDropDown = true;
        }
      });
    this.dragulaService.dropModel.subscribe((value) => {
      this.onDrop(value[0]);
    });
    this.SettingsService.getSettingsByKey('customization', 'searchLookup').subscribe(res => {
      let userSearchAttributes: string = "";
      let searchList = [];
      let userSearchAttributeList = [];
      if (!this.vutils.isUndefinedOrNull(res) && !this.vutils.isEmptyArray(res.value)) {
        for (let i = 0; i < res.value.length; i++) {
          searchList.push(res.value[i].displayLabel);
          userSearchAttributeList.push(res.value[i].key);
        }
      }
      this.userSearchAttributes = userSearchAttributeList.join();
      userSearchAttributes = searchList.join(", ");
      if (!this.vutils.isEmptyString(userSearchAttributes)) {
        this.config.tabs[Tabs.user].searchPlaceHolder += " " + this.translate.get("by") + " " + userSearchAttributes;
      }
    });
  }

  ngOnInit() {
    this.initWidget();

    if ((this.config.activeTab == Tabs.resource)) {
      this.resetCommonVariables();
      this.fetchOldResourcesTabData();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedEntitlement']) {
      if (!this.vutils.isUndefinedOrNull(this.selectedEntitlement.viewID) && this.cprsSupport) {
        this.oldSelectedResources.length = 0;
        this.fetchOldResourcesTabData();
      }
    }
  }

  ngAfterViewInit() {
    this.updateHtmlId();
    this.initAutoScrollOnDrag();
  }

  updateHtmlId() {
    if (!this.vutils.isUndefinedOrNull(this.selectedTagsContainer)) {
      this.selectedTagsContainer.nativeElement.id = (this.initWidgetConfig.widgetId) + '_selectedTagsContainer';
    }
  }

  initAutoScrollOnDrag() {
    this.drake = this.dragulaService.find(this.initWidgetConfig.widgetId);
    var drake = this.drake;
    // console.log("bag:" + JSON.stringify(drake));
    var scroll = autoScroll([
      window,
      this.selectedTagsContainer.nativeElement,
    ], {
      margin: 20,
      autoScroll: function () {
        // console.log(drake.dragging);
        return this.down && drake.dragging;
      }
    });
  }

  disableDrag() {
    if (!!this.dragulaService.find(this.initWidgetConfig.widgetId)) {
      this.dragulaService.destroy(this.initWidgetConfig.widgetId);
    }
    this.dragulaService.setOptions(this.initWidgetConfig.widgetId, {
      moves: (el, source, handle, sibling) => !el.classList.contains('no-drag')
    });
  }

  queryChanged(query) {
    this.queryChangedSubject.next(query);
  }

  initWidget() {

    this.selectedItemsChanged = this.emitterService.get(this.initWidgetConfig.widgetId || this.widgetId);

    // Set currentPageIndex of each tab to 0.

    for (let i = 0; i < Object.keys(Tabs).length / 2; ++i) {
      this.config.tabs[i].currentPageIndex = 0;
    }

    // Override default configuration by supplied configuration.

    this.applyInputConfiguration();

  }

  isDragEnabled(): boolean {
    return this.config.draggable;
  }

  applyInputConfiguration() {

    if (!this.vutils.isUndefinedOrNull(this.initWidgetConfig.activeTab)) {
      this.config.activeTab = this.initWidgetConfig.activeTab;
    }

    if (!this.vutils.isUndefinedOrNull(this.initWidgetConfig.selectionType)) {
      this.config.selectionType = this.initWidgetConfig.selectionType;
      if (this.vutils.equals(this.config.selectionType, SelectionType.single)) {
        this.showDragNote = false;
      }
    }

    if (!this.vutils.isUndefinedOrNull(this.initWidgetConfig.clearSelectionVisible)) {
      this.config.clearSelectionVisible = this.initWidgetConfig.clearSelectionVisible;
    } else {
      if (this.initWidgetConfig.selectionType == SelectionType.single) {
        this.config.clearSelectionVisible = false;
      }
    }

    if (!this.vutils.isUndefinedOrNull(this.initWidgetConfig.container)) {
      this.config.tabs[Tabs.container].containerRootSelectable = this.initWidgetConfig.container.containerRootSelectable;
    }

    if (!this.vutils.isUndefinedOrNull(this.initWidgetConfig) && !this.vutils.isUndefinedOrNull(this.initWidgetConfig.container)) {
      this.config.tabs[Tabs.container].containerType = this.initWidgetConfig.container.containerType;
    }

    if (!this.vutils.isUndefinedOrNull(this.initWidgetConfig) && !this.vutils.isUndefinedOrNull(this.initWidgetConfig.driverOrEntitlement) && this.initWidgetConfig.driverOrEntitlement.driverSelectionDisabled) {
      this.config.tabs[Tabs.driverOrEntitlement].driverSelectionDisabled = this.initWidgetConfig.driverOrEntitlement.driverSelectionDisabled;
      this.config.tabs[Tabs.driverOrEntitlement].tabLabel = this.translate.get('Entitlement');
    }

    if (!this.vutils.isUndefinedOrNull(this.initWidgetConfig) && !this.vutils.isUndefinedOrNull(this.initWidgetConfig.category)) {
      this.config.tabs[Tabs.category].categoryType = this.initWidgetConfig.category.categoryType;
    }

    if (!this.vutils.isUndefinedOrNull(this.initWidgetConfig) && !this.vutils.isUndefinedOrNull(this.initWidgetConfig.role)) {
      this.config.tabs[Tabs.role].needColumnLevel = this.initWidgetConfig.role.needColumnLevel;
    }

    if (!this.vutils.isUndefinedOrNull(this.initWidgetConfig) && !this.vutils.isUndefinedOrNull(this.initWidgetConfig.prd)) {
      this.config.tabs[Tabs.prd].prdType = this.initWidgetConfig.prd.prdType;
    }

    if (!this.vutils.isUndefinedOrNull(this.initWidgetConfig) && !this.vutils.isUndefinedOrNull(this.initWidgetConfig.driverOrEntitlement)) {
      this.config.tabs[Tabs.driverOrEntitlement].selectAllOption = this.initWidgetConfig.driverOrEntitlement.selectAllOption;
      this.config.tabs[Tabs.driverOrEntitlement].autoSelectFirst = this.initWidgetConfig.driverOrEntitlement.autoSelectFirst;
      if (this.config.tabs[Tabs.driverOrEntitlement].autoSelectFirst) {
        if (this.vutils.isUndefinedOrNull(this.initSelectedItems)) {
          this.initSelectedItems = [];
        }
        if (this.config.tabs[Tabs.driverOrEntitlement].selectAllOption) {
          this.initSelectedItems.push(this.selectAllDriversObject);
          this.selectAllDriverOptionSelected = true;
          this.informSelectedItemsChanged();
        } else {
          if (!this.vutils.isEmptyArray(this.config.tabs[Tabs.driverOrEntitlement].itemsList)) {
            this.initSelectedItems.push(this.config.tabs[Tabs.driverOrEntitlement].itemsList[0])
            this.informSelectedItemsChanged();
          }
        }
      }
    }

    if (!this.vutils.isUndefinedOrNull(this.initWidgetConfig) && !this.vutils.isUndefinedOrNull(this.initWidgetConfig.entity)) {
      this.config.tabs[Tabs.entity].tabLabel = this.initWidgetConfig.entity.lookupEntity;

      //lookup attributes will always be present when used in entities page.
      if (this.initWidgetConfig.entity.lookupAttributes.length > 0) {
        let displayLabels = "";
        this.initWidgetConfig.entity.lookupAttributes.forEach((element, index) => {
          displayLabels += element.displayLabel;
          if (index < this.initWidgetConfig.entity.lookupAttributes.length - 1) {
            displayLabels += ", "
          }
        });
        this.config.tabs[Tabs.entity].searchPlaceHolder = this.translate.get("Search in ") + this.initWidgetConfig.entity.lookupEntity + " " + this.translate.get("by") + " " + displayLabels;
        if (!this.vutils.isEmptyArray(this.initWidgetConfig.entity.displayAttributes)) {
          this.entityDisplayAttributes = this.initWidgetConfig.entity.displayAttributes;
        } else {
          this.entityDisplayAttributes = this.initWidgetConfig.entity.lookupAttributes;
        }
      } else {
        this.config.tabs[Tabs.entity].searchPlaceHolder = this.translate.get("Search in ") + this.initWidgetConfig.entity.lookupEntity;
        if (!this.vutils.isEmptyArray(this.initWidgetConfig.entity.displayAttributes)) {
          this.entityDisplayAttributes = this.initWidgetConfig.entity.displayAttributes;
        }
      }
    }

    let selectedTabsLabelsArray: string[] = [];
    for (let i = 0; i < Object.keys(Tabs).length / 2; ++i) {
      if (!this.vutils.isUndefinedOrNull(this.initWidgetConfig[Tabs[i]])) {
        this.config.tabs[i].selectionType = this.vutils.isUndefinedOrNull(this.initWidgetConfig[Tabs[i]].selectionType) ? SelectionType.multi : this.initWidgetConfig[Tabs[i]].selectionType;
        selectedTabsLabelsArray.push(this.config.tabs[i].tabLabel);
      } else {
        this.config.tabs[i].showTab = false;
      }
    }

    if (selectedTabsLabelsArray.length > 1) {
      this.selectText = this.translate.get("Select ");
      this.showTabBar = true;
      for (let i = 0; i < selectedTabsLabelsArray.length; ++i) {
        if (i != selectedTabsLabelsArray.length - 1) {
          this.selectText += selectedTabsLabelsArray[i];
          if (i != selectedTabsLabelsArray.length - 2) {
            this.selectText += ", ";
          }
        } else {
          this.selectText += this.translate.get(" or ") + selectedTabsLabelsArray[i];
        }
      }
    } else {
      this.showTabBar = false;
      // If only driver or only container tab should be shown, then it doesn't have search bar so dropdown toggle should be visible in that case.
      // For other cases when only one tab is shown, we hide dropdown toggle and instead show search bar directly.

      if (this.isUnsearchableTab()) {
        this.showDropDownToggle = true;
        this.singleTabWithoutSearchBar = true;
      } else {
        this.showDropDownToggle = false;
        this.singleTabWithoutSearchBar = false;
      }

      if (this.isActiveTab(Tabs.dropdown)) {
        if (!this.vutils.isUndefinedOrNull(this.initWidgetConfig) && !this.vutils.isUndefinedOrNull(this.initWidgetConfig.dropdown) && !this.vutils.isUndefinedOrNull(this.initWidgetConfig.dropdown.defaultLabel)) {
          this.config.tabs[Tabs.dropdown].defaultLabel = this.initWidgetConfig.dropdown.defaultLabel;

        } if (!this.vutils.isUndefinedOrNull(this.initWidgetConfig) && !this.vutils.isUndefinedOrNull(this.initWidgetConfig.dropdown) && !this.vutils.isUndefinedOrNull(this.initWidgetConfig.dropdown.tabLabel)) {
          this.config.tabs[Tabs.dropdown].tabLabel = this.initWidgetConfig.dropdown.tabLabel;

        }
        if (!this.vutils.isUndefinedOrNull(this.initWidgetConfig) && !this.vutils.isUndefinedOrNull(this.initWidgetConfig.dropdown) && !this.vutils.isUndefinedOrNull(this.initWidgetConfig.dropdown.autoSelectFirst)) {
          this.config.tabs[Tabs.dropdown].autoSelectFirst = this.initWidgetConfig.dropdown.autoSelectFirst;
        }
        this.initDropDown();
      } else {
        this.selectText = this.translate.get("Select ");
        this.selectText += this.config.tabs[this.config.activeTab].tabLabel;
      }

    }

    if (!this.initWidgetConfig.draggable) {
      this.config.draggable = false;
      this.disableDrag();
    }

  }

  fetchActiveTabData(hasQueryChanged?: boolean) {
    if (!this.vutils.isUndefinedOrNull(hasQueryChanged) && hasQueryChanged) {
      this.resetPaginationForAllTabs();
    }
    this.resetCommonVariables();
    switch (this.config.activeTab) {
      case Tabs.user: this.fetchUsersTabData();
        break;
      case Tabs.group: this.fetchGroupsTabData();
        break;
      case Tabs.role: this.fetchRolesTabData();
        break;
      case Tabs.resource: this.fetchResourcesTabData();
        break;
      case Tabs.category: this.fetchCategoriesTabData();
        break;
      case Tabs.team: this.fetchTeamsTabData();
        break;
      case Tabs.container: this.fetchContainersTabData();
        break;
      case Tabs.prd: this.fetchPrdsTabData();
        break;
      case Tabs.driverOrEntitlement: this.fetchDriversTabData();
        break;
      case Tabs.dropdown: this.fetchDropDownData();
        break;
      case Tabs.entitlementValues: this.fetchEntitlementValuesTabData();
        break;
      case Tabs.sod: this.fetchSoDsTabData();
        break;
      case Tabs.dirxmldriver: this.fetchDirXmlDriverTabData();
        break;
      case Tabs.entity: this.fetchEntityData();
        break;
      case Tabs.sodRecipient: this.fetchRecipientData();
        break;
      default: this.fetchUsersTabData();
    }
  }

  fetchUsersTabData() {
    let nextIndex = this.config.paginationSize * this.config.tabs[Tabs.user].currentPageIndex + 1;
    if (null != this.selectedTeamDNValue && this.selectedTeamDNValue != undefined && this.selectedTeamDNValue != "") {
      this.teamListService.getTeamMembersList(this.query, nextIndex, this.config.paginationSize, this.selectedTeamDNValue)
        .subscribe(arg => {
          this.config.tabs[Tabs.user].itemsList = arg.recipients;
          this.config.tabs[Tabs.user].nextIndex = arg.nextIndex;
          this.updateCommonVariablesOnSuccess();
        }, error => {
          this.resultsLoading = false;
          this.errorMessage = this.config.tabs[Tabs.user].errorMessage;
        });
    } else {
      this.usersListService.getUsersList(this.query, nextIndex, this.config.paginationSize, this.userSearchAttributes)
        .subscribe(arg => {
          this.config.tabs[Tabs.user].itemsList = arg.usersList;
          this.config.tabs[Tabs.user].nextIndex = arg.nextIndex;
          this.updateCommonVariablesOnSuccess();
        }, error => {
          this.resultsLoading = false;
          this.errorMessage = this.config.tabs[Tabs.user].errorMessage;
        });
    }
  }

  fetchGroupsTabData() {
    let nextIndex = this.config.paginationSize * this.config.tabs[Tabs.group].currentPageIndex + 1;
    this.groupsListService.getGroupsList(this.query, nextIndex, this.config.paginationSize)
      .subscribe(arg => {
        this.config.tabs[Tabs.group].itemsList = arg.groups;
        this.config.tabs[Tabs.group].nextIndex = arg.nextIndex;
        this.updateCommonVariablesOnSuccess();
      }, error => {
        this.resultsLoading = false;
        this.errorMessage = this.config.tabs[Tabs.group].errorMessage;
      });
  }

  fetchRolesTabData() {
    let nextIndex = this.config.paginationSize * this.config.tabs[Tabs.role].currentPageIndex + 1;
    let level: any = null;
    let needColumnLevel: boolean = false;
    let roleLevelList: any = null;
    if (this.config.tabs[Tabs.role].needColumnLevel == true) {
      needColumnLevel = this.config.tabs[Tabs.role].needColumnLevel;
    }

    if (this.vutils.isDefinedPositiveNumber(this.selectedRoleLevelValue)) {
      level = this.selectedRoleLevelValue;
    }

    if (!this.vutils.isEmptyArray(this.selectedRoleLevelListValue)) {
      roleLevelList = this.selectedRoleLevelListValue;
    }

    this.rolesListService.getRolesListWithLevel(this.query, nextIndex, this.config.paginationSize, level, needColumnLevel, roleLevelList)
      .subscribe(arg => {
        this.config.tabs[Tabs.role].itemsList = arg.roles;
        this.config.tabs[Tabs.role].nextIndex = arg.nextIndex;
        this.updateCommonVariablesOnSuccess();
      }, error => {
        this.resultsLoading = false;
        this.errorMessage = this.config.tabs[Tabs.role].errorMessage;
      });
  }

  fetchResourcesTabData() {
    let nextIndex = this.config.paginationSize * this.config.tabs[Tabs.resource].currentPageIndex + 1;
    if (!this.vutils.isUndefinedOrNull(this.selectedEntitlement)) {
      let res = new Resource();
      res.id = this.getDriverId(this.selectedEntitlement.id);
      this.cprsResourcesService.getDriverResourceList(res, this.query, nextIndex, this.config.paginationSize, this.resourceType, this.selectedEntitlement.id, this.selectedEntitlement.viewID)
        .subscribe(arg => {
          this.config.tabs[Tabs.resource].itemsList = arg.resources;
          this.config.tabs[Tabs.resource].nextIndex = arg.nextIndex;
          this.updateCommonVariablesOnSuccess();
        }, error => {
          this.resultsLoading = false;
          this.errorMessage = this.config.tabs[Tabs.resource].errorMessage;
        });
    } else {
      let res = new Resource();
      this.resourceListService.getPermResources()
        .subscribe(arg => {
          this.config.tabs[Tabs.resource].itemsList = arg.resources;
          this.config.tabs[Tabs.resource].nextIndex = arg.nextIndex;
          this.updateCommonVariablesOnSuccess();
        }, error => {
          this.resultsLoading = false;
          this.errorMessage = this.config.tabs[Tabs.resource].errorMessage;
        });
    }
  }

  fetchOldResourcesTabData() {
    let nextIndex = this.config.paginationSize * this.config.tabs[Tabs.resource].currentPageIndex + 1;
    if (!this.vutils.isUndefinedOrNull(this.selectedEntitlement)) {
      let res = new Resource();
      res.id = this.getDriverId(this.selectedEntitlement.id);
      this.cprsResourcesService.getDriverResourceList(res, this.query, nextIndex, this.config.paginationSize, this.resourceType, this.selectedEntitlement.id, this.selectedEntitlement.viewID, true)
        .subscribe(arg => {
          if (!this.vutils.isUndefinedOrNull(arg) && !this.vutils.isUndefinedOrNull(arg.resources)) {
            for (let i = 0; i < arg.resources.length; ++i) {
              if ((arg.resources[i].managedBy) % 2 == 1) {
                this.oldSelectedResources.push(arg.resources[i]);
                if (!this.isSelectedItem(arg.resources[i])) {
                  this.selectListItem(arg.resources[i]);
                }
              }
            }
          }
        }, error => {
          this.resultsLoading = false;
          this.errorMessage = this.config.tabs[Tabs.resource].errorMessage;
        });
      this.updateCommonVariablesOnSuccess();
    }
  }

  fetchCategoriesTabData() {
    let nextIndex = this.config.paginationSize * this.config.tabs[Tabs.category].currentPageIndex + 1;
    if (this.config.tabs[Tabs.category].categoryType === CategoryType.role) {
      this.roleCategoriesService.getRoleCategoriesList(this.query, nextIndex, this.config.paginationSize)
        .subscribe(arg => {
          this.config.tabs[Tabs.category].itemsList = arg.categories;
          this.config.tabs[Tabs.category].nextIndex = arg.nextIndex;
          this.updateCommonVariablesOnSuccess();
        }, error => {
          this.resultsLoading = false;
          this.errorMessage = this.config.tabs[Tabs.category].errorMessage;
        });
    } else {
      this.resourceCategoriesService.getResourceCategoriesList(this.query, nextIndex, this.config.paginationSize)
        .subscribe(arg => {
          this.config.tabs[Tabs.category].itemsList = arg.categories;
          this.config.tabs[Tabs.category].nextIndex = arg.nextIndex;
          this.updateCommonVariablesOnSuccess();
        }, error => {
          this.resultsLoading = false;
          this.errorMessage = this.config.tabs[Tabs.category].errorMessage;
        });
    }

  }


  fetchTeamsTabData() {
    let nextIndex = this.config.paginationSize * this.config.tabs[Tabs.team].currentPageIndex + 1;
    if (this.config.tabs[Tabs.team].teamType === TeamType.P) {
      this.teamListService.getTeamList(this.query, nextIndex, this.config.paginationSize, "P")
        .subscribe(arg => {
          this.config.tabs[Tabs.team].itemsList = arg.teams;
          this.config.tabs[Tabs.team].nextIndex = arg.nextIndex;
          this.updateCommonVariablesOnSuccess();
        }, error => {
          this.resultsLoading = false;
          this.errorMessage = this.config.tabs[Tabs.team].errorMessage;
        });

    } else {
      this.teamListService.getTeamList(this.query, nextIndex, this.config.paginationSize, this.teamType)
        .subscribe(arg => {
          this.config.tabs[Tabs.team].itemsList = arg.teams;
          this.config.tabs[Tabs.team].nextIndex = arg.nextIndex;
          this.updateCommonVariablesOnSuccess();
        }, error => {
          this.resultsLoading = false;
          this.errorMessage = this.config.tabs[Tabs.team].errorMessage;
        });
    }
  }

  fetchContainersTabData() {
    if (this.config.tabs[Tabs.container].containerType === ContainerType.user) {
      this.catalogContainersService.getSubContainersList({})
        .subscribe(arg => {
          if (!this.vutils.isUndefinedOrNull(arg)) {
            arg.type = "container";
          }
          this.config.tabs[Tabs.container].itemsList = [arg];
          this.updateCommonVariablesOnSuccess();
        }, error => {
          this.resultsLoading = false;
          this.errorMessage = this.config.tabs[Tabs.container].errorMessage;
        });
    } else if (this.config.tabs[Tabs.container].containerType === ContainerType.resource) {
      this.catalogContainersService.getSubContainersList({ "id": "", "type": "resource" })
        .subscribe(arg => {
          if (!this.vutils.isUndefinedOrNull(arg)) {
            arg.type = "container";
          }
          this.config.tabs[Tabs.container].itemsList = [arg];
          this.updateCommonVariablesOnSuccess();
        }, error => {
          this.resultsLoading = false;
          this.errorMessage = this.config.tabs[Tabs.container].errorMessage;
        });
    } else {
      this.config.tabs[Tabs.container].itemsList = [];
      this.roleLevelsService.getRoleLevels().subscribe((data) => {
        if (!this.vutils.isUndefinedOrNull(data)) {
          for (let i = 0; i < data.roleLevels.length; ++i) {
            data.roleLevels[i].type = "container";
          }
          this.config.tabs[Tabs.container].itemsList = data.roleLevels;
        }
        this.updateCommonVariablesOnSuccess();
      });
    }
  }

  fetchPrdsTabData() {
    let nextIndex = this.config.paginationSize * this.config.tabs[Tabs.prd].currentPageIndex + 1;
    let processType = null;
    if (this.config.tabs[Tabs.prd].prdType === PrdType.role) {
      processType = "Role Approval";

    } else if (this.config.tabs[Tabs.prd].prdType === PrdType.sod) {
      processType = "Sod Approval";

    } else if (this.config.tabs[Tabs.prd].prdType === PrdType.resource) {
      processType = "Resource Approval";
    } else {
      processType = "";
    }
    this.prdsListService.getPrdsList(this.query, nextIndex, this.config.paginationSize, processType)
      .subscribe(arg => {
        this.config.tabs[Tabs.prd].itemsList = arg.requestDefs;
        this.config.tabs[Tabs.prd].nextIndex = arg.nextIndex;
        this.updateCommonVariablesOnSuccess();
      }, error => {
        this.resultsLoading = false;
        this.errorMessage = this.config.tabs[Tabs.prd].errorMessage;
      });
  }

  fetchDriversTabData() {
    this.driversService.getDriversList(this.cprsSupport)
      .subscribe(arg => {
        if (!this.vutils.isUndefinedOrNull(arg.drivers)) {
          this.config.tabs[Tabs.driverOrEntitlement].itemsList = arg.drivers;
          if (this.config.tabs[Tabs.driverOrEntitlement].selectAllOption) {
            if (this.vutils.isUndefinedOrNull(this.config.tabs[Tabs.driverOrEntitlement].itemsList)) {
              this.config.tabs[Tabs.driverOrEntitlement].itemsList = [];
            }
            this.config.tabs[Tabs.driverOrEntitlement].itemsList.unshift(this.selectAllDriversObject);
          }
          // console.log("List : " + JSON.stringify(arg.drivers[0]))
        } else {
          this.config.tabs[Tabs.driverOrEntitlement].itemsList = [];
        }
        if (this.config.tabs[Tabs.driverOrEntitlement].autoSelectFirst && !this.selectAllDriverOptionSelected) {
          if (this.vutils.isUndefinedOrNull(this.initSelectedItems)) {
            this.initSelectedItems = [];
          }
          if (!this.vutils.isEmptyArray(this.config.tabs[Tabs.driverOrEntitlement].itemsList)) {
            this.initSelectedItems.push(this.config.tabs[Tabs.driverOrEntitlement].itemsList[0])
            this.informSelectedItemsChanged();
          }

        }
        this.updateCommonVariablesOnSuccess();
      }, error => {
        this.resultsLoading = false;
        this.errorMessage = this.config.tabs[Tabs.driverOrEntitlement].errorMessage;
      });
  }

  fetchDropDownData() {
    this.config.tabs[Tabs.dropdown].itemsList = this.dropDownList;
    this.updateCommonVariablesOnSuccess();
  }

  initDropDown() {
    if (this.config.tabs[Tabs.dropdown].autoSelectFirst) {
      this.initSelectedItems = [];
      this.config.tabs[Tabs.dropdown].itemsList = this.dropDownList;
      if (!this.vutils.isEmptyArray(this.config.tabs[Tabs.dropdown].itemsList)) {
        this.initSelectedItems.push(this.config.tabs[Tabs.dropdown].itemsList[0])
        this.informSelectedItemsChanged();
      }
    }
    if (!this.vutils.isUndefinedOrNull(this.initSelectedItems) && !this.vutils.isUndefinedOrNull(this.initSelectedItems[0]) && this.hideSelectionIfDropDownTabActive) {
      this.selectText = this.initSelectedItems[0].displayName || this.initSelectedItems[0].name;
      this.isDropDownTabItemSelected = true;
    } else {
      this.selectText = this.config.tabs[Tabs.dropdown].defaultLabel;
      this.isDropDownTabItemSelected = false;
    }
  }

  fetchEntitlementValuesTabData() {
    let nextIndex = this.config.paginationSize * this.config.tabs[Tabs.entitlementValues].currentPageIndex + 1;
    if (!this.vutils.isUndefinedOrNull(this.selectedEntitlement) && this.selectedEntitlement.hasLogicalSystem == true) {
      this.driversService.getEntitlementValuesWithLogicalID(this.query, nextIndex, this.config.paginationSize, this.selectedEntitlement)
        .subscribe(arg => {
          this.config.tabs[Tabs.entitlementValues].itemsList = arg.entitlementValues;
          this.config.tabs[Tabs.entitlementValues].nextIndex = arg.nextIndex;
          this.updateCommonVariablesOnSuccess();
        }, error => {
          this.resultsLoading = false;
          this.errorMessage = this.config.tabs[Tabs.entitlementValues].errorMessage;
        });
    } else {
      this.driversService.getEntitlementValuesWithoutLogicalID(this.query, nextIndex, this.config.paginationSize, this.selectedEntitlement)
        .subscribe(arg => {
          this.config.tabs[Tabs.entitlementValues].itemsList = arg.entitlementValues;
          this.config.tabs[Tabs.entitlementValues].nextIndex = arg.nextIndex;
          this.updateCommonVariablesOnSuccess();
        }, error => {
          this.resultsLoading = false;
          this.errorMessage = this.config.tabs[Tabs.entitlementValues].errorMessage;
        });
    }
  }

  fetchSoDsTabData() {
    let nextIndex = this.config.paginationSize * this.config.tabs[Tabs.sod].currentPageIndex + 1;
    this.sodListService.getSodsListNormal(this.query, nextIndex, this.config.paginationSize)
      .subscribe(arg => {
        this.config.tabs[Tabs.sod].itemsList = arg.sods;
        this.config.tabs[Tabs.sod].nextIndex = arg.nextIndex;
        this.updateCommonVariablesOnSuccess();
      }, error => {
        this.resultsLoading = false;
        this.errorMessage = this.config.tabs[Tabs.sod].errorMessage;
      });
  }

  fetchDirXmlDriverTabData() {
    let nextIndex = this.config.paginationSize * this.config.tabs[Tabs.dirxmldriver].currentPageIndex + 1;
    this.dirXmlDriversListService.getDirXmlDriversList(this.query, nextIndex, this.config.paginationSize)
      .subscribe(arg => {
        this.config.tabs[Tabs.dirxmldriver].itemsList = arg.drivers;
        this.config.tabs[Tabs.dirxmldriver].nextIndex = arg.nextIndex;
        this.updateCommonVariablesOnSuccess();
      }, error => {
        this.resultsLoading = false;
        this.errorMessage = this.config.tabs[Tabs.dirxmldriver].errorMessage;
      });
  }

  fetchEntityData() {
    let nextIndex = this.config.paginationSize * this.config.tabs[Tabs.entity].currentPageIndex + 1;
    let lookupAttributes = [];
    let displayAttributes = [];
    this.initWidgetConfig.entity.lookupAttributes.forEach((element) => {
      lookupAttributes.push(element.key);
    });
    if (this.vutils.isUndefinedOrNull(this.initWidgetConfig.entity.isOrgchart)) {
      this.initWidgetConfig.entity.isOrgchart = false;
    }
    this.entityDisplayAttributes.forEach((element) => {
      displayAttributes.push(element.key);
    });

    this.entityService.getEntitiesListForSelectEntitiesWidget(this.query, nextIndex, this.config.paginationSize, this.initWidgetConfig.entity.lookupEntity, lookupAttributes, this.initWidgetConfig.entity.isOrgchart, displayAttributes)
      .subscribe((arg) => {
        this.config.tabs[Tabs.entity].itemsList = arg.entityList;
        this.config.tabs[Tabs.entity].nextIndex = arg.nextIndex;
        this.updateCommonVariablesOnSuccess();
      }, (error) => {
        this.resultsLoading = false;
        this.errorMessage = this.config.tabs[Tabs.entity].errorMessage;
      });
  }

  fetchRecipientData() {
    let nextIndex = this.config.paginationSize * this.config.tabs[Tabs.sodRecipient].currentPageIndex + 1;
    let sodRecipientList = [];
    if (this.query === '*') {
      sodRecipientList = this.initWidgetConfig.sodRecipient.sodRecipientData;
    } else {
      sodRecipientList = Object.assign([], this.initWidgetConfig.sodRecipient.sodRecipientData).filter(
        item => item.recipientname.toLowerCase().indexOf(this.query.toLowerCase()) > -1)
    }
    let length = sodRecipientList.length;
    if (length <= this.config.paginationSize || (nextIndex != 1 && (nextIndex + this.config.paginationSize) > length)) {
      this.config.tabs[Tabs.sodRecipient].itemsList = sodRecipientList.slice(nextIndex - 1, length);
      this.config.tabs[Tabs.sodRecipient].nextIndex = -1;
    } else {
      this.config.tabs[Tabs.sodRecipient].itemsList = sodRecipientList.slice(nextIndex - 1, (nextIndex * this.config.paginationSize));
      this.config.tabs[Tabs.sodRecipient].nextIndex = nextIndex + this.config.paginationSize;
    }
    this.updateCommonVariablesOnSuccess();
  }

  resetCommonVariables() {
    this.resultsLoading = true;
    this.errorMessage = "";
  }

  resetPaginationForAllTabs() {
    for (let i = 0; i < Object.keys(Tabs).length / 2; ++i) {
      this.config.tabs[i].currentPageIndex = 0;
      this.config.tabs[i].nextIndex = 1;

    }
  }

  updateCommonVariablesOnSuccess() {
    this.resultsLoading = false;
    this.errorMessage = "";
  }

  selectTab(activeTabId) {
    if (!this.isActiveTab(activeTabId)) {
      this.config.activeTab = activeTabId;
      if (this.isUnsearchableTab()) {
        this.fetchActiveTabData();
      } else {
        this.clearQuery();
      }
    } else {
      if (!this.widgetLoaded) {
        if (this.isUnsearchableTab()) {
          this.fetchActiveTabData();
        }
        this.widgetLoaded = true;
      }
    }
  }

  isActiveTab(activeTabId) {
    // console.log("ACtive Tab : "+this.config.activeTab)
    return this.vutils.equals(this.config.activeTab, activeTabId);
  }

  showSearchElements() {
    return !(this.isUnsearchableTab());
  }

  toggleDropdown() {
    if (this.showDropDown) {
      if (this.touched) {
        this.focusedout = true;
      }
      this.clearQuery();
    } else {
      this.touched = true;
      this.selectTab(this.config.activeTab);
    }
    this.showDropDown = !this.showDropDown;
  }

  isDropdownVisible() {
    return this.showDropDown;
  }

  isClearSelectionVisible() {
    return this.config.clearSelectionVisible;
  }

  isUnsearchableTab() {
    return this.isActiveTab(Tabs.container) || this.isActiveTab(Tabs.driverOrEntitlement) || this.isActiveTab(Tabs.dropdown);
  }
  isItemListVisible() {
    if (this.isUnsearchableTab()) {
      return true;
    }
    return !this.isQueryEmpty();
  }

  isItemsListEmpty() {
    return this.lutils.isListEmpty(this.config.tabs[this.config.activeTab].itemsList);
  }

  isItemsListTooLong() {
    return this.lutils.exceedsLength(this.config.tabs[this.config.activeTab].itemsList, 300);
  }

  isQueryEmpty() {
    return this.vutils.isEmptyString(this.query);
  }

  showPagination() {
    return !this.resultsLoading && !this.isItemsListTooLong() && !this.isItemsListEmpty();
  }

  isNextPageAvailable() {
    if (this.isActiveTab(Tabs.container)) {
      return false;
    }
    return this.showPagination() && this.vutils.isDefinedPositiveNumber(this.config.tabs[this.config.activeTab].nextIndex) && this.config.tabs[this.config.activeTab].nextIndex > 0;
  }

  isPreviousPageAvailable() {
    if (this.isActiveTab(Tabs.container)) {
      return false;
    }
    return this.showPagination() && this.vutils.isDefinedPositiveNumber(this.config.tabs[this.config.activeTab].currentPageIndex) && this.config.tabs[this.config.activeTab].currentPageIndex > 0;
  }

  showError() {
    return !this.vutils.isEmptyString(this.errorMessage);
  }

  onDocumentClick(event) {
    if (this.onClickCloseWorkAround) {
      this.onClickCloseWorkAround = false;
    } else if (!this._eref.nativeElement.contains(event.target)) {
      this.hideDropDown();
    }
  }

  hideDropDown() {
    this.showDropDown = false;
    if (this.touched) {
      this.focusedout = true;
    }
    this.clearQuery();
  }

  clearQuery() {
    this.query = "";
  }

  getSearchPlaceHolder() {
    return this.config.tabs[this.config.activeTab].searchPlaceHolder;
  }

  nextPage() {
    if (this.vutils.isDefinedPositiveNumber(this.config.tabs[this.config.activeTab].nextIndex)) {
      this.config.tabs[this.config.activeTab].currentPageIndex++;
      this.config.tabs[this.config.activeTab].nextIndex = this.config.paginationSize * this.config.tabs[this.config.activeTab].currentPageIndex + 1;
      this.fetchActiveTabData();
    }
  }

  prevPage() {
    if (this.vutils.isDefinedPositiveNumber(this.config.tabs[this.config.activeTab].currentPageIndex) && this.config.tabs[this.config.activeTab].currentPageIndex > 0) {
      this.config.tabs[this.config.activeTab].currentPageIndex--;
      this.config.tabs[this.config.activeTab].nextIndex = this.config.paginationSize * this.config.tabs[this.config.activeTab].currentPageIndex + 1;
      this.fetchActiveTabData();
    }
  }

  selectListItem(item: any) {
    if (this.config.selectionType == SelectionType.multi) {
      if (this.config.tabs[this.config.activeTab].selectionType == SelectionType.single) {
        let itemsToRemove: any[] = [];
        for (let i = 0; i < this.initSelectedItems.length; ++i) {
          if (this.vutils.equals(Tabs[this.initSelectedItems[i].type], Tabs[item.type])) {
            itemsToRemove.push(this.initSelectedItems[i]);
          }
        }
        for (let i = itemsToRemove.length - 1; i >= 0; --i) {
          this.removeSelectedItem(itemsToRemove[i], false);
        }
      }
    } else {
      this.clearAllSelectedItems(false);
    }
    if (this.config.selectionType == SelectionType.dropdown) {
      this.selectText = item.displayName || item.name;
      this.isDropDownTabItemSelected = true;
    }

    if (this.config.activeTab == 13) {
      item.entityDisplayValue = item.entityDisplayValue || this.vutils.getCnFromDn(item.dn);
      item.type = 'entity';
    }
    if (this.vutils.isEmptyArray(this.initSelectedItems)) {
      this.initSelectedItems = [];
    }
    this.initSelectedItems.push(item);
    this.informSelectedItemsChanged()
  }

  removeSelectedItem(item: any, fireSelectedItemsChantedEvent: boolean) {
    let key1 = item.dn || item.id || item.level || item.displayName || item.recipientdn;
    if (this.isActiveTab(Tabs.entitlementValues)) {
      key1 = item.value;
    }
    for (let i = 0; i < this.initSelectedItems.length; ++i) {
      let key2 = this.initSelectedItems[i].dn || this.initSelectedItems[i].id || this.initSelectedItems[i].level || this.initSelectedItems[i].displayName || this.initSelectedItems[i].recipientdn;
      if (this.isActiveTab(Tabs.entitlementValues)) {
        key2 = this.initSelectedItems[i].value;
      }
      if (this.vutils.equals(key1, key2)) {
        this.initSelectedItems.splice(i, 1);
        break;
      }
    }
    if (this.vutils.isEmptyArray(this.initSelectedItems) && this.vutils.equals(Tabs.dropdown, this.config.activeTab)) {
      this.selectText = this.config.tabs[Tabs.dropdown].defaultLabel;
      this.isDropDownTabItemSelected = false;
    }
    if (fireSelectedItemsChantedEvent) {
      this.informSelectedItemsChanged();
    }
    this.onClickCloseWorkAround = true;
  }

  getAllSelectedItemsList() {
    return this.initSelectedItems;
  }

  clearAllSelectedItems(fireSelectedItemsChantedEvent: boolean) {
    if (!this.vutils.isEmptyArray(this.initSelectedItems)) {
      this.initSelectedItems = [];
      if (this.vutils.isEmptyArray(this.initSelectedItems) && this.vutils.equals(Tabs.dropdown, this.config.activeTab)) {
        this.selectText = this.config.tabs[Tabs.dropdown].defaultLabel;
        this.isDropDownTabItemSelected = false;
      }
      if (fireSelectedItemsChantedEvent) {
        this.informSelectedItemsChanged();
      }
      this.onClickCloseWorkAround = true;
    }
    this.clearSelectionChange.emit(false);
  }

  clearAllSelectedContainers(fireSelectedItemsChantedEvent: boolean) {
    if (!this.vutils.isEmptyArray(this.initSelectedItems)) {
      for (let i = 0; i < this.initSelectedItems.length; ++i) {
        if (this.initSelectedItems[i].type == "container") {
          this.removeSelectedItem(this.initSelectedItems[i], false)
        }
      }
      if (fireSelectedItemsChantedEvent) {
        this.informSelectedItemsChanged();
      }
    }
  }

  getActiveTabLabel() {
    return this.config.tabs[this.config.activeTab].tabLabel;
  }

  isSelectedItem(item) {
    if (!this.vutils.isUndefinedOrNull(this.initSelectedItems)) {
      for (let i = 0; i < this.initSelectedItems.length; ++i) {
        let key1 = item.id || item.dn || item.displayName || item.level || item.recipientdn;
        if (this.isActiveTab(Tabs.entitlementValues)) {
          key1 = item.value;
          // console.log(item.value);
        }
        // if (item.value != undefined && JSON.parse(item.value).ID != undefined) {
        //   key1 = JSON.parse(item.value).ID;
        //   console.log(key1);
        // }
        let key2 = this.initSelectedItems[i].id || this.initSelectedItems[i].dn || this.initSelectedItems[i].displayName || this.initSelectedItems[i].level || this.initSelectedItems[i].recipientdn;
        if (this.isActiveTab(Tabs.entitlementValues)) {
          key2 = this.initSelectedItems[i].value;
        }
        if (this.vutils.equals(key1, key2)) {
          return true;
        }
      }
    }
    return false;
  }

  isExcludedItem(item) {
    if (!this.vutils.isUndefinedOrNull(this.excludeItems)) {
      for (let i = 0; i < this.excludeItems.length; ++i) {
        let key1 = item.id || item.dn || item.displayName || item.level;
        if (this.isActiveTab(Tabs.entitlementValues)) {
          key1 = item.value;
          // console.log(item.value);
        }
        // if (item.value != undefined && JSON.parse(item.value).ID != undefined) {
        //   key1 = JSON.parse(item.value).ID;
        //   console.log(key1);
        // }
        let key2 = this.excludeItems[i].id || this.excludeItems[i].dn || this.excludeItems[i].displayName || this.excludeItems[i].level;
        if (this.isActiveTab(Tabs.entitlementValues)) {
          key2 = this.excludeItems[i].value;
        }
        if (this.vutils.equals(key1, key2)) {
          return true;
        }
      }
    }
    return false;
  }

  isNotClickable(item) {
    return (this.isSelectedItem(item) || this.isExcludedItem(item));
  }

  isSelectedItems() {
    return !this.vutils.isEmptyArray(this.initSelectedItems);
  }

  selectContainer(item) {
    let itemsToRemove: any[] = [];
    if (!this.vutils.isEmptyArray(this.initSelectedItems)) {
      for (let i = 0; i < this.initSelectedItems.length; ++i) {
        if (this.vutils.equals(Tabs[this.initSelectedItems[i].type], Tabs.container)) {
          itemsToRemove.push(this.initSelectedItems[i]);
        }
      }
    }
    for (let i = itemsToRemove.length - 1; i >= 0; --i) {
      this.removeSelectedItem(itemsToRemove[i], false);
    }
    if (this.vutils.isEmptyArray(this.initSelectedItems)) {
      this.initSelectedItems = [];
    }
    this.initSelectedItems.push(item);
    this.informSelectedItemsChanged()
  }

  selectDriver(item) {
    let itemsToRemove: any[] = [];
    if (!this.vutils.isEmptyArray(this.initSelectedItems)) {
      for (let i = 0; i < this.initSelectedItems.length; ++i) {
        if (this.vutils.equals(Tabs[this.initSelectedItems[i].type], Tabs.driverOrEntitlement)) {
          itemsToRemove.push(this.initSelectedItems[i]);
        }
      }
    }
    for (let i = itemsToRemove.length - 1; i >= 0; --i) {
      this.removeSelectedItem(itemsToRemove[i], false);
    }
    if (this.vutils.isEmptyArray(this.initSelectedItems)) {
      this.initSelectedItems = [];
    }
    this.initSelectedItems.push(item);
    this.informSelectedItemsChanged()
  }

  isContainerSelected(container) {
    if (container.level) {
      if (!this.vutils.isEmptyArray(this.initSelectedItems)) {
        for (let i = 0; i < this.initSelectedItems.length; ++i) {
          if (this.vutils.equals(this.initSelectedItems[i].level, container.level)) {
            return true;
          }
        }
      }
    }
    else {
      if (!this.vutils.isEmptyArray(this.initSelectedItems)) {
        for (let i = 0; i < this.initSelectedItems.length; ++i) {
          if (this.vutils.equals(this.initSelectedItems[i].id, container.id)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  isDriverSelected(driver) {
    if (!this.vutils.isEmptyArray(this.initSelectedItems)) {
      for (let i = 0; i < this.initSelectedItems.length; ++i) {
        if (this.vutils.equals(this.initSelectedItems[i].id, driver.id)) {
          return true;
        }
      }
    }
    return false;
  }

  selectContainerItem(item) {
    if (this.config.selectionType == SelectionType.single) {
      this.clearAllSelectedItems(false);
    } else if (this.config.tabs[Tabs.container].selectionType == SelectionType.single) {
      let itemsToRemove: any[] = [];
      if (!this.vutils.isEmptyArray(this.initSelectedItems)) {
        for (let i = 0; i < this.initSelectedItems.length; ++i) {
          if (this.vutils.equals(Tabs[this.initSelectedItems[i].type], Tabs[item.type])) {
            itemsToRemove.push(this.initSelectedItems[i]);
          }
        }
      }
      for (let i = itemsToRemove.length - 1; i >= 0; --i) {
        this.removeSelectedItem(itemsToRemove[i], false);
      }
    } else {
      let itemsToRemove: any[] = [];
      if (!this.vutils.isEmptyArray(this.initSelectedItems)) {
        for (let i = 0; i < this.initSelectedItems.length; ++i) {
          if (this.vutils.equals(Tabs[this.initSelectedItems[i].type], Tabs.container)) {
            if (this.isContainedByContainer(this.initSelectedItems[i], item) || this.isContainedByContainer(item, this.initSelectedItems[i])) {
              itemsToRemove.push(this.initSelectedItems[i]);
            }
          }
        }
      }
      for (let i = itemsToRemove.length - 1; i >= 0; --i) {
        this.removeSelectedItem(itemsToRemove[i], false);
      }
    }
    if (this.vutils.isEmptyArray(this.initSelectedItems)) {
      this.initSelectedItems = [];
    }
    this.initSelectedItems.push(item);
    this.informSelectedItemsChanged()
  }

  selectDriverOrEntitlementItem(item) {
    if (this.config.selectionType == SelectionType.single) {
      this.clearAllSelectedItems(false);
    } else if (this.config.tabs[Tabs.driverOrEntitlement].selectionType == SelectionType.single) {
      let itemsToRemove: any[] = [];
      if (!this.vutils.isEmptyArray(this.initSelectedItems)) {
        for (let i = 0; i < this.initSelectedItems.length; ++i) {
          if (this.vutils.equals(Tabs[this.initSelectedItems[i].type], Tabs[item.type])) {
            itemsToRemove.push(this.initSelectedItems[i]);
          }
        }
      }
      for (let i = itemsToRemove.length - 1; i >= 0; --i) {
        this.removeSelectedItem(itemsToRemove[i], false);
      }
    } else {
      let itemsToRemove: any[] = [];
      if (!this.vutils.isEmptyArray(this.initSelectedItems)) {
        for (let i = 0; i < this.initSelectedItems.length; ++i) {
          if (this.vutils.equals(Tabs[this.initSelectedItems[i].type], Tabs.driverOrEntitlement)) {
            if (this.isContainedByDriver(this.initSelectedItems[i], item) || this.isContainedByDriver(item, this.initSelectedItems[i])) {
              itemsToRemove.push(this.initSelectedItems[i]);
            }
          }
        }
      }
      for (let i = itemsToRemove.length - 1; i >= 0; --i) {
        this.removeSelectedItem(itemsToRemove[i], false);
      }
    }
    if (this.vutils.isEmptyArray(this.initSelectedItems)) {
      this.initSelectedItems = [];
    }
    this.initSelectedItems.push(item);
    this.informSelectedItemsChanged()
  }

  isContainedByContainer(container1, container2) {
    if (this.vutils.equals(container1.id, container2.id)) {
      return true;
    } else {
      let isContained: boolean = false;
      if (!this.vutils.isUndefinedOrNull(container1.subContainers)) {
        for (let i = 0; i < container1.subContainers.length; ++i) {
          isContained = isContained || this.isContainedByContainer(container1.subContainers[i], container2);
          if (isContained) {
            return true;
          }
        }
      }
      return isContained;
    }
  }

  isContainedByDriver(driver, entitlement) {
    if (this.vutils.equals(driver.id, entitlement.id)) {
      return true;
    } else {
      let isContained: boolean = false;
      if (!this.vutils.isUndefinedOrNull(driver.entitlements)) {
        for (let i = 0; i < driver.entitlements.length; ++i) {
          isContained = isContained || this.isContainedByDriver(driver.entitlements[i], entitlement);
          if (isContained) {
            return true;
          }
        }
      }
      return isContained;
    }
  }

  private onDrop = (bagName) => {
    if (this.vutils.equals(this.initWidgetConfig.widgetId, bagName)) {
      this.informSelectedItemsChanged()
    }
  };

  private getAppFormatSelectedList() {
    return this.getAllSelectedItemsList();
  }
  private informSelectedItemsChanged() {
    this.touched = true;
    this.focusedout = true;
    this.selectedItemsChanged.emit(this.initSelectedItems);
  }

  isDragNoteEnabled() {
    return this.isDragEnabled() && this.showDragNote && !this.vutils.isEmptyArray(this.getAllSelectedItemsList());
  }

  setDropDownVisible() {
    this.showDropDown = true;
    this.touched = true;
  }

  onFocusInput() {
    this.focusInputGroup = true;
  }

  onBlurInput() {
    this.focusInputGroup = false;
  }

  showRoleLevel(roleLevel) {

    // check if selected role level is valid

    let roleLevelIsValid = false;
    if (
      !this.vutils.isUndefinedOrNull(this.selectedRoleLevelValue) &&
      (
        this.vutils.equals(this.selectedRoleLevelValue, 10) ||
        this.vutils.equals(this.selectedRoleLevelValue, 20) ||
        this.vutils.equals(this.selectedRoleLevelValue, 30)
      )
    ) {
      roleLevelIsValid = true;
    }
    if (roleLevelIsValid) {

      // If selected role Level is Valid then only show selected role level.

      if (this.vutils.equals(roleLevel.level, this.selectedRoleLevelValue)) {

        return true;
      }
      else {
        return false;
      }
    }

    // show all container trees by default

    return true;
  }

  private getDriverId(entitlementId: string) {
    let index = entitlementId.indexOf(',');
    return entitlementId.substr(index + 1);
  }

  resetFocus(id) {
    document.getElementById(id).focus();
  }
}
