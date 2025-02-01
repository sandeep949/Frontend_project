import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  products: any[] = [];
  orders: any[] = []; // To store the fetched cart products
  public tokenDetails: any;
  statusMessage: string;
  placedOrder: any;
  isOrderPlaced: boolean = false ;
isLoading: any;
  constructor(private service: CommonService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Retrieve userId from local storage
    this.tokenDetails = localStorage.getItem('token'); // Assuming userId is stored during login
    this.fetchCartItems();
  }
public totalPrice = 0;
  // Fetch the cart items by userId from the API
  fetchCartItems(): void {
    let token: any = JSON.parse(atob(this.tokenDetails.split('.')[1]));
    console.log(token);

    this.service.get(`cart/${token.jti}`).subscribe(
      (res: any) => {
        if (!res.items || res.items.length === 0) {
          console.warn("Cart is empty or response format is incorrect.");
          this.products = [];
          return;
        }
        
        this.products = res.items.map((item: any) => {
          // ✅ Ensure `product` exists before accessing `imageData`
          if (item.product && item.product.imageData) {
            
          
            item.product.imageSrc = `data:image/png;base64,${item.product.imageData}`;
          } else {
            console.warn(`No image data for product:`, item);
            item.product = item.product || {}; // Ensure product exists
            item.product.imageSrc = 'assets/default-image.png'; // Use a placeholder image
          }
          console.log(item.price)
          this.totalPrice += +item.price
          return item;
        });

        console.log('Cart items fetched successfully:', this.products);
      },
      (error) => {
        console.error('Error fetching cart items:', error);
      }
    );
}


onImageError(product: any) {
  console.error(`Error loading image for product: ${product.name}`);
  product.imageSrc = 'assets/default-image.png'; // Use a placeholder image
}

  removeFromCart(productId: string): void {
    // Decode the token to extract userId
    let token: any = JSON.parse(atob(this.tokenDetails.split('.')[1]));
    const userId = token.jti; // Extract userId from the token
  
    // Construct the endpoint with the userId and productId
    const endpoint = `cart/remove/${userId}/${productId}`;
    // Make the DELETE API call
    this.service.delete(endpoint).subscribe(
      () => {
        console.log('Item deleted successfully:', productId);
  
        // Remove the deleted item from the products array
        this.products = this.products.filter((item) => item.productId !== productId);
  
        // Show a success message
        this.statusMessage = 'Item removed from the cart!';
        this.cdr.detectChanges();
        this.fetchCartItems();
      },
      (error) => {
        console.error('Error deleting item from cart:', error);
  
        // Show an error message
        this.statusMessage = 'Failed to remove item. Please try again.';
      }
    );
  }
  

  placeOrder(): void {
    // Decode the token to extract userId
    let token: any = JSON.parse(atob(this.tokenDetails.split('.')[1]));
    const userId = token.jti; // Extract userId from the token
  
    // Prepare the order payload
    const orderPayload = {
      items: this.products.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };
  
    // Construct the endpoint with the userId in the path
    const endpoint = `order/place/${userId}`;
  
    // Make the API call
    this.service.post<any>(orderPayload, endpoint).subscribe(
      (res) => {
        console.log('Order placed successfully:', res);
  
        // Clear the cart after successful order placement
        this.products = [];
  
        // Store the order details to display in the UI
        this.placedOrder = res;
  
        // Show a success message
        this.statusMessage = 'Order placed successfully!';
        this.isOrderPlaced = true;
        // this.fetchOrders();
        this.cdr.detectChanges();
        console.log('isOrderPlaced:', this.isOrderPlaced);

        
       
      },
      (error) => {
        console.error('Error placing order:', error);
  
        // Show an error message
        this.statusMessage = 'Failed to place order. Please try again.';
      }
    );
  }
  
  

  // Fetch all orders for the current user
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
}
