import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SellerOrderOverviewService } from 'src/app/services/seller-order-overview.service';
import { OrderApiService } from 'src/app/services/order-api.service';
import { ProductReturnServiceService } from 'src/app/services/product-return-service.service';
import { ReviewRatingsService } from 'src/app/services/review-ratings.service';
interface ProductType {
  orderNo: any;
  productId: any;
  specification: any;
  stockQty: any;
  saleQty: any;
  unitId: any;
  netPrice: any;
  address: any;
  productGroupID: any;
  addedBy: string;
  addedPC: string;
}
@Component({
  selector: 'app-seller-orders',
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.css'],
})
export class SellerOrdersComponent {
  @ViewChild('closeModalButton') closeModalButton!: ElementRef;
  @ViewChild('productStatusModalBTN') productStatusModalBTN!: ElementRef;
  @ViewChild('closeBTN') closeBTN!: ElementRef;
  orderSection: boolean = true;
  activeNav: string = '';
  alertMsg = '';
  pageNum = 1;
  rowCount = 10;
  toShipCount = 0;
  toDeliverCount = 0;
  toReviewCount = 0;
  ToReturnCount = 0;
  ReturnedCount = 0;
  allCount = 0;
  sellerOrder: any = [];
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
    Approved: 'Order is waiting for Seller Approval',
    Processing: 'Processing product',
    Pending: 'Order is waiting for Admin Approval',
    'Ready to Ship': ' Product is  ready to ship',
    Shipped: 'Product is on the way to deliver',
    Delivered: 'Delivered product',
    Cancelled: 'Cancelled product',
  };
  statusArray = [
    'Approved',
    'Processing',
    'ReadyToShip',
    'ToDeliver',
    'Delivered',
    'Reviewed',
    'ToReturn',
    'Returned',
    'Rejected',
  ];
  btnIndex = -2;
  constructor(
    private router: Router,
    private orderService: OrderApiService,
    private reviewService: ReviewRatingsService,
    private returnService: ProductReturnServiceService,
    private sellerService: SellerOrderOverviewService
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
      //console.log('Rating selected:', rating);
      this.errorMsg = false;
      this.rating = rating;
      // You can do something with the rating value here
    });
  }
  setDetail(detail: any) {
    this.detailData = detail;
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

    //console.log('product data ', obj);
    sessionStorage.setItem('productData', JSON.stringify(obj));
    // this.route.navigate(['/productDetails']);
    window.open('/productDetails', '_blank');
  }

  loadData() {
    const userCode = localStorage.getItem('code');

    this.orderService.getOrdersForSeller(userCode, '').subscribe({
      next: (response: any) => {
        console.log(response, 'newsellerorder');
        this.sellerOrder = response;

        // setTimeout(() => {
        //   console.log(
        //     this.sellerOrder,
        //     'byer order array',
        //     this.sellerOrder.length,
        //     'this.sellerOrder.length'
        //   );
        // }, 500);
        this.loading = false;
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
  }

  getData(status: string) {
    const userCode = localStorage.getItem('code');

    this.orderService.getOrdersForSeller(userCode, status).subscribe({
      next: (response: any) => {
        console.log(response, 'newsellerorder');
        this.sellerOrder = response;

        // setTimeout(() => {
        //   console.log(
        //     this.sellerOrder,
        //     'seller order array',
        //     this.sellerOrder.length,
        //     'this.sellerOrder.length'
        //   );
        // }, 500);
        this.loading = false;
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
    // console.log(status);

    // let uidS = localStorage.getItem('code');
    // let userID;
    // if (uidS) userID = parseInt(uidS, 10);
    // this.orderService.getOrdersForSeller(userID, status).subscribe({
    //   next: (response: any) => {
    //     console.log(response, 'get seller order data');
    //     this.sellerOrder = response;
    //     // console.log(this.productsData,"all data");
    //   },
    //   error: (error: any) => {
    //     //console.log(error);
    //   },
    // });
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

  getStatusDescription(status: string): string {
    const description = this.orderDetailDescription[status];
    return description || '';
  }

  updateOrder(stat: any, order: any) {
    let uidS = localStorage.getItem('code');
    let uid: any;
    if (uidS) uid = parseInt(uidS, 10);
    let status = 'status';
    let detailIDs = '';
    if (this.btnIndex === -1) {
      if (stat === 'Rejected') {
        status = 'Rejected';
        this.alertMsg = `Order status is ${status}!`;
      } else {
        status = 'Processing';
        this.alertMsg = `Order status is ${status}!`;
        this.productStatusModalBTN.nativeElement.click();
      }
    }
    if (this.btnIndex === 3) {
      this.productStatusModalBTN.nativeElement.click();
      status = 'ReadyToShip';
      this.alertMsg = `Order status is ${status}!`;
    }
    if (this.btnIndex === 4) {
      this.productStatusModalBTN.nativeElement.click();
      status = 'ToDeliver';
      this.alertMsg = `Order status is ${status}!`;
    }
    if (this.btnIndex === 5) {
      this.productStatusModalBTN.nativeElement.click();
      status = 'Delivered';
      this.alertMsg = `Order status is ${status}!`;
    }
    if (this.btnIndex === 8) {
      this.productStatusModalBTN.nativeElement.click();
      status = 'Returned';
      this.alertMsg = `Order status is ${status}!`;
    }
    console.log(order.orderDetailsListForSeller);

    //detailID = product.orderDetailId.toString();
    console.log(order, 'order');
    console.log(order.orderDetailsListForSeller, 'orderDetailsListForSeller');

    // if (btnIndex === 2) {
    //   status = 'Rejected';
    // }

    // const sellerSalesMasterDto = {
    //   userId: uid,
    //   totalPrice: order.netPrice,
    //   bUserId: order.buyerUserId,
    //   addedBy: 'user',
    //   addedPC: '0.0.0.0',
    //   sellerSalesDetailsList: [
    //     // {
    //     //   orderNo: product.orderNo,
    //     //   productId: product.productId,
    //     //   specification: product.specification,
    //     //   stockQty: product.stockQty,
    //     //   saleQty: product.saleQty,
    //     //   unitId: product.unitId,
    //     //   netPrice: product.netPrice,
    //     //   address: product.address,
    //     //   productGroupID: product.productGroupID,
    //     //   addedBy: 'user',
    //     //   addedPC: '0.0.0.0',
    //     // },
    //   ],
    // };
    // order.orderDetailsListForSeller.forEach((product: any, index: number) => {
    //   detailIDs += product.orderDetailId;

    //   if (index < order.orderDetailsListForSeller.length - 1) {
    //     detailIDs += ',';
    //   }
    // });
    const sellerSalesMasterDto = {
      userId: uid,
      totalPrice: order.totalPrice,
      bUserId: order.buyerUserId,
      addedBy: 'user',
      addedPC: '0.0.0.0',
      sellerSalesDetailsList: [] as ProductType[],
    };

    order.orderDetailsListForSeller.forEach((product: any, index: number) => {
      detailIDs += product.orderDetailId;

      if (index < order.orderDetailsListForSeller.length - 1) {
        detailIDs += ',';
      }

      // Creating an object based on the commented-out code
      const salesDetail: ProductType = {
        orderNo: order.orderNo,
        productId: product.productId,
        specification: product.specification,
        stockQty: product.stockQty,
        saleQty: product.saleQty,
        unitId: product.unitId,
        netPrice: product.netPrice,
        address: order.buyerAddress,
        productGroupID: product.productGroupID,
        addedBy: 'user',
        addedPC: '0.0.0.0',
      };

      // Adding the created object to the sellerSalesDetailsList array
      sellerSalesMasterDto.sellerSalesDetailsList.push(salesDetail);
    });
    console.log(status, 'status');
    this.sellerService
      .UpdateSellerOrderDetailsStatus(detailIDs, status, sellerSalesMasterDto)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          // this.productsData = response;
          // //console.log(this.productsData);
          // if ((this.btnIndex = -1)) {
          //   this.getData('Pending');
          // } else if ((this.btnIndex = 1)) {
          //   this.getData('Approved');
          // } else {
          //   this.getData('Rejected');
          // }
          if (status === 'Rejected') {
            //this.btnIndex = -1;
            this.getData('Approved');
            this.productStatusModalBTN.nativeElement.click();
          } else if (status === 'Processing') {
            // Set btnIndex to the appropriate value for Processing
            // this.btnIndex = 2;
            this.getData('Approved');
            this.productStatusModalBTN.nativeElement.click();
          } else if (status === 'ReadyToShip') {
            //this.btnIndex = 3;
            this.getData('Processing');
            this.productStatusModalBTN.nativeElement.click();
          } else if (status === 'ToDeliver') {
            //this.btnIndex = 4;
            this.getData('ReadyToShip');
            this.productStatusModalBTN.nativeElement.click();
          } else if (status === 'Delivered') {
            // this.btnIndex = 5;
            this.getData('ToDeliver');
            this.productStatusModalBTN.nativeElement.click();
          } else if (status === 'Returned') {
            //this.btnIndex = 6;
            this.getData('Delivered');
            this.productStatusModalBTN.nativeElement.click();
          } else {
            // Handle other status values as needed
            // You may want to set a default value for btnIndex or handle unknown status
            // this.btnIndex = ???;
          }
          // this.getData(status);
        },
        error: (error: any) => {
          //console.log(error);
        },
      });
  }
  gotoInvoice(orderId: any) {
    sessionStorage.setItem('orderMasterID', orderId);

    const urlToOpen = '/sellerInvoice'; // Replace with your desired URL

    // Use window.open to open the new window/tab
    window.open(urlToOpen, '_blank');
  }
}
