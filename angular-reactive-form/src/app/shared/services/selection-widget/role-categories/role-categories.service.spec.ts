import { TestBed, inject } from '@angular/core/testing';

import { RoleCategoriesService } from './role-categories.service';

describe('RoleCategoriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleCategoriesService]
    });
  });

  it('should be created', inject([RoleCategoriesService], (service: RoleCategoriesService) => {
    expect(service).toBeTruthy();
  }));
});
