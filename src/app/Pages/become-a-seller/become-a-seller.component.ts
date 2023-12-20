import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmailService } from 'src/app/services/email.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-become-a-seller',
  templateUrl: './become-a-seller.component.html',
  styleUrls: ['./become-a-seller.component.css'],
})
export class BecomeASellerComponent {
  companyResistrationForm!: FormGroup;
  // payment
  paymentMethods: string[] = ['Cash', 'Credit Card', 'Mobile Banking'];
  bankData: any = [];
  mobileBankingData: any = [];
  // selectedPaymentMethod: string = 'Nothing Selected'; // Variable to hold the selected payment method
  showBankingInfo: boolean = false; // Variable to control the visibility of banking information fields
  showMobileBankingInfo: boolean = false;
  constructor(
    private userData: UserDataService,
    private emailService: EmailService
  ) {}

  ngOnInit() {
    this.companyResistrationForm = new FormGroup({
      companyName: new FormControl('', Validators.required),
      companyFoundationDate: new FormControl('', Validators.required),
      businessRegNum: new FormControl('', Validators.required),
      taxIdntificationNum: new FormControl('', Validators.required),
      tradeLicence: new FormControl('', Validators.required),
      companyLogo: new FormControl('', Validators.required),
      prefPaymentMethod: new FormControl('Cash', Validators.required),
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
  }

  // payment
  onPaymentMethodChange() {
    // this.showBankingInfo = true;

    // if (this.selectedPaymentMethod === 'Credit Card') {
    //   this.bankdata();
    // } else if (this.selectedPaymentMethod === 'Mobile Banking') {
    //   this.MobileBankingdata();
    // } else {
    //   this.showBankingInfo = false;
    // }

    this.showBankingInfo = true;

    if (
      this.companyResistrationForm.get('prefPaymentMethod')?.value ===
      'Credit Card'
    ) {
      this.bankdata();
    } else if (
      this.companyResistrationForm.get('prefPaymentMethod')?.value ===
      'Mobile Banking'
    ) {
      this.MobileBankingdata();
    } else {
      this.showBankingInfo = false;
    }
  }

  // get bank data
  bankdata() {
    this.userData.GetBankdata().subscribe((data: any) => {
      console.log(' GetBankdata dataaaaaa ', data); // Use a type if possible for better type checking
      this.bankData = data;
    });
  }
  // get MobileBanking data
  MobileBankingdata() {
    this.userData.GetMobileBankingdata().subscribe((data: any) => {
      console.log(' GetMobileBankingdata dataaaaaa ', data); // Use a type if possible for better type checking
      this.mobileBankingData = data;
    });
  }

  sendEmailToCompany(email: any, companyId: any) {
    // You can customize the email message to include companyId, max users, and admin info
    const message = `Thank you for registering your company! Your Company ID is ${companyId}. 
   You can add up to X users as sellers, and the first added user will be the Company Admin.`;

    this.emailService
      .sendEmail(email, 'Company Registration Successful', message)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          // Handle success
        },
        error: (error: any) => {
          console.log(error);
          // Handle error
        },
      });
  }
}
