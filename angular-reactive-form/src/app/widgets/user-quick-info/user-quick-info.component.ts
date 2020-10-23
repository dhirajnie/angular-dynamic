import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {VariableService} from "../../shared/services/utilities/util_variable/variable.service";
import { UserQuickInfoService } from 'src/app/shared/services/userQuickInfo/user-quick-info.service';
declare let $: any;

@Component({
  selector: 'idm-user-quick-info',
  templateUrl: './user-quick-info.component.html',
  styleUrls: ['./user-quick-info.component.css'],
})
export class UserQuickInfoComponent implements OnInit {
  quickInfo: any;
  _userDN: any;
  loading: boolean;
  @Input('id') widgetID:string;
  @Input('userDN')
  set userDN(val) {
    if(!this.vutils.isUndefinedOrNull(val)){
      this._userDN = val;
      this.getUSerInfo(this._userDN);
      $('#userQuickInfo_'+this.widgetID).modal('show');
    }

  }

  constructor(private UserQuickInfoService: UserQuickInfoService, private sanitizer: DomSanitizer, private vutils: VariableService) {
    this.loading=true;
  }

  ngOnInit() {
  }

  getUSerInfo(userCN) {
    this.loading = true;
    this.UserQuickInfoService.getUSerInfo(userCN)
      .subscribe(
        res => {
          this.quickInfo = res;
          this.loading = false;
        },
        error => {

        }
      );
  }

  close(){
    $('#userQuickInfo_'+this.widgetID).modal('hide');
  }

}
