import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';
import { async } from 'rxjs';

interface tokenBody{
  sub: String,
  jti: String,
  iat: String,
  exp: String
}

@Component({
  selector: 'app-cart',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  products: any[] = []; // To store the fetched cart products
  public tokenDetails: any;
  constructor(private service: CommonService) {}

  ngOnInit(): void {
    // Retrieve userId from local storage
    this.tokenDetails = localStorage.getItem('token'); // Assuming userId is stored during login
    this.fetchCartItems();
  }

  // Fetch the cart items by userId from the API
  fetchCartItems(): void {
    let token:any = JSON.parse(atob(this.tokenDetails.split('.')[1]));
    console.log(token)
    this.service.get(`cart/${token.jti}`).subscribe(
      (res: any) => {
        this.products = res.items; // Assign the fetched cart items
        console.log('Cart items fetched successfully:', this.products);
      },
      (error) => {
        console.error('Error fetching cart items:', error);
        //alert('Failed to load cart items. Please try again later.');
      }
    );
  }
}
