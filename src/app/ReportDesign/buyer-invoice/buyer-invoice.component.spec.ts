import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerInvoiceComponent } from './buyer-invoice.component';

describe('BuyerInvoiceComponent', () => {
  let component: BuyerInvoiceComponent;
  let fixture: ComponentFixture<BuyerInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
