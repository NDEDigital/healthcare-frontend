import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { BecomeASellerComponent } from './Pages/become-a-seller/become-a-seller.component';
import { ProductsPageComponent } from './Pages/CompanyList/products-page.component';
import { ContactSupplierComponent } from './Components/contact-supplier/contact-supplier.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegisterComponent } from './Pages/register/register.component';
import { AuthGuardGuard } from './services/auth-guard.guard';
import { UserProfileComponent } from './Pages/user-profile/user-profile.component';
import { NegativeAuthGuard } from './services/negative-auth.guard';
import { ProductComponent } from './Pages/productList/product.component';
import { AddProductComponent } from './Pages/add-product/add-product.component';
import { OrdersOverviewComponent } from './Pages/dashboard/orders-overview/orders-overview.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { SearchResultComponent } from './Pages/search-result/search-result.component';
import { CompareProductComponent } from './Pages/compare-product/compare-product.component';
import { PaymentComponent } from './Pages/payment/payment.component';
import { CartAddedProductComponent } from './Pages/cart-added-product/cart-added-product.component';
import { CheckoutPageComponent } from './Pages/checkout-page/checkout-page.component';
import { ProductDetailsPageComponent } from './Pages/product-details-page/product-details-page.component';
import { SellerInvoiceComponent } from './ReportDesign/seller-invoice/seller-invoice.component';
import { AdminInvoiceComponent } from './ReportDesign/admin-invoice/admin-invoice.component';
import { BuyerOrderComponent } from './Components/buyer-order/buyer-order.component';
import { BuyerOrderDetailsComponent } from './Components/buyer-order-details/buyer-order-details.component';

import { BuyerOnlyGuard } from './services/buyer-only.guard';
import { SellerOnlyGuard } from './services/seller-only.guard';
import { AdminSellerOnlyGuard } from './services/admin-seller-only.guard';
import { NegativeSellerAdminGuardGuard } from './guards/negative-seller-admin-guard.guard';
import { UserRegistrationComponent } from './Pages/user-registration/user-registration.component';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [NegativeSellerAdminGuardGuard],
  },
  { path: 'product', component: ProductComponent },
  { path: 'becomeASeller', component: BecomeASellerComponent },
  { path: 'homeComponent', component: HomeComponent },
  { path: 'productsPageComponent', component: ProductsPageComponent },
  { path: 'searchResult', component: SearchResultComponent },
  { path: 'compare', component: CompareProductComponent },
  { path: 'cartView', component: CartAddedProductComponent },
  { path: 'contactSupplierComponent', component: ContactSupplierComponent },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuardGuard] },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'userRegistration',
    component: UserRegistrationComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'userProfile',
    component: UserProfileComponent,
    canActivate: [NegativeAuthGuard],
  },
  {
    path: 'addProduct',
    component: AddProductComponent,
    canActivate: [NegativeAuthGuard],
  },
  {
    path: 'ordersOverview',
    component: OrdersOverviewComponent,
    canActivate: [SellerOnlyGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AdminSellerOnlyGuard],
  },
  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [NegativeAuthGuard],
  },
  {
    path: 'sellerInvoice',
    component: SellerInvoiceComponent,
    canActivate: [SellerOnlyGuard],
  },
  {
    path: 'adminInvoice',
    component: AdminInvoiceComponent,
    canActivate: [NegativeAuthGuard],
  },
  {
    path: 'checkout',
    component: CheckoutPageComponent,
    canActivate: [BuyerOnlyGuard],
  },
  {
    path: 'productDetails',
    component: ProductDetailsPageComponent,
  },
  {
    path: 'buyerOrder',
    component: BuyerOrderComponent,
    canActivate: [BuyerOnlyGuard],
  },

  {
    path: 'buyerOrderDetails',
    component: BuyerOrderDetailsComponent,
    canActivate: [BuyerOnlyGuard],
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
