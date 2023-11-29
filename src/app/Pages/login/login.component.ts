import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserDataService } from 'src/app/services/user-data.service';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: any;
  refreshToken: string = 'fhwe';

  constructor(
    private userData: UserDataService,
    private sharedServiceData: SharedService,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      phoneNumber: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required),
    });
  }

  onLoginClick() {
    Object.values(this.loginForm.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
    });

    if (this.loginForm.invalid) {
      // console.log('invalid');
      return;
    }
    const loginData = {
      PhoneNumber: this.loginForm.value.phoneNumber,
      Password: this.loginForm.value.password,
    };
    this.userData.loginUser(loginData).subscribe({
      next: (response: any) => {
        console.log('token ', response.token);
        console.log('newRefreshToken ', response.newRefreshToken);
        // Set the token in local storage

        this.userData.SetAccessToken(response.token);
        this.userData.SetRefreshToken(response.newRefreshToken);
        this.refreshToken = response.newRefreshToken;
        // console.log(response.encryptedUserCode);
        this.errorMessage = '';
        this.loginForm.reset();
        // alert(response.message);
        this.sharedServiceData.updateLoginStatus(
          true,
          response.encryptedUserCode,
          response.role
        );

        // this.sharedServiceData.loggedInUserInfo(response.user);
        if (response.role === 'buyer') {
          this.router.navigate(['/']);

          // const localStorageRefresh = localStorage.getItem('RefreshToken');

          // console.log(' localStorage Refresh', localStorageRefresh);

          // this.userData.RenewToken(this.refreshToken).subscribe({
          //   next: (response) => {
          //     console.log(' refresh call', response);
          //   },
          //   error: (error) => {
          //     console.log(error);
          //   },
          // });
        } else this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
         console.log(error);
        this.errorMessage = error.error.message;
        // this.errorMessage = " pass word does not match";
        //   alert(" error");
      },
      // complete() {
      //   // window.location.href = '/';
      //   // this.router.navigate(['/']);
      // },
    });
  }
  isFieldInvalid(fieldName: string) {
    const field = this.loginForm.get(fieldName);
  //  this.errorMessage = '';
    // return field?.invalid && field.touched;
    return field?.invalid && field.touched && field.dirty ;
  }
  getPhoneNumberErrorMessage() {
    const phoneControl = this.loginForm.get('phoneNumber');
    if (phoneControl?.hasError('required')) {

      return 'Phone number is required.';
    }
    //else if (phoneControl?.hasError('pattern')) {
    //   return 'Invalid phone number format.';
    // } else if (phoneControl?.hasError('minlength')) {
    //   return 'Phone number must be at least 11 digits.';
    // } else if (phoneControl?.hasError('maxlength')) {
    //   return 'Phone number cannot exceed 11 digits.';
    // }
    return ''; // Default empty message
  }
}
