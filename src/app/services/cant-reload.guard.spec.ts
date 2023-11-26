import { TestBed } from '@angular/core/testing';

import { CantReloadGuard } from './cant-reload.guard';

describe('CantReloadGuard', () => {
  let guard: CantReloadGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CantReloadGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
