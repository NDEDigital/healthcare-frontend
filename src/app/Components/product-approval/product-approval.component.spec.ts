import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductApprovalComponent } from './product-approval.component';

describe('ProductApprovalComponent', () => {
  let component: ProductApprovalComponent;
  let fixture: ComponentFixture<ProductApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
