export interface orderInfo {
  orderMasterId: string;
  orderNo: string;
  orderDate: string;
  address: string;
  paymentMethod: string;
  totalPrice: string;
  numberofItem: string;
  status: string;
  selected: boolean;

  // for return

  applyDate: string;
  price: string;
  remarks: string;
  returnType: string;
  groupName: string;
  detailsId: string;
  deliveryDate: string;
  goodsName: string;

  // groupName : string;
}
