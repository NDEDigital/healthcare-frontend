import { getLocaleMonthNames } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
import { GoodsDataService } from 'src/app/services/goods-data.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent {
  constructor(
    private sharedService: SharedService,
    private goodsData: GoodsDataService
  ) {}
  products = new Map();
  products3: Map<string, Array<object>> = new Map();
  products2 = new Map();
  finalProducts = new Map();
  finalProducts2 = new Map();
  private interval: any;

  // private productType=new Map();
  goods: any;
  sliderData = new Map();
  cnt: number = 0;

  ngOnInit() {
    this.removeAllDuplicates();
  }
  removeAllDuplicates() {
    // this.interval = setInterval(()=>{

    this.products.clear();

    this.goodsData.getCarouselData().subscribe((data: any[]) => {
      console.log(data);

      this.goods = data;

      for (let i = 0; i < this.goods.length; i++) {
        let finObj = this.products3.get(
          this.goods[i].groupName + ' ' + this.goods[i].groupCode
        );
        if (this.goods[i].companyName === 'Nimpex') continue;

        if (finObj) {
          let obj = {
            groupCode: this.goods[i].groupCode,
            goodsID: this.goods[i].goodsID,
            goodsName: this.goods[i].goodsName,
            specification: this.goods[i].specification,
            stockQty: this.goods[i].stockQty,
            salesQty: this.goods[i].salesQty,
            approveSalesQty: this.goods[i].approveSalesQty,
          };
          finObj.push(obj);

          // console.log(this.productType,"as");
          // this.productType.set(this.goods[i].goodsName, obj);
          this.products3.set(
            this.goods[i].groupName + ' ' + this.goods[i].groupCode,
            finObj
          );
        } else {
          let obj = {
            groupCode: this.goods[i].groupCode,
            goodsID: this.goods[i].goodsID,
            goodsName: this.goods[i].goodsName,
            specification: this.goods[i].specification,
            stockQty: this.goods[i].stockQty,
            salesQty: this.goods[i].salesQty,
            approveSalesQty: this.goods[i].approveSalesQty,
          };
          this.products3.set(
            this.goods[i].groupName + ' ' + this.goods[i].groupCode,
            [obj]
          );
        }
      }
      console.log(this.products3, ' dsdsdsd');

      this.loadData(this.products3);
    });

    // }

    // },4000);
  }

  loadData(products: any): void {
    // console.log(this.productType, ' Load Data from nav-belt');
    this.sliderData.clear;

    for (const [key, value] of products.entries()) {
      this.finalProducts.set(key, []);
      let obj = [];
      console.log(value[0].approveSalesQty, ' check bro');
      for (let i = 0; i < value.length; i++) {
        if (i % 4 != 0 || i == 0) {
          let d = {
            gname: value[i].goodsName,
            aqt: value[i].approveSalesQty,
            spec: value[i].specification,
          };
          obj.push(d);
          if (i == value.length - 1) {
            let temp = this.finalProducts.get(key);
            temp.push(obj);
            this.finalProducts.set(key, temp);
            obj = [];
          }
        } else {
          let temp = this.finalProducts.get(key);
          temp.push(obj);
          this.finalProducts.set(key, temp);
          obj = [];
          let d = {
            gname: value[i].goodsName,
            aqt: value[i].approveSalesQty,
            spec: value[i].specification,
          };
          obj.push(d);
        }

        // }
      }
    }

    // if(this.cnt==0){
    //   this.loaded(this.sliderData);
    //   this.cnt++;
    //  }
    //  else{
    //  this.secondLoad()
    //  }
  }

  //   loaded(data:any):void{

  //       for(const [key, value] of data.entries()){
  //              this.finalProducts.set(key,[]);
  //               let obj=[];
  //         for (let i = 0; i < value.length; i++) {
  //               if(i%4!=0 || i==0){
  //                    let d={
  //                         gname:value[i][0],
  //                         aqt:value[i][1]
  //                    }
  //                   obj.push(d);
  //                 if(i==value.length-1){
  //                   let temp=this.finalProducts.get(key);
  //                   temp.push(obj);
  //                   this.finalProducts.set(key,temp);
  //                   obj=[];
  //                 }
  //               }
  //              else{
  //                  let temp=this.finalProducts.get(key);
  //                          temp.push(obj);
  //                          this.finalProducts.set(key,temp);
  //                          obj=[];
  //                          let d={
  //                           gname:value[i][0],
  //                           aqt:value[i][1]
  //                           }
  //                          obj.push(d);
  //                     }

  //              }
  //       }
  //       console.log(this.finalProducts," final products");

  //       // this.secondLoad();

  // }

  //   secondLoad():void {

  //     //  console.log("Hello");
  //     this.finalProducts2.clear();
  //     this.products2 = this.sliderData;
  //     var arr:number[] = new Array();

  //      console.log(this.products2," lu");

  //      let j:number=0;
  //     for(const [key, value] of this.products2.entries()){
  //       this.finalProducts2.set(key,[]);
  //        let obj=[];
  //     for (let i = 0; i < value.length; i++) {
  //        if(i%4!=0 || i==0){
  //             let d={
  //                  gname:value[i][0],
  //                  aqt:value[i][1]

  //             }

  //            obj.push(d);
  //          if(i==value.length-1){
  //            let temp=this.finalProducts2.get(key);
  //            temp.push(obj);
  //            this.finalProducts2.set(key,temp);
  //            obj=[];
  //          }

  //        }
  //       else{
  //           let temp=this.finalProducts2.get(key);
  //                   temp.push(obj);
  //                   this.finalProducts2.set(key,temp);
  //                   obj=[];
  //                   let d={
  //                    gname:value[i][0],
  //                    aqt:value[i][1]
  //                    }
  //                   obj.push(d);
  //              }
  //              arr[j]=value[i][1];
  //              j++;
  //       }

  //   }
  //     //  console.log(this.finalProducts2.get("Decking")[0][0]," fine product 2");

  //    let k=0;

  //    for (const [key, value] of this.finalProducts2.entries()) {
  //     for (let i = 0; i < value.length; i++) {
  //       for (let j = 0; j < value[i].length; j++) {

  //         if(this.finalProducts.get(key)[i][j].gname===value[i][j].gname){
  //           this.finalProducts.get(key)[i][j].aqt=value[i][j].aqt;
  //         }

  //       }
  //     }
  //   }

  // }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
