import { Component } from '@angular/core';
import { OrderApiService } from 'src/app/services/order-api.service';
import { InvoiceService } from 'src/app/services/invoice.service';
 
@Component({
  selector: 'app-seller-invoice',
  templateUrl: './seller-invoice.component.html',
  styleUrls: ['./seller-invoice.component.css'],
})
export class SellerInvoiceComponent {
  orderID = 0;
  userId:any=0
  invoice: any = [];
  test = 0;

  constructor(private InvoiceService: InvoiceService) {
    const orderIDString = sessionStorage.getItem('orderMasterID');
   this.userId = localStorage.getItem('code');
    if (orderIDString !== null) {
      this.orderID = parseInt(orderIDString, 10);
      // Now, orderID contains the parsed value if it was not null
    } else {
      alert('No order found')!;
    }
   console.log(" orderId", this.orderID)
    this.InvoiceService.getBuyerInvoice(
      this.orderID
    ).subscribe({
      next: (response: any) => {
        console.log(' invoice data ', response);
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
