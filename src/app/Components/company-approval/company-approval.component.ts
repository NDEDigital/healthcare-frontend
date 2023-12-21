import { Component } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';

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
  selectedCompanyCodeValue: number | undefined;

  constructor(private companyService: CompanyService) {}

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

  updateCompany(companyCode: any, Isactive: any) {
    console.log(companyCode, Isactive);
    const selectedCompany = this.companies.find(
      (cmp: any) => cmp.companyCode === companyCode
    );
    if (selectedCompany) {
      this.selectedCompanyCodeValue = selectedCompany.companyCode;
      console.log(
        'Selected Company Code Value:',
        this.selectedCompanyCodeValue
      );
    }
  }
}
