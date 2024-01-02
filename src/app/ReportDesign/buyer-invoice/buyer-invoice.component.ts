import { Component } from '@angular/core';
import { AdminOrderDataGetService } from 'src/app/services/admin-order-data-get.service';

@Component({
  selector: 'app-buyer-invoice',
  templateUrl: './buyer-invoice.component.html',
  styleUrls: ['./buyer-invoice.component.css']
})
export class BuyerInvoiceComponent {
  orderID = 0;
  invoice: any = [];
  test = 0;
  constructor(private AdminOrderDataGetService: AdminOrderDataGetService) {
    const orderIDString = sessionStorage.getItem('orderMasterID');
    if (orderIDString !== null) {
      this.orderID = parseInt(orderIDString, 10);
      // Now, orderID contains the parsed value if it was not null
    } else {
      alert('No order found')!;
    }

    this.AdminOrderDataGetService.getInvoiceForAdminOrder(
      this.orderID
    ).subscribe({
      next: (response: any) => {
        //console.log(' invoice data ', response);
        this.invoice = response.invoice;
   
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
  }
  ngOnInit() {
    //console.log('aise');
  }
}
