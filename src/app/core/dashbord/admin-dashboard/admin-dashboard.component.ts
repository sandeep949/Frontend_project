import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
// export class AdminDashboardComponent {
//   productForm!: FormGroup; // Reactive form
//   categories: string[] = ['Electronics', 'Clothing', 'Books', 'Home Appliances'];
  
  export class AdminDashboardComponent implements OnInit {
    productForm!: FormGroup; // Reactive form
    products: any[] = []; // To store products fetched based on user ID
    categories: string[] = ['Electronics', 'Clothing', 'Books', 'Home Appliances'];// Example categories

  constructor(private fb: FormBuilder, private commonService: CommonService) {}

  ngOnInit(): void {
    // Initialize the form with fields matching the JSON structure
    this.productForm = this.fb.group({
      userId: [0, [Validators.required, Validators.min(1)]], // Ensure User ID is required
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;

      // Call the service to store the product
      this.commonService.post(productData,"products").subscribe(
        (response) => {
          console.log('Product added successfully:', response);
          alert('Product added successfully!');
          this.productForm.reset(); // Reset the form after successful submission
        },
        (error) => {
          console.error('Error adding product:', error);
          alert('Failed to add product. Please try again.');
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }


  // Fetch products by user ID
  // fetchProductsByUsername(): void {
  //   const username = this.productForm.get('userId')?.value; // Assuming you renamed the field to accept username
  
  //   if (username && username.trim().length > 0) {
  //     this.commonService.get(`products/user?username=${encodeURIComponent(username)}`).subscribe(
  //       (response: any) => {
  //         this.products = response; // Assign fetched products to the array
  //         console.log('Products fetched successfully:', this.products);
  //       },
  //       (error) => {
  //         console.error('Error fetching products:', error);
  //       }
  //     );
  //   } else {
  //     console.error('Invalid Username for fetching products');
  //   }
  // }
  
}



