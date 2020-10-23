import { Component, OnInit, Input } from '@angular/core';
import { VariableService } from "../../shared/services/utilities/util_variable/variable.service";
import { RoleQuickInfoServiceService } from "./services/role-quick-info-service.service";
import { Router } from '@angular/router';
declare let $: any;
@Component({
  selector: 'idm-role-quick-info',
  templateUrl: './role-quick-info.component.html',
  styleUrls: ['./role-quick-info.component.css']
})
export class RoleQuickInfoComponent implements OnInit {
  quickInfo: any;
  _roleDN: any;
  loading: boolean;
  @Input('id') widgetID: string;
  @Input('roleDN')
  set roleDN(val) {
    if (!this.vutils.isUndefinedOrNull(val)) {
      this._roleDN = val;
      this.getRoleInfo(this._roleDN);
      $('#roleQuickInfo_' + this.widgetID).modal('show');
    }

  }
  constructor(private vutils: VariableService, private roleQuickInfoServiceService: RoleQuickInfoServiceService, private route: Router) { 
    this.loading = true;
  }

  ngOnInit() {
  }

  getRoleInfo(roleDn) {
    this.loading = true;
    this.roleQuickInfoServiceService.getRoleInfo(roleDn)
      .subscribe(
        res => {
          this.quickInfo = res;
          this.loading = false;
        },
        error => {

        }
      );
  }

  close() {
    $('#roleQuickInfo_' + this.widgetID).modal('hide');
  }

  goToRoleDetails(roleDn){
    this.close();
    this.route.navigate(['/role/detail', roleDn]);
  }

}
