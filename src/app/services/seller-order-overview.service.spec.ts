import { TestBed } from '@angular/core/testing';

import { SellerOrderOverviewService } from './SellerOrderOverviewService';

describe('SellerOrderOverviewService', () => {
  let service: SellerOrderOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellerOrderOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
