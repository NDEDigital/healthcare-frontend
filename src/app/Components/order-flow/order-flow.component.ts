import { Component } from '@angular/core';
import { AddProductService } from 'src/app/services/add-product.service';

@Component({
  selector: 'app-order-flow',
  templateUrl: './order-flow.component.html',
  styleUrls: ['./order-flow.component.css'],
})
export class OrderFlowComponent {
  btnIndex = -1;
  productsData: any;
  imagePath = '';
  status = 'Pending';
  imageTitle = 'No Data Found!';
  selectedCompanyCodeValues: { [key: string]: number } = {};

  constructor(private productService: AddProductService) {}

  ngOnInit() {
    this.getData(this.status);
  }

  getData(status: string) {
    this.productService.getProductData(status).subscribe({
      next: (response: any) => {
        console.log(response);
        this.productsData = response;
        console.log(this.productsData);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  showImage(path: any, title: any) {
    console.log(path, title);
    this.imagePath = path.split('src')[1];
    this.imageTitle = title;
  }
  updateProduct(UserId: any, CompanyCode: any, ProductId: any, Status: any) {
    console.log(UserId, CompanyCode, ProductId, Status);
    const productStatus = {
      UserId,
      CompanyCode,
      ProductId,
      Status,
    };
    this.productService.updateProduct(productStatus).subscribe({
      next: (response: any) => {
        console.log(response);
        // this.productsData = response;
        // console.log(this.productsData);
        if ((this.btnIndex = -1)) {
          this.getData('Pending');
        } else if ((this.btnIndex = 1)) {
          this.getData('Approved');
        } else {
          this.getData('Rejected');
        }
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}
