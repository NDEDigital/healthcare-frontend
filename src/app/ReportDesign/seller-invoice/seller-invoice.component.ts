import { Component } from '@angular/core';
import { OrderApiService } from 'src/app/services/order-api.service';
import { SellerOrderOverviewService } from 'src/app/services/seller-order-overview.service';

@Component({
  selector: 'app-seller-invoice',
  templateUrl: './seller-invoice.component.html',
  styleUrls: ['./seller-invoice.component.css'],
})
export class SellerInvoiceComponent {
  orderID = 0;
  invoice: any = [];
  constructor(private orderService: SellerOrderOverviewService) {}
  ngOnInit() {
    console.log('aise');

    const userCode = localStorage.getItem('code');
    const orderIDString = sessionStorage.getItem('orderID');
    if (orderIDString !== null) {
      this.orderID = parseInt(orderIDString, 10);
      // Now, orderID contains the parsed value if it was not null
    } else {
      alert('No order found')!;
    }
    this.orderService.getInvoiceForSeller(userCode, this.orderID).subscribe({
      next: (response: any) => {
        console.log(response);
        this.invoice = response.invoice;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}
