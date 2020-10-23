import { TestBed, inject } from '@angular/core/testing';

import { CprsResourcesService } from './cprs-resources.service';

describe('CprsResourcesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CprsResourcesService]
    });
  });

  it('should be created', inject([CprsResourcesService], (service: CprsResourcesService) => {
    expect(service).toBeTruthy();
  }));
});
