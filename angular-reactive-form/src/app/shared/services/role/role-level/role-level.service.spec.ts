import { TestBed, inject } from '@angular/core/testing';

import { RoleLevelService } from './role-level.service';

describe('RoleLevelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleLevelService]
    });
  });

  it('should be created', inject([RoleLevelService], (service: RoleLevelService) => {
    expect(service).toBeTruthy();
  }));
});
