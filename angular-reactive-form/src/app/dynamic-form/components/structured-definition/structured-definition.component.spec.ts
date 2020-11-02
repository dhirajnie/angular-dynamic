import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructuredDefinitionComponent } from './structured-definition.component';

describe('StructuredDefinitionComponent', () => {
  let component: StructuredDefinitionComponent;
  let fixture: ComponentFixture<StructuredDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructuredDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructuredDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
