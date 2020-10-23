import { TestBed } from '@angular/core/testing';

import { CreateWorkflowService } from './create-workflow.service';

describe('CreateWorkflowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateWorkflowService = TestBed.get(CreateWorkflowService);
    expect(service).toBeTruthy();
  });
});
