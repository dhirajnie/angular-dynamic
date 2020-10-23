import { Component, Input, Output, EventEmitter} from '@angular/core';
import { TableConfigObject } from 'src/app/shared/schemas/table-config-schema';
import { EmitterService } from 'src/app/shared/services/emitter/emitter.service';
import { AppLoadingService } from 'src/app/shared/services/loading/app-loading.service';
import { GlobalService } from 'src/app/shared/services/global/global.service';

@Component({
  selector: 'idm-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
    
  _tableConfigObject : TableConfigObject;

  @Input("tableConfigObject")
  set tableConfigObject(tableConfigObject : TableConfigObject) {
    this._tableConfigObject = tableConfigObject;
    this.processData();
  }

  get tableConfigObject() : TableConfigObject {
    return this._tableConfigObject;
  }

  @Output() tableConfigObjectChange = new EventEmitter<TableConfigObject>();
  pageSizes = [];
  totalPages : number = 0;
  pageNumber: number = 0;

  constructor(private emitterService:EmitterService,
              private appLoadingService: AppLoadingService,
              private globalService: GlobalService) {
   
    this.pageSizes = this.globalService.optionsRowsPerPage;
  }

  previousPage() {
    if (this._tableConfigObject.tableData.currentPage > 0) {
      this._tableConfigObject.tableData.currentPage--;
      this._tableConfigObject.tableData.nextIndex = this._tableConfigObject.tableData.pageSize * this._tableConfigObject.tableData.currentPage + 1;
      this._tableConfigObject.tableData.showingStart = this._tableConfigObject.tableData.nextIndex;
      this._tableConfigObject.tableData.showingEnd = this._tableConfigObject.tableData.showingStart +
                                                         this._tableConfigObject.tableData.rows.length - 1;
    }
    this.tableConfigObjectChange.emit(this._tableConfigObject);
  }

  isRowsLoading(){
    return this.appLoadingService.TableDataLoading;
  }  

  nextPage() {
    if (this._tableConfigObject.tableData.nextIndex > 0) {
      this._tableConfigObject.tableData.currentPage++;
      if (this._tableConfigObject.tableData.currentPage > this.totalPages) {
       	this.totalPages = this._tableConfigObject.tableData.currentPage;
      }
      this._tableConfigObject.tableData.nextIndex = this._tableConfigObject.tableData.pageSize * this._tableConfigObject.tableData.currentPage + 1;
      this._tableConfigObject.tableData.showingStart = this._tableConfigObject.tableData.nextIndex;
    }
    this.tableConfigObjectChange.emit(this._tableConfigObject);
  }

  disablePrevious () {
    return this._tableConfigObject.tableData.currentPage==0;
  }

  disableNext () {
    return  this._tableConfigObject.tableData.nextIndex==0 || this._tableConfigObject.tableData.nextIndex == -1;
  }

  goToPage () {
		if (this.pageNumber == undefined || this.pageNumber < 1) {
			this.pageNumber = 1;
		} else if (this.pageNumber > this.totalPages) {
			this.pageNumber = this.totalPages;
		}
		this._tableConfigObject.tableData.currentPage = this.pageNumber - 1;
		this._tableConfigObject.tableData.nextIndex = this._tableConfigObject.tableData.pageSize * this._tableConfigObject.tableData.currentPage + 1;
		this._tableConfigObject.tableData.showingStart = this._tableConfigObject.tableData.nextIndex;
    this.tableConfigObjectChange.emit(this._tableConfigObject);
  }

  changedPageSize () {
    this._tableConfigObject.tableData.nextIndex = 1;
    this._tableConfigObject.tableData.currentPage = 0;
    this._tableConfigObject.tableData.showingStart = this._tableConfigObject.tableData.nextIndex;
    this._tableConfigObject.tableData.setPageSize = true;
    this.tableConfigObjectChange.emit(this._tableConfigObject);
  }

  processData() {
    if(this._tableConfigObject.tableData != undefined) {
      this._tableConfigObject.tableData.showingEnd = this._tableConfigObject.tableData.showingStart + this._tableConfigObject.tableData.total - 1;
      this.pageNumber = this._tableConfigObject.tableData.currentPage + 1;
      if (this._tableConfigObject.tableData.totalSize % this._tableConfigObject.tableData.pageSize == 0) {
        this.totalPages = this._tableConfigObject.tableData.totalSize / this._tableConfigObject.tableData.pageSize;
      } else {
        this.totalPages = parseInt(""+this._tableConfigObject.tableData.totalSize / this._tableConfigObject.tableData.pageSize) + 1;
      }
    }
  }

}
