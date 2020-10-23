import { Component, OnInit, Input } from '@angular/core';
import { EmitterService } from "../../shared/services/emitter/emitter.service";
import { SettingsService } from "../../shared/services/settings/settings.service";
import { ClientSettingsObject } from "../../shared/schemas/client-settings-object";
import { VariableService } from "../../shared/services/utilities/util_variable/variable.service";
import { Router } from "@angular/router";

declare let $: any;

@Component({
  selector: 'idm-feed-back',
  templateUrl: './feed-back.component.html',
  styleUrls: ['./feed-back.component.css']
})
export class FeedBackComponent implements OnInit {
  feedBackEmittor: any;
  displayMessage: any;
  messageType: boolean;
  showFeedBack: boolean;
  treeNotification: boolean;
  feedBackNotificationTime: ClientSettingsObject;
  alertType:string;

  constructor(protected EmitterService: EmitterService, protected SettingsService: SettingsService, protected vutils: VariableService, protected route: Router) {
    this.eventListener();
    this.showFeedBack = false;
    this.treeNotification = false;
    this.feedBackNotificationTime = new ClientSettingsObject();
    this.SettingsService.getSettingsByKey('customization', 'messageTime').subscribe(res => {
      this.feedBackNotificationTime = res;
    });
  }

  eventListener() {
    this.feedBackEmittor = this.EmitterService.get('feedBackMessage');
    this.feedBackEmittor.subscribe(data => {
      if (data.message.hasOwnProperty('succeeded') || data.message.hasOwnProperty('failed') || data.message.hasOwnProperty('sods')) {
        this.displayMessage = data.message;
        if (!this.vutils.isUndefined(data.message.succeeded) && !this.vutils.isArray(data.message.succeeded)) {
          data.message.succeeded = [data.message.succeeded];
        }
        if (!this.vutils.isUndefined(data.message.failed) && !this.vutils.isArray(data.message.failed)) {
          data.message.failed = [data.message.failed];
        }
        if (!this.vutils.isUndefined(data.message.sods) && !this.vutils.isArray(data.message.sods)) {
          data.message.sods = [data.message.sods];
        }
        if (!this.vutils.isUndefined(data.message.success) && !this.vutils.isBoolean(data.message.success)) {
          if (this.vutils.equals(data.message.success, "true")) {
            data.message.success = true;
          } else {
            data.message.success = false;
          }
        }
        this.treeNotification = true;
        if (data.message.hasOwnProperty('success')) {
          if(data.message.success){
            this.alertType = 'alert-success';
          }else{
            this.alertType = 'alert-danger';
          }
          
        }
      }
      else {
        this.treeNotification = false;
        this.displayMessage = data.message;
        if (data.status == 200) {
          this.alertType = 'alert-success';
        }
        else if (data.status == 'warning') {
          this.alertType = 'alert-warning';
        } else{
          this.alertType = 'alert-danger';
        }
      }

      if (data.message) {
        $("#globalFeedBack").show();
      }
        window.setTimeout(function () {
          $("#globalFeedBack").hide();
        }, this.feedBackNotificationTime.value);

    });
  }

  ngOnInit() {
    $("#globalFeedBack").hide();

  }

  close() {
    $("#globalFeedBack").hide();
  }

}

@Component({
  selector: 'idm-feed-back-child',
  templateUrl: './feed-back-child.component.html',
  styleUrls: ['./feed-back.component.css']
})
export class FeedBackComponentChild extends FeedBackComponent {

  childFeedBackEmittor: any;
  @Input("noDismis") noDismis?: boolean;
  @Input("onCloseReRoute") onCloseReRoute?: string;

  eventListener() {
    this.childFeedBackEmittor = this.EmitterService.get('childFeedBackMessage');
    this.childFeedBackEmittor.subscribe(data => {
      if (data.message.hasOwnProperty('succeeded') || data.message.hasOwnProperty('failed') || data.message.hasOwnProperty('sods')) {
        this.displayMessage = data.message;
        if (!this.vutils.isUndefined(data.message.succeeded) && !this.vutils.isArray(data.message.succeeded)) {
          data.message.succeeded = [data.message.succeeded];
        }
        if (!this.vutils.isUndefined(data.message.failed) && !this.vutils.isArray(data.message.failed)) {
          data.message.failed = [data.message.failed];
        }
        if (!this.vutils.isUndefined(data.message.sods) && !this.vutils.isArray(data.message.sods)) {
          data.message.sods = [data.message.sods];
        }
        if (!this.vutils.isUndefined(data.message.success) && !this.vutils.isBoolean(data.message.success)) {
          if (this.vutils.equals(data.message.success, "true")) {
            data.message.success = true;
          } else {
            data.message.success = false;
          }
        }
        this.treeNotification = true;
        if (data.message.hasOwnProperty('success')) {
          this.messageType = data.message.success;
        }
      }
      else {
        this.treeNotification = false;
        this.displayMessage = data.message;
        if (data.status == 200) {
          this.messageType = true;
        }
        else {
          this.messageType = false;
        }
      }

      if (data.message) {
        $("#childFeedBack").show();
      }
      if (this.vutils.isUndefinedOrNull(this.noDismis)) {
        window.setTimeout(function () {
          $("#childFeedBack").hide();
        }, this.feedBackNotificationTime.value);
      }


    });
  }

  ngOnInit() {
    $("#childFeedBack").hide();
  }

  close() {
    if (!this.vutils.isUndefinedOrNull(this.onCloseReRoute)) {
      this.route.navigateByUrl(this.onCloseReRoute);
    }
    $("#childFeedBack").hide();
  }
}
