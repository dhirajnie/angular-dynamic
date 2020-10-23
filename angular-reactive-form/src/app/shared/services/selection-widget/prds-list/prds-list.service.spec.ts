import { TestBed, inject } from '@angular/core/testing';

import { PrdsListService } from './prds-list.service';

describe('PrdsListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrdsListService]
    });
  });

  it('should be created', inject([PrdsListService], (service: PrdsListService) => {
    expect(service).toBeTruthy();
  }));
});
