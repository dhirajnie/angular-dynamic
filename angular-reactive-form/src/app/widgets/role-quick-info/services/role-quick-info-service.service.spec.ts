import { TestBed, inject } from '@angular/core/testing';

import { RoleQuickInfoServiceService } from './role-quick-info-service.service';

describe('RoleQuickInfoServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleQuickInfoServiceService]
    });
  });

  it('should be created', inject([RoleQuickInfoServiceService], (service: RoleQuickInfoServiceService) => {
    expect(service).toBeTruthy();
  }));
});
