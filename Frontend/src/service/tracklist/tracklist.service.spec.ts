import { TestBed } from '@angular/core/testing';

import { TracklistService } from './tracklist.service';

describe('TracklistService', () => {
  let service: TracklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TracklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
