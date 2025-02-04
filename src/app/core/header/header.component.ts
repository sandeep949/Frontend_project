import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
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
constructor(private service: CommonService) {
  this.tokenDetails = localStorage.getItem('token');
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
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');

  this['router'].navigate(['/login']);
}

}
