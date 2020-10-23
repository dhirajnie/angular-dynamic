import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {VariableService} from "../../shared/services/utilities/util_variable/variable.service";

@Component({
  selector: 'idm-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  @Input('linkType') linkType?:Boolean;
  currentRoute: any;
  constructor(private router: Router,private translate:TranslateService,private vutils:VariableService) {
  }

  ngOnInit() {

  }

  public getCurrentRoute():string{
    let currentRoute = this.router.url.split('/')[1].split('?')[0];
    return currentRoute;
  }

  showHelp() {
    let currentRoute = this.router.url.split('/')[1].split('?')[0];

    if (currentRoute === 'configuration' && this.router.url.split('/').length > 2) {
        currentRoute = this.router.url.split('/')[2].split('?')[0];
        if (currentRoute == 'igConfiguration') {
          currentRoute = 'igconfiguration';
        }
    }

    if (currentRoute === 'delegation' || currentRoute === 'availability') {
      window.open('/idmdash/help/' + this.translate.getUserCurrentLocale() + '/index.html#' + currentRoute, 'help', 'width=900,height=600');
    } else {
      window.open('assets/help/' + this.translate.getUserCurrentLocale() + '/index.html#' + currentRoute, 'help', 'width=900,height=600');
    }
  }

  showOnliyLink(){
    if(this.vutils.isUndefinedOrNull(this.linkType)||this.linkType == false){
      return false
    }
    return true;
  }


}
    