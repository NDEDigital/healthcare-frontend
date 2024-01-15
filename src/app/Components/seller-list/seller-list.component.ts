import { Component, ElementRef, ViewChild } from '@angular/core';
import { reload } from 'firebase/auth';


import { CompanyService } from 'src/app/services/company.service';
import { EmailService } from 'src/app/services/email.service';
@Component({
  selector: 'app-seller-list',
  templateUrl: './seller-list.component.html',
  styleUrls: ['./seller-list.component.css']
})
export class SellerListComponent {
  btnIndex = -1;
  companies: any;
  imagePath = '';
  imageTitle = 'No Data Found!';
  selectedCompanyCodeValues: { [key: string]: any } = {};
  @ViewChild('msgModalBTN') msgModalBTN!: ElementRef;
  alertTitle: string = '';
  alertMsg: string = '';
  constructor(
    private companyService: CompanyService,
  ) {}

  ngOnInit() {
    this.getData();
    
  }

  getData() {
    console.log("bebe");
    
    this.companyService.GetSellerList(this.btnIndex).subscribe({
      next: (response: any) => {
       this.companies = response;   
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
