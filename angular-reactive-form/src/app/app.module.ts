import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DynamicFormComponent } from './dynamic-form/containers/dynamic-form/dynamic-form.component';
import { DynamicFormModule } from './dynamic-form/dynamic-form.module';
import { VariableService } from './shared/services/utilities/util_variable/variable.service';

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DynamicFormModule

  ],
  providers: [VariableService],
  bootstrap: [AppComponent]
})
export class AppModule { }
