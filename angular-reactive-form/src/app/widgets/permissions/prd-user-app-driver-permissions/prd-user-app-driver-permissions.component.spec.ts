import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrdUserAppDriverPermissionsComponent } from './prd-user-app-driver-permissions.component';

describe('PrdUserAppDriverPermissionsComponent', () => {
  let component: PrdUserAppDriverPermissionsComponent;
  let fixture: ComponentFixture<PrdUserAppDriverPermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrdUserAppDriverPermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrdUserAppDriverPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
