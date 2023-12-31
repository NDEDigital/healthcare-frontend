import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  HostListener,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { catchError, find, throwError } from 'rxjs';
import { GoodsDataService } from 'src/app/services/goods-data.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.css'],
})
export class ProductSliderComponent {
  @ViewChildren('Items') itemsContainers!: QueryList<ElementRef>;

  private intervalIds: any[] = [];
  goods: any;
  goodsArray: any = [];
  sortedProductSize: [string, number][] = [];

  constructor(
    private goodsDataObj: GoodsDataService,
    private sharedService: SharedService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  productLengths: number[] = [];
  productType = new Map();
  GroupdCode: string = '';
  products = new Map();
  productChildLength: any;
  isWidthGreater: boolean = false;
  products3 = new Map();
  products2 = new Map();
  finalProducts = new Map();
  finalProducts2 = new Map();
  private intervalId: any;
  // private productType=new Map();
  // goods:any;
  sliderData = new Map();
  cnt: number = 0;
  productTitle = '';

  modalTitle: string = 'Decking';
  modalSpec: string = '';
  modalQuantity: string = '';
  modalGroup: string = 'Checkered Plate';
  isMouseOverSlider: boolean[] = [true];
  ngOnInit() {
    this.getAllProduct();
    // setTimeout(() => {
    //   this.isMouseOverSlider = Array(this.itemsContainers.length).fill(false);
    // }, 500);

    // setTimeout(() => {
    //   this.startAutoSlide();
    // }, 600);
  }
  // getAllProduct() {
  //   this.products.clear();
  //   this.goodsDataObj.getCarouselData().subscribe((data: any[]) => {
  //     // console.log(data);

  //     this.goods = data;
  //     // console.log(this.goods, 'allGoods');
  //     for (let i = 0; i < this.goods.length; i++) {
  //       let finObj = this.products3.get(this.goods[i].groupName);
  //       console.log();

  //       if (this.goods[i].approveSalesQty === '0') continue;

  //       if (finObj) {
  //         let obj = {
  //           companyName: this.goods[i].companyName,
  //           groupName: this.goods[i].groupName,
  //           groupCode: this.goods[i].groupCode,
  //           goodsId: this.goods[i].goodsId,
  //           goodsName: this.goods[i].goodsName,
  //           specification: this.goods[i].specification,
  //           stockQty: this.goods[i].stockQty,
  //           salesQty: this.goods[i].salesQty,
  //           approveSalesQty: this.goods[i].approveSalesQty,
  //           price: this.goods[i].price,
  //         };
  //         finObj.push(obj);

  //         this.products3.set(this.goods[i].groupName, finObj);
  //       } else {
  //         let obj = {
  //           companyName: this.goods[i].companyName,
  //           groupName: this.goods[i].groupName,
  //           groupCode: this.goods[i].groupCode,
  //           goodsId: this.goods[i].goodsId,
  //           goodsName: this.goods[i].goodsName,
  //           specification: this.goods[i].specification,
  //           stockQty: this.goods[i].stockQty,
  //           salesQty: this.goods[i].salesQty,
  //           approveSalesQty: this.goods[i].approveSalesQty,
  //           price: this.goods[i].price,
  //         };
  //         this.products3.set(this.goods[i].groupName, [obj]);
  //       }
  //     }
  //     // console.log(this.products3, ' products3');
  //     this.updateQuantity();

  //     // this.products3.forEach((product) => {
  //     //   console.log(product, 'product');
  //     //   console.log(product[0], 'product[0]');
  //     // });

  //     // this.products3.forEach((product) => {
  //     //   console.log(product, 'product');
  //     //   product.forEach((item: Product) => {
  //     //     console.log(item.goodsName);
  //     //   });
  //     // });
  //   }
  //   );

  //   // }
  // }
  getAllProduct() {
    this.products.clear();
    this.goodsDataObj.getCarouselData().subscribe(
      (data: any[]) => {
        this.goods = data;
             console.log(this.goods);
             
        for (let i = 0; i < this.goods.length; i++) {
          let finObj = this.products3.get(this.goods[i].productGroupName);
         
          if (this.goods[i].approveSalesQty === '0') continue;

          if (finObj) {
            let obj = {
              companyName: this.goods[i].companyName,
              groupCode: this.goods[i].productGroupID,
              goodsId: this.goods[i].productId,
              groupName: this.goods[i].productGroupName,                
              goodsName: this.goods[i].productName,
              specification: this.goods[i].specification,
              approveSalesQty: this.goods[i].availableQty,
              sellerCode: this.goods[i].sellerId,
              unitId:this.goods[i].unitId,
              quantityUnit :  this.goods[i].unit,
              imagePath :  this.goods[i].imagePath,
              price: this.goods[i].price,
              discountAmount: this.goods[i].discountAmount,
              discountPct: this.goods[i].discountPct,
              netPrice: this.goods[i].totalPrice
            
            };
            finObj.push(obj);

            this.products3.set(this.goods[i].productGroupName, finObj);
          } else {
            let obj = {
              companyName: this.goods[i].companyName,
              groupCode: this.goods[i].productGroupID,
              goodsId: this.goods[i].productId,
              groupName: this.goods[i].productGroupName,                
              goodsName: this.goods[i].productName,
              specification: this.goods[i].specification,
              approveSalesQty: this.goods[i].availableQty,
              sellerCode: this.goods[i].sellerId,
              unitId:this.goods[i].unitId,
              quantityUnit :  this.goods[i].unit,
              imagePath :  this.goods[i].imagePath,
              price: this.goods[i].price,
              discountAmount: this.goods[i].discountAmount,
              discountPct: this.goods[i].discountPct,
              netPrice: this.goods[i].totalPrice
            };
            // console.log(obj," uts");
            
            this.products3.set(this.goods[i].productGroupName, [obj]);
             
            
          }
          // console.log(this.products3," ut");
          
        }

        // console.log(this.products3, ' products3');
         this.updateQuantity();

        // Add any other code or logic you need here
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Handle unauthorized error
          console.error('Unauthorized Error', error);
        }
        // You can choose to throw an error or handle it differently based on your requirements
        throwError('Error occurred');
      }
    );
  }

