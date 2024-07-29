import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '@app/Services/auth.service';
import { Observable, map, catchError, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let userRole = this.authService.getRole();
    // if(userRole== null|| userRole== undefined)
    //   userRole=this.authService.
    console.log(`role: ${userRole}`);
    
    const roles = route.data['roles'] as Array<number>;
    if (roles && roles.includes(userRole!)) {
      return true;
    } else {
      this.router.navigate(['home']);
      return false;
    }
  }
}