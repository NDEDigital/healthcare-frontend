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
  isHovered: any | null = null;

  alertTitle: string = '';
  alertMsg: string = '';

  isApproved: boolean = false;
  isRejected: boolean = false;
  @ViewChild('allselected', { static: true }) allSelectedCheckbox!: ElementRef<HTMLInputElement>;

  @ViewChild('msgModalBTN') msgModalBTN!: ElementRef;
  constructor(private productService: AddProductService) {}

  ngOnInit() {
    this.getData(this.status);
  }

  getData(status: string) {
    this.allSelectedCheckbox.nativeElement.checked=false;

    this.selectedProducts1.length=0
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
    this.selectedProducts=[{... productStatus}];
    this.productService.updateProduct(this.selectedProducts).subscribe({
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
  changeStatus(Status: any){
    this.selectedProducts=this.selectedProducts1;
  console.log("the data are",this.selectedProducts);

   if(this.selectedProducts.length>0){
     this.selectedProducts.forEach((product) => {
       product.status = Status;
     });
     console.log("the data are after staatsu",this.selectedProducts);
     this.productService.updateProduct(this.selectedProducts).subscribe({
       next: (response: any) => {
        //  console.log(response);
         // this.getProducts(isActive);
         // this.btnIndex = isActive;
         // this.PrdouctExistModalBTN.nativeElement.click();

 //         this.selectAll = false;
 
          this.selectAll=false;
          this.selectedProducts.length=0;
          this.selectedProducts1.length=0;
         // console.log("product id's are",this.selectedProductIds)
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
         this.alertMsg = error.error.message;
       },
     });
   }
   else{
     // this.PrdouctExistModalBTN.nativeElement.click();

     this.alertMsg='No Product is selected'
   }

 }
 selectedProducts: any[] = [];

 selectedProductIds: any[] = [];
 selectedProducts1:any[]=[];  
 selectAll = false;
 // toggleAllCheckboxes() {
 //   console.log("all products",this.selectedProducts);
 
 //   // Toggle the state of all checkboxes based on the "Select All" checkbox
 //   this.productsData.forEach(
 //     (product: { isSelected: boolean, productId: any, userId: any, companyCode: any }) => {
 //       product.isSelected = this.selectAll;
 
 //       // Update the selectedProducts array based on the state of each checkbox
 //       if (this.selectAll && !this.isSelected(product.productId)) {
 //         this.selectedProducts.push({
 //           userId: product.userId,
 //           companyCode: product.companyCode,
 //           productId: product.productId
 //         });
 //       } else if (!this.selectAll && this.isSelected(product.productId)) {
 //         // Remove the deselected product from the list
 //         this.selectedProducts = this.selectedProducts.filter(
 //           (selectedProduct) => selectedProduct.productId !== product.productId
 //         );
 //       }
 //     }
 //   );
 // }
 
 toggleAllCheckboxes() {
   
  //  console.log("all seelcted",this.selectAll)
   // console.log('Selected Product IDs:', this.selectedProducts1);
   
  //  console.log(this.productsData,"ijhnon'lonsf'amn");
   
   if(this.selectAll===true){
 this.selectedProducts1.length=0;
 
 this.productsData.forEach((product:any) => {
   product.isSelected = this.selectAll;
   this.selectedProducts1.push({
     userId: product.userId,
              companyCode: product.companyCode,
              productId: product.productId
             });
 });

//  console.log(this.productsData,"asfsfsfsfsfsfsfsfsfsfsfsfsfsfsfsfsfsfsfsfsfsfsfsf");
}
  else{
  this.selectedProducts1.length=0;
  this.productsData.forEach((product:any) => {
   product.isSelected = this.selectAll;
 });
  }
   
//    console.log('Selected Product IDs:', this.selectedProducts1);
//    console.log("this.selectedProducts1.length",this.selectedProducts1.length);
// console.log("this.productsData.length",this.productsData.length);
 
 }

 // checkboxSelected(userId: any, companyCode: any, productId: any, event: any) {
 //   const isSelected: boolean = event.target.checked;
 
 //   if (isSelected && !this.isSelected(productId)) {
 //     // Add the selected product to the list
 //     this.selectedProducts.push({ userId, companyCode, productId });
 //   } else if (!isSelected && this.isSelected(productId)) {
 //     // Remove the deselected product from the list
 //     this.selectedProducts = this.selectedProducts.filter(
 //       (product) => product.productId !== productId
 //     );
 //   }
 
 //   console.log(this.selectedProducts, "selectedProducts");
 // }
 
 // isSelected(productId: any): boolean {
 //   return this.selectedProducts.some((product) => product.productId === productId);
 // }
 checkboxSelected(userId: any, companyCode: any, productId: any, event: any) {
   const isSelected: boolean = event.target.checked;

   if (isSelected) {
     // Add the selected product to the list
     this.selectedProducts1.push({ userId, companyCode, productId });
   } else{
     // Remove the deselected product from the list
     this.selectedProducts1 = this.selectedProducts1.filter(
       (product) => !(product.productId === productId && product.userId === userId && product.companyCode === companyCode)
     );
   }
   this.allSelectedCheckbox.nativeElement.checked=false;
   // Update the selectedProductIds array with the current list of selected product IDs
   this.selectedProductIds = this.selectedProducts1.slice();
   
 if(this.selectedProducts1.length===this.productsData.length){
 this.allSelectedCheckbox.nativeElement.checked=true;

}
// console.log(this.selectedProducts1, "selectedProducts");
 } 
  
}
