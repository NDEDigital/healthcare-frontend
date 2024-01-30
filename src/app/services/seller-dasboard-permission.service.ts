import { Injectable } from '@angular/core';
import { API_URL } from '../config';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SellerDasboardPermissionService {
  URL = API_URL;

  constructor(private http: HttpClient) { 

  }

  GetSellerDashboardPermission(UserId: any) {

    return this.http.get(`${this.URL}/sellerDashboard/${UserId}`);
    
  }

  GivePermissionToDash(UserId: any,MenuId:any) {
// console.log(UserId,MenuId);
    return this.http.post(`${this.URL}/GiveAcessDashboard/${UserId}/${MenuId}`,{});
 
    
  }
  GetPermissionData(userId4:any) {
   
        return this.http.get(`${this.URL}/GetPermissionData/${userId4}`);
        
     
        
      }
      getUserPermission(userId5:any,AdminStatus:any) {
   
        return this.http.get(`${this.URL}/SellerPermissionData/${userId5}/${AdminStatus}`);
        
     
        
      }

      DeleteMenuId(userId6:any,menuIds:any) {
        // console.log("userId is +",userId6);
        // console.log("menuIdss is +",menuIds);

   
        return this.http.delete(`${this.URL}/deleteMenuItems/${userId6}`, { body: menuIds });
        
     
        
      }





}
