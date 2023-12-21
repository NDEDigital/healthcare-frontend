import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductQuantityComponent } from './add-product-quantity.component';

describe('AddProductQuantityComponent', () => {
  let component: AddProductQuantityComponent;
  let fixture: ComponentFixture<AddProductQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductQuantityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
