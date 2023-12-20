import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AddProductService {
  URL = API_URL;
  // URL = 'https://localhost:7006';
  // URL = 'http://172.16.5.18:8081'; // liveURL

  private getdetailsData = `${this.URL}/ProductQuantity/GetProductForAddQtyByUserId`;
  constructor(private http: HttpClient) {
   }


     // get dfetails data
    GetProductDetailsData(CompanyCode: any) {
 
    return this.http.get(`${this.getdetailsData}/${CompanyCode}`);
  }
}
