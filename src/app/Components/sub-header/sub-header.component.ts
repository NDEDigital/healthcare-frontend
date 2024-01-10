import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.css'],
})
export class SubHeaderComponent {
  @Input() headerTitle: any;
  isBuyer: boolean = false;
  isAdmin: boolean = false;
  isSeller: boolean = false;
  ngOnInit() {}
  redirect() {
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      this.isAdmin = true;
      this.isBuyer = false;
      this.isSeller = false;
    }
    if (role === 'seller') {
      this.isSeller = true;
      this.isBuyer = false;
      this.isAdmin = false;
    }

    if (role === 'buyer') {
      this.isBuyer = true;
      this.isAdmin = false;
      this.isSeller = false;
    }
    console.log(role);

    if (!this.isSeller && !this.isAdmin) {
      window.location.href = '/';
    } else {
      window.location.href = '/dashboard';
    }
  }
}
