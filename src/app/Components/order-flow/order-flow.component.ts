import { Component } from '@angular/core';
import { AddProductService } from 'src/app/services/add-product.service';
import { OrderApiService } from 'src/app/services/order-api.service';
import { ProductReturnServiceService } from 'src/app/services/product-return-service.service';

@Component({
  selector: 'app-order-flow',
  templateUrl: './order-flow.component.html',
  styleUrls: ['./order-flow.component.css'],
})
export class OrderFlowComponent {
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
    private productReturnService: ProductReturnServiceService
  ) {}

  ngOnInit() {
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
        //console.log(this.productsData);
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

  
  ReturnProduct(formValues: any): void {
    // Access the form values directly
    const returnType = formValues.returnTypeControl;
    const remarks = formValues.remarksControl;

    // Now you can use returnType and remarks in your logic
    console.log('Return Type:', returnType);
    console.log('Remarks:', remarks);
    
    // Add your logic to send the values to the server or perform any other actions
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
}
