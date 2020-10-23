import { Component, OnInit } from '@angular/core';
import { Field } from '../../models/field.schema';
import { FieldConfig } from '../../models/field-config.schema';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { UIConstants } from '../../../shared/constants/ui-constants';

@Component({
  selector: 'idm-form-input-file',
  templateUrl: './form-input-file.component.html',
  styleUrls: ['./form-input-file.component.css']
})
export class FormInputFileComponent extends Field {

  config: FieldConfig;
  group: FormGroup;
  img: any;
  valSet = false;
  photo: any;
  name: any;
  buttonTitle: string;
  error: boolean = false;
  errorMessage: string;
  constructor(
    public sanitizer: DomSanitizer
  ) {
    super();


  }


  imgClick() {
    this.img = "";
    this.config.attributeValues = '';
    this.group.controls[this.config.key].setValue('');
  }


  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0 && (event.target.files[0].type === 'image/jpeg' || event.target.files[0].type === 'image/png')) {
      let fileSize = (event.target.files[0].size / 1024);
      if (fileSize <= UIConstants.defaultImageSize) {
        this.error = false;
        let file = event.target.files[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
          let temp = (String)(reader.result).split(',')[1];
          this.img = (String)(reader.result);
          this.group.controls[this.config.key].setValue(temp);
          this.img = this.sanitizer.bypassSecurityTrustResourceUrl(this.img);
          this.valSet = true;
        };
      } else {
        this.error = true;
        this.errorMessage = 'Image Size Is Greater Than 59 kb. Please Choose Different Image Lesser Than 59 kb.';
      }
    }
    else {
      this.error = true;
      this.errorMessage = 'Invalid image type';
    }

  }
}
