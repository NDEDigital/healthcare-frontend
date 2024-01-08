import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SellerOrderOverviewService } from 'src/app/services/seller-order-overview.service';
import { OrderApiService } from 'src/app/services/order-api.service';
import { ProductReturnServiceService } from 'src/app/services/product-return-service.service';
import { ReviewRatingsService } from 'src/app/services/review-ratings.service';
@Component({
  selector: 'app-seller-orders',
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.css'],
})
export class SellerOrdersComponent {
  @ViewChild('closeModalButton') closeModalButton!: ElementRef;

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

        setTimeout(() => {
          console.log(
            this.sellerOrder,
            'byer order array',
            this.sellerOrder.length,
            'this.sellerOrder.length'
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
    this.orderService.getOrdersForSeller(userID, status).subscribe({
      next: (response: any) => {
        console.log(response, 'get seller order data');
        this.sellerOrder = response;
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
  // orderDetails(order: any) {
  //   //console.log(order, 'order');
  //   sessionStorage.setItem('order', JSON.stringify(order));
  // }
  btnClick(str: string) {
    if (str === '') {
      this.activeNav = str;
      //console.log('clicked', str);
    } else if (str === 'Ready to Ship') {
      this.activeNav = str;
      //console.log('clicked', str);
    } else if (str === 'Shipped') {
      this.activeNav = str;
      //console.log('clicked', str);
    } else if (str === 'Delivered') {
      this.activeNav = str;
      //console.log('clicked', str);
    } else if (str === 'to Return') {
      this.activeNav = str;
      //console.log('clicked', str);
    } else if (str === 'Returned') {
      this.activeNav = str;
      //console.log('clicked', str);
    }
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
    console.log(order.orderDetailsListForSeller);

    order.orderDetailsListForSeller.forEach((product: any) => {
      console.log(product);
      let status = 'status';
      let detailID = product.orderDetailId.toString();

      const sellerSalesMasterDto = {
        userId: uid,
        totalPrice: product.netPrice,

        bUserId: product.bUserId,
        addedBy: 'user',
        addedPC: '0.0.0.0',
        sellerSalesDetailsList: [
          {
            orderNo: product.orderNo,
            productId: product.productId,
            specification: product.specification,
            stockQty: product.stockQty,
            saleQty: product.saleQty,
            unitId: product.unitId,
            netPrice: product.netPrice,
            address: product.address,
            productGroupID: product.productGroupID,
            addedBy: 'user',
            addedPC: '0.0.0.0',
          },
        ],
      };

      // console.log(
      //   orderdetailsIds.toString(),
      //   this.statusArray[this.btnIndex],
      //   status,
      //   sellerSalesMasterDto
      // );
      if (stat === 'Rejected') {
        status = 'Rejected';
      } else {
        status = this.statusArray[this.btnIndex];
      }
      this.sellerService
        .UpdateSellerOrderDetailsStatus(detailID, status, sellerSalesMasterDto)
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
            this.btnIndex = -1;
            this.getData('');
          },
          error: (error: any) => {
            //console.log(error);
          },
        });
    });
  }
  gotoInvoice(orderId: any) {
    sessionStorage.setItem('orderMasterID', orderId);

    const urlToOpen = '/sellerInvoice'; // Replace with your desired URL

    // Use window.open to open the new window/tab
    window.open(urlToOpen, '_blank');
  }
}
