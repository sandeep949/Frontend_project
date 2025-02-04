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
  cdr: any;
  constructor(private service: CommonService) {}

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


calculateTotalPrice() {
  this.totalPrice = this.products.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
}

updateQuantity(item: any, event: Event): void {
  const newQuantity = Number((event.target as HTMLSelectElement).value);
  
  if (newQuantity < 1) return; // Prevent invalid values

  let token: any = JSON.parse(atob(this.tokenDetails.split('.')[1]));
  const userId = token.jti;

  // API endpoint to update the quantity
  const endpoint = `cart/update/${userId}/${item.productId}`;

  // Request payload
  const payload = {
    quantity: Number(newQuantity),
  };

  this.service.put(payload,endpoint).subscribe(
    () => {
      console.log(`Quantity updated for product ${item.productId} to ${newQuantity}`);
      item.quantity = newQuantity;
      this.calculateTotalPrice();
     
    },
    (error) => {
      console.error('Error updating quantity:', error);
    }
  );
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
    let token: any = JSON.parse(atob(this.tokenDetails.split('.')[1]));
    const userId = token.jti;
  
    const orderPayload = {
      items: this.products.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalPrice: this.totalPrice, // ✅ Include total price in the order
      orderDate: new Date().toISOString(), // ✅ Store current date
    };
  
    const endpoint = `order/place/${userId}`;
  
    this.service.post<any>(orderPayload, endpoint).subscribe(
      (res) => {
        console.log('Order placed successfully:', res);
        
        // ✅ Store order details, including the date and total price
        this.placedOrder = {
          ...res,
          totalPrice: this.totalPrice, // ✅ Store total price in order details
          orderDate: new Date().toLocaleString(), // Format date for UI
        };
  
        this.products = [];
        this.totalPrice = 0; // Reset total price after placing an order
        this.statusMessage = 'Order placed successfully!';
        this.isOrderPlaced = true;
        this.cdr.detectChanges();
      },
      
      (error) => {
        console.error('Error placing order:', error);
        this.statusMessage = 'Failed to place order. Please try again.';
      }
    );
  }
  
}  