import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  product: any = null; // To store the fetched product details
  isLoading: boolean = true;
  public tokenDetails: any;
  constructor(private route: ActivatedRoute, private service: CommonService, private router: Router) {}

  ngOnInit(): void {
    // Fetch the product ID from the route parameters
    this.tokenDetails = localStorage.getItem('token'); 
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.fetchProductDetails(productId);
    }
  }

  // Fetch product details by ID
  fetchProductDetails(productId: string) {
    this.service.get(`products/${productId}`).subscribe(
      (res) => {
        this.product = res; // Assign the fetched product to the product variable
        this.isLoading = false; // Stop the loading spinner
      },
      (error) => {
        console.error('Error fetching product details:', error);
        this.isLoading = false; // Stop the loading spinner even on error
      }
    );
  }

  addToCart(product: any) {
    let token:any = JSON.parse(atob(this.tokenDetails.split('.')[1]));
    console.log(token.jti)
    const endpoint = 'cart'; // The relative endpoint for the cart API
    const body = { productId: product.id, quantity: 1, userId: token.jti, price: product.price }; // The request payload
  
    this.service.post<any>(body, `cart/${token.jti}`).subscribe(
      (res) => {
        console.log('Product added to cart successfully:', res); // Debugging log
        alert(`${product.title} has been added to the cart.`); // Notify the user
      },
      (error) => {
        console.error('Error adding product to cart:', error); // Handle errors
        alert('Failed to add product to the cart. Please try again.');
      }
    );
  }
  
  }
  
  
