import { Component } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-company-approval',
  templateUrl: './company-approval.component.html',
  styleUrls: ['./company-approval.component.css'],
})
export class CompanyApprovalComponent {
  btnIndex = -1;
  companies: any;
  imagePath = '';
  imageTitle = 'No Data Found!';
  selectedCompanyCodeValues: { [key: string]: number } = {};

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
        console.log(response);
        this.companies = response;
        console.log(this.companies);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  showImage(path: any, title: any) {
    console.log(path, title);
    this.imagePath = path.split('src')[1];
    this.imageTitle = title;
  }

  updateCompany(
    companyEmail: any,
    companyCode: any,
    Isactive: any,
    maxUser: any
  ) {
    console.log(companyCode, Isactive, companyEmail);
    // const selectedCompany = this.companies.find(
    //   (cmp: any) => cmp.companyCode === companyCode
    // );
    // if (selectedCompany) {
    //   this.selectedCompanyCodeValue = selectedCompany.companyCode;
    //   console.log(
    //     'Selected Company Code Value:',
    //     this.selectedCompanyCodeValue
    //   );
    // }
    console.log(
      'Selected Company Code Value:',
      this.selectedCompanyCodeValues[companyCode]
    );
    const userCnt = this.selectedCompanyCodeValues[companyCode] || maxUser;
    const cmp = {
      companyCode: companyCode,
      isActive: Isactive,
      maxUser: userCnt,
    };
    this.companyService.UpdateCompany(cmp).subscribe({
      next: (response: any) => {
        console.log(response);
        this.getData();
        this.sendEmailToCompany(companyEmail, companyCode, userCnt, Isactive);
      },
      error: (error: any) => {
        console.log(error);
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
          console.log(response);
          // Handle success
        },
        error: (error: any) => {
          console.log(error);
          // Handle error
        },
      });
  }
}
