import { TestBed, inject } from '@angular/core/testing';

import { NavigationRightsService } from './navigation-rights.service';

describe('NavigationRightsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavigationRightsService]
    });
  });

  it('should be created', inject([NavigationRightsService], (service: NavigationRightsService) => {
    expect(service).toBeTruthy();
  }));
});
