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
  @ViewChild('addGroupModalCenterG') AddGroupModalCenterG!: ElementRef;

  addPriceDiscountForm!: FormGroup;
  products: any[] = [];
  isDisabled: boolean = true;
  alertMsg: string = '';
  isError: boolean = false;
  showPriceProductDiv: boolean = false;
  productList: any;
  btnIndex = -1;
  selectedUnitName = '';
  isEditMode = false;
  currentProductPrice: any = null;
  activeProductPriceId: number | null = null;
  existingImagePath: string = '';
  imagePathPreview: string = '';

  onProductChange(event: any) {
    const productId = event.target.value;
    const selectedProduct = this.products.find(
      (prod) => prod.productId == productId
    );
    this.selectedUnitName = selectedProduct ? selectedProduct.unitName : '';
    console.log(this.selectedUnitName, 'name');
    console.log(selectedProduct, 'product');
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
      return discountPct >= 0 && discountPct <= 100
        ? null
        : { maxDiscountPct: true };
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
      //uniteName: new FormControl('')
    });

    // Fetch product groups when the component is initialized
    // this.getProductGroups();
    this.addPriceDiscountForm
      .get('discountAmount')
      ?.valueChanges.subscribe(() => {});

    this.getProducts(-1);
    this.setupFormValueChanges();
    this.getProductList();
    this.addPriceDiscountForm.get('productId')?.setValue(null);
  }

  openAddGroupModal(): void {
    this.resetForm();
    this.isEditMode = false;
    this.currentProductPrice = null;
    this.AddGroupModalCenterG.nativeElement.click();
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

  resetForm(): void {
    this.addPriceDiscountForm.reset();
    this.selectedUnitName = '';
    this.isEditMode = false;
    this.currentProductPrice = null;
    this.activeProductPriceId = null;
    //console.log(this.addPriceDiscountForm, "price form");
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

      Object.keys(this.addPriceDiscountForm.value).forEach((key) => {
        let value = this.addPriceDiscountForm.value[key];

        if (key === 'discountAmount' || key === 'discountPct') {
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
      console.log(this.isEditMode, 'edit modal...');

      if (!this.isEditMode) {
        console.log('submit mode!');

        this.productService.createSellerProductPrice(formData).subscribe({
          next: (response: any) => {
            //console.log(response);
            this.alertMsg = response.message;
            this.isError = false; // Set isError to false for a success message
            this.PrdouctExistModalBTN.nativeElement.click();
            this.addPriceDiscountForm.reset();
            this.resetForm();
            this.getProducts(-1);
          },
          error: (error: any) => {
            //console.log(error);
            this.alertMsg = error.error.message;
            this.isError = true; // Set isError to true for an error message
            this.PrdouctExistModalBTN.nativeElement.click();
            this.addPriceDiscountForm.reset();
            this.resetForm();
            this.getProducts(-1);
          },
        });
      }
      if (this.isEditMode) {
        let updateByUser = localStorage.getItem('code');
        console.log(updateByUser, 'code...');

        console.log('edit mode');
        // formData.append('ProductGroupID', this.currentGroup.productGroupID);
        if (updateByUser !== null) {
          formData.append('UpdatedBy', updateByUser);
        } else {
          console.error('Update by code not found in localStorage');
        }
        formData.append('UpdatedPC', '0.0.0.0');

        this.productService.updateSellerProductPrice(formData).subscribe({
          next: (response: any) => {
            // Handle successful response here
            console.log('Update successful:', response);
            this.alertMsg = response.message;
            this.isEditMode = false;
            this.isError = false;
            // Optionally, reset the form and refresh the group list
            this.addPriceDiscountForm.reset();
            this.getProducts(-1);

            // Close the modal if you have one open
            this.PrdouctExistModalBTN.nativeElement.click();
          },
          error: (error: any) => {
            // Handle error response here
            console.error('Error updating product price:', error);
            this.alertMsg = error.error.message;
            this.isError = true;
            this.isEditMode = false;
            this.PrdouctExistModalBTN.nativeElement.click();
            this.getProducts(-1);
            // Show the error modal or message
            //this.UserExistModalBTN.nativeElement.click();
          },
        });
      }
    } else {
      //console.log('Form is not valid');
    }
  }

  updateFormValidators(): void {
    // Check if the control exists
    const productGroupImageControl =
      this.addPriceDiscountForm.get('productImage');
    if (productGroupImageControl) {
      if (this.isEditMode) {
        productGroupImageControl.clearValidators();
      } else {
        productGroupImageControl.setValidators(Validators.required);
      }
      productGroupImageControl.updateValueAndValidity();
    }
  }

  openModalWithData(product: any): void {
    this.isEditMode = true;
    this.updateFormValidators();
    console.log('product', product);
    this.populateForm(product);
    this.currentProductPrice = product;

    // Ensure the modal is opened before calling displayImage

    this.displayImage(product.imagePath);
    this.activeProductPriceId = product.productId;
  }

  populateForm(product: any): void {
    const isDefaultDate = (date: string) =>
      date.startsWith('0001-01-01T00:00:00');
    this.addPriceDiscountForm.patchValue({
      productId: product.productId,
      price: product.price,
      discountAmount: product.discountAmount,
      discountPct: product.discountPct,
      // effectivateDate: product.effectivateDate,
      // endDate: product.endDate,
      effectivateDate: isDefaultDate(product.effectivateDate)
        ? null
        : product.effectivateDate,
      endDate: isDefaultDate(product.endDate) ? null : product.endDate,
      totalPrice: product.totalPrice,
    });

    this.displayImage(product.imagePath);
    this.existingImagePath = product.imagepath;
    this.selectedUnitName = product.unitName;
  }

  displayImage(imagePath: string): void {
    console.log('Received imagePath:', imagePath);

    if (imagePath) {
      const imageUrl = '/asset' + imagePath.split('asset')[1];

      console.log('Constructed imageUrl:', imageUrl);
      this.imagePathPreview = imageUrl;
    } else {
      this.imagePathPreview = 'not upload yet';
    }
    this.AddGroupModalCenterG.nativeElement.click();
  }
}
