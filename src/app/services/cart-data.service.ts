import { Injectable } from '@angular/core';
import { CartItem } from '../Pages/cart-added-product/cart-item.interface';

@Injectable({
  providedIn: 'root',
})
export class CartDataService {
  constructor() {}

  private cartCount: number = 0;
  private cartDataDetail = new Map<string, CartItem>();
  private cartDataQt = new Map<string, number>();
  private totalPrice: number = 0.0;
  private totalPriceWithDelivery = 0;
  // private saveLaterDataDetail = new Map<string, CartItem>();
  // private saveLaterDataQt = new Map<string, number>();

  initializeAndLoadData() {
    let localData = localStorage.getItem('cartDataDetail');
    let localDataQt = localStorage.getItem('cartDataQt');
    let localTotalPrice = localStorage.getItem('totalPrice');
    let localCartCount = localStorage.getItem('cartCount');

    if (localCartCount) {
      this.cartCount = JSON.parse(localCartCount);
    } else {
      localStorage.setItem('cartCount', JSON.stringify(this.cartCount));
    }

    if (localTotalPrice) {
      this.totalPrice = JSON.parse(localTotalPrice);
    } else {
      localStorage.setItem('totalPrice', JSON.stringify(this.totalPrice));
    }

    if (localData) {
      this.cartDataDetail = new Map<string, CartItem>(JSON.parse(localData));
    } else {
      localStorage.setItem(
        'cartDataDetail',
        JSON.stringify(Array.from(this.cartDataDetail.entries()))
      );
    }

    if (localDataQt) {
      this.cartDataQt = new Map<string, number>(JSON.parse(localDataQt));
    } else {
      localStorage.setItem(
        'cartDataQt',
        JSON.stringify(Array.from(this.cartDataQt.entries()))
      );
    }
  }

  loadIntoLocalStorage() {
        localStorage.setItem('cartCount', JSON.stringify(this.cartCount));
        localStorage.setItem('totalPrice', JSON.stringify(this.totalPrice));
        localStorage.setItem(
          'cartDataDetail',
          JSON.stringify(Array.from(this.cartDataDetail.entries()))
        );
        localStorage.setItem(
          'cartDataQt',
          JSON.stringify(Array.from(this.cartDataQt.entries()))
        );
  }

  clearCartData() {
    this.cartDataDetail.clear();
    this.cartDataQt.clear();
    this.totalPrice = 0;
    this.totalPriceWithDelivery = 0;
    this.cartCount = 0;
    localStorage.setItem('cartCount', JSON.stringify(this.cartCount));
    localStorage.setItem('totalPrice', JSON.stringify(this.totalPrice));
    localStorage.setItem(
      'cartDataDetail',
      JSON.stringify(Array.from(this.cartDataDetail.entries()))
    );
    localStorage.setItem(
      'cartDataQt',
      JSON.stringify(Array.from(this.cartDataQt.entries()))
    );
  }

  setCartCount(key: string) {

    
    const count = this.cartDataQt.get(key);
   
    if (count === undefined) {
      this.cartCount++;
    }

    localStorage.setItem('cartCount', JSON.stringify(this.cartCount));
  }

  setPrice(price: number, qt: number, key: string) {
    
    const count = this.cartDataQt.get(key);
    if (this.cartDataQt.has(key) && count !== undefined) {
      this.totalPrice -= count * price;
    }
    this.totalPrice += qt * price;
    if (this.totalPrice < 0) {
      this.totalPrice = 0;
    }
    
    localStorage.setItem('totalPrice', JSON.stringify(this.totalPrice));
  }

  getCartData() {
    return {
      cartDataDetail: this.cartDataDetail,
      cartDataQt: this.cartDataQt,
    };
  }

  getCartCount() {
    return this.cartCount;
  }
  getTotalPrice() {
    return this.totalPrice;
  }

  setCartData(obj: any, qt: any) {
    let groupCode_groupId = obj.groupCode + '&' + obj.goodsID;
    this.cartDataDetail.set(groupCode_groupId, obj);
    
    
    this.cartDataQt.set(groupCode_groupId, qt);

    // Convert Map to an array of its entries and then stringify
    localStorage.setItem(
      'cartDataDetail',
      JSON.stringify(Array.from(this.cartDataDetail.entries()))
    );
    localStorage.setItem(
      'cartDataQt',
      JSON.stringify(Array.from(this.cartDataQt.entries()))
    );

  }

  deleteCartData(key: string) {
   
    if (key !== undefined) {
      this.initializeAndLoadData();
      const objData = this.cartDataDetail.get(key);
      const objQt = this.cartDataQt.get(key);
      console.log(objData, "----utshow----", objQt);
      console.log(this.totalPrice, 'totalPrice');
      if (objData !== undefined && objQt !== undefined) {
        this.totalPrice -= objQt * parseInt(objData.price);
      }
      console.log(this.totalPrice, 'totalPrice', objData);
    
      this.cartCount--;
      this.cartDataDetail.delete(key);
      this.cartDataQt.delete(key);
     
      this.loadIntoLocalStorage();
    }
    
  }

  updateData(cartData: any, cartDataQt: any) {
    this.cartDataDetail = cartData;
    this.cartDataQt = cartDataQt;
  }
  setTotalPriceWithDelivery(value: number) {
    this.totalPriceWithDelivery = value;
  }
  getTotalPriceWithDelivery() {
    return this.totalPriceWithDelivery;
  }
}
