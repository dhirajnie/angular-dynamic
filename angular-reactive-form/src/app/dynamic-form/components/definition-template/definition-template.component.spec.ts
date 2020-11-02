import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinitionTemplateComponent } from './definition-template.component';

describe('DefinitionTemplateComponent', () => {
  let component: DefinitionTemplateComponent;
  let fixture: ComponentFixture<DefinitionTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefinitionTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefinitionTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
