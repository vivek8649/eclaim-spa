import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  error: string = '';

  constructor(private fb: FormBuilder
  ) {
  }
   userClaims = [
    { id: 'C-1001', type: 'Health', status: 'Approved', submittedOn: new Date() },
    { id: 'C-1002', type: 'Travel', status: 'Pending', submittedOn: new Date() },
    { id: 'C-1003', type: 'Property', status: 'Rejected', submittedOn: new Date() },
  ];

  createNewClaim() {
    // Open a form / modal / navigate to a new-claim page
    console.log('Create new claim clicked');
  }
}