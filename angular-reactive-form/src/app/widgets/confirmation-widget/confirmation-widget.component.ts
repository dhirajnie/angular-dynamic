import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

declare var $: any;

@Component({
  selector: 'idm-confirmation-widget',
  templateUrl: './confirmation-widget.component.html',
  styleUrls: ['./confirmation-widget.component.css']
})
export class ConfirmationWidgetComponent implements OnInit {

    _showModal:boolean;
    @Output() onConfirmation = new EventEmitter();
    @Output() onCancellation = new EventEmitter();
    @Input('mainHeading') mainHeading :string;
    @Input('subHeading') subHeading? :string;
    @Input('isConfirmationRequired') isConfirmationRequired? :boolean = true;
    @Input('showModal')
      set showModal(value :boolean){
        this._showModal=value;
        if(this._showModal){
          $('#confirmation').modal('show');
        }
        else {
          $('#confirmation').modal('hide');
        }
      }
     @Output() showModalChange =new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  confirm(){
    this.onConfirmation.emit();
    this.showModalChange.emit(false);
  }

  cancel(){
    this.onCancellation.emit();
    this.showModalChange.emit(false);
  }

}
