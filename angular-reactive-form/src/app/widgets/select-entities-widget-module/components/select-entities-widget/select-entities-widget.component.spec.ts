import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectEntitiesWidgetComponent } from './select-entities-widget.component';

describe('SelectEntitiesWidgetComponent', () => {
  let component: SelectEntitiesWidgetComponent;
  let fixture: ComponentFixture<SelectEntitiesWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectEntitiesWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectEntitiesWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
