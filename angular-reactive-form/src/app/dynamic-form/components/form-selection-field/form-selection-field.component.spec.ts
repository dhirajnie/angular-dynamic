import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSelectionFieldComponent } from './form-selection-field.component';

describe('FormSelectionFieldComponent', () => {
  let component: FormSelectionFieldComponent;
  let fixture: ComponentFixture<FormSelectionFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSelectionFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSelectionFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
