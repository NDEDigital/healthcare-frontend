import { Component, ElementRef, ViewChild } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { SellerDasboardPermissionService } from 'src/app/services/seller-dasboard-permission.service';


@Component({
  selector: 'app-seller-permission',
  templateUrl: './seller-permission.component.html',
  styleUrls: ['./seller-permission.component.css'],
  
})
export class SellerPermissionComponent {
  selectedValue:any;
  dropdownValues: any[] = [];
  tableData: any[] = [];

  whoUser:any;
  UserId:any;
  sellerList: any;
  responseLength:any;
selectedUserId: any;
selectedMenu: any;
@ViewChild('sellerSelected') sellerSelected!: ElementRef;
@ViewChild('menuSelected') menuSelected!: ElementRef;
@ViewChild('msgModalBTN') modalButton!: ElementRef;
@ViewChild('yesButton') yesButton!: ElementRef;

  constructor(
    private companyService: CompanyService,
    private SellerDasboardPermissionService:SellerDasboardPermissionService
  ) {}
  ngOnInit() {
    this.UserId=localStorage.getItem('code');
    this.whoUser=localStorage.getItem('role');
     
    if(this.whoUser === 'seller'){
      // console.log("user id is+",this.UserId);
      
      this.getPermission();
      this.getData();
      // this.getDashboarItem();
    }
 
  
  //  this.getDropdownValues();
    
    // alert(this.UserId);
  }


  getDashboarItem(sellerId:any) {
    console.log("the sellerId is",sellerId)
  
    // console.log("the getDashoard",  sellerId);
    this.SellerDasboardPermissionService.GetSellerDashboardPermission(sellerId).subscribe({
      next: (response: any) => {
      
         this.dropdownValues=response;
         console.log("the response is",response);
         
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }



  getData() {
    // console.log("it enter in ts");
    // console.log("bebe");
    // console.log("getData is called");
    this.companyService.GetSellerList(1).subscribe({
      next: (response: any) => {
        // console.log(this.btnIndex);
        // alert(this.btnIndex);

        // console.log("this is the data for dropdown",response);
       this.sellerList = response.filter((u:any) => u.userId!== Number(this.UserId));   
        //  console.log(this.sellerList,"this is the data for dropdown");
console.log("the seller list ",this.sellerList)

        this.responseLength=response.length
         console.log("the length is",response.length);
         
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  onUserChange(userId1:any) {
    
   this.getDashboarItem(userId1);
 
  }

  PermissionBtn(userId2: any, MenuId: any) {
    // console.log("userId is ", userId2);
    // console.log("MenuId is", MenuId);
    
    // Check if either userId or MenuId is null
    if (userId2 === 'null' || MenuId === 'null') {
        alert("Please select both Seller Name and Menu Name before adding permission.");
    } else {
        // console.log(userId2, " ---- ", MenuId);
        // console.log(typeof MenuId, " tui ke ");
        
        this.SellerDasboardPermissionService.GivePermissionToDash(userId2, MenuId).subscribe({
            next: (response: any) => {
                this.getPermission();
                
                this.menuSelected.nativeElement.value = null;
                MenuId = parseInt(MenuId);
                // console.log(typeof MenuId, " ebar bol ", typeof this.dropdownValues[0].menuId);
                this.dropdownValues = this.dropdownValues.filter((user) => MenuId !== user.menuId);
                // console.log(this.dropdownValues, " dekhi");
            },
            error: (error: any) => {
                console.log(error);
            },
        });
    }
}


  currentIndex: number = 0;
  updateTableData() {
    // Your existing logic to update tableData...
    
    // Increment the index variable
    this.currentIndex++;
  }
  // item:any;
  getPermission() {
    // console.log("it enter in ts");
    // console.log("bebe");
    this.SellerDasboardPermissionService.GetPermissionData(this.UserId).subscribe({
      next: (response: any) => {
     
        this.tableData = response;
// console.log("data of the table:",this.tableData);
// window.location.reload();
        
    
         
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  
  selectedMenuItems: any = [];
  user:any=[];
  checkboxChanged(userId: any, menuId: any) {
    // console.log("is selected is in checkbox:", this.selectedMenuItems);
  // console.log("the table data is in checkbox",this.tableData);
    // Unselect checkboxes for other users
    for (const key in this.tableData) {
      // console.log("the key are:",key);
      if (key !== userId) {
        const otherUser = this.tableData[key];
        for (const item of otherUser) {
          item.isSelected = false;
        }
      }
    }
  
    // Check the state of the checkbox and perform actions accordingly
    const user = this.tableData[userId];
    this.selectedMenuItems = user.filter((menuItem: any) => menuItem.isSelected);
    // console.log('Selected Menu Items:', this.selectedMenuItems);
  
    // Now, selectedMenuItems contains the selected menu items for the given user
  }
  
 openModal(){
  // console.log("selected menu is",this.selectedMenuItems);
  if(this.selectedMenuItems.length>0){

    const modalButton = document.getElementById('msgModalBTN');
    if (this.modalButton) {
      this.modalButton.nativeElement.click();
    }
  }
 }

 yesBtn(sellerSelected:any){
  //  console.log("Seller Selected:",sellerSelected.value);
  this.UpdatePermission(sellerSelected);
 }
  UpdatePermission(selectedSeller:any) {
    // console.log("the btn is clicked");
 
// console.log("yes btn is+",this.yesButton);

    

    // Check if selectedMenuItems is undefined or empty before accessing properties
    if (!this.selectedMenuItems || this.selectedMenuItems.length === 0) {
      alert('No Item is selected menu items');
     
        return;
    }

    const menuIds: number[] = this.selectedMenuItems.map((item: any) => item.menuId);
  
    // Check if userId is defined before accessing it
    if (!this.selectedMenuItems[0].userId) {
        alert('No userId in selected menu items');
        return;
    }

//     console.log('Selected Menu Items from UpdatePermission:', this.selectedMenuItems[0].userId);
// console.log(menuIds);
const modalButton = document.getElementById('msgModalBTN');
if (this.modalButton) {
  this.modalButton.nativeElement.click();
}
// console.log("selected value are",this.selectedMenuItems);
    // Rest of your code...
    this.SellerDasboardPermissionService.DeleteMenuId(this.selectedMenuItems[0].userId, menuIds).subscribe({
        next: (response: any) => {
            // console.log(response);
       this.getPermission();
       this.menuSelected.nativeElement.value = null;
      //  console.log("selectedUser:",selectedSeller);
       this.getDashboarItem(selectedSeller);
      //  this.menuSelected.nativeElement.value = null;
      // this.getData();


        },
        error: (error: any) => {
            console.log(error);
        },
    });
}

onYesButtonClick() {
  // Handle the logic when the "Yes" button is clicked
  alert('Yes button clicked');
}  
   
}









