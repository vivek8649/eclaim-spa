import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showError: boolean = false;

  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      policyId: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      reenterPassword: ['', Validators.required],
      role: ['User', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loginService.register(this.registerForm.value).subscribe({
        next: () => {
            this.router.navigate(['/login']);
        },
        error: (err) => {
            console.error('Registration failed:', err);
            this.showError = true;
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}