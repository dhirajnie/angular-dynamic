import { TestBed, inject } from '@angular/core/testing';

import { CodemapRefreshService } from './codemap-refresh.service';

describe('CodemapRefreshService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CodemapRefreshService]
    });
  });

  it('should be created', inject([CodemapRefreshService], (service: CodemapRefreshService) => {
    expect(service).toBeTruthy();
  }));
});
