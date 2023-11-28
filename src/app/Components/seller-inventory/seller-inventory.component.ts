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
  searchby = ' GroupCode';
  searchInputValue = '';
  inventoryData: any = [];
  sellerCode: any;
  constructor(
    private elementRef: ElementRef,
    private SellerService: SellerOrderOverviewService
  ) {}

  setSearchOption(text: string) {
    this.searchInputValue = '';
    this.SearchByname = text;
    this.searchby = text;
    this.placeholder = ' Search by ';
  }

  onKeyUp(event: KeyboardEvent) {
    // Check if the pressed key is Enter (keycode 13) or Backspace (keycode 8)
    if (event.keyCode === 13 || event.keyCode === 8) {
      console.log('  searchInputValue', this.searchInputValue);
    }
  }
  ngOnInit() {
    this.GetData();
  }

  GetData() {
this.sellerCode = localStorage.getItem('code') || '';
    console.log(" sellerCode", this.sellerCode)
    // this.SellerService.getSellerInventory('USR-STL-MDL-23-11-0003').subscribe(
    this.SellerService.getSellerInventory(this.sellerCode).subscribe(
      (data: any) => {
        console.log(' load dataaaaaa', data); // Use a type if possible for better type checking
        this.inventoryData = data;
      }
    );
  }
}
