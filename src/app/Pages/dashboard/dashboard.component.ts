import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { GoodsDataService } from 'src/app/services/goods-data.service';
import { SharedService } from 'src/app/services/shared.service';
import { LoginComponent } from '../login/login.component';
import { DashboardDataService } from 'src/app/services/dashboard-data.service';
import { Subscription } from 'rxjs';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { UserDataService } from 'src/app/services/user-data.service';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  @ViewChild('closeButton')
  closeButton!: ElementRef;
  @ViewChild('approvalCloseButton')
  approvalCloseButton!: ElementRef;
  @ViewChild('noProductSelectedModalBTN')
  noProductSelectedModalBTN!: ElementRef;
  @ViewChild('productDetailsModalBTN') productDetailsModalBTN!: ElementRef;
  products: any;
  indx: number = 0;
  sellerCode: any;
  productID: any;
  filteredProducts: any[] = []; // Array to hold the filtered products
  showSidebar = true;
  isAdmin: boolean = false;
  isBuyer: boolean = false;
  isSeller: boolean = false;
  // userRole: string = '';
  // isAdminOrder: boolean = false;
  // addProducts: boolean = false;
  // addGroups: boolean = false;

  sidebarCol1Title = 'Product List';
  sidebarCol2Title = 'Add Products';
  sidebarCol3Title = 'Orders';
  sidebarCol4Title = 'Inventory';
  sidebarCol5Title = 'Add Quantity';
  // sidebarCol6Title = 'Other Sales';
  sidebarCol7Title = 'Add Groups';
  sidebarCol8Title = 'Company Approval';
  sidebarCol9Title = 'Price & Discounts';
  sidebarCol4Link = '/payment';
  sidebarCol2Link = '/addProduct';
  sidebarCol3Link = '/ordersOverview';
  activeButton: string | null = 'new';
  status: string | null = 'new';
  // sellerInventory: boolean = false;
  SidebarIndex = 1;
  newCount = 0;
  editedCount = 0;
  approvedCount = 0;
  rejectedCount = 0;

  selectAllChecked: boolean = false;
  selectedCheckboxIds: string[] = [];
  publicIP = '0.0.0.0';
  searchedCompanyName: any = '';
  searchedProductName: any = '';
  searchedDate: any = '';
  rowsPerPage: number = 4;
  currentPage: number = 0;
  modalTitle = '';
  modalStatus = '';
  productDetails: any = [];
  isAdminOrderString: string = '';
  checkSidebar: string = '';
 
  loading: boolean = false;
  // SellerQuantity: boolean = false;
  productOthersSales: boolean = false;
  private subscription: Subscription;
  isLoggedIn = false;
  pForm: FormGroup;
  errorMessage: any;

  toUserList: any[] = [];
  constructor(
    private dashboardService: DashboardDataService,
    private sharedService: SharedService,
    private userDataService: UserDataService,
    private emailService: EmailService
  ) {
    this.sellerCode = localStorage.getItem('code');
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => {
        this.publicIP = data.ip;
        // console.log(this.publicIP, 'public ip');
      });
    this.subscription = this.sharedService.loginStatus$.subscribe(
      (loginStatus) => {
        this.isLoggedIn = loginStatus;
      }
    );
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
  }

  ngOnInit() {
    // const order = sessionStorage.getItem('checkSidebar');
    // console.log('  admin order clicked ', order);
    // if (order == 'active') {
    //   this.isAdminOrder = true;
    //   sessionStorage.setItem('checkSidebar', '');
    //   // Now, isAdminOrder contains the parsed value if it was not null
    // } else {
    //   this.isAdminOrder = false;
    // }
    this.getDashboardContents();

    setTimeout(() => {
      const role = localStorage.getItem('role');
      if (role === 'admin') {
        this.isAdmin = true;
      }
      if (role === 'seller') {
        this.isSeller = true;
      }

      if (role === 'buyer') {
        this.isBuyer = true;
      }

      console.log(this.isAdmin, 'isAdmin');
      if (this.isAdmin == true) {
        this.sidebarCol1Title = 'Product Approval';
        // this.sidebarCol2Link = '/becomeASeller'; // userList
      }
    }, 15);
    this.toggleSidebar();
  }
  editMode() {
    sessionStorage.clear();
    //window.location.href = this.sidebarCol2Link;
    window.open(this.sidebarCol2Link, '_blank');
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
  isFieldInvalid(fieldName: string) {
    const field = this.pForm.get(fieldName);
    return field?.invalid && field.touched && field.dirty;
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
      const passData = {
        userCode: localStorage.getItem('code'),
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
  logout() {
    this.sharedService.updateLoginStatus(false, null, null);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  }
  approvalModalStatus(btn: any) {
    console.log(btn);
    if (btn == 'approve') {
      this.modalTitle = 'Approve';
      this.modalStatus = 'approve';
    } else {
      this.modalTitle = 'Reject';
      this.modalStatus = 'reject';
    }
  }
  submitApprovalModal(status: any) {
    if (status == 'approve') {
      this.updateStatus('approved');
    } else {
      this.updateStatus('rejected');
    }
  }
  onRowCountChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const rows = parseInt(target.value, 10); // Parse the selected value to an integer
    this.rowsPerPage = rows;
    // Reset current page to the first page when row count changes
    this.currentPage = 0;
  }
  // Function to get a subset of filtered products based on the current page and row count
  getPaginatedProducts(): any[] {
    const startIndex = this.currentPage * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    console.log(
      'this.filteredProducts.slice(startIndex, endIndex) ',
      this.filteredProducts.slice(startIndex, endIndex)
    );
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  // Functions to handle pagination actions
  nextPage(): void {
    const lastPageIndex =
      Math.ceil(this.filteredProducts.length / this.rowsPerPage) - 1;
    this.currentPage = Math.min(this.currentPage + 1, lastPageIndex);
  }

  previousPage(): void {
    this.currentPage = Math.max(this.currentPage - 1, 0);
  }

  firstPage(): void {
    this.currentPage = 0;
  }

  lastPage(): void {
    const lastPageIndex =
      Math.ceil(this.filteredProducts.length / this.rowsPerPage) - 1;
    this.currentPage = lastPageIndex;
  }

  // Functions to handle search actions
  onProductKeyup(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    console.log(inputElement.value);
    this.searchedProductName = inputElement.value;
    if (this.searchedProductName != null) {
      console.log(this.searchedProductName, 'this.searchedProductName');

      this.getDashboardContents();
    }
  }
  onCompanyKeyup(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    console.log(inputElement.value);
    this.searchedCompanyName = inputElement.value;
    if (this.searchedCompanyName != null) {
      console.log(this.searchedCompanyName, 'this.searchedCompanyName');

      this.getDashboardContents();
    }
  }
  onDateKeyup(event: Event) {
    console.log('inside date');

    const inputElement = event.target as HTMLInputElement;
    console.log(inputElement.value);
    this.searchedDate = inputElement.value;
    if (this.searchedDate != null) {
      console.log(this.searchedDate, 'this.searchedDate');

      this.getDashboardContents();
    }
  }

  clearFields() {
    const form = document.getElementById('approvalForm') as HTMLElement;
    console.log(form);
    const inputFields = Array.from(form.querySelectorAll('input'));

    for (const inputField of inputFields) {
      inputField.value = '';
    }
    this.searchedProductName = '';
    this.searchedCompanyName = '';
    this.searchedDate = '';
    const selectAllCheckbox = document.querySelector(
      '#selectAllCheckbox'
    ) as HTMLInputElement;
    selectAllCheckbox.checked = false;
    this.selectedCheckboxIds = [];
    console.log(this.selectedCheckboxIds);

    this.getDashboardContents();
  }
  // Functions to Get Dashboard Contents
  getDashboardContents() {
    // console.log(
    //   this.sellerCode,
    //   this.status,
    //   this.searchedProductName,
    //   this.searchedCompanyName,
    //   this.searchedDate
    // );
    // this.dashboardService
    //   .getDashboardContents(
    //     this.sellerCode,
    //     this.status,
    //     this.searchedProductName,
    //     this.searchedCompanyName,
    //     this.searchedDate
    //   )
    //   .subscribe((response: any) => {
    //     console.log(response, 'data');
    //     console.log(response.products, 'data');
    //     console.log(response.isAdmin, 'response.isAdmin');
    //     this.products = response.products;
    //     this.filteredProducts = [...this.products];
    //     // this.isAdmin = response.isAdmin;
    //     this.newCount = response.newCount;
    //     this.editedCount = response.editedCount;
    //     this.approvedCount = response.approvedCount;
    //     this.rejectedCount = response.rejectedCount;
    //     this.loading = false;
    //   });
  }

  handleCheckboxChange(event: any) {
    console.log(' Check box event  ', event);
    this.selectedCheckboxIds = event;
    console.log(this.selectedCheckboxIds, 'event selectedCheckboxIds');
    console.log(event);
  }
  handleStatusChange(status: any) {
    console.log('Status Change:', status);
    this.updateStatus(status);
  }
  handleShowProductDetailsID(ID: any) {
    console.log('ID Change:', ID);
    console.log(this.products);

    // Use the find method to search for the product with the given ID
    const selectedProduct = this.products.find(
      (product: any) => product.productId === ID
    );

    if (selectedProduct) {
      // If the product is found, set it as the selectedProduct
      this.productDetails = selectedProduct;
      console.log(this.productDetails, 'productDetails:');
      console.log(this.productDetails.productName);

      // Open the product details modal
      this.productDetailsModalBTN.nativeElement.click();
    }
  }

  updateStatus(status: any) {
    console.log(status);
    console.log(this.selectedCheckboxIds, 'selectedCheckboxIds');
    if (this.selectedCheckboxIds.length > 0) {
      const productIdsInt = this.selectedCheckboxIds.map((id) => parseInt(id));
      console.log(' productIdsInt', productIdsInt);
      console.log(' this.selectedCheckboxIds', this.selectedCheckboxIds);
      this.dashboardService
        .updateProductStatus(
          this.sellerCode,
          productIdsInt,
          status,
          this.activeButton,
          this.publicIP
        )
        .subscribe({
          next: (response: any) => {
            console.log(response, 'response');
            if (response.cancelEdited === true) {
              const users = response.users;
              this.toUserList = [...users];
            }
            for (let user of this.toUserList) {
              const email = user.email.toString();
              const name = user.fullName.toString();
              const productName = user.productName.toString();
              this.emailService
                .sendEmail(
                  email,
                  'Edit product is rejected',
                  `Dear  ${name},\nYour request to edit the product named "${productName}" has been rejected. The product remains in its previous state.\nThank you for using NDE Digital Market. If you have any further questions or need assistance, please don't hesitate to contact our support team. We're here to help.`
                )
                .subscribe({
                  next: (response) => {
                    console.log(response, 'email Sent');
                  },
                  error: (error) => {
                    console.log(error);
                  },
                });
            }
            const selectAllCheckbox = document.querySelector(
              '#selectAllCheckbox'
            ) as HTMLInputElement;
            selectAllCheckbox.checked = false;
            const productApprovalCheckboxes =
              document.querySelectorAll('.singleCheckbox');
            productApprovalCheckboxes.forEach((checkbox: Element) => {
              const checkboxElement = checkbox as HTMLInputElement;
              checkboxElement.checked = false;
            });
            this.approvalCloseButton.nativeElement.click();
            const childApprovalCloseButton = document.querySelector(
              '#childApprovalCloseButton'
            ) as HTMLInputElement;
            childApprovalCloseButton.click();

            this.getDashboardContents();
          },
          error: (error) => {
            console.log(error, 'Error');
          },
        });
    } else {
      this.approvalCloseButton.nativeElement.click();
      // alert('No product is Selected');
      this.noProductSelectedModalBTN.nativeElement.click();
    }
  }
  selectAllProducts() {
    const productApprovalCheckboxes =
      document.querySelectorAll('.singleCheckbox');
    this.selectedCheckboxIds = [];

    productApprovalCheckboxes.forEach((checkbox: Element) => {
      const checkboxElement = checkbox as HTMLInputElement;
      checkboxElement.checked = this.selectAllChecked;
      console.log(this.selectAllChecked, 'selectAllChecked');

      if (this.selectAllChecked) {
        this.selectedCheckboxIds.push(checkboxElement.id);
      }
    });
    console.log(this.selectedCheckboxIds);
  }
  searchProducts(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    // Filter the products based on the search term
    this.filteredProducts = this.products.filter(
      (product: { productName: string }) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  ngDoCheck() {
    if (this.sharedService.deleteProductIndx != -1) {
      this.indx = this.sharedService.deleteProductIndx;
      // console.log(this.indx, 'indx');
      this.productID = this.products[this.indx].productId;
      // console.log(this.productID, 'productID');
    }
    // console.log(this.productTitle, 'title');
    // console.log(this.productTitle['productName']);
  }
  deleteProd() {
    var storedData = sessionStorage.getItem('deleteData');
    if (storedData) {
      this.productID = JSON.parse(storedData);
      // Now 'parsedData' contains the data you stored in 'editData'
      console.log(' this.productID', this.productID);
    }
    console.log(
      'this.sellerCode, this.productID',
      this.sellerCode,
      this.productID
    );
    this.dashboardService
      .deleteProduct(this.sellerCode, this.productID)
      .subscribe({
        next: (response) => {
          // console.log('Product Deleted successfully', response);
          this.closeModal();

          window.location.reload();
        },
        error: (error) => {
          // console.error('Error', error);
        },
      });
  }
  // Close modal bootstrap
  closeModal() {
    this.closeButton.nativeElement.click();
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any) {
    this.toggleSidebar();
  }

  toggleSidebar() {
    this.showSidebar = window.innerWidth >= 547;
  }

  setActiveButton(buttonName: string) {
    const selectAllCheckbox = document.querySelector(
      '#selectAllCheckbox'
    ) as HTMLInputElement;
    selectAllCheckbox.checked = false;
    this.currentPage = 0;
    this.activeButton = buttonName;
    this.status = buttonName;
    this.getDashboardContents();
  }
  sortDate(order: any) {
    console.log(this.filteredProducts);

    console.log(order);
    this.sortFilteredProducts(order);
  }
  sortFilteredProducts(order: any) {
    this.filteredProducts.sort((a: any, b: any) => {
      const dateA = new Date(a.addedDate);
      const dateB = new Date(b.addedDate);

      if (order === 'asc') {
        return dateA.getTime() - dateB.getTime();
      } else if (order === 'desc') {
        return dateB.getTime() - dateA.getTime();
      }
      // Return 0 for equal dates (no sorting needed)
      return 0;
    });
  }
  closeApproval() {
    this.selectedCheckboxIds = [];
    console.log(this.selectedCheckboxIds);
  }
  // AdminOrder(orderClicked: boolean) {
  //   const role = localStorage.getItem('role');
  //   console.log(role, 'role');
  //   this.sellerInventory = false;
  //   this.SellerQuantity = false;
  //   this.addProducts = false;
  //   this.addGroups = false;

  //   if (this.isAdmin) {
  //     this.isAdminOrder = orderClicked;
  //     console.log(this.isAdminOrder, 'isAdminOrder');
  //   } else if (role === 'seller') {
  //     this.isSellerOrder = orderClicked;
  //     console.log(this.isSellerOrder, 'isSellerOrder');
  //   } else {
  //     this.isBuyerOrder = orderClicked;
  //     console.log(this.isBuyerOrder, 'isBuyerOrder');
  //   }
  // }

  // inventory() {
  //   this.sellerInventory = true;
  //   this.isSellerOrder = false;
  //   this.SellerQuantity = false;
  // }

  // AddQuantity() {
  //   this.SellerQuantity = true;
  //   this.isSellerOrder = false;
  //   this.sellerInventory = false;
  //   this.productOthersSales = false;
  // }

  // OthersSales() {
  //   this.productOthersSales = true;
  //   this.isSellerOrder = false;
  //   this.sellerInventory = false;
  // }
  // AddProducts() {
  //   this.addProducts = true;
  //   this.SellerQuantity = false;
  //   this.isSellerOrder = false;
  //   this.sellerInventory = false;
  //   this.productOthersSales = false;
  //   this.addGroups = false;
  // }
  // AddGroups() {
  //   this.addGroups = true;
  //   this.addProducts = false;
  //   this.SellerQuantity = false;
  //   this.isSellerOrder = false;
  //   this.sellerInventory = false;
  //   this.productOthersSales = false;
  // }
  // CompanyApproval() {
  //   this.addGroups = true;
  //   this.addProducts = false;
  //   this.SellerQuantity = false;
  //   this.isSellerOrder = false;
  //   this.sellerInventory = false;
  //   this.productOthersSales = false;
  // }
}
