import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NegativeSellerAdminGuardGuard implements CanActivate {
  role: any;
  constructor(private router: Router) {
    this.role = localStorage.getItem('role');
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.role === 'seller' || this.role === 'admin') {
      return this.router.navigate(['/dashboard']);
    } else {
      return true;
    }
  }
}
