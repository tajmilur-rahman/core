import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardMiddleware implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): boolean|UrlTree {
      if (this.authService.isUserLoggedIn()) {
        return true;
      }

      this.router.navigate(['public', 'login'], {
        queryParams: {
          returnUrl: window.location.href,
          messageType: 'error',
          message: 'Please login to view this page',
        }
      });
      return false;
  }
}
