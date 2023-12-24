import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { GoodsDataService } from 'src/app/services/goods-data.service';
import { SharedService } from 'src/app/services/shared.service';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css'],
})
export class ProductsPageComponent {
  products: string[] = [];
  selectedProductCode: string = '';
  companyList: any;
  groupCode: string = '';
  groupName: string = '';
  @Output() dataUpdated = new EventEmitter<void>();
  constructor(
    private sharedService: SharedService,
    private goodsData: GoodsDataService,
    private router: Router
  ) {}

  ngOnInit() {
    // this.goodsData.getProductCompanyList().pipe(
    //   switchMap(() => this.goodsData.getProductCompanyList())
    // ).subscribe((data: any) => {
    //   console.log(data);
    //   this.products = data;
    // });
    this.callApi();
    // console.log(this.groupName, this.groupCode, 'products');
  }

  handleDataUpdated() {
    this.callApi();
    // console.log(this.groupName, this.groupCode, 'products inside handleUpdate');
  }

  callApi() {
    this.groupCode = sessionStorage.getItem('groupCode') || '';
    this.groupName = sessionStorage.getItem('groupName') || '';
    // console.log(this.groupName, this.groupCode, 'products inside callapi');
    setTimeout(() => {
      if (this.groupCode != '') {
        this.goodsData
          .getProductCompanyList(this.groupCode)
          .subscribe((data: any) => {
            console.log(data, 'data');

            console.log(this.sharedService.groupCode);

            this.companyList = data;
          });
      }
    }, 10);

    //================= using switchMap ==============
    // this.goodsData
    //   .getProductCompanyList(
    //     this.sharedService.groupCode,
    //     this.sharedService.groupName
    //   )
    //   .pipe(
    //     switchMap(() =>
    //       this.goodsData.getProductCompanyList(
    //         this.sharedService.groupCode,
    //         this.sharedService.groupName
    //       )
    //     )
    //   )
    //   .subscribe((data: any) => {
    //     console.log(data);
    //     this.companyList = data;
    //   });
  }

  productCardClick(companyCode: string) {
    this.sharedService.setCompanyCode(companyCode);
    // console.log(companyCode, 'companyCode');

    this.router.navigate(['/product']);
    // window.location.href = '/product';
  }
}
