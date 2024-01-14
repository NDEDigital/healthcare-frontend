import { Component, ElementRef, ViewChild } from '@angular/core';
import { CartDataService } from 'src/app/services/cart-data.service';
import { CartItem } from './cart-item.interface';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OrderApiService } from 'src/app/services/order-api.service';
@Component({
  selector: 'app-cart-added-product',
  templateUrl: './cart-added-product.component.html',
  styleUrls: ['./cart-added-product.component.css'],
})
export class CartAddedProductComponent {
  @ViewChild('loginModalBTN') LoginModalBTN!: ElementRef;
  @ViewChild('closeLoginModal') CloseLoginModal!: ElementRef;

  cartDataDetail: Map<string, CartItem> = new Map<string, CartItem>();
  cartDataQt = new Map<string, number>();
  saveLaterData: Map<string, CartItem> = new Map<string, CartItem>();
  saveLaterDataQt = new Map<string, number>();
  cartCount: number = 0;
  totalPrice: number = 0;
  constructor(
    private cartDataService: CartDataService,
    private route: Router,
    private orderApiService: OrderApiService
  ) {}

  ngOnInit(): void {
    // this.cartDataService.clearCartData();
    this.fetchCartData();
  }

  fetchCartData(): void {
    // this.cartDataService.clearCartData();
    this.cartDataService.initializeAndLoadData();
    const cartData = this.cartDataService.getCartData();
    this.cartDataDetail = cartData.cartDataDetail;
    this.cartDataQt = cartData.cartDataQt;
    this.cartCount = this.cartDataService.getCartCount();
    this.totalPrice = this.cartDataService.getTotalPrice();
    //console.log(this.cartCount);
  }

  // delete data

  deleteCartProduct(entry: any) {
    this.cartDataService.deleteCartData(entry);
    this.cartCount--;
    this.fetchCartData();
  }

  // deleteCartProduct(entry: any) {
  //   //console.log(entry);

  //   this.cartDataDetail.delete(entry.groupCode + '&' + entry.goodsID);
  //   let qt: number | undefined = this.cartDataQt.get(
  //     entry.groupCode + '&' + entry.goodsID
  //   );
  //   if (qt != undefined) {
  //     let price: string = entry.price;
  //     this.totalPrice -= qt * parseFloat(price);
  //     this.cartDataService.setCartCount(entry.groupCode + '&' + entry.goodsID);
  //     this.cartDataService.setPrice(parseFloat(price), qt, 'minus');
  //     this.updateCount();
  //   }
  //   this.cartDataQt.delete(entry.groupCode + '&' + entry.goodsID);
  //   this.cartDataService.updateData(this.cartDataDetail, this.cartDataQt);
  // }

  procced() {
    //console.log(localStorage.getItem('loginStatus'));
    if (localStorage.getItem('loginStatus') === null) {
      // this.route.navigate(['/login']);
      this.LoginModalBTN.nativeElement.click();
    } else {
      if (this.cartDataDetail.size > 0) {
        this.route.navigate(['/checkout']);
      } else {
        //console.log('select product');
      }
    }
  }

  productPage() {
    this.route.navigate(['/']);
  }

  // save later
  // saveForLater(key: any, value: any) {
  //   this.saveLaterData.set(key, value);
  //   let qt: number | undefined = this.cartDataQt.get(key);
  //   if (qt != undefined) {
  //     this.saveLaterDataQt.set(key, qt);
  //   }

  //   this.deleteCartProduct(value);
  //   this.cartDataService.setSaveLaterData(
  //     this.saveLaterData,
  //     this.saveLaterDataQt
  //   );
  //   this.updateCount();
  // }

  // moveToCart(key: any, value: any) {

  //   let qt: number | undefined = this.saveLaterDataQt.get(key);
  //   this.cartDataDetail.set(key, value);
  //   if (qt != undefined) {
  //     this.cartDataQt.set(key, qt);
  //     this.cartDataService.setCartCount(qt, "add");
  //      let price: string = value.price;
  //      this.totalPrice += (parseFloat(price)*qt);
  //      this.cartDataService.setPrice(parseFloat(price), 'add');
  //     this.updateCount();
  //   }
  //   this.saveLaterData.delete(key);
  //   this.saveLaterDataQt.delete(key);
  // }

  // deleteSaveProduct(key: any) {
  //   this.saveLaterData.delete(key);
  //   this.saveLaterDataQt.delete(key);
  //   this.cartDataService.setSaveLaterData(
  //     this.saveLaterData,
  //     this.saveLaterDataQt
  //   );
  // }
}
