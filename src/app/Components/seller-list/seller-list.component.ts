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
    private emailService: EmailService
  ) {}

  ngOnInit() {
    this.getData();
    
  }

  getData() {
    this.companyService.GetCompaniesBasedOnStatus(this.btnIndex).subscribe({
      next: (response: any) => {
        // alert(response);
        this.companies = response;
        console.log(response);
        // alert(this.btnIndex);
        return this.btnIndex;
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
  }

  // getData1() {
  //   alert(this.btnIndex);
  //   this.companyService.GetCompaniesBasedOnStatus(this.btnIndex).subscribe({
  //     next: (response: any) => {
  //       this.companies = response;
  //       console.log(response);
  //     },
  //     error: (error: any) => {
  //       //console.log(error);
  //     },
  //   });
  // }






  showImage(path: any, title: any) {
    console.log(path);

    this.imagePath = '/asset' + path.split('asset')[1];
    this.imageTitle = title;
  }

  updateCompany(
    userId: any,

    Isactive: any,

  ) {
    //console.log(companyCode, Isactive, companyEmail);
    // const selectedCompany = this.companies.find(
    //   (cmp: any) => cmp.companyCode === companyCode
    // );
    // if (selectedCompany) {
    //   this.selectedCompanyCodeValue = selectedCompany.companyCode;
    //   //console.log(
    //     'Selected Company Code Value:',
    //     this.selectedCompanyCodeValue
    //   );
    // }
    // console.log(
    //   'Selected Company Code Value:',
    //   this.selectedCompanyCodeValues[companyCode]
    // );
    // const userCnt = this.selectedCompanyCodeValues[companyCode] || maxUser;
    // if (userCnt < 0) {
    //   // Handle the invalid input (e.g., display an error message)
    //   this.alertTitle = 'Error!';
    //   this.alertMsg = 'Please enter a non-negative value for the user count.';
    //   this.msgModalBTN.nativeElement.click();
    //   return; // Prevent further processing
    // }

    const cmp = {
     
      Isactive: Isactive,
      userId:userId
      // maxUser: userCnt,
    };
   
    this.companyService.UpdateCompany(cmp).subscribe({
      next: (response: any) => {
        //console.log(response);
        this.getData();
        // alert(Isactive);
     
        if ( Isactive== false) this.btnIndex = 1;
        if (Isactive == true) this.btnIndex = 0;
        // this.sendEmailToCompany(companyEmail, companyCode, userCnt, Isactive);
     

        if (Isactive) {
          this.alertTitle = 'Success!';
          this.alertMsg = 'Company is approved sucessfully.';
        } else {
          this.alertTitle = 'Rejected!';
          this.alertMsg = 'Company is rejected.';
        }
        this.msgModalBTN.nativeElement.click();
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
  }

  sendEmailToCompany(email: any, companyId: any, maxUser: any, Isactive: any) {
    // You can customize the email message to include companyId, max users, and admin info
    let message = '';
    if (Isactive === 1) {
      message = `Thank you for registering your company! Your Company ID is ${companyId}.
   You can add up to ${maxUser} users as sellers, and the first added user will be the Company Admin.`;
    } else if (Isactive === 0) {
      message = `Your request for registering your company is rejected!`;
    } else {
      message = `We updated your max USer Limit!`;
    }
    this.emailService
      .sendEmail(email, 'Company Registration Successful', message)
      .subscribe({
        next: (response: any) => {
          //console.log(response);
          // Handle success
        },
        error: (error: any) => {
          //console.log(error);
          // Handle error
        },
      });
  }
}
