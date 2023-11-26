import { TestBed } from '@angular/core/testing';
import { GoodsDataService } from './goods-data.service';

describe('GoodsDataService', () => {
  let service: GoodsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoodsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
