import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { registerLocaleData } from '@angular/common';
import { RegistrationComponent } from './core/auth/registration/registration.component';
import { UserDashboardComponent } from './core/dashbord/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './core/dashbord/admin-dashboard/admin-dashboard.component';
import { ProductDetailsComponent } from './core/product-details/product-details.component';
import { CartComponent } from './core/cart/cart.component';

export const routes: Routes = [
    {path:"",pathMatch:"full",redirectTo:"login"},
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'register',
    component: RegistrationComponent,
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
  },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  {
    path: 'cart',
    component: CartComponent,
  },
];
