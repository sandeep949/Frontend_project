import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { CommonService } from '../../../services/common.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-dashboard',
  standalone: true, // If this is a standalone component
  imports: [ FormsModule,CommonModule], // Include CommonModule for *ngIf and *ngFor
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'], // Corrected property name
})
export class UserDashboardComponent implements OnInit {
  products: any[] = []; // To store fetched products
  searchQuery: string = ''; // For the search input
  isLoading: boolean = false;

  constructor(private service: CommonService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts(); // Load products on initialization
  }

  // Fetch products using the getProd method
  loadProducts() {
    this.service.get("products").subscribe(
      (res) => {
        this.products = res.map((product: any) => ({
          ...product,
          price: product.price || 0, // Ensure price defaults to 0 if missing
        }));
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  

  // // Handle "View Details" button click
  
  viewProductDetails(product: any) {
    this.router.navigate(['/product-details', product.id]);
  }
  searchProducts() {
    if (this.searchQuery.trim() === '') {
      this.loadProducts(); // Load all products if the search query is empty
      return;
    }
  
    const encodedQuery = encodeURIComponent(this.searchQuery.trim()); // Encode the query to handle spaces and special characters
    // const url = `http://localhost:8084/search/products?name=${encodedQuery}`; // Use 'name' as the query parameter
  
    this.service.get(`search/products?name=${encodedQuery}`).subscribe(
      (res) => {
        this.products = res.map((product: any) => ({
          ...product,
          price: product.price || 0 // Default price to 0 if not available
        }));
      },
      (error) => {
        console.error('Error searching for products:', error);
      }
    );
  }
  
}
