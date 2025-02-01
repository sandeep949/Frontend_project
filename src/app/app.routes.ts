import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { registerLocaleData } from '@angular/common';
import { RegistrationComponent } from './core/auth/registration/registration.component';
import { UserDashboardComponent } from './core/dashbord/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './core/dashbord/admin-dashboard/admin-dashboard.component';
import { ProductDetailsComponent } from './core/product-details/product-details.component';
import { CartComponent } from './core/cart/cart.component';
import { authGuard } from './core/auth/auth/auth.guard';
import { OrdersComponent } from './core/orders/orders.component';


//     {path:"",pathMatch:"full",redirectTo:"login"},
//   {
//     path: 'login',
//     component: LoginComponent,
//   },

//   {
//     path: 'register',
//     component: RegistrationComponent,
//   },
//   {
//     path: 'user-dashboard',
//     component: UserDashboardComponent,
//   },
//   {
//     path: 'admin-dashboard',
//     component: AdminDashboardComponent,
//   },
//   { path: 'product-details/:id', component: ProductDetailsComponent },
//   {
//     path: 'cart',
//     component: CartComponent,
//   },
// ];
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  {path:'admin-dashboard',component:AdminDashboardComponent, canActivate:[authGuard]},
  { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [authGuard] },
  { path: 'product/:id', component: ProductDetailsComponent, canActivate: [authGuard] },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: '/login' }, // Wildcard route for invalid paths
];
