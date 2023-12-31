import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-max-quantity-products-slider',
  templateUrl: './max-quantity-products-slider.component.html',
  styleUrls: ['./max-quantity-products-slider.component.css'],
})
export class MaxQuantityProductsSliderComponent {
  @ViewChild('Items', { static: true }) Items!: ElementRef;

  private intervalId: any;

  constructor() {}
  isMouseOverSlider = false;

  // ...

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isMouseOverSlider = true;
    this.stopAutoSlide();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isMouseOverSlider = false;
    if (!this.isMouseOverSlider) {
      this.startAutoSlide();
    }
  }
  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  slide(): void {
    const itemsContainer = this.Items.nativeElement;
    const items = Array.from(itemsContainer.children);
    items.forEach((item: any) => {
      // //console.log('for each');

      item.style.transition = 'transform .5s ease-in-out';
      item.style.transform = 'translateX(-103%)';
      var i = 0;
      setTimeout(() => {
        itemsContainer.appendChild(items[i]);
        item.style.transition = 'none';
        item.style.transform = 'translateX(-0.15%)';
        i++;
        // //console.log('next set timeout');
      }, 2000);
    });
  }

  startAutoSlide(): void {
    if (!this.isMouseOverSlider) {
      this.intervalId = setInterval(() => {
        this.slide();
      }, 3000);
    }
  }
  stopAutoSlide(): void {
    clearInterval(this.intervalId);
  }
  next(): void {
    // //console.log('hello next');
    const itemsContainer = this.Items.nativeElement;
    itemsContainer.appendChild(itemsContainer.children[0]);
  }

  prev(): void {
    // //console.log('hello prev');
    const allItems = this.Items.nativeElement.children;
    const firstItem = allItems[0];
    const lastItem = allItems[allItems.length - 1];
    this.Items.nativeElement.insertBefore(lastItem, firstItem);
  }
}
