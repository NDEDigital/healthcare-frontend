import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaxQuantityProductsSliderComponent } from './max-quantity-products-slider.component';

describe('MaxQuantityProductsSliderComponent', () => {
  let component: MaxQuantityProductsSliderComponent;
  let fixture: ComponentFixture<MaxQuantityProductsSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaxQuantityProductsSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaxQuantityProductsSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
