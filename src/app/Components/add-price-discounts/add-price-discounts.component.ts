import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddProductService } from 'src/app/services/add-product.service';

@Component({
  selector: 'app-add-price-discounts',
  templateUrl: './add-price-discounts.component.html',
  styleUrls: ['./add-price-discounts.component.css']
})
export class AddPriceDiscountsComponent {
  @ViewChild('ProductImageInput') ProductImageInput!: ElementRef;

  addPriceDiscountForm!:FormGroup;
  products: any[] = [];
  isDisabled: boolean = true;

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
      discountPct: new FormControl('', Validators.required),
      effectivateDate: new FormControl(''),
      endDate: new FormControl(''),
      productImage: new FormControl('', Validators.required),
      totalPrice: new FormControl(''),

    });

    // Fetch product groups when the component is initialized
    // this.getProductGroups();
    this.addPriceDiscountForm.get('discountAmount')?.valueChanges.subscribe(() => {

    });

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
    form.get('price')?.valueChanges.subscribe(() => this.calculateTotalPrice());
    form.get('discountAmount')?.valueChanges.subscribe(() => this.calculateTotalPrice());
    form.get('discountPct')?.valueChanges.subscribe(() => this.calculateTotalPrice());
  }


  calculateTotalPrice() {
    const price = parseFloat(this.addPriceDiscountForm.get('price')?.value) || 0;
    let discountAmount = parseFloat(this.addPriceDiscountForm.get('discountAmount')?.value) || 0;
    let discountPct = parseFloat(this.addPriceDiscountForm.get('discountPct')?.value) || 0;

    if (price > 0) {
      if (discountAmount > 0) {
        // Calculate and update discount percentage if discount amount is provided
        discountPct = (discountAmount / price) * 100;
        this.addPriceDiscountForm.get('discountPct')?.setValue(discountPct.toFixed(2), { emitEvent: false });
      } else if (discountPct > 0) {
        // Calculate and update discount amount if discount percentage is provided
        discountAmount = (price * discountPct) / 100;
      }
    }

    const totalPrice = Math.max(price - discountAmount, 0); // Total price should not be negative
    this.addPriceDiscountForm.get('totalPrice')?.setValue(totalPrice.toFixed(2), { emitEvent: false });
  }

  isDiscountAmountGiven(): boolean {
    const discountAmount = this.addPriceDiscountForm.get('discountAmount')?.value;
    return !!discountAmount; // returns true if discountAmount has a value, false otherwise
  }




  onSubmit(): void {
    // console.log('Form Data:', this.addPriceDiscountForm.value);

    if (this.addPriceDiscountForm.valid) {
      // Create FormData object
      const formData = new FormData();


      Object.keys(this.addPriceDiscountForm.value).forEach((key) => {
        let value = this.addPriceDiscountForm.value[key];
        if (key === 'productId' || key === 'userId') {

          value = String(Math.floor(Number(value)));
          console.log(value);

        }

        if (key === 'price'||key === 'discountAmount' || key === 'discountPct') {
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

      // Append additional fields
      formData.append('userId', '1');
      formData.append('companyCode', 'HC-23-12-00001');



      for (let pair of (formData as any).entries()) {
        console.log(`${pair[0]}: `, pair[1]);
      }


      this.productService.createSellerProductPrice(formData).subscribe({
        next: (response: any) => {
          console.log(response);
          // this.alertMsg = response.message;
          // this.isError = false; // Set isError to false for a success message
          // this.PrdouctExistModalBTN.nativeElement.click();
          this.addPriceDiscountForm.reset();
        },
        error: (error: any) => {
          console.log(error);
          // this.alertMsg = error.error.message;
          // this.isError = true; // Set isError to true for an error message
          // this.PrdouctExistModalBTN.nativeElement.click();
        },
      });
    } else {
      console.log('Form is not valid');
    }
  }
}
