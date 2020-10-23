import { TestBed, inject } from '@angular/core/testing';

import { ProvisioningUiDisplayService } from './provisioning-ui-display.service';

describe('ProvisioningUiDisplayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProvisioningUiDisplayService]
    });
  });

  it('should be created', inject([ProvisioningUiDisplayService], (service: ProvisioningUiDisplayService) => {
    expect(service).toBeTruthy();
  }));
});
