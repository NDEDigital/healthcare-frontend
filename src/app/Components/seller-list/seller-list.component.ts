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
getSeller(){
  // console.log("bebe");
   
  this.companyService.GetSellerInAdmin(this.btnIndex).subscribe({
    next: (response: any) => {

      // console.log("This is ")
      console.log(this.btnIndex,"admin",response);
      
     this.sellerList = response; 
      
       
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
