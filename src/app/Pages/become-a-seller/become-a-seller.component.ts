import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/services/company.service';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-become-a-seller',
  templateUrl: './become-a-seller.component.html',
  styleUrls: ['./become-a-seller.component.css'],
})
export class BecomeASellerComponent {
  @ViewChild('userExistModalBTN') UserExistModalBTN!: ElementRef;
  @ViewChild('CompanyImageInput') CompanyImageInput!: ElementRef;
  @ViewChild('TradeLicenseInput') TradeLicenseInput!: ElementRef;

  maxDate: any; // Add this variable
  compnay: any;
  alertTitile: string = 'alertTitile';
  alertmsg: string = 'alertmsg';
  companyResistrationForm!: FormGroup;
  modalColor: boolean = false;
  // payment
  paymentMethods: any;
  bankInfo: any;
  // selectedPaymentMethod: string = 'Nothing Selected'; // Variable to hold the selected payment method
  showBankingInfo: boolean = false; // Variable to control the visibility of banking information fields
  showMobileBankingInfo: boolean = false;

  constructor(
    private companyService: CompanyService,
    private emailService: EmailService) {}

  ngOnInit() {

        // Set maxDate to the current date in 'YYYY-MM-DD' format
        const currentDate = new Date();
        this.maxDate = currentDate.toISOString().split('T')[0];
    
    this.companyResistrationForm = new FormGroup({
      companyName: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
      ]),
      companyFoundationDate: new FormControl('', Validators.required),
      businessRegistrationNumber: new FormControl('', Validators.required),
      taxIdentificationNumber: new FormControl('', Validators.required),
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
        //console.log(response);
        this.paymentMethods = response;
        //console.log(this.paymentMethods);
      },
      error: (error: any) => {
        //console.log(error);
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
    });

    const formData = new FormData();

    // Append values to formData
    Object.entries(this.companyResistrationForm.value).forEach(
      ([key, value]) => {
        if (value instanceof File) {
          // Append file with its original name
          formData.append(key, value, value.name);
        } else {
          formData.append(key, String(value));
        }
      }
    );

    // Append additional values
    formData.append('AddedBy', 'user');
    formData.append('AddedPC', '0.0.0.0');
    formData.append(
      'companyImageFile',
      this.CompanyImageInput.nativeElement.files[0]
    );
    formData.append(
      'tradeLicenseFile',
      this.TradeLicenseInput.nativeElement.files[0]
    );
    formData.forEach((value, key) => {
      console.log("company data",key, value);
    });

    if (
      this.companyResistrationForm.valid &&
      this.companyResistrationForm.get('preferredPaymentMethodID')?.value > 0
    ) {
      //console.log('valid');

      this.companyService.createCompany(formData).subscribe({
        next: (response: any) => {
          //console.log(response);
          this.companyResistrationForm.reset();
          this.ngOnInit();
          this.alertTitile = response.message;
          this.alertmsg =
            'Your company is Registered! Wait for the approval mail for further, Thank you.';
          this.modalColor = true;
          this.UserExistModalBTN.nativeElement.click();

          this.sendEmailToCompany(formData.get('companyName'), formData.get('email'));
        },
        error: (error: any) => {
          //console.log(error);

          this.alertTitile = error.error.message;
          this.alertmsg =
            'The information you gave is already registered! Please try login or recheck your informations!';
          this.UserExistModalBTN.nativeElement.click();
        },
      });
    }
  }



  // company mail
  sendEmailToCompany(companyname: any, mail: any) {
    let sub = "Company Registration - Admin Approval Pending";
    // You can customize the email message to include companyId, max users, and admin info
    let message = `
    Dear Concern,
    
    Thank you for registering with ${companyname}. We have received your company registration details, and we appreciate your interest in joining our platform.

    Please be informed that your registration is currently pending approval from our administration team. This process ensures the quality and authenticity of companies on our platform.
    
    Here are the next steps:
    
    1. **Approval Process:** Our administration team will review your registration details shortly.
    
    2. **Notification:** Once your registration is approved, you will receive a confirmation email with further instructions on how to proceed.
    
    In the meantime, if you have any urgent inquiries or if you believe there might be an issue with your registration, please feel free to contact our support team at ndedigitalmarket@gmail.com.
    
    Thank you for your patience and understanding. We look forward to having your company on board with us.

    Best regards,

    Nimpex HealthCare
    `;
    this.emailService
      .sendEmail(mail, sub, message)
      .subscribe({
        next: (response: any) => {
          //console.log(response);
          // Handle success
        },
        error: (error: any) => {
          //console.log(error);
          // Handle error
        },
      });
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
        //console.log(response);
        this.bankInfo = response;
        //console.log(this.bankInfo);
      },
      error: (error: any) => {
        //console.log(error);
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
  //         //console.log(response);
  //         // Handle success
  //       },
  //       error: (error: any) => {
  //         //console.log(error);
  //         // Handle error
  //       },
  //     });
  // }
}
