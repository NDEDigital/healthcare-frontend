import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AddProductService } from 'src/app/services/add-product.service';

@Component({
  selector: 'app-add-price-discounts',
  templateUrl: './add-price-discounts.component.html',
  styleUrls: ['./add-price-discounts.component.css'],
})
export class AddPriceDiscountsComponent {
  @ViewChild('ProductImageInput') ProductImageInput!: ElementRef;
  @ViewChild('prdouctExistModalBTN') PrdouctExistModalBTN!: ElementRef;

  addPriceDiscountForm!: FormGroup;
  products: any[] = [];
  isDisabled: boolean = true;
  alertMsg: string = '';
  isError: boolean = false;

  constructor(private productService: AddProductService) {}

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addPriceDiscountForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  ngOnInit() {
    this.addPriceDiscountForm = new FormGroup({
      productId: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      discountAmount: new FormControl(''),
      discountPct: new FormControl(''),
      effectivateDate: new FormControl(''),
      endDate: new FormControl(''),
      productImage: new FormControl('', Validators.required),
      totalPrice: new FormControl(''),
    });

    // Fetch product groups when the component is initialized
    // this.getProductGroups();
    this.addPriceDiscountForm
      .get('discountAmount')
      ?.valueChanges.subscribe(() => {});

    this.setupFormValueChanges();
    this.getProducts();
  }

  getProducts() {
    this.productService.getallProducts().subscribe(
      (data: any) => {
        this.products = data;
        console.log('Products :', this.products);
      },
      (error) => {
        console.error('Error fetching product groups:', error);
      }
    );
  }

  setupFormValueChanges() {
    const form = this.addPriceDiscountForm;

    // For Discount Amount and Percentage
    form.get('discountAmount')?.valueChanges.subscribe((value) => {
      this.calculateDiscountPct(value, 'amount');
    });
    form.get('discountPct')?.valueChanges.subscribe((value) => {
      this.calculateDiscountAmount(value, 'percentage');
    });

    // For dynamically setting validators
    const discountAmountControl = form.get('discountAmount');
    const discountPctControl = form.get('discountPct');

    discountAmountControl?.valueChanges.subscribe(() => {
      this.updateDateFieldValidators();
    });

    discountPctControl?.valueChanges.subscribe(() => {
      this.updateDateFieldValidators();
    });
  }


  updateDateFieldValidators() {
    const discountAmount = this.addPriceDiscountForm.get('discountAmount')?.value;
    const discountPct = this.addPriceDiscountForm.get('discountPct')?.value;

    const effectivateDateControl = this.addPriceDiscountForm.get('effectivateDate');
    const endDateControl = this.addPriceDiscountForm.get('endDate');

    if (discountAmount || discountPct) {
      effectivateDateControl?.setValidators([Validators.required, this.presentOrFutureDateValidator()]);
      endDateControl?.setValidators([Validators.required, this.futureDateValidator()]);
    } else {
      effectivateDateControl?.clearValidators();
      endDateControl?.clearValidators();
    }

    effectivateDateControl?.updateValueAndValidity();
    endDateControl?.updateValueAndValidity();
  }



  presentOrFutureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Reset time part to compare only date

