import { TestBed } from '@angular/core/testing';

import { AvailabilityCrudService } from './availability-crud.service';

describe('AvailabilityCrudService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AvailabilityCrudService = TestBed.get(AvailabilityCrudService);
    expect(service).toBeTruthy();
  });
});
