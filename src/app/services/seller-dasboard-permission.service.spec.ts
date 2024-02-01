import { TestBed } from '@angular/core/testing';

import { SellerDasboardPermissionService } from './seller-dasboard-permission.service';

describe('SellerDasboardPermissionService', () => {
  let service: SellerDasboardPermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellerDasboardPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
