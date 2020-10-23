import { TestBed, inject } from '@angular/core/testing';

import { RolesPermListService } from './roles-perm-list.service';

describe('RolesListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RolesPermListService]
    });
  });

  it('should be created', inject([RolesPermListService], (service: RolesPermListService) => {
    expect(service).toBeTruthy();
  }));
});
