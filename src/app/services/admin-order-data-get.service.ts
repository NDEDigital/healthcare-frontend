import { HttpClient,HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminOrderModel } from '../Model/AdminOrderModel';
import { API_URL } from '../config';

@Injectable({
  providedIn: 'root',
})
export class AdminOrderDataGetService {
  URL = API_URL;
  // URL = 'https://localhost:7006';
  // URL = 'http://172.16.5.18:8081'; // liveURL

  private baseUrl = `${this.URL}/api/Order`;
  private invoiceUrl = `${this.URL}`;
  constructor(private http: HttpClient) {}


  // master data
  getOrderMasterData(status?: string): Observable<any[]> {
    let url = `${this.baseUrl}/GetOrderMasterData`;
    if (status) {
      url += `?status=${status}`;
    }
    return this.http.get<any[]>(url);
  }

  // details data
  getOrderDetailData(orderMasterId: number, status?: string): Observable<any[]> {
    let url = `${this.baseUrl}/GetOrderDetailData`;
    let params = new HttpParams().set('OrderMasterId', orderMasterId.toString());
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<any[]>(url, { params });
  }

  // get data
  GetOrderData(pageNumber: number, pageSize: number,  status: string, searchby: string , serchValue: string  ): Observable<AdminOrderModel[]> {

    const url = `${this.baseUrl}/GetOrderData/${pageNumber}/${pageSize}/${status}/${searchby}/${serchValue}`;

    return this.http.get<AdminOrderModel[]>(url);
  }


// get data
GetOrderDataSearch(pageNumber: number, pageSize: number,  status: string, searchby: string , serchValue: string  ): Observable<any> {
  // console.log(" sent in api status",status);
  const url = `${this.baseUrl}/GetOrderData/${pageNumber}/${pageSize}/${status}/${searchby}/${serchValue}`;
  // const url = `${this.baseUrl}/GetOrderData/${pageNumber}/${pageSize}/${status} `;
  return this.http.get<any>(url);
}



  //  update status
  updateOrderStatus(orderMasterId: string, detailsCancelledId: string | null, status: string): Observable<any> {
    console.log(" orderMasterId, detailsCancelledId, status",orderMasterId, detailsCancelledId, status)
    const url = `${this.baseUrl}/AdminOrderUpdateStatus`;
    let params = new HttpParams().set('orderMasterId', orderMasterId);

    if (detailsCancelledId) {
      params = params.set('detailsCancelledId', detailsCancelledId);
    }

    params = params.set('status', status);

    return this.http.put<any>(url, {}, { params });
  }



  // getDataByDate

  getDataByDate(pageNumber: number, pageSize: number,  status: string, searchby: string , serchValue: string , fromDate: any ,toDate: any ): Observable<AdminOrderModel[]> {
    console.log(" sent in api status", fromDate, toDate);

    const formData = new FormData();
    // if (fromDate!=""&& toDate!="" ){
      formData.append('fromDate', fromDate);
      formData.append('toDate', toDate);


    const url = `${this.baseUrl}/GetOrderDataByDate/${pageNumber}/${pageSize}/${status}/${searchby}/${serchValue}`;
    // const url = `${this.baseUrl}/GetOrderData/${pageNumber}/${pageSize}/${status} `;
    return this.http.post<AdminOrderModel[]>(url,formData);
  }

 // get details data
 GetDetatilsData(OrderMasterId: number): Observable<any> {
  const formData = new FormData();

  formData.append('OrderMasterId', OrderMasterId.toString()); // Leave it as an integer

  const url = `${this.baseUrl}/GetDatailsData/`;
  return this.http.post<any>(url, formData);
}


  // invoice
  getInvoiceForAdminOrder(  OrderMasterId: number) {
    console.log('service e aise');
    console.log(" orderMasterId ",OrderMasterId )
    return this.http.get(`${this.invoiceUrl}/api/Invoice/GetInvoiceDataForAdmin`, {
      params: {
        OrderMasterId: OrderMasterId, // Ensure it's converted to string
      },
    });
    // return this.http.get(`https://localhost:7006/api/Invoice/GetInvoiceDataForAdmin?OrderMasterId=6`);
  }
 
}



