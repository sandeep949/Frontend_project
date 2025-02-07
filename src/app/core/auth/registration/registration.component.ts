import { Component, OnInit, inject } from "@angular/core";
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup } from "@angular/forms";
import { CommonService } from "../../../services/common.service";
import { Router } from '@angular/router';




@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
  
})
export class RegistrationComponent implements OnInit{
  private formBuilder = inject(FormBuilder);
  public profileForm!: FormGroup;
  constructor(public service:CommonService, private router: Router) { }
  ngOnInit() {
    this.profileForm = this.addForm();
  }
  addForm() {
    return this.formBuilder.group({
      firstName: [''],
      password: [''],
      lastName: [''],
      role: [''],
      username : ['']
    
    });
  }
  
  submit() {
    // Check if the form is valid
    if (this.profileForm.valid) {
      console.log("Submitting form data:", this.profileForm.value);
  
      // Make the API request
      this.service.post(this.profileForm.value, "auth/register").subscribe(
        (res: any) => {
          sessionStorage.setItem('token', res.token); // Save authentication token
          sessionStorage.setItem('refresh_token', res.refresh_token);
          // Reset the form and navigate to the dashboard
          this.profileForm.reset();
          this.router.navigate(['/user-dashboard']);
        },
        (err) => {
          console.error("Error occurred during registration:", err);
          // Optionally, display an error message to the user
          alert("Registration failed. Please try again.");
        }
      );
    } else {
      console.error("Form is invalid:", this.profileForm.errors);
      alert("Please fill out all required fields correctly.");
    }
  }
  


  login(){
    this.router.navigate(["/login"]);
  }

  

}
