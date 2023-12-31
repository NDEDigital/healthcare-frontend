import { Component, ElementRef } from '@angular/core';
import { SellerOrderOverviewService } from '../../../app/services/SellerOrderOverviewService';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seller-inventory',
  templateUrl: './seller-inventory.component.html',
  styleUrls: ['./seller-inventory.component.css'],
})
export class SellerInventoryComponent {
  SearchByname = 'Search by';
  placeholder = 'Search by';
  searchby = ' Goods Name';
  searchInputValue = '';
  inventoryData: any = [];
  goodsName: string = '';
  groupCode: string = '';
  sellerId: any;
  constructor(
    private elementRef: ElementRef,
    private SellerService: SellerOrderOverviewService
  ) {}
  ngOnInit() {
    this.GetData();
  }

  setSearchOption(text: string) {
    this.searchInputValue = '';
    this.SearchByname = text;
    console.log(' this.SearchByname ', this.SearchByname);
    this.searchby = text;
    this.placeholder = ' Search by ';
    // clearing search value and call data with out search
    this.goodsName = '';
    this.groupCode = '';
    this.GetData();
  }

  onKeyUp(event: KeyboardEvent) {
    // Check if the pressed key is Enter (keycode 13) or Backspace (keycode 8)
    if (event.keyCode === 13 || event.keyCode === 8) {
      console.log('  searchInputValue', this.searchInputValue);
      this.Search();
    }
  }

  Search() {
    // checking
    if (this.SearchByname == 'GroupCode') {
      this.groupCode = this.searchInputValue.trim();
    } else {
      this.goodsName = this.searchInputValue.trim();
    }

    this.GetData();
  }

  searchIcon() {
    this.Search();
  }

  GetData() {
    this.sellerId = localStorage.getItem('code') || '';
    console.log(' sellerId', this.sellerId);

    this.SellerService.getSellerInventory(this.sellerId).subscribe(
      (data: any) => {
        console.log(' load dataaaaaa', data); // Use a type if possible for better type checking
        this.inventoryData = data;
      }
    );
  }
}
