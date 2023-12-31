import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
@Injectable({
  providedIn: 'root',
})
export class ProductReturnServiceService {
  //baseUrl = 'http://172.16.5.18:8081/ProductReturn'; // liveURL

  URL = API_URL;
  baseUrl = `${this.URL}/ProductReturn`;
  constructor(private http: HttpClient) {}

  getReturnType(): Observable<any> {
    const url = `${this.baseUrl}/GetReturnType`;
    return this.http.get<any>(url);
  }

  insertData(returnData: any): Observable<any> {
    console.log(' in service ', returnData);
    // const formData = new FormData();
    // formData.append('returnData', returnData);
    const url = `${this.baseUrl}/InsertReturnedData`;
    return this.http.post<any>(url, returnData);
  }
  updateStatus(status: string, orderMasterId: string) {
    console.log(' in service ', status);
    const formData = new FormData();
    formData.append('status', status);
    formData.append('idList', orderMasterId);
    const url = `${this.baseUrl}/InsertReturnedData`;
    return this.http.put(url, formData);
  }

  //  update status
  updateOrderStatus(
    orderMasterId: string,
    detailsApprovedId: string,
    detailsCancelledId: string,
    StatusValue: string
  ) {
    const url = `${this.baseUrl}/AdminOrderUpdateStatus`;
    const formData = new FormData();
    formData.append('orderMasterId', orderMasterId);
    formData.append('detailsApprovedId', detailsApprovedId);
    formData.append('detailsCancelledId', detailsCancelledId);
    formData.append('status', StatusValue);
    return this.http.put(url, formData);
  }
}
