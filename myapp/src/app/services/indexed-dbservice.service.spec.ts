import { TestBed } from '@angular/core/testing';
import { IndexedDbService } from './indexed-dbservice.service';

describe('IndexedDbserviceService', () => {
  let service: IndexedDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexedDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
