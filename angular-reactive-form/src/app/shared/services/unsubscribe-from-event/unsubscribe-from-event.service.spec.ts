import { TestBed } from '@angular/core/testing';

import { UnsubscribeFromEventService } from './unsubscribe-from-event.service';

describe('UnsubscribeFromEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UnsubscribeFromEventService = TestBed.get(UnsubscribeFromEventService);
    expect(service).toBeTruthy();
  });
});
