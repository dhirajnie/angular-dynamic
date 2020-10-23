import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitlementPermissionsComponent } from './entitlement-permissions.component';

describe('EntitlementPermissionsComponent', () => {
  let component: EntitlementPermissionsComponent;
  let fixture: ComponentFixture<EntitlementPermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntitlementPermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitlementPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
