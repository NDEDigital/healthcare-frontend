import { TestBed } from '@angular/core/testing';

import { AdminSellerOnlyGuard } from './admin-seller-only.guard';

describe('AdminSellerOnlyGuard', () => {
  let guard: AdminSellerOnlyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminSellerOnlyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
