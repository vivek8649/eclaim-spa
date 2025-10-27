import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [RouterModule, CommonModule],
  standalone: true,
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav implements OnInit{
  public  email: string = '';
  public userLoggedIn: boolean = false;
  constructor(
    private loginService: LoginService,
    private router: Router
  ) {
  }
  ngOnInit(): void {
    this.loginService.userLoggedInSubject.subscribe(isLoggedIn => {
        this.userLoggedIn = isLoggedIn;
        this.email = isLoggedIn ? this.loginService.email: ''; 
    });

    this.userLoggedIn = this.loginService.token ? true : false;
    if(this.userLoggedIn ) {
        // User is already logged in, redirect to home or dashboard
        this.email = this.loginService.email;
        console.log('User already logged in from nav');
    }
  }

  public logout(event: any): void {
    if(event.target.value === 'logout') {
    
      this.loginService.logout().subscribe(() => {
      this.loginService.userLoggedInSubject.next(false);
      this.userLoggedIn = false;
        console.log('Logged out successfully');
        this.router.navigate(['/login']);
      });
    } 
  }
}
