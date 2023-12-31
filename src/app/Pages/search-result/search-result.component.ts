import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GoodsDataService } from 'src/app/services/goods-data.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
})
export class SearchResultComponent {
  //Variable declaration section
  searchData: any[] = [];
  goods: any;
  totalPages: number = 1;
  searchKey: string = '';
  currentPage: number = 1;
  page: number = 1;
  selectedOption: string = 'Best Match';

  // compare Bottom Bar
  left: string = '0';
  startIndex = 0;
  visibleImages: string[] = [];
  showIn: number = 6;
  backColor: string = 'gray';
  forWardColor: string = '';
  compareData: any = [];
  showCompare: boolean = false;
  compareValues: string[] = Array(10).fill('Compare product');

  // search Api cll
  sortedKey: string = 'NAME';

  constructor(
    private goodsDataService: GoodsDataService,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.start();
  }

  // Method to get the range of pages to display in the pagination

  start() {
    if (this.searchKey != this.goodsDataService.searchKey) {
      this.goodsDataService.page = 1;
      this.page = 1;
      this.currentPage = 1;
    }
    this.searchKey = this.goodsDataService.searchKey;
    this.goodsDataService.getSearchResult().subscribe((data: any[]) => {
      this.goods = data;
      // this.searchData = data;
      for (let i = 0; i < this.goods.length; i++) {
        let obj = {
          companyName: this.goods[i].companyName,
          groupCode: this.goods[i].productGroupID,
          goodsId: this.goods[i].productId,
          groupName: this.goods[i].productGroupName,
          goodsName: this.goods[i].productName,
          specification: this.goods[i].specification,
          approveSalesQty: this.goods[i].availableQty,
          sellerCode: this.goods[i].sellerId,
          unitId: this.goods[i].unitId,
          quantityUnit: this.goods[i].unit,
          imagePath: this.goods[i].imagePath,
          price: this.goods[i].price,
          discountAmount: this.goods[i].discountAmount,
          discountPct: this.goods[i].discountPct,
          totalCount: this.goods[i].totalCount,
          netPrice: this.goods[i].totalPrice
        };
        //console.log(obj, this.searchData, 's data');

        this.searchData.push(obj);
      }
      if (this.searchData.length > 0) {
        this.compareValues = Array(20).fill('Compare product');
        //console.log(this.searchData, 'sda');

        this.totalPages = Math.ceil(this.searchData[0].totalCount / 20);
      }
      this.dataLoadDone();
    });
  }

  dataLoadDone() {
    window.scrollTo(0, 0);
  }
  generatePageArray(totalPages: number): number[] {
    // Generate an array of page numbers from 1 to totalPages
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  ////////////////////
  getDisplayPageRange(): number[] {
    // //console.log('a gaya2');
    const displayRangeSize = 3; // Number of pages to display at a time
    const middlePage = Math.ceil(displayRangeSize / 2);
    let startPage = this.page - middlePage + 1;
    if (startPage <= 0) {
      startPage = 1;
    }
    const endPage = Math.min(startPage + displayRangeSize - 1, this.totalPages);
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  navigateToPage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.goodsDataService.page = this.page;
      // ... Implement your logic to fetch the data for the new page
      this.compareData = [];
      this.showCompare = false;
      this.start();
    }
  }
  done(product: any) {
    //console.log(product, ' done');
  }

  updateCompareValue(index: number) {
    if (this.compareValues[index] === 'Compare product') {
      this.compareValues[index] = 'Added to Compare';
    } else {
      this.compareValues[index] = 'Compare product';
    }
    //console.log(this.compareValues);
  }

  receiveDataFromChild(dataEvent: any) {
    const obj = this.searchData[dataEvent.ind];
    if (this.compareValues[dataEvent.ind] === 'Added to Compare') {
      this.updateCompareValue(dataEvent.ind);
      for (let i = 0; i < this.compareData.length; i++) {
        if (this.compareData[i] === obj) {
          this.compareData.splice(i, 1);
          //console.log('Done');

          break;
        }
      }
    } else {
      if (this.compareData.length !== 10) {
        this.updateCompareValue(dataEvent.ind);
        this.compareData.push(obj);
      }
    }
    //console.log(this.compareData.length);

    if (this.compareData.length) {
      this.showCompare = true;
    } else {
      this.showCompare = false;
    }

    this.sliderActivationCheck();
  }

  // Slider

  sliderActivationCheck() {
    this.forWardColor = this.compareData.length > 6 ? 'black' : 'gray';
  }
  previousSlide(): void {
    // this.startIndex = Math.max(this.startIndex - 3, 0);
    let num = parseInt(this.left);

    if (num - 175 >= 0) {
      this.showIn--;
      num -= 175;
    }

    this.left = '' + num;
    this.updateVisibleImages(num);
  }

  nextSlide(): void {
    // this.startIndex = Math.min(this.startIndex + 3, this.images.length - 12);
    let num = parseInt(this.left);
    if (this.showIn + 1 <= this.compareData.length) {
      this.showIn++;
      num += 175;
    }
    this.left = '' + num;
    this.updateVisibleImages(num);
  }

  private updateVisibleImages(num: number): void {
    //console.log(num, ' num ', this.showIn);

    if (num < 175) {
      this.backColor = 'gray';
    } else {
      this.backColor = 'black';
    }
    if (this.showIn >= this.compareData.length) {
      this.forWardColor = 'gray';
    } else {
      this.forWardColor = 'black';
    }
  }
  // navigate compare page
  goCompare() {
    this.sharedService.setCompareData(this.compareData);
    this.router.navigate(['/compare']);
  }

  removeCompareSelectData(indx: number) {
    for (let i = 0; i < this.searchData.length; i++) {
      if (this.compareData[indx] === this.searchData[i]) {
        this.updateCompareValue(i);
        break;
      }
    }

    this.compareData.splice(indx, 1);

    if (this.compareData.length === 0) {
      this.showCompare = false;
    }

    this.previousSlide();
  }
  compareBoxNotShow() {
    this.showCompare = false;
  }
  clearAll() {
    this.compareData = [];
    this.backColor = 'gray';
    this.forWardColor = 'gray';
    this.showCompare = false;
    this.start();
  }

  // Search Filter drop down
  selectOption(option: string): void {
    this.selectedOption = option;
    option = option.split(' ').join('');

    if (option === 'BestMatch') {
      this.goodsDataService.sortedKey = 'NAME';
    } else if (option === 'PriceLowtoHigh') {
      //console.log('ASC');
      this.goodsDataService.sortedKey = 'ASC';
    } else {
      this.goodsDataService.sortedKey = 'DESC';
    }

    this.goodsDataService.page = 1;
    this.page = 1;
    this.currentPage = 1;
    this.start();
  }
}
