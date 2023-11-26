import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL, Payment_API_URL } from '../config';

@Injectable({
  providedIn: 'root',
})
export class SslPaymentService {
  postSSL: any;
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

 
  URL = Payment_API_URL
  paymentAPI = `${this.URL}/api/payment/checkoutSSL`;
  // paymentAPI = 'http://192.168.2.204:96/api/payment/checkoutSSL';
  // paymentDataPostAPI = 'http://192.168.2.204:96/api/Payment';
  paymentDataPostAPI = `${this.URL}/api/Payment`;

  // paymentAPI = 'https://localhost:44365/api/payment';
  callApi(totalCount: any, totalPrice: any, uniqueString: any) {
    let postSSL = {
      TotalAmount: totalPrice,
      NumOfItem: totalCount,
      TranId: uniqueString,
    };
    this.http
      .post(this.paymentAPI, postSSL, { responseType: 'text' })
      .subscribe(
        (response) => {
          console.log('payment redirect link', response);
          window.location.href = response;
        },
        (error) => {
          console.error('payment link error', error);
        }
      );
  }
  postPaymentAPI(totalPrice: any, uniqueString: any) {
    let payment = {
      totalAmount: totalPrice,
      status: 'panding',
      TranId: uniqueString,
    };
    this.http
      .post(this.paymentDataPostAPI, payment, { responseType: 'text' })
      .subscribe(
        (response) => {
          console.log('payment redirect link', response);
         // window.location.href = response;
        },
        (error) => {
          console.error('payment link error', error);
        }
      );
  }
}