  // updateQuantity() {
  //   this.intervalId = setInterval(() => {
  //     console.log('Fetching carousel data...');
  //     this.goodsDataObj.getCarouselData().subscribe((data: any[]) => {
  //         console.log('Received carousel data:', data);
  //         this.goods = data;
  //         for (let i = 0; i < this.goods.length; i++) {
  //           let key = this.goods[i].groupName;
  //           let finObj = this.products3.get(key);
  //           if (this.goods[i].approveSalesQty === '0') continue;

  //           if (finObj) {
  //             let product = finObj.find(
  //               (p: any) => p.goodsId === this.goods[i].goodsId
  //             );
  //             if (product) {
  //               product.approveSalesQty = this.goods[i].approveSalesQty;
  //             } else {
  //               let obj = {
  //                 approveSalesQty: this.goods[i].approveSalesQty,
  //               };
  //               finObj.push(obj);
  //             }
  //           } else {
  //             let obj = {
  //               approveSalesQty: this.goods[i].approveSalesQty,
  //             };
  //             this.products3.set(key, [obj]);
  //           }
  //         }
  //         console.log(this.products3, ' product3');
  //       },
  //       catchError((error: HttpErrorResponse) => {
  //         if (error.status === 401) {
  //           // Handle unauthorized error
  //           console.error('Unauthorized Error', error);
  //         } else {
  //           // Handle other errors
  //           console.error('Unknown Error', error);
  //         }
  //         return throwError('Error occurred');
  //       })
  //     );
  //   }, 5000);
  // }

