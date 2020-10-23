import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQuickInfoComponent } from './user-quick-info.component';

describe('UserQuickInfoComponent', () => {
  let component: UserQuickInfoComponent;
  let fixture: ComponentFixture<UserQuickInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserQuickInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserQuickInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
