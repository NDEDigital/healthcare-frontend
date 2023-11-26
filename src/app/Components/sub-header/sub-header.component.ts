import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.css'],
})
export class SubHeaderComponent {
  @Input() headerTitle: any;
  isbuyer = false;
  ngOnInit() {
    const role = localStorage.getItem('role');
    if (role === 'buyer') this.isbuyer = true;
  }
}
