import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  formValid: boolean = true;
  signInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  httpClient = inject(HttpClient);
  router = inject(Router);
  login() {
    console.log('button clicked');
    console.log(this.signInForm.valid);
    if (!this.signInForm.valid) {
      this.formValid = false;
    }
    const loginData = this.signInForm.value;
    console.log(loginData);
    this.httpClient
      .post('http://localhost:3000/api/user/login', loginData)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          localStorage.setItem('username', response.username);
          localStorage.setItem('token', response.token);
          this.router.navigate(['app']);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  formReseter() {
    this.formValid = true;
  }
}
