import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-become-a-seller',
  templateUrl: './become-a-seller.component.html',
  styleUrls: ['./become-a-seller.component.css'],
})
export class BecomeASellerComponent {
  companyResistrationForm!: FormGroup;
  // payment
  paymentMethods: string[] = ['Credit Card', 'Cash', 'Mobile Banking'];
  bankData: any = [];
  mobileBankingData: any = [];
  selectedPaymentMethod: string = 'Nothing Selected'; // Variable to hold the selected payment method
  showBankingInfo: boolean = false; // Variable to control the visibility of banking information fields
  showMobileBankingInfo: boolean = false;
  constructor(private userData: UserDataService) {}

  ngOnInit() {
    this.companyResistrationForm = new FormGroup({
      companyName: new FormControl('', Validators.required),
      companyFoundationDate: new FormControl('', Validators.required),
      businessRegNum: new FormControl('', Validators.required),
      taxIdntificationNum: new FormControl('', Validators.required),
      tradeLicence: new FormControl('', Validators.required),
      companyLogo: new FormControl('', Validators.required),
      prefPaymentMethod: new FormControl('', Validators.required),
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
    // If 'Credit Card' is selected, show banking information fields
    this.showBankingInfo = this.selectedPaymentMethod == 'Credit Card';
    if (this.showBankingInfo) {
      this.bankdata();
    }

    this.showBankingInfo = this.selectedPaymentMethod == 'Mobile Banking';
    if (this.showBankingInfo) {
      this.MobileBankingdata();
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
}
