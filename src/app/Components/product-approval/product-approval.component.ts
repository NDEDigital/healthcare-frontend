import { Component, ElementRef, ViewChild } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { AddProductService } from 'src/app/services/add-product.service';
@Component({
  selector: 'app-product-approval',
  templateUrl: './product-approval.component.html',
  styleUrls: ['./product-approval.component.css'],
})
export class ProductApprovalComponent {
  btnIndex = -1;
  productsData: any;
  imagePath = '';
  status = 'Pending';
  imageTitle = 'No Data Found!';
  selectedCompanyCodeValues: { [key: string]: number } = {};

  showModal = false;
  selectedProduct: any = null;

  alertTitle: string = '';
  alertMsg: string = '';

  isApproved: boolean = false;
  isRejected: boolean = false;

  @ViewChild('msgModalBTN') msgModalBTN!: ElementRef;
  constructor(private productService: AddProductService) {}

  ngOnInit() {
    this.getData(this.status);
  }

  getData(status: string) {
    this.productService.getProductData(status).subscribe({
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

  showDetails(product: any) {
    this.selectedProduct = product;
    this.showModal = true;
    console.log('click', product.productId);
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
    console.log(Status, 'Status');

    this.productService.updateProduct(productStatus).subscribe({
      next: (response: any) => {
        //console.log(response);
        // this.productsData = response;
        // //console.log(this.productsData);
        // if ((this.btnIndex = -1)) {
        //   this.getData('Pending');
        // } else if ((this.btnIndex = 1)) {
        //   this.getData('Approved');
        // } else {
        //   this.getData('Rejected');
        // }
        this.getData(Status);
        if (Status == 'Approved') {
          this.btnIndex = 1;
          this.isApproved = true;
          this.isRejected = false;
          this.alertTitle = 'Success!';
          this.alertMsg = 'Product is approved sucessfully.';
        }
        if (Status == 'Rejected') {
          this.btnIndex = 0;
          this.isApproved = false;
          this.isRejected = true;
          this.alertTitle = 'Rejected!';
          this.alertMsg = 'Product is rejected.';
        }

        this.msgModalBTN.nativeElement.click();
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
  }

  // updateCompany(companyCode: any, Isactive: any) {
  //   //console.log(companyCode, Isactive);
  //   // const selectedCompany = this.productsData.find(
  //   //   (cmp: any) => cmp.companyCode === companyCode
  //   // );
  //   // if (selectedCompany) {
  //   //   this.selectedCompanyCodeValue = selectedCompany.companyCode;
  //   //   //console.log(
  //   //     'Selected Company Code Value:',
  //   //     this.selectedCompanyCodeValue
  //   //   );
  //   // }
  //   //console.log(
  //     'Selected Company Code Value:',
  //     this.selectedCompanyCodeValues[companyCode]
  //   );
  //   const cmp = {
  //     companyCode: companyCode,
  //     isActive: Isactive,
  //     maxUser: this.selectedCompanyCodeValues[companyCode] || 0,
  //   };
  //   // this.companyService.UpdateCompany(cmp).subscribe({
  //   //   next: (response: any) => {
  //   //     //console.log(response);
  //   //     this.getData();
  //   //   },
  //   //   error: (error: any) => {
  //   //     //console.log(error);
  //   //   },
  //   // });
  // }
}
