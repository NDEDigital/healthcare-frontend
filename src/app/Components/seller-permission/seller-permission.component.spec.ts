import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerPermissionComponent } from './seller-permission.component';

describe('SellerPermissionComponent', () => {
  let component: SellerPermissionComponent;
  let fixture: ComponentFixture<SellerPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerPermissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
