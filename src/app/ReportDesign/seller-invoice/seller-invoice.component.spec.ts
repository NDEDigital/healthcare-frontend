import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerInvoiceComponent } from './seller-invoice.component';

describe('SellerInvoiceComponent', () => {
  let component: SellerInvoiceComponent;
  let fixture: ComponentFixture<SellerInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
