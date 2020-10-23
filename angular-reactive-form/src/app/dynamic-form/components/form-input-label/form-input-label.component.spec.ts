import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInputLabelComponent } from './form-input-label.component';

describe('FormInputLabelComponent', () => {
  let component: FormInputLabelComponent;
  let fixture: ComponentFixture<FormInputLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormInputLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInputLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
