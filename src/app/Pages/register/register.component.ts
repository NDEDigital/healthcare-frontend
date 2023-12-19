import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormGroup,
  ValidationErrors,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { firebaseConfig } from 'src/app/environment/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements AfterViewInit {
  @ViewChild('otpModalBtn') otpModalBtn!: ElementRef;
  @ViewChild('closeOTPModal') closeOTPModal!: ElementRef;
  @ViewChild('capcha_container') capcha_container!: ElementRef;
  userForm: FormGroup;
  // isError: boolean = false;
  // flag: string = '';
  @ViewChild('userExistModalBTN') UserExistModalBTN!: ElementRef;
   // payment 
  @ViewChild('PaymentInfo', { static: false }) PaymentInfo!: ElementRef;
  alertMsg: string = '';
  phoneNumber = '***********';
  recaptchaVerifier!: RecaptchaVerifier | null;
  code!: string;
  validateOtp: any;
  userExist = true;
  user: any;


  // payment 
  paymentMethods: string[] = ['Credit Card', 'Cash','Mobile Banking'];
  bankData:any = [];
  mobileBankingData:any = [];
  selectedPaymentMethod: string = 'Nothing Selected'; // Variable to hold the selected payment method
  showBankingInfo: boolean = false; // Variable to control the visibility of banking information fields
  showMobileBankingInfo: boolean = false;
  //  Otp Related
  otpValue: number | null = null;
  error = false;
  wrongOTP = false;
  remainingTime = 0;
  enableResendBTN = false;
  reset: boolean = false;
  widgetId: number = 0;

  constructor(
    private userData: UserDataService,
    private sharedServiceData: SharedService,
    private router: Router
  ) {
    initializeApp(firebaseConfig);
    this.userForm = new FormGroup(
      {
        trade: new FormControl('Buyer', Validators.required),
        fullName: new FormControl('', Validators.required),
        phone: new FormControl('', [
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
        email: new FormControl('', Validators.required),
        address: new FormControl(''),
        companyName: new FormControl(''),
        website: new FormControl(''),
        productCategory: new FormControl('Nothing Selected'),
        companyFoundationDate: new FormControl(''),

        businessRegNum: new FormControl(''),
        taxIdNum: new FormControl(''),

        // payment
        prefPaymentMethod: new FormControl('Nothing Selected'),
        //bank
        bankId: new FormControl(''),
        bankAccountNo: new FormControl(''),
        bankHolderName: new FormControl(''),
        // mbl
        MobileBankingTypeId: new FormControl(''),
        MobileBankingNo: new FormControl(''),
      },
      { validators: this.passwordMatchValidator }
    );
  }
  ngAfterViewInit() {
    // this.captchaVerify();
    // const otpResend = sessionStorage.getItem('OTPresend');
    // if (otpResend === 'true') {
    //   sessionStorage.setItem('OTPresend', 'false');
    //   if (this.otpModalBtn) {
    //     this.otpModalBtn.nativeElement.click();
    //   }
    //   this.initializeTimer();
    // }

     // Scroll to the banking info element

    //  console.log('showBankingInfo:', this.showBankingInfo); // Check if this is true
    //  console.log('PaymentInfo:', this.PaymentInfo); // Check if this is defined
    //  if (this.showBankingInfo ) {
    //   this.PaymentInfo.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // }
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
  onRegisterClick() {
    Object.values(this.userForm.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
      // console.log(control);
    });

    if (this.userForm.invalid) {
      // console.log('invalid');
      return;
    }
    this.user = {
      counteryRegion: 'Bangladesh',
      isBuyer: this.userForm.value.trade === 'Buyer' ? true : false,
      isSeller: this.userForm.value.trade === 'Seller' ? true : false,
      // isBoth: this.userForm.value.trade === 'Both' ? true : false,
      fullName:
        this.userForm.value.fullName === ''
          ? false
          : this.userForm.value.fullName,
      phoneNumber:
        this.userForm.value.phone === '' ? false : this.userForm.value.phone,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      address: this.userForm.value.address,
      companyName: this.userForm.value.companyName,

      website: this.userForm.value.website,
      productCategory: this.userForm.value.productCategory,
      companyFoundationDate: this.userForm.value.companyFoundationDate,
      businessRegistrationNumber: this.userForm.value.businessRegNum,
      taxIDNumber: this.userForm.value.taxIdNum,

      preferredPaymentMethod: this.userForm.value.prefPaymentMethod,
      bankId: this.userForm.value.bankId,
      bankAccountNo: this.userForm.value.bankAccountNo,
      bankHolderName: this.userForm.value.bankHolderName,
      MobileBankingTypeId: this.userForm.value.MobileBankingTypeId,
      MobileBankingNo: this.userForm.value.MobileBankingNo,
    };
    console.log(this.user);

    if (this.userForm.valid) {
      this.userData.UserExist(this.user).subscribe({
        next: (response: any) => {
          setTimeout(() => {
            this.userExist = response.userExist;
            console.log(response);
            if (this.userExist) {
              this.alertMsg = 'User already exists';
              this.UserExistModalBTN.nativeElement.click();
            } else {
              console.log(this.userExist);
              this.captchaVerify();
            }
          }, 100);
        },
        error: (error: any) => {
          console.log(error);
          //  alert(error.error.message);
          // this.alertMsg = error.error.message;
          // this.UserExistModalBTN.nativeElement.click();
        },
      });
    }
   // console.log(userData);

    // this.cdr.detectChanges();
  }

  captchaVerify() {
    if (this.recaptchaVerifier) {
      console.log(this.recaptchaVerifier,"before");
      this.recaptchaVerifier.clear();
      console.log(this.recaptchaVerifier, 'after1');
      this.recaptchaVerifier = null;
        console.log(this.recaptchaVerifier, 'after2');
    }
    const auth = getAuth();
    this.capcha_container.nativeElement.clear;
    this.recaptchaVerifier = new RecaptchaVerifier(auth, 'capcha_container', {
      size: 'invisible',
      callback: (response: any) => {
        this.matchOtp(auth);
      },
    });

    this.recaptchaVerifier.render().then((widgetId: number) => {
      this.widgetId = widgetId;
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.verify();
      }
    });
  }

  matchOtp(auth: any) {
    console.log('inside matchOtp', this.userForm.value.phone);

    signInWithPhoneNumber(
      auth,
     // '+8801521451381',
       '+88' + this.userForm.value.phone,
      this.recaptchaVerifier!
    )
      .then((confirmationResult) => {
        this.validateOtp = confirmationResult;
        this.phoneNumber =
          '*'.repeat(this.userForm.value.phone.length - 4) +
          this.userForm.value.phone.slice(-4);
        if (!this.reset) {
          this.otpModalBtn.nativeElement.click();
        }
      })
      .catch((error) => {
        console.log(error.code,"code send error");

      });
  }

  verifyOTP() {
    console.log(this.otpValue, 'inside');

    if (this.otpValue !== null && this.otpValue.toString().length === 6) {
      this.error = false;
      console.log('OTP:', this.otpValue);
      this.validateOtp
        .confirm(this.otpValue)
        .then(() => {
          this.userData.createUser(this.user).subscribe({
            next: (response: any) => {
              this.sharedServiceData.updateLoginStatus(
                true,
                response.encryptedUserCode,
                response.role
              );
              console.log(response, 'done');

              this.closeOTPModal.nativeElement.click();

              if (response.role === 'buyer') {
                this.router.navigate(['/']);
              } else this.router.navigate(['/dashboard']);
              // this.sharedServiceData.loggedInUserInfo(response.user);

              console.log(this.userForm.value.phone, 'create');

              // window.location.href = '';
            },
            error: (error: any) => {
              // console.log(error);
            },
          });
        })
        .catch((error: any) => {
          //  this.router.navigate(['/register']);
          console.log(error);
          this.wrongOTP = true;
        });
    } else {
      this.error = true;
    }
  }

  isFieldInvalid(fieldName: string) {
    const field = this.userForm.get(fieldName);
    return field?.invalid && field.touched && field.dirty;
  }
  getPhoneNumberErrorMessage() {
    const phoneControl = this.userForm.get('phone');
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
    const passwordControl = this.userForm.get('password');

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

  getContainerWidth(): { [key: string]: string } {
    const tradeValue = this.userForm.get('trade')?.value;
    const containerWidth =
      tradeValue === 'Seller' || tradeValue === 'Both' ? '700px' : '450px';
    // console.log('Container Width:', containerWidth);

    return { width: containerWidth };
  }

  onInput(event: any) {
    let inputValue = event.target.value;
    if (inputValue.toString().length > 6) {
      inputValue = inputValue.substring(0, 6);
      event.target.value = inputValue.substring(0, 6);
    }
    if (this.otpValue != null) this.otpValue = parseInt(inputValue); // Convert the value to a number
  }
  initializeTimer() {
    // this.phoneNumber =
    //   '*'.repeat(11 - 4) +
    //   '01745671968'.slice(-4);
    this.remainingTime = 30;
    this.startTimer();
  }

  startTimer() {
    console.log('start timer');

    const interval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        console.log('clearInterval');
        clearInterval(interval);
        this.enableResendBTN = true;
      }
      //  console.log(this.remainingTime, 'this.remainingTime');
    }, 1000);
  }
  secondsToMinutesAndSeconds(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = seconds % 60;

    return `${minutes}:${secondsRemaining.toString().padStart(2, '0')}`;
  }
  resendOTP() {
    // event.stopPropagation();
    this.error = false;
    this.wrongOTP = false;
    this.otpValue = null;
    this.enableResendBTN = false;
    this.reset = true;
    this.remainingTime = 30;
    this.startTimer();
    this.matchOtp(getAuth());
    // console.log('resend otp');

    // console.log(this.recaptchaVerifier);
    // // sessionStorage.setItem('OTPresend', 'true');

    // console.log(this.recaptchaVerifier);

    // signInWithPhoneNumber(
    //   getAuth(),
    //   '+8801745671968',
    //   // '+88' + this.userForm.value.phone,
    //   this.recaptchaVerifier
    // )
    //   .then((confirmationResult) => {
    //     this.validateOtp = confirmationResult;
    //     this.phoneNumber =
    //       '*'.repeat(this.userForm.value.phone.length - 4) +
    //       this.userForm.value.phone.slice(-4);
    //
    //   })
    //   .catch((error) => {
    //     console.log(error.code, 'inside resend');
    //   });



  }

  onPaymentMethodChange() {
    // If 'Credit Card' is selected, show banking information fields
    this.showBankingInfo = this.selectedPaymentMethod == 'Credit Card';
    if(this.showBankingInfo){
      this.bankdata();
      
    }

    this.showMobileBankingInfo = this.selectedPaymentMethod == 'Mobile Banking';
    if(this.showMobileBankingInfo){
      this.MobileBankingdata();
    }
 
  }

  // get bank data 
  bankdata(){
    this.userData
    .GetBankdata()
    .subscribe((data: any) => {
      console.log(' GetBankdata dataaaaaa ', data); // Use a type if possible for better type checking
       this.bankData = data;
    });
   
  }
    // get MobileBanking data 
    MobileBankingdata(){
      this.userData
      .GetMobileBankingdata()
      .subscribe((data: any) => {
        console.log(' GetMobileBankingdata dataaaaaa ', data); // Use a type if possible for better type checking  
        this.mobileBankingData = data;
      });
    }


}
