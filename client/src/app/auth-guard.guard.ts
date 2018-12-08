import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  ActivatedRoute
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  isLoggedIn: boolean;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const res = this.userService.isLoggedIn();
    if (res) {
      const direction = localStorage.getItem('router');
      if (!direction) this.router.navigateByUrl('/recommendations');
      localStorage.setItem('router', 'free');
      this.isLoggedIn = true;
    } else {
      this.router.navigateByUrl('/login');
      this.isLoggedIn = false;
    }
    return this.isLoggedIn;
  }
}
