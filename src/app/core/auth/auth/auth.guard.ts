

import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";


@Injectable({
  providedIn: 'root',
})
export class authGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      console.log("AuthGuard: Token found, access granted.");
      return true;
    } else {
      console.warn("AuthGuard: No token found, redirecting to login.");
      this.router.navigate(['/login']);
      return false;
    }
}
}