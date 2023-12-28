import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { SellerOrderOverviewService } from 'src/app/services/SellerOrderOverviewService';
import { orderInfo } from 'src/app/orderInfo';
import { CartDataService } from 'src/app/services/cart-data.service';
import { CartItem } from '../../cart-added-product/cart-item.interface';
import { PaginationComponent } from 'src/app/Components/pagination/pagination.component';
import { EmailService } from 'src/app/services/email.service';
//import { OrdersInfos } from 'src/app/seller-data';

@Component({
  selector: 'app-orders-overview',
  templateUrl: './orders-overview.component.html',
  styleUrls: ['./orders-overview.component.css'],
})
export class OrdersOverviewComponent {
  @ViewChild(PaginationComponent) pagination: PaginationComponent;
  orderinfos: orderInfo[] = [];
  filterdata: orderInfo[] = [];
  toUserList: any[] = [];
  countsList: any = [];
  PendingCount = 0;
  ProcessingCount = 0;
  ReadyToShipCount = 0;
  ShippedCount = 0;
  DeliveredCount = 0;
  CancelledCount = 0;
  AllCount = 0;
  ToReturnCount = 0;
  ReturnedCount = 0;
  TotalRowCount = 0;
  ModalText: string = 'No order is selected!';
  checked = true;
  pageNum = 1;
  pageSize = 5;
  data: any = [];
  detailsId = '';
  UpdateStatus = '';
  status = '';
  selectAll = false;
  searchOrderNumber: string = '';
  searchOrderDate: string = '';
  searchPaymentMethod: string = '';
  searchRetailPrice: string = '';
  searchStatus: string = '';
  // showTable: boolean = true;
  searchNav: boolean = true;
  ordersOverviewHeader: boolean = true;
  hideActionColumn: boolean = true;
  activeNavvItem: string = 'All';
  // SearchedOrderNo: any;
  // SearchedPaymentMethod: any;
  // SearchedStatus: any;
  constructor(
    private sellerOrderOverviewService: SellerOrderOverviewService,
    private emailService: EmailService,
    private elementRef: ElementRef
  ) {
    console.log(this.data, 'cons');
    this.pagination = new PaginationComponent();
  }
  ReturnedRowCount: number = 0;

  returnData: any = [];
  returnProduct = false;
  sellerId: any;
  OrderMasterIds: string = '1';
  StatusValue: string = 'Pending';

