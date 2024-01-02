import { Component, ViewChild } from '@angular/core';
import { AddProductService } from 'src/app/services/add-product.service';
import {
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { QueryList, ViewChildren, ElementRef } from '@angular/core';
import { OrderApiService } from 'src/app/services/order-api.service';
import { ProductReturnServiceService } from 'src/app/services/product-return-service.service';
import { ReviewRatingsService } from 'src/app/services/review-ratings.service';

@Component({
  selector: 'app-order-flow',
  templateUrl: './order-flow.component.html',
  styleUrls: ['./order-flow.component.css'],
})
export class OrderFlowComponent {
  @ViewChildren('star') stars!: QueryList<ElementRef>;
  @ViewChild('starContainer') starContainer!: ElementRef;
  @ViewChild('ProductImageInput') ProductImageInput!: ElementRef;

  reviewForm!: FormGroup;
  ratingValue: number = 0;
  // stars: HTMLElement[] = [];
  currentOrderDetailId: number = 0;
  buyerId: number = 0;

  btnIndex = -1;
  productsData: any;
  returntype: any;
  imageFile = '';
  status = 'Pending';
  imageTitle = 'No Data Found!';
  selectedCompanyCodeValues: { [key: string]: number } = {};

  constructor(
    private productService: AddProductService,
    private orderApi: OrderApiService,
    private productReturnService: ProductReturnServiceService,
    private ReviewandRatingsService: ReviewRatingsService
  ) {}

  ngAfterViewInit() {
    // Optional: You might need to handle changes if stars are dynamic
    this.stars.changes.subscribe((stars: QueryList<ElementRef>) => {
      // Logic to handle changes in the star elements
    });
  }

  ngOnInit() {
    this.getData(this.status);
    this.GetReturnTypeForSelectOption();

    this.reviewForm = new FormGroup({
      reviewText: new FormControl(''),
      imageFile: new FormControl(''),
      ratingValue: new FormControl(0, [Validators.required, this.ratingValidator])
    });
  }

  getData(status: string) {
    let uidS = localStorage.getItem('code');
    let userID;
    if (uidS) userID = parseInt(uidS, 10);
    this.orderApi.getBuyerOrder(userID, status).subscribe({
      next: (response: any) => {
        console.log(response);
        this.productsData = response;

        // console.log(this.productsData,"all data");
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
  }

  GetReturnTypeForSelectOption() {
    this.productReturnService.getReturnType().subscribe({
      next: (Response: any) => {
        console.log(Response);
        this.returntype = Response;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  ReturnProduct(formValues: any): void {
    const returnType = formValues.returnTypeControl;
    const remarks = formValues.remarksControl;

    console.log('Return Type:', returnType);
    console.log('Remarks:', remarks);
  }

  showImage(path: any, title: any) {
    this.imageFile = path.split('src')[1];
    this.imageTitle = title;
  }
  updateProduct(UserId: any, CompanyCode: any, ProductId: any, Status: any) {
    const productStatus = {
      UserId,
      CompanyCode,
      ProductId,
      Status,
    };
    this.productService.updateProduct(productStatus).subscribe({
      next: (response: any) => {
        if ((this.btnIndex = -1)) {
          this.getData('Pending');
        } else if ((this.btnIndex = 1)) {
          this.getData('Approved');
        } else {
          this.getData('Rejected');
        }
      },
      error: (error: any) => {},
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.reviewForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  updateRating(hoveredStar: number): void {
    this.stars.forEach((star, index) => {
      const starElement = star.nativeElement;
      if (index < hoveredStar) {
        starElement.classList.add('hovered');
      } else {
        starElement.classList.remove('hovered');
      }
    });
  }

  setRating(star: number): void {
    this.ratingValue = star;
    // this.reviewForm.get('ratingValue')?.setValue(this.ratingValue);
    this.reviewForm.get('ratingValue')?.setValue(star);
    this.stars.forEach((starElement, index) => {
      const element = starElement.nativeElement;
      if (index < this.ratingValue) {
        element.classList.add('selected');
        element.classList.remove('hovered');
      } else {
        element.classList.remove('selected');
      }
    });
  }

  resetStars(): void {
    this.stars.forEach((starElement) => {
      const element = starElement.nativeElement;
      element.classList.remove('selected', 'hovered');
    });
  }
  resetRating(event: MouseEvent): void {
    const container = this.starContainer.nativeElement;

    // Check if the clicked element is a star
    if (
      event.target instanceof HTMLElement &&
      event.target.classList.contains('bi-star-fill')
    ) {
      // Clicked on a star, no need to reset rating
      return;
    }

    // Click was outside the stars, reset the rating
    this.ratingValue = 0;
    this.reviewForm.get('ratingValue')?.setValue(this.ratingValue);
    this.resetStars(); // Call this method to reset star visual state
  }


  ratingValidator(control: AbstractControl): ValidationErrors | null {
    const rating = control.value;
    // Assuming 0 is the default value and means no rating is selected
    if (rating === 0) {
      return { 'noRating': true };
    }
    return null;
  }

  // resting form

  resetFormAndStars(): void {
    this.reviewForm.reset();
    this.resetStars();

    if (this.ProductImageInput) {
      this.ProductImageInput.nativeElement.value = '';
    }
  }

  openReviewModal(row: any): void {
    this.currentOrderDetailId = row.orderDetailId;
    console.log(row, 'row value');
  }

  onSubmit(): void {
    Object.values(this.reviewForm.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
    });
    if (this.reviewForm.valid) {
      const formData = new FormData();
      const formValue = this.reviewForm.value;

      let buyerId = localStorage.getItem('code');
      console.log(buyerId, 'buyerId..');

      const file = this.ProductImageInput.nativeElement.files[0];
      if (file) {
        formData.append('imageFile', file);
      }

      Object.keys(formValue).forEach((key) => {
        if (key !== 'imageFile') {
          formData.append(key, formValue[key]);
        }
      });

      formData.append('addedBy', 'user');
      formData.append('addedPC', '0.0.0.0');
      if (buyerId) {
        formData.append('buyerId', buyerId);
      } else {
        console.log('Buyer ID is not available');
      }

      formData.append('orderDetailId', this.currentOrderDetailId.toString());

      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      this.ReviewandRatingsService.addReview(formData).subscribe({
        next: (response) => {
          console.log(response, 'response');
          this.resetFormAndStars();
        },
        error: (error) => {
          console.error('Error during submission:', error);
        },
      });
    } else {
      console.log('form is invalid');
    }
  }
}
