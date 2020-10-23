import { TestBed, inject } from '@angular/core/testing';

import { SodsListService } from './sods-list.service';

describe('SodsListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SodsListService]
    });
  });

  it('should be created', inject([SodsListService], (service: SodsListService) => {
    expect(service).toBeTruthy();
  }));
});
