import { TestBed } from '@angular/core/testing';

import { SongrecService } from './songrec.service';

describe('SongrecService', () => {
  let service: SongrecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SongrecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
