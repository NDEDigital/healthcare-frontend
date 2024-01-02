import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GoodsDataService } from './goods-data.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private selectedProductName: string = '';
  private productCode: string = '';

  groupName = '';
  groupCode = '';
  companyCode = '';

  productType = new Map();
  products = new Map();
  sliderData = new Map();
  productType2 = new Map();
  products2 = new Map();
  editProduct: any;
  deleteProductIndx: number = -1;

  //compare Data code
  compareData: any = {};

  setCompareData(data: any) {
    this.compareData = data;
  }

  // editData(data: any) {
  //   this.editProduct = data;
  //   //console.log(this.editProduct, 'eshe   gesi');
  // }
  deleteData(indx: any) {
    this.deleteProductIndx = indx;
    // //console.log(this.deleteProductIndx, 'delete indx');
  }
  setProductData(products: any, productType: any) {
    this.products = products;
    this.productType = productType;
  }
  setProductData2(products: any, productType: any) {
    this.products2 = products;
    this.productType2 = productType;
  }

  sliderDatafunc(sliderData: any) {
    // //console.log(sliderData);
    this.sliderData = sliderData;
  }
  setNavSelectData(groupCode: string, groupName: string) {
    // this.groupCode = groupCode;
    // this.groupName = groupName;
    sessionStorage.setItem('groupCode', groupCode);
    sessionStorage.setItem('groupName', groupName);
  }

  setCompanyCode(companyCode: string) {
    this.companyCode = companyCode;
    sessionStorage.setItem('companyCode', companyCode);
  }

  getProductType() {
    return this.productType;
  }
  getProducts() {
    return this.products;
  }
  getProductType2() {
    return this.productType2;
  }
  getProducts2() {
    return this.products2;
  }
  getSelectedProductName(): string {
    return this.selectedProductName;
  }
  getProductCode() {
    return this.productCode;
  }

  SelectedNavProductType(Name: string) {
    this.selectedProductName = Name;
    this.productCode = this.products.get(Name);
  }

  private loginStatusSubject = new BehaviorSubject<boolean>(
    localStorage.getItem('loginStatus') === 'true' &&
      localStorage.getItem('proj') === 'HealthCare'
  );

  loginStatus$ = this.loginStatusSubject.asObservable();
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();
  updateLoginStatus(loginStatus: boolean, userCode: any, role: any) {
    localStorage.clear()
    this.loginStatusSubject.next(loginStatus);
    localStorage.setItem('loginStatus', loginStatus.toString());
    localStorage.setItem('proj', 'HealthCare');
    localStorage.setItem('code', userCode);
    // localStorage.setItem('isB', isBuyer);
    localStorage.setItem('role', role);
    // //console.log(this.loginStatus$);
  }
  loggedInUserInfo(user: any) {
    // //console.log(this.user$, '$user');
    this.userSubject.next(user);
    // //console.log(this.userSubject.getValue(), 'this.userSubject.getValue()'); // Print the _value of user$
  }
  getUserInfo() {
    return this.userSubject.getValue();
  }
  constructor(private goodsDataObj: GoodsDataService) {
    // const storedUser = localStorage.getItem('loggedInUser');
    // if (storedUser) {
    //   const user = JSON.parse(storedUser);
    //   this.userSubject.next(user);
    // }
    // this.user$.subscribe((user) => {
    //   //console.log(user, 'this.user$ value'); // Print the value emitted by user$
    // });
  }
}
