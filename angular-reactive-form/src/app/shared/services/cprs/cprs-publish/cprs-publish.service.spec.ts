import { TestBed, inject } from '@angular/core/testing';

import { CprsPublishService } from './cprs-publish.service';

describe('CprsPublishService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CprsPublishService]
    });
  });

  it('should be created', inject([CprsPublishService], (service: CprsPublishService) => {
    expect(service).toBeTruthy();
  }));
});
