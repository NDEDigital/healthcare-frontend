import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // Import Observable from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class AddProductService {
  URL = API_URL;
  // URL = 'https://localhost:7006';
  // URL = 'http://172.16.5.18:8081'; // liveURL

  private getdetailsData = `${this.URL}/ProductQuantity/GetProductForAddQtyByUserId`;
  private postData = `${this.URL}/ProductQuantity/PortalReceivedPost`;
  createProductGroupURL = `${this.URL}/api/ProductGroups/CreateProductGroups`;

  getProductGropURL = `${this.URL}/api/ProductGroups/GetProductGroupsList`;

  getUnitURL = `${this.URL}/api/HK_Gets/GetUnitList`;

 GetProductDataURL = `${this.URL}/GetSellerProductForAdminApproval`;
  createProductListURL = `${this.URL}/api/ProductList/CreateProductList`;
  constructor(private http: HttpClient) {
   }

   createProductGroup(productData: any) {
    return this.http.post(this.createProductGroupURL, productData);
  }

  // get dfetails data
 GetProductDetailsData(CompanyCode: any) {

 return this.http.get(`${this.getdetailsData}/${CompanyCode}`);
}

// post data
insertPortalReceived(portalData: any): Observable<any> {
 return this.http.post<any>(`${this.postData}`, portalData);
}
// seller product data 
getProductData( status : string){
  return this.http.get(this.GetProductDataURL, {
    params: { status },
  });
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
