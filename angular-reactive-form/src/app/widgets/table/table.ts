import { Component, Input, EventEmitter, Output } from '@angular/core';
import { TableConfigObject } from "../../shared/schemas/table-config-schema";
import { ColumnCustomizationSchema, TableRowSchema } from "../../shared/schemas/table-row-schema";
import { EmitterService } from "../../shared/services/emitter/emitter.service";
import { TableRows, EmitSelectedRows,EmitClickedElement} from "../../shared/schemas/table-rows";
import { AppLoadingService } from "../../shared/services/loading/app-loading.service";
import { VariableService } from "../../shared/services/utilities/util_variable/variable.service";
import {TableWidthConstants} from "../../shared/constants/table-width-constants";

@Component({
  selector: 'idm-table',
  templateUrl: './table.html',
  styles: ['./table.css']
})
export class Table{
  check: boolean;
  errorMessage: string;
  TaskList: TableRowSchema;
  _tableConfigObject:TableConfigObject;

  showCheckboxes: boolean = true;
  @Input("checkbox")
  public get checkbox() {
    return this.showCheckboxes;
  }
  public set checkbox(val) {
    this.showCheckboxes = val;
    this.checkboxChange.emit(this.checkbox);
  }
  @Output("checkboxChange") checkboxChange = new EventEmitter<boolean>();

  @Input("tableConfigObject")
  set tableConfigObject (val:TableConfigObject){
    this._tableConfigObject=val;
    this.calColumnWidth();
  }
  @Input("tableName") tableName: string;
  @Output() tableConfigObjectChange = new EventEmitter<TableConfigObject>();
  @Output() onRowSelection? = new EventEmitter();
  @Output() onActionButtonClick? = new EventEmitter();
  @Output() ColumnCustomizationHandler? = new EventEmitter();
  @Output() sortBy? = new EventEmitter();
  @Output() elementClicked? = new EventEmitter();
  ColumnCustomization:ColumnCustomizationSchema;
  isTableLoading=true;
  selectedRows : Array<TableRows> =[];
  checkboxes :Array<boolean> =[];
  selectedRowEmitter;
  elementClickedEmitter;
  showButtons:boolean;
  selectedRowCount : number;
  selectAllCheck:boolean;
  emitSelectedRows:EmitSelectedRows;
  emitClickedElement: EmitClickedElement;
  sortDataEmitter: any;
  tableColumnCustomization: any;
  totalWidth:number;

  constructor(
    public  EmitterService:EmitterService,
    private appLoadingService: AppLoadingService,
    private vutils:VariableService,
    public TableWidthConstants:TableWidthConstants
  )
  {
      this.eventCreateor();
      this.emitSelectedRows = new EmitSelectedRows();
      this.emitClickedElement = new EmitClickedElement();
  }

  ngOnInit() {

  }

  eventCreateor(){
    this.selectedRowEmitter = this.EmitterService.get("SelectedRows");
    this.elementClickedEmitter = this.EmitterService.get("elementClicked");
    this.sortDataEmitter=this.EmitterService.get("sortBy");
    this.tableColumnCustomization=this.EmitterService.get("tableColumnCustomization");

  }

  isRowsLoading(){
    return this.appLoadingService.TableDataLoading;
  }

  actionButtonClickHandler(event, type) {
    // Multiselect click handler
    this.emitSelectedRows.selectedRows = this.selectedRows;
    this.emitSelectedRows.actionName = type;
    if(this.onActionButtonClick.observers.length>0){
      this.onActionButtonClick.emit(this.emitSelectedRows);
    }
    else {
      this.selectedRowEmitter.emit(this.emitSelectedRows);
    }
    // _tableConfigObject?.columnCustomData?.columns?.length
    //console.log();
  }

  elementClickHandler(row, header) {
    this.emitClickedElement.selectedRows = row;
    this.emitClickedElement.actionName = header;
    if(this.elementClicked.observers.length>0){
      this.elementClicked.emit(this.emitClickedElement);
    }
    else {
      this.elementClickedEmitter.emit(this.emitClickedElement);
    }
 //   this.elementClickedEmitter.emit(this.emitClickedElement);
  }

  IndexOf(superset: TableRows[], subset: TableRows): number {
    for (let i = 0; i < superset.length; i++) {
      if (superset[i].rowId == subset.rowId) {
        return i;
      }
    }

  }

