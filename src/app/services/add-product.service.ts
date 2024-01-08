import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // Import Observable from 'rxjs'
@Injectable({
  providedIn: 'root',
})
export class AddProductService {
  URL = API_URL;
  // URL = 'https://localhost:7006';
  // URL = 'http://172.16.5.18:8081'; // liveURL

  private getdetailsData = `${this.URL}/ProductQuantity/GetProductForAddQtyByUserId`;
  private postData = `${this.URL}/ProductQuantity/PortalReceivedPost`;
  createProductGroupURL = `${this.URL}/api/ProductGroups/CreateProductGroups`;

  getProductGropURL = `${this.URL}/api/ProductGroups/GetProductGroupsList`;
  GetProductGroupsListByStatusURL = `${this.URL}/api/ProductGroups/GetProductGroupsListByStatus`;
  GetProductListByStatusURL = `${this.URL}/api/ProductList/GetProductListByStatus`;

  getUnitURL = `${this.URL}/api/HK_Gets/GetUnitList`;

  GetProductDataURL = `${this.URL}/GetSellerProductForAdminApproval`;
  getAllproducts = `${this.URL}/api/ProductList/GetProductList`;

  createProductListURL = `${this.URL}/api/ProductList/CreateProductList`;
  updateProductURL = `${this.URL}/SellerProductStatusUpdate`;

  CreateSellerProductPriceURL = `${this.URL}/ProductQuantity/CreateSellerProductPriceAndOffer`;
  GetProductsByStatusURL = `${this.URL}/ProductQuantity/GetSellerProductsByCompanyCode`;

  updateProductGroupURL = `${this.URL}/api/ProductGroups/UpdateProductGroups`;

  constructor(private http: HttpClient) {}

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
  getProductData(status: string) {
    return this.http.get(this.GetProductDataURL, {
      params: { status },
    });
  }
  GetProductGroupsListByStatus(status: any) {
    if (status === -1) {
      return this.http.get(this.GetProductGroupsListByStatusURL);
    } else {
      return this.http.get(this.GetProductGroupsListByStatusURL, {
        params: { status },
      });
    }
  }
  GetProductListByStatus(status: any) {
    if (status === -1) {
      return this.http.get(this.GetProductListByStatusURL);
    } else {
      return this.http.get(this.GetProductListByStatusURL, {
        params: { status },
      });
    }
  }
  GetProductsByStatus(userID: any, status: any) {
    return this.http.get(this.GetProductsByStatusURL, {
      params: { userID, status },
    });
  }

  getProductGroups() {
    return this.http.get(this.getProductGropURL);
  }

  getUnitGroups() {
    return this.http.get(this.getUnitURL);
  }

  createProductList(productStatus: any) {
    return this.http.post(this.createProductListURL, productStatus);
  }
  updateProduct(productListData: any) {
    return this.http.put(this.updateProductURL, productListData);
  }

  updateProductGroup(groupListData: any) {
    return this.http.put(this.updateProductGroupURL, groupListData);
  }

  getallProducts() {
    return this.http.get(this.getAllproducts);
  }

  createSellerProductPrice(productListInsertData: any) {
    return this.http.post(
      this.CreateSellerProductPriceURL,
      productListInsertData
    );
  }
}
