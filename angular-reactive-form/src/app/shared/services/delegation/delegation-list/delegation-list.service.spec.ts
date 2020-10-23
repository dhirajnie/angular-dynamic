import { TestBed, inject } from '@angular/core/testing';

import { DelegationListService } from './delegation-list.service';

describe('DelegationListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DelegationListService]
    });
  });

  it('should be created', inject([DelegationListService], (service: DelegationListService) => {
    expect(service).toBeTruthy();
  }));
});
