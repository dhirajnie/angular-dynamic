import { TestBed, inject } from '@angular/core/testing';

import { ResourceCrudService } from './resource-crud.service';

describe('ResourceDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResourceCrudService]
    });
  });

  it('should be created', inject([ResourceCrudService], (service: ResourceCrudService) => {
    expect(service).toBeTruthy();
  }));
});
