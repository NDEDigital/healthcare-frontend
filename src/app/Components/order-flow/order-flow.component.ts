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
  @ViewChild('ProductImageInput') ProductImageInput!: ElementRef;

  reviewForm!: FormGroup;
  ratingValue: number = 0;
  // stars: HTMLElement[] = [];
  currentOrderDetailId: number = 0;


  btnIndex = -1;
  productsData: any;
  returntype: any;
  imagePath = '';
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
      imagePath: new FormControl(''),
      ratingValue: new FormControl(0),
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
    // Access the form values directly
    const returnType = formValues.returnTypeControl;
    const remarks = formValues.remarksControl;

    // Now you can use returnType and remarks in your logic
    console.log('Return Type:', returnType);
    console.log('Remarks:', remarks);

    // Add your logic to send the values to the server or perform any other actions
  }

  showImage(path: any, title: any) {
    //console.log(path, title);
    this.imagePath = path.split('src')[1];
    this.imageTitle = title;
  }
  updateProduct(UserId: any, CompanyCode: any, ProductId: any, Status: any) {
    //console.log(UserId, CompanyCode, ProductId, Status);
    const productStatus = {
      UserId,
      CompanyCode,
      ProductId,
      Status,
    };
    this.productService.updateProduct(productStatus).subscribe({
      next: (response: any) => {
        //console.log(response);
        // this.productsData = response;
        // //console.log(this.productsData);
        if ((this.btnIndex = -1)) {
          this.getData('Pending');
        } else if ((this.btnIndex = 1)) {
          this.getData('Approved');
        } else {
          this.getData('Rejected');
        }
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
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
    this.reviewForm.get('ratingValue')?.setValue(this.ratingValue);
    this.stars.forEach((starElement, index) => {
      const element = starElement.nativeElement;
      if (index < this.ratingValue) {
        // Add 'selected' class to the star if it's less than the ratingValue
        element.classList.add('selected');
        element.classList.remove('hovered'); // Optional: Remove hovered class if needed
      } else {
        // Remove 'selected' class from the star if it's greater than or equal to the ratingValue
        element.classList.remove('selected');
      }
    });
  }

  openReviewModal(row: any): void {
     this.currentOrderDetailId = row.orderDetailId;
    console.log(row, "row value");



  }


  onSubmit(): void {
    if (this.reviewForm.valid) {
      const formData = new FormData();
      const formValue = this.reviewForm.value;

      // Append the image file
      const file = this.ProductImageInput.nativeElement.files[0];
      if (file) {
        formData.append('imagePath', file);
      }

      // Append other form fields
      Object.keys(formValue).forEach((key) => {
        if (key !== 'imagePath') {
          // Exclude the imagePath as it's handled above
          formData.append(key, formValue[key]);
        }
      });

      // Append additional fields if needed
      formData.append('addedBy', 'user');
      formData.append('addedPC', '0.0.0.0');
      formData.append('orderDetailId',  this.currentOrderDetailId.toString());

      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });


      // Call your service
      this.ReviewandRatingsService.addReview(formData).subscribe({
        next: (response) => {
          console.log(response, 'response');
          this.reviewForm.reset();
        },
        error: (error) => {
          // Handle errors here
        },
      });
    } else {
      // Handle the case when the form is not valid
    }
  }
}
