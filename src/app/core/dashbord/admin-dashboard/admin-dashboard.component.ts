// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CommonService } from '../../../services/common.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-admin-dashboard',
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './admin-dashboard.component.html',
//   styleUrl: './admin-dashboard.component.scss'
// })
// // export class AdminDashboardComponent {
// //   productForm!: FormGroup; // Reactive form
// //   categories: string[] = ['Electronics', 'Clothing', 'Books', 'Home Appliances'];
  
//   export class AdminDashboardComponent implements OnInit {
//     productForm!: FormGroup; // Reactive form
//     products: any[] = []; // To store products fetched based on user ID
//     categories: string[] = ['Electronics', 'Clothing', 'Books', 'Home Appliances'];// Example categories

//   constructor(private fb: FormBuilder, private commonService: CommonService) {}

//   ngOnInit(): void {
//     // Initialize the form with fields matching the JSON structure
//     this.productForm = this.fb.group({
//       userId: [0, [Validators.required, Validators.min(1)]], // Ensure User ID is required
//       name: ['', Validators.required],
//       description: ['', Validators.required],
//       price: [0, [Validators.required, Validators.min(1)]],
//       quantity: [0, [Validators.required, Validators.min(1)]],
//       category: ['', Validators.required],
//     });
//   }

//   onSubmit(): void {
//     if (this.productForm.valid) {
//       const productData = this.productForm.value;

//       // Call the service to store the product
//       this.commonService.post(productData,"products").subscribe(
//         (response) => {
//           console.log('Product added successfully:', response);
//           alert('Product added successfully!');
//           this.productForm.reset(); // Reset the form after successful submission
//         },
//         (error) => {
//           console.error('Error adding product:', error);
//           alert('Failed to add product. Please try again.');
//         }
//       );
//     } else {
//       console.error('Form is invalid');
//     }
//   }


  
  
// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';
import { Observable, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
[x: string]: any;
  productForm!: FormGroup; // Reactive form
  products: any[] = []; // To store products fetched based on user ID
  categories: string[] = ['Electronics', 'Clothing', 'Books', 'Home Appliances']; // Example categories
  selectedImage: File | null = null; // Store the selected image file
  getFormValidationErrors(): any {
    const errors: any[] = [];
    Object.keys(this.productForm.controls).forEach(key => {
      const controlErrors = this.productForm.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(errorKey => {
          errors.push({ field: key, error: errorKey, value: controlErrors[errorKey] });
        });
      }
    });
    return errors;
  }
  

  constructor(private service: CommonService ,private fb: FormBuilder, private commonService: CommonService) {}

  ngOnInit(): void {
    // Initialize the form with fields matching the JSON structure
    this.productForm = this.fb.group({
      //userId: [0, [Validators.required, Validators.min(1)]], // Ensure User ID is required
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      image: [null, Validators.required], // Add image control
    });
    
  }
public blob;
  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
   
    this.selectedImage = input.files[0];
    
      const reader = new FileReader();
      reader.readAsArrayBuffer(this.selectedImage);

      reader.onload = () => {
        const blob = new Blob([reader.result as ArrayBuffer], {
          type: this.selectedImage!.type,
        });
        console.log(blob)
        this.blob = blob;


        
      };
    
  }
  base64Output : string;

  onFileSelected(event) {
    this.convertFile(event.target.files[0]).subscribe(base64 => {
      this.base64Output = base64;
    });
  }

  convertFile(file : File) : Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }
  onSubmit(): void {
    
    
    console.log(this.base64Output);
    let obj = {
      
        //"userId": this.productForm.value.userId,
        "name": this.productForm.value.name,
        "description": this.productForm.value.description,
        "price": this.productForm.value.price,
        "quantity": this.productForm.value.quantity,
        "category": this.productForm.value.category,
        "imageData": this.base64Output
    
    }
   
  
    // Call the service
    this.commonService.post(obj, 'products').subscribe(
      (response) => {
        console.log('Product added successfully:', response);
        // alert('Product added successfully!');
        this.productForm.reset();
        this.selectedImage = null;
      },
      (error) => {
        console.error('Error adding product:', error);
        // alert('Failed to add product. Please try again.');
      }
    );
  }
  fetched: boolean = false;
  fetchProducts(): void {
    // Retrieve the token from sessionStorage
    const token = sessionStorage.getItem('token');
  
    if (!token) {
      console.error('Token not found in sessionStorage');
      return;
    }
  
    try {
      // Decode the JWT Token to get the userId
      const tokenPayload: any = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.jti; // Adjust based on how `userId` is stored in the token
  
      if (!userId) {
        console.error('User ID not found in token');
        alert('Invalid token. Please log in again.');
        return;
      }
  
      // Make API call to fetch products by userId
      this.service.get(`products/user/${userId}`).subscribe(
        (res: any) => {
          this.products = res;
          this.fetched = true; // Assign fetched products
          console.log('Products fetched successfully:', this.products);
        },
        (error) => {
          console.error('Error fetching products:', error);
        
        }
      );
    } catch (error) {
      console.error('Error decoding token:', error);
      
    }
  }

  // 
  removeProduct(productId: string): void {
    if (!confirm('Are you sure you want to reduce quantity or remove this product?')) {
      return;
    }
  
    this.service.delete(`products/${productId}`).subscribe(
      (updatedProducts: any) => {
        console.log(`Product ${productId} quantity updated successfully`);
        this.products = updatedProducts; // ✅ Update UI with new DB state
        alert('Product quantity updated successfully!');
      },
      (error) => {
        console.error('Error updating/removing product:', error);
        alert('Failed to update product. Please try again.');
      }
    );
  }
  
  
  
  
}




