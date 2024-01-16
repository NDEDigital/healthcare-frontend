import { Component, ElementRef, Renderer2 } from '@angular/core';
import { AdminOrderDataGetService } from 'src/app/services/admin-order-data-get.service';
import { FormsModule } from '@angular/forms';
import { AdminOrderModel } from '../../Model/AdminOrderModel';
import { DetailsModel } from '../../Model/DetailsModel';
import { PaginationComponent } from '../../Components/pagination/pagination.component';
import { ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SellerOrderOverviewService } from 'src/app/services/SellerOrderOverviewService';

@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.css'],
})
export class AdminOrderComponent {
  @ViewChild(PaginationComponent) pagination: PaginationComponent;
  @ViewChild('allCheck') allCheck!: ElementRef;
  ModalText: string = 'No product is selected!';

  selectedButtonIndex: string = 'Pending'; // Default selected index is 0
  returnProduct = false;
  detailsCancelledArray: any = [];
  checked: any = false;
  showPendingDetails: any = false;
  detailsCheckedId: string = '';
  detailsUnCheckedId: string = '';
  checkedId: string = '';
  masterCheckId: string = '';
  uncheckedId: string = '';
  checkedMasterId: string = '';
  checkedStatus: any = '';
  SearchByname: string = 'Search by';
  // leaveList: AdminOrderModel[] = [];
  AdminOrderData: AdminOrderModel[] = [];

  ordersData: AdminOrderModel[] = [];
  // statusCount: AdminOrderModel[] = [];
  selectedPageIndex: number = 1; // Default selected index is 0
  // orderMasterIds:any =3;
  selectedIconIndex: String = ''; // Default selected index is 0
  placeholder: string = 'Search by ';
  searchby: string = 'OrderNo';
  orderData: any = [];
  orderDataHeaders: any = [];
  status: any = 'Pending';
  searchValue: string = '';
  RowsCount: number = 0;
  TotalRow: number = 0;
  m: number = 1;
  dataIndexNumber: number = 1;
  statusData: any = [];
  paginationInputdata: any = {};
  statusCountData: any = [];
  totalPages: number[] = [];
  checkText: string = 'nai';
  fromDate: string = ''; // This property will store the "From" date
  toDate: string = ''; // This property will store the "To" date
  detailsData: DetailsModel[] = []; // pending details data
  toReturnCount = 0;
  ReturnedCount = 0;

  detailsMap: { [key: number]: any } = {};
  masterId = '';

  isIconRotatedMap: { [key: string]: boolean } = {}; // for master row icon

  selectedValue: any = 10; //data par page initially
  constructor(
    private service: AdminOrderDataGetService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private sellerOrderOverviewService: SellerOrderOverviewService
  ) {
    this.pagination = new PaginationComponent();

    this.detailsMap = {};
  }
  searchTerm$ = new Subject<string>();
  ngOnInit() {
    this.getMAsterData('New');
    this.getOrderDetails(3);
    this.loadData();
    //console.log(' SearchTerm valuee on init', this.searchTerm$);
    // this.searchTerm$
    //   .pipe(
    //     debounceTime(500), // Delay for 500 milliseconds
    //     distinctUntilChanged(), // Only emit when the search term changes
    //     switchMap((term: string) =>
    //       this.service.GetOrderData(
    //         this.selectedPageIndex,
    //         this.selectedValue,
    //         this.status,
    //         this.searchby,
    //         term
    //       )
    //     )
    //   )
    //   .subscribe((results) => {
    //     // Handle the search results here
    //     //console.log('retrive search results', results);
    //     this.dataDistribute(results);
    //   });
  }

