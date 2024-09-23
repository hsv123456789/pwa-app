import { TestBed } from '@angular/core/testing';

import { IndexedDbserviceService } from './indexed-dbservice.service';

describe('IndexedDbserviceService', () => {
  let service: IndexedDbserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexedDbserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
