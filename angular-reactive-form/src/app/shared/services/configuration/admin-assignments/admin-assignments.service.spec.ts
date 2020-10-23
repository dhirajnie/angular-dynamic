import { TestBed, inject } from '@angular/core/testing';

import { AdminAssignmentsService } from './admin-assignments.service';

describe('AdminAssignmentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminAssignmentsService]
    });
  });

  it('should be created', inject([AdminAssignmentsService], (service: AdminAssignmentsService) => {
    expect(service).toBeTruthy();
  }));
});
