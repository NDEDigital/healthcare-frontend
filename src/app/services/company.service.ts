import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  URL = API_URL;
  createCompanyURL = `${this.URL}/api/CompanyRegistration/CreateCompany`;
  payMethodCompanyURL = `${this.URL}/api/HK_Gets/PreferredPaymentMethods`;
  preferredBankNamesURL = `${this.URL}/api/HK_Gets/PreferredBankNames`;
  GetCompaniesBasedOnStatusURL = `${this.URL}/api/CompanyRegistration/GetCompaniesBasedOnStatus`;
  constructor(private http: HttpClient) {}
  createCompany(companyData: any) {
    return this.http.post(this.createCompanyURL, companyData);
  }
  getpayMethod() {
    return this.http.get(this.payMethodCompanyURL);
  }
  PreferredBankNames(preferredPM: any) {
    return this.http.get(this.preferredBankNamesURL, {
      params: { preferredPM },
    });
  }
  GetCompaniesBasedOnStatus(status: any) {
    return this.http.get(this.GetCompaniesBasedOnStatusURL, {
      params: { status },
    });
  }
}
