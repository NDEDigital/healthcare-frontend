import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AddProductService {
  URL = API_URL;
  createProductGroupURL = `${this.URL}/api/ProductGroups/CreateProductGroups`;

  constructor(private http: HttpClient) {}

  createProductGroup(productData: any) {
    return this.http.post(this.createProductGroupURL, productData);
  }
}
