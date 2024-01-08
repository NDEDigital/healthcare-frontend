import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SellerOrderOverviewService } from 'src/app/services/SellerOrderOverviewService';
import { OrderApiService } from 'src/app/services/order-api.service';

@Component({
  selector: 'app-buyer-order-details',
  templateUrl: './buyer-order-details.component.html',
  styleUrls: ['./buyer-order-details.component.css'],
})
export class BuyerOrderDetailsComponent implements OnInit {
  order: any = [];
  orderNo = '';
  packageMap = new Map();
  currentStatus: string = '';
  item: any;
  constructor(private orderApi: OrderApiService) {}

  ngOnInit() {
    const orderNOString = sessionStorage.getItem('orderNo');
    if (orderNOString !== null) {
      this.orderNo = JSON.parse(orderNOString);
    }
    this.orderApi.getSingleOrderForBuyer(this.orderNo).subscribe({
      next: (response: any) => {
        console.log(response);
        this.order = response;

        // console.log(this.productsData,"all data");
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
    // const orderString = sessionStorage.getItem('order');
    // //console.log();

    // if (orderString !== null) {
    //   this.order = JSON.parse(orderString);

    //   for (let orderDetail of this.order.orderDetailsList) {
    //     const sellerCode = orderDetail.sellerCode;
    //     const orderDetailsForSellerCode = this.packageMap.get(sellerCode);

    //     if (!orderDetailsForSellerCode) {
    //       this.packageMap.set(sellerCode, [orderDetail]);
    //     } else {
    //       orderDetailsForSellerCode.push(orderDetail);
    //     }
    //   }

    //   // Add the map to the order object.
    //   this.packageMap = this.packageMap;
    // } else {
    //   //console.log('Order not found in session storage');
    // }
    // //console.log(this.order);
    // //console.log(this.packageMap);
  }
  goToDetail(detail: any) {
    this.item = detail;
    //console.log(detail, 'detail prod');

    let obj = {
      approveSalesQty: this.item.quantity,
      companyName: this.item.companyName,
      dimensionUnit: this.item.dimensionUnit,
      finish: this.item.finish,
      goodsID: this.item.goodsId,
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
    sessionStorage.setItem('productData', JSON.stringify(obj));
    // this.route.navigate(['/productDetails']);
    window.open('/productDetails', '_blank');
  }
  // Adjust the percentage as needed
  getLineWidth(status: string): number {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Processing':
        return 25;
      case 'Ready to Ship':
        return 50;
      case 'Shipped':
        return 75;
      case 'Delivered':
        return 100;
      default:
        return 0;
    }
  }
}
