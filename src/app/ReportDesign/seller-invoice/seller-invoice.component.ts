import { Component, ElementRef, ViewChild } from '@angular/core';
import { OrderApiService } from 'src/app/services/order-api.service';
import { InvoiceService } from 'src/app/services/invoice.service';

import * as jspdf from 'jspdf';
import * as html2pdf from 'html2canvas';

import html2canvas from 'html2canvas';
@Component({
  selector: 'app-seller-invoice',
  templateUrl: './seller-invoice.component.html',
  styleUrls: ['./seller-invoice.component.css'],
})
export class SellerInvoiceComponent {
  @ViewChild('content', { static: false }) content: ElementRef | undefined;
  orderID = 0;
  userId: any = 0;
  invoice: any = [];
  test = 0;

  constructor(private InvoiceService: InvoiceService) {
    const orderIDString = sessionStorage.getItem('orderMasterID');
    this.userId = localStorage.getItem('code');
    this.invoice = {};
    if (orderIDString !== null) {
      this.orderID = parseInt(orderIDString, 10);
      // Now, orderID contains the parsed value if it was not null
    } else {
      alert('No order found')!;
    }
    console.log(' orderId', this.orderID);
    this.InvoiceService.getBuyerInvoice(this.orderID).subscribe({
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
  downloadAsPDF() {
    if (this.content) {
      const content = this.content.nativeElement;

      html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('Invoice.pdf');
      });
    } else {
      console.error('Content element is undefined or not available.');
    }
  }

  getNonRejectedProductCount(): number {
    return this.invoice.orderInvoiceDetailList
      ? this.invoice.orderInvoiceDetailList.filter(
          (product: any) => product.status !== 'Rejected'
        ).length
      : 0;
  }


  calculateTotal(): number {
    if (!this.invoice.orderInvoiceDetailList) {
      return 0;
    }

    return this.invoice.orderInvoiceDetailList.reduce((acc: any, product : any) => {
      if (product.status !== 'Rejected') {
        return acc + (product.quantity * product.price);
      }
      return acc;
    }, 0);
  }
}