  updateQuantity() {
     this.intervalId = setInterval(() => {
      this.goodsDataObj.getCarouselData().subscribe((data: any[]) => {
        console.log(' data error ');
        this.goods = data;
        // console.log(this.goods, 'allGoods');

        for (let i = 0; i < this.goods.length; i++) {
          let key = this.goods[i].productGroupName;
          let finObj = this.products3.get(key);
          if (this.goods[i].approveSalesQty === '0') continue;

          if (finObj) {
            let product = finObj.find(
              (p: any) => p.goodsId === this.goods[i].productId
            );
            if (product) {
              // product.stockQty = this.goods[i].stockQty;
              // product.salesQty = this.goods[i].salesQty;
              product.approveSalesQty = this.goods[i].availableQty;
            } else {
              let obj = {
                // groupName: this.goods[i].groupName,
                // groupCode: this.goods[i].groupCode,
                // goodsId: this.goods[i].goodsId,
                // goodsName: this.goods[i].goodsName,
                // specification: this.goods[i].specification,
                // stockQty: this.goods[i].stockQty,
                // salesQty: this.goods[i].salesQty,
                approveSalesQty: this.goods[i].availableQty,
              };
              finObj.push(obj);
            }
          } else {
            let obj = {
              // groupName: this.goods[i].groupName,
              // groupCode: this.goods[i].groupCode,
              // goodsId: this.goods[i].goodsId,
              // goodsName: this.goods[i].goodsName,
              // specification: this.goods[i].specification,
              // stockQty: this.goods[i].stockQty,
              // salesQty: this.goods[i].salesQty,
              approveSalesQty: this.goods[i].availableQty,
            };
            this.products3.set(key, [obj]);
          }
        }
        //  console.log("la");
         
        // catchError((error: any) => {
        //   console.error('Error:', error);
        //   if (error.status === 401) {
        //     console.log('Error status 401. Retrying after 5 seconds...');
        //     setTimeout(() => this.updateQuantity , 3000);
        //   }
        //   return throwError(error);
        // })

        // console.log(this.products3, 'products3');
      });
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId); // Clear the interval using the stored interval ID
    // this.stopAutoSlide();
    // this.isMouseOverSlider = Array(this.itemsContainers.length).fill(false);
  }
  // slide(index: number): void {
  //   // console.log('sliding');

  //   if (this.isMouseOverSlider[index]) {
  //     return;
  //   }
  //   const itemsContainer = this.itemsContainers.toArray()[index].nativeElement;
  //   const items = Array.from(itemsContainer.children);

  //   items.forEach((item: any) => {
  //     item.style.transition = 'transform .5s ease-in-out';
  //     item.style.transform = 'translateX(-105%)';

  //     setTimeout(() => {
  //       itemsContainer.appendChild(items[0]);
  //       item.style.transition = 'none';
  //       item.style.transform = 'translateX(-0.15%)';
  //     }, 500);
  //   });
  // }

  // onMouseEnter(index: number): void {
  //   this.isMouseOverSlider[index] = true;
  //   this.stopAutoSlide(index);
  // }

  // onMouseLeave(index: number): void {
  //   this.isMouseOverSlider[index] = false;
  //   if (!this.isMouseOverSlider.includes(true)) {
  //     this.startAutoSlide();
  //   }
  // }
  // startAutoSlide(): void {
  //   // console.log(this.isMouseOverSlider, 'isMouseOverSlider');

  //   this.isMouseOverSlider.forEach((_, index) => {
  //     this.intervalIds[index] = setInterval(() => {
  //       if (!this.isMouseOverSlider[index]) {
  //         this.slide(index);
  //       }
  //     }, 5000);
  //   });
  // }

  // stopAutoSlide(index?: number): void {
  //   if (index !== undefined) {
  //     clearInterval(this.intervalIds[index]);
  //   } else {
  //     this.intervalIds.forEach((id) => {
  //       clearInterval(id);
  //     });
  //   }
  // }
  // =============================
  next(index: number): void {
    const itemsContainer = this.itemsContainers.toArray()[index].nativeElement;
    const items = Array.from(itemsContainer.children);

    items.forEach((item: any) => {
      item.style.transition = 'transform .5s ease-in-out';
      item.style.transform = 'translateX(-105%)';

      setTimeout(() => {
        itemsContainer.appendChild(items[0]);
        item.style.transition = 'none';
        item.style.transform = 'translateX(-0.15%)';
      }, 500);
    });
  }

  prev(index: number): void {
    // console.log('prev');

    const itemsContainer = this.itemsContainers.toArray()[index].nativeElement;
    const items = Array.from(itemsContainer.children);

    // Set initial transform for animation
    items.forEach((item: any) => {
      item.style.transition = 'none';
      item.style.transform = 'translateX(-100%)';
    });

    // Move the last item to the beginning
    itemsContainer.insertBefore(items[items.length - 1], items[0]);

    // Trigger reflow to ensure initial styles are applied

    // void itemsContainer.offsetWidth; // ********** offsetWidth does not work on IIS
    void itemsContainer.getBoundingClientRect().width;

    // Apply transition and final transform for animation
    items.forEach((item: any) => {
      item.style.transition = 'transform .6s ease-in-out';
      item.style.transform = 'translateX(0)';
    });

    // Use setTimeout to remove transition after animation ends
    setTimeout(() => {
      items.forEach((item: any) => {
        item.style.transition = 'none';
      });
    }, 700);
  }

  dataClick(
    title: string,
    specification: string,
    approveSalesQty: string,
    groupName: string
  ) {
    this.modalTitle = title;
    this.modalSpec = specification;
    this.modalQuantity = approveSalesQty;
    this.modalGroup = groupName;
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event: Event) {
  //   const windowWidth = (event.target as Window).innerWidth;
  //   this.isWidthGreater = windowWidth >= 786;

  //   if (windowWidth < 1300) {
  //     this.renderer.removeClass(this.elementRef.nativeElement, 'remove-btn');
  //     console.log('removed');
  //   }
  // }
  // =========================================================
  // In your component or script file
  splitProductKey(key: string) {
    const trimmedKey = key.trim();
    const parts = trimmedKey.split('GG');
    const firstHalf = parts[0].trim();
    // console.log(firstHalf);
    return firstHalf;
  }

  navigateToData(detail: any) {
    sessionStorage.setItem('productData', JSON.stringify(detail));
    window.open('/productDetails', '_blank');
  }
}
