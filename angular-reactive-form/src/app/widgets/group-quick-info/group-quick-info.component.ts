import { Component, OnInit, Input } from '@angular/core';
import { VariableService } from "../../shared/services/utilities/util_variable/variable.service";
import { Router } from '@angular/router';
import { TableConfigObject } from '../../shared/schemas/table-config-schema';
import { GroupsService } from '../../shared/services/groups/groups.service';
import { TableRowSchema, ColumnCustomizationSchema } from '../../shared/schemas/table-row-schema';
import { TranslateService } from '../../shared/services/translate/translate.service';
import { GlobalService } from '../../shared/services/global/global.service';
import { AppLoadingService } from '../../shared/services/loading/app-loading.service';
declare let $: any;

@Component({
  selector: 'idm-group-quick-info',
  templateUrl: './group-quick-info.component.html',
  styleUrls: ['./group-quick-info.component.css']
})
export class GroupQuickInfoComponent implements OnInit {
  quickInfo: any;
  _groupDN: any;
  @Input('id') widgetID: string;
  @Input('groupDN')
  set roleDN(val) {
    if (!this.vutils.isUndefinedOrNull(val)) {
      this._groupDN = val;
      this.refresh();
      $('#groupQuickInfo_' + this.widgetID).modal('show');
    }

  }

  pageLoading: boolean;
  tableConfigObject: TableConfigObject;
  _tableConfigObject: TableConfigObject;
  searchQuery: string;
  disableColumnCustomization: boolean;
  filters: any[];
  filterOptions: any[];
  currentFilter: string;
  selectedTableRows: any;
  
  constructor(
    private vutils: VariableService, 
    private groupsService: GroupsService, 
    private route: Router, 
    private translate: TranslateService, 
    private globalService: GlobalService,
    private appLoadingService: AppLoadingService
  ) { 

    this.tableConfigObject = new TableConfigObject();
    this.tableConfigObject.tableData = new TableRowSchema();
    this.tableConfigObject.columnCustomData = new ColumnCustomizationSchema;
    this.filters = [];
  }

  ngOnInit() {
    this.setTableValues();
    this.setGroupMembersTable();
  }

  /** Group Memners Listing */
  setTableValues() {
    this.tableConfigObject.tableData.nextIndex = 1;
    this.tableConfigObject.tableData.currentPage = 0;
    this.tableConfigObject.tableData.showingStart = this.tableConfigObject.tableData.nextIndex;
  }

  setGroupMembersTable() {
    this.tableConfigObject.columnCustomData.columns = [
      { column: "name", isclickable: false, isSortable: true, displayLabel: this.translate.get("Name") }
    ];
    this.tableConfigObject.columnCustomData.enableCustomization = false;
    this.tableConfigObject.tableData.pageSize = this.globalService.defaultRowsPerPage;
    this.tableConfigObject.tableData.sortBy = 'name';
    this.tableConfigObject.tableData.sortOrder = 'asc';
    this.tableConfigObject.tableData.roleLevel = '';
    this.tableConfigObject.tableData.categoryKeys = '';
    this.tableConfigObject.tableData.query = '';
    this.tableConfigObject.tableData.setPageSize = false;
  }

  //set Table data Filter
  dataFilter() {
    this.pageLoading = true;
    this.getGroupMembers();
  }

  resetTableconfigSearch() {
    this.tableConfigObject.tableData.sortBy = 'name';
    this.tableConfigObject.tableData.sortOrder = 'asc';
    this.tableConfigObject.tableData.setPageSize = false;
    this.tableConfigObject.tableData.nextIndex = 1;
    this.tableConfigObject.tableData.currentPage = 0;
    this.tableConfigObject.tableData.showingStart = 1;
  }

  // get table rows
  getGroupMembers() {
    let tempCategories = "";
    let tempOwners = "";
    this.appLoadingService.TableDataLoading = true;
    this.preProcess(this.tableConfigObject);
    this.filters = [];
    let groupDn = {};
    if (this._groupDN) {
      groupDn = { "dn": this._groupDN };
    }
    this.groupsService.getGroupMembers(this.tableConfigObject, this.filters, groupDn).subscribe(
      data => {
        this.filterTableData(data);
      },
      error => {
      //  this.errorMessage = <any>error
      }
    );
  }

  preProcess(tableConfigObject: TableConfigObject) {
    this._tableConfigObject = tableConfigObject;
  }

  filterTableData(responceData: any) {
    this.tableConfigObject = new TableConfigObject();
    this.tableConfigObject.tableData = responceData;
    this.tableConfigObject.tableData.rows = responceData.recipients;
    this.tableConfigObject.tableData.totalSize = responceData.total;
    this.tableConfigObject.tableData.total = responceData.arraySize;
    for (let key in this.tableConfigObject.tableData.rows) {
      if (this.tableConfigObject.tableData.rows.hasOwnProperty(key)) {
        //to maintain unique id
        this.tableConfigObject.tableData.rows[key].rowId = key;
      }
    }
    this.intercept();
    this.pageLoading = false;
    this.appLoadingService.TableDataLoading = false;
  }

  intercept() {
    this.tableConfigObject.tableData.currentPage = this._tableConfigObject.tableData.currentPage;
    this.tableConfigObject.tableData.showingStart = this._tableConfigObject.tableData.showingStart;
    this.tableConfigObject.columnCustomData = this._tableConfigObject.columnCustomData;
    this.tableConfigObject.tableData.sortBy = this._tableConfigObject.tableData.sortBy;
    this.tableConfigObject.tableData.sortOrder = this._tableConfigObject.tableData.sortOrder;
    this.tableConfigObject.tableData.query = this._tableConfigObject.tableData.query;
  }

  paginationEvent($event: TableConfigObject) {
    this.tableConfigObject = $event;
    this.getGroupMembers();
  }

  refresh() {
    this.pageLoading = true;
    this.setGroupMembersTable();
    this.setTableValues();
    this.dataFilter();
  }

  elementClicked(res) {
    
  }

  //sotring data haldler
  sortTableData(sortBy) {
    if (this.tableConfigObject.tableData.sortBy == sortBy) {

      if (this.tableConfigObject.tableData.sortOrder == 'asc') {
        this.tableConfigObject.tableData.sortOrder = 'desc';
      }
      else {
        this.tableConfigObject.tableData.sortOrder = 'asc';
      }
    }
    this.tableConfigObject.tableData.sortBy = sortBy;
    this.setTableValues();
    this.getGroupMembers();
  }

  close() {
    $('#groupQuickInfo_' + this.widgetID).modal('hide');
  }


}
