import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/services/company.service';
import { EmailService } from 'src/app/services/email.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-become-a-seller',
  templateUrl: './become-a-seller.component.html',
  styleUrls: ['./become-a-seller.component.css'],
})
export class BecomeASellerComponent {
  @ViewChild('userExistModalBTN') UserExistModalBTN!: ElementRef;

  compnay: any;
  alertMsg: string = '';
  companyResistrationForm!: FormGroup;
  // payment
  paymentMethods: any;
  bankInfo: any;
  // selectedPaymentMethod: string = 'Nothing Selected'; // Variable to hold the selected payment method
  showBankingInfo: boolean = false; // Variable to control the visibility of banking information fields
  showMobileBankingInfo: boolean = false;
  constructor(
    private userData: UserDataService,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.companyResistrationForm = new FormGroup({
      companyName: new FormControl('', Validators.required),
      companyFoundationDate: new FormControl('', Validators.required),
      businessRegNum: new FormControl('', Validators.required),
      taxIdntificationNum: new FormControl('', Validators.required),
      tradeLicense: new FormControl('', Validators.required),
      companyImage: new FormControl('', Validators.required),
      preferredPaymentMethodID: new FormControl('3', Validators.required),
      bankNameID: new FormControl('0'),
      accountNumber: new FormControl(''),
      accountHolderName: new FormControl(''),
    });
    this.getData();
    this.companyResistrationForm
      .get('preferredPaymentMethodID')
      ?.valueChanges.subscribe((method) => {
        const bankNameIDControl =
          this.companyResistrationForm.get('bankNameID');
        const accountNumberControl =
          this.companyResistrationForm.get('accountNumber');
        const accountHolderNameControl =
          this.companyResistrationForm.get('accountHolderName');
        if (method !== '3') {
          bankNameIDControl?.setValidators([Validators.required]);
          accountNumberControl?.setValidators([Validators.required]);
          accountHolderNameControl?.setValidators([Validators.required]);
        } else {
          bankNameIDControl?.clearValidators();
          accountNumberControl?.clearValidators();
          accountHolderNameControl?.clearValidators();
        }
        bankNameIDControl?.updateValueAndValidity();
        accountNumberControl?.updateValueAndValidity();
        accountHolderNameControl?.updateValueAndValidity();
      });
  }
  getData() {
    this.companyService.getpayMethod().subscribe({
      next: (response: any) => {
        console.log(response);
        this.paymentMethods = response;
        console.log(this.paymentMethods);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  isFieldInvalid(fieldName: string): boolean {
    const field = this.companyResistrationForm.get(fieldName);
    // Check if the field is not null before accessing its properties
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit(): void {
    Object.values(this.companyResistrationForm.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
      // console.log(control);
    });
    const formData = this.companyResistrationForm.value; // Use the form value directly
    console.log('Form Data:', formData);

    if (
      this.companyResistrationForm.valid &&
      this.companyResistrationForm.get('preferredPaymentMethodID')?.value > 0
    ) {
      this.companyService.createUser(this.compnay).subscribe({
        next: (response: any) => {
          console.log(response);
        },
        error: (error: any) => {
          console.log(error);

          this.alertMsg = error.error.message;
          this.UserExistModalBTN.nativeElement.click();
        },
      });
    }
  }

  // payment

  getBankInfo() {
    this.companyResistrationForm.get('bankNameID')?.setValue('0');
    if (
      this.companyResistrationForm.get('preferredPaymentMethodID')?.value !==
      '3'
    ) {
      this.showBankingInfo = true;
    } else {
      this.showBankingInfo = false;
    }
    const methodID = this.companyResistrationForm.get(
      'preferredPaymentMethodID'
    )?.value;
    this.companyService.PreferredBankNames(methodID).subscribe({
      next: (response: any) => {
        console.log(response);
        this.bankInfo = response;
        console.log(this.bankInfo);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  // sendEmailToCompany(email: any, companyId: any) {
  //   // You can customize the email message to include companyId, max users, and admin info
  //   const message = `Thank you for registering your company! Your Company ID is ${companyId}.
  //  You can add up to X users as sellers, and the first added user will be the Company Admin.`;

  //   this.emailService
  //     .sendEmail(email, 'Company Registration Successful', message)
  //     .subscribe({
  //       next: (response: any) => {
  //         console.log(response);
  //         // Handle success
  //       },
  //       error: (error: any) => {
  //         console.log(error);
  //         // Handle error
  //       },
  //     });
  // }
}
