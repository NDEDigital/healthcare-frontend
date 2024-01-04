import { Component } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private sharedService: SharedService) {
    // this.user$.subscribe((user) => {
    //   //console.log(user, 'user');
    // });
  }
  user$ = this.sharedService.user$;
  user: any;
  clients = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  ngOnInit() {
    localStorage.removeItem('activeEntry');
    // const storedUser = localStorage.getItem('loggedInUser');
    // if (storedUser) {
    //   this.user = JSON.parse(storedUser);
    //   //this.sharedService.loggedInUserInfo(this.user); // Update the user info in shared service
    // }

    this.user$.subscribe((user) => {
      // //console.log(user, 'user');
      this.user = user; // Update the user property for use in the component
    });
  }
}
