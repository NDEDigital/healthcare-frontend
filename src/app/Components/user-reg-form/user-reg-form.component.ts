import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-user-reg-form',
  templateUrl: './user-reg-form.component.html',
  styleUrls: ['./user-reg-form.component.css'],
})
export class UserRegFormComponent {
  @ViewChild('userExistModalBTN') UserExistModalBTN!: ElementRef;
  userResistrationForm!: FormGroup;
  alertTitle: string = '';
  alertMsg: string = '';
  user: any;

  constructor(
    private userData: UserDataService,
    private sharedServiceData: SharedService,
    private router: Router
  ) {}
  ngOnInit() {
    this.userResistrationForm = new FormGroup(
      {
        trade: new FormControl('Buyer', Validators.required),
        fullName: new FormControl('', Validators.required),
        phoneNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]*'),
          Validators.minLength(11),
          Validators.maxLength(11),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),
        ]),
        confirmPassword: new FormControl('', Validators.required),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          ),
        ]),

        address: new FormControl(''),
        companyCode: new FormControl(''),
      },
      { validators: this.passwordMatchValidator }
    );
    // Add or remove the 'required' validator for companyCode based on the trade value
    this.userResistrationForm
      .get('trade')
      ?.valueChanges.subscribe((tradeValue) => {
        const companyCodeControl = this.userResistrationForm.get('companyCode');
        if (tradeValue === 'Seller') {
          companyCodeControl?.setValidators([Validators.required]);
        } else {
          companyCodeControl?.clearValidators();
        }
        companyCodeControl?.updateValueAndValidity();
      });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      // console.log('  Password and Confirm Password must match.');
      return { passwordMismatch: true };
    } else {
      control.get('confirmPassword')?.setErrors(null);
      // console.log('Password and Confirm Password matched!');
      return null;
    }
  }
  isFieldInvalid(fieldName: string): boolean {
    const field = this.userResistrationForm.get(fieldName);
    // Check if the field is not null before accessing its properties
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getPhoneNumberErrorMessage() {
    const phoneControl = this.userResistrationForm.get('phone');
    if (phoneControl?.hasError('required')) {
      return 'Phone number is required.';
    } else if (phoneControl?.hasError('pattern')) {
      return 'Invalid phone number format.';
    } else if (phoneControl?.hasError('minlength')) {
      return 'Phone number must be at least 11 digits.';
    } else if (phoneControl?.hasError('maxlength')) {
      return 'Phone number cannot exceed 11 digits.';
    }

    return ''; // Default empty message
  }
  getPasswordErrorMessage() {
    const passwordControl = this.userResistrationForm.get('password');

    if (passwordControl?.hasError('required')) {
      // console.log('Password is required');
      return 'Password is required';
    } else if (passwordControl?.hasError('minlength')) {
      // console.log('minLength');
      return 'Password Should be at least 8';
    } else if (passwordControl?.hasError('maxlength')) {
      // console.log('maxLength');

      return 'Password can be at the max 15 characters long';
    }

    return ''; // Default empty message
  }

  onSubmit(): void {
    Object.values(this.userResistrationForm.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
      // console.log(control);
    });
    if (this.userResistrationForm.valid) {
      const formData = {
        ...this.userResistrationForm.value,
        isBuyer:
          this.userResistrationForm.value.trade === 'Buyer' ? true : false,
        isSeller:
          this.userResistrationForm.value.trade === 'Seller' ? true : false,
        isAdmin: false,
      };
      delete formData.trade;
      delete formData.confirmPassword;
      if (this.userResistrationForm.value.trade === 'Buyer') {
        delete formData.companyCode;
      }
      console.log('Form Data:', formData);

      this.user = formData;
      this.userData.createUser(this.user).subscribe({
        next: (response: any) => {
          // this.sharedServiceData.updateLoginStatus(
          //   true,
          //   response.userId,
          //   response.role
          // );
          console.log(response, 'done');
          this.alertTitle = 'Successfull!!';
          this.alertMsg = response.message;
          this.UserExistModalBTN.nativeElement.click();
          // if (response.role === 'buyer') {
          //   this.router.navigate(['/']);
          // } else this.router.navigate(['/dashboard']);
          // this.sharedServiceData.loggedInUserInfo(response.user);

          // window.location.href = '';
        },
        error: (error: any) => {
          console.log(error);
          this.alertTitle = 'Error!!';
          this.alertMsg = error.error.message;

          this.UserExistModalBTN.nativeElement.click();
        },
      });
    }
  }
}
