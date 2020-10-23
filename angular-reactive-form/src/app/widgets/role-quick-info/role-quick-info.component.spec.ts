import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleQuickInfoComponent } from './role-quick-info.component';

describe('RoleQuickInfoComponent', () => {
  let component: RoleQuickInfoComponent;
  let fixture: ComponentFixture<RoleQuickInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleQuickInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleQuickInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
