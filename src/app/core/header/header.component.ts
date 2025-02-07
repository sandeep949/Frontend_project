import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
[x: string]: any;
public tokenDetails: any;
public orders :any;
constructor(private service: CommonService, private router:Router) {
  this.tokenDetails = sessionStorage.getItem('token');
}
  public isLogged = false;
  ngOnInit(): void {
      this.isLogged = !!this.service.returnToken();
  }
// fetchOrders(): void {
//   let token: any = JSON.parse(atob(this.tokenDetails.split('.')[1]));
//   this.service.get(`order/${token.jti}`).subscribe(
//     (res: any) => {
//       this.orders = res; // Assign the fetched orders
//       console.log('Orders fetched successfully:', this.orders);
//     },
//     (error) => {
//       console.error('Error fetching orders:', error);
//       alert('Failed to load orders. Please try again later.');
//     }
//   );
// }


logout(): void{
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('refresh_token');

  this.router.navigate(['/login']);
}

}
