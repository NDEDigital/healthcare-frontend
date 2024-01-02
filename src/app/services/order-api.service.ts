import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartItem } from '../Pages/cart-added-product/cart-item.interface';
import { CartDataService } from './cart-data.service';
import { API_URL } from '../config';

interface OrderMaster {
  userId: number;
  address: string;
  paymentMethod: string;
  numberOfItem: number;
  totalPrice: number;
  phoneNumber: string;
  deliveryCharge: number;
  addedBy: string;
  addedPC: string;
  orderDetailsList: OrderDetail[];
}

interface OrderDetail {
  productId: number;
  qty: number;
  discountPct: number;
  price: number;
  deliveryCharge: number;
  specification: string;
  productGroupId: string;
  userId: number;
  unitId: number;
  discountAmount: number;
  netPrice: number;
  addedBy: string;
  addedPC: string;
}

// interface OrderData {
//   master: OrderMaster[];
//   detail: OrderDetail[];
// }

@Injectable({
  providedIn: 'root',
})
export class OrderApiService {
  orderdata!: OrderMaster;
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
  orderPostUrl = `${this.URL}/api/Order/InsertOrderData`;
  getUserInfoURL = `${this.URL}/api/Order/getOrderUserInfo`;
  getAllOrderForBuyerURL = `${this.URL}/api/Order/getAllOrderForBuyer`;
  checkUnderOrderProccessURL = `${this.URL}/api/Order/checkUnderOrderProccess`;

  // ============== new code  ==================
  getBuyerOrderURL = `${this.URL}/api/Order/GetBuyerOrderBasedOnUserID`;

  getBuyerOrder(userid: any, status: any) {
    return this.http.get(this.getBuyerOrderURL, {
      params: { userid, status },
    });
  }

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

    this.orderdata = {
      userId: parseInt(this.buyerCode),
      address: this.address,
      paymentMethod: 'CashOnDelivery',
      numberOfItem: this.cartDataDetail.size,
      totalPrice: this.totalPriceWithDeliveryCharge,
      phoneNumber: this.phone,
      deliveryCharge: 100,
      addedBy: 'me',
      addedPC: 'me',
      orderDetailsList: [],
    };

    for (const [key, entry] of this.cartDataDetail.entries()) {
      let qt: number | undefined = this.cartDataQt.get(key);
      if (qt === undefined) {
        qt = 0;
      }
      qt =
        qt === undefined ? 0 : typeof qt === 'string' ? parseInt(qt, 10) : qt;
      const detailData: OrderDetail = {
        productId: parseInt(entry.goodsId),
        qty: qt,
        price: entry.netPrice,
        deliveryCharge: 100,
        specification: entry.specification,
        productGroupId: entry.groupCode.toString(),
        userId: parseInt(entry.sellerCode),
        unitId: entry.unitId,
        discountAmount: entry.discountAmount,
        discountPct:entry.discountPct,
        netPrice: ((entry.netPrice*qt)+100),
        addedBy:this.buyerCode,
        addedPC: "0.0.0.0",
      };
      this.orderdata.orderDetailsList.push(detailData);
    }
  }
  insertOrderData() {
    this.setData();
    //console.log(' orderdata', this.orderdata);
    return this.http.post<any>(
      this.orderPostUrl,
      this.orderdata,
      this.httpOptions
    );
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
    //console.log(buyerCode, PageNumber, rowCount, status);

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
