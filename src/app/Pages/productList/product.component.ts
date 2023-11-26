import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/Pages/cart-added-product/cart-item.interface';
import { CartDataService } from 'src/app/services/cart-data.service';
import { GoodsDataService } from 'src/app/services/goods-data.service';
import { SharedService } from 'src/app/services/shared.service';

declare var bootstrap: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {
  products: any[] = [];
  products2: any[] = [];

  productType = new Map();
  GroupdCode: string = '';
  productSize = new Map();
  loading: boolean = true;
  role: any;
  isBuyer = true;

  @ViewChild('exampleModal') modalElement!: ElementRef;
  bsModal: any;

  constructor(
    private sharedService: SharedService,
    private goodsData: GoodsDataService,
    private cartDataService: CartDataService,
    private route: Router
  ) {
    this.role = localStorage.getItem('role');
    if (this.role === 'seller' || this.role === 'admin') {
      this.isBuyer = false;
    }
    this.goodsData
      .getProductList(this.sharedService.companyCode)
      .subscribe((data: any[]) => {
        this.products = data;
        this.filteredProducts = [...this.products];
      });

    this.interval = setInterval(() => {
      this.goodsData
        .getProductList(this.sharedService.companyCode)
        .subscribe((data: any[]) => {
          data.forEach((newProduct: any) => {
            const existingProduct = this.filteredProducts.find(
              (product: any) => product.goodsID === newProduct.goodsID
            );
            if (existingProduct) {
              existingProduct.approveSalesQty = newProduct.approveSalesQty;
              existingProduct.stockQty = newProduct.stockQty;
            }
          });
        });
    }, 5000);
  }
  sortedProductSize: [string, number][] = [];
  private interval: any;

  modalTitle: string = 'Decking';
  modalSpec: string = '';
  modalQuantity: string = '';
  modalGroup: string = 'Checkered Plate';

  activeGroupName = localStorage.getItem('activeEntry');
  filteredProducts: any[] = [];

  ngOnInit() {
    //  setTimeout(()=>{
    //   this.productType=this.sharedService.getProductType();
    //   this.GroupdCode=this.sharedService.getProductCode();

    //   this.loadData();
    //  },300)

    // this.interval=setInterval(() => {
    //   this.productType=this.sharedService.getProductType2();
    //   this.GroupdCode=this.sharedService.getProductCode();
    //   this.secondLoad();

    // }, 1000);
    // this.cartDataService.clearCartData();

    this.cartDataService.initializeAndLoadData();
    this.setServiceData();

    this.goodsData
      .getProductList(this.sharedService.companyCode)
      .subscribe((data: any[]) => {
        this.products = data;
        this.filteredProducts = [...this.products];
        this.loading = false;
      });

    this.interval = setInterval(() => {
      this.goodsData
        .getProductList(this.sharedService.companyCode)
        .subscribe((data: any[]) => {
          data.forEach((newProduct: any) => {
            const existingProduct = this.filteredProducts.find(
              (product: any) => product.goodsID === newProduct.goodsID
            );
            if (existingProduct) {
              existingProduct.approveSalesQty = newProduct.approveSalesQty;
              existingProduct.stockQty = newProduct.stockQty;
            }
          });
        });
    }, 5000);
  }
  ngAfterViewInit() {
    this.bsModal = new bootstrap.Modal(this.modalElement.nativeElement);
    this.modalElement.nativeElement.addEventListener('shown.bs.modal', () => {
      setTimeout(() => {
        this.bsModal.hide();
      }, 2000);
    });
  }

  searchProducts(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();

    if (searchTerm) {
      // Perform initial search
      this.filteredProducts = this.products.filter(
        (product: { goodsName: string }) =>
          product.goodsName &&
          product.goodsName.toLowerCase().includes(searchTerm)
      );

      if (this.filteredProducts.length === 0) {
        let maxMatchLength = 0;
        const maxMatchProducts: any[] = [];

        this.products.forEach((product: { goodsName: string }) => {
          // const productName = product.goodsName
          //   .toLowerCase()
          //   .split(' ')[0]
          //   .replace('mm', '');
          // const productName = product.goodsName.toLowerCase().split(' ')[0];
          const productName = product.goodsName.toLowerCase().replace('mm', '');

          const matchLength = this.getLongestCommonSubstringLength(
            productName,
            searchTerm
          );

          if (matchLength > maxMatchLength) {
            maxMatchLength = matchLength;
            maxMatchProducts.length = 0;
            maxMatchProducts.push(product);
          } else if (matchLength === maxMatchLength) {
            maxMatchProducts.push(product);
          }
        });

        // this.filteredProducts = maxMatchProducts;
        this.filteredProducts = maxMatchLength > 0 ? maxMatchProducts : [];
      }
    } else {
      this.filteredProducts = [...this.products];
    }
  }

  getLongestCommonSubstringLength(str1: string, str2: string): number {
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = [];
    // console.log(m, 'm', n, 'n');
    let maxLength = 0;

    for (let i = 0; i <= m; i++) {
      dp[i] = new Array(n + 1).fill(0);
    }
    // prefix mathing
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          // console.log(dp[i][j], ' dp[i][j]');

          maxLength = Math.max(maxLength, dp[i][j]);
        }
      }
    }

    return maxLength;
  }

  dataClick(entry: string) {
    // this.goodsData.setDetailData(entry);
    sessionStorage.setItem('productData', JSON.stringify(entry));
    // this.route.navigate(['/productDetails']);
    window.open('/productDetails', '_blank');
  }

  splitProductKey(key: string) {
    const trimmedKey = key.trim();
    const parts = trimmedKey.split('GG');
    const firstHalf = parts[0].trim();
    // console.log(firstHalf);
    return firstHalf;
  }

  // cart add relatet data ------------------------------------
  cartDataDetail: Map<string, CartItem> = new Map<string, CartItem>();
  cartDataQt = new Map<string, number>();
  popUpCount: number = 0;
  totalPrice = 0;
  cartCount: number = 0;

  setServiceData() {
    this.cartCount = this.cartDataService.getCartCount();
    this.cartDataDetail = this.cartDataService.getCartData().cartDataDetail;
    this.cartDataQt = this.cartDataService.getCartData().cartDataQt;
    this.totalPrice = this.cartDataService.getTotalPrice();
  }

  setCart(entry: any, inputQt: string) {
    if (entry.price === '' || entry.price === undefined) {
      entry.price = '12000';
    }
    let groupCode_groupId = entry.groupCode + '&' + entry.goodsID;

    this.cartDataService.setCartCount(groupCode_groupId);
    this.cartDataService.setPrice(
      entry.price,
      parseInt(inputQt),
      groupCode_groupId
    );
    this.cartDataService.setCartData(entry, inputQt);
    this.setServiceData();
    this.popUpCount = parseInt(inputQt);
  }

  getMaxValue(val: any) {
    return parseInt(val);
  }

  onInputChange(event: any, entry: any) {
    const inputValue = parseFloat(event.target.value);
    const maxValue = parseFloat(entry.approveSalesQty);

    if (inputValue > maxValue) {
      event.target.value = maxValue.toString();
    } else {
      event.target.value = inputValue;
    }
  }

  isEmpty(event: any) {
    if (event.target.value == '') {
      event.target.value = 1;
    }
  }

  updateCount() {
    this.cartCount = this.cartDataService.getCartCount();
  }

  deleteFromSideCart(entry: any) {
    this.cartDataService.deleteCartData(entry.key);
    this.setServiceData();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