  ngOnInit(): void {
    this.sellerId = localStorage.getItem('code') || '';
    console.log(this.sellerId, 'skjasdokj');

    this.sellerOrderOverviewService
      .getOrderInfo(this.sellerId, this.status, this.pageNum, this.pageSize)
      .subscribe({
        next: (response: any) => {
          this.orderinfos = response.orderLst;
          this.countsList = response.countsList;
          console.log(this.countsList, 'cnt');
          this.PendingCount = this.countsList[0].pendingCount;
          console.log(this.PendingCount, 'ojjodmdlkfm');
          this.ProcessingCount = this.countsList[0].processingCount;
          this.ReadyToShipCount = this.countsList[0].readyToShipCount;
          this.ShippedCount = this.countsList[0].shippedCount;
          this.DeliveredCount = this.countsList[0].deliveredCount;
          this.CancelledCount = this.countsList[0].cancelledCount;
          this.AllCount = this.countsList[0].allCount;
          this.ToReturnCount = this.countsList[0].toReturnCount;
          this.ReturnedCount = this.countsList[0].returnedCount;
          this.data = Array.from(
            { length: Math.ceil(this.AllCount / this.pageSize) },
            (_, index) => index + 1
          );
          console.log(this.orderinfos);
          this.filterdata = response.orderLst;
          console.log(this.filterdata, 'filterdata');
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }

  getReturnData() {
    this.hideActionColumn = false;
    this.sellerOrderOverviewService
      .GetReturnData(this.status, this.pageNum, this.pageSize)
      .subscribe({
        next: (data: any) => {
          console.log(data, 'response return');
          this.returnData = data;
          this.filterdata = data;
          this.ReturnedRowCount = data[0].totalRowCount;
          console.log(' return total row count ', this.ReturnedRowCount);

          console.log(' filter data of return ', this.filterdata);
          //  console.log(this.filterdata.groupName, 'filterdata group name');

          this.data = Array.from(
            { length: Math.ceil(this.ReturnedRowCount / this.pageSize) },
            (_, index) => index + 1
          );

          console.log(
            this.filterdata[0].groupName,
            this.data,
            ' return data size'
          );
          // this.reloadPagination();
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }
  private reloadPagination() {
    console.log(' reload paginatioon ');
    console.log(' pagination  data', this.data);
    if (this.pagination) {
      this.pagination.reloadData();
    }
  }
  handlePaginationData(data: {
    selectedPageIndex: number;
    selectedValue: number;
  }) {
    console.log(data.selectedPageIndex, data.selectedValue, 'data.....');
    this.pageNum = data.selectedPageIndex;
    this.pageSize = data.selectedValue;
    let t = this.checkStatus();
    this.data = Array.from(
      { length: Math.ceil(t / this.pageSize) },
      (_, index) => index + 1
    );
    this.pageNum = data.selectedPageIndex;
    this.pageSize = data.selectedValue;

    if (
      this.searchOrderNumber ||
      this.searchPaymentMethod ||
      this.searchStatus
    ) {
      this.searchIndividuals();
    } else {
      if (
        this.activeNavvItem === 'Returned' ||
        this.activeNavvItem === 'ToReturn'
      ) {
        this.getReturnData();
      } else {
        this.loadData();
      }
    }
  }
  loadData() {
    this.sellerId = localStorage.getItem('code') || '';
    console.log(this.status, 'skjasdokj');
    this.selectAll = false;
    this.sellerOrderOverviewService
      .getOrderInfo(this.sellerId, this.status, this.pageNum, this.pageSize)
      .subscribe({
        next: (response: any) => {
          this.orderinfos = response.orderLst;
          this.countsList = response.countsList;
          console.log(this.countsList, 'cnt');
          this.PendingCount = this.countsList[0].pendingCount;
          console.log(this.PendingCount, 'ojjodmdlkfm');
          this.ProcessingCount = this.countsList[0].processingCount;
          this.ReadyToShipCount = this.countsList[0].readyToShipCount;
          this.ShippedCount = this.countsList[0].shippedCount;
          this.DeliveredCount = this.countsList[0].deliveredCount;
          this.CancelledCount = this.countsList[0].cancelledCount;
          this.AllCount = this.countsList[0].allCount;
          this.ToReturnCount = this.countsList[0].toReturnCount;
          this.ReturnedCount = this.countsList[0].returnedCount;
          console.log(this.orderinfos);
          this.filterdata = response.orderLst;
          console.log(this.filterdata, 'filterdata');
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }
  checkStatus(): number {
    if (this.status === 'Ready to Ship') {
      return this.ReadyToShipCount;
    } else if (this.status === 'Pending') {
      return this.PendingCount;
    } else if (this.status === 'Processing') {
      return this.ProcessingCount;
    } else if (this.status === 'Shipped') {
      return this.ShippedCount;
    } else if (this.status === 'Delivered') {
      return this.DeliveredCount;
    } else if (this.status === 'Cancelled') {
      return this.CancelledCount;
    } else if (this.status === 'to Return' || this.status === 'Returned') {
      return this.ReturnedRowCount;
    } else {
      return this.AllCount;
    }
  }

  allProduct() {
    this.clearSearch();
    this.returnProduct = false;
    // this.showTable = true;
    this.hideActionColumn = true;

    this.activeNavvItem = 'All';
    this.filterdata = this.orderinfos;
    this.status = 'All';
    console.log(this.filterdata);
    this.loadData();
    this.reloadPagination();
  }
  setOrderId(orderId: any) {
    sessionStorage.setItem('orderID', orderId);
    // window.location.href = '/sellerInvoice';
    window.open('/sellerInvoice', '_blank');
  }
  /* functions for click event and show according to data of the state*/
  pendingProduct() {
    this.clearSearch();
    this.returnProduct = false;
    // this.showTable = true;
    this.hideActionColumn = false;
    this.status = 'Pending';
    this.activeNavvItem = 'Pending';
    this.loadData();
    this.reloadPagination();
  }
  processingProduct() {
    this.clearSearch();
    this.returnProduct = false;
    // this.showTable = true;
    this.hideActionColumn = false;

    this.activeNavvItem = 'Processing';
    this.status = 'Processing';
    this.loadData();
    this.reloadPagination();
  }
  readyToShipProduct() {
    this.clearSearch();
    this.returnProduct = false;
    // this.showTable = true;
    this.hideActionColumn = false;
    this.activeNavvItem = 'Ready to Ship';
    this.status = 'Ready to Ship';
    this.loadData();
    this.reloadPagination();
  }
  shippedProduct() {
    this.returnProduct = false;
    this.clearSearch();
    // this.showTable = true;
    this.hideActionColumn = false;
    this.activeNavvItem = 'Shipped';
    this.status = 'Shipped';
    this.loadData();
    this.reloadPagination();
  }
  deliveredProduct() {
    this.clearSearch();
    this.returnProduct = false;
    // this.showTable = true;
    this.status = 'Delivered';
    this.hideActionColumn = false;
    this.activeNavvItem = 'Delivered';
    this.loadData();
    this.reloadPagination();
  }
  cancelledProduct() {
    this.returnProduct = false;
    this.clearSearch();
    // this.showTable = true;
    this.hideActionColumn = false;
    this.status = 'Cancelled ';
    this.activeNavvItem = 'Cancelled';
    this.loadData();
    this.reloadPagination();
  }

  async ToReturnProduct() {
    console.log(' tooooooooooooooooooooo return');
    this.returnProduct = true;
    this.status = 'to Return';
    this.activeNavvItem = 'ToReturn';
    this.getReturnData(); // Wait for getReturnData() to complete
    this.reloadPagination(); // After getReturnData() is done, run reloadPagination()
  }

  ReturnedProduct() {
    this.returnProduct = true;
    this.activeNavvItem = 'Returned';
    this.status = 'Returned';
    this.getReturnData();
    if (this.ReturnedRowCount > 0) {
      this.reloadPagination();
    }
  }

  // added hostListner to listen for keyup events
  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Check if the event key is "Enter" (keyCode 13) or "Backspace" (keyCode 8)
    if (event.key === 'Enter' || event.key === 'Backspace') {
      // Call the searchIndividuals function
      this.searchIndividuals();
    }
  }

  searchIndividuals() {
    const SearchedOrderNo = this.searchOrderNumber.trim();
    const SearchedPaymentMethod = this.searchPaymentMethod.trim();
    const SearchedStatus = this.searchStatus.trim();

    this.sellerId = localStorage.getItem('code') || '';
    console.log(this.status, 'skjasdokj');
    this.selectAll = false;
    this.sellerOrderOverviewService
      .getSearchedOrderInfo(
        this.sellerId,
        this.status,
        this.pageNum,
        this.pageSize,
        SearchedOrderNo,
        SearchedPaymentMethod,
        SearchedStatus
      )
      .subscribe({
        next: (response: any) => {
          this.orderinfos = response.orderLst;
          this.countsList = response.countsList;
          console.log(this.countsList, 'cnt');
          this.PendingCount = this.countsList[0].pendingCount;
          console.log(this.PendingCount, 'ojjodmdlkfm');
          this.ProcessingCount = this.countsList[0].processingCount;
          this.ReadyToShipCount = this.countsList[0].readyToShipCount;
          this.ShippedCount = this.countsList[0].shippedCount;
          this.DeliveredCount = this.countsList[0].deliveredCount;
          this.CancelledCount = this.countsList[0].cancelledCount;
          this.AllCount = this.countsList[0].allCount;
          if (response.orderLst.length > 0) {
            this.TotalRowCount = response.orderLst[0].totalRowCount;
          }
          console.log(this.TotalRowCount, 'trc');
          this.data = Array.from(
            { length: Math.ceil(this.TotalRowCount / this.pageSize) },
            (_, index) => index + 1
          );
          console.log(this.orderinfos);
          this.filterdata = response.orderLst;
          console.log(this.filterdata, 'filterdata');
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }

  // all search bar will be cleared
  clearSearch() {
    this.searchOrderNumber = '';
    this.searchPaymentMethod = '';
    this.searchRetailPrice = '';
    this.searchStatus = '';
    this.loadData();
  }

  // actionBtn(id: any, str: string) {
  //   this.updateStatusCode(id, str);
  // }

  returnButton(detailsId: any, status: string) {
    console.log(' returned id ', detailsId, status);

    this.sellerOrderOverviewService
      .updateDetailsStatus(detailsId.toString(), status)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.allProduct();
          this.activeNavvItem = 'All';
          this.status = 'All';
          this.loadData();
          this.selectAll = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  // for selected-unselected chckboxed handeled

  toggleSelectAll() {
    if (
      this.activeNavvItem === 'Pending' ||
      this.activeNavvItem === 'ToReturn'
    ) {
      console.log(this.activeNavvItem);
      if (!this.selectAll) this.filterdata.forEach((c) => (c.selected = false));
      else this.filterdata.forEach((c) => (c.selected = true));
    } else if (this.activeNavvItem === 'Processing') {
      console.log(this.activeNavvItem);
      if (!this.selectAll) this.filterdata.forEach((c) => (c.selected = false));
      else this.filterdata.forEach((c) => (c.selected = true));
    } else if (this.activeNavvItem === 'Ready to Ship') {
      console.log(this.activeNavvItem);
      if (!this.selectAll) this.filterdata.forEach((c) => (c.selected = false));
      else this.filterdata.forEach((c) => (c.selected = true));
    } else if (this.activeNavvItem === 'Shipped') {
      console.log(this.activeNavvItem);
      if (!this.selectAll) this.filterdata.forEach((c) => (c.selected = false));
      else this.filterdata.forEach((c) => (c.selected = true));
    } else {
      console.log('others');
      this.selectAll = false;
    }
  }

  checkboxChanged(orderInfo: orderInfo) {
    if (this.isAllCheckboxSelected()) this.selectAll = true;
    else this.selectAll = false;
  }

  isAllCheckboxSelected() {
    return this.filterdata.every((c) => c.selected);
  }

  get selectedCheckbox() {
    return this.filterdata.filter((c) => c.selected);
  }

  // Approval(status: string){
  //  if ( status===Approved){
  //   this.getApprove
  //  }

  Approval(status: any) {
    // if (this.activeNavvItem === 'ToReturn') {
    //   if (status == 'Approved') {
    //     this.UpdateStatus = 'returned';
    //   } else {
    //     this.UpdateStatus = 'return cancel';
    //   }
    // } else {
    //   this.UpdateStatus = status;
    // }
    this.UpdateStatus = status;
    this.checkingCheckBox(status);
  }

  checkingCheckBox(status: string) {
    let selectedCheckboxs = this.selectedCheckbox;

    if (selectedCheckboxs.length > 0) {
      this.checked = true;
      this.ModalText = `Want to ${this.activeNavvItem} the order?`;
    } else {
      this.checked = false;
      this.ModalText = `select an order`;
    }
  }

  getApprove() {
    let selectedCheckboxs = this.selectedCheckbox;
    console.log('selectedCheckboxs ', selectedCheckboxs);

    if (selectedCheckboxs.length > 0) {
      if (this.activeNavvItem === 'ToReturn') {
        let allId = selectedCheckboxs.map((checkbox) => checkbox.detailsId);
        console.log(allId, ' checked ids for Return ');
        // this.RetunStatusUpdate(allId, 'to Return');
        this.returnButton(allId, 'Returned');
      } else {
        let allId = selectedCheckboxs.map((checkbox) => checkbox.orderMasterId);
        console.log(allId, ' checked ids ');
        if (this.activeNavvItem === 'Pending') {
          this.updateStatusCode(allId, 'Processing');
        } else if (this.activeNavvItem === 'Processing') {
          this.updateStatusCode(allId, 'Ready to Ship');
        } else if (this.activeNavvItem === 'Ready to Ship') {
          this.updateStatusCode(allId, 'Shipped');
        } else if (this.activeNavvItem === 'Shipped') {
          this.updateStatusCode(allId, 'Delivered');
        }
      }
    }
  }

  getReject() {
    let selectedCheckboxs = this.selectedCheckbox;
    console.log('selectedCheckboxs', selectedCheckboxs);

    if (selectedCheckboxs.length > 0) {
      let allId = selectedCheckboxs.map((checkbox) => checkbox.orderMasterId);
      console.log(allId);
      if (this.activeNavvItem === 'ToReturn') {
        let allId = selectedCheckboxs.map((checkbox) => checkbox.detailsId);
        console.log(allId, ' checked ids ');
        // this.RetunStatusUpdate(allId, 'to Return');
        this.returnButton(allId, 'Return Cancelled');
      } else {
        if (this.activeNavvItem === 'Pending') {
          this.updateStatusCode(allId, 'Cancelled');
        } else if (this.activeNavvItem === 'Processing') {
          this.updateStatusCode(allId, 'Cancelled');
        } else if (this.activeNavvItem === 'Ready to Ship') {
          this.updateStatusCode(allId, 'Cancelled');
        } else if (this.activeNavvItem === 'Shipped') {
          this.updateStatusCode(allId, 'Cancelled');
        }
      }
    }
  }

  updateStatusCode(allId: any, str: string) {
    const sellerCode = localStorage.getItem('code');
    this.sellerOrderOverviewService
      .updateOrderStatus(allId.toString(), str, sellerCode)
      .subscribe({
        next: (response) => {
          console.log(response, 'check seller response');
          this.getUsers(allId, str);
          this.allProduct();
          this.activeNavvItem = 'All';
          this.status = 'All';
          this.loadData();
          this.selectAll = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  getUsers(idList: any, status: any) {
    console.log(idList, status);
    this.sellerOrderOverviewService.getUsersData(idList.toString()).subscribe({
      next: (response: any) => {
        console.log(response, 'get user data from seller response');
        const users = response.users;
        this.toUserList = [...users];
        console.log(this.toUserList);

        for (let user of this.toUserList) {
          console.log(user, 'User', user.email, user.fullName, status);
          const email = user.email.toString();
          const name = user.fullName.toString();

          this.sendEmailToBuyer(
            email,
            `Your Order is ${status}`,
            `Dear  ${name},\nYour order is ${status} successfully.\nThank you. Stay with NDE Digital Market.`
          );
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  sendEmailToBuyer(to: any, sub: any, body: any) {
    console.log(to, sub, body);
    this.emailService.sendEmail(to, sub, body).subscribe({
      next: (response) => {
        console.log(response, 'email Sent');
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  popUpClose() {
    const individual_check = this.elementRef.nativeElement.querySelectorAll(
      '.individual_checkbox'
    );
    console.log(' individual_check', individual_check);

    for (let i = 0; i < individual_check.length; i++) {
      individual_check[i].checked = false;
    }
  }
  statusCheck() {
    console.log('this.UpdateStatus in status check ', this.UpdateStatus);
    if (
      this.UpdateStatus == 'Rejected' ||
      this.UpdateStatus == 'Approved' ||
      this.UpdateStatus == 'Returned' ||
      this.UpdateStatus == 'Return Cancelled'
    ) {
      if (this.UpdateStatus == 'Approved' || this.UpdateStatus == 'Returned') {
        this.getApprove();
      } else {
        this.getReject();
      }
    } else {
      this.updateStatusCode(this.detailsId, this.UpdateStatus);
    }
  }

  setID(ids: string, status: string) {
    this.detailsId = ids;

    this.UpdateStatus = status;
    this.checkingCheckBox(status);
  }
}
