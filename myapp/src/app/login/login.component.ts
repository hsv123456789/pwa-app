import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient ,  HttpErrorResponse} from '@angular/common/http';
import { IndexedDbService } from '../services/indexed-dbservice.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  formValid: boolean = true;
  errorMessage : string = '';
  signInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  httpClient = inject(HttpClient);
  router = inject(Router);
  indexedDbService = inject(IndexedDbService);
  login() {
    console.log('button clicked');
    console.log(this.signInForm.valid);
    if (!this.signInForm.valid) {
      this.formValid = false;
    }
    const loginData = this.signInForm.value;
    console.log(loginData);

    const apiBaseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api/user'
    : 'http://192.168.200.148:3000/api/user';

    this.httpClient
      //.post(`${apiBaseUrl}/login`, loginData)
      .post('http://localhost:3000/api/user/login', loginData)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          localStorage.setItem('username', response.username);
          localStorage.setItem('token', response.token);
          this.indexedDbService.setAuthItem('username', response.username);
          this.indexedDbService.setAuthItem('token', response.token);          
          this.router.navigate(['app']);
        },
        error: (error :  HttpErrorResponse) => {
          console.error('Login error:', error);
          if (error.status === 400) {
            this.errorMessage = 'Invalid email or password';
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again.';
          }
        },
      });
  }

  formReseter() {
    this.formValid = true;
    this.errorMessage = ''
  }
}