import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { orderInfo } from 'src/app/orderInfo';
import { API_URL } from '../config';

//import{ buyerOrderData } from 'src/app/Model/buyerOrderData';
@Injectable({
  providedIn: 'root',
})
export class SellerOrderOverviewService {
  constructor(private http: HttpClient) {}
  URL = API_URL;
  // getOrderInfoURL = `${this.URL}/api/Order/getAllOrderForSeller`;
  getOrderInfoURL = `${this.URL}/api/Order/getSearchedAllOrderForSeller`;
  updateOrderStatusURL = `${this.URL}/api/Order/updateSellerOrderStatus`;
  updateDetaiilsOrderStatusURL = `${this.URL}/api/Order/updateDetailsOrderStatus`;
  getUsersDataURL = `${this.URL}/api/Order/getBuyerInfo`;
  SellerInventory = `${this.URL}/GetSellerInventoryDataBySellerId/`;
  // getBuyerDataURL = `${this.URL}/api/Order/GetBuyerOrderData?`;
  // getOrderInfo(sellerId: any) {
  //   // const ordersInfos = of(OrdersInfos);
  //   // return this.http.get<orderInfo[]>(
  //   //   `https://localhost:7006/api/Order/GetSellerOrderOverview?SellerId=${SellerId}`
  //   // );
  //   return this.http.get(this.getOrderInfoURL, { params: { sellerId } });
  // }
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

  // getBuyerOrderData(orderMasterId: any) {
  //   return this.http.get<buyerOrderInfo[]>(this.getOrderInfoURL, {
  //     params: {
  //       orderMasterId: orderMasterId,
  //     },
  //   });
  // }

  // getBuyerOrderData(orderMasterId: any) {
  //   return this.http.get(this.getBuyerDataURL, {
  //     params: {
  //       orderMasterId,
  //     },
  //   });
  // }

  // updateOrderStatus(
  //   OrderMasterIds: string,
  //   StatusValue: string
  // ) {
  //   // return this.http.put(
  //   //   `https://localhost:7006/api/SellerOrderOverview/UpdateStatus/${OrderMasterIds}?value=${StatusValue}`,
  //   // );
  // ;
  // }
  updateOrderStatus(
    OrderMasterIds: string,
    StatusValue: string,
    sellerCode: any
  ) {
    console.log(OrderMasterIds, StatusValue, 'dsadsaasd');
    const formData = new FormData();
    formData.append('idList', OrderMasterIds);
    formData.append('status', StatusValue);
    formData.append('sellerCode', sellerCode);
    return this.http.put(this.updateOrderStatusURL, formData);
  }

  // by marufa
  GetReturnData(status: string, pageNumber: number, pageSize: number) {
    console.log('service e aise stua', status);
    const formData = new FormData();
    formData.append('status', status);
    return this.http.post(
      `${this.URL}/api/Order/GetReturnData/${pageNumber}/${pageSize}`,
      formData
    );
  }
  // by marufa
  GetReturnDataWithSearch(
    status: string,
    pageNumber: number,
    pageSize: number,
    searchby: string,
    searchValue: string,
    fromDate: any,
    toDate: any
  ) {
    console.log('load return data', status);
    const formData = new FormData();
    formData.append('status', status);
    formData.append('searchby', searchby);
    formData.append('searchValue', searchValue);
    formData.append('fromDate', fromDate);
    formData.append('toDate', toDate);
    return this.http.post(
      `${this.URL}/api/Order/getReturnDataForAdmin/${pageNumber}/${pageSize}`,
      formData
    );
  }

  updateDetailsStatus(OrderDetailsIds: string, StatusValue: string) {
    console.log(
      OrderDetailsIds,
      StatusValue,
      'OrderDetailsIds, StatusValue on Return Update'
    );
    const formData = new FormData();
    formData.append('idList', OrderDetailsIds);
    formData.append('status', StatusValue);

    return this.http.put(this.updateDetaiilsOrderStatusURL, formData);
  }
  getUsersData(idList: any) {
    console.log(idList);
    return this.http.get(this.getUsersDataURL, { params: { idList } });
  }

  getSellerInventory(userId: any) {
    return this.http.get<any>(this.SellerInventory + userId, {});
  }
}
