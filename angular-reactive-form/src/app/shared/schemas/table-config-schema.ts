import { TableRowSchema, ColumnCustomizationSchema } from "./table-row-schema";

class multiSelect {
  btnName:string;
  btnId:string;
  disableMultiAction?: boolean;
}

export class TableConfigObject{
  columnCustomData:ColumnCustomizationSchema;
  tableData:TableRowSchema;
  multiSelectButtons: multiSelect[];
  columns: string[];
}
