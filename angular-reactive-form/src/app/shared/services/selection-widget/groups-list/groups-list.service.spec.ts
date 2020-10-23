import { TestBed, inject } from '@angular/core/testing';

import { GroupsListService } from './groups-list.service';

describe('GroupsListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupsListService]
    });
  });

  it('should be created', inject([GroupsListService], (service: GroupsListService) => {
    expect(service).toBeTruthy();
  }));
});
