import {
  Component,
  ElementRef,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-home-core-content',
  templateUrl: './home-core-content.component.html',
  styleUrls: ['./home-core-content.component.css'],
})
export class HomeCoreContentComponent {
  @Output() product: any;
  products = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  clients = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  // @ViewChild('Items', { static: true }) Items!: ElementRef;

  // private intervalId: any;
  // isMouseOverSlider = false;
  constructor() {}

 
}

