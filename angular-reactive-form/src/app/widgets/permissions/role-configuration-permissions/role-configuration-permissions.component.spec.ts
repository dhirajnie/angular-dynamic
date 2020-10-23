import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleConfigurationPermissionsComponent } from './role-configuration-permissions.component';

describe('RoleConfigurationPermissionsComponent', () => {
  let component: RoleConfigurationPermissionsComponent;
  let fixture: ComponentFixture<RoleConfigurationPermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleConfigurationPermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleConfigurationPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
