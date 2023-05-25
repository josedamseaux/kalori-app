import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, from, map } from 'rxjs';
import { AuthService } from '../services/auth.service'; 
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return from(this.authService.getCurrentUser()).pipe(
      map(user => {
        console.log(user);
        if (user) {
          console.log('User is authenticated.');
          return true;
        } else {
          console.log('User is not authenticated. Redirecting to login...');
          this.router.navigateByUrl('/login');
          return false;
        }
      })
    );
  }
  
}