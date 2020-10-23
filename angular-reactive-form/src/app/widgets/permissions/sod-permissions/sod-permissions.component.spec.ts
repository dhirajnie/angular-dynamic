import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SodPermissionsComponent } from './sod-permissions.component';

describe('SodPermissionsComponent', () => {
  let component: SodPermissionsComponent;
  let fixture: ComponentFixture<SodPermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SodPermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SodPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
