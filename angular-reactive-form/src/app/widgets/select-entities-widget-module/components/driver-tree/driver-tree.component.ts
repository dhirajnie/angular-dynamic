import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VariableService } from "../../../../shared/services/utilities/util_variable/variable.service";
import { Tabs } from "../../components/select-entities-widget/select-entities-widget.component";
import { DriversService } from "../../../../shared/services/selection-widget/driver/drivers.service";
import { TranslateService } from '../../../../shared/services/translate/translate.service';

@Component({
  selector: 'idm-driver-tree',
  templateUrl: 'driver-tree.component.html',
  styleUrls: ['driver-tree.component.css']
})
export class DriverTreeComponent implements OnInit {

  @Input("driver") driver;
  @Input("selectedItems") selectedItems;
  @Output("addItem") addItem: EventEmitter<any[]> = new EventEmitter();
  @Input("isRoot") isRoot;
  @Input("isCprsSupported") isCprsSupported;
  @Input("driverSelectionDisabled") driverSelectionDisabled;
  expanded: boolean = false;
  fetchedEntitlements: boolean = false;
  constructor(private vutils: VariableService, private driversService: DriversService,private translate:TranslateService) { }
  loadingEntitlements: boolean = false;
  errorMessage: string;
  error: boolean = false;

  ngOnInit() {
    // console.log("driver : "+(this.driver.name || this.driver.displayName));
  }

  onAddItem(item) {
    this.addItem.emit(item);
  }

  isInSelectedDriver(item) {
    if (this.vutils.isUndefinedOrNull(this.selectedItems)) {
      return false;
    }
    for (let i = 0; i < this.selectedItems.length; ++i) {
      if (this.vutils.equals(Tabs[this.selectedItems[i].type], Tabs.driverOrEntitlement)) {
        if (this.vutils.equals(this.selectedItems[i].id, item.id)) {
          return true;
        }
      }
    }
    return false;
  }

  isSelectAll(driver) {
    return !this.vutils.isUndefinedOrNull(driver) && !this.vutils.isEmptyString(driver.id) && driver.id == "ALL DRIVERS";
  }

  toggleDriver() {
    if (this.expanded) {
      this.expanded = false;
    } else {
      if (this.fetchedEntitlements) {
        this.expanded = true;
      } else {
        this.loadingEntitlements = true;
        this.expanded = true;
        this.driversService.getEntitlementsList(this.driver, this.isCprsSupported)
          .subscribe(arg => {
            this.driver.entitlements = arg.entitlements;
            if(!this.vutils.isEmptyArray(this.driver.entitlements)) {
              for(let i=0 ;i<this.driver.entitlements.length;++i) {
                this.driver.entitlements[i].parent = this.driver;
              }
            }
            this.loadingEntitlements = false;
            this.fetchedEntitlements = true;
          }, error => {
            this.loadingEntitlements = false;
            this.errorMessage = this.translate.get("Failed to load entitlements for this driver.");
            this.error = true;
          });
      }
    }
  }

  isExpanded() {
    return this.expanded;
  }
}

