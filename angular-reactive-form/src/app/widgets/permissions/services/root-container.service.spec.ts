import { TestBed, inject } from '@angular/core/testing';

import { RootContainerService } from './root-container.service';

describe('RootContainerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RootContainerService]
    });
  });

  it('should be created', inject([RootContainerService], (service: RootContainerService) => {
    expect(service).toBeTruthy();
  }));
});
