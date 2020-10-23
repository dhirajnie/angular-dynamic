import { Injectable } from '@angular/core';
import { EmitterService } from "../emitter/emitter.service";
declare let $: any;

@Injectable()
export class FeedBackService {

  _feedBackMessage:any;
  _childFeedBackMessage:any;
  constructor(private EmitterService:EmitterService) {
    this._feedBackMessage = this.EmitterService.get("feedBackMessage");
    this._childFeedBackMessage = this.EmitterService.get("childFeedBackMessage");
   }

    feedBack(message:any){
    this._feedBackMessage.emit({message});
    }
    feedBackSuccess(message:any){
    this._feedBackMessage.emit({message,status:200});
    }
    feedBackWarning(message:any){
    this._feedBackMessage.emit({message,status:'warning'});
    }
    StickyFeedBackWarning(message:any){
    this._feedBackMessage.emit({message,status:'warning',sticky:true});
    }
    feedBackError(message:any){
    this._feedBackMessage.emit({message,status:-1});
    }

    childFeedBack(message:any){
    this._childFeedBackMessage.emit({message});
    }
    childFeedBackSuccess(message:any){
    this._childFeedBackMessage.emit({message,status:200});
    }
    childFeedBackWarning(message:any){
      this._childFeedBackMessage.emit({message,status:'warning'});
    }
    StickyChildFeedBackWarning(message:any){
      this._childFeedBackMessage.emit({message,status:'warning',sticky:true});
    }
    childFeedBackError(message:any){
    this._childFeedBackMessage.emit({message,status:-1});
    }

    // closeFeedback() {
    //   $("#globalFeedBack").hide();
    // }
}
