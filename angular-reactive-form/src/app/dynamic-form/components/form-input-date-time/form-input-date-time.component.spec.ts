import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInputDateTimeComponent } from './form-input-date-time.component';

describe('FormInputDateTimeComponent', () => {
  let component: FormInputDateTimeComponent;
  let fixture: ComponentFixture<FormInputDateTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormInputDateTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInputDateTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
