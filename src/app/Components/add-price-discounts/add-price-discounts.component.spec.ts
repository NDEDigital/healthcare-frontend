import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPriceDiscountsComponent } from './add-price-discounts.component';

describe('AddPriceDiscountsComponent', () => {
  let component: AddPriceDiscountsComponent;
  let fixture: ComponentFixture<AddPriceDiscountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPriceDiscountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPriceDiscountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
