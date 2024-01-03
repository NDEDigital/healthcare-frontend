import { Component } from '@angular/core';
import { SellerOrderOverviewService } from 'src/app/services/seller-order-overview.service';
@Component({
  selector: 'app-seller-order',
  templateUrl: './seller-order.component.html',
  styleUrls: ['./seller-order.component.css'],
})
export class SellerOrderComponent {
  btnIndex = -1;
  sellerOrderData: any;
  imagePath = '';
  status = '';
  imageTitle = 'No Data Found!';
  selectedCompanyCodeValues: { [key: string]: number } = {};
  headerCheckboxChecked: boolean = false;
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

  constructor(private sellerService: SellerOrderOverviewService) {}

  ngOnInit() {
    this.getData(this.status);
  }

  getData(status: string) {
    this.status = status;
    const userId = localStorage.getItem('code');
    if (userId) {
      this.sellerService.getsellerOrderData(userId, status).subscribe({
        next: (response: any) => {
          console.log(response);
          this.sellerOrderData = response;
          //console.log(' data ', this.sellerOrderData);
          this.sellerOrderData = this.sellerOrderData.map((item: any) => ({
            ...item,
            isChecked: false,
          }));
          //console.log('data after', this.sellerOrderData);
        },
        error: (error: any) => {
          //console.log(error);
        },
      });
    }
  }
  toggleAllCheckboxes() {
    this.sellerOrderData.forEach((row: any) => {
      row.checked = this.headerCheckboxChecked;
    });
  }
  showImage(path: any, title: any) {
    //console.log(path, title);
    this.imagePath = path.split('src')[1];
    this.imageTitle = title;
  }

  updateOrder(orderdetailsIds: any, product: any) {
    let uidS = localStorage.getItem('code');
    let uid;
    if (uidS) uid = parseInt(uidS, 10);

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
    let status = 'status';

    let detailID = orderdetailsIds.toString();
    // console.log(
    //   orderdetailsIds.toString(),
    //   this.statusArray[this.btnIndex],
    //   status,
    //   sellerSalesMasterDto
    // );
    this.sellerService
      .UpdateSellerOrderDetailsStatus(
        detailID,
        this.statusArray[this.btnIndex],
        sellerSalesMasterDto
      )
      .subscribe({
        next: (response: any) => {
          //console.log(response);
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
  }
  gotoInvoice(orderId: any) {
    sessionStorage.setItem('orderMasterID', orderId);

    const urlToOpen = '/sellerInvoice'; // Replace with your desired URL

    // Use window.open to open the new window/tab
    window.open(urlToOpen, '_blank');
  }
}
