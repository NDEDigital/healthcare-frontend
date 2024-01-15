import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { HttpClient } from '@angular/common/http';
import { reload } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  URL = API_URL;
  createCompanyURL = `${this.URL}/api/CompanyRegistration/CreateCompany`;
  payMethodCompanyURL = `${this.URL}/api/HK_Gets/PreferredPaymentMethods`;
  preferredBankNamesURL = `${this.URL}/api/HK_Gets/PreferredBankNames`;
  GetCompaniesBasedOnStatusURL = `${this.URL}/CompanySellerDetails/${localStorage.getItem('code')}`;
  UpdateCompanyURL = `${this.URL}/api/CompanyRegistration/UpdateCompany`;
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
    // alert(`${this.URL}/CompanySellerDetails/${localStorage.getItem('code')}/${status}`)
    if(status==1){
      status=true
    }
    else{
      status=false;
    }
    return this.http.get(`${this.URL}/CompanySellerDetails/${localStorage.getItem('code')}/${status}`);
    
  }
  UpdateCompany(companyDto: any) {
  //  alert(companyDto.Isactive);
  //  alert(companyDto.userId);
   if(companyDto.Isactive==1){
    companyDto.Isactive=true
  }
  else{
    companyDto.Isactive=false;
  }

    //console.log('Data sent to server:', companyDto);
    return this.http.put(`${this.URL}/CompanySellerDetailsUpdateUserStatus/${companyDto.userId}/${companyDto.Isactive}`, null);

  }
}
