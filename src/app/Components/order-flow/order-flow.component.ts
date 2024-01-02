import { Component } from '@angular/core';
import { AddProductService } from 'src/app/services/add-product.service';
import { OrderApiService } from 'src/app/services/order-api.service';
import { ProductReturnServiceService } from 'src/app/services/product-return-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-order-flow',
  templateUrl: './order-flow.component.html',
  styleUrls: ['./order-flow.component.css'],
})
export class OrderFlowComponent {
  returnForm!: FormGroup;
  arrayindex: any;
  btnIndex = -1;
  productsData: any;
  returntype: any;
  imagePath = '';
  status = 'Pending';
  imageTitle = 'No Data Found!';
  selectedCompanyCodeValues: { [key: string]: number } = {};

  constructor(
    private productService: AddProductService,
    private orderApi: OrderApiService,
    private productReturnService: ProductReturnServiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.returnForm = this.fb.group({
      returntype: ['', Validators.required],
      remarks: ['']
    });
    this.getData(this.status);
    this.GetReturnTypeForSelectOption();
  }

  getData(status: string) {
    let uidS = localStorage.getItem('code');
    let userID;
    if (uidS) userID = parseInt(uidS, 10);
    this.orderApi.getBuyerOrder(userID, status).subscribe({
      next: (response: any) => {
        console.log(response);
        this.productsData = response;
        console.log(this.productsData);
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
  }

  GetReturnTypeForSelectOption(){
    this.productReturnService.getReturnType().subscribe({
      next: (Response: any) => {
        console.log(Response);
        this.returntype = Response;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }


  setreturnDataArrayIndex(index: any){

    this.arrayindex = index;
    console.log("classname", index);
  }
  
  
  
  ProductReturnFunction(): void {

    // Create a FormData object
    const returnData = new FormData();

    // Access the form values using this.returnForm.value
    const returnType = this.returnForm.get('returntype')?.value;
    const remarks = this.returnForm.get('remarks')?.value;
  
    console.log('Return Type:', returnType);
    console.log('Remarks:', remarks);

    console.log("return product array", this.productsData);
    if (this.arrayindex >= 0 && this.arrayindex < this.productsData.length) {
      const selectedProduct = this.productsData[this.arrayindex];
      console.log('Selected Product:', selectedProduct);
      // Append individual values to the FormData
      returnData.append('ReturnTypeId', returnType);
      // formData.append('ProductGroupId', '1');
      // formData.append('ProductId', '2');
      returnData.append('OrderNo', selectedProduct.orderNo);
      returnData.append('Price', selectedProduct.price);
      returnData.append('OrderDetailsId', selectedProduct.orderDetailId);
      // formData.append('SellerId', '');
      // returnData.append('ApplyDate', selectedProduct.detailDeliveryDate);
      // formData.append('DeliveryDate', new Date().toISOString());
      returnData.append('Remarks', remarks);
      returnData.append('AddedDate', new Date().toISOString());
      returnData.append('AddedBy', 'Test User');
      returnData.append('AddedPc', '0.0.0.0');
      }

      returnData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      
      

    this.productReturnService.ReturnProductAndChangeOrderDetailsStatus(returnData).subscribe({
      next: (Response: any) => {
        console.log("return post and status change response",Response);
        this.getData('Delivered');
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }




  showImage(path: any, title: any) {
    //console.log(path, title);
    this.imagePath = path.split('src')[1];
    this.imageTitle = title;
  }
  updateProduct(UserId: any, CompanyCode: any, ProductId: any, Status: any) {
    //console.log(UserId, CompanyCode, ProductId, Status);
    const productStatus = {
      UserId,
      CompanyCode,
      ProductId,
      Status,
    };
    this.productService.updateProduct(productStatus).subscribe({
      next: (response: any) => {
        //console.log(response);
        // this.productsData = response;
        // //console.log(this.productsData);
        if ((this.btnIndex = -1)) {
          this.getData('Pending');
        } else if ((this.btnIndex = 1)) {
          this.getData('Approved');
        } else {
          this.getData('Rejected');
        }
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
  }
  gotoInvoice(orderId: any) {
    sessionStorage.setItem('orderMasterID', orderId);

    const urlToOpen = '/buyerInvoice'; // Replace with your desired URL

    // Use window.open to open the new window/tab
    window.open(urlToOpen, '_blank');
  }
}
