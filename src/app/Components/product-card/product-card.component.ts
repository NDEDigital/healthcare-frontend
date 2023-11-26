import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AddProductComponent } from 'src/app/Pages/add-product/add-product.component';
import { DashboardComponent } from 'src/app/Pages/dashboard/dashboard.component';
import { OrderApiService } from 'src/app/services/order-api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() title = 'None';
  @Input() quantity = 0;
  @Input() productId = '';
  @Input() imageSRC = '';
  @Input() index = -1;
  @Input() item: any;
  @ViewChild('errorModal') errorModal!: ElementRef;
  @ViewChild('deleteModal') deleteModal!: ElementRef;
  isActiveOrder = false;
  // products = this.dashboard.products;

  constructor(
    private dashboard: DashboardComponent,
    private router: Router,
    private sharedService: SharedService,
    private OrderService: OrderApiService
  ) {}

  ngOnInit() {
    console.log();
  }
  goToDetail() {
    console.log(this.item);

    let obj = {
      approveSalesQty: this.item.quantity,
      companyName: this.item.companyName,
      dimensionUnit: this.item.dimensionUnit,
      finish: this.item.finish,
      goodsID: this.item.productId,
      goodsName: this.item.productName,
      grade: this.item.grade,
      groupCode: this.item.materialType,
      groupName: this.item.materialName,
      imagePath: this.item.imagePath,
      length: this.item.length,
      price: this.item.price,
      quantityUnit: this.item.quantityUnit,
      salesQty: this.item.quantity,
      sellerCode: this.item.supplierCode,
      specification: this.item.ProductDescription,
      stockQty: this.item.quantity,
      weight: this.item.width,
    };
    sessionStorage.setItem('productData', JSON.stringify(obj));
    // this.route.navigate(['/productDetails']);
    window.open('/productDetails', '_blank');
  }
  // edit(indx: number) {
  //   // this.sharedService.editData(this.dashboard.products[indx]);
  //   // this.router.navigate(['/addProduct']);
  //   console.log(this.dashboard.products[indx].productId);
  //   // this.isUnderOrderProccess(indx);
  //   if (!this.isActiveOrder) {
  //     sessionStorage.setItem(
  //       'editData',
  //       JSON.stringify(this.dashboard.products[indx])
  //     );
  //     window.open('/addProduct', '_blank');
  //   } else {
  //     this.errorModal.nativeElement.click();
  //     // alert(
  //     //   'Modification or deletion is not allowed while there are active orders.'
  //     // );
  //   }
  // }
  // delete(indx: number) {
  //   //this.sharedService.deleteData(indx);
  //   console.log(this.dashboard.products[indx].productId);
  //   // this.isUnderOrderProccess(indx);
  //   // console.log(this.isActiveOrder);
  //   // this.isActiveOrder;
  //   // if (!this.isActiveOrder) {
  //   //   sessionStorage.setItem(
  //   //     'deleteData',
  //   //     JSON.stringify(this.dashboard.products[indx].productId)
  //   //   );
  //   // } else {
  //   //   this.errorModal.nativeElement.click();
  //   //   // alert(
  //   //   //   'Modification or deletion is not allowed while there are active orders.'
  //   //   // );
  //   // }
  // }
  isUnderOrderProccess(indx: any, status: string) {
    const goodsId = this.dashboard.products[indx].productId;
    const groupCode = this.dashboard.products[indx].materialType;
    this.OrderService.checkUnderOrderProccess(goodsId, groupCode).subscribe(
      (response: any) => {
        console.log(response.isUnderOrderProccess);
        this.isActiveOrder = response.isUnderOrderProccess;
        if (!this.isActiveOrder) {
          if (status === 'delete') {


            console.log(" delete id ",this.dashboard.products[indx].productId )
            sessionStorage.setItem(
              'deleteData',
              JSON.stringify(this.dashboard.products[indx].productId)
            );
            this.deleteModal.nativeElement.click();
          }
          if (status === 'edit') {
            sessionStorage.setItem(
              'editData',
              JSON.stringify(this.dashboard.products[indx])
            );
            window.open('/addProduct', '_blank');
          }
        } else {
          this.errorModal.nativeElement.click();
        }
      }
    );
  }
}
