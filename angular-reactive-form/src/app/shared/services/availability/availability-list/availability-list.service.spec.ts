import { TestBed } from '@angular/core/testing';

import { AvailabilityListService } from './availability-list.service';

describe('AvailabilityListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AvailabilityListService = TestBed.get(AvailabilityListService);
    expect(service).toBeTruthy();
  });
});
