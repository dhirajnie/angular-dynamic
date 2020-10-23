import { TestBed, inject } from '@angular/core/testing';

import { RoleCrudService } from './role-crud.service';

describe('RoleDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleCrudService]
    });
  });

  it('should be created', inject([RoleCrudService], (service: RoleCrudService) => {
    expect(service).toBeTruthy();
  }));
});
