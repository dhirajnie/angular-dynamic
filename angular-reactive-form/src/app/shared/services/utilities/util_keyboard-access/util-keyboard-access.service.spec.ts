import { TestBed, inject } from '@angular/core/testing';

import { UtilKeyboardAccessService } from './util-keyboard-access.service';

describe('UtilKeyboardAccessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilKeyboardAccessService]
    });
  });

  it('should be created', inject([UtilKeyboardAccessService], (service: UtilKeyboardAccessService) => {
    expect(service).toBeTruthy();
  }));
});
