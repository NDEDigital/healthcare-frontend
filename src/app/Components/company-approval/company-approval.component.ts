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
}
