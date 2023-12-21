import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AddProductService {
  URL = API_URL;
  createProductGroupURL = `${this.URL}/api/ProductGroups/CreateProductGroups`;

  getProductGropURL = `${this.URL}/api/ProductGroups/GetProductGroupsList`;

  getUnitURL = `${this.URL}/api/HK_Gets/GetUnitList`;


  createProductListURL = `${this.URL}/api/ProductList/CreateProductList`;

  constructor(private http: HttpClient) {}

  createProductGroup(productData: any) {
    return this.http.post(this.createProductGroupURL, productData);
  }


  getProductGroups(){
    return this.http.get(this.getProductGropURL);
  }

  getUnitGroups(){
    return this.http.get(this.getUnitURL);
  }

  createProductList(productListData: any) {
    return this.http.post(this.createProductListURL, productListData);
  }


}
