import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { LoginComponent } from 'src/app/Pages/login/login.component';
import { CantReloadGuard } from 'src/app/services/cant-reload.guard';
import { DashboardDataService } from 'src/app/services/dashboard-data.service';

@Component({
  selector: 'app-product-approval',
  templateUrl: './product-approval.component.html',
  styleUrls: ['./product-approval.component.css'],
})
export class ProductApprovalComponent {
  @Input() product: any;
  @Input() nm: any;
  @Input() status: any;
  @Output() checkboxChange = new EventEmitter();
  @Output() statusChange = new EventEmitter();
  @Output() shwoPRoductDetailsID = new EventEmitter();
  @ViewChild('compareEditBTN') compareModalBtn!: ElementRef;
  // @ViewChild('productDetailsModalBTN') productDetailsModalBTN!: ElementRef;
  selectAllChecked = false;
  checkedCheckboxIds: any = [];
  modalTitle = 'modalTitle';
  modalStatus = 'modalStatus';
  // selectedProduct: any = null;
  selectedProductModal: any = [];
  pName: any = 'lol';
  oldData: any;
  newData: any;
  gotData = false;
  constructor(private dashboardService: DashboardDataService) {}
  ngOnInit() {
    // console.log(this.product, 'product');
    // this.path = this.product.imagePath;
    // console.log(this.path);
    // this.imageSRC = this.path.substring(this.path.indexOf('assets'));
    // console.log(this.imageSRC);
    // this.selectedProductModal = this.product;
    console.log(this.product, 'sdsdsdsdsdsd');
    // this.products.push(this.product);
    // console.log(this.products);
  }
  selectProductID(id: any): void {
    console.log(id, 'ID');
    this.shwoPRoductDetailsID.emit(id);
    // setTimeout(() => {
    // this.productDetailsModalBTN.nativeElement.click();
    // }, 50);
  }
  comapreProductData(id: any) {
    console.log(id, 'comapre id');
    this.dashboardService
      .comapreEditedProduct(id)
      .subscribe((response: any) => {
        console.log(response);
        this.oldData = response.oldData;
        this.newData = response.newData;
        console.log(this.oldData, this.newData);
        this.gotData = true;
        setTimeout(() => {
          this.compareModalBtn.nativeElement.click();
        }, 50);
      });
  }

  checkboxChangeHandler(event: Event) {
    const selectAllCheckbox = document.querySelector(
      '#selectAllCheckbox'
    ) as HTMLInputElement;
    const checkbox = event.target as HTMLInputElement;

    if (!checkbox.checked) {
      this.selectAllChecked = false;
      selectAllCheckbox.checked = this.selectAllChecked;
    }

    this.checkedCheckboxIds = [];
    const checkboxes = document.querySelectorAll('.singleCheckbox');
    let checkboxId;
    checkboxes.forEach((checkbox: Element) => {
      if ((checkbox as HTMLInputElement).checked) {
        checkboxId = checkbox.getAttribute('id');

        if (checkboxId) {
          this.checkedCheckboxIds.push(checkboxId);
          // console.log(this.checkedCheckboxIds, 'checkedCheckboxIds');
        }
      }
    });

    this.checkboxChange.emit(this.checkedCheckboxIds);
  }
  changeSingleStatus(status: any) {
    // console.log(status);
    // console.log(id);
    // this.checkedCheckboxIds = [];
    // this.checkedCheckboxIds.push(id);

    this.statusChange.emit(status);
  }
  approvalModalStatus(btn: any, pID: any) {
    console.log(btn);
    this.checkedCheckboxIds = [];
    this.checkedCheckboxIds.push(pID);
    this.checkboxChange.emit(this.checkedCheckboxIds);
    if (btn === 'approve') {
      this.modalTitle = 'Approve';
      this.modalStatus = 'approve';
    } else {
      this.modalTitle = 'Reject';
      this.modalStatus = 'reject';
    }
  }
  submitApprovalModal(status: any) {
    if (status == 'approve') {
      this.changeSingleStatus('approved');
    } else {
      this.changeSingleStatus('rejected');
    }
  }
  closeApproval() {
    this.checkedCheckboxIds = [];
    console.log(this.checkedCheckboxIds);
    this.checkboxChange.emit(this.checkedCheckboxIds);
  }
  showProduct() {
    // console.log(this.products);
  }
}
