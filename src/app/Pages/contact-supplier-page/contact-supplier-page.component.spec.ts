import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSupplierPageComponent } from './contact-supplier-page.component';

describe('ContactSupplierPageComponent', () => {
  let component: ContactSupplierPageComponent;
  let fixture: ComponentFixture<ContactSupplierPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactSupplierPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactSupplierPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
