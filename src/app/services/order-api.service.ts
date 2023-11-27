import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartItem } from '../Pages/cart-added-product/cart-item.interface';
import { CartDataService } from './cart-data.service';
import { API_URL } from '../config';

interface OrderMaster {
  orderNo: string;
  orderDate: string;
  buyerCode: string;
  address: string;
  paymentMethod: string;
  numberOfItem: number;
  totalPrice: number;
  status: string;
  phoneNumber: string;
  deliveryCharge: number;
}

interface OrderDetail {
  goodsId: number;
  goodsName: string;
  quantity: number;
  discount: number;
  price: number;
  deliveryDate: string;
  deliveryCharge: number;
  specification: string;
  groupCode: string;
  sellerCode: string;
  status: string;
}

interface OrderData {
  master: OrderMaster[];
  detail: OrderDetail[];
}

const orderData: OrderData = {
  master: [],
  detail: [],
};

@Injectable({
  providedIn: 'root',
})
export class OrderApiService {
  constructor(
    private http: HttpClient,
    private cartDataService: CartDataService
  ) {}

  cartDataDetail: Map<string, CartItem> = new Map<string, CartItem>();
  cartDataQt = new Map<string, number>();
  totalPriceWithDeliveryCharge = 0;
  buyerCode: any;
  phone: any;
  address: any;
  URL = API_URL;
  // URL = 'http://172.16.5.18:8081'; // liveURL
  //URL = 'https://localhost:7006';
  orderPostUrl = `${this.URL}/api/Order`;
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
    orderData.master = [];
    orderData.detail = [];
    const cart = this.cartDataService.getCartData();
    this.cartDataDetail = cart.cartDataDetail;
    this.cartDataQt = cart.cartDataQt;
    this.totalPriceWithDeliveryCharge =
      this.cartDataService.getTotalPrice() + 100;

    this.buyerCode = localStorage.getItem('code');

    const masterData: OrderMaster = {
      orderNo: '',
      orderDate: '' + this.getDateTime(),
      buyerCode: this.buyerCode,
      address: this.address,
      paymentMethod: 'CashOnDelivery',
      numberOfItem: this.cartDataDetail.size,
      totalPrice: this.totalPriceWithDeliveryCharge,
      status: 'Pending',
      phoneNumber: this.phone,
      deliveryCharge: 100,
    };

    orderData.master.push(masterData);

    for (const [key, entry] of this.cartDataDetail.entries()) {
      let qt: number | undefined = this.cartDataQt.get(key);
      if (qt === undefined) {
        qt = 0;
      }

      const detailData: OrderDetail = {
        goodsId: parseInt(entry.goodsID),
        goodsName: entry.goodsName,
        quantity: qt,
        discount: 0,
        price: parseFloat(entry.price),
        deliveryCharge: 100,
        deliveryDate: '2030-09-11',
        specification: entry.specification,
        groupCode: entry.groupCode,
        sellerCode: entry.sellerCode,
        status: 'Pending',
      };
      orderData.detail.push(detailData);
    }
  }
  insertOrderData() {
    this.setData();
    console.log(' orderData', orderData);
    return this.http.post<any>(this.orderPostUrl, orderData, this.httpOptions);
  }
  // get user info for order
  getUserInfo(userCode: any) {
    return this.http.get(this.getUserInfoURL, { params: { userCode } });
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
