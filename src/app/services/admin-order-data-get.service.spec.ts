import { TestBed } from '@angular/core/testing';

import { AdminOrderDataGetService } from './admin-order-data-get.service';

describe('AdminOrderDataGetService', () => {
  let service: AdminOrderDataGetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminOrderDataGetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
