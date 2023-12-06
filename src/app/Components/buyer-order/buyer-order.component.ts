import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  reviewForm: FormGroup;
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
  orderDetailDescription: any = {
    Processing: 'Processing product',
    Pending: 'Pending product',
    'Ready to Ship': ' Product is  ready to ship',
    Shipped: 'Product is on the way to deliver',
    Delivered: 'Delivered product',
    Cancelled: 'Cancelled product',
  };

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
      // console.log(this.isFormValid);
    });

    this.returnForm = new FormGroup({
      orderNo: new FormControl(''),
      groupName: new FormControl(''),
      goodsName: new FormControl(''),
      groupCode: new FormControl(''),
      goodsId: new FormControl(0),
      remarks: new FormControl(''),
      typeId: new FormControl(''),
      price: new FormControl(''),
      detailsId: new FormControl(''),
      sellerCode: new FormControl(''),
      deliveryDate: new FormControl(''),
    });
  }
  ngOnInit() {
    this.loadData();

    this.reviewForm.get('rating')?.valueChanges.subscribe((rating) => {
      console.log('Rating selected:', rating);
      this.errorMsg = false;
      this.rating = rating;
      // You can do something with the rating value here
    });
  }
  setDetail(detail: any) {
    this.detailData = detail;
    console.log(' details data888888888888888888888888888888 ', this.detailData);
  }
  goToDetail(detail: any) {
    this.item = detail;
    console.log(detail, 'detail prod');

    let obj = {
      approveSalesQty: this.item.quantity,
      companyName: this.item.companyName,
      dimensionUnit: this.item.dimensionUnit,
      finish: this.item.finish,
      goodsId: this.item.goodsId,
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

    console.log('product data ', obj);
    sessionStorage.setItem('productData', JSON.stringify(obj));
    // this.route.navigate(['/productDetails']);
    window.open('/productDetails', '_blank');
  }
  addReview() {
    console.log(' review addedddddddddddddddd');
    if (this.isFormValid && this.rating > 0) {
      this.formData.append('RatingValue', this.reviewForm.value.rating);
      this.formData.append('ReviewText', this.reviewForm.value.reviwField);
      const imageFile = this.imageInput.nativeElement.files[0];
      if (imageFile) {
        const fileExtension = imageFile.type.split('/').pop();
        // console.log(fileExtension);
        const timestamp = new Date().getTime();
        const randomNumber = Math.floor(Math.random() * 1000);
        let imageName = `review_${timestamp}_${randomNumber}.${fileExtension}`;
        this.formData.append('Image', imageFile);
        this.formData.append('ImageName', imageName);
      }

      this.formData.append('SellerId', this.detailData.sellerCode);
      this.formData.append('OrderDetailId', this.detailData.orderDetailId);
      this.formData.append('GroupCode', this.detailData.groupCode);
      this.formData.append('goodsId', this.detailData.goodsId);
      this.formData.append('GroupName', this.detailData.groupName);
      const buyerCode = localStorage.getItem('code');
      console.log(buyerCode);
      if (buyerCode) {
        this.formData.append('BuyerId', buyerCode);
      }
      console.log('FormData inside Add:');
      this.formData.forEach((value, key) => {
        console.log(key, value);
      });
      this.reviewService.addReviewAndRating(this.formData).subscribe({
        next: (response: any) => {
          console.log(response);
          this.reviewForm.reset();
          this.closeBTN.nativeElement.click();
          window.location.reload();
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    } else {
      this.errorMsg = true;
      // alert('erorrrrr');
    }
  }

  loadData() {
    const userCode = localStorage.getItem('code');
    console.log(userCode);

    if (
      this.activeNav === 'Ready to Ship' ||
      this.activeNav === 'Shipped' ||
      this.activeNav === 'Delivered' ||
      this.activeNav === 'to Return' ||
      this.activeNav === 'Returned'
    ) {
      this.rowCount = this.allCount > 0 ? this.allCount : 1;
      console.log(this.rowCount, 'rowwww');
    }
    this.orderService
      .getAllOrderForBuyer(
        userCode,
        this.pageNum,
        this.rowCount,
        this.activeNav
      )
      .subscribe({
        next: (response: any) => {
          this.buyerOrder = [];
          console.log(response, 'buyer Order');
          const orders = response.buyerOrderLst;

          for (let order of orders) {
            if (order.orderDetailsList.length > 0) {
              this.buyerOrder.push(order);
            }
          }
          console.log(this.buyerOrder, 'bO');

          this.toShipCount = response.toShipCount;
          this.toDeliverCount = response.toDeliverCount;
          this.allCount = response.allCount;
          this.toReviewCount = response.toReviewCount;
          this.ReturnedCount = response.returnedCount;
          this.ToReturnCount = response.toReturnCount;
          console.log(' this.allCount', this.allCount);
          this.loading = false;
          this.data = Array.from(
            { length: Math.ceil(this.allCount / this.rowCount) },
            (_, index) => index + 1
          );
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }
  handlePaginationData(data: {
    selectedPageIndex: number;
    selectedValue: number;
  }) {
    console.log(data.selectedPageIndex, data.selectedValue, 'data.....');
    this.pageNum = data.selectedPageIndex;
    this.rowCount = data.selectedValue;
    this.loadData();
  }
  orderDetails(order: any) {
    console.log(order, 'order');
    sessionStorage.setItem('order', JSON.stringify(order));
  }
  btnClick(str: string) {
    if (str === '') {
      this.activeNav = str;
      console.log('clicked', str);
    } else if (str === 'Ready to Ship') {
      this.activeNav = str;
      console.log('clicked', str);
    } else if (str === 'Shipped') {
      this.activeNav = str;
      console.log('clicked', str);
    } else if (str === 'Delivered') {
      this.activeNav = str;
      console.log('clicked', str);
    } else if (str === 'to Return') {
      this.activeNav = str;
      console.log('clicked', str);
    } else if (str === 'Returned') {
      this.activeNav = str;
      console.log('clicked', str);
    }
    this.loadData();
  }

  getStatusDescription(status: string): string {
    const description = this.orderDetailDescription[status];
    return description || '';
  }

  // handeling star

  onRatingChange() {
    console.log('Selected rating:', this.selectedRating);
    // You can perform actions based on the selected rating here.
  }

  // added by marufa

  toReturn(returnData: any, orderId: any) {
    this.returnForm.reset();
    this.returnType = false;
    this.returnService.getReturnType().subscribe((data: any) => {
      console.log(' typeId', data[0].typeId); // Use a type if possible for better type checking
      console.log(' returnType', data[0].returnType); // Use a type if possible for better type checking
      this.returnTypeData = data;
    });

    this.returnData = returnData;
    console.log(' return Data', this.returnData);
    console.log(' group Data', this.returnData.groupName);

    this.returnForm.patchValue({
      orderNo: orderId ? orderId : '',
      groupName: this.returnData ? this.returnData.groupName : '',
      goodsName: this.returnData ? this.returnData.goodsName : '',
      groupCode: this.returnData ? this.returnData.groupCode : '',
      goodsId: this.returnData ? this.returnData.goodsId : '',
      price: this.returnData ? this.returnData.price : '',
      detailsId: this.returnData ? this.returnData.orderDetailId : '',
      sellerCode: this.returnData ? this.returnData.sellerCode : '',
      deliveryDate: this.returnData ? this.returnData.deliveryDate : '',
    });
    this.productImageSrc = returnData.imagePath
      ? returnData.imagePath.substring(returnData.imagePath.indexOf('assets'))
      : '../../../assets/images/medical/' + returnData.groupName.trim() + '.jpg';
  }

  SaveReturnData() {
    console.log(' type', this.returnForm.value.typeId);
    if (this.returnForm.value.typeId != null) {
      console.log(' RETURN fORM ', this.returnForm.value);
      this.formData.append('OrderNo', this.returnForm.value.orderNo);
      this.formData.append('GroupName', this.returnForm.value.groupName);
      this.formData.append('GoodsName', this.returnForm.value.goodsName);
      this.formData.append('GroupCode', this.returnForm.value.groupCode);
      this.formData.append('goodsId', this.returnForm.value.goodsId);
      this.formData.append('Remarks', this.returnForm.value.remarks);
      this.formData.append('TypeId', this.returnForm.value.typeId);
      this.formData.append('Price', this.returnForm.value.price);
      this.formData.append('DetailsId', this.returnForm.value.detailsId);
      this.formData.append('ReturnType', this.returnForm.value.returnType);
      this.formData.append('SellerCode', this.returnForm.value.sellerCode);
      this.formData.append('DeliveryDate', this.returnForm.value.deliveryDate);
      // Assuming you have already populated the `this.formData` object
      const formDataObject = this.formDataToObject(this.formData);

      // Log the FormData as an object
      console.log(' form data ', formDataObject);

      this.returnService.insertData(this.formData).subscribe(
        (response) => {
          // Handle a successful response
          console.log('Data saved successfully:', response);
          // Optionally, reset the form after successful submission
          this.formData = new FormData();
          this.returnForm.reset();
          this.closeModalButton.nativeElement.click();
          this.loadData();
        },
        (error) => {
          // Handle an error response
          console.error('Error saving data:', error);
        }
      );
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
