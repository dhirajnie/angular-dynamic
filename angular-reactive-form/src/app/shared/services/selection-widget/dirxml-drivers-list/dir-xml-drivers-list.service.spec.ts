import { TestBed, inject } from '@angular/core/testing';

import { DirXmlDriversListService } from './dir-xml-drivers-list.service';

describe('DirXmlDriversListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DirXmlDriversListService]
    });
  });

  it('should be created', inject([DirXmlDriversListService], (service: DirXmlDriversListService) => {
    expect(service).toBeTruthy();
  }));
});
