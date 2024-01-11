export interface DetailsModel {
    orderMasterId: number; // Assuming orderMasterId is of type number
    isChecked: boolean;   // Assuming isChecked is of type boolean
    companyName:string;
    specification : string;
    qty : number;
    price : number;
    deliveryCharge : number;
    orderDetailId : number;
    productName :string
    discountAmount :number
    unit : string
    // Other properties...
  }
 