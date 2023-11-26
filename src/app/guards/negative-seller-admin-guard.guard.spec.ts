import { TestBed } from '@angular/core/testing';

import { NegativeSellerAdminGuardGuard } from './negative-seller-admin-guard.guard';

describe('NegativeSellerAdminGuardGuard', () => {
  let guard: NegativeSellerAdminGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NegativeSellerAdminGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
