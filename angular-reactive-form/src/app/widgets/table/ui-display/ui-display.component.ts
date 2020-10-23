import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { Table } from '../table';
import { VariableService } from 'src/app/shared/services/utilities/util_variable/variable.service';
import { GlobalService } from 'src/app/shared/services/global/global.service';
import { UIConstants } from 'src/app/shared/constants/ui-constants';
import { TranslateService } from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'idm-ui-display',
  templateUrl: 'ui-display.component.html',
  styleUrls: ['ui-display.component.css']
})
export class UiDisplayComponent implements OnInit {
  _uiData: any;
  @Input('uiData')
  set uiData(val) {
    this._uiData = null;
    this._uiData = val;
  }
  @Input('rowData') rowData: any;
  @Input('columnHeader') columnHeader: string;
  @Input('isClickable') isClickable: boolean;
  @Input('rowNumber') rowNumber: number;
  displayData: string;
  displayComplexData: any;
  showComplexData = false;
  refreshModelData: boolean;
  imageType: boolean = false;
  dateType:boolean=false;
  modalData = [];
  constructor(@Inject(forwardRef(() => Table)) private _parent: Table,
    private translate: TranslateService, private vutils: VariableService, public globalService: GlobalService) {
    this.displayComplexData = [];
    // this.refreshModelData = false;
  }

  ngOnInit() {
    // console.log( this.isClickable);
    this.isolateData();
  }

  isolateData() {
    if (!this.vutils.isUndefinedOrNull(this._uiData)) {
      if (typeof this._uiData === 'object') {
        this.showComplexData = true;
        if (Object.prototype.toString.call(this._uiData) === '[object Array]') {
          this._uiData.forEach(element => {
            if(element.hasOwnProperty('entityDisplayValue')){
              this.displayComplexData.push(element.entityDisplayValue);
              return;
            }
            else if (element.hasOwnProperty('name')) {
              this.displayComplexData.push(element.name);
              return;
            }
            else if (element.hasOwnProperty('displayName')) {
              this.displayComplexData.push(element.displayName);
              return;
            }
            else if (element.hasOwnProperty('id')) {
              this.displayComplexData.push(element.id);
              return;
            }

            else if (element.hasOwnProperty('ID')) {
              this.displayComplexData.push(element.ID);
              return;
            }
            else {
              if (typeof element === 'string' && element.includes(UIConstants.entitlementParamKey)) {
                this.displayComplexData.push(this.translate.get('N/A'));
                return;
              } else {
                this.displayComplexData.push(element);
                return;
              }
            }
          });

        } else if (Object.prototype.toString.call(this._uiData) === '[object Object]') {
          this.showComplexData = false;
          if (this._uiData.hasOwnProperty('name')) {
            this.displayData = this._uiData.name;
          }
          else if (this._uiData.hasOwnProperty('displayName')) {
            this.displayData = this._uiData.displayName;
          }
          else if (this._uiData.hasOwnProperty('ID')) {
            this.displayData = this._uiData.ID;
          }
          else if (this._uiData.hasOwnProperty('DataType')) {
            switch (this._uiData.DataType) {
              case 'image': {
                this.imageType = true;
                this.displayData = 'data:image/jpeg;base64,' + this._uiData.data;
                break;
              }
              case 'timeStamp':{
                this.dateType=true;
                this.displayData= this.globalService.dateFormatter(this._uiData.data);
                break;
              }
              default:
                break;
            }
          }
        }
        //console.log(temp);
      } else if (typeof this._uiData === 'string') {

        this.displayData = this._uiData;
      }

    }
  }

  isColumnValueClickable(currentElement) {
    let giveClick = true;
    if (currentElement.hasOwnProperty('clickable')) {
      giveClick = false;
    }
    return giveClick;
  }

  simpleClickHandler() {
    this._parent.elementClickHandler(this.rowData, this.columnHeader);
  }
  complexClickHandler(element) {
    this._parent.elementClickHandler(element, this.columnHeader);
  }
  changeModalData(data) {
    this.refreshModelData = true;
    this.modalData = data;
  }



}
