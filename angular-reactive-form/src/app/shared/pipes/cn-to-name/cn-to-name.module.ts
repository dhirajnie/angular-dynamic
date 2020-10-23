import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationService } from '../../services/utilities/util_validation/validation.service';
import { CNFromDN } from './cnToName';


@NgModule({
  imports: [
    CommonModule
  ],
  providers:[ValidationService],
  declarations: [CNFromDN],
  exports:[CNFromDN]
})
export class CnToNameModule { }