      return selectedDate >= currentDate ? null : { invalidDate: true };
    };
  }

  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const endDate = new Date(control.value);
      const effectiveDate = new Date(this.addPriceDiscountForm.get('effectivateDate')?.value);

      return endDate > effectiveDate ? null : { invalidEndDate: true };
    };
  }

  calculateDiscountPct(value: any, source: string) {
    if (source === 'amount') {
      const price =
        parseFloat(this.addPriceDiscountForm.get('price')?.value) || 0;
      const discountAmount = parseFloat(value) || 0;
      const discountPct = price !== 0 ? (discountAmount / price) * 100 : 0;
      this.addPriceDiscountForm
        .get('discountPct')
        ?.setValue(discountPct.toFixed(2), { emitEvent: false });
    }
    this.calculateTotalPrice();
  }

  calculateDiscountAmount(value: any, source: string) {
    if (source === 'percentage') {
      const price =
        parseFloat(this.addPriceDiscountForm.get('price')?.value) || 0;
      const discountPct = parseFloat(value) || 0;
      const discountAmount = (discountPct / 100) * price;
      this.addPriceDiscountForm
        .get('discountAmount')
        ?.setValue(discountAmount.toFixed(2), { emitEvent: false });
    }
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    const price =
      parseFloat(this.addPriceDiscountForm.get('price')?.value) || 0;
    let discountAmount = parseFloat(
      this.addPriceDiscountForm.get('discountAmount')?.value
    );
    let discountPct = parseFloat(
      this.addPriceDiscountForm.get('discountPct')?.value
    );

    // Check if discountAmount and discountPct are NaN, set them to 0 if they are
    discountAmount = isNaN(discountAmount) ? 0 : discountAmount;
    discountPct = isNaN(discountPct) ? 0 : discountPct;

    let calculatedDiscount = 0;

    if (price > 0) {
      if (discountAmount > 0) {
        // Calculate and update discount percentage if discount amount is provided
        discountPct = (discountAmount / price) * 100;
        this.addPriceDiscountForm
          .get('discountPct')
          ?.setValue(discountPct.toFixed(2), { emitEvent: false });
        calculatedDiscount = discountAmount;
      } else if (discountPct > 0) {
        // Calculate and update discount amount if discount percentage is provided
        calculatedDiscount = (price * discountPct) / 100;
      }
    }

    const totalPrice = Math.max(price - calculatedDiscount, 0); // Total price should not be negative
    this.addPriceDiscountForm
      .get('totalPrice')
      ?.setValue(totalPrice.toFixed(2), { emitEvent: false });
  }

  onSubmit(): void {
    Object.values(this.addPriceDiscountForm.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
    });

    if (this.addPriceDiscountForm.valid) {
      // Create FormData object
      const formData = new FormData();

      Object.keys(this.addPriceDiscountForm.value).forEach((key) => {
        let value = this.addPriceDiscountForm.value[key];

        if (key === 'discountAmount' || key === 'discountPct') {
          // Check if the value is a valid number
          const numberValue = parseFloat(value);
          if (!isNaN(numberValue)) {
            // Convert valid numbers to string with two decimal places
            value = numberValue.toFixed(2);
          } else {
            // If value is not a number, use a default value (e.g., '0.00') or skip appending
            value = '0.00';
          }
        }

        if (key === 'productId' || key === 'userId') {
          value = String(Math.floor(Number(value)));
          console.log(value);
        }

        if (
          key === 'price' ||
          key === 'discountAmount' ||
          key === 'discountPct'
        ) {
          value = parseFloat(value).toFixed(2);
        }
        formData.append(key, value);
      });

      formData.append(
        'imageFile',
        this.ProductImageInput.nativeElement.files[0]
      );

      // Append additional fields
      formData.append('addedBy', 'user');
      formData.append('addedPC', '0.0.0.0');

      let userID = localStorage.getItem('code');
      if (userID) {
        formData.append('userId', userID);
      }
      formData.append('companyCode', 'companyCode');

      for (let pair of (formData as any).entries()) {
        console.log(`${pair[0]}: `, pair[1]);
      }

      this.productService.createSellerProductPrice(formData).subscribe({
        next: (response: any) => {
          console.log(response);
          this.alertMsg = response.message;
          this.isError = false; // Set isError to false for a success message
          this.PrdouctExistModalBTN.nativeElement.click();
          this.addPriceDiscountForm.reset();
        },
        error: (error: any) => {
          console.log(error);
          this.alertMsg = error.error.message;
          this.isError = true; // Set isError to true for an error message
          this.PrdouctExistModalBTN.nativeElement.click();
        },
      });
    } else {
      console.log('Form is not valid');
    }
  }
}
