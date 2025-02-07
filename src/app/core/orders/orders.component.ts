import { Component } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';

import { PrimeNgModule } from '../module/prime-ng/prime-ng.module';
@Component({
  selector: 'app-orders',
  imports: [CommonModule, PrimeNgModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  public tokenDetails: any;
  public orders: any;
  public products:any;
  constructor(private service: CommonService) {
    this.tokenDetails = sessionStorage.getItem('token');
    this.fetchOrders();
  }
  fetchOrders(): void {
    let token: any = JSON.parse(atob(this.tokenDetails.split('.')[1]));
    this.service.get(`order/user/${token.jti}`).subscribe(
      (res: any) => {
        this.orders = res; // Assign the fetched orders
        this.products = res;
        console.log('Orders fetched successfully:', this.orders);
      },
      (error) => {
        console.error('Error fetching orders:', error);
      
      }
    );
  }
  getImageSrc(imageBase64: string): string {
    return `data:image/png;base64,${imageBase64}`;
  }
}
