import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  // seller
  sellerOrderUpdate = `${this.URL}/api/Order/UpdateSellerOrderDetailsStatus`;

  // ========== new code ==========
  getSellerOrderData = `${this.URL}/api/Order/GetSellerOrderBasedOnUserID`;
  UpdateSellerOrderDetailsStatusURL = `${this.URL}/api/Order/UpdateSellerOrderDetailsStatus`;

  // get data
  getsellerOrderData(userId: string, status?: string): Observable<any[]> {
    let params = new HttpParams().set('userid', userId);
    if (status) {
      params = params.set('status', status);
    }
    const url = `${this.getSellerOrderData}`;
    return this.http.get<any[]>(url, { params });
  }
  UpdateSellerOrderDetailsStatus(
    orderdetailsIds: string,
    status: string,
    sellerSalesMasterDto: any
  ) {
    console.log('Data sent to server:', '1', status, sellerSalesMasterDto);
    const updateOrder = {
      orderdetailsIds: orderdetailsIds,
      status: status,
      sellerSalesMasterDto: sellerSalesMasterDto,
    };
    console.log(updateOrder, 'updateOrder');

    return this.http.put(this.UpdateSellerOrderDetailsStatusURL, updateOrder);
  }

  // ======================== OLD code =====================

  //  update status
  updatesellerOrderStatus(
    orderMasterId: string,
    detailsCancelledId: string | null,
    status: string
  ): Observable<any> {
    // console.log(
    //   ' orderMasterId, detailsCancelledId, status',
    //   orderMasterId,
    //   detailsCancelledId,
    //   status
    // );
    const url = `${this.sellerOrderUpdate}`;
    let params = new HttpParams().set('orderMasterId', orderMasterId);

    if (detailsCancelledId) {
      params = params.set('detailsCancelledId', detailsCancelledId);
    }

    params = params.set('status', status);

    return this.http.put<any>(url, {}, { params });
  }

  getOrderInfo(
    sellerId: any,
    status: string,
    pageNumber: number,
    pageSize: number
  ) {
    //console.log(status, "asodfjofasdhnpodnp'fp");

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
    //console.log(status, "asodfjofasdhnpodnp'fp");
    // console.log(
    //   sellerId,
    //   status,
    //   pageNumber,
    //   pageSize,
    //   SearchOrderNumber,
    //   SearchedPaymentMethod,
    //   SearchedStatus
    // );

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
    //console.log(OrderMasterIds, StatusValue, 'dsadsaasd');

    const formData = new FormData();
    formData.append('idList', OrderMasterIds);
    formData.append('value', StatusValue);

    return this.http.put(this.updateOrderStatusURL, formData);
  }

  getInvoiceForSeller(OrderID: number) {
    //console.log('service e aise');
    return this.http.get(this.getInvoiceForSellerURL, {
      params: { OrderID },
    });
  }
}
