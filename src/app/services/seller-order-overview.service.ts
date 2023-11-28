import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { orderInfo } from 'src/app/orderInfo';
import { API_URL } from '../config';
//import{ buyerOrderData } from 'src/app/Model/buyerOrderData';

@Injectable({
  providedIn: 'root',
})
export class SellerOrderOverviewService {
  constructor(private http: HttpClient) {}
  URL = API_URL;
  //URL = 'https://localhost:7006'; //LocalURL
  // URL = 'http://172.16.5.18:8081'; // liveURL
  // getOrderInfoURL = `${this.URL}/api/Order/getAllOrderForSeller`;

  getOrderInfoURL = `${this.URL}/api/Order/getSearchedAllOrderForSeller`;
  updateOrderStatusURL = `${this.URL}/api/Order/updateSellerOrderStatus`;
  getInvoiceForSellerURL = `${this.URL}/api/Invoice/GetInvoiceDataForSeller`;

  getOrderInfo(
    sellerId: any,
    status: string,
    pageNumber: number,
    pageSize: number
  ) {
    console.log(status, "asodfjofasdhnpodnp'fp");

    return this.http.get<orderInfo[]>(this.getOrderInfoURL, {
      params: {
        sellerCode: sellerId,
        PageNumber: pageNumber,
        PageSize: pageSize,
        status: status,
      },
    });
  }
  getSearchedOrderInfo(
    sellerId: any,
    status: string,
    pageNumber: number,
    pageSize: number,
    SearchOrderNumber: any,
    SearchedPaymentMethod: any,
    SearchedStatus: any
  ) {
    console.log(status, "asodfjofasdhnpodnp'fp");
    console.log(
      sellerId,
      status,
      pageNumber,
      pageSize,
      SearchOrderNumber,
      SearchedPaymentMethod,
      SearchedStatus
    );

    return this.http.get<orderInfo[]>(this.getOrderInfoURL, {
      params: {
        sellerCode: sellerId,
        PageNumber: pageNumber,
        PageSize: pageSize,
        status: status,
        SearchedOrderNo: SearchOrderNumber,
        SearchedPaymentMethod: SearchedPaymentMethod,
        SearchedStatus: SearchedStatus,
      },
    });
  }


  updateOrderStatus(OrderMasterIds: string, StatusValue: string) {
    console.log(OrderMasterIds, StatusValue, 'dsadsaasd');

    const formData = new FormData();
    formData.append('idList', OrderMasterIds);
    formData.append('value', StatusValue);

    return this.http.put(this.updateOrderStatusURL, formData);
  }

  getInvoiceForSeller(sellerCode: any, OrderID: number) {
    console.log('service e aise');
    return this.http.get(this.getInvoiceForSellerURL, {
      params: { sellerCode, OrderID },
    });
  }



}
