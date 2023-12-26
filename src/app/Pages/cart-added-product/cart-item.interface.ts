// export interface CartItem {
//   imagePath: any;
//   companyName: string;
//   groupCode: string;
//   goodsId: string;
//   groupName: string;
//   goodsName: string;
//   specification: string;
//   approveSalesQty: string;
//   price: string;
//   sellerCode: string;
// }

export interface CartItem {
  imagePath: any;
  companyName: string;
  groupCode: string;
  goodsId: string;
  groupName: string;
  goodsName: string;
  specification: string;
  approveSalesQty: string;
  price: string;
  sellerCode: string;
  unitId:number;
  quantityUnit:string;
  discountAmount:number;
  discountPct:number;

}
// companyName: this.goods[i].companyName,
// groupCode: this.goods[i].productGroupID,
// goodsId: this.goods[i].productId,
// groupName: this.goods[i].productGroupName,                
// goodsName: this.goods[i].productName,
// specification: this.goods[i].specification,
// approveSalesQty: this.goods[i].availableQty,
// sellerCode: this.goods[i].sellerId,
// unitId:this.goods[i].unitId,
// quantityUnit :  this.goods[i].unit,
// imagePath :  this.goods[i].imagePath,
// price: this.goods[i].price,
// discountAmount: this.goods[i].discountAmount,
// discountPct: this.goods[i].discountPct,