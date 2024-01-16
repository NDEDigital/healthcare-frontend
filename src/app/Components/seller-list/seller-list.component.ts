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
  btnIndex = 1;
  sellerList: any;
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

    this.getData();
    this.UserId=localStorage.getItem('code');
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
       this.sellerList = response.filter((u:any) => u.userId!== Number(this.UserId));   
         console.log(this.sellerList,"sdsd");
         
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }




  updateCompany(
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
        if(this.btnIndex === 1){
          this.alertTitle = "Seller InActive";
          this.alertMsg = "InActivate Success";
        }   
        else{
          this.alertTitle = "Seller InActive";
          this.alertMsg = "Seller Activate Success";
        } 
      
        this.msgModalBTN.nativeElement.click();    
        this.getData();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

 
}
