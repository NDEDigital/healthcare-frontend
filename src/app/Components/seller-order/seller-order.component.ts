import { Component } from '@angular/core';
import { SellerOrderOverviewService } from 'src/app/services/seller-order-overview.service';
@Component({
  selector: 'app-seller-order',
  templateUrl: './seller-order.component.html',
  styleUrls: ['./seller-order.component.css']
})
export class SellerOrderComponent {
  btnIndex = -1;
  sellerOrderData: any;
  imagePath = '';
  status = '';
  imageTitle = 'No Data Found!';
  selectedCompanyCodeValues: { [key: string]: number } = {};
  headerCheckboxChecked: boolean = false;
  constructor(private sellerService: SellerOrderOverviewService) {}

  ngOnInit() {
    this.getData(this.status);
  }

  getData(status: string) {

    this.status = status;
    const userId = localStorage.getItem("code");
    if(userId)
    {
      this.sellerService.getsellerOrderData(userId,status).subscribe({
        next: (response: any) => 
        {
          console.log(response);
          this.sellerOrderData = response;
          console.log(" data ",this.sellerOrderData);
          this.sellerOrderData = this.sellerOrderData.map((item: any) => ({ ...item, isChecked: false })); 
          console.log("data after",this.sellerOrderData); 
        },     
        error: (error: any) => {
          console.log(error);
        },
      });
    }
    
  }
  toggleAllCheckboxes() {
    this.sellerOrderData.forEach((row:any) => {
      row.checked = this.headerCheckboxChecked;
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
    // this.sellerService.updateProduct(productStatus).subscribe({
    //   next: (response: any) => {
    //     console.log(response);
    //     // this.productsData = response;
    //     // console.log(this.productsData);
    //     if ((this.btnIndex = -1)) {
    //       this.getData('Pending');
    //     } else if ((this.btnIndex = 1)) {
    //       this.getData('Approved');
    //     } else {
    //       this.getData('Rejected');
    //     }
    //   },
    //   error: (error: any) => {
    //     console.log(error);
    //   },
    // });
  }

}
