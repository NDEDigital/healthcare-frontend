import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartItem } from '../Pages/cart-added-product/cart-item.interface';
import { CartDataService } from './cart-data.service';
import { API_URL } from '../config';

interface OrderMaster {

  orderDate: string;
  userId: number;
  address: string;
  paymentMethod: string;
  numberOfItem: number;
  totalPrice: number;
  status: string;
  phoneNumber: string;
  deliveryCharge: number;
  orderDetailsList: OrderDetail[];
}

interface OrderDetail {
  productId: number;
  qty: number;
  discountPct: number;
  price: number;
  deliveryCharge: number;
  specification: string;
  productGroupCode: string;
  userId: number;
  status: string;
  unitId:number;
  discountAmount:number;
  netPrice:number;
}

// interface OrderData {
//   master: OrderMaster[];
//   detail: OrderDetail[];
// }



@Injectable({
  providedIn: 'root',
})
export class OrderApiService {
  orderData!: OrderMaster;
  constructor(
    private http: HttpClient,
    private cartDataService: CartDataService
  ) {

  }

  cartDataDetail: Map<string, CartItem> = new Map<string, CartItem>();
  cartDataQt = new Map<string, number>();
  totalPriceWithDeliveryCharge = 0;

  buyerCode: any;
  phone: any;
  address: any;
  URL = API_URL;
  // URL = 'http://172.16.5.18:8081'; // liveURL
  //URL = 'https://localhost:7006';
  orderPostUrl = `${this.URL}/api/Order/InsertOrderData`;
  getUserInfoURL = `${this.URL}/api/Order/getOrderUserInfo`;
  getAllOrderForBuyerURL = `${this.URL}/api/Order/getAllOrderForBuyer`;
  checkUnderOrderProccessURL = `${this.URL}/api/Order/checkUnderOrderProccess`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  setPhone(phone: any) {
    this.phone = phone;
  }
  setAddress(address: any) {
    this.address = address;
  }

  getDateTime() {
    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Dhaka' };
    const bdDateTime = currentDate
      .toLocaleString('en-US', options)
      .replace(/\//g, '-');
    return bdDateTime;
  }

  setData() {
    
    const cart = this.cartDataService.getCartData();
    this.cartDataDetail = cart.cartDataDetail;
    this.cartDataQt = cart.cartDataQt;
    this.totalPriceWithDeliveryCharge =
    this.cartDataService.getTotalPrice() + 100;

    this.buyerCode = localStorage.getItem('code');
     
    this.orderData = {
      orderDate: '' + this.getDateTime(),
      userId: parseInt(this.buyerCode),
      address: this.address,
      paymentMethod: 'CashOnDelivery',
      numberOfItem: this.cartDataDetail.size,
      totalPrice: this.totalPriceWithDeliveryCharge,
      status: 'Pending',
      phoneNumber: this.phone,
      deliveryCharge: 100,
      orderDetailsList: []
    };

   
   
    for (const [key, entry] of this.cartDataDetail.entries()) {
      let qt: number | undefined = this.cartDataQt.get(key);
      if (qt === undefined) {
        qt = 0;
      }
      qt = qt === undefined ? 0 : (typeof qt === 'string' ? parseInt(qt, 10) : qt);
      const detailData: OrderDetail = {
        productId: parseInt(entry.goodsId),
        qty: qt,
        price: parseFloat(entry.price),
        deliveryCharge: 100,
        specification: entry.specification,
        productGroupCode: entry.groupCode,
        userId: parseInt(entry.sellerCode),
        status: 'Pending',
        unitId: entry.unitId,
        discountAmount: entry.discountAmount,
        discountPct:entry.discountPct,
        netPrice:0,
      };
      this.orderData.orderDetailsList.push(detailData);
    }
  }
  insertOrderData() {
    this.setData();
    console.log(' orderData', this.orderData);
    return this.http.post<any>(this.orderPostUrl, this.orderData, this.httpOptions);
  }
  // get user info for order
  getUserInfo(UserId: any) {
    return this.http.get(this.getUserInfoURL, { params: { UserId } });
  }
  getAllOrderForBuyer(
    buyerCode: any,
    PageNumber: number,
    rowCount: number,
    status: string
  ) {
    console.log(buyerCode, PageNumber, rowCount, status);

    return this.http.get(this.getAllOrderForBuyerURL, {
      params: {
        buyerCode,
        PageNumber,
        rowCount,
        status,
      },
    });
  }

  checkUnderOrderProccess(GoodsId: number, GroupCode: string) {
    return this.http.get(this.checkUnderOrderProccessURL, {
      params: { GoodsId, GroupCode },
    });
  }
}
