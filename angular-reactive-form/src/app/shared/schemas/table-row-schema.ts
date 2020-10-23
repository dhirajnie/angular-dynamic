
import {TableRows} from "./table-rows";
export class TableRowSchema {
  sortBy:string;
  sortOrder:string;
  total : number;
  hasMore : boolean;
  hasNext : any;
  rows :TableRows[];
  totalSize : any;
  nextIndex :number;
  currentPage : number;
  showingStart : number;
  pageSize : number;
  showingEnd : number;
  userTypeInTask : boolean;
  request:TableRows[];
  roleLevel:any;
  categoryKeys:any;
  query:string;
  setPageSize : boolean;
  disablePagination: boolean;
}


 export class column{
   column:string;
   isclickable:boolean;
   isSortable:boolean;
   displayLabel:string;
   columnWidth?:number;
 }
export class ColumnCustomizationSchema{
   columns: column[];
   enableCustomization: boolean;
 }

