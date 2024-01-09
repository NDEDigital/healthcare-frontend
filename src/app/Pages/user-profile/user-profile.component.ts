import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl,Validators, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent {
  user$ = this.sharedService.user$;
  user: any;
  @ViewChild('editBTN')
  editBTN!: ElementRef;
  updateUserForm: FormGroup;
  Role = '';
  constructor(
    private sharedService: SharedService,
    private userDataService: UserDataService
  ) {
    let role = localStorage.getItem('role');
    if (role) {
      this.Role = role;
    }
    const userCode = localStorage.getItem('code');

    // //console.log(userCode, 'code');
    this.userDataService.getSingleUser(userCode).subscribe({
      next: (response: any) => {
        // //console.log(response);
        const userData = response.user;
        this.sharedService.loggedInUserInfo(userData);
      },
      error: (error: any) => {
        // Handle the error
        // //console.log(error);
      },
    });

    // this.user$.subscribe((user) => {
    //   //console.log(user, 'user');
    //   this.user = user; // Update the user property for use in the component

    //   // //console.log(this.user, ' this.user ');
    // });
    // //console.log(this.user, ' this.user');
    // this.updateUserForm = new FormGroup({
    //   email: new FormControl(this.user.email),
    //   address: new FormControl(this.user.address),
    //   companyName: new FormControl(this.user.companyName),
    //   website: new FormControl(this.user.website),
    //   // productCategory: new FormControl(''),
    //   yearsInBusiness: new FormControl(this.user.yearsInBusiness),
    //   businessRegNum: new FormControl(this.user.businessRegistrationNumber),
    //   taxIdNum: new FormControl(this.user.taxIDNumber),
    //   // prefPaymentMethod: new FormControl(''),
    // });
    this.user$.subscribe((user) => {
      // //console.log(user, 'user');
      this.user = user; // Update the user property for use in the component
      if (this.updateUserForm) {
        this.updateUserForm.patchValue({
          email: this.user ? this.user.email : '',
          address: this.user ? this.user.address : '',
          companyName: this.user ? this.user.companyName : '',
          website: this.user ? this.user.website : '',
          yearsInBusiness: this.user ? this.user.yearsInBusiness : '',
          businessRegNum: this.user ? this.user.businessRegistrationNumber : '',
          taxIdNum: this.user ? this.user.taxIDNumber : '',
        });
      }
    });

    this.updateUserForm = new FormGroup({
      email: new FormControl('',Validators.required),
      address: new FormControl('', Validators.required),
      companyName: new FormControl(''),
      website: new FormControl(''),
      yearsInBusiness: new FormControl(''),
      businessRegNum: new FormControl(''),
      taxIdNum: new FormControl(''),
    });
  }

  // Your user object or interface
  editMode: string = '';
  editMode1: string = '';
  editMode2: string = '';

  toggleEditMode(section: string) {
    // //console.log('aise');

    if ('contact' === section) {
      this.editMode1 = 'contact';
    } else {
      if ('companyInfo' === section) {
        this.editMode2 = 'companyInfo';
      }
    }
  }
  // toggleEditMode1(section: string) {
  //   //console.log('aise');

  //   this.editMode1 = 'contact';
  // }
  // toggleEditMode2(section: string) {
  //   //console.log('aise');
  //   this.editMode2 = 'companyInfo';
  // }
  onInputFocus(input: HTMLInputElement | HTMLTextAreaElement) {
    if (this.editMode === 'contact') {
      input.classList.add('editable');
    }
  }

  onInputBlur(input: HTMLInputElement | HTMLTextAreaElement) {
    // input.classList.remove('editable');
  }


  isFieldInvalid(fieldName: string): boolean {
    const field = this.updateUserForm.get(fieldName);
    // Check if the field is not null before accessing its properties
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }



  updateUser(section: string) {
    if (this.updateUserForm.valid) {
      // Perform the update operation using the updated form values
      // const updatedUser = { ...this.user, ...this.updateUserForm.value };
      this.user.email = this.updateUserForm.value.email;
      this.user.address = this.updateUserForm.value.address;
      //this.user.companyName = this.updateUserForm.value.companyName;
      //this.user.website = this.updateUserForm.value.website;
      //this.user.yearsInBusiness = this.updateUserForm.value.yearsInBusiness;
      //this.user.businessRegistrationNumber =
        //this.updateUserForm.value.businessRegNum;
      //this.user.taxIDNumber = this.updateUserForm.value.taxIdNum;
      const updatedUser = this.user;
      // //console.log(updatedUser, 'updatedUser');
      this.userDataService.updateUser(updatedUser).subscribe({
        next: (response: any) => {
          location.reload();
          console.log(response);
          //console.log(updatedUser, 'userData');
          // Clear the form
          // this.userForm.reset();
          alert(response.message);

          //
          this.sharedService.loggedInUserInfo(response.user);
          // this.closeEditBTN();
          if (section === 'companyInfo') this.editMode2 = '';
          if (section === 'contact') this.editMode1 = '';
          // location.reload();
        },
        error: (error: any) => {
          // //console.log(error);
          // alert(error.error.message);
        },
      });
    }
  }
  closeEditBTN() {
    // this.editBTN.nativeElement.click();
  }
}
