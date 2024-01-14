import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Components/header/header.component';
import { NavBeltComponent } from './Components/nav-belt/nav-belt.component';
// http client module
import { HttpClientModule ,HTTP_INTERCEPTORS} from '@angular/common/http';
import { BannerComponent } from './Components/banner/banner.component';
import { ContactSupplierComponent } from './Components/contact-supplier/contact-supplier.component';
import { HomeComponent } from './Pages/home/home.component';
import { BecomeASellerComponent } from './Pages/become-a-seller/become-a-seller.component';
import { ProductSidebarComponent } from './Components/product-sidebar/product-sidebar.component';
import { CardComponent } from './Components/card/card.component';
import { ContactSupplierPageComponent } from './Pages/contact-supplier-page/contact-supplier-page.component';
import { ProductsPageComponent } from './Pages/CompanyList/products-page.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegisterComponent } from './Pages/register/register.component';
//From Modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from './Pages/user-profile/user-profile.component';
import { MaxQuantityProductsSliderComponent } from './Components/max-quantity-products-slider/max-quantity-products-slider.component';

import { ProductSliderComponent } from './Components/product-slider/product-slider.component';

import { ProductComponent } from './Pages/productList/product.component';
import { SingleProductComponent } from './Components/single-product/single-product.component';
import { ChunkPipe } from './services/chunk.pipe';
import { CarouselComponent } from './Components/carousel/carousel.component';
import { AddProductComponent } from './Pages/add-product/add-product.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { ProductCardComponent } from './Components/product-card/product-card.component';

import { FooterComponent } from './Components/footer/footer.component';
import { SearchResultComponent } from './Pages/search-result/search-result.component';
import { ProductSearchComponent } from './Components/product-search/product-search.component';
import { ErrorComponent } from './Components/error/error.component';
import { CompareProductComponent } from './Pages/compare-product/compare-product.component';
import { CartAddedProductComponent } from './Pages/cart-added-product/cart-added-product.component';
import { AdminOrderComponent } from './Components/admin-order/admin-order.component';
import { PaymentHeaderComponent } from './Components/payment-header/payment-header.component';
import { PaymentComponent } from './Pages/payment/payment.component';
import { DashBoardNavbarComponent } from './Components/dash-board-navbar/dash-board-navbar.component';
import { OrdersOverviewComponent } from './Pages/dashboard/orders-overview/orders-overview.component';
import { HomeCoreContentComponent } from './Components/home-core-content/home-core-content.component';
import { HomeProductCardComponent } from './Components/home-product-card/home-product-card.component';
import { CheckoutPageComponent } from './Pages/checkout-page/checkout-page.component';
import { SubHeaderComponent } from './Components/sub-header/sub-header.component';
import { ClientsListSliderComponent } from './Components/clients-list-slider/clients-list-slider.component';
import { PaginationComponent } from './Components/pagination/pagination.component';
import { SellerInvoiceComponent } from './ReportDesign/seller-invoice/seller-invoice.component';
import { AdminInvoiceComponent } from './ReportDesign/admin-invoice/admin-invoice.component';
import { BuyerInvoiceComponent } from './ReportDesign/buyer-invoice/buyer-invoice.component';
import { ProductDetailsPageComponent } from './Pages/product-details-page/product-details-page.component';
import { BuyerOrderComponent } from './Components/buyer-order/buyer-order.component';
import { BuyerOrderDetailsComponent } from './Components/buyer-order-details/buyer-order-details.component';
import { AutoFocusOtpFieldComponent } from './Components/auto-focus-otp-field/auto-focus-otp-field.component';
import { OtpModalComponent } from './Components/otp-modal/otp-modal.component';
// token
import { UserTokenInterceptor } from './Interceptor/user-token.interceptor';
import { SellerInventoryComponent } from './Components/seller-inventory/seller-inventory.component';
import { AddProductQuantityComponent } from './Components/add-product-quantity/add-product-quantity.component';
import { AddProductsComponent } from './Components/add-products/add-products.component';
import { AddGroupsComponent } from './Components/add-groups/add-groups.component';
import { UserRegFormComponent } from './Components/user-reg-form/user-reg-form.component';
import { UserRegistrationComponent } from './Pages/user-registration/user-registration.component';
import { CompanyApprovalComponent } from './Components/company-approval/company-approval.component';
import { AddPriceDiscountsComponent } from './Components/add-price-discounts/add-price-discounts.component';
import { ProductApprovalComponent } from './Components/product-approval/product-approval.component';
import { OrderFlowComponent } from './Components/order-flow/order-flow.component';
import { SellerOrderComponent } from './Components/seller-order/seller-order.component';
import { UserOrdersComponent } from './Pages/user-orders/user-orders.component';
import { SellerOrdersComponent } from './Components/seller-orders/seller-orders.component';
import { LoginPopupComponent } from './Components/login-popup/login-popup.component';
 

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavBeltComponent,
    BannerComponent,
    ContactSupplierComponent,
    HomeComponent,
    BecomeASellerComponent,
    ProductSidebarComponent,
    CardComponent,
    ContactSupplierPageComponent,
    ProductsPageComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    MaxQuantityProductsSliderComponent,
    ProductSliderComponent,
    ProductComponent,
    SingleProductComponent,
    ChunkPipe,
    CarouselComponent,
    AddProductComponent,
    DashboardComponent,
    ProductCardComponent,
    FooterComponent,
    SearchResultComponent,
    ProductSearchComponent,
    ErrorComponent,
    CompareProductComponent,
    CartAddedProductComponent,
    AdminOrderComponent,
    PaymentHeaderComponent,
    PaymentComponent,
    DashBoardNavbarComponent,
    OrdersOverviewComponent,
    HomeCoreContentComponent,
    HomeProductCardComponent,
    CheckoutPageComponent,
    SubHeaderComponent,
    ClientsListSliderComponent,
    PaginationComponent,
    SellerInvoiceComponent,
    AdminInvoiceComponent,
    ProductDetailsPageComponent,
    BuyerOrderComponent,
    BuyerOrderDetailsComponent,
    AutoFocusOtpFieldComponent,
    OtpModalComponent,
    SellerInventoryComponent,
    AddProductQuantityComponent,
    AddProductsComponent,
    AddGroupsComponent,
    UserRegFormComponent,
    UserRegistrationComponent,
    CompanyApprovalComponent,
    AddPriceDiscountsComponent,
    ProductApprovalComponent,
    OrderFlowComponent,
    SellerOrderComponent,
    UserOrdersComponent,
    BuyerInvoiceComponent,
    SellerOrdersComponent,
    LoginPopupComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],


  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UserTokenInterceptor ,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
