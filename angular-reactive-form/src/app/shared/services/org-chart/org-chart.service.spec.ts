import { TestBed } from '@angular/core/testing';

import { OrgChartService } from './org-chart.service';

describe('OrgChartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrgChartService = TestBed.get(OrgChartService);
    expect(service).toBeTruthy();
  });
});
