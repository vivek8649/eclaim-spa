import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: string = '';

  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    if(this.loginService.token) {
        // User is already logged in, redirect to home or dashboard
        console.log('User already logged in');
        this.router.navigate(['/home']);
    }
  }


  onSubmit() {
    if (this.loginForm.invalid) {
      this.error = 'Please enter both username and password.';
      return;
    }
    this.error = '';
    // Handle login logic here (e.g., call API)
    const { email, password } = this.loginForm.value;
    this.loginService.login(email, password).subscribe({
        next: (response) => {
            console.log('Login successful:', response);
            // Handle successful login (e.g., store token, navigate)
           this.router.navigate(['/home']);

        },
        error: (err) => {
            console.error('Login failed:', err);
            this.error = 'Login failed. Please check your credentials.';
        }
    });
    // Example: console.log(username, password);
  }
}