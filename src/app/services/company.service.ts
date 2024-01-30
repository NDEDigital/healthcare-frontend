import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { HttpClient } from '@angular/common/http';
import { reload } from 'firebase/auth';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  URL = API_URL;
  createCompanyURL = `${this.URL}/api/CompanyRegistration/CreateCompany`;
  payMethodCompanyURL = `${this.URL}/api/HK_Gets/PreferredPaymentMethods`;
  preferredBankNamesURL = `${this.URL}/api/HK_Gets/PreferredBankNames`;
  GetCompaniesBasedOnStatusURL = `${this.URL}/api/CompanyRegistration/GetCompaniesBasedOnStatus`;
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
    return this.http.get(this.GetCompaniesBasedOnStatusURL, {
      params: { status },
    });
  }
  UpdateCompany(companyDto: any) {
    //console.log('Data sent to server:', companyDto);
    return this.http.put(this.UpdateCompanyURL, companyDto);
  }
  GetSellerList(status: any) {
    if(status==1){
      status=true
    }
    else{
      status=false;
      // alert(status);
    }
    console.log("status is",status);
    console.log("code is",localStorage.getItem('code'));
    return this.http.get(`${this.URL}/CompanySellerDetails/${localStorage.getItem('code')}/${status}`);
    
  }

  GetSellerInAdmin(status:any,selectedValue:any){
    if(status==1){
      status=true
    }
    else{
      status=false;
    }
    // console.log(selectedValue);
    
    return this.http.get(`${this.URL}/getSellerActive&Inactive/${true}?CompanyCode=${selectedValue}&IsActive=${status}`);
    // getSellerActive&Inactive/false?CompanyCode=dfasd&IsActive=true
  }


  GetBuyerInAdmin(status:any){
    if(status==1){
      status=true
    }
    else{
      status=false;
    }
    
    return this.http.get(`${this.URL}/getBuyerInAdmin/${true}?IsActive=${status}`);


  }

  GetDropdownValues(){
 
    return this.http.get(`${this.URL}/api/CompanyRegistration/GetCompaniesBasedOnStatus?status=${1}`);



  }






  UpdateSellerActiveInActive(companyDto: any) {
   if(companyDto.Isactive == 1){
    companyDto.Isactive=true
  }
  else{
    companyDto.Isactive=false;
  }
  return this.http.put(`${this.URL}/CompanySellerDetailsUpdateUserStatus/${companyDto.userId}/${companyDto.Isactive}`, null)
  

  }
}
