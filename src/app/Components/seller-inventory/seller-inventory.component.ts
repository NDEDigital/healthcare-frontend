import { Component, ElementRef } from '@angular/core';
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

  constructor(private elementRef: ElementRef) {}

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
}
