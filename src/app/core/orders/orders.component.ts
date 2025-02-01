import { Component } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  public tokenDetails: any;
public orders :any;
constructor(private service: CommonService) {
  this.tokenDetails = localStorage.getItem('token');
  this.fetchOrders();
}

  fetchOrders(): void {
    let token: any = JSON.parse(atob(this.tokenDetails.split('.')[1]));
    this.service.get(`order/${token.jti}`).subscribe(
      (res: any) => {
        this.orders = res; // Assign the fetched orders
        console.log(this.orders)
        console.log('Orders fetched successfully:', this.orders);
      },
      (error) => {
        console.error('Error fetching orders:', error);
        alert('Failed to load orders. Please try again later.');
      }
    );
  }

}
