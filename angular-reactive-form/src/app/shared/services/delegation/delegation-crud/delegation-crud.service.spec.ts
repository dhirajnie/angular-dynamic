import { TestBed, inject } from '@angular/core/testing';

import { DelegationCrudService } from './delegation-crud.service';

describe('DelegationCrudService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DelegationCrudService]
    });
  });

  it('should be created', inject([DelegationCrudService], (service: DelegationCrudService) => {
    expect(service).toBeTruthy();
  }));
});
