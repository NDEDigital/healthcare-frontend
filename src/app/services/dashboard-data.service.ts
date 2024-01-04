import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../config';

@Injectable({
  providedIn: 'root',
})
export class DashboardDataService {

  URL = API_URL
  // URL = 'https://localhost:7006'; // LocalURL
  // URL = 'http://172.16.5.18:8081'; // liveURL


  addProductURL = `${this.URL}/AddProduct`;
  updateProductURL = `${this.URL}/UpdateProduct`;
  deleteProductURL = `${this.URL}/DeleteProduct`;

  getDashboardContentURl = `${this.URL}/GetDashboardContents`;
  updateProductStatusURl = `${this.URL}/UpdateProductStatus`;
  comapreEditedProductURL = `${this.URL}/comapreEditedProduct`;
  constructor(private http: HttpClient) {}
  addProduct(productData: any) {
    return this.http.post(this.addProductURL, productData);
  }
  updateProduct(productData: any) {
    return this.http.put(this.updateProductURL, productData);
  }
  deleteProduct(sellerCode: any, productId: any) {
    return this.http.delete(this.deleteProductURL, {
      params: { sellerCode, productId },
    });
  }
  getDashboardContents(
    sellerCode: any,
    status: any,
    productName: any,
    companyName: any,
    addedDate: any
  ) {
    //console.log(sellerCode, status, productName, companyName, addedDate);

    return this.http.get(this.getDashboardContentURl, {
      params: { sellerCode, status, productName, companyName, addedDate },
    });
  }
  updateProductStatus(
    usercode: any,
    productIds: any,
    status: any,
    statusBefore: any,
    updatedPC: any
  ) {
    const formData = new FormData();
    formData.append('usercode', usercode);
    formData.append('productIds', productIds);
    formData.append('status', status);
    formData.append('statusBefore', statusBefore);
    formData.append('updatedPC', updatedPC);
    formData.forEach((value, key) => {
      //console.log(key, value);
    });
    const response = this.http.put(this.updateProductStatusURl, formData);

    return response;
  }
  comapreEditedProduct(productId: any) {
    //console.log(productId);
    return this.http.get(this.comapreEditedProductURL, {
      params: { productId },
    });
  }
}
