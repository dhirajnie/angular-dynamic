import { TestBed, inject } from '@angular/core/testing';

import { UserQuickInfoService } from './user-quick-info.service';

describe('UserQuickInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserQuickInfoService]
    });
  });

  it('should be created', inject([UserQuickInfoService], (service: UserQuickInfoService) => {
    expect(service).toBeTruthy();
  }));
});
