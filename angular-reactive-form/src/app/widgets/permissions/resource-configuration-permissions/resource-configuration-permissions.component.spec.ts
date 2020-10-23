import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceConfigurationPermissionsComponent } from './resource-configuration-permissions.component';

describe('ResourceConfigurationPermissionsComponent', () => {
  let component: ResourceConfigurationPermissionsComponent;
  let fixture: ComponentFixture<ResourceConfigurationPermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceConfigurationPermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceConfigurationPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
