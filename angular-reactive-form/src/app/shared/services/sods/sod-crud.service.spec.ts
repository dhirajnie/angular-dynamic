import { TestBed, inject } from '@angular/core/testing';

import { SodCrudService } from './sod-crud.service';

describe('SodCrudService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SodCrudService]
    });
  });

  it('should be created', inject([SodCrudService], (service: SodCrudService) => {
    expect(service).toBeTruthy();
  }));
});
