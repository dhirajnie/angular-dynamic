import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupQuickInfoComponent } from './group-quick-info.component';

describe('GroupQuickInfoComponent', () => {
  let component: GroupQuickInfoComponent;
  let fixture: ComponentFixture<GroupQuickInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupQuickInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupQuickInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
