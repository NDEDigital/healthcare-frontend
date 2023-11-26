import { TestBed } from '@angular/core/testing';

import { NegativeAuthGuard } from './negative-auth.guard';

describe('NegativeAuthGuard', () => {
  let guard: NegativeAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NegativeAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
