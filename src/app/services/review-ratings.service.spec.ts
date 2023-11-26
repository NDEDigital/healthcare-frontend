import { TestBed } from '@angular/core/testing';

import { ReviewRatingsService } from './review-ratings.service';

describe('ReviewRatingsService', () => {
  let service: ReviewRatingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewRatingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
