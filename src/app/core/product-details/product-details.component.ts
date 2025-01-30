import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { Token } from '@angular/compiler';

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
  statusMessage: string;
  cartItems: any[] = [];
  constructor(private route: ActivatedRoute, private service: CommonService, private router: Router) {}

  ngOnInit(): void {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('Token not found. Redirecting to login.');
    this.router.navigate(['/login']);
    return;
  }

  try {
    // Assign token details for reuse
    this.tokenDetails = token; 
    console.log('Token successfully retrieved and assigned:', this.tokenDetails);
  } catch (error) {
    console.error('Invalid token. Redirecting to login.', error);
   
    this.router.navigate(['/login']);
    return;
  }

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
    const endpoint = 'cart';
    this.statusMessage = ''; // The relative endpoint for the cart API
    const body = { productId: product.id, quantity: 1, userId: token.jti, price: product.price }; // The request payload
  
    this.service.post<any>(body, `cart/${token.jti}`).subscribe(
      (res) => {
        console.log('Product added to cart successfully:', res);
        this.statusMessage = `${product.name} has been added to your cart.`;
        
        
      },
      (error) => {
        console.error('Error adding product to cart:', error); // Handle errors
        
      }
    );
  }
  goToCart() {
    this.router.navigate(['/cart']); // Navigate to the cart component
  }
  
  
  
  }
  
  
