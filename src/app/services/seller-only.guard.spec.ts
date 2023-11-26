import { TestBed } from '@angular/core/testing';

import { SellerOnlyGuard } from './seller-only.guard';

describe('SellerOnlyGuard', () => {
  let guard: SellerOnlyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SellerOnlyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
