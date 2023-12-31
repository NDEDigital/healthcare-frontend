import { Component } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-compare-product',
  templateUrl: './compare-product.component.html',
  styleUrls: ['./compare-product.component.css'],
})
export class CompareProductComponent {
  images: string[] = [];
  left: string = '0';
  startIndex = 0;
  visibleImages: string[] = [];
  total: number = 0;
  compareData: any = {};
  showCompareTableData: any = [];
  showIn: number = 10;

  constructor(private sharedService: SharedService) {
    if (this.sharedService.compareData) {
      this.compareData = this.sharedService.compareData;
      this.updateStatus();
    }
  }

  // selected product for compare

  removeCompareProduct(indx: number) {
    //console.log(indx, ' indx');

    this.compareData.splice(indx, 1);
    this.updateFirstSecondThird();
  }
  // slider
  // previousSlide(): void {
  //   let num = parseInt(this.left);

  //   if (num - 100 >= 0) {
  //     this.showIn--;
  //     num -= 100;
  //   }

  //   this.left = '' + num;
  //   this.updateVisibleImages(num);
  // }

  // nextSlide(): void {
  //   let num = parseInt(this.left);
  //   if (this.showIn + 1 <= this.total) {
  //     this.showIn++;
  //     num += 100;
  //   }
  //   this.left = '' + num;
  //   this.updateVisibleImages(num);
  // }

  // Dynamic Data compare table
  first: number = 0;
  second: number = 1;
  third: number = 2;
  backColor: string = 'gray';
  forWardColor: string = this.total > 10 ? 'black' : 'gray';

  updateFirstSecondThird() {
    if (this.first !== 0) {
      this.first--;
      this.second--;
      this.third--;
    }
    this.updateStatus();
  }

  updateStatus(): void {
    if (!this.compareData.length) {
      this.backColor = 'gray';
      this.forWardColor = 'gray';
      //console.log('digonto');
    } else {
      if (this.first == 0) {
        this.backColor = 'gray';
      } else {
        this.backColor = 'black';
      }
      if (this.third + 1 < this.compareData.length) {
        this.forWardColor = 'black';
      } else {
        this.forWardColor = 'gray';
      }
    }
  }
  prevProduct() {
    if (this.compareData.length > 0 && this.first != 0) {
      this.first--;
      this.second--;
      this.third--;
    }
    this.updateStatus();
  }
  nextProduct() {
    if (this.third + 1 < this.compareData.length) {
      this.third++;
      this.second++;
      this.first++;
    }
    this.updateStatus();
  }
}
