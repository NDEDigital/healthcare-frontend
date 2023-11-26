import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoFocusOtpFieldComponent } from './auto-focus-otp-field.component';

describe('AutoFocusOtpFieldComponent', () => {
  let component: AutoFocusOtpFieldComponent;
  let fixture: ComponentFixture<AutoFocusOtpFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoFocusOtpFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoFocusOtpFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