  selectAllRows(isChecked) {
    let totalRows = this._tableConfigObject.tableData.rows.length;
    let indeOfElementw = 0;
    if (isChecked) {
      for (let index = 0; index < totalRows; index++) {
        if (!this.isSelected(this._tableConfigObject.tableData.rows[index])) {
          this.selectedRows.push(this._tableConfigObject.tableData.rows[index]);
        }
      }
    }
    else {
      for (let index = 0; index < totalRows; index++) {
        if (this.isSelected(this._tableConfigObject.tableData.rows[index])) {
          indeOfElementw = this.IndexOf(this.selectedRows, this._tableConfigObject.tableData.rows[index]);
          this.selectedRows.splice(indeOfElementw, 1);
        }
      }

    }
    this.selectedRowCount = this.selectedRows.length;
    this.onRowSelection.emit(this.selectedRows);
  }

  selectRows($event, rows) {
    //this.checkboxes[$event.target.getAttribute('value')]=;
    let indeOfElement = 0;
    if ($event.target.checked) {
      this.selectedRows.push(rows);
    }
    else {
      for (let i = 0; i < this.selectedRows.length; ++i) {
        if (this.selectedRows[i].rowId == rows.rowId) {
          indeOfElement = i;
        }
      }
      this.selectedRows.splice(indeOfElement, 1);
    }
    this.selectedRowCount = this.selectedRows.length;
    this.onRowSelection.emit(this.selectedRows);
  }

  /**
   * taskId has to be changed to row id & which will be send by the api & will be common for all the
   * api which will use the table component (or can be filtered while passing to tthe table )
   * from the parent component
   *
   * @param {any} row
   * @returns {boolean}
   *
   * @memberof Table
   */

  isSelected(row): boolean {
    for (let index = 0; index < this.selectedRows.length; index++) {
      if (this.selectedRows[index].rowId == row.rowId) {
        return true;
      }
    }
    return false;
  }

  showButton() {
    if (this.selectedRows.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  painationEvent ($event: TableConfigObject) {
    this._tableConfigObject = $event;
    this.tableConfigObjectChange.emit(this._tableConfigObject);
  }

  showPagination () {
    return this._tableConfigObject != undefined && this._tableConfigObject.tableData != undefined
      && this._tableConfigObject.tableData.rows != undefined && this._tableConfigObject.tableData.rows.length != 0 && this._tableConfigObject.tableData.disablePagination != true;
  }

  showPaginationLoader () {
    return this._tableConfigObject != undefined && this._tableConfigObject.tableData != undefined;
  }

  isAllSelected(): boolean {
    let count = 0;
    if (this._tableConfigObject.tableData) {
      for (let rows of this._tableConfigObject.tableData.rows) {
        for (let selectedIndex of this.selectedRows) {
          //if (selectedIndex.rowId == rows.rowId) {
          if (selectedIndex.rowId == rows.rowId) {
            count++;
          }

        }
      }
      if (count == this._tableConfigObject.tableData.rows.length) {
        return true;
      } else {
        return false;
      }
    }

  }

  /**
   *
   *Stablesorting logic can go here
   * @param {any} sortBY
   *
   * @memberOf Table
   */
  sortBY(sortBY) {
    if ( this.sortBy.observers.length <=0){
      this.sortDataEmitter.emit(sortBY);
    }

      this.sortBy.emit(sortBY);

    }

  isSortable(header){
    for (let object of this._tableConfigObject.columnCustomData.columns) {
      if (object.hasOwnProperty('isSortable')) {
        if(header==object.column)
          {
            return object.isSortable;
          }

      }
    }
   // this._tableConfigObject.columnCustomData.columns
  }

  columnCustomization(){
    if(this.ColumnCustomizationHandler.observers.length>0){
      this.ColumnCustomizationHandler.emit();
    }
    else{
      this.tableColumnCustomization.emit();
    }

  }

  calColumnWidth(){
  this.totalWidth=0;
    for (let columns of this._tableConfigObject.columnCustomData.columns ){
        this.totalWidth+=TableWidthConstants.getWidth(columns.column);
    }
  }
  getWidth(column){

  let width:any;
  width =(100/this.totalWidth)*(TableWidthConstants.getWidth(column));
  width+='%';
   return  width;
  }

}


