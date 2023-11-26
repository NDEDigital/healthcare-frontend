import { TestBed } from '@angular/core/testing';

import { SslPaymentService } from './ssl-payment.service';

describe('SslPaymentService', () => {
  let service: SslPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SslPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
