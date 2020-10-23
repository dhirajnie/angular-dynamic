import {Pipe, PipeTransform} from '@angular/core';
import { VariableService } from '../../services/utilities/util_variable/variable.service';

@Pipe({name: 'CNFromDN'})
export class CNFromDN implements PipeTransform {
  constructor(private vutils:VariableService){}
   transform(dn: string, args: string[]): any {
    if (!dn) return dn;
    let cn=this.vutils.getCnFromDn(dn);
    if(!this.vutils.isEmptyString(cn)){
      return cn;
    }else {
      return dn;
    }
  }
  
}
