import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerTreeComponent } from './container-tree.component';

describe('ContainerTreeComponent', () => {
  let component: ContainerTreeComponent;
  let fixture: ComponentFixture<ContainerTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
