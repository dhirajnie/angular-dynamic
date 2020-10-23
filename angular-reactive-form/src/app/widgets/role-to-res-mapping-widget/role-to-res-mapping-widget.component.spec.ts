import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleToResMappingWidgetComponent } from './role-to-res-mapping-widget.component';

describe('RoleToResMappingWidgetComponent', () => {
  let component: RoleToResMappingWidgetComponent;
  let fixture: ComponentFixture<RoleToResMappingWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleToResMappingWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleToResMappingWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
