import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  Input,
  ViewChild,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchResultComponent } from 'src/app/Pages/search-result/search-result.component';
import { CartDataService } from 'src/app/services/cart-data.service';
import { GoodsDataService } from 'src/app/services/goods-data.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  imgSrc: string = '';
  pForm: FormGroup;
  isLoggedIn = false;
  user$ = this.sharedService.user$;
  errorMessage: any;
  user: any;
  isBuyer: boolean = false;
  isAdmin: boolean = false;
  isSeller: boolean = false;

  private subscription: Subscription;
  isCategoriesVisible = false;
  goods: any;
  products = new Map();
  @ViewChild('closeButton')
  closeButton!: ElementRef;
  // @ViewChild(SearchResultComponent, { static: true })
  // searchResultComponent!: SearchResultComponent;
  @Output() someEvent = new EventEmitter<string>();

  @Input() cartCount: number = 0;
  @Output() dataUpdated = new EventEmitter<void>();
  activeEntry: string = '';
  searchQuery: string = '';
  cartCountLocal: number = 0;

  constructor(
    private sharedService: SharedService,
    private userDataService: UserDataService,
    private router: Router,
    private goodsData: GoodsDataService,
    private cartDataService: CartDataService
  ) {
    //this.isBuyer = JSON.parse(localStorage.getItem('isB') || 'false');
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

    // console.log(this.isBuyer, 'isBuyer');

    // console.log(this.sharedService.user$, ' lol');
    this.pForm = new FormGroup(
      {
        currentPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),
        ]),
        newPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),
        ]),
        confirmPassword: new FormControl('', Validators.required),
        // confirmPassword: new FormControl('', [
        //   Validators.required,
        //   Validators.minLength(8),
        //   Validators.maxLength(15),
        // ]),
      },
      { validators: this.passwordMatchValidator }
    );

    this.subscription = this.sharedService.loginStatus$.subscribe(
      (loginStatus) => {
        this.isLoggedIn = loginStatus;
      }
    );

    this.user$.subscribe((user) => {
      this.user = user; // Update the user property for use in the component
    });
  }

  // For search Related Works
  onSearch() {
    // Perform any search-related actions here using this.searchQuery.

    if (this.searchQuery) {
      // You can call a function to process the search query or update the data accordingly.
      this.goodsData.searchKey = this.searchQuery;
      this.processSearchQuery();
    }
  }

  processSearchQuery() {
    const currentRoute = this.router.url;
    this.goodsData.searchKey = this.searchQuery;

    if (currentRoute !== '/searchResult') {
      this.router.navigate(['/searchResult']);
    } else {
      this.someEvent.emit();
    }
  }

  ngOnInit() {
    const count = localStorage.getItem('cartCount');
    if (count !== null && count !== undefined) {
      this.cartCountLocal = JSON.parse(count);
    }
    this.loadCategories();
    this.cartCount = this.cartDataService.getCartCount();
    this.activeEntry = localStorage.getItem('activeEntry') || '';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/') {
          localStorage.removeItem('activeEntry');
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cartCount'] && !changes['cartCount'].firstChange) {
      this.cartCountLocal = changes['cartCount'].currentValue;
    }
  }

  setSelectData(groupName: string, groupCode: string) {
    this.sharedService.setNavSelectData(groupCode, groupName);
    // this.router.navigate(['/productsPageComponent']);
    window.location.href = '/productsPageComponent';
    this.dataUpdated.emit();
    // Update active entry
    this.activeEntry = groupName;

    localStorage.setItem('activeEntry', this.activeEntry);
  }
  loadCategories() {
    this.goodsData.getNavData().subscribe((data: any[]) => {
      this.goods = data;
      for (let i = 0; i < this.goods.length; i++) {
        this.products.set(this.goods[i].productGroupName, this.goods[i].productGroupCode);
      }
    });
    setTimeout(() => {}, 100);
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const navBeltElement = document.querySelector('app-nav-belt');
    if (navBeltElement) {
      const navBeltPosition = navBeltElement.getBoundingClientRect().bottom;
      // Check if the user has scrolled past the nav-belt position
      this.isCategoriesVisible = window.scrollY > navBeltPosition;
    }
  }
  // Close modal bootstrap
  closeModal() {
    this.closeButton.nativeElement.click();
  }
  closebtn() {
    this.pForm.reset();
  }
  formSubmit() {
    // console.log(this.pForm.get("newPassword"));
    // console.log(this.pForm.valid ,("this.pForm.valid "));
    // console.log(this.user.password ,("this.user.password"));
    // console.log(this.pForm.value.newPassword,("this.pForm.value.newPassword"));
    // console.log(
    //   this.pForm.value.currentPassword,
    //   'this.pForm.value.currentPassword'
    // );
    // console.log(this.pForm.get("newPassword"),("this.pForm.get(newPassword)"));
    if (
      // 1
      this.pForm.valid &&
      // this.user.password == this.pForm.value.currentPassword
      this.pForm.value.newPassword === this.pForm.value.confirmPassword
    ) {
      const userId: number = parseInt(localStorage.getItem('code') || '0', 10); // Use base 10
      const passData = {
        userId: userId,
        oldPassword: this.pForm.value.currentPassword,
        newPassword: this.pForm.value.newPassword,
      };
      console.log(passData, ' passData');

      this.userDataService.updatePass(passData).subscribe({
        next: (response: any) => {
          this.errorMessage = 'Password changed successfully';
          this.pForm.reset();
          this.closeModal();
          // this.router.navigate(['login']);
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = '/login';
          // let getUser = localStorage.getItem('loggedInUser');
          // if (getUser) {
          //   let updatedUser = JSON.parse(getUser);
          //   updatedUser.password = passData.newPassword;
          //   localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
          // }
          //  log.password=
        },
        error: (error: any) => {
          // console.log(error, ' ------error');
          this.errorMessage = error.error.message;
          // alert(error.error.message);
        },
        complete() {
          // localStorage.setItem('loggedInUser', 'myValue');
        },
      });
    } else {
      // alert('new Password and Confirm password Must match!');
      this.markFormGroupTouched(this.pForm);
    }
  }
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      // console.log('  Password and Confirm Password must match.');
      return { passwordMismatch: true };
    } else {
      control.get('confirmPassword')?.setErrors(null);
      // console.log('Password and Confirm Password matched!');
      return null;
    }
  }
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormControl) {
        control.markAsTouched();
        control.markAsDirty();
      } else if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getPasswordErrorMessage(controlName: string) {
    const passwordControl = this.pForm.get(controlName);

    if (passwordControl?.errors) {
      if (passwordControl.errors['required']) {
        return 'Password is required';
      } else if (passwordControl.errors['minlength']) {
        return 'Password should be at least 8 characters long';
      } else if (passwordControl.errors['maxlength']) {
        return 'Password can be at most 15 characters long';
      }
    }

    return '';
  }

  isFieldInvalid(fieldName: string) {
    const field = this.pForm.get(fieldName);
    return field?.invalid && field.touched && field.dirty;
  }

  logout() {
    this.sharedService.updateLoginStatus(false, null, null);
    localStorage.clear();
    sessionStorage.clear();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Declare a property to track the state of the side navigation
  isSideNavActive: boolean = false;
  isMobileMenuActive: boolean = false;
  isSidebarOutBoxActive: boolean = false;

  openSidebar() {
    this.isMobileMenuActive = true;
    this.isSidebarOutBoxActive = true;
    this.isSideNavActive = true;
    // console.log('isSidebarOutBoxActive:', this.isSidebarOutBoxActive);
    // console.log('isSideNavActive:', this.isSideNavActive);
    // console.log('bar');
  }
  // Add a method to remove the "active" class from the side navigation
  removeSideNavActiveClass() {
    this.isSideNavActive = false;
    this.isSidebarOutBoxActive = false;
    this.isMobileMenuActive = false;
    // console.log('cross');
    // console.log('isSidebarOutBoxActive:', this.isSidebarOutBoxActive);
    // console.log('isSideNavActive:', this.isSideNavActive);
  }
}
