import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrdPermissionsComponent } from './prd-permissions.component';

describe('PrdPermissionsComponent', () => {
  let component: PrdPermissionsComponent;
  let fixture: ComponentFixture<PrdPermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrdPermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrdPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
