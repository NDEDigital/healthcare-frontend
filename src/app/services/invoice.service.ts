import { Injectable } from '@angular/core';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { API_URL } from '../config';
 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  URL = API_URL;
  // URL = 'https://localhost:7006';
  // URL = 'http://172.16.5.18:8081'; // liveURL

  private InvoiceUrl = `${this.URL}/api/Invoice`;
  constructor(private http: HttpClient) { 
  }
    // invoice
    getBuyerInvoice(  OrderMasterId: number) {
      //console.log('service e aise');
      return this.http.get(`${this.InvoiceUrl}/GetInvoiceDataForBuyer`, {
        params: {   OrderMasterId },
      });
    }
}
