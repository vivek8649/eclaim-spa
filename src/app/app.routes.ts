import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)},
    {path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)},
    {path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)},
    {path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)},
];
