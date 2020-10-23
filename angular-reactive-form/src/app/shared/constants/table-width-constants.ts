export class TableWidthConstants {
  private static tableColumnWidth={
    "name":0.8,
    "description":1,
    "roleLevel":1,
    "owners":0.8,
    "categories":0.5,
    "roles":0.5,
  };


 public static getWidth(column) :any{
    if(this.tableColumnWidth.hasOwnProperty(column)) {
      return this.tableColumnWidth[column];
    } else {
      return 0.5;
    }
 }
}
