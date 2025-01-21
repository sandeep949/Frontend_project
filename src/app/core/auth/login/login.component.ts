import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  public profileForm!: FormGroup;
  constructor(public service:CommonService,private router: Router) { }
  ngOnInit() {
    this.profileForm = this.addForm();
  }
  addForm() {
    return this.formBuilder.group({
      username: [''],
      password: [''],
    });
  }
  submit() {
    console.log(this.profileForm?.value)
    this.service.post(this.profileForm.value,"auth/login").subscribe({
      next: (res: any) => {
        console.log("Response received:", res);

        // Store the access token
        localStorage.setItem('token', res.access_token);

        // Optionally store the refresh token (if needed)
        localStorage.setItem('refresh_token', res.refresh_token);

        // Reset the form and navigate to the dashboard
        this.profileForm.reset();
        this.router.navigate(['/user-dashboard']);
      }
    }
    )
  }
}
