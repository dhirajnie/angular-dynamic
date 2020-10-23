import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSelectionEntRefFieldComponent } from './form-selection-ent-ref-field.component';

describe('FormSelectionEntRefFieldComponent', () => {
  let component: FormSelectionEntRefFieldComponent;
  let fixture: ComponentFixture<FormSelectionEntRefFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSelectionEntRefFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSelectionEntRefFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
