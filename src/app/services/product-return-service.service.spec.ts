import { TestBed } from '@angular/core/testing';

import { ProductReturnServiceService } from './product-return-service.service';

describe('ProductReturnServiceService', () => {
  let service: ProductReturnServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductReturnServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
