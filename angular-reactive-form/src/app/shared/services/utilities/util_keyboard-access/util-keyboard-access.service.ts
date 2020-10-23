import { Injectable } from '@angular/core';
declare var $: any;
@Injectable()
export class UtilKeyboardAccessService {
  constructor() { }

  toggleCheckBox(event,field) {
    if(event.key == "ArrowRight") {
      field.setValue(true);
    }
    if(event.key == "ArrowLeft") {
       field.setValue(false);
    }
  }  

  toggleRadio(event,field,value) {
  
  if(event.keyCode == 39 && field !== undefined) {
      field.setValue(value);
    }
    
   if (event.keyCode === 13 && field !== undefined) {
      field.setValue(value);
    }
  }  

  //keyBoard access
  togglePanel(event) {
    var targetElement  = event.target.dataset;
    if(event.key == "ArrowDown") {
       $(targetElement.target).collapse('show');
    }
    if(event.key == "ArrowUp") {
       $(targetElement.target).collapse('hide');
    }
  }  
/**
 * trigger on click event
 * @param event keypress event
 * @param elementID elemend id which for which on click event has to be triggered
 */
  public onClick(event, elementID) {
    if (event.keyCode === 13) {
      // Trigger the button element with a click
      document.getElementById(elementID).click();
    }
  }

}
