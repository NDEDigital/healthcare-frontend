import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
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
  showPriceProductDiv: boolean = false;
  productList: any;
  btnIndex = -1;
  selectedUnitName = '';


  onProductChange(event: any) {
    const productId = event.target.value;
    const selectedProduct = this.products.find(prod => prod.productId == productId);
    this.selectedUnitName = selectedProduct ? selectedProduct.unitName : '';
    console.log(this.selectedUnitName, "name");
    console.log(selectedProduct, "product");
    //console.log(productName, "Prod name");


}


  isDiscountEntered(): boolean {
    const discountAmount = parseFloat(
      this.addPriceDiscountForm.get('discountAmount')?.value
    );
    const discountPct = parseFloat(
      this.addPriceDiscountForm.get('discountPct')?.value
    );

    // Check if either discountAmount or discountPct is greater than 0
    return (
      (!isNaN(discountAmount) && discountAmount > 0) ||
      (!isNaN(discountPct) && discountPct > 0)
    );
  }

  toggleAddProductPriceDiv(): void {
    this.showPriceProductDiv = !this.showPriceProductDiv;
    this.addPriceDiscountForm.reset();
    this.btnIndex = -1;
    this.getProducts(-1);
  }
  getProducts(status: any) {
    let userID = localStorage.getItem('code');
    this.productService.GetProductsByStatus(userID, status).subscribe({
      next: (response: any) => {
        //console.log(response, 'get products');
        this.productList = response;
      },
      error: (error: any) => {
        //console.log(error);
        this.alertMsg = error.error.message;
      },
    });
  }
  showProductPriceGrid(): void {
    this.showPriceProductDiv = false;
  }

  constructor(private productService: AddProductService) {}

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addPriceDiscountForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  nonNegativeNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value !== null && !isNaN(value) && value >= 0
        ? null
        : { nonNegativeNumber: true };
    };
  }

  maxDiscountPctValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || control.value === '') {
        return null; // No error if the field is empty
      }

      const discountPct = parseFloat(control.value);
      return discountPct >= 0 && discountPct <= 100 ? null : { maxDiscountPct: true };
    };
  }



  ngOnInit() {
    this.addPriceDiscountForm = new FormGroup({
      productId: new FormControl('', Validators.required),
      price: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d*\.?\d+$/),
        this.nonNegativeNumberValidator(),
      ]),
      discountAmount: new FormControl('0.00', [
        Validators.pattern(/^\d*\.?\d+$/),
        this.nonNegativeNumberValidator(),
      ]),
      discountPct: new FormControl('0.00', [
        Validators.pattern(/^\d*\.?\d+$/),
        this.nonNegativeNumberValidator(),
        this.maxDiscountPctValidator(),
      ]),
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

    this.getProducts(-1);
    this.setupFormValueChanges();
    this.getProductList();
  }

  getProductList() {
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

  // setupFormValueChanges() {
  //   const form = this.addPriceDiscountForm;
  //   const priceControl = form.get('price');
  //   const discountAmountControl = form.get('discountAmount');
  //   const discountPctControl = form.get('discountPct');

  //   // Subscribe to changes in discount amount
  //   discountAmountControl?.valueChanges.subscribe((value) => {
  //     this.calculateDiscountPct(value);
  //     this.calculateTotalPrice();
  //   });

  //   // Subscribe to changes in discount percentage
  //   discountPctControl?.valueChanges.subscribe((value) => {
  //     this.calculateDiscountAmount(value);
  //     this.calculateTotalPrice();
  //   });

  //   // Subscribe to changes in Price
  //   priceControl?.valueChanges.subscribe(() => {
  //     this.calculateTotalPrice();
  //   });

  //   // For dynamically setting validators
  //   discountAmountControl?.valueChanges.subscribe(() => {
  //     this.updateDateFieldValidators();
  //   });

  //   discountPctControl?.valueChanges.subscribe(() => {
  //     this.updateDateFieldValidators();
  //   });
  // }

  // function maxDiscountAmountValidator(priceControl: FormControl): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const discountAmount = parseFloat(control.value);
  //     const price = parseFloat(priceControl.value);
  //     return discountAmount <= price ? null : { maxDiscountAmount: true };
  //   };
  // }

  // function maxDiscountPctValidator(): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const discountPct = parseFloat(control.value);
  //     return discountPct <= 100 ? null : { maxDiscountPct: true };
  //   };
  // }



  setupFormValueChanges() {
    const form = this.addPriceDiscountForm;
    const priceControl = form.get('price');
    const discountAmountControl = form.get('discountAmount');
    const discountPctControl = form.get('discountPct');

    // Subscribe to changes in discount amount
    discountAmountControl?.valueChanges.subscribe((value) => {
      this.calculateDiscountPct(value);
      this.calculateTotalPrice();
    });

    // Subscribe to changes in discount percentage
    discountPctControl?.valueChanges.subscribe((value) => {
      this.calculateDiscountAmount(value);
      this.calculateTotalPrice();
    });

    // Subscribe to changes in Price
    priceControl?.valueChanges.subscribe((value) => {
      if (value) {
        discountPctControl?.setValue('0', { emitEvent: false });
        discountAmountControl?.setValue('0', { emitEvent: false });
      }
      this.calculateTotalPrice();
    });

    // For dynamically setting validators
    discountAmountControl?.valueChanges.subscribe(() => {
      this.updateDateFieldValidators();
    });

    discountPctControl?.valueChanges.subscribe(() => {
      this.updateDateFieldValidators();
    });
  }

  updateDateFieldValidators() {
    const discountAmountValue =
      this.addPriceDiscountForm.get('discountAmount')?.value;
    const discountPctValue =
      this.addPriceDiscountForm.get('discountPct')?.value;

    const discountAmount = parseFloat(discountAmountValue);
    const discountPct = parseFloat(discountPctValue);

    const effectivateDateControl =
      this.addPriceDiscountForm.get('effectivateDate');
    const endDateControl = this.addPriceDiscountForm.get('endDate');

    // Check if either discountAmount or discountPct is greater than 0
    if (
      (!isNaN(discountAmount) && discountAmount > 0) ||
      (!isNaN(discountPct) && discountPct > 0)
    ) {
      effectivateDateControl?.setValidators([
        Validators.required,
        this.presentOrFutureDateValidator(),
      ]);
      endDateControl?.setValidators([
        Validators.required,
        this.futureDateValidator(),
      ]);
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
      const effectiveDate = new Date(
        this.addPriceDiscountForm.get('effectivateDate')?.value
      );

      return endDate > effectiveDate ? null : { invalidEndDate: true };
    };
  }

  calculateDiscountPct(value: any) {
    const price =
      parseFloat(this.addPriceDiscountForm.get('price')?.value) || 0;
    let discountAmount = parseFloat(value) || 0;

    // Set discountPct to 0 if discountAmount is 0
    if (discountAmount === 0) {
      this.addPriceDiscountForm
        .get('discountPct')
        ?.setValue('0.00', { emitEvent: false });
    } else if (price > 0 && discountAmount > 0) {
      const discountPct = (discountAmount / price) * 100;
      this.addPriceDiscountForm
        .get('discountPct')
        ?.setValue(discountPct.toFixed(2), { emitEvent: false });
    }

    this.calculateTotalPrice();
  }

  calculateDiscountAmount(value: any) {
    const price =
      parseFloat(this.addPriceDiscountForm.get('price')?.value) || 0;
    let discountPct = parseFloat(value) || 0;

    // Set discountAmount to 0 if discountPct is 0
    if (discountPct === 0) {
      this.addPriceDiscountForm
        .get('discountAmount')
        ?.setValue('0.00', { emitEvent: false });
    } else if (price > 0 && discountPct > 0) {
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
    let discountAmount =
      parseFloat(this.addPriceDiscountForm.get('discountAmount')?.value) || 0;
    let discountPct =
      parseFloat(this.addPriceDiscountForm.get('discountPct')?.value) || 0;

    let calculatedDiscount =
      discountAmount > 0 ? discountAmount : (price * discountPct) / 100;
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

      // Object.keys(this.addPriceDiscountForm.value).forEach((key) => {
      //   let value = this.addPriceDiscountForm.value[key];

      //   if (key === 'discountAmount' || key === 'discountPct') {
      //     // Check if the value is a valid number, otherwise set to '0.00'
      //     const numberValue = parseFloat(value);
      //     value = !isNaN(numberValue) ? numberValue.toFixed(2) : '0.00';
      //   } else if (key === 'effectivateDate' || key === 'endDate') {
      //     // If date is null, set to empty string
      //     value = value || '';
      //   } else if (key === 'productId' || key === 'userId') {
      //     value = String(Math.floor(Number(value)));
      //   } else if (key === 'price') {
      //     value = parseFloat(value).toFixed(2);
      //   }

      //   formData.append(key, value);
      // });

      Object.keys(this.addPriceDiscountForm.value).forEach((key) => {
        let value = this.addPriceDiscountForm.value[key];

        if (key === 'discountAmount' || key === 'discountPct') {
          // Parse the value as a float and check if it's NaN or zero

          // const numberValue = parseFloat(value);
          // if (isNaN(numberValue) || numberValue === 0 ) {
          //   value = '0.00'; // Set to '0.00' if the value is NaN or zero
          // } else {
          //   value = numberValue.toFixed(2); // Format valid numbers to two decimal places
          // }

          value =
            value === '' || isNaN(parseFloat(value)) || parseFloat(value) === 0
              ? '0.00'
              : parseFloat(value).toFixed(2);
        } else if (key === 'effectivateDate' || key === 'endDate') {
          // If date is null, set to empty string
          value = value || '';
        } else if (key === 'productId' || key === 'userId') {
          value = String(Math.floor(Number(value)));
        } else if (key === 'price') {
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
        //console.log(`${pair[0]}: `, pair[1]);
      }

      this.productService.createSellerProductPrice(formData).subscribe({
        next: (response: any) => {
          //console.log(response);
          this.alertMsg = response.message;
          this.isError = false; // Set isError to false for a success message
          this.PrdouctExistModalBTN.nativeElement.click();
          this.addPriceDiscountForm.reset();
        },
        error: (error: any) => {
          //console.log(error);
          this.alertMsg = error.error.message;
          this.isError = true; // Set isError to true for an error message
          this.PrdouctExistModalBTN.nativeElement.click();
        },
      });
    } else {
      //console.log('Form is not valid');
    }
  }
}
