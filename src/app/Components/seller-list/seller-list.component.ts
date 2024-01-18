import { Component, ElementRef, Input, Output, ViewChild } from '@angular/core';
import { reload } from 'firebase/auth';


import { CompanyService } from 'src/app/services/company.service';
import { EmailService } from 'src/app/services/email.service';
@Component({
  selector: 'app-seller-list',
  templateUrl: './seller-list.component.html',
  styleUrls: ['./seller-list.component.css']
})
export class SellerListComponent {
  responseLength:any;
  dropdownValues: any[] = [];
  dropdownValuesWithNames:any[]=[];
  userBtnIndex=0;
  btnIndex = 1;
  sellerList: any;
  whoUser:any;
  imagePath = '';
  imageTitle = 'No Data Found!';
  selectedCompanyCodeValues: { [key: string]: any } = {};
  UserId:any;
  @ViewChild('msgModalBTN') msgModalBTN!: ElementRef;
  alertTitle: string = '';
  alertMsg: string = '';
  constructor(
    private companyService: CompanyService,
  ) {}
 
  ngOnInit() {

  
    this.UserId=localStorage.getItem('code');
    this.whoUser=localStorage.getItem('role');
    
    if(this.whoUser === 'seller'){
      
      
      this.getData();
    }
    else{
     
      
        this.getSeller();
    }
   this.getDropdownValues();
    
    // alert(this.UserId);
  }
//  currentIndex: number = 0;
//   incrementIndex(): void {
//     this.currentIndex++;
//     alert(this.currentIndex);
//   }
  getData() {
    console.log("bebe");
    
    this.companyService.GetSellerList(this.btnIndex).subscribe({
      next: (response: any) => {
        console.log(this.btnIndex);
        // alert(this.btnIndex);
       this.sellerList = response.filter((u:any) => u.userId!== Number(this.UserId));   
         console.log(this.sellerList,"seller");
         
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  
  selectedValue: any;

  onCategoryChange(event: any): void {
    // Handle the change event here
    this.selectedValue = event.target.value;
    console.log('Selected value:', this.selectedValue);
  
    // Call getSeller without passing selectedValue as a parameter
    this.getSeller();
  
    // Add your logic here based on the selected value
  }
  
  getSeller(): void {
    console.log("got in getSeller", this.selectedValue);
    let responseCount = 0;
    // Assuming this.btnIndex is defined somewhere in your code
    this.companyService.GetSellerInAdmin(this.btnIndex,this.selectedValue).subscribe({
      next: (response: any) => {
        console.log(this.btnIndex, "admin", response);
        this.sellerList = response;
        this.responseLength=response.length
        console.log("dfladkfja",this.responseLength);
        // console.log(typeof this.responseLength);
        
      },
      error: (error: any) => {
        console.log(error);
      },
      
    });
    // console.log("Total responses received:", responseCount);
  }
  getDropdownValues(): void {
    // Assuming this.btnIndex is defined somewhere in your code
    this.companyService.GetDropdownValues().subscribe({
      next: (response: any) => {
        console.log("response",response);
        // this.dropdownValues=response;
        //  this.dropdownValues = Array.from(new Set(response.map((item: any) => item.companyCode)));
       /// this.dropdownValuesWithNames =response.filter((item: any) => item.companyCode === targetCompanyCode);

        // this.dropdownValuesWithNames = Array.from(new Set(response.map((item: any) => ({ companyCode: item.companyCode, companyName: item.companyName }))));
        const uniqueCompanyCodesMap = new Map<string, any>();

        // Use the map to filter out objects with duplicate companyCode values
        response.forEach((item:any) => {
          if (!uniqueCompanyCodesMap.has(item.companyCode)) {
            uniqueCompanyCodesMap.set(item.companyCode, item);
          }
        });
        
        // Convert the values of the map to an array to get the final result
         this.dropdownValues = Array.from(uniqueCompanyCodesMap.values());
        console.log("dropdonwn",this.dropdownValues);

  
       
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  


  

  

getBuyer(){
  this.companyService.GetBuyerInAdmin(this.btnIndex).subscribe({
    next: (response: any) => {

      // console.log("This is ")
      console.log(this.btnIndex,"getBuyerInAdmin",response);
      
     this.sellerList = response; 
      
       
    },
    error: (error: any) => {
      console.log(error);
    },
  });



}

getBuyerIn(){
this.getBuyer()




}
getSellerIn(){
this.getSeller();
  
}


getUser(){
  if(this.userBtnIndex===1){
    this.getBuyerIn();
  }
  else{
    this.getSellerIn();
  }
}




  UpdatedSellerBuyer(
    userId: any,
    Isactive: any,
  ) {
    const cmp = { 
      Isactive: Isactive,
      userId:userId
      // maxUser: userCnt,
    };
   
    this.companyService.UpdateSellerActiveInActive(cmp).subscribe({
      next: (response: any) => {
        console.log(response);
        
     
        if(this.btnIndex === 1&& this.userBtnIndex===1){

          this.alertTitle = "Buyer Activation!";
          this.alertMsg = "Buyer is Activated Successfully.";
        } 
       else if(this.btnIndex === 1&& this.userBtnIndex===0){

          this.alertTitle = "Seller Activation!";
          this.alertMsg = "Seller is Activated Successfully.";
        } 
        
        
       else if(this.btnIndex === 0&& this.userBtnIndex===1){

          this.alertTitle = "Buyer Deactivation!";
          this.alertMsg = "Buyer is Deactivated Successfully.";
        } 

        
        else{
          this.alertTitle = "Seller Deactivation!";
          this.alertMsg = "Seller Deactivated Successfully.";
        } 
      
        this.msgModalBTN.nativeElement.click();  
        
        if(this.whoUser === 'seller'){
          this.getData();
          console.log('getData');
          }
          else{
            //  this.getSeller();
             this.getUser();
             console.log('getSeller')
          }



         
        
          
          
         
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

 
}
