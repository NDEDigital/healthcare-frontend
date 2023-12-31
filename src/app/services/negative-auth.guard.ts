import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';
@Injectable({
  providedIn: 'root',
})
export class NegativeAuthGuard implements CanActivate {
  isLoggedIn = false;
  constructor(private sharedService: SharedService, private router: Router) {
    this.sharedService.loginStatus$.subscribe((isLoggedIn: boolean) => {
      // Handle the login status value
      this.isLoggedIn = isLoggedIn;
      // //console.log('Login status:', isLoggedIn);
    });
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.isLoggedIn) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }
}
