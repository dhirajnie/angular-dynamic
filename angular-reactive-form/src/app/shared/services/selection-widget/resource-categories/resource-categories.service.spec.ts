import { TestBed, inject } from '@angular/core/testing';

import { ResourceCategoriesService } from './resource-categories.service';

describe('ResourceCategoriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResourceCategoriesService]
    });
  });

  it('should be created', inject([ResourceCategoriesService], (service: ResourceCategoriesService) => {
    expect(service).toBeTruthy();
  }));
});