  getOrderDetails(orderMasterId: number): void {
    this.service.getOrderDetailData(orderMasterId, status).subscribe(
      (data: any[]) => {
        //console.log('Order Details:', data);
      },
      (error) => {
        console.error('Error fetching order details:', error);
      }
    );
  }
  getMAsterData(status: string): void {
    this.service.getOrderMasterData(status).subscribe(
      (data: any[]) => {
        //console.log('Orders:', data);
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }
  private reloadPagination() {
    if (this.pagination) {
      this.pagination.reloadData(); // You need to create this method in your pagination component
    }
  }

  loadData() {
    //console.log(' load data function');
    this.dataIndexNumber =
      this.selectedValue * (this.selectedPageIndex - 1) + 1;
    const searchInput =
      this.elementRef.nativeElement.querySelector('#searchInput');
    // const inputValue = searchInput.value;

    const inputValue = searchInput.value.trim(); // Trim leading and trailing spaces
    if (inputValue.trim() === '') {
      this.searchValue = 'All';
    } else {
      this.searchValue = inputValue;
    }
    this.GetData();
    this.detailsCancelledArray = [];
    this.masterId = '';
    this.detailsUnCheckedId = '';
    this.allCheck.nativeElement.checked = false;
  }

  GetData() {
    this.service.getOrderMasterData(this.status).subscribe(
      (data: any[]) => {
        //console.log('Orders:', data);
        this.dataDistribute(data);
        // const allcheck =
        //   this.elementRef.nativeElement.querySelector('.check_all_Master');
        // allcheck.checked = false;
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  dataDistribute(data: any) {
    // this.statusData = data.statusCount;

    // this.ordersData = data.ordersData;

    this.ordersData = data.map((item: any) => ({ ...item, isChecked: false }));
    //console.log('load orderData  ', this.ordersData, this.statusData);
    this.AdminOrderData = data;

    if (this.ordersData.length > 0) {
      this.TotalRow = this.ordersData[0].totalRowsCount;
      this.totalPages = Array.from(
        { length: Math.ceil(this.TotalRow / this.selectedValue) },
        (_, index) => index + 1
      );
      this.detailsMap = {};
      // //console.log(' this.totalPages  array ', this.totalPages);
    } else {
      this.TotalRow = 0;
      this.totalPages = [];
    }
  }

  GetDetailsData(orderMasterId: any, index: any, row: any) {
    console.log(' orderMasterId', orderMasterId, row);
    // Toggle the rotation state ot icon
    //this.isIconRotatedMap ={};
    // this.showPendingDetails = true;
    // this.status = 'PendingsDetails'
    // console.log("this.isIconRotatedMap ",this.isIconRotatedMap)
    Object.keys(this.isIconRotatedMap).forEach((key) => {
      if (key !== orderMasterId) {
        this.isIconRotatedMap[key] = false;
        // this.showPendingDetails = false;
        //this.status = 'Pending';
      }
    });
    // console.log(" after making false  ",this.isIconRotatedMap)

    this.isIconRotatedMap[orderMasterId] =
      !this.isIconRotatedMap[orderMasterId];

    // console.log(" after making  toggle  ",this.isIconRotatedMap)

    if (this.detailsData.length === 0) {
      this.service.getOrderDetailData(orderMasterId).subscribe((data: any) => {
        this.detailsData = [];
        if (this.selectedButtonIndex === 'Cancelled') {
          console.log(data, 'all data');

          this.detailsData = data.filter(
            (cancelData: any) => cancelData.status !== 'Approved'
          );

          console.log(this.detailsData, 'data after filter');

          this.detailsData = this.detailsData.map((item: any) => ({
            ...item,
            isChecked: false,
          }));

        } else if(this.selectedButtonIndex === 'Approved') {
          console.log("dsagashd");

          this.detailsData = data;

          this.detailsData = this.detailsData.filter(
            (approvedData: any) => approvedData.status === 'Approved'
          );

          this.detailsData = this.detailsData.map((item: any) => ({
            ...item,
            isChecked: false,
          }));
        }else{
          this.detailsData = data;
          this.detailsData = this.detailsData.map((item: any) => ({
            ...item,
            isChecked: false,
          }));
        }

        //  this.togglingDetailsCheckbox(index);
        console.log('details data dataaaaaa', this.detailsData); // Use a type if possible for better type checking

        setTimeout(() => {
          this.togglingDetailsCheckbox(index, this.detailsData);
        }, 10);
      });
    }

    // else if (this.detailsData[0].orderMasterId != orderMasterId) {
    //   // console.log(
    //   //   'this.detailsData.orderMasterId ',
    //   //   this.detailsData[0].orderMasterId
    //   // );
    //   this.detailsData = [];
    //   console.log(' orderMasterId tytr', orderMasterId);
    //   this.service.getOrderDetailData(orderMasterId).subscribe((data: any) => {
    //     console.log('details data else if', data); // Use a type if possible for better type checking
    //     this.detailsData = data;

    //     // Add the isChecked property with a default value of false to each object
    //     this.detailsData = data.map((item: any) => ({
    //       ...item,
    //       isChecked: false,
    //     }));
    //     //console.log('details data dataaaaaa',    this.detailsData); // Use a type if possible for better type checking
    //     setTimeout(() => {
    //       this.togglingDetailsCheckbox(index, this.detailsData);
    //     }, 10);
    //   });
    // }





    else {
      // this.detailsData.length = 0; // clearing the array for  hiding the details data div


    }

    //console.log(' isIconRotatedMap', this.isIconRotatedMap);
  }

  togglingDetailsCheckbox(index: any, detailsData: any) {
    //console.log(' index ', index);
    // toggling the checkbox
    const individual_check_master =
      this.elementRef.nativeElement.querySelectorAll(
        '.individual_checkbox_Master'
      );
    const individual_check_details =
      this.elementRef.nativeElement.querySelectorAll(
        '.individual_checkbox_details'
      );

    if (individual_check_master[index].checked) {
      //console.log(' details map ', this.detailsMap);

      for (let i = 0; i < individual_check_details.length; i++) {
        //console.log(' jafhwafhowauifw');
        const id = individual_check_details[i].getAttribute('id');
        //console.log(' id ', id);

        if (this.detailsMap[id]) {
          this.detailsData[i].isChecked = false;
        } else {
          this.detailsData[i].isChecked = true;
        }
      }
    }
  }

  //   ****************** UPDATE STATUS *************
  actionBtn(masterId: any, cancelledId: any, str: string) {
    // console.log(
    //   'masterId,cancelledId,str',
    //   masterId,

    //   cancelledId,
    //   str
    // );

    this.service
      .updateOrderStatus(masterId.toString(), cancelledId.toString(), str)
      .subscribe({
        next: (response) => {
          this.loadData(); // Ensure this line is reached
          this.checked = false;
          this.masterCheckId = '';
          this.detailsCheckedId = '';
          this.detailsUnCheckedId = '';
        },
        error: (error) => {
          this.masterCheckId = '';
          this.detailsCheckedId = '';
          this.detailsUnCheckedId = '';
          //console.log('Error:', error);
          this.loadData(); // Ensure this line is reached
        },
      });
  }

  // ***************** update status *************

  setSearchOption(text: string) {
    // cleaing input feild
    const searchInput =
      this.elementRef.nativeElement.querySelector('#searchInput');
    searchInput.value = '';
    this.SearchByname = text;
    this.searchby = text;
    this.placeholder = ' Search by ';
    this.checkingReturnORMasterData();
    // this.loadData();
  }
  getSelectedButtonName(): string {
    // //console.log('button name changed');
    const button = this.elementRef.nativeElement.querySelectorAll(
      '.order_status_button'
    );
    // //console.log(" status button div", button, this.selectedButtonIndex)
    const buttonText =
      button[this.selectedButtonIndex].textContent?.trim() || '';
    const statusText = buttonText.split(' (')[0]; // Split by space and get the first part
    return statusText;
  }

  AddNoFoundImg() {
    this.RowsCount = 0;

    const DynamicApprovalData = this.elementRef.nativeElement.querySelector(
      '#DynamicApprovalData'
    );

    // Create an img element
    const divElement = this.renderer.createElement('div');
    // Set the src and alt attributes for the image
    this.renderer.setProperty(divElement, 'innerText', 'No data found.');

    // Append the image to the DynamicApprovalData element
    this.renderer.appendChild(DynamicApprovalData, divElement);
  }
  statusChange(buttonNumber: string, status: string) {
    this.checked = false;
    this.fromDate = '';
    this.toDate = '';
    this.showPendingDetails = false;
    const searchInput =
      this.elementRef.nativeElement.querySelector('#searchInput');
    searchInput.value = '';
    this.selectedPageIndex = 1;
    this.selectedValue = 10;
    this.status = status;
    //console.log('  status is ', this.status);
    this.detailsData = [];
    this.selectedButtonIndex = buttonNumber;
    this.SearchByname = 'Search by';
    this.placeholder = 'Search by ';
    this.searchby = 'OrderNo';

    this.isIconRotatedMap = {};

    this.checkText = status;
    if (status == 'to Return' || status == 'Returned') {
      //console.log(' this is return page ');
      this.returnProduct = true;
      this.getReturndata();
    } else {
      //console.log(' this is  loadDataaaaaaa');
      this.returnProduct = false;
      this.loadData();
    }
    this.reloadPagination();
  }

  getReturndata() {
    this.dataIndexNumber =
      this.selectedValue * (this.selectedPageIndex - 1) + 1;
    const searchInput =
      this.elementRef.nativeElement.querySelector('#searchInput');
    // const inputValue = searchInput.value;

    const inputValue = searchInput.value.trim(); // Trim leading and trailing spaces
    if (inputValue.trim() === '') {
      this.searchValue = 'All';
    } else {
      this.searchValue = inputValue;
    }
    // console.log(
    //   ' this.status, this.selectedPageIndex, this.selectedValue',
    //   this.status,
    //   this.selectedPageIndex,
    //   this.selectedValue
    // );
    this.sellerOrderOverviewService
      .GetReturnDataWithSearch(
        this.status,
        this.selectedPageIndex,
        this.selectedValue,
        this.searchby,
        this.searchValue,
        this.fromDate,
        this.toDate
      )
      // // .GetReturnDataWithSearch(this.status, this.selectedPageIndex, this.selectedValue,this.searchby,this.searchValue , '2023-10-02',
      // //  '2023-10-02')
      //  .GetReturnDataWithSearch(this.status, this.selectedPageIndex, this.selectedValue,this.searchby,this.searchValue , '',
      //  '')
      .subscribe({
        next: (data: any) => {
          //console.log(data, 'response return');
          this.checkedId = '';
          this.uncheckedId = '';
          this.statusData = data.statusCount;

          this.ordersData = data.ordersData;

          //console.log(' return data  ordersData', this.ordersData);

          if (this.ordersData.length > 0) {
            this.TotalRow = this.ordersData[0].totalRowsCount;
            //console.log('   this.TotalRow of return data ', this.TotalRow);
            this.totalPages = Array.from(
              { length: Math.ceil(this.TotalRow / this.selectedValue) },
              (_, index) => index + 1
            );
          } else {
            const checkboxAll =
              this.elementRef.nativeElement.querySelector('.check_All');
            checkboxAll.checked = false;
            this.TotalRow = 0;
            this.totalPages = [];
          }
        },
        error: (error: any) => {
          //console.log(error);
        },
      });
  }

  clearDate() {
    const searchInput =
      this.elementRef.nativeElement.querySelector('#searchInput');
    searchInput.value = '';
    this.searchValue = 'All';
    this.fromDate = '';
    this.toDate = '';
    this.checkingReturnORMasterData();
    this.reloadPagination();
  }

  paginationData(data: { selectedPageIndex: number; selectedValue: number }) {
    this.selectedPageIndex = data.selectedPageIndex;
    this.selectedValue = data.selectedValue;
    //this.loadData();

    // console.log(
    //   ' pagination hapendding ,  this.selectedPageIndex,  this.selectedValue',
    //   this.selectedPageIndex,
    //   this.selectedValue
    // );
    this.checkingReturnORMasterData(); // is this return data or master data
  }

  // Method to check if all details checkboxes are selected
  areAllDetailsSelected(orderMasterId: number): boolean {
    // Log the masterID for debugging
    console.log(orderMasterId, 'masterID');

    return true;
  }

  // checking
  checkAll(checkAllIdName: string, child: string, detailscheckbox: string) {
    const checkboxAll =
      this.elementRef.nativeElement.querySelector(checkAllIdName);

    // master checkbox
    const individual_check =
      this.elementRef.nativeElement.querySelectorAll(child);
    //console.log(' individual_check', individual_check);
    //console.log(' checkboxAll ', checkboxAll);
    for (let i = 0; i < individual_check.length; i++) {
      if (checkboxAll.checked == true) {
        //console.log(' checkboxAll true', checkboxAll);

        individual_check[i].checked = true;
      } else {
        //console.log(' checkboxAll false', checkboxAll);
        this.checkedId = '';
        individual_check[i].checked = false;
      }
    }

    // details checkbox
    const individual_check_details =
      this.elementRef.nativeElement.querySelectorAll(detailscheckbox);
    for (let i = 0; i < individual_check_details.length; i++) {
      if (checkboxAll.checked == true) {
        //console.log(' checkboxAll true', checkboxAll);

        individual_check_details[i].checked = true;
      } else {
        //console.log(' checkboxAll false', checkboxAll);
        this.checkedId = '';
        individual_check_details[i].checked = false;
      }
    }
  }

  changeStatus(status: string) {
    this.checkedMasterId = '';

    this.checkedStatus = status;
    const masterCheckbox =
      this.elementRef.nativeElement.querySelector('.check_all_Master');
    //this.checkedMasterId = masterCheckbox.getAttribute('id'); //

    const checkbox = this.elementRef.nativeElement.querySelectorAll(
      '.individual_checkbox_Master'
    ); // individual checkbox

    // console.log(
    //   ' individual checkbox ',
    //   checkbox.length,
    //   checkbox,
    //   ' masterCheckbox',

    //   masterCheckbox
    // );
    for (let i = 0; i < checkbox.length; i++) {
      if (checkbox[i].checked) {
        if (this.masterCheckId == '') {
          this.masterCheckId = checkbox[i].id;
        } else {
          this.masterCheckId = this.masterCheckId + ',' + checkbox[i].id;
        }
      }
    }

    // //console.log(' masterCheckId ', this.masterCheckId);

    this.checkboxCheck(status);
  }

  getDetaisId() {
    const checkbox = this.elementRef.nativeElement.querySelectorAll(
      '.individual_checkbox_details'
    ); // individual checkbox
    for (let i = 0; i < checkbox.length; i++) {
      if (checkbox[i].checked) {
        if (this.detailsCheckedId == '') {
          this.detailsCheckedId = checkbox[i].id;
        } else {
          this.detailsCheckedId = this.detailsCheckedId + ',' + checkbox[i].id;
        }
      } else {
        if (this.detailsUnCheckedId == '') {
          this.detailsUnCheckedId = checkbox[i].id;
        } else {
          this.detailsUnCheckedId =
            this.detailsUnCheckedId + ',' + checkbox[i].id;
        }
      }
    }
  }

  checkboxCheck(statusText: string) {
    const checkbox = this.elementRef.nativeElement.querySelectorAll(
      '.individual_checkbox_Master'
    ); // individual checkbox

    let cnt = 0;
    for (let i = 0; i < checkbox.length; i++) {
      if (!checkbox[i].checked) {
        cnt++;
      }
    }
    if (cnt == checkbox.length) {
      this.checked = false;
      this.ModalText = 'No product is selected!';
    } else {
      this.checked = true;

      if (this.status == 'to Return') {
        if (statusText == 'Approved') {
          this.ModalText = `want to  return ?`;
          this.checkedStatus = 'Returned';
        } else {
          this.ModalText = `want to  cancell the return request ?`;
          this.checkedStatus = 'Return Cancelled';
        }
      } else {
        this.ModalText = `want to ${statusText} the product ?`;
      }
    }
  }

  statusCheck() {
    if (this.status == 'Pending') {
      // this.getDetaisId();
      this.detailsUnCheckedId == '';

      // getting cancelled id
      const keys = Object.keys(this.detailsMap);

      // Loop through keys and access their corresponding values
      keys.forEach((key: any) => {
        if (this.detailsUnCheckedId == '') {
          this.detailsUnCheckedId = key;
        } else {
          this.detailsUnCheckedId = this.detailsUnCheckedId + ',' + key;
        }
      });
      this.checkMasterCheckbox();

      //console.log(' this.masterid', this.masterId);

      //console.log(' this.detailsUnCheckedId', this.detailsUnCheckedId);

      if (this.masterCheckId != '') {
        this.actionBtn(
          this.masterId,
          this.detailsUnCheckedId,
          this.checkedStatus
        );
      } else {
        //console.log(' checked please');
      }
    }
    if (this.status == 'to Return') {
      // if (this.checkedStatus == 'Approved') {
      this.returnButton(this.masterCheckId, this.checkedStatus);
      // } else {
      //   this.returnButton(this.masterCheckId, 'Return Cancelled');
      // }
    }
  }

  setID(row: any, id: any, status: string, index: any) {
    const individual_checkboxes_master =
      this.elementRef.nativeElement.querySelectorAll(
        '.individual_checkbox_Master'
      );

    const isAllSelected = this.areAllDetailsSelected(row);
    // const status = isAllSelected ? defaultStatus : 'Partial';

    for (let i = 0; i < individual_checkboxes_master.length; i++) {
      individual_checkboxes_master[i].checked = false;
    }
    individual_checkboxes_master[index].checked = true;
    this.ModalText = `Want to ${status} the product ?`;
    this.masterCheckId = '';
    this.checked = true; // showing modal button
    this.masterCheckId = id; // setting the id
    this.checkedStatus = status; // setting the update status
  }

  GotoInvoice(orderId: any) {
    sessionStorage.setItem('orderMasterID', orderId);

    const urlToOpen = '/buyerInvoice'; // Replace with your desired URL

    // Use window.open to open the new window/tab
    window.open(urlToOpen, '_blank');
  }

  onKeyUp(event: KeyboardEvent) {
    // Check if the pressed key is Enter (keycode 13) or Backspace (keycode 8)
    if (event.keyCode === 13 || event.keyCode === 8) {
      this.searchData();
    }
  }
  searchData() {
    this.checkingReturnORMasterData(); // is this return data or master data
    this.reloadPagination();
  }

  search() {
    const searchValue =
      this.elementRef.nativeElement.querySelector('#searchInput');
    //console.log(' search input on input', searchValue.value);

    this.searchTerm$.next(searchValue.value);
    //console.log(' SEarchTerm valuee  on input', this.searchTerm$);
  }
  returnButton(detailsId: any, status: string) {
    //console.log(' returned id ', detailsId, status);

    this.sellerOrderOverviewService
      .updateDetailsStatus(detailsId.toString(), status)
      .subscribe({
        next: (response) => {
          //console.log(response);
          this.getReturndata();
        },
        error: (error) => {
          //console.log(error);
        },
      });
  }

  checkingReturnORMasterData() {
    // is this return data or master data
    if (this.status == 'to Return' || this.status == 'Returned') {
      this.returnProduct = true;
      this.getReturndata();
    } else {
      this.returnProduct = false;
      this.loadData();
    }
  }

  searchByDate() {
    if (this.fromDate != '' && this.toDate != '') {
      this.checkingReturnORMasterData();
    }
  }

  popUpClose() {
    const individual_check = this.elementRef.nativeElement.querySelectorAll(
      '.individual_checkbox_Master'
    );
    //console.log(' individual_check', individual_check);

    for (let i = 0; i < individual_check.length; i++) {
      individual_check[i].checked = false;
    }

    const individual_check_details =
      this.elementRef.nativeElement.querySelectorAll(
        '.individual_checkbox_details'
      );
    for (let i = 0; i < individual_check_details.length; i++) {
      this.detailsData[i].isChecked = false;
    }

    //cleaing the data
    this.detailsCancelledArray = [];
    this.masterId = '';
    this.detailsUnCheckedId = '';
  }

  checkboxFunctions(masterCheckbox: any, ChildCheckbox: any) {
    let checkedCount = 0;
    const checkboxAll =
      this.elementRef.nativeElement.querySelector(masterCheckbox);
    const checkbox =
      this.elementRef.nativeElement.querySelectorAll(ChildCheckbox);
    for (let i = 0; i < checkbox.length; i++) {
      if (checkbox[i].checked) {
        checkedCount++;
      }
    }
    if (checkedCount == checkbox.length) {
      checkboxAll.checked = true;
    } else {
      checkboxAll.checked = false;
    }
  }

  callFunctionIfChecked(event: Event, orderMasterId: number) {
    const isChecked = (event.target as HTMLInputElement).checked;
    //console.log(" isChecked",isChecked);
    //console.log(" before detailsData ",this.detailsData)
    const individual_checkbox_details =
      this.elementRef.nativeElement.querySelectorAll(
        '.individual_checkbox_details'
      );
    for (let i = 0; i < this.detailsData.length; i++) {
      // check/uncheck the detaiulks checkbox
      if (this.detailsData[i].orderMasterId == orderMasterId) {
        this.detailsData[i].isChecked = isChecked;
        if (isChecked == false) {
          //poping the details id/key from details map
          if (this.detailsMap[this.detailsData[i].orderDetailId]) {
            //console.log('this.detailsMap[id] ', this.detailsMap[this.detailsData[i].orderDetailId ]);
            delete this.detailsMap[this.detailsData[i].orderDetailId];
          }
        }
      }
    }
    //poping the masterId/value  from details map
    const keys = Object.keys(this.detailsMap);
    //console.log(" KEYS", keys)
    // Loop through keys and access their corresponding values
    keys.forEach((key: any) => {
      const value = this.detailsMap[key];
      //console.log(`Key: ${key}, Value: ${value}`);
      if (value == orderMasterId) {
        delete this.detailsMap[key];
        //console.log("detailsMa after delete" ,this.detailsMap);
      }
    });
    //console.log("detailsMap",this.detailsMap);
  }

  detailsCheckBox(event: Event, masterId: any, detailsId: any, index: any) {
    const isChecked = (event.target as HTMLInputElement).checked;

    const individual_checkbox_Master =
      this.elementRef.nativeElement.querySelectorAll(
        '.individual_checkbox_Master'
      );

    //console.log(individual_checkbox_Master.length, "master length... ");

    let masterIndex = 0;
    let cnt = 0;

    // checked the master check box
    for (let i = 0; i < individual_checkbox_Master.length; i++) {
      if (individual_checkbox_Master[i].getAttribute('id') == masterId) {
        masterIndex = i;
        individual_checkbox_Master[i].checked = true;
        this.detailsData[index].isChecked = isChecked;
      }
    }

    // unchecked the master check box
    const individual_checkbox_details =
      this.elementRef.nativeElement.querySelectorAll(
        '.individual_checkbox_details'
      );

    //console.log(individual_checkbox_details.length, "detail length...");

    for (let i = 0; i < individual_checkbox_details.length; i++) {
      if (!individual_checkbox_details[i].checked) {
        cnt++;
      }
    }
    // console.log(cnt, "count of checkbox..");
    // console.log(individual_checkbox_details.length, "details length..");

    if (cnt == individual_checkbox_details.length) {
      individual_checkbox_Master[masterIndex].checked = false;
      this.removeIdFromMap();
    } else {
      this.getCancelledId(masterId, detailsId);
    }
  }

  removeIdFromMap() {
    const individual_check_details =
      this.elementRef.nativeElement.querySelectorAll(
        '.individual_checkbox_details'
      );

    //console.log("individual_check_details ", individual_check_details.length);

    for (let i = 0; i < individual_check_details.length; i++) {
      const id = individual_check_details[i].getAttribute('id');
      delete this.detailsMap[id];
    }
    //console.log(' details map', this.detailsMap);
  }

  getCancelledId(masterId: any, detailsId: any) {
    //console.log(this.detailsMap, 'detailsMap befor');
    // creating obj of details
    const individual_check_details =
      this.elementRef.nativeElement.querySelectorAll(
        '.individual_checkbox_details'
      );

    // creating obj of master
    const individual_check_Master =
      this.elementRef.nativeElement.querySelectorAll(
        '.individual_checkbox_Master'
      );

    // insert  cancelled details id into the map
    for (let i = 0; i < individual_check_details.length; i++) {
      const id = individual_check_details[i].getAttribute('id');
      if (!this.detailsMap[id] && !individual_check_details[i].checked) {
        this.detailsMap[id] = masterId; // setiing master id as value
        //console.log('push', id);
      }

      if (this.detailsMap[id] && individual_check_details[i].checked) {
        delete this.detailsMap[id];
        //console.log('pop', id);
        break;
      }
    }

    //console.log(this.detailsMap, 'detailsMap');
  }

  checkMasterCheckbox() {
    // creating obj of master
    const individual_check_Master =
      this.elementRef.nativeElement.querySelectorAll(
        '.individual_checkbox_Master'
      );

    for (let i = 0; i < individual_check_Master.length; i++) {
      if (individual_check_Master[i].checked) {
        const id = individual_check_Master[i].getAttribute('id');

        //storing master id
        if (this.masterId == '') {
          this.masterId = id;
        } else {
          this.masterId = this.masterId + ',' + id;
        }
      }
    }
  }

  isDetailsMapEmpty(): boolean {
    return Object.keys(this.detailsMap).length === 0;
  }
}
