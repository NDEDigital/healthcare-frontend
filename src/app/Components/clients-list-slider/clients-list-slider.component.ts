import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-clients-list-slider',
  templateUrl: './clients-list-slider.component.html',
  styleUrls: ['./clients-list-slider.component.css'],
})
export class ClientsListSliderComponent {
  @ViewChild('Items', { static: true }) Items!: ElementRef;
  @Input() clients: any;
  private intervalId: any;
  isMouseOverSlider = false;
  onMouseEnter() {
    this.isMouseOverSlider = true;
    console.log(this.isMouseOverSlider, 'this.isMouseOverSlider');
    this.stopAutoSlide();
  }

  onMouseLeave() {
    this.isMouseOverSlider = false;
    console.log(this.isMouseOverSlider, 'this.isMouseOverSlider');
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
      item.style.transition = 'transform .5s ease-in-out';
      item.style.transform = 'translateX(-105%)';
      setTimeout(() => {
        itemsContainer.appendChild(items[0]);
        item.style.transition = 'none';
        item.style.transform = 'translateX(-0.15%)';
      }, 500);
    });
  }
  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      if (!this.isMouseOverSlider) {
        console.log(this.isMouseOverSlider, 'this.isMouseOverSlider');

        this.slide();
      }
    }, 3000);
  }
  stopAutoSlide(): void {
    clearInterval(this.intervalId);
  }
}
