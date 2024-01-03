import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { compileNgModule } from '@angular/compiler';
import { API_URL } from '../config';

@Injectable({
  providedIn: 'root',
})
export class GoodsDataService {
  private navData: any[] = [];
  private allData: any[] = [];
  private companyList: any;
  private productType: any;
  private carousalData: any;

  private groupCode: string = '';
  private groupName: string = '';
  private companyCode: string = '';
  private detailData: any;

  item: number = 20;
  page: number = 0;
  searchKey: string = 'a';
  sortedKey: string = 'NAME';
  URL = API_URL;
  // URL = 'https://localhost:7006'; // LocalURL
  //URL = 'http://172.16.5.18:8081'; // liveURL

  getGoodsListURL = `${this.URL}/api/Goods/GetGoodsList`;
  sellersProductListURL = `${this.URL}/GetProduct`;
  navUrl = `${this.URL}/api/Goods/GetNavData`;

  searchProuct = '';

  constructor(private http: HttpClient) {}

  getSearchResult() {
    this.searchProuct = `${this.URL}/api/ProductSearch/GetSearchedProduct?productName=${this.searchKey}&sortDirection=${this.sortedKey}&nextCount=${this.item}&offset=${this.page}`;
    //console.log(this.searchKey, 'ddddd', this.searchProuct);
    return this.http
      .get<any[]>(this.searchProuct)
      .pipe(tap((response: any[]) => {}));
  }

  getNavData() {
    return this.http.get<any[]>(this.navUrl).pipe(
      tap((response: any[]) => {
        this.navData = response;
      })
    );
  }

  setDetailData(entry: any) {
    this.detailData = entry;
  }
  getDetaileData() {
    return this.detailData;
  }

  getCarouselData() {
    const carouselURL = `${this.URL}/api/Goods/GetGoodsList`;
    return this.http.get<any[]>(carouselURL).pipe(
      tap((response: any[]) => {
        this.carousalData = response;
        // //console.log(this.companyList,"");
      }),
      // catchError((error: any) => {
      //   console.error('Error:', error);
      //   // if (error.status == 401) {
      //   //   //console.log(' error status', error.status);
      //   //   setTimeout(this.getCarouselData, 5000);
      //   // }
      //   return throwError(error);
      // })
      catchError((error: any) => {
        console.error('Error:', error);
        // if (error.status === 401) {
        //   //console.log('Error status 401. Retrying after 5 seconds...');
        //   setTimeout(() => {
        //     this.getCarouselData().subscribe((data: any[]) => {
        //       // this.updateQuantity();
        //     });
        //   }, 5000);
        // }
        return throwError(error);
      })
    );
  }

  getProductCompanyList(groupCode: string) {
    // this.groupCode = groupCode;
    // this.groupName = groupName;
    // //console.log( this.groupCode, "dsdsds");
    // this.groupCode = groupCode;
    // this.groupName = groupName;
    this.groupCode = sessionStorage.getItem('groupCode') || '';
    this.groupName = sessionStorage.getItem('groupName') || '';
    // this.groupName = localStorage.getItem('activeEntry') || '';
    //console.log(this.groupCode, 'groupCode', this.groupName, 'groupname');

    const encodedGroupName = encodeURIComponent(this.groupName);
    //console.log('encodedGroupName ', encodedGroupName);
    const productCompany = `${this.URL}/api/Goods/GetProductCompany/${this.groupCode}`;
    //console.log(productCompany, ' produ');

    return this.http.get<any[]>(productCompany).pipe(
      tap((response: any[]) => {
        this.companyList = response;
        //console.log(this.companyList, 'companyList');
      }),
      catchError((error: any) => {
        // console.error('Error:', error);
        return throwError(() => error);
      })
    );
  }

  getProductList(companyCode: string) {
    // this.companyCode = companyCode;
    // //console.log(companyCode," ----------");

    this.companyCode = sessionStorage.getItem('companyCode') || '';
    this.groupName = localStorage.getItem('activeEntry') || '';
    this.groupCode = sessionStorage.getItem('groupCode') || '';

    const productCompany = `${this.URL}/api/Goods/GetProductList?CompanyCode=${this.companyCode}&ProductGroupCode=${this.groupCode}`;

    return this.http.get<any[]>(productCompany).pipe(
      tap((response: any[]) => {
        this.productType = response;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  products(sellerCode: any) {
    return this.http.get(this.sellersProductListURL, {
      params: { sellerCode },
    });
  }

  // review and ratings

  getReviewRatingsData(goodsId: any) {
    //console.log(goodsId, groupCode);

 

    const url = `${this.URL}/api/ReviewAndRating/getReviewRatingsDataForDetailsPage`;
    // const url = `${this.baseUrl}/GetOrderData/${pageNumber}/${pageSize}/${status} `;
 
    return this.http.get(url, {
      params: { goodsId },
    });
  }
}
