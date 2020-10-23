import { TestBed, inject } from '@angular/core/testing';

import { ResourceNamesService } from './resource-names.service';

describe('ResourceNamesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResourceNamesService]
    });
  });

  it('should be created', inject([ResourceNamesService], (service: ResourceNamesService) => {
    expect(service).toBeTruthy();
  }));
});
