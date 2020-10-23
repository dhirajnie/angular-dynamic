import { TestBed, inject } from '@angular/core/testing';

import { ResourceListService } from './resource-list.service';

describe('ResourcesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResourceListService]
    });
  });

  it('should be created', inject([ResourceListService], (service: ResourceListService) => {
    expect(service).toBeTruthy();
  }));
});
