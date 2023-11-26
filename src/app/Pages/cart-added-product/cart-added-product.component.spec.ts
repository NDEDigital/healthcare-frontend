import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartAddedProductComponent } from './cart-added-product.component';

describe('CartAddedProductComponent', () => {
  let component: CartAddedProductComponent;
  let fixture: ComponentFixture<CartAddedProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartAddedProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartAddedProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
