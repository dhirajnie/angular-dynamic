import { TestBed, inject } from '@angular/core/testing';

import { CatalogContainersService } from './catalog-containers.service';

describe('CatalogContainersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatalogContainersService]
    });
  });

  it('should be created', inject([CatalogContainersService], (service: CatalogContainersService) => {
    expect(service).toBeTruthy();
  }));
});
