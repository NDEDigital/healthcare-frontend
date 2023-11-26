interface OrderMaster {
  orderNo: string;
  orderDate: string;
  sellerId: string;
  buyerId: string;
  address: string;
  paymentMethod: string;
  orderPlaceDate: string;
  numberOfItem: number;
  totalPrice: number;
  status: string;
  phoneNumber: string;
  deliveryCharge: number;
}

interface OrderDetail {
  goodsId: string;
  quantity: number;
  discount: number;
  price: number;
  deliveryDate: string;
}

interface MasterDetailModel {
  master: OrderMaster[];
  detail: OrderDetail[];
}
