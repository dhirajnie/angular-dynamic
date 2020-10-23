import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'idm-attribute-values',
  templateUrl: './attribute-values.component.html',
  styleUrls: ['./attribute-values.component.css']
})
export class AttributeValuesComponent implements OnInit {

  @Input('className')className:string;
  @Input('attribute')attribute:any;
  constructor() { }

  ngOnInit() {
  }

}
