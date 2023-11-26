import { TestBed } from '@angular/core/testing';

import { BuyerOnlyGuard } from './buyer-only.guard';

describe('BuyerOnlyGuard', () => {
  let guard: BuyerOnlyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BuyerOnlyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
