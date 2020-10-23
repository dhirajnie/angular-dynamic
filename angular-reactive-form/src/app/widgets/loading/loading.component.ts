import { Component, OnInit, Input } from '@angular/core';
import { AppLoadingService } from 'src/app/shared/services/loading/app-loading.service';

@Component({
  selector: 'idm-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit{
  ngOnInit(): void {
 
  }

  @Input('tableLoading') tableLoading?:boolean;
  @Input('componentLoading') componentLoading?:boolean;
  _class:any;
  @Input('class')
  set  class(val){
    this._class=val;
  }
  constructor(private appLoadingService: AppLoadingService) {
    //console.log(this.tableLoading);
  }


  isApplicationLoading() {
    return this.appLoadingService.appLoading;
  }

  isTableDataLoading() {
    return this.appLoadingService.TableDataLoading;
  }

  isComponentLoading() {
    return this.appLoadingService.ComponentLoading;
  }

}
