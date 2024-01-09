import { Component, ElementRef, ViewChild } from '@angular/core';
import { QueryList, ViewChildren } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { OrderApiService } from 'src/app/services/order-api.service';
import { ProductReturnServiceService } from 'src/app/services/product-return-service.service';
import { ReviewRatingsService } from 'src/app/services/review-ratings.service';

@Component({
  selector: 'app-buyer-order',
  templateUrl: './buyer-order.component.html',
  styleUrls: ['./buyer-order.component.css'],
})
export class BuyerOrderComponent {
  @ViewChild('closeModalButton') closeModalButton!: ElementRef;
  @ViewChild('imageInput') imageInput!: ElementRef;
  @ViewChild('reviewBTN') reviewBTN!: ElementRef;
  @ViewChild('closeBTN') closeBTN!: ElementRef;
  @ViewChild('CloseReviewFormModal') CloseReviewFormModalBTN!: ElementRef;
  @ViewChildren('star') stars!: QueryList<ElementRef>;
  @ViewChild('starContainer') starContainer!: ElementRef;
  @ViewChild('ProductImageInput') ProductImageInput!: ElementRef;
  orderSection: boolean = true;
  activeNav: string = '';
  pageNum = 1;
  rowCount = 10;
  toShipCount = 0;
  toDeliverCount = 0;
  toReviewCount = 0;
  ToReturnCount = 0;
  ReturnedCount = 0;
  allCount = 0;
  buyerOrder: any = [];
  loading: boolean = true;
  data: any = [];
  returnTypeData: any = [];
  selectedRating: number = 0;
  item: any;

  returnForm: FormGroup;
  returnData: any = [];
  isFormValid = false;
  rating = 0;
  formData = new FormData();
  imageFileName: string | undefined;
  errorMsg = false;
  detailData: any;
  productImageSrc: string = '';
  returnType = false;
  reviewForm!: FormGroup;
  ratingValue: number = 0;
  // stars: HTMLElement[] = [];
  currentOrderDetailId: number = 0;
  buyerId: number = 0;
  orderDetailDescription: any = {
    Approved: 'Order is waiting for Seller Approval',
    Processing: 'Processing product',
    Pending: 'Order is waiting for Admin Approval',
    'Ready to Ship': ' Product is  ready to ship',
    Shipped: 'Product is on the way to deliver',
    Delivered: 'Delivered product',
    Cancelled: 'Cancelled product',
  };
  btnIndex = -2;
  constructor(
    private router: Router,
    private orderService: OrderApiService,
    private reviewService: ReviewRatingsService,
    private returnService: ProductReturnServiceService
  ) {
    this.reviewForm = new FormGroup({
      rating: new FormControl(Validators.required),
      image: new FormControl(),
      reviwField: new FormControl(),
    });
    this.reviewForm.valueChanges.subscribe(() => {
      this.isFormValid = this.reviewForm.valid;
      // //console.log(this.isFormValid);
    });

    this.returnForm = new FormGroup({
      orderNo: new FormControl(''),
      groupName: new FormControl(''),
      goodsName: new FormControl(''),
      groupCode: new FormControl(''),
      productId: new FormControl(0),
      remarks: new FormControl(''),
      typeId: new FormControl('0'),
      price: new FormControl(''),
      detailsId: new FormControl(''),
      sellerCode: new FormControl(''),
      deliveryDate: new FormControl(''),
    });
  }

  ngAfterViewInit() {
    // Optional: You might need to handle changes if stars are dynamic
    this.stars.changes.subscribe((stars: QueryList<ElementRef>) => {
      // Logic to handle changes in the star elements
    });
  }

  ngOnInit() {
    this.loadData();

    this.reviewForm.get('rating')?.valueChanges.subscribe((rating) => {
      //console.log('Rating selected:', rating);
      this.errorMsg = false;
      this.rating = rating;
      // You can do something with the rating value here
    });

    this.reviewForm = new FormGroup({
      reviewText: new FormControl(''),
      imageFile: new FormControl(''),
      ratingValue: new FormControl(0, [
        Validators.required,
        this.ratingValidator,
      ]),
    });
    // Set the default value for typeId form control
    this.returnForm.get('typeId')?.setValue(null);
  }
  setDetail(detail: any) {
    this.detailData = detail;
    console.log(detail, 'detail data...');

    //console.log(' details data888888888888888888888888888888 ', this.detailData);
  }
  goToDetail(detail: any) {
    this.item = detail;
    //console.log(detail, 'detail prod');

    let obj = {
      approveSalesQty: this.item.quantity,
      companyName: this.item.companyName,
      dimensionUnit: this.item.dimensionUnit,
      finish: this.item.finish,
      productId: this.item.productId,
      goodsName: this.item.goodsName,
      grade: this.item.grade,
      groupCode: this.item.groupCode,
      groupName: this.item.groupName,
      imagePath: this.item.imagePath,
      length: this.item.length,
      price: this.item.price,
      quantityUnit: this.item.quantityUnit,
      salesQty: this.item.quantity,
      sellerCode: this.item.supplierCode,
      specification: this.item.ProductDescription,
      stockQty: this.item.quantity,
      weight: this.item.width,
    };

    //console.log('product data ', obj);
    sessionStorage.setItem('productData', JSON.stringify(obj));
    // this.route.navigate(['/productDetails']);
    window.open('/productDetails', '_blank');
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
      return { noRating: true };
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

  // adding review
  openReviewModal(detail: any): void {
    this.currentOrderDetailId = detail.orderDetailId;
    console.log(detail, 'row value');
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

      this.reviewService.addReview(formData).subscribe({
        next: (response) => {
          console.log(response, 'response');
          this.resetFormAndStars();
          this.CloseReviewFormModalBTN.nativeElement.click();
          alert('Review added successfully');
        },
        error: (error) => {
          console.error('Error during submission:', error);
        },
      });
    } else {
      console.log('form is invalid');
    }
  }

