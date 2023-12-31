import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CartDataService } from 'src/app/services/cart-data.service';
import { OrderApiService } from 'src/app/services/order-api.service';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  @ViewChild('exampleModal') modal: any; // Access the modal element
  constructor(
    private elementRef: ElementRef,
    private cartDataService: CartDataService,
    private orderApiService: OrderApiService,
    private router: Router
  ) {}

  totalItems: number = 0;
  totalAmount: number = 0;
  BkashMblNumber: any = '015*****381';
  payment_method: string = '';
  button_text: string = '';
  isCard: boolean = false;

  subTotal_text: string = '';

  ngOnInit() {
    this.totalAmount = this.cartDataService.getTotalPriceWithDelivery();
    this.totalItems = this.cartDataService.getCartData().cartDataDetail.size;
  }

  selectedPaymentType(type: string) {
    const paymentDiv =
      this.elementRef.nativeElement.querySelectorAll('.payment_card');
    this.isCard = false;
    if (this.payment_method == type) {
      this.payment_method = '';
      for (let i = 0; i < paymentDiv.length; i++) {
        paymentDiv[i].style.backgroundColor = '';
      }
    } else {
      this.payment_method = type;

      // ////console.log(' div', paymentDiv);
      for (let i = 0; i < paymentDiv.length; i++) {
        if (paymentDiv[i].classList.contains(type)) {
          paymentDiv[i].style.backgroundColor = 'rgb(230, 242, 252)';
        } else {
          paymentDiv[i].style.backgroundColor = '';
        }
      }

      if (type == 'CashOn') {
        this.subTotal_text =
          'You can pay in cash to our courier when you receive the goods at your doorstep.';
        this.button_text = 'Confirm Order';
      } else if (type == 'Card') {
        this.isCard = true;
        this.button_text = 'Pay Now';
      } else {
        this.subTotal_text = `Your ${this.payment_method} account ${this.BkashMblNumber} will be charged.`;
        this.button_text = 'Pay Now';
      }
    }
  }

  confirmOrder() {
    this.orderApiService.insertOrderData().subscribe(
      (response) => {
        if (response.message === 'Data inserted successfully.') {
          alert('success');
          this.cartDataService.clearCartData();
          this.router.navigate(['/']);
        } else {
          ////console.log('not success');
        }
      },
      (error) => {
        alert('Error try Again');
        this.router.navigate(['/cartView']);
        ////console.error('Error:', error);
      }
    );
  }
}