  loadData() {
    const userCode = localStorage.getItem('code');

    this.orderService.getOrdersForBuyer(userCode, '').subscribe({
      next: (response: any) => {
        console.log(response, 'newbuyerorder');
        this.buyerOrder = response;

        setTimeout(() => {
          console.log(
            this.buyerOrder,
            'byer order array',
            this.buyerOrder.length,
            'this.buyerOrder.length'
          );
        }, 500);
        this.loading = false;
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
  }

  getData(status: string) {
    let uidS = localStorage.getItem('code');
    let userID;
    if (uidS) userID = parseInt(uidS, 10);
    this.orderService.getOrdersForBuyer(userID, status).subscribe({
      next: (response: any) => {
        console.log(response, 'get buyer order data');
        this.buyerOrder = response;
        // console.log(this.productsData,"all data");
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
  }
  handlePaginationData(data: {
    selectedPageIndex: number;
    selectedValue: number;
  }) {
    //console.log(data.selectedPageIndex, data.selectedValue, 'data.....');
    this.pageNum = data.selectedPageIndex;
    this.rowCount = data.selectedValue;
    this.loadData();
  }
  orderDetails(orderNo: any) {
    //console.log(order, 'order');
    sessionStorage.setItem('orderNo', JSON.stringify(orderNo));
    window.open('/buyerOrderDetails', '_blank');
  }
  // btnClick(str: string) {
  //   if (str === '') {
  //     this.activeNav = str;
  //     //console.log('clicked', str);
  //   } else if (str === 'Ready to Ship') {
  //     this.activeNav = str;
  //     //console.log('clicked', str);
  //   } else if (str === 'Shipped') {
  //     this.activeNav = str;
  //     //console.log('clicked', str);
  //   } else if (str === 'Delivered') {
  //     this.activeNav = str;
  //     //console.log('clicked', str);
  //   } else if (str === 'to Return') {
  //     this.activeNav = str;
  //     //console.log('clicked', str);
  //   } else if (str === 'Returned') {
  //     this.activeNav = str;
  //     //console.log('clicked', str);
  //   }
  //   this.loadData();
  // }

  getStatusDescription(status: string): string {
    const description = this.orderDetailDescription[status];
    return description || '';
  }

  // added by marufa

  toReturn(returnData: any, orderId: any) {
    this.returnForm.reset();
    this.returnType = false;
    this.returnService.getReturnType().subscribe((data: any) => {
      //console.log(' typeId', data[0].typeId); // Use a type if possible for better type checking
      console.log('get returnType data', data); // Use a type if possible for better type checking
      this.returnTypeData = data;
    });

    this.returnData = returnData;
    //console.log(' return Data', this.returnData);
    //console.log(' group Data', this.returnData.groupName);

    this.returnForm.patchValue({
      orderNo: orderId ? orderId : '',
      groupName: this.returnData ? this.returnData.groupName : '',
      goodsName: this.returnData ? this.returnData.goodsName : '',
      groupCode: this.returnData ? this.returnData.groupCode : '',
      productId: this.returnData ? this.returnData.productId : '',
      price: this.returnData ? this.returnData.price : '',
      detailsId: this.returnData ? this.returnData.orderDetailId : '',
      sellerCode: this.returnData ? this.returnData.sellerCode : '',
      deliveryDate: this.returnData ? this.returnData.deliveryDate : '',
    });
    this.productImageSrc = returnData.imagePath
      ? returnData.imagePath.substring(returnData.imagePath.indexOf('assets'))
      : '../../../assets/images/medical/' +
        returnData.groupName.trim() +
        '.jpg';
  }

  SaveReturnData() {
    //console.log(' type', this.returnForm.value.typeId);
    if (this.returnForm.value.typeId != null) {
      //console.log(' RETURN fORM ', this.returnForm.value);
      this.formData.append('OrderNo', this.returnForm.value.orderNo);
      //this.formData.append('ProductGroupId', this.returnForm.value.groupName);
      //this.formData.append('ProductId', this.returnForm.value.productId);
      this.formData.append('Remarks', this.returnForm.value.remarks);
      this.formData.append('ReturnTypeId', this.returnForm.value.typeId);
      this.formData.append('Price', this.returnForm.value.price);
      this.formData.append('OrderDetailsId', this.returnForm.value.detailsId);
      //this.formData.append('SellerId', this.returnForm.value.SellerOrderId);
      this.formData.append('AddedBy', 'Test User');
      this.formData.append('AddedPc', '0.0.0.0');

      // Assuming you have already populated the `this.formData` object
      //const formDataObject = this.formDataToObject(this.formData);

      // Log the FormData as an object
      //console.log(' form data ', formDataObject);

      this.returnService
        .ReturnProductAndChangeOrderDetailsStatus(this.formData)
        .subscribe({
          next: (Response: any) => {
            console.log('return post and status change response', Response);
            this.getData('Delivered');
            this.closeModalButton.nativeElement.click();
          },
          error: (error: any) => {
            console.log(error);
            alert(error);
          },
        });
    } else {
      this.returnType = true;
    }
  }
  // Create a helper function to convert FormData to a plain object
  formDataToObject(formData: FormData): { [key: string]: any } {
    const object: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      object[key] = value;
    });
    return object;
  }
}
